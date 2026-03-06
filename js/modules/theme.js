import { state } from '../core/state.js';
import { eventBus, EVENTS } from '../core/events.js';
import { DOM_SELECTORS } from '../core/config.js';

const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  document.body.classList.toggle('light-mode', !isDark);
  
  const icon = document.querySelector(DOM_SELECTORS.THEME_ICON);
  if (icon) {
    icon.classList.toggle('fa-moon', isDark);
    icon.classList.toggle('fa-sun', !isDark);
  }
};

export const initTheme = () => {
  const toggle = document.querySelector(DOM_SELECTORS.THEME_TOGGLE);
  const currentTheme = state.get('theme');
  
  applyTheme(currentTheme);
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      const currentTheme = state.get('theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      state.saveTheme(newTheme);
      applyTheme(newTheme);
      eventBus.emit(EVENTS.THEME_CHANGE, newTheme);
    });
  }
};

export const getTheme = () => state.get('theme');

export default { initTheme, getTheme };
