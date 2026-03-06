import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/events.js';
import { DOM_SELECTORS, MODAL_SELECTORS, CONFIG } from '../core/config.js';
import { scriptsData, getScriptById } from '../data/scripts-data.js';
import { getSecurityLabel, highlightCode, copyToClipboard, downloadFile, sanitizeFilename } from '../core/utils.js';
import { showToast } from './toast.js';

export const viewCode = (id) => {
  const script = getScriptById(id);
  if (!script) return;
  
  state.set('currentModalScript', script);
  state.addToHistory(id);
  
  document.querySelector(MODAL_SELECTORS.FILE_NAME).textContent = script.name.replace(/\s+/g, '_') + '.bat';
  document.querySelector(MODAL_SELECTORS.TITLE).textContent = script.name;
  document.querySelector(MODAL_SELECTORS.DESCRIPTION).textContent = script.description;
  document.querySelector(MODAL_SELECTORS.USAGE).textContent = script.usage;
  document.querySelector(MODAL_SELECTORS.WARNING).textContent = script.warning;
  
  const codeElement = document.querySelector(MODAL_SELECTORS.CODE_CONTENT);
  codeElement.textContent = script.code;
  
  const badge = document.querySelector(MODAL_SELECTORS.SECURITY_BADGE);
  badge.className = `security-badge security-${script.security}`;
  badge.textContent = getSecurityLabel(script.security);
  
  document.querySelector(MODAL_SELECTORS.TAGS).innerHTML = script.tags.map(tag => 
    `<span class="text-xs px-2 py-1 rounded bg-terminal-surface text-gray-400">#${tag}</span>`
  ).join('');
  
  const modal = document.querySelector(DOM_SELECTORS.CODE_MODAL);
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  
  highlightCode(codeElement);
  
  eventBus.emit(EVENTS.SCRIPT_VIEW, script);
  eventBus.emit(EVENTS.MODAL_OPEN, script);
};

export const closeCodeModal = () => {
  const modal = document.querySelector(DOM_SELECTORS.CODE_MODAL);
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  
  state.set('currentModalScript', null);
  eventBus.emit(EVENTS.MODAL_CLOSE);
};

export const copyModalCode = async () => {
  const script = state.get('currentModalScript');
  if (!script) return;
  
  const success = await copyToClipboard(script.code);
  if (success) {
    showToast('代码已复制到剪贴板');
  } else {
    showToast('复制失败，请手动复制');
  }
};

export const downloadModalScript = () => {
  const script = state.get('currentModalScript');
  if (!script) return;
  downloadScript(script.id);
};

export const downloadScript = (id) => {
  const script = getScriptById(id);
  if (!script) return;
  
  const filename = sanitizeFilename(script.name) + '.bat';
  downloadFile(script.code, filename, 'application/bat');
  
  showToast('脚本下载成功');
  eventBus.emit(EVENTS.SCRIPT_DOWNLOAD, script);
};

export const initModal = () => {
  const modal = document.querySelector(DOM_SELECTORS.CODE_MODAL);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeCodeModal();
      }
    });
  }
  
  const closeModalBtn = document.getElementById('closeModalBtn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeCodeModal);
  }
  
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', copyModalCode);
  }
  
  const downloadModalBtn = document.getElementById('downloadModalBtn');
  if (downloadModalBtn) {
    downloadModalBtn.addEventListener('click', downloadModalScript);
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCodeModal();
    }
  });
};

export default {
  viewCode,
  closeCodeModal,
  copyModalCode,
  downloadModalScript,
  downloadScript,
  initModal
};
