/* ============================================
   App Shell - Navigation & Shared Functionality
   ============================================ */

// Determine current page from URL
function getCurrentPage() {
  const path = window.location.pathname;
  const file = path.split('/').pop().replace('.html', '');
  return file || 'dashboard';
}

// Render sidebar
function renderSidebar() {
  const page = getCurrentPage();
  const sidebarHTML = `
    <div class="sidebar-brand">
      <div>
        <h1>하자 이걸로</h1>
        <div class="brand-sub">AI DefectManager</div>
      </div>
    </div>

    <div class="sidebar-project">
      <select id="projectSelect" onchange="handleProjectChange(this.value)">
        ${MOCK.projects.map(p => `
          <option value="${p.id}" ${p.id === MOCK.currentProject.id ? 'selected' : ''}>
            ${p.name} (${p.code})
          </option>
        `).join('')}
      </select>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Main</div>
      <a href="dashboard.html" class="nav-item ${page === 'dashboard' ? 'active' : ''}">
        <span class="nav-icon">&#9632;</span>
        <span>대시보드</span>
      </a>
      <a href="defect-register.html" class="nav-item ${page === 'defect-register' ? 'active' : ''}">
        <span class="nav-icon">+</span>
        <span>하자 등록</span>
      </a>
      <a href="defect-list.html" class="nav-item ${page === 'defect-list' ? 'active' : ''}">
        <span class="nav-icon">&#9776;</span>
        <span>하자 목록</span>
        <span class="nav-badge">${MOCK.defects.length}</span>
      </a>

      <div class="nav-section-label">Management</div>
      <a href="defect-detail.html?id=d001" class="nav-item ${page === 'defect-detail' ? 'active' : ''}">
        <span class="nav-icon">&#9998;</span>
        <span>하자 상세</span>
      </a>
      <a href="reports.html" class="nav-item ${page === 'reports' ? 'active' : ''}">
        <span class="nav-icon">&#9636;</span>
        <span>보고서/통계</span>
      </a>

      <div class="nav-section-label">Mobile</div>
      <a href="mobile.html" class="nav-item ${page === 'mobile' ? 'active' : ''}">
        <span class="nav-icon">&#9743;</span>
        <span>모바일 현장관리</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="user-avatar">${MOCK.currentUser.initials}</div>
        <div class="user-info">
          <div class="user-name">${MOCK.currentUser.name}</div>
          <div class="user-role">${MOCK.currentUser.role}</div>
        </div>
      </div>
    </div>
  `;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = sidebarHTML;
}

// Render top header
function renderHeader(title, breadcrumbs) {
  const header = document.getElementById('topHeader');
  if (!header) return;

  let breadcrumbHTML = '';
  if (breadcrumbs && breadcrumbs.length) {
    breadcrumbHTML = `
      <div class="breadcrumb">
        ${breadcrumbs.map((b, i) =>
          i < breadcrumbs.length - 1
            ? `<a href="${b.href || '#'}">${b.label}</a> <span>/</span>`
            : `<span>${b.label}</span>`
        ).join(' ')}
      </div>
    `;
  }

  header.innerHTML = `
    <button class="mobile-toggle" onclick="toggleSidebar()">&#9776;</button>
    <div>
      <div class="page-title">${title}</div>
      ${breadcrumbHTML}
    </div>
    <div class="header-actions">
      <button class="btn btn-primary btn-sm" onclick="location.href='defect-register.html'">+ 하자 등록</button>
    </div>
  `;
}

// Mobile sidebar toggle
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

// Project change handler
function handleProjectChange(projectId) {
  MOCK.currentProject = MOCK.projects.find(p => p.id === projectId);
  // In a real app, this would reload data
  showToast('프로젝트가 변경되었습니다: ' + MOCK.currentProject.name);
}

// Toast notification
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Status badge HTML
function statusBadge(status) {
  const s = MOCK.statuses[status];
  return `<span class="status-badge ${s.class}">${s.label}</span>`;
}

// Severity badge HTML
function severityBadge(level) {
  const labels = { 1: '경미', 2: '보통', 3: '중대', 4: '긴급' };
  return `<span class="severity-badge severity-${level}">${labels[level]}</span>`;
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '-';
  return dateStr.replace('2026-', '').replace(' ', ' ');
}

// URL params helper
function getUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();

  // Close sidebar on overlay click (mobile)
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', toggleSidebar);
  }
});
