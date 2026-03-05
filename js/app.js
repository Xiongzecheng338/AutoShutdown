document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initTheme();
  initScrollEffects();
});

function initApp() {
  document.getElementById('scriptCount').textContent = scriptsData.length;
  document.getElementById('categoryCount').textContent = categories.length;
  
  renderCategoryButtons();
  renderTagButtons();
  renderScripts(scriptsData);
  renderFAQ();
  initSearch();
}

function renderCategoryButtons() {
  const container = document.getElementById('categoryButtons');
  
  let html = `<button class="category-btn active px-5 py-2.5 rounded-full border border-terminal-border text-gray-300 hover:text-white text-sm font-medium" onclick="filterByCategory('all')"><i class="fas fa-th-large mr-2"></i>全部</button>`;
  
  categories.forEach(cat => {
    const icon = categoryIcons[cat] || 'fa-file-code';
    html += `<button class="category-btn px-5 py-2.5 rounded-full border border-terminal-border text-gray-300 hover:text-white text-sm font-medium" onclick="filterByCategory('${cat}')"><i class="fas ${icon} mr-2"></i>${cat}</button>`;
  });
  
  container.innerHTML = html;
}

function renderTagButtons() {
  const container = document.getElementById('tagButtons');
  let html = allTags.slice(0, 15).map(tag => 
    `<button class="tag-btn px-3 py-1 rounded-full border border-terminal-border text-gray-400 hover:text-terminal-cyan" onclick="filterByTag('${tag}')">#${tag}</button>`
  ).join('');
  container.innerHTML = html;
}

function renderFAQ() {
  const container = document.getElementById('faqContainer');
  container.innerHTML = faqData.map((item, i) => `
    <div class="faq-item p-4">
      <button class="w-full text-left flex items-start justify-between gap-4" onclick="toggleFAQ(${i})">
        <span class="font-medium text-white">${item.q}</span>
        <i class="fas fa-chevron-down text-gray-500 transition-transform" id="faqIcon${i}"></i>
      </button>
      <div class="hidden mt-3 text-gray-400 text-sm leading-relaxed" id="faqContent${i}">${item.a}</div>
    </div>
  `).join('');
}

function toggleFAQ(i) {
  const content = document.getElementById(`faqContent${i}`);
  const icon = document.getElementById(`faqIcon${i}`);
  content.classList.toggle('hidden');
  icon.style.transform = content.classList.contains('hidden') ? '' : 'rotate(180deg)';
}

function renderScripts(scripts) {
  const container = document.getElementById('scriptsGrid');
  const noResults = document.getElementById('noResults');
  const filteredCount = document.getElementById('filteredCount');
  
  filteredCount.textContent = `(${scripts.length} 个脚本)`;
  
  if (scripts.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }
  
  noResults.classList.add('hidden');
  
  container.innerHTML = scripts.map(script => `
    <div class="script-card card-surface rounded-xl border border-terminal-border overflow-hidden">
      <div class="p-5">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-${script.iconColor}/20 flex items-center justify-center">
              <i class="fas ${script.icon} text-lg text-${script.iconColor}"></i>
            </div>
            <div>
              <h3 class="font-semibold text-white text-sm">${script.name}</h3>
              <span class="text-xs text-gray-500">${script.category}</span>
            </div>
          </div>
          <span class="security-badge security-${script.security}">${getSecurityLabel(script.security)}</span>
        </div>
        
        <p class="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">${script.description}</p>
        
        <div class="flex flex-wrap gap-1 mb-4">
          ${script.tags.slice(0, 3).map(tag => `<span class="text-xs px-2 py-0.5 rounded bg-terminal-surface text-gray-500">#${tag}</span>`).join('')}
        </div>
        
        <div class="flex gap-2">
          <button onclick="viewCode(${script.id})" class="flex-1 py-2 rounded-lg bg-terminal-surface border border-terminal-border text-terminal-cyan hover:bg-terminal-cyan/10 transition-all text-sm font-medium">
            <i class="fas fa-code mr-1"></i>查看
          </button>
          <button onclick="downloadScript(${script.id})" class="flex-1 py-2 rounded-lg bg-gradient-to-r from-terminal-green to-terminal-cyan text-white hover:opacity-90 transition-all text-sm font-medium">
            <i class="fas fa-download mr-1"></i>下载
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function getSecurityLabel(security) {
  const labels = { safe: '安全', warning: '注意', danger: '危险' };
  return labels[security];
}

function filterByCategory(category) {
  currentCategory = category;
  currentTag = null;
  
  document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
  
  const filtered = category === 'all' ? scriptsData : scriptsData.filter(s => s.category === category);
  document.getElementById('currentCategory').textContent = category === 'all' ? '全部脚本' : category;
  renderScripts(filtered);
}

function filterByTag(tag) {
  currentTag = tag;
  
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === '#' + tag);
  });
  
  let filtered = scriptsData.filter(s => s.tags.includes(tag));
  if (currentCategory !== 'all') {
    filtered = filtered.filter(s => s.category === currentCategory);
  }
  
  document.getElementById('currentCategory').textContent = `#${tag} 相关脚本`;
  renderScripts(filtered);
}

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let filtered = scriptsData.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.description.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query) ||
      s.tags.some(t => t.toLowerCase().includes(query))
    );
    
    if (currentCategory !== 'all') filtered = filtered.filter(s => s.category === currentCategory);
    if (currentTag) filtered = filtered.filter(s => s.tags.includes(currentTag));
    
    renderScripts(filtered);
  });
  
  sortSelect.addEventListener('change', () => {
    const sorted = [...scriptsData].sort((a, b) => {
      if (sortSelect.value === 'name') return a.name.localeCompare(b.name, 'zh-CN');
      if (sortSelect.value === 'category') return a.category.localeCompare(b.category, 'zh-CN');
      const order = { safe: 0, warning: 1, danger: 2 };
      return order[a.security] - order[b.security];
    });
    renderScripts(sorted);
  });
}

function viewCode(id) {
  const script = scriptsData.find(s => s.id === id);
  if (!script) return;
  
  currentModalScript = script;
  
  document.getElementById('modalFileName').textContent = script.name.replace(/\s+/g, '_') + '.bat';
  document.getElementById('modalTitle').textContent = script.name;
  document.getElementById('modalDescription').textContent = script.description;
  document.getElementById('modalUsage').textContent = script.usage;
  document.getElementById('modalWarning').textContent = script.warning;
  document.getElementById('modalCodeContent').textContent = script.code;
  
  const badge = document.getElementById('modalSecurityBadge');
  badge.className = `security-badge security-${script.security}`;
  badge.textContent = getSecurityLabel(script.security);
  
  document.getElementById('modalTags').innerHTML = script.tags.map(tag => 
    `<span class="text-xs px-2 py-1 rounded bg-terminal-surface text-gray-400">#${tag}</span>`
  ).join('');
  
  document.getElementById('codeModal').classList.remove('hidden');
  document.getElementById('codeModal').classList.add('flex');
  
  hljs.highlightAll();
}

function closeCodeModal() {
  document.getElementById('codeModal').classList.add('hidden');
  document.getElementById('codeModal').classList.remove('flex');
}

function copyModalCode() {
  if (!currentModalScript) return;
  navigator.clipboard.writeText(currentModalScript.code).then(() => showToast('代码已复制到剪贴板'));
}

function downloadModalScript() {
  if (!currentModalScript) return;
  downloadScript(currentModalScript.id);
}

function downloadScript(id) {
  const script = scriptsData.find(s => s.id === id);
  if (!script) return;
  
  const blob = new Blob([script.code], { type: 'application/bat' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = script.name.replace(/\s+/g, '_') + '.bat';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('脚本下载成功');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMessage').textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
  }
  
  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode', !isDark);
    document.body.classList.toggle('light-mode', isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    icon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
  });
}

function initScrollEffects() {
  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('hidden', window.scrollY <= 500);
    backToTop.classList.toggle('flex', window.scrollY > 500);
  });
  
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

document.getElementById('mobileMenuBtn').addEventListener('click', () => {
  const menu = document.getElementById('mobileMenu');
  menu.classList.remove('hidden');
  menu.classList.add('flex');
});

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.add('hidden');
  document.getElementById('mobileMenu').classList.remove('flex');
}

document.getElementById('codeModal').addEventListener('click', function(e) {
  if (e.target === this) closeCodeModal();
});
