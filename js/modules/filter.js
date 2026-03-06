import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/events.js';
import { DOM_SELECTORS } from '../core/config.js';
import { scriptsData, categories, allTags } from '../data/scripts-data.js';
import { TEXT_TOOL_TEMPLATES } from '../data/text-tools.js';
import { gameTemplates } from '../modules/game-ui.js';
import { CATEGORY_ICONS } from '../data/categories.js';

const allItems = [...scriptsData, ...TEXT_TOOL_TEMPLATES, ...gameTemplates];
const allCategories = [...new Set(allItems.map(s => s.category))];

export const filterByCategory = (category) => {
  state.set('currentCategory', category);
  state.set('currentTag', null);
  
  document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
  const buttons = document.querySelectorAll('.category-btn');
  buttons.forEach(btn => {
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });
  
  document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
  
  const categoryText = category === 'all' ? '全部脚本' : category;
  document.querySelector(DOM_SELECTORS.CURRENT_CATEGORY).textContent = categoryText;
  
  eventBus.emit(EVENTS.CATEGORY_CHANGE, category);
};

export const filterByTag = (tag) => {
  state.set('currentTag', tag);
  
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tag === tag);
  });
  
  document.querySelector(DOM_SELECTORS.CURRENT_CATEGORY).textContent = `#${tag} 相关脚本`;
  
  eventBus.emit(EVENTS.TAG_CHANGE, tag);
};

export const renderCategoryButtons = () => {
  const container = document.querySelector(DOM_SELECTORS.CATEGORY_BUTTONS);
  if (!container) return;
  
  let html = `<button class="category-btn active px-5 py-2.5 rounded-full border border-terminal-border text-gray-300 hover:text-white text-sm font-medium" data-category="all"><i class="fas fa-th-large mr-2"></i>全部</button>`;
  
  allCategories.forEach(cat => {
    const icon = CATEGORY_ICONS[cat] || (cat === '文本工具' ? 'fa-file-alt' : cat === '游戏' ? 'fa-gamepad' : 'fa-file-code');
    html += `<button class="category-btn px-5 py-2.5 rounded-full border border-terminal-border text-gray-300 hover:text-white text-sm font-medium" data-category="${cat}"><i class="fas ${icon} mr-2"></i>${cat}</button>`;
  });
  
  container.innerHTML = html;
  
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (btn) {
      filterByCategory(btn.dataset.category);
    }
  });
};

export const renderTagButtons = () => {
  const container = document.querySelector(DOM_SELECTORS.TAG_BUTTONS);
  if (!container) return;
  
  const tags = [...new Set(allItems.flatMap(s => s.tags || []))];
  
  const html = tags.slice(0, 15).map(tag => 
    `<button class="tag-btn px-3 py-1 rounded-full border border-terminal-border text-gray-400 hover:text-terminal-cyan" data-tag="${tag}">#${tag}</button>`
  ).join('');
  
  container.innerHTML = html;
  
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.tag-btn');
    if (btn) {
      filterByTag(btn.dataset.tag);
    }
  });
};

export const getCurrentCategory = () => state.get('currentCategory');
export const getCurrentTag = () => state.get('currentTag');

export default {
  filterByCategory,
  filterByTag,
  renderCategoryButtons,
  renderTagButtons,
  getCurrentCategory,
  getCurrentTag
};
