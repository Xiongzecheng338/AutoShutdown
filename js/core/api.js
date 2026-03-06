import { CONFIG } from './config.js';

class API {
  constructor() {
    this.baseUrl = null;
    this.endpoints = {
      scripts: '/api/scripts',
      categories: '/api/categories',
      search: '/api/search',
      favorites: '/api/favorites',
      history: '/api/history'
    };
  }

  setBaseUrl(url) {
    this.baseUrl = url;
  }

  async request(endpoint, options = {}) {
    if (!this.baseUrl) {
      console.warn('API base URL not configured. Running in offline mode.');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      return null;
    }
  }

  async getScripts() {
    return this.request(this.endpoints.scripts);
  }

  async getScriptById(id) {
    return this.request(`${this.endpoints.scripts}/${id}`);
  }

  async searchScripts(query) {
    return this.request(`${this.endpoints.search}?q=${encodeURIComponent(query)}`);
  }

  async getCategories() {
    return this.request(this.endpoints.categories);
  }

  async syncFavorites(favorites) {
    return this.request(this.endpoints.favorites, {
      method: 'POST',
      body: JSON.stringify({ favorites })
    });
  }

  async syncHistory(history) {
    return this.request(this.endpoints.history, {
      method: 'POST',
      body: JSON.stringify({ history })
    });
  }
}

class Storage {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000;
  }

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  getCached(key, fetcher) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  exportData() {
    const data = {};
    Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
      data[key] = this.get(key);
    });
    return data;
  }

  importData(data) {
    Object.entries(data).forEach(([key, value]) => {
      this.set(key, value);
    });
  }
}

class Analytics {
  constructor() {
    this.events = [];
    this.maxEvents = 100;
  }

  track(event, data = {}) {
    this.events.push({
      event,
      data,
      timestamp: new Date().toISOString()
    });

    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  getEvents() {
    return [...this.events];
  }

  getEventCount(event) {
    return this.events.filter(e => e.event === event).length;
  }

  clear() {
    this.events = [];
  }
}

export const api = new API();
export const storage = new Storage();
export const analytics = new Analytics();

export default { api, storage, analytics };
