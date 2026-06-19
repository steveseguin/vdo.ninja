import { YoutubePlugin } from './youtubePlugin.js';
import {
  createYouTubeLiveChat,
  YOUTUBE_LIVE_CHAT_EVENTS,
  YOUTUBE_LIVE_CHAT_STATUS
} from '../providers/youtube/liveChat.js';

function createLogger(plugin) {
  if (!plugin?.debug) {
    return null;
  }
  return {
    debug: (...args) => plugin.debugLog('[stream-core]', ...args),
    log: (...args) => plugin.debugLog('[stream-core]', ...args)
  };
}

export class YoutubeStreamingPlugin extends YoutubePlugin {
  constructor(options) {
    super({
      ...options,
      description: 'Connect directly to YouTube live chat using the Streaming API for lower latency updates.'
    });

    this.streamClient = null;
    this.streamClientDisposers = [];
  }

  stopListening() {
    super.stopListening();
    if (this.streamClient) {
      this.streamClient.stop({ suppressStatus: true });
    }
  }

  startListening() {
    if (this.state !== 'connected') {
      return;
    }

    if (!this.isTokenValid()) {
      this.log('YouTube token expired; streaming cannot start.');
      return;
    }

    if (!this.liveChatId) {
      this.log('Live chat ID missing; streaming cannot start.');
      return;
    }

    const client = this.ensureStreamClient();
    client.stop({ suppressStatus: true });
    client
      .start({
        chatId: this.liveChatId,
        token: this.token
      })
      .catch((error) => {
        if (this.state !== 'connected') {
          return;
        }
        this.reportError(error);
      });
  }

  ensureStreamClient() {
    if (this.streamClient) {
      return this.streamClient;
    }

    const client = createYouTubeLiveChat({
      mode: 'stream',
      logger: createLogger(this),
      tokenProvider: async () => this.token,
      chatIdResolver: async () => this.liveChatId,
      fetchImplementation: (...args) => fetch(...args),
      abortControllerFactory: () => new AbortController()
    });

    const disposers = [];

    disposers.push(
      client.on(YOUTUBE_LIVE_CHAT_EVENTS.STATUS, ({ status, meta }) => {
        if (status === YOUTUBE_LIVE_CHAT_STATUS.RUNNING) {
          if (this.state !== 'connected' && this.state !== 'idle' && this.state !== 'disabled') {
            this.setState('connected');
          }
          this.debugLog('YouTube streaming connected.', meta);
        }
        if (status === YOUTUBE_LIVE_CHAT_STATUS.ERROR && meta?.error) {
          this.debugLog('YouTube streaming reported an error state.', {
            message: meta.error?.message,
            code: meta.error?.code
          });
        }
        if (status === YOUTUBE_LIVE_CHAT_STATUS.IDLE) {
          this.debugLog('YouTube streaming idle.', meta);
        }
      })
    );

    disposers.push(
      client.on(YOUTUBE_LIVE_CHAT_EVENTS.ERROR, (error) => {
        if (this.state === 'idle' || this.state === 'disabled') {
          return;
        }
        if (error?.code === 'TOKEN_EXPIRED' || error?.status === 401) {
          this.reportError(error);
          return;
        }
        this.log(`YouTube streaming transport error: ${error?.message || 'unknown error'}`, {
          code: error?.code || null,
          status: error?.status || null
        }, { kind: 'error' });
      })
    );

    disposers.push(
      client.on(YOUTUBE_LIVE_CHAT_EVENTS.CHAT, async (chat) => {
        if (this.state !== 'connected' || !chat?.raw) {
          return;
        }
        try {
          await this.transformAndPublish(chat.raw, { transport: 'youtube_streaming_api' });
          const streamState = client.getState();
          this.nextPageToken = streamState?.pageToken || null;
        } catch (error) {
          this.debugLog('Failed to process YouTube streaming chat item', {
            error: error?.message || error,
            itemId: chat?.raw?.id
          });
        }
      })
    );

    this.streamClient = client;
    this.streamClientDisposers = disposers;
    return this.streamClient;
  }

  clearStreamClient() {
    if (!this.streamClient) {
      return;
    }
    try {
      this.streamClient.stop({ suppressStatus: true });
    } catch (error) {
      this.debugLog('Failed to stop stream client during cleanup', error);
    }
    for (const dispose of this.streamClientDisposers) {
      try {
        dispose();
      } catch (error) {
        this.debugLog('Failed to dispose stream client listener', error);
      }
    }
    this.streamClientDisposers = [];
    this.streamClient = null;
  }
}
