class EventBus {
  constructor() {
    this._events = new Map();
    this._onceEvents = new Map();
  }

  on(event, callback) {
    if (!this._events.has(event)) {
      this._events.set(event, new Set());
    }
    this._events.get(event).add(callback);
    return () => this.off(event, callback);
  }

  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off(event, callback) {
    if (this._events.has(event)) {
      this._events.get(event).delete(callback);
    }
  }

  emit(event, ...args) {
    if (this._events.has(event)) {
      this._events.get(event).forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`EventBus error in "${event}":`, error);
        }
      });
    }
  }

  clear(event) {
    if (event) {
      this._events.delete(event);
    } else {
      this._events.clear();
    }
  }

  hasListeners(event) {
    return this._events.has(event) && this._events.get(event).size > 0;
  }
}

export const EVENTS = {
  APP_READY: 'app:ready',
  THEME_CHANGE: 'theme:change',
  CATEGORY_CHANGE: 'category:change',
  TAG_CHANGE: 'tag:change',
  SEARCH: 'search:query',
  SORT: 'sort:change',
  SCRIPT_VIEW: 'script:view',
  SCRIPT_DOWNLOAD: 'script:download',
  FAVORITE_TOGGLE: 'favorite:toggle',
  MODAL_OPEN: 'modal:open',
  MODAL_CLOSE: 'modal:close',
  TOAST_SHOW: 'toast:show',
  ERROR: 'error:occurred'
};

export const eventBus = new EventBus();
export default eventBus;
