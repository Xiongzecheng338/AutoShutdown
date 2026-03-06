import { CONFIG } from './config.js';

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const getSecurityLabel = (security) => {
  return CONFIG.SECURITY_LABELS[security] || security;
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const highlightCode = (element) => {
  if (window.hljs) {
    window.hljs.highlightElement(element);
  }
};

export const sanitizeFilename = (name) => {
  return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');
};

export const parseSearchQuery = (query) => {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return {
    terms,
    isEmpty: terms.length === 0
  };
};

export const matchesSearch = (item, query) => {
  const { terms, isEmpty } = parseSearchQuery(query);
  if (isEmpty) return true;
  
  const searchText = [
    item.name,
    item.description,
    item.category,
    ...item.tags
  ].join(' ').toLowerCase();
  
  return terms.every(term => searchText.includes(term));
};

export const sortScripts = (scripts, sortBy) => {
  const sorted = [...scripts];
  
  switch (sortBy) {
    case CONFIG.SORT_OPTIONS.NAME:
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    case CONFIG.SORT_OPTIONS.CATEGORY:
      return sorted.sort((a, b) => a.category.localeCompare(b.category, 'zh-CN'));
    case CONFIG.SORT_OPTIONS.SECURITY:
      const order = { safe: 0, warning: 1, danger: 2 };
      return sorted.sort((a, b) => order[a.security] - order[b.security]);
    default:
      return sorted;
  }
};

export default {
  debounce,
  throttle,
  getSecurityLabel,
  formatDate,
  escapeHtml,
  generateId,
  copyToClipboard,
  downloadFile,
  highlightCode,
  sanitizeFilename,
  parseSearchQuery,
  matchesSearch,
  sortScripts
};
