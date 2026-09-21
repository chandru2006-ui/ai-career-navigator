/* sidebar.js — injects the shared sidebar HTML and initializes navigation */

function buildSidebar(activePage) {
  const nav = [
    { page: 'dashboard', icon: '📊', label: 'Dashboard',       href: '/dashboard.html' },
    { page: 'profile',   icon: '👤', label: 'My Profile',       href: '/profile.html' },
    { page: 'assessment',icon: '📝', label: 'Assessment',       href: '/assessment.html' },
    { page: 'results',   icon: '📈', label: 'Results & Gaps',   href: '/results.html' },
    { page: 'roadmap',   icon: '🗺️', label: 'My Roadmap',       href: '/roadmap.html' },
    { page: 'mentor',    icon: '🤖', label: 'AI Mentor',        href: '/mentor.html' },
  ];

  const navHTML = nav.map(item => `
    <a class="nav-item${item.page === activePage ? ' active' : ''}" href="${item.href}" data-page="${item.page}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `).join('');

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">🎯</div>
        <div>
          <div class="logo-text">AI Career Nav</div>
          <div class="logo-sub">Career Intelligence</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-title">Main</div>
        ${navHTML}
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar" id="sidebar-avatar">U</div>
          <div style="overflow:hidden">
            <div class="user-name" id="sidebar-user-name">Loading...</div>
            <div class="user-email" id="sidebar-user-email"></div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-full" onclick="logout()" style="justify-content:flex-start;gap:.5rem">
          🚪 Sign Out
        </button>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
  `;
}

function injectSidebar(activePage) {
  const placeholder = document.getElementById('sidebar-placeholder');
  if (placeholder) {
    placeholder.outerHTML = buildSidebar(activePage);
  }
  renderSidebarUser();
  initMobileSidebar();
}
