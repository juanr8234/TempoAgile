// --- Central SPA Router & App Initializer ---
import { store } from './store.js';
import { Sidebar } from './components/Sidebar.js';
import { Topbar } from './components/Topbar.js';
import { DashboardView } from './components/DashboardView.js';
import { ProjectDetailView } from './components/ProjectDetailView.js';
import { InboxView } from './components/InboxView.js';
import { TeamView } from './components/TeamView.js';
import { SettingsView } from './components/SettingsView.js';
import { CommandPalette } from './components/CommandPalette.js';
import { LoginView } from './components/LoginView.js';

// --- Router Engine ---
function renderApp() {
  const hash = window.location.hash || '#dashboard';
  const appContainer = document.getElementById('app');

  if (!appContainer) return;

  // Route Guard: Bloquear el acceso si no hay sesión activa
  const currentUser = store.getCurrentUser();
  if (!currentUser) {
    appContainer.innerHTML = LoginView.render();
    LoginView.setupListeners();
    return;
  }

  // Cargar contenido basado en la ruta (Hash Router)
  let viewOutput = { main: '', rail: '', setup: () => {} };
  let currentView = '';

  if (hash === '#dashboard' || hash === '') {
    viewOutput = DashboardView.render();
    currentView = 'dashboard';
  } else if (hash.startsWith('#projects/')) {
    const projectId = hash.split('/')[1];
    viewOutput = ProjectDetailView.render(projectId);
    currentView = 'projects';
  } else if (hash === '#inbox') {
    viewOutput = InboxView.render();
    currentView = 'inbox';
  } else if (hash === '#team') {
    viewOutput = TeamView.render();
    currentView = 'team';
  } else if (hash === '#settings') {
    viewOutput = SettingsView.render();
    currentView = 'settings';
  } else {
    // 404 fallback
    viewOutput.main = `<div class="view-container"><h2>404 - Vista no encontrada</h2></div>`;
  }

  // Generar layout completo de la SPA
  const hasRail = !!viewOutput.rail;

  appContainer.innerHTML = `
    <div class="app" id="app-wrapper" style="grid-template-columns: ${hasRail ? '240px 1fr 340px' : '240px 1fr'};">
      
      <!-- Componente Sidebar Lateral -->
      ${Sidebar.render(hash)}
      
      <!-- Componente Topbar Superior -->
      ${Topbar.render(hash)}
      
      <!-- Panel de Contenido Principal -->
      <main class="main" id="main-content">
        ${viewOutput.main}
      </main>

      <!-- Panel de Riel Lateral (Solo si la vista lo incluye, ej. Dashboard o Detalles) -->
      <aside class="rail" id="rail-content" style="display: ${hasRail ? 'block' : 'none'};">
        ${viewOutput.rail || ''}
      </aside>

      <!-- Menú de Navegación Móvil (Responsive) -->
      <nav class="mobile-nav">
        <button class="${hash === '#dashboard' ? 'active' : ''}" onclick="window.location.hash='#dashboard'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12l9 -9l9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-10"/></svg>
          Dashboard
        </button>
        <button class="${hash.startsWith('#projects') ? 'active' : ''}" onclick="window.location.hash='#dashboard'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6h-6z"/></svg>
          Proyectos
        </button>
        <button class="${hash === '#inbox' ? 'active' : ''}" onclick="window.location.hash='#inbox'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 8l9 6l9 -6"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>
          Inbox
        </button>
        <button class="${hash === '#settings' ? 'active' : ''}" onclick="window.location.hash='#settings'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06 .06a2 2 0 0 1 -2.83 2.83l-.06 -.06a1.65 1.65 0 0 0 -1.82 -.33a1.65 1.65 0 0 0 -1 1.51v.17a2 2 0 0 1 -4 0v-.08a1.65 1.65 0 0 0 -1 -1.51a1.65 1.65 0 0 0 -1.82 .33l-.06 .06a2 2 0 0 1 -2.83 -2.83l.06 -.06a1.65 1.65 0 0 0 .33 -1.82a1.65 1.65 0 0 0 -1.51 -1h-.17a2 2 0 0 1 0 -4h.08a1.65 1.65 0 0 0 1.51 -1a1.65 1.65 0 0 0 -.33 -1.82l-.06 -.06a2 2 0 0 1 2.83 -2.83l.06 .06a1.65 1.65 0 0 0 1.82 .33h0a1.65 1.65 0 0 0 1 -1.51v-.17a2 2 0 0 1 4 0v.08a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82 -.33l.06 -.06a2 2 0 0 1 2.83 2.83l-.06 .06a1.65 1.65 0 0 0 -.33 1.82v0a1.65 1.65 0 0 0 1.51 1h.17a2 2 0 0 1 0 4h-.08a1.65 1.65 0 0 0 -1.51 1z"/></svg>
          Ajustes
        </button>
      </nav>

    </div>
  `;

  // Configurar listeners globales de Sidebar y Topbar
  Sidebar.setupListeners();
  Topbar.setupListeners();

  // Configurar listeners particulares de la vista cargada
  if (currentView === 'dashboard') {
    DashboardView.setupListeners();
  } else if (currentView === 'projects') {
    const projectId = hash.split('/')[1];
    ProjectDetailView.setupListeners(projectId);
  } else if (currentView === 'inbox') {
    InboxView.setupListeners();
  } else if (currentView === 'team') {
    TeamView.setupListeners();
  } else if (currentView === 'settings') {
    SettingsView.setupListeners();
  }

  // Sincronizar estado visual de los iconos del tema en el DOM
  syncThemeUI();
}

// --- Theme Sinc ---
function syncThemeUI() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const iconSun = document.getElementById('iconSun');
  const iconMoon = document.getElementById('iconMoon');
  
  if (iconSun && iconMoon) {
    iconSun.style.display = currentTheme === 'dark' ? 'inline-block' : 'none';
    iconMoon.style.display = currentTheme === 'dark' ? 'none' : 'inline-block';
  }
}

// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar consola de comandos global (⌘K)
  CommandPalette.init();

  // Cargar tema guardado en LocalStorage
  try {
    const savedTheme = localStorage.getItem('cadence-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  } catch (_) {}

  // Suscribir render al Store.
  // Cada vez que cambie una historia, estimación o insight, la UI se redibujará reactivamente.
  store.subscribe(() => {
    renderApp();
  });

  // Escuchar navegación por hashes
  window.addEventListener('hashchange', renderApp);

  // Primer render
  renderApp();
});
