/* api.js — central API helper for all authenticated requests */

const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login.html';
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

const api = {
  get:    (path)         => request(path, { method: 'GET' }),
  post:   (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' }),

  // Auth
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login', data),
  getMe:    ()      => api.get('/auth/me'),

  // Profile
  getProfile:    ()     => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),

  // Careers & Skills
  getCareers: () => api.get('/careers'),
  getCareer:  (id) => api.get(`/careers/${id}`),
  getSkills:  () => api.get('/skills'),

  // Assessment
  startAssessment:  (careerId) => api.post('/assessment/start', { careerId }),
  getQuestion:      (id, index) => api.get(`/assessment/${id}/question?index=${index}`),
  submitAnswer:     (id, data)  => api.post(`/assessment/${id}/answer`, data),
  submitAssessment: (id)        => api.post(`/assessment/${id}/submit`, {}),
  getResult:        (id)        => api.get(`/assessment/${id}/result`),
  getLatestResult:  ()          => api.get('/assessment/latest'),
  getAssessmentHistory: ()      => api.get('/assessment/history'),

  // Dashboard
  getDashboard: ()           => api.get('/dashboard'),
  getSkillGaps: (careerId)   => api.get(`/dashboard/skill-gaps${careerId ? `?careerId=${careerId}` : ''}`),

  // Roadmap
  generateRoadmap:    (careerId) => api.post('/roadmap/generate', { careerId }),
  getRoadmap:         (careerId) => api.get(`/roadmap${careerId ? `?careerId=${careerId}` : ''}`),
  updateProgress:     (data)     => api.put('/roadmap/progress', data),
  recalculateRoadmap: (careerId) => api.post('/roadmap/recalculate', { careerId }),

  // Mentor
  chat:          (data)      => api.post('/mentor/chat', data),
  getMentorHistory: ()       => api.get('/mentor/history'),
  getMentorSession: (id)     => api.get(`/mentor/session/${id}`),
  deleteSession: (id)        => api.delete(`/mentor/session/${id}`),
};

function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

function redirectIfAuth() {
  const token = getToken();
  if (token) {
    window.location.href = '/dashboard.html';
  }
}

// Show toast notification
function showToast(message, type = 'info', duration = 3500) {
  const existing = document.getElementById('toast-container');
  if (existing) existing.remove();

  const colors = {
    success: '#10B981', error: '#EF4444', warning: '#F59E0B', info: '#4F46E5'
  };
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  const container = document.createElement('div');
  container.id = 'toast-container';
  container.style.cssText = `
    position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999;
    background:var(--bg-card); border:1px solid ${colors[type]};
    border-left:4px solid ${colors[type]};
    border-radius:10px; padding:0.875rem 1.25rem;
    display:flex; align-items:center; gap:0.75rem;
    box-shadow:0 8px 24px rgba(0,0,0,0.4);
    max-width:380px; animation:slideInRight 0.25s ease;
    color:var(--text); font-size:0.875rem; font-family:var(--font);
  `;
  const style = document.createElement('style');
  style.textContent = `@keyframes slideInRight{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}`;
  document.head.appendChild(style);

  container.innerHTML = `
    <span style="color:${colors[type]};font-size:1.1rem;font-weight:700">${icons[type]}</span>
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="
      margin-left:auto; background:none; border:none; cursor:pointer;
      color:var(--text-muted); font-size:1rem; padding:0; line-height:1;
    ">✕</button>
  `;
  document.body.appendChild(container);
  setTimeout(() => container.remove(), duration);
}

// Render sidebar user info
function renderSidebarUser() {
  const user = getUser();
  if (!user) return;
  const nameEl = document.getElementById('sidebar-user-name');
  const emailEl = document.getElementById('sidebar-user-email');
  const avatarEl = document.getElementById('sidebar-avatar');
  if (nameEl) nameEl.textContent = user.name || 'User';
  if (emailEl) emailEl.textContent = user.email || '';
  if (avatarEl) avatarEl.textContent = (user.name || 'U')[0].toUpperCase();
}

// Active nav item
function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const active = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (active) active.classList.add('active');
}

// Mobile sidebar toggle
function initMobileSidebar() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebar-overlay');
  if (!hamburger || !sidebar) return;
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('show');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

// Logout
function logout() {
  removeToken();
  window.location.href = '/login.html';
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

// Format time
function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Get proficiency color
function proficiencyColor(p) {
  const map = { Expert: '#10B981', Advanced: '#06B6D4', Intermediate: '#F59E0B', Beginner: '#EF4444' };
  return map[p] || '#94A3B8';
}

// Get gap severity class
function gapSeverityClass(severity) {
  const map = {
    'None': 'gap-none', 'Minimal': 'gap-minimal',
    'Low': 'gap-low', 'Medium': 'gap-medium',
    'High': 'gap-high', 'Very High': 'gap-very-high'
  };
  return map[severity] || '';
}

function gapSeverityBadge(severity) {
  const map = {
    'None': 'badge-green', 'Minimal': 'badge-green',
    'Low': 'badge-cyan', 'Medium': 'badge-yellow',
    'High': 'badge-red', 'Very High': 'badge-red'
  };
  return map[severity] || 'badge-gray';
}

// Progress bar color
function progressBarColor(pct) {
  if (pct >= 80) return 'green';
  if (pct >= 50) return '';
  if (pct >= 30) return 'yellow';
  return 'red';
}

// Set button loading state
function setLoading(btn, loading, text = null) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn._originalText = btn.innerHTML;
    btn.innerHTML = `<span class="loading-spinner" style="width:16px;height:16px;border-width:2px"></span> ${text || 'Loading...'}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn._originalText || btn.innerHTML;
  }
}
