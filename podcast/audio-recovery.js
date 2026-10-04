// Keep ordered MediaRecorder chunks, as in Screen Recorder's recovery journal.
const DB_NAME = 'podcastStudio.audioRecovery';

export function openAudioRecoveryDatabase() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			const db = request.result;
			db.createObjectStore('sessions', { keyPath: 'id' });
			const chunks = db.createObjectStore('chunks', { keyPath: ['sessionId', 'trackKey', 'sequence'] });
			chunks.createIndex('session', 'sessionId');
			chunks.createIndex('track', ['sessionId', 'trackKey']);
		};
		request.onsuccess = () => {
			request.result.onversionchange = () => request.result.close();
			resolve(request.result);
		};
		request.onerror = () => reject(request.error);
	});
}

function transact(db, stores, mode, work) {
	return new Promise((resolve, reject) => {
		const tx = db.transaction(stores, mode);
		const request = work(tx);
		tx.oncomplete = () => resolve(request ? request.result : undefined);
		tx.onabort = tx.onerror = () => reject(tx.error || new Error('Audio recovery storage failed.'));
	});
}

export async function listAudioRecoverySessions() {
	const db = await openAudioRecoveryDatabase();
	try {
		const sessions = await transact(db, ['sessions'], 'readonly', tx => tx.objectStore('sessions').getAll());
		return sessions.filter(session => session.tracks.length).sort((a, b) => b.startedAt - a.startedAt);
	} finally {
		db.close();
	}
}

export async function loadRecoveryTrack(sessionId, track) {
	const db = await openAudioRecoveryDatabase();
	try {
		const chunks = await transact(db, ['chunks'], 'readonly', tx =>
			tx.objectStore('chunks').index('track').getAll([sessionId, track.key]));
		if (!chunks.length || chunks.some((chunk, index) => chunk.sequence !== index)) {
			throw new Error('Saved audio is missing pieces.');
		}
		return new Blob(chunks.map(chunk => chunk.blob), { type: track.mimeType });
	} finally {
		db.close();
	}
}

export async function clearAudioRecoverySession(id) {
	const clear = async () => {
		const db = await openAudioRecoveryDatabase();
		try {
			await transact(db, ['sessions', 'chunks'], 'readwrite', tx => {
				const sessions = tx.objectStore('sessions');
				const request = sessions.get(id);
				request.onsuccess = () => {
					// Without Web Locks, don't clear an unfinished take that is still receiving audio.
					if (!navigator.locks && request.result && !request.result.finished && Date.now() - request.result.updatedAt < 15000) {
						tx.abort();
						return;
					}
					sessions.delete(id);
					const cursor = tx.objectStore('chunks').index('session').openKeyCursor(IDBKeyRange.only(id));
					cursor.onsuccess = () => {
						if (!cursor.result) return;
						tx.objectStore('chunks').delete(cursor.result.primaryKey);
						cursor.result.continue();
					};
				};
			});
		} finally {
			db.close();
		}
	};
	if (!navigator.locks) return clear();
	return navigator.locks.request(`${DB_NAME}:${id}`, { ifAvailable: true }, lock => {
		if (!lock) throw new Error('This take is still recording in another tab. Stop it before clearing.');
		return clear();
	});
}

export class AudioRecoveryWriter {
	constructor({ id, roomName, startedAt, onError, onSaved }) {
		this.session = { id, roomName, startedAt, updatedAt: startedAt, tracks: [], markers: [], finished: false };
		this.failed = false;
		this.onError = onError;
		this.onSaved = onSaved;
		this.chain = this.open().catch(error => this.fail(error));
	}

	async open() {
		if (navigator.locks) {
			await new Promise((resolve, reject) => {
				navigator.locks.request(`${DB_NAME}:${this.session.id}`, () => new Promise(release => {
					this.release = release;
					resolve();
				})).catch(reject);
			});
		}
		this.db = await openAudioRecoveryDatabase();
	}

	fail(error) {
		this.failed = true;
		this.onError(error);
	}

	append(detail, markers) {
		if (this.failed || !detail.data.size) return;
		const markerSnapshot = markers.map(marker => ({ ...marker }));
		this.chain = this.chain.then(async () => {
			if (this.failed) return;
			let track = this.session.tracks.find(item => item.key === detail.recordingKey);
			if (!track) {
				track = {
					key: detail.recordingKey,
					label: detail.participant.label || detail.participant.streamID || detail.participant.uuid,
					channelIndex: detail.channelIndex,
					mimeType: detail.mimeType || detail.data.type,
					startOffsetSeconds: detail.startOffsetSeconds || 0,
					chunkCount: 0,
				};
				this.session.tracks.push(track);
			}
			const sequence = track.chunkCount++;
			track.durationSeconds = detail.durationSeconds;
			this.session.updatedAt = Date.now();
			this.session.markers = markerSnapshot;
			await transact(this.db, ['sessions', 'chunks'], 'readwrite', tx => {
				// Metadata and its audio commit together, including the final chunk at Stop.
				tx.objectStore('sessions').put(this.session);
				tx.objectStore('chunks').put({ sessionId: this.session.id, trackKey: track.key, sequence, blob: detail.data });
			});
			this.onSaved();
		}).catch(error => this.fail(error));
	}

	finish(markers) {
		this.chain = this.chain.then(async () => {
			if (this.failed || !this.session.tracks.length) return;
			this.session.finished = true;
			this.session.markers = markers;
			await transact(this.db, ['sessions'], 'readwrite', tx => tx.objectStore('sessions').put(this.session));
		}).catch(error => this.fail(error)).finally(() => {
			if (this.db) this.db.close();
			if (this.release) this.release();
		});
		return this.chain;
	}
}
