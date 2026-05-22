// --- Modal to Create New User Stories ---
import { store } from '../store.js';
import { Toast } from './Toast.js';

export class NewStoryModal {
  static open() {
    const existing = document.getElementById('new-story-modal-overlay');
    if (existing) existing.remove();

    const projects = store.getProjects();
    const overlay = document.createElement('div');
    overlay.id = 'new-story-modal-overlay';
    overlay.className = 'modal-overlay';

    overlay.innerHTML = `
      <div class="modal" id="new-story-modal">
        <div class="modal-header">
          <h3>Nueva historia de usuario</h3>
          <button class="close-btn" id="close-modal-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <form id="new-story-form">
            <div class="form-group">
              <label for="story-title">Título de la historia *</label>
              <input type="text" id="story-title" class="form-control" placeholder="Ej. Integrar pasarela de cobro local" required />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="story-project">Proyecto *</label>
                <select id="story-project" class="form-control" required>
                  ${projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label for="story-points">Puntos de historia (Estimación)</label>
                <select id="story-points" class="form-control">
                  <option value="">Sin estimar (Pendiente)</option>
                  <option value="1">1 pt</option>
                  <option value="2">2 pts</option>
                  <option value="3">3 pts</option>
                  <option value="5">5 pts</option>
                  <option value="8">8 pts</option>
                  <option value="13">13 pts</option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-top: 10px;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="story-has-ac" style="width: 16px; height: 16px;" />
                <span>¿Incluye criterios de aceptación?</span>
              </label>
            </div>

            <div class="form-group" id="story-ac-wrapper" style="display: none; transition: all 0.2s;">
              <label for="story-ac">Criterios de aceptación</label>
              <textarea id="story-ac" class="form-control" style="min-height: 80px; resize: vertical;" placeholder="1. Dado un usuario autenticado...\n2. Cuando completa los campos..."></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="cancel-modal-btn">Cancelar</button>
          <button class="btn btn-primary" id="save-story-btn">Guardar historia</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-modal-btn');
    const saveBtn = document.getElementById('save-story-btn');
    const checkboxAc = document.getElementById('story-has-ac');
    const acWrapper = document.getElementById('story-ac-wrapper');
    const form = document.getElementById('new-story-form');

    const close = () => {
      overlay.style.animation = 'fadeIn 0.15s reverse ease-out forwards';
      document.getElementById('new-story-modal').style.animation = 'fadeIn 0.15s reverse ease-out forwards';
      setTimeout(() => overlay.remove(), 150);
    };

    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    checkboxAc.addEventListener('change', () => {
      acWrapper.style.display = checkboxAc.checked ? 'block' : 'none';
      if (checkboxAc.checked) {
        document.getElementById('story-ac').focus();
      }
    });

    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const title = document.getElementById('story-title').value;
      const projectId = document.getElementById('story-project').value;
      const points = document.getElementById('story-points').value;
      const hasAc = checkboxAc.checked;
      const acText = hasAc ? document.getElementById('story-ac').value : '';

      const newStory = store.createStory({
        projectId,
        title,
        points,
        hasAcceptanceCriteria: hasAc,
        acText
      });

      if (newStory) {
        const projName = projects.find(p => p.id === projectId).name;
        Toast.show(`Historia ${newStory.code} creada en ${projName}`, 'success');
        close();
      } else {
        Toast.show('Error al guardar la historia de usuario', 'error');
      }
    });
  }
}
