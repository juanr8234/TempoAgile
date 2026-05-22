// --- Command Palette (⌘K) Spotlight Component ---
import { store } from '../store.js';
import { NewStoryModal } from './NewStoryModal.js';
import { Toast } from './Toast.js';

export class CommandPalette {
  static init() {
    // Escuchar atajo global ⌘K o Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  static toggle() {
    const existing = document.getElementById('cmd-palette-overlay');
    if (existing) {
      this.close();
    } else {
      this.open();
    }
  }

  static open() {
    const overlay = document.createElement('div');
    overlay.id = 'cmd-palette-overlay';
    overlay.className = 'cmd-palette-overlay';
    
    overlay.innerHTML = `
      <div class="cmd-palette" id="cmd-palette">
        <div class="cmd-palette-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3 -4.3"/></svg>
          <input type="text" id="cmd-input" class="cmd-palette-input" placeholder="Buscar o ejecutar comandos..." autocomplete="off" />
          <button class="close-btn" id="close-cmd-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="cmd-palette-results" id="cmd-results">
          <!-- Inyectado por búsqueda -->
        </div>
        <div class="cmd-palette-footer">
          <span><kbd>↑↓</kbd> Navegar</span>
          <span><kbd>Enter</kbd> Seleccionar</span>
          <span><kbd>ESC</kbd> Cerrar</span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    
    const input = document.getElementById('cmd-input');
    input.focus();

    // Eventos
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });
    
    document.getElementById('close-cmd-btn').addEventListener('click', () => this.close());
    
    input.addEventListener('input', () => this.search(input.value));
    
    // Control de teclado para subir/bajar resultados
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateResults(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateResults(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.triggerActive();
      }
    });

    this.search(''); // Inicia con todos los items por defecto
  }

  static close() {
    const overlay = document.getElementById('cmd-palette-overlay');
    if (overlay) {
      overlay.style.animation = 'fadeIn 0.15s reverse ease-out forwards';
      const cmd = document.getElementById('cmd-palette');
      cmd.style.animation = 'fadeIn 0.15s reverse ease-out forwards';
      setTimeout(() => overlay.remove(), 150);
    }
  }

  static search(query) {
    const q = query.toLowerCase().trim();
    const resultsContainer = document.getElementById('cmd-results');
    
    const projects = store.getProjects();
    const members = store.getMembers();
    
    const items = [
      // 1. Navegación
      { category: 'Navegación', title: 'Ir al Dashboard', subtitle: 'Vista principal con métricas y calidad', icon: 'grid', action: () => { window.location.hash = '#dashboard'; } },
      { category: 'Navegación', title: 'Ir a Inbox · Insights', subtitle: 'Ver notificaciones y alertas', icon: 'bell', action: () => { window.location.hash = '#inbox'; } },
      { category: 'Navegación', title: 'Ir al Equipo', subtitle: 'Miembros activos y colaboración', icon: 'users', action: () => { window.location.hash = '#team'; } },
      { category: 'Navegación', title: 'Ir a Ajustes', subtitle: 'Configurar parámetros y pesos', icon: 'settings', action: () => { window.location.hash = '#settings'; } },
      
      // 2. Acciones Globales
      { category: 'Acciones Rápidas', title: 'Crear Nueva Historia', subtitle: 'Agregar tarea o backlog a un proyecto', icon: 'plus', action: () => { NewStoryModal.open(); } },
      { category: 'Acciones Rápidas', title: 'Activar Modo Oscuro', subtitle: 'Cambiar visualización a oscuro', icon: 'moon', action: () => { this.setTheme('dark'); } },
      { category: 'Acciones Rápidas', title: 'Activar Modo Claro', subtitle: 'Cambiar visualización a claro', icon: 'sun', action: () => { this.setTheme('light'); } }
    ];

    // 3. Proyectos
    projects.forEach(p => {
      items.push({
        category: 'Proyectos',
        title: p.name,
        subtitle: `${p.sprint} · Calidad ${p.qualityScore}/16 (${p.methodology})`,
        icon: 'folder',
        action: () => { window.location.hash = `#projects/${p.id}`; }
      });
    });

    // 4. Miembros
    members.forEach(m => {
      items.push({
        category: 'Equipo',
        title: m.name,
        subtitle: m.email,
        icon: 'user',
        action: () => {
          window.location.hash = '#team';
          Toast.show(`Viendo actividad de ${m.name}`, 'info');
        }
      });
    });

    // Filtrado
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-subtle);">
          No se encontraron resultados para "${query}"
        </div>
      `;
      return;
    }

    // Renderizado agrupado
    const groups = {};
    filtered.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });

    let html = '';
    let globalIndex = 0;
    
    Object.keys(groups).forEach(cat => {
      html += `<div class="cmd-palette-group">`;
      html += `<div class="cmd-palette-group-title">${cat}</div>`;
      
      groups[cat].forEach(item => {
        // Icon SVG map
        let svgIcon = '';
        if (item.icon === 'grid') svgIcon = '<svg class="cmd-palette-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
        else if (item.icon === 'bell') svgIcon = '<svg class="cmd-palette-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
        else if (item.icon === 'users') svgIcon = '<svg class="cmd-palette-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
        else if (item.icon === 'settings') svgIcon = '<svg class="cmd-palette-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51v.17a2 2 0 0 1-4 0v-.08a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1h-.17a2 2 0 0 1 0-4h.08a1.65 1.65 0 0 0 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51v-.17a2 2 0 0 1 4 0v.08a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1h.17a2 2 0 0 1 0 4h-.08a1.65 1.65 0 0 0-1.51 1z"/></svg>';
        else if (item.icon === 'plus') svgIcon = '<svg class="cmd-palette-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
        else if (item.icon === 'moon') svgIcon = '<svg class="cmd-palette-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        else if (item.icon === 'sun') svgIcon = '<svg class="cmd-palette-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        else if (item.icon === 'folder') svgIcon = '<svg class="cmd-palette-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
        else if (item.icon === 'user') svgIcon = '<svg class="cmd-palette-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
        
        const isActive = globalIndex === 0 ? 'active' : '';
        
        html += `
          <div class="cmd-palette-item ${isActive}" data-index="${globalIndex}">
            ${svgIcon}
            <div style="display:flex; flex-direction:column; line-height:1.25;">
              <span style="font-weight:600; font-size:13px;">${item.title}</span>
              <span style="font-size:11px; color:var(--text-subtle);">${item.subtitle}</span>
            </div>
          </div>
        `;
        
        // Asignar el trigger al data element para activarlo luego
        overlay.setAttribute(`data-action-${globalIndex}`, globalIndex);
        this[`action_${globalIndex}`] = item.action;
        
        globalIndex++;
      });
      html += `</div>`;
    });

    resultsContainer.innerHTML = html;
    this.totalResults = globalIndex;
    this.activeIndex = 0;

    // Vincular clicks
    document.querySelectorAll('.cmd-palette-item').forEach(el => {
      el.addEventListener('click', () => {
        const index = parseInt(el.getAttribute('data-index'), 10);
        this.activeIndex = index;
        this.triggerActive();
      });
    });
  }

  static navigateResults(direction) {
    if (this.totalResults <= 0) return;

    const items = document.querySelectorAll('.cmd-palette-item');
    items[this.activeIndex].classList.remove('active');

    this.activeIndex = (this.activeIndex + direction + this.totalResults) % this.totalResults;

    const activeItem = items[this.activeIndex];
    activeItem.classList.add('active');
    
    // Auto scroll al item activo
    activeItem.scrollIntoView({ block: 'nearest' });
  }

  static triggerActive() {
    if (this.totalResults <= 0) return;
    const action = this[`action_${this.activeIndex}`];
    if (typeof action === 'function') {
      action();
      this.close();
    }
  }

  static setTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    const iconSun = document.getElementById('iconSun');
    const iconMoon = document.getElementById('iconMoon');
    
    if (iconSun && iconMoon) {
      iconSun.style.display = theme === 'dark' ? 'inline-block' : 'none';
      iconMoon.style.display = theme === 'dark' ? 'none' : 'inline-block';
    }
    
    try {
      localStorage.setItem('cadence-theme', theme);
      Toast.show(`Modo ${theme === 'dark' ? 'oscuro' : 'claro'} activado`, 'info');
    } catch (_) {}
  }
}
