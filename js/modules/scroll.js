import { DOM_SELECTORS } from '../core/config.js';
import { throttle } from '../core/utils.js';

export const initScrollEffects = () => {
  const backToTop = document.querySelector(DOM_SELECTORS.BACK_TO_TOP);
  
  const handleScroll = throttle(() => {
    if (backToTop) {
      const shouldShow = window.scrollY > 500;
      backToTop.classList.toggle('hidden', !shouldShow);
      backToTop.classList.toggle('flex', shouldShow);
    }
  }, 100);
  
  window.addEventListener('scroll', handleScroll);
  
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

export default { initScrollEffects };
