import { DOM_SELECTORS, CONFIG } from '../core/config.js';
import { eventBus, EVENTS } from '../core/events.js';

export const showToast = (message, duration = CONFIG.DEFAULTS.TOAST_DURATION) => {
  const toast = document.querySelector(DOM_SELECTORS.TOAST);
  const toastMessage = document.querySelector(DOM_SELECTORS.TOAST_MESSAGE);
  
  if (!toast || !toastMessage) return;
  
  toastMessage.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  
  eventBus.emit(EVENTS.TOAST_SHOW, message);
  
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, duration);
};

export default { showToast };
