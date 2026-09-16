import { waitForLegacySession } from '../legacy/session-bridge.js?v=20260911.1';

const DRIVE_CHUNK_ALIGNMENT = 256 * 1024;
const DEFAULT_DRIVE_CHUNK_SIZE = 4 * 1024 * 1024;
const DEFAULT_DROPBOX_CHUNK_SIZE = 8 * 1024 * 1024;

function createAbortError() {
  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}

export class CloudUploadCoordinator {
  constructor(session) {
    this.session = session;
  }

  static async create() {
    const session = await waitForLegacySession();
    return new CloudUploadCoordinator(session);
  }

  ensureDriveClient() {
    if (!this.session.gdrive && typeof window.setupGoogleDriveUploader === 'function') {
      this.session.gdrive = window.setupGoogleDriveUploader();
    }
    return this.session.gdrive || null;
  }

	async ensureDropboxClient(token, options = {}) {
		let opts = options;
		if (typeof token === 'object' && token !== null && !Array.isArray(token)) {
			opts = token;
			token = undefined;
		}
		opts = opts || {};
		const forceReauth = Boolean(opts.forceReauth);
		if (typeof token === 'string' && token.trim().length) {
			token = token.trim();
		}
		const manualTokenProvided = typeof token === 'string' && token.length > 0;
		const previousClient = this.session.dbx || null;
		const oauthRecord =
			(this.session && this.session.dropboxOAuth) ||
			(typeof session !== 'undefined' ? session.dropboxOAuth : null) ||
			null;
		const oauthFresh = Boolean(
			oauthRecord && (!oauthRecord.expiresAt || Date.now() < oauthRecord.expiresAt),
		);
		if (!forceReauth && !manualTokenProvided && this.session.dbx && oauthFresh) {
			return this.session.dbx;
		}
	if (typeof window.setupDropbox !== 'function') {
		return this.session.dbx || null;
	}
	try {
		const client = await window.setupDropbox(token, opts);
		if (client) {
			this.session.dbx = client;
			return client;
		}
	} catch (error) {
		if (forceReauth && previousClient && !this.session.dbx) {
			this.session.dbx = previousClient;
		}
		throw error;
	}
	if (!this.session.dbx && previousClient) {
		this.session.dbx = previousClient;
	}
	return this.session.dbx || null;
}

  startDriveUpload(filename, sessionUri, options = {}) {
    if (typeof window.setupGoogleDriveUploader !== 'function') {
      throw new Error('Google Drive uploader is not available in this build.');
    }
    return window.setupGoogleDriveUploader(filename, sessionUri, { ...options, interactive: false });
  }

  createDriveChunkWriter(filename, sessionUri, options = {}) {
    const uploader = this.startDriveUpload(filename, sessionUri, options);
    if (typeof uploader?.addChunk !== 'function' || typeof uploader?.finalize !== 'function') {
      throw new Error('Drive writer does not support upload completion.');
    }
    return {
      addChunk: (chunk) => uploader?.addChunk?.(chunk),
      finalize: () => uploader?.finalize?.(),
      uploader,
    };
  }

  createDropboxChunkWriter(filename) {
    if (typeof window.streamVideoToDropbox !== 'function') {
      throw new Error('Dropbox uploader is not available in this build.');
    }
    return window.streamVideoToDropbox(filename);
  }

  hasDriveAccess() {
    return Boolean(this.session.gdrive && this.session.gdrive.accessToken);
  }

  hasDropboxAccess() {
    return Boolean(this.session.dbx);
  }

  async uploadBlob(blob, options = {}) {
    if (!blob) {
      throw new Error('uploadBlob expects a Blob.');
    }
    const {
      filename,
      drive = true,
      dropbox = true,
      onProgress,
      signal,
      driveChunkSize = DEFAULT_DRIVE_CHUNK_SIZE,
      dropboxChunkSize = DEFAULT_DROPBOX_CHUNK_SIZE,
    } = options;

    const results = {};

    if (drive) {
      try {
        results.drive = await this.uploadBlobToDrive(blob, {
          filename,
          onProgress,
          signal,
          chunkSize: driveChunkSize,
        });
      } catch (error) {
        results.drive = { status: 'error', service: 'drive', error };
      }
    } else {
      results.drive = { status: 'skipped', service: 'drive', reason: 'disabled' };
    }

    if (dropbox) {
      try {
        results.dropbox = await this.uploadBlobToDropbox(blob, {
          filename,
          onProgress,
          signal,
          chunkSize: dropboxChunkSize,
        });
      } catch (error) {
        results.dropbox = { status: 'error', service: 'dropbox', error };
      }
    } else {
      results.dropbox = { status: 'skipped', service: 'dropbox', reason: 'disabled' };
    }

    return results;
  }

  async uploadBlobToDrive(blob, { filename, onProgress, signal, chunkSize = DEFAULT_DRIVE_CHUNK_SIZE } = {}) {
    if (signal?.aborted) throw createAbortError();
    const client = this.ensureDriveClient();
    if (!client) {
      return { status: 'skipped', service: 'drive', reason: 'unavailable' };
    }
    if (signal?.aborted) {
      throw createAbortError();
    }
    const name = filename || `recording-${Date.now()}.wav`;
    let writer;
    try {
      writer = this.createDriveChunkWriter(name, this.session.gdrive?.sessionUri, {
        signal,
        onProgress: uploaded => {
          if (typeof onProgress === 'function') onProgress({ service: 'drive', uploaded, total: blob.size, percentage: blob.size ? Math.min(100, Math.round(uploaded / blob.size * 100)) : 0 });
        },
      });
    } catch (error) {
      return { status: 'error', service: 'drive', error };
    }
    if (!writer?.addChunk) {
      return { status: 'error', service: 'drive', error: new Error('Drive writer unavailable') };
    }
    const total = blob.size || 0;
    const alignment = DRIVE_CHUNK_ALIGNMENT;
    const adjustedChunkSize = Math.max(alignment, Math.floor(chunkSize / alignment) * alignment);
    let uploaded = 0;
    for (let offset = 0; offset < total; offset += adjustedChunkSize) {
      if (signal?.aborted) {
        throw createAbortError();
      }
      const chunk = blob.slice(offset, Math.min(total, offset + adjustedChunkSize), blob.type || 'application/octet-stream');
      writer.addChunk(chunk);
      uploaded += chunk.size;
    }
    if (signal?.aborted) throw createAbortError();
    writer.addChunk(false);
    if (typeof writer.finalize === 'function') {
      try {
        await writer.finalize();
      } catch (error) {
        return { status: 'error', service: 'drive', error };
      }
    }
    if (signal?.aborted) throw createAbortError();
    return { status: 'uploaded', service: 'drive', filename: name, bytes: uploaded };
  }

  async uploadBlobToDropbox(blob, { filename, onProgress, signal, chunkSize = DEFAULT_DROPBOX_CHUNK_SIZE } = {}) {
    if (signal?.aborted) throw createAbortError();
    const client = await this.ensureDropboxClient();
    if (!client) {
      return { status: 'skipped', service: 'dropbox', reason: 'unavailable' };
    }
    if (signal?.aborted) {
      throw createAbortError();
    }
    let writer;
    const name = filename || `recording-${Date.now()}.wav`;
    try {
      writer = await this.createDropboxChunkWriter(name);
    } catch (error) {
      return { status: 'error', service: 'dropbox', error };
    }
    if (signal?.aborted) throw createAbortError();
    if (typeof writer !== 'function') {
      return { status: 'error', service: 'dropbox', error: new Error('Dropbox writer unavailable') };
    }
    const total = blob.size || 0;
    let uploaded = 0;
    for (let offset = 0; offset < total; offset += chunkSize) {
      if (signal?.aborted) {
        throw createAbortError();
      }
      const chunk = blob.slice(offset, Math.min(total, offset + chunkSize), blob.type || 'application/octet-stream');
      await writer(chunk);
      if (signal?.aborted) throw createAbortError();
      uploaded += chunk.size;
      if (typeof onProgress === 'function') {
        onProgress({
          service: 'dropbox',
          uploaded,
          total,
          percentage: total ? Math.min(100, Math.round((uploaded / total) * 100)) : 0,
        });
      }
    }
    await writer(false);
    if (signal?.aborted) throw createAbortError();
    return { status: 'uploaded', service: 'dropbox', filename: name, bytes: uploaded };
  }
}
