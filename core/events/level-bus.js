import { EventBus } from './event-bus.js?v=20260911.1';

export const LEVEL_EVENT = 'level';
export const CLIP_EVENT = 'clip';
export const SILENCE_EVENT = 'silence';

class LevelBus extends EventBus {
  publishLevel(payload) {
    this.emit(LEVEL_EVENT, payload);
    if (payload?.clipped) {
      this.emit(CLIP_EVENT, payload);
    }
    if (payload?.silent) {
      this.emit(SILENCE_EVENT, payload);
    }
  }
}

export const levelBus = new LevelBus();
