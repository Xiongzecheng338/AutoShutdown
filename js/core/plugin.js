import { eventBus, EVENTS } from './events.js';

class PluginSystem {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
  }

  register(name, plugin) {
    if (this.plugins.has(name)) {
      console.warn(`Plugin "${name}" is already registered.`);
      return false;
    }
    
    this.plugins.set(name, plugin);
    
    if (plugin.hooks) {
      Object.entries(plugin.hooks).forEach(([hook, callback]) => {
        this.on(hook, callback);
      });
    }
    
    if (plugin.init) {
      plugin.init();
    }
    
    console.log(`Plugin "${name}" registered successfully.`);
    return true;
  }

  unregister(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) return false;
    
    if (plugin.hooks) {
      Object.entries(plugin.hooks).forEach(([hook, callback]) => {
        this.off(hook, callback);
      });
    }
    
    if (plugin.destroy) {
      plugin.destroy();
    }
    
    this.plugins.delete(name);
    return true;
  }

  on(hook, callback) {
    if (!this.hooks.has(hook)) {
      this.hooks.set(hook, new Set());
    }
    this.hooks.get(hook).add(callback);
    
    const eventMap = {
      'script:view': EVENTS.SCRIPT_VIEW,
      'script:download': EVENTS.SCRIPT_DOWNLOAD,
      'theme:change': EVENTS.THEME_CHANGE,
      'modal:open': EVENTS.MODAL_OPEN,
      'modal:close': EVENTS.MODAL_CLOSE,
      'app:ready': EVENTS.APP_READY
    };
    
    if (eventMap[hook]) {
      eventBus.on(eventMap[hook], callback);
    }
  }

  off(hook, callback) {
    if (this.hooks.has(hook)) {
      this.hooks.get(hook).delete(callback);
    }
  }

  emit(hook, ...args) {
    if (this.hooks.has(hook)) {
      this.hooks.get(hook).forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Plugin hook "${hook}" error:`, error);
        }
      });
    }
  }

  getPlugin(name) {
    return this.plugins.get(name);
  }

  getPlugins() {
    return Array.from(this.plugins.entries()).map(([name, plugin]) => ({
      name,
      version: plugin.version || '1.0.0',
      description: plugin.description || ''
    }));
  }
}

export const pluginSystem = new PluginSystem();

export const createPlugin = (config) => {
  return {
    name: config.name,
    version: config.version || '1.0.0',
    description: config.description || '',
    init: config.init || (() => {}),
    destroy: config.destroy || (() => {}),
    hooks: config.hooks || {}
  };
};

export default pluginSystem;
