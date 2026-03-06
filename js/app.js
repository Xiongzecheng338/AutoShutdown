import { CONFIG } from './core/config.js';
import { state } from './core/state.js';
import { eventBus, EVENTS } from './core/events.js';
import { initTheme } from './modules/theme.js';
import { initSearch, getFilteredScripts } from './modules/search.js';
import { filterByCategory, filterByTag, renderCategoryButtons, renderTagButtons } from './modules/filter.js';
import { renderScripts, renderFAQ, toggleFAQ, renderStats } from './modules/render.js';
import { viewCode, closeCodeModal, copyModalCode, downloadModalScript, downloadScript, initModal } from './modules/modal.js';
import { showToast } from './modules/toast.js';
import { initScrollEffects } from './modules/scroll.js';
import { initMobileMenu, closeMobileMenu } from './modules/mobile-menu.js';
import { scriptsData } from './data/scripts-data.js';
import { TEXT_TOOL_TEMPLATES } from './data/text-tools.js';
import { viewGame, closeGame, gameTemplates } from './modules/game-ui.js';

const allScripts = [...scriptsData, ...TEXT_TOOL_TEMPLATES, ...gameTemplates];

class AutoBatApp {
  constructor() {
    this.version = '3.0';
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    renderStats();
    renderCategoryButtons();
    renderTagButtons();
    renderScripts(allScripts);
    renderFAQ();
    
    initTheme();
    initSearch();
    initModal();
    initScrollEffects();
    initMobileMenu();
    
    this._setupEventListeners();
    this._exposeGlobalAPI();
    
    this.initialized = true;
    eventBus.emit(EVENTS.APP_READY);
    
    console.log(`%c🚀 AutoBat v${this.version} 已初始化`, 'color: #3fb950; font-size: 14px; font-weight: bold;');
  }

  _setupEventListeners() {
    eventBus.on(EVENTS.SEARCH, () => {
      renderScripts(this.getFilteredScripts());
    });
    
    eventBus.on(EVENTS.SORT, () => {
      renderScripts(this.getFilteredScripts());
    });
    
    eventBus.on(EVENTS.CATEGORY_CHANGE, () => {
      renderScripts(this.getFilteredScripts());
    });
    
    eventBus.on(EVENTS.TAG_CHANGE, () => {
      renderScripts(this.getFilteredScripts());
    });
  }

  getFilteredScripts() {
    const category = state.get('currentCategory');
    const tag = state.get('currentTag');
    const query = state.get('searchQuery');
    
    let filtered = [...allScripts];
    
    if (category !== 'all') {
      filtered = filtered.filter(s => s.category === category);
    }
    
    if (tag) {
      filtered = filtered.filter(s => s.tags && s.tags.includes(tag));
    }
    
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    
    return filtered;
  }

  _exposeGlobalAPI() {
    window.AutoBat = {
      version: this.version,
      state,
      eventBus,
      EVENTS,
      filterByCategory,
      filterByTag,
      viewCode,
      closeCodeModal,
      copyModalCode,
      downloadModalScript,
      downloadScript,
      toggleFAQ,
      closeMobileMenu,
      showToast,
      viewGame,
      closeGame,
      toggleFavorite: (id) => {
        const added = state.toggleFavorite(id);
        showToast(added ? '已添加到收藏' : '已取消收藏');
        renderScripts(this.getFilteredScripts());
      },
      getScripts: () => allScripts,
      getScriptById: (id) => allScripts.find(s => s.id === id),
      getFavorites: () => state.get('favorites'),
      getHistory: () => state.get('history'),
    };
  }
}

const app = new AutoBatApp();

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

export default app;
