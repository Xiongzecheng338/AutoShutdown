import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/events.js';
import { DOM_SELECTORS } from '../core/config.js';
import { debounce, matchesSearch, sortScripts } from '../core/utils.js';
import { scriptsData } from '../data/scripts-data.js';

let searchInput = null;
let sortSelect = null;

const filterScripts = () => {
  const category = state.get('currentCategory');
  const tag = state.get('currentTag');
  const query = state.get('searchQuery');
  const sortBy = state.get('sortBy');
  
  let filtered = [...scriptsData];
  
  if (category !== 'all') {
    filtered = filtered.filter(s => s.category === category);
  }
  
  if (tag) {
    filtered = filtered.filter(s => s.tags.includes(tag));
  }
  
  if (query) {
    filtered = filtered.filter(s => matchesSearch(s, query));
  }
  
  return sortScripts(filtered, sortBy);
};

const handleSearch = debounce((query) => {
  state.set('searchQuery', query);
  eventBus.emit(EVENTS.SEARCH, query);
}, 300);

const handleSort = (sortBy) => {
  state.set('sortBy', sortBy);
  eventBus.emit(EVENTS.SORT, sortBy);
};

export const initSearch = () => {
  searchInput = document.querySelector(DOM_SELECTORS.SEARCH_INPUT);
  sortSelect = document.querySelector(DOM_SELECTORS.SORT_SELECT);
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      handleSort(e.target.value);
    });
  }
};

export const getFilteredScripts = filterScripts;

export const clearSearch = () => {
  if (searchInput) {
    searchInput.value = '';
  }
  state.set('searchQuery', '');
};

export default { initSearch, getFilteredScripts, clearSearch };
