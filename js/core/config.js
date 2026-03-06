export const CONFIG = {
  APP_NAME: 'AutoBat',
  VERSION: '3.0',
  STORAGE_KEYS: {
    THEME: 'autobat_theme',
    FAVORITES: 'autobat_favorites',
    HISTORY: 'autobat_history',
    SETTINGS: 'autobat_settings'
  },
  SECURITY_LEVELS: {
    SAFE: 'safe',
    WARNING: 'warning',
    DANGER: 'danger'
  },
  SECURITY_LABELS: {
    safe: '安全',
    warning: '注意',
    danger: '危险'
  },
  SORT_OPTIONS: {
    NAME: 'name',
    CATEGORY: 'category',
    SECURITY: 'security'
  },
  DEFAULTS: {
    THEME: 'dark',
    CATEGORY: 'all',
    MAX_HISTORY: 50,
    MAX_FAVORITES: 100,
    TOAST_DURATION: 3000
  }
};

export const DOM_SELECTORS = {
  SCRIPT_COUNT: '#scriptCount',
  CATEGORY_COUNT: '#categoryCount',
  CATEGORY_BUTTONS: '#categoryButtons',
  TAG_BUTTONS: '#tagButtons',
  SCRIPTS_GRID: '#scriptsGrid',
  SEARCH_INPUT: '#searchInput',
  SORT_SELECT: '#sortSelect',
  CURRENT_CATEGORY: '#currentCategory',
  FILTERED_COUNT: '#filteredCount',
  NO_RESULTS: '#noResults',
  FAQ_CONTAINER: '#faqContainer',
  CODE_MODAL: '#codeModal',
  TOAST: '#toast',
  TOAST_MESSAGE: '#toastMessage',
  BACK_TO_TOP: '#backToTop',
  THEME_TOGGLE: '#themeToggle',
  THEME_ICON: '#themeIcon',
  MOBILE_MENU: '#mobileMenu',
  MOBILE_MENU_BTN: '#mobileMenuBtn',
  TAG_BUTTONS: '#tagButtons'
};

export const MODAL_SELECTORS = {
  FILE_NAME: '#modalFileName',
  TITLE: '#modalTitle',
  DESCRIPTION: '#modalDescription',
  USAGE: '#modalUsage',
  WARNING: '#modalWarning',
  CODE_CONTENT: '#modalCodeContent',
  SECURITY_BADGE: '#modalSecurityBadge',
  TAGS: '#modalTags'
};

export default CONFIG;
