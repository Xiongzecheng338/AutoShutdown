import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/events.js';
import { DOM_SELECTORS } from '../core/config.js';
import { scriptsData } from '../data/scripts-data.js';
import { faqData } from '../data/faq.js';
import { getSecurityLabel } from '../core/utils.js';
import { viewCode, downloadScript } from './modal.js';
import { showToast } from './toast.js';
import { viewGame } from './game-ui.js';

const renderScriptCard = (script) => {
  const isFavorite = state.isFavorite(script.id);
  const isGame = script.id && script.id.toString().startsWith('game-');
  const isTextTool = script.id && script.id.toString().startsWith('text-');
  
  const iconBgColor = script.iconColor ? `bg-${script.iconColor}/20` : 'bg-terminal-cyan/20';
  const iconTextColor = script.iconColor ? `text-${script.iconColor}` : 'text-terminal-cyan';
  
  const handleView = isGame ? `viewGame('${script.id}')` : `viewCode('${script.id}')`;
  
  return `
    <div class="script-card card-surface rounded-xl border border-terminal-border overflow-hidden" data-script-id="${script.id}">
      <div class="p-5">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl ${iconBgColor} flex items-center justify-center">
              <i class="fas ${script.icon || 'fa-file-code'} text-lg ${iconTextColor}"></i>
            </div>
            <div>
              <h3 class="font-semibold text-white text-sm">${script.name}</h3>
              <span class="text-xs text-gray-500">${script.category}</span>
            </div>
          </div>
          ${script.security ? `<span class="security-badge security-${script.security}">${getSecurityLabel(script.security)}</span>` : ''}
        </div>
        
        <p class="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">${script.description || ''}</p>
        
        ${script.tags && script.tags.length > 0 ? `
        <div class="flex flex-wrap gap-1 mb-4">
          ${script.tags.slice(0, 3).map(tag => `<span class="text-xs px-2 py-0.5 rounded bg-terminal-surface text-gray-500">#${tag}</span>`).join('')}
        </div>
        ` : ''}
        
        <div class="flex gap-2">
          ${isGame ? `
          <button class="game-btn flex-1 py-2 rounded-lg bg-gradient-to-r from-terminal-green to-terminal-cyan text-white hover:opacity-90 transition-all text-sm font-medium" data-game-id="${script.id}">
            <i class="fas fa-play mr-1"></i>开始游戏
          </button>
          ` : `
          <button class="view-btn flex-1 py-2 rounded-lg bg-terminal-surface border border-terminal-border text-terminal-cyan hover:bg-terminal-cyan/10 transition-all text-sm font-medium" data-script-id="${script.id}">
            <i class="fas ${isTextTool ? 'fa-file-alt' : 'fa-code'} mr-1"></i>${isTextTool ? '查看' : '查看'}
          </button>
          <button class="favorite-btn py-2 px-3 rounded-lg bg-terminal-surface border border-terminal-border ${isFavorite ? 'text-terminal-yellow' : 'text-gray-400'} hover:bg-terminal-surface/80 transition-all text-sm" data-script-id="${script.id}">
            <i class="fas fa-star"></i>
          </button>
          ${script.code ? `
          <button class="download-btn flex-1 py-2 rounded-lg bg-gradient-to-r from-terminal-green to-terminal-cyan text-white hover:opacity-90 transition-all text-sm font-medium" data-script-id="${script.id}">
            <i class="fas fa-download mr-1"></i>下载
          </button>
          ` : ''}
          `}
        </div>
      </div>
    </div>
  `;
};

export const renderScripts = (scripts = null) => {
  const container = document.querySelector(DOM_SELECTORS.SCRIPTS_GRID);
  const noResults = document.querySelector(DOM_SELECTORS.NO_RESULTS);
  const filteredCount = document.querySelector(DOM_SELECTORS.FILTERED_COUNT);
  
  const scriptsToRender = scripts || [];
  
  if (filteredCount) {
    filteredCount.textContent = `(${scriptsToRender.length} 个)`;
  }
  
  if (scriptsToRender.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }
  
  noResults.classList.add('hidden');
  container.innerHTML = scriptsToRender.map(renderScriptCard).join('');
  
  container.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const scriptId = btn.dataset.scriptId;
      if (scriptId) viewCode(scriptId);
    });
  });
  
  container.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const scriptId = parseInt(btn.dataset.scriptId);
      if (scriptId) downloadScript(scriptId);
    });
  });
  
  container.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.scriptId);
      if (id) {
        const added = state.toggleFavorite(id);
        showToast(added ? '已添加到收藏' : '已取消收藏');
        renderScripts(scripts);
      }
    });
  });
  
  container.querySelectorAll('.game-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const gameId = btn.dataset.gameId;
      if (gameId) viewGame(gameId);
    });
  });
};

export const renderFAQ = () => {
  const container = document.querySelector(DOM_SELECTORS.FAQ_CONTAINER);
  if (!container) return;
  
  container.innerHTML = faqData.map((item, i) => `
    <div class="faq-item p-4">
      <button class="faq-toggle w-full text-left flex items-start justify-between gap-4" data-faq-index="${i}">
        <span class="font-medium text-white">${item.q}</span>
        <i class="fas fa-chevron-down text-gray-500 transition-transform faq-icon" data-faq-index="${i}"></i>
      </button>
      <div class="hidden mt-3 text-gray-400 text-sm leading-relaxed faq-content" data-faq-index="${i}">${item.a}</div>
    </div>
  `).join('');
  
  container.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.faqIndex;
      toggleFAQ(index);
    });
  });
};

export const toggleFAQ = (index) => {
  const content = document.querySelector(`.faq-content[data-faq-index="${index}"]`);
  const icon = document.querySelector(`.faq-icon[data-faq-index="${index}"]`);
  if (content && icon) {
    content.classList.toggle('hidden');
    icon.style.transform = content.classList.contains('hidden') ? '' : 'rotate(180deg)';
  }
};

export const renderStats = () => {
  const scriptCount = document.querySelector(DOM_SELECTORS.SCRIPT_COUNT);
  const categoryCount = document.querySelector(DOM_SELECTORS.CATEGORY_COUNT);
  
  if (scriptCount) {
    scriptCount.textContent = scriptsData.length;
  }
  if (categoryCount) {
    categoryCount.textContent = new Set(scriptsData.map(s => s.category)).size;
  }
};

export default {
  renderScripts,
  renderFAQ,
  toggleFAQ,
  renderStats
};
