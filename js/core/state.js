import { CONFIG } from './config.js';

class AppState {
  constructor() {
    this._state = {
      currentCategory: CONFIG.DEFAULTS.CATEGORY,
      currentTag: null,
      currentModalScript: null,
      searchQuery: '',
      sortBy: CONFIG.SORT_OPTIONS.NAME,
      theme: this._loadTheme(),
      favorites: this._loadFavorites(),
      history: this._loadHistory()
    };
    this._listeners = new Map();
  }

  _loadTheme() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || CONFIG.DEFAULTS.THEME;
  }

  _loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES)) || [];
    } catch {
      return [];
    }
  }

  _loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY)) || [];
    } catch {
      return [];
    }
  }

  get(key) {
    return this._state[key];
  }

  set(key, value) {
    const oldValue = this._state[key];
    this._state[key] = value;
    this._notify(key, value, oldValue);
  }

  subscribe(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set());
    }
    this._listeners.get(key).add(callback);
    return () => this._listeners.get(key).delete(callback);
  }

  _notify(key, newValue, oldValue) {
    if (this._listeners.has(key)) {
      this._listeners.get(key).forEach(callback => callback(newValue, oldValue));
    }
  }

  saveTheme(theme) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
    this.set('theme', theme);
  }

  toggleFavorite(scriptId) {
    const favorites = [...this.get('favorites')];
    const index = favorites.indexOf(scriptId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      if (favorites.length >= CONFIG.DEFAULTS.MAX_FAVORITES) {
        favorites.shift();
      }
      favorites.push(scriptId);
    }
    localStorage.setItem(CONFIG.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    this.set('favorites', favorites);
    return index === -1;
  }

  addToHistory(scriptId) {
    let history = this.get('history').filter(id => id !== scriptId);
    history.unshift(scriptId);
    if (history.length > CONFIG.DEFAULTS.MAX_HISTORY) {
      history = history.slice(0, CONFIG.DEFAULTS.MAX_HISTORY);
    }
    localStorage.setItem(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(history));
    this.set('history', history);
  }

  isFavorite(scriptId) {
    return this.get('favorites').includes(scriptId);
  }

  reset() {
    this._state = {
      currentCategory: CONFIG.DEFAULTS.CATEGORY,
      currentTag: null,
      currentModalScript: null,
      searchQuery: '',
      sortBy: CONFIG.SORT_OPTIONS.NAME,
      theme: this._loadTheme(),
      favorites: this._loadFavorites(),
      history: this._loadHistory()
    };
  }
}

export const state = new AppState();
export default state;
