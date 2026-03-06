import { DOM_SELECTORS } from '../core/config.js';

export const initMobileMenu = () => {
  const menuBtn = document.querySelector(DOM_SELECTORS.MOBILE_MENU_BTN);
  const menu = document.querySelector(DOM_SELECTORS.MOBILE_MENU);
  const closeBtn = document.getElementById('closeMobileMenuBtn');
  const menuLinks = document.querySelectorAll('.mobile-menu-link');
  
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.remove('hidden');
      menu.classList.add('flex');
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }
  
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
};

export const closeMobileMenu = () => {
  const menu = document.querySelector(DOM_SELECTORS.MOBILE_MENU);
  if (menu) {
    menu.classList.add('hidden');
    menu.classList.remove('flex');
  }
};

export default { initMobileMenu, closeMobileMenu };
