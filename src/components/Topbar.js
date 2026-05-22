// --- Topbar Component ---
import { store } from '../store.js';
import { CommandPalette } from './CommandPalette.js';
import { NewStoryModal } from './NewStoryModal.js';

export class Topbar {
  static render(currentHash) {
    const activeWs = store.getActiveWorkspace();
    const insightsCount = store.getInsights().length;
    
    // Generar breadcrumbs dinámicos
    let breadcrumbHTML = `<span>${activeWs.name}</span>`;
    
    if (currentHash.startsWith('#projects/')) {
      const projId = currentHash.split('/')[1];
      const project = store.getProjectById(projId);
      breadcrumbHTML += `
        <span class="crumb-sep">/</span>
        <span class="crumb-sep" onclick="window.location.hash='#dashboard'" style="cursor:pointer; text-decoration:underline;">Proyectos</span>
        <span class="crumb-sep">/</span>
        <span class="current">${project ? project.name : 'Detalle'}</span>
      `;
    } else if (currentHash === '#inbox') {
      breadcrumbHTML += `
        <span class="crumb-sep">/</span>
        <span class="current">Inbox</span>
      `;
    } else if (currentHash === '#team') {
      breadcrumbHTML += `
        <span class="crumb-sep">/</span>
        <span class="current">Equipo</span>
      `;
    } else if (currentHash === '#settings') {
      breadcrumbHTML += `
        <span class="crumb-sep">/</span>
        <span class="current">Ajustes</span>
      `;
    } else {
      breadcrumbHTML += `
        <span class="crumb-sep">/</span>
        <span class="current">Dashboard</span>
      `;
    }

    return `
      <header class="topbar">
        <div class="breadcrumb">
          ${breadcrumbHTML}
        </div>
        <div class="topbar-actions">
          <!-- Botón de Búsqueda ⌘K -->
          <div class="cmd-button" id="topbar-search-btn" title="Buscar... (Cmd+K)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3 -4.3"/></svg>
            <span>Buscar o saltar a...</span>
            <span class="kbd">⌘K</span>
          </div>
          
          <!-- Botón de Inbox -->
          <button class="btn btn-ghost" onclick="window.location.hash='#inbox'" style="position:relative;" title="Ver Inbox">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8l9 6l9 -6"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>
            ${insightsCount > 0 ? `<span class="badge bg-risk" style="position:absolute; top:-6px; right:-6px; padding:2px 5px; font-size:9px; border-radius:50%; color:white; border:0; min-width:18px;">${insightsCount}</span>` : ''}
          </button>
          
          <!-- Botón de Crear Nueva Historia -->
          <button class="btn btn-primary" id="topbar-new-story-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            <span>Nueva historia</span>
          </button>
        </div>
      </header>
    `;
  }

  static setupListeners() {
    // Escuchar búsqueda en barra superior
    const searchBtn = document.getElementById('topbar-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        CommandPalette.open();
      });
    }

    // Botón crear historia
    const newStoryBtn = document.getElementById('topbar-new-story-btn');
    if (newStoryBtn) {
      newStoryBtn.addEventListener('click', () => {
        NewStoryModal.open();
      });
    }
  }
}
