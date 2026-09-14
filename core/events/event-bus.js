export class EventBus extends EventTarget {
  emit(type, detail = {}) {
    const event = new CustomEvent(type, { detail });
    this.dispatchEvent(event);
  }

  on(type, callback, options) {
    const handler = (event) => callback(event.detail, event);
    this.addEventListener(type, handler, options);
    return () => this.removeEventListener(type, handler, options);
  }
}

export const createScopedBus = () => new EventBus();
