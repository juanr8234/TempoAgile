// --- Sidebar Component ---
import { store } from '../store.js';
import { CommandPalette } from './CommandPalette.js';
import { Toast } from './Toast.js';

export class Sidebar {
  static render(currentHash) {
    const activeWs = store.getActiveWorkspace();
    const insightsCount = store.getInsights().length;
    const currentUser = store.getCurrentUser() || { name: 'Usuario', email: '', avatar: 'U', color: 'var(--primary)' };
    const activeProjects = store.getProjects();
    const totalProjectsCount = activeProjects.length;
    const favoriteProjects = activeProjects.slice(0, 3);

    const favoritesHTML = favoriteProjects.map(p => {
      let color = '#6D5BFF';
      if (p.id === 'p2' || p.id === 'p5') color = '#4F8A6E';
      else if (p.id === 'p3') color = '#C8A55D';
      else if (p.id === 'p4') color = '#FF7A8A';
      else if (p.id === 'p6') color = '#7CC5A2';
      return `
        <div class="nav-item" onclick="window.location.hash='#projects/${p.id}'" title="Ver ${p.name}">
          <span style="width:8px; height:8px; border-radius:2px; background:${color}; display:inline-block; flex-shrink:0;"></span>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.name}</span>
        </div>
      `;
    }).join('');
    
    // Rutas activas
    const isDashboard = currentHash === '#dashboard' || currentHash === '' || currentHash.startsWith('#projects');
    const isInbox = currentHash === '#inbox';
    const isTeam = currentHash === '#team';
    const isSettings = currentHash === '#settings';

    return `
      <aside class="sidebar">
        <!-- Workspace switcher dropdown trigger -->
        <div class="ws-switcher" id="ws-switcher-trigger" title="Cambiar workspace">
          <div class="ws-logo">${activeWs.logo}</div>
          <div style="display:flex; flex-direction:column; min-width:0; flex:1;">
            <span class="ws-name">${activeWs.name}</span>
            <span class="ws-plan">Team · ${activeWs.membersCount} miembros</span>
          </div>
          <svg class="nav-icon" style="margin-left:auto; opacity:0.5; width:14px; height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 9l5 -5 5 5"/><path d="M7 15l5 5 5 -5"/></svg>
        </div>

        <div class="nav-section">
          <div class="nav-item ${isDashboard ? 'active' : ''}" onclick="window.location.hash='#dashboard'">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9 -9l9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-10"/></svg>
            <span>Dashboard</span>
          </div>
          <div class="nav-item ${isInbox ? 'active' : ''}" onclick="window.location.hash='#inbox'">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9 6l9 -6"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>
            <span>Inbox</span>
            ${insightsCount > 0 ? `<span class="count">${insightsCount}</span>` : ''}
          </div>
          <div class="nav-item" id="sidebar-search-trigger">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3 -4.3"/></svg>
            <span>Buscar</span>
            <span class="kbd" style="margin-left:auto;">⌘K</span>
          </div>
        </div>

        <div class="nav-section">
          <div class="nav-label">Proyectos favoritos</div>
          ${favoritesHTML || `<div class="nav-item-empty" style="padding: 6px 12px; font-size:12px; color:var(--text-subtle); font-style:italic;">Sin proyectos</div>`}
          <div class="nav-item" style="color: var(--text-subtle);" onclick="window.location.hash='#dashboard'">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"/></svg>
            <span>Ver todos (${totalProjectsCount})</span>
          </div>
        </div>

        <div class="nav-section">
          <div class="nav-label">Workspace</div>
          <div class="nav-item ${isDashboard ? 'active' : ''}" onclick="window.location.hash='#dashboard'">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2l4 -4"/><circle cx="12" cy="12" r="9"/></svg>
            <span>Calidad global</span>
          </div>
          <div class="nav-item ${isTeam ? 'active' : ''}" onclick="window.location.hash='#team'">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/><path d="M16 11l2 2l4 -4"/></svg>
            <span>Equipo</span>
          </div>
          <div class="nav-item ${isSettings ? 'active' : ''}" onclick="window.location.hash='#settings'">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06 .06a2 2 0 0 1 -2.83 2.83l-.06 -.06a1.65 1.65 0 0 0 -1.82 -.33a1.65 1.65 0 0 0 -1 1.51v.17a2 2 0 0 1 -4 0v-.08a1.65 1.65 0 0 0 -1 -1.51a1.65 1.65 0 0 0 -1.82 .33l-.06 .06a2 2 0 0 1 -2.83 -2.83l.06 -.06a1.65 1.65 0 0 0 .33 -1.82a1.65 1.65 0 0 0 -1.51 -1h-.17a2 2 0 0 1 0 -4h.08a1.65 1.65 0 0 0 1.51 -1a1.65 1.65 0 0 0 -.33 -1.82l-.06 -.06a2 2 0 0 1 2.83 -2.83l.06 .06a1.65 1.65 0 0 0 1.82 .33h0a1.65 1.65 0 0 0 1 -1.51v-.17a2 2 0 0 1 4 0v.08a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82 -.33l.06 -.06a2 2 0 0 1 2.83 2.83l-.06 .06a1.65 1.65 0 0 0 -.33 1.82v0a1.65 1.65 0 0 0 1.51 1h.17a2 2 0 0 1 0 4h-.08a1.65 1.65 0 0 0 -1.51 1z"/></svg>
            <span>Ajustes</span>
          </div>
        </div>

        <div class="sidebar-bottom">
          <div class="user-chip" id="user-chip-profile" title="Perfil y Opciones" style="cursor: pointer;">
            <div class="avatar" style="background: ${currentUser.color || 'var(--primary)'}; font-weight: 700;">${currentUser.avatar}</div>
            <div class="user-info" style="flex: 1; min-width: 0;">
              <span class="user-name" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${currentUser.name}</span>
              <span class="user-email" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${currentUser.email}</span>
            </div>
            <button class="theme-toggle" id="themeBtn" title="Cambiar tema">
              <svg id="iconSun" style="display:none;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M5 5l1.5 1.5"/><path d="M17.5 17.5L19 19"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M5 19l1.5 -1.5"/><path d="M17.5 6.5L19 5"/></svg>
              <svg id="iconMoon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
          </div>
        </div>
      </aside>
    `;
  }

  static setupListeners() {
    // Escuchar búsqueda en el Sidebar
    const searchTrigger = document.getElementById('sidebar-search-trigger');
    if (searchTrigger) {
      searchTrigger.addEventListener('click', () => {
        CommandPalette.open();
      });
    }

    // Selector de Workspace trigger
    const wsTrigger = document.getElementById('ws-switcher-trigger');
    if (wsTrigger) {
      wsTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openWorkspaceDropdown(wsTrigger);
      });
    }

    // Perfil y Opciones popover trigger
    const profileChip = document.getElementById('user-chip-profile');
    if (profileChip) {
      profileChip.addEventListener('click', (e) => {
        if (e.target.closest('#themeBtn')) return; // ignorar clic en theme toggle
        e.stopPropagation();
        this.openProfilePopover(profileChip);
      });
    }

    // Control de temas
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      const root = document.documentElement;
      const iconSun = document.getElementById('iconSun');
      const iconMoon = document.getElementById('iconMoon');

      const updateIcons = (theme) => {
        if (iconSun && iconMoon) {
          iconSun.style.display = theme === 'dark' ? 'inline-block' : 'none';
          iconMoon.style.display = theme === 'dark' ? 'none' : 'inline-block';
        }
      };

      const currentTheme = root.getAttribute('data-theme') || 'light';
      updateIcons(currentTheme);

      themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        updateIcons(next);
        try { localStorage.setItem('cadence-theme', next); } catch (_) {}
      });
    }
  }

  static openWorkspaceDropdown(element) {
    const existing = document.getElementById('ws-dropdown');
    if (existing) {
      existing.remove();
      return;
    }

    const rect = element.getBoundingClientRect();
    const dropdown = document.createElement('div');
    dropdown.id = 'ws-dropdown';
    dropdown.style.cssText = `
      position: fixed;
      top: ${rect.bottom + 6}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius);
      box-shadow: var(--shadow-md);
      z-index: 10000;
      padding: 6px;
      animation: fadeUp 0.15s ease-out;
    `;

    const workspaces = store.getWorkspaces();
    dropdown.innerHTML = workspaces.map(w => `
      <div class="ws-dropdown-item" data-id="${w.id}" style="
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-weight: ${w.active ? '600' : '500'};
        background: ${w.active ? 'var(--primary-soft)' : 'transparent'};
        color: ${w.active ? 'var(--primary-strong)' : 'var(--text)'};
        transition: background 0.15s;
        font-size: 13px;
      ">
        <div class="ws-logo" style="width:20px; height:20px; font-size:10px; border-radius:4px;">${w.logo}</div>
        <div style="display:flex; flex-direction:column; min-width:0;">
          <span>${w.name}</span>
        </div>
        ${w.active ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="margin-left:auto;"><path d="M20 6L9 17l-5-5"/></svg>` : ''}
      </div>
    `).join('');

    document.body.appendChild(dropdown);

    // Click handler para los items
    dropdown.querySelectorAll('.ws-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        store.switchWorkspace(id);
        const wsName = workspaces.find(w => w.id === id).name;
        Toast.show(`Cambiado a Workspace: ${wsName}`, 'success');
        dropdown.remove();
      });
    });

    // Cerrar dropdown al hacer click afuera
    const closeDropdown = (e) => {
      if (!dropdown.contains(e.target) && e.target !== element) {
        dropdown.remove();
        document.removeEventListener('click', closeDropdown);
      }
    };
    setTimeout(() => document.addEventListener('click', closeDropdown), 0);
  }

  static openProfilePopover(element) {
    const existing = document.getElementById('profile-popover');
    if (existing) {
      existing.remove();
      return;
    }

    const rect = element.getBoundingClientRect();
    const popover = document.createElement('div');
    popover.id = 'profile-popover';
    popover.style.cssText = `
      position: fixed;
      bottom: ${window.innerHeight - rect.top + 8}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      padding: 12px;
      animation: fadeUp 0.15s ease-out;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;

    const currentUser = store.getCurrentUser() || {};
    popover.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; padding-bottom:10px; border-bottom:1px solid var(--border);">
        <div class="avatar" style="width:32px; height:32px; font-size:14px; font-weight:700; background: ${currentUser.color || 'var(--primary)'}">${currentUser.avatar}</div>
        <div style="display:flex; flex-direction:column; min-width:0; flex:1;">
          <span style="font-weight:600; font-size:13px; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${currentUser.name}</span>
          <span style="font-size:11px; color:var(--text-subtle); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:130px;">${currentUser.email}</span>
        </div>
      </div>
      <button id="logoutBtn" style="
        display: flex;
        align-items: center;
        gap: 8px;
        background: transparent;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 8px 10px;
        color: var(--poor);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 12.5px;
        justify-content: center;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"/><path d="M9 12h12l-3-3m0 6l3-3"/></svg>
        Cerrar sesión
      </button>
    `;

    document.body.appendChild(popover);

    // Logout listener
    const logoutBtn = popover.querySelector('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        popover.remove();
        store.logout();
        window.location.hash = '#dashboard'; // reset hash
        Toast.show('Sesión cerrada correctamente', 'info');
      });
    }

    // Cerrar al hacer click afuera
    const closePopover = (e) => {
      if (!popover.contains(e.target) && !element.contains(e.target)) {
        popover.remove();
        document.removeEventListener('click', closePopover);
      }
    };
    setTimeout(() => document.addEventListener('click', closePopover), 0);
  }
}
