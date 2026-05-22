// --- Project Detail View Component ---
import { store } from '../store.js';
import { Toast } from './Toast.js';

export class ProjectDetailView {
  static render(projectId) {
    const project = store.getProjectById(projectId);
    if (!project) {
      return {
        main: `<div class="view-container"><p>Proyecto no encontrado.</p></div>`,
        rail: ''
      };
    }

    const stories = store.getProjectStories(projectId);
    const members = store.getAllMembers();
    const projMembers = members.filter(m => project.members.includes(m.id));

    // Circunferencia del anillo de calidad
    const circumference = 263.9;
    const pcPercent = project.qualityScore / 16;
    const pcDashoffset = circumference * (1 - pcPercent);

    // Color del anillo
    let pColorClass = 'q-good';
    let pStrokeColor = 'var(--good)';
    if (project.qualityScore >= 12) {
      pColorClass = 'q-excellent';
      pStrokeColor = 'var(--excellent)';
    } else if (project.qualityScore < 6) {
      pColorClass = 'q-risk';
      pStrokeColor = 'var(--risk)';
    }
    if (project.qualityScore < 0) {
      pColorClass = 'q-poor';
      pStrokeColor = 'var(--poor)';
    }

    // --- Generación del Gráfico SVG Interactivo ---
    const history = project.metricsHistory || [];
    let svgChartHTML = '';
    
    if (history.length > 0) {
      const width = 500;
      const height = 150;
      const padding = 25;
      
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      // Encontrar escalas (x: sprints equiespaciados, y: calidad [0, 16])
      const points = history.map((h, i) => {
        const x = padding + (i / Math.max(1, history.length - 1)) * chartWidth;
        const y = padding + chartHeight - (h.q / 16) * chartHeight;
        return { x, y, sprint: h.sprint, q: h.q };
      });

      // Crear path
      const pathD = points.reduce((acc, curr, i) => {
        return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
      }, '');

      // Path de área para gradiente de fondo
      const areaD = points.length > 0 
        ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
        : '';

      svgChartHTML = `
        <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">
          <defs>
            <linearGradient id="chart-grad-${projectId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.00"/>
            </linearGradient>
          </defs>
          
          <!-- Eje horizontal grid -->
          <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="var(--border)" stroke-dasharray="4" stroke-width="1"/>
          <line x1="${padding}" y1="${padding + chartHeight / 2}" x2="${width - padding}" y2="${padding + chartHeight / 2}" stroke="var(--border)" stroke-dasharray="4" stroke-width="1"/>
          <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border)" stroke-width="1"/>
          
          <!-- Área coloreada -->
          ${areaD ? `<path d="${areaD}" fill="url(#chart-grad-${projectId})"/>` : ''}
          
          <!-- Línea de tendencia -->
          ${pathD ? `<path d="${pathD}" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 2px 4px var(--primary-soft));"/>` : ''}
          
          <!-- Puntos interactivos -->
          ${points.map((p, i) => `
            <circle class="chart-dot" cx="${p.x}" cy="${p.y}" r="5" fill="var(--surface)" stroke="var(--primary)" stroke-width="2.5" 
              data-sprint="${p.sprint}" data-q="${p.q}"/>
          `).join('')}
          
          <!-- Etiquetas eje X -->
          ${points.map(p => `
            <text x="${p.x}" y="${height - 8}" text-anchor="middle" font-size="9" fill="var(--text-subtle)" font-family="monospace">${p.sprint}</text>
          `).join('')}
        </svg>
      `;
    } else {
      svgChartHTML = `<div style="text-align:center; padding:50px 0; color:var(--text-subtle);">Historial insuficiente.</div>`;
    }

    // --- Main Panel HTML ---
    const mainHTML = `
      <div class="view-container">
        
        <!-- Header del Proyecto -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span class="badge" style="background:var(--primary-soft); color:var(--primary-strong); border-color:var(--primary-soft);">${project.methodology}</span>
              <span style="font-size:12px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">${project.status}</span>
            </div>
            <h1 style="font-size:24px; font-weight:700; margin:0; letter-spacing:-0.02em;">${project.name}</h1>
            <p style="margin:4px 0 0; color:var(--text-muted); font-size:13.5px;">Panel de diagnóstico exhaustivo y Sprint Backlog activo.</p>
          </div>
          
          <div style="display:flex; align-items:center; gap:14px; background:var(--surface); border:1px solid var(--border); padding:8px 14px; border-radius:var(--radius-lg);">
            <div class="ring" style="width:52px; height:52px;">
              <svg viewBox="0 0 100 100">
                <circle class="track" cx="50" cy="50" r="42"/>
                <circle class="fill" cx="50" cy="50" r="42" 
                  stroke-dasharray="${circumference}" 
                  stroke-dashoffset="${pcDashoffset}" 
                  stroke="${pStrokeColor}"/>
              </svg>
              <div class="num" style="font-size:14px; font-weight:700;"><span class="${pColorClass}">${project.qualityScore}</span></div>
            </div>
            <div style="line-height:1.3;">
              <div style="font-size:10px; text-transform:uppercase; color:var(--text-subtle); font-weight:700; letter-spacing:0.04em;">Calidad General</div>
              <div style="font-size:13.5px; font-weight:700;" class="${pColorClass}">
                ${project.qualityScore >= 12 ? 'Excelente' : project.qualityScore >= 6 ? 'Aceptable' : project.qualityScore >= 0 ? 'Riesgo' : 'Deficiente'}
              </div>
            </div>
          </div>
        </div>

        <!-- Fila de Detalles: Tendencia + Desglose de Métricas -->
        <div class="detail-grid">
          <!-- Gráfico de tendencia -->
          <div class="detail-card" style="position:relative;">
            <h3>Tendencia de Calidad</h3>
            <div class="chart-container" id="trend-chart-box">
              ${svgChartHTML}
              <div class="chart-tooltip" id="chart-tooltip"></div>
            </div>
          </div>

          <!-- Métricas individuales -->
          <div class="detail-card" style="display:flex; flex-direction:column; gap:12px;">
            <h3>Métricas de Calidad</h3>
            
            ${['m1', 'm2', 'm3', 'm4'].map(mKey => {
              const val = project.metrics[mKey];
              let mLabel = '';
              let mDesc = '';
              if (mKey === 'm1') { mLabel = 'M1 · Entregables'; mDesc = 'Ratio completado vs estimado'; }
              else if (mKey === 'm2') { mLabel = 'M2 · Equipo'; mDesc = 'Estabilidad y revisión de código'; }
              else if (mKey === 'm3') { mLabel = 'M3 · Cliente'; mDesc = 'Feedback y aprobación release'; }
              else if (mKey === 'm4') { mLabel = 'M4 · Requerimientos'; mDesc = 'US con Criterios de Aceptación'; }

              const color = val >= 12 ? 'var(--excellent)' : val >= 6 ? 'var(--good)' : val >= 0 ? 'var(--risk)' : 'var(--poor)';

              return `
                <div style="display:flex; flex-direction:column; gap:4px;">
                  <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
                    <span style="color:var(--text-muted);">${mLabel}</span>
                    <span style="color:${color};">${val}/16</span>
                  </div>
                  <div class="mb" style="height:6px; background:var(--surface-2); border-radius:3px; overflow:hidden;">
                    <div style="width:${(val / 16) * 100}%; background:${color}; height:100%; border-radius:3px; transition:width 0.5s;"></div>
                  </div>
                  <span style="font-size:10.5px; color:var(--text-subtle);">${mDesc}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Backlog / Tabla de Historias -->
        <div class="detail-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="margin:0;">Sprint Backlog (${stories.length} historias)</h3>
            <span style="font-size:11px; color:var(--text-subtle); font-weight:550; display:flex; gap:10px;">
              <span>💡 Hacé clic en el Estado de una US para cambiarlo</span>
            </span>
          </div>

          <div class="backlog-table-wrapper">
            <table class="backlog-table">
              <thead>
                <tr>
                  <th style="width:10%;">Código</th>
                  <th style="width:45%;">Título de la Historia</th>
                  <th style="width:15%;">Estimación</th>
                  <th style="width:15%;">Criterios</th>
                  <th style="width:15%;">Estado</th>
                </tr>
              </thead>
              <tbody>
                ${stories.map(s => {
                  let pointsHTML = '';
                  if (s.points !== null) {
                    pointsHTML = `<span class="mono" style="font-weight:600;">${s.points} pts</span>`;
                  } else {
                    pointsHTML = `
                      <div style="display:flex; align-items:center; gap:6px;">
                        <span class="badge" style="background:rgba(168,81,73,0.08); color:var(--poor); border-color:rgba(168,81,73,0.15); padding:1px 4px; font-size:9px;">S/E</span>
                        <button class="btn-inline-est btn-ghost" data-id="${s.id}" style="padding:2px 6px; font-size:10px; border-radius:4px; border:1px solid var(--border);">Estimar</button>
                      </div>
                    `;
                  }

                  let acHTML = '';
                  if (s.hasAcceptanceCriteria) {
                    acHTML = `<span class="ac-tag view-ac-trigger" data-id="${s.id}" style="cursor:pointer;" title="Hacé clic para ver criterios">Ver CA</span>`;
                  } else {
                    acHTML = `
                      <div style="display:flex; align-items:center; gap:6px;">
                        <span class="ac-tag missing">Falta</span>
                        <button class="btn-inline-ac btn-ghost" data-id="${s.id}" style="padding:2px 6px; font-size:10px; border-radius:4px; border:1px solid var(--border);">Redactar</button>
                      </div>
                    `;
                  }

                  let statusBadgeColor = 'var(--text-subtle)';
                  let statusBg = 'var(--surface-2)';
                  if (s.status === 'Completada') {
                    statusBadgeColor = 'white';
                    statusBg = 'var(--excellent)';
                  } else if (s.status === 'En Proceso') {
                    statusBadgeColor = 'var(--primary-strong)';
                    statusBg = 'var(--primary-soft)';
                  }

                  return `
                    <tr>
                      <td class="mono" style="font-weight:600; font-size:12px; color:var(--primary-strong);">${s.code}</td>
                      <td>
                        <div style="font-weight:600; font-size:13.5px;">${s.title}</div>
                      </td>
                      <td>${pointsHTML}</td>
                      <td>${acHTML}</td>
                      <td>
                        <span class="badge cycle-status-btn" data-id="${s.id}" style="cursor:pointer; background:${statusBg}; color:${statusBadgeColor}; border:0; padding:4px 8px; font-weight:600; user-select:none;">
                          ${s.status}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // --- Right Rail (Project Team) HTML ---
    const railHTML = `
      <h2>Equipo asignado</h2>
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:24px;">
        ${projMembers.map(m => `
          <div style="display:flex; align-items:center; gap:10px; padding:6px 0;">
            <div class="avatar" style="background: linear-gradient(135deg, ${m.color}, #ffffff50); border: 2px solid var(--border-strong); width:32px; height:32px; font-size:13px;">${m.avatar}</div>
            <div style="display:flex; flex-direction:column; line-height:1.25;">
              <span style="font-weight:600; font-size:13px;">${m.name}</span>
              <span style="font-size:11px; color:var(--text-subtle);">${m.id === 'm1' ? 'Líder de Proyecto' : 'Desarrollador'}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <h2>Historial de Integración</h2>
      <div style="display:flex; flex-direction:column; gap:12px; font-size:12px;">
        <div style="display:flex; gap:8px;">
          <span style="width:6px; height:6px; background:var(--excellent); border-radius:50%; margin-top:5px; flex-shrink:0;"></span>
          <div style="display:flex; flex-direction:column; line-height:1.35;">
            <span style="font-weight:600;">Calidad recalculada con éxito</span>
            <span style="color:var(--text-muted); font-size:11px;">Métricas M1-M4 sincronizadas.</span>
            <span style="color:var(--text-subtle); font-size:10px; margin-top:2px;">Hace unos instantes</span>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <span style="width:6px; height:6px; background:var(--border-strong); border-radius:50%; margin-top:5px; flex-shrink:0;"></span>
          <div style="display:flex; flex-direction:column; line-height:1.35;">
            <span style="font-weight:600;">Webhook de GitHub activado</span>
            <span style="color:var(--text-muted); font-size:11px;">Pull Requests sincronizados.</span>
            <span style="color:var(--text-subtle); font-size:10px; margin-top:2px;">Hace 2 horas</span>
          </div>
        </div>
      </div>
    `;

    return {
      main: mainHTML,
      rail: railHTML
    };
  }

  static setupListeners(projectId) {
    // 1. Hover e Interacción en el Gráfico SVG de Tendencia
    const dots = document.querySelectorAll('.chart-dot');
    const tooltip = document.getElementById('chart-tooltip');
    
    dots.forEach(dot => {
      dot.addEventListener('mousemove', (e) => {
        const sprint = dot.getAttribute('data-sprint');
        const q = dot.getAttribute('data-q');
        
        tooltip.innerHTML = `<div>Sprint: <strong>${sprint}</strong></div><div>Calidad: <strong>${q}/16</strong></div>`;
        tooltip.style.opacity = '1';
        
        // Posicionamiento relativo al contenedor
        const rect = document.getElementById('trend-chart-box').getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left + 12}px`;
        tooltip.style.top = `${e.clientY - rect.top - 38}px`;
      });

      dot.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
    });

    // 2. Estimación rápida en línea (Inline Estimation)
    const estBtns = document.querySelectorAll('.btn-inline-est');
    estBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const storyId = btn.getAttribute('data-id');
        this.openInlineEstimator(btn, storyId, projectId);
      });
    });

    // 3. Redacción rápida de Criterios de Aceptación (Inline AC)
    const acBtns = document.querySelectorAll('.btn-inline-ac');
    acBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const storyId = btn.getAttribute('data-id');
        this.openInlineAcEditor(btn, storyId, projectId);
      });
    });

    // 4. Ver criterios de aceptación cargados
    const viewAcTriggers = document.querySelectorAll('.view-ac-trigger');
    viewAcTriggers.forEach(tr => {
      tr.addEventListener('click', (e) => {
        e.stopPropagation();
        const storyId = tr.getAttribute('data-id');
        this.showAcModal(storyId);
      });
    });

    // 5. Ciclado rápido de estados de User Story
    const statusBtns = document.querySelectorAll('.cycle-status-btn');
    statusBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const storyId = btn.getAttribute('data-id');
        
        const story = store.state.stories.find(s => s.id === storyId);
        if (story) {
          const states = ['Pendiente', 'En Proceso', 'Completada'];
          const nextIndex = (states.indexOf(story.status) + 1) % states.length;
          story.status = states[nextIndex];

          // Recalcular métricas de Entregables (M1) automáticamente
          store.notify();
          Toast.show(`Estado de ${story.code} cambiado a: ${story.status}`, 'success');
        }
      });
    });
  }

  static openInlineEstimator(element, storyId, projectId) {
    const existing = document.getElementById('inline-dropdown');
    if (existing) existing.remove();

    const rect = element.getBoundingClientRect();
    const dropdown = document.createElement('div');
    dropdown.id = 'inline-dropdown';
    dropdown.style.cssText = `
      position: fixed;
      top: ${rect.bottom + 4}px;
      left: ${rect.left}px;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-md);
      z-index: 10000;
      padding: 6px;
      display: flex;
      gap: 4px;
      animation: fadeUp 0.1s ease-out;
    `;

    dropdown.innerHTML = [1, 2, 3, 5, 8, 13].map(pt => `
      <button class="btn btn-ghost inline-pt-btn" data-val="${pt}" style="padding:4px 8px; font-size:11px; min-width:28px;">${pt}</button>
    `).join('');

    document.body.appendChild(dropdown);

    dropdown.querySelectorAll('.inline-pt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-val'), 10);
        store.estimateStory(storyId, val);
        Toast.show(`Estimación fijada en ${val} pts`, 'success');
        dropdown.remove();
      });
    });

    const closeDropdown = (e) => {
      if (!dropdown.contains(e.target) && e.target !== element) {
        dropdown.remove();
        document.removeEventListener('click', closeDropdown);
      }
    };
    setTimeout(() => document.addEventListener('click', closeDropdown), 0);
  }

  static openInlineAcEditor(element, storyId, projectId) {
    const existing = document.getElementById('inline-ac-box');
    if (existing) existing.remove();

    const rect = element.getBoundingClientRect();
    const box = document.createElement('div');
    box.id = 'inline-ac-box';
    box.style.cssText = `
      position: fixed;
      top: ${rect.bottom + 4}px;
      left: ${Math.max(16, rect.left - 240)}px;
      width: 300px;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      animation: fadeUp 0.15s ease-out;
    `;

    box.innerHTML = `
      <div style="font-weight:600; font-size:12px; color:var(--text-muted);">Redactar Criterios de Aceptación</div>
      <textarea id="inline-ac-textarea" class="form-control" style="min-height:70px; font-size:12px;" placeholder="1. Dado que...\n2. Cuando...\n3. Entonces..."></textarea>
      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button class="btn btn-ghost" id="inline-ac-cancel" style="padding:4px 8px; font-size:11px;">Cancelar</button>
        <button class="btn btn-primary" id="inline-ac-save" style="padding:4px 10px; font-size:11px;">Guardar</button>
      </div>
    `;

    document.body.appendChild(box);
    document.getElementById('inline-ac-textarea').focus();

    document.getElementById('inline-ac-cancel').addEventListener('click', () => box.remove());
    document.getElementById('inline-ac-save').addEventListener('click', () => {
      const val = document.getElementById('inline-ac-textarea').value.trim();
      if (val) {
        store.saveAcceptanceCriteria(storyId, val);
        Toast.show('Criterios de Aceptación guardados', 'success');
      }
      box.remove();
    });

    const closeBox = (e) => {
      if (!box.contains(e.target) && e.target !== element) {
        box.remove();
        document.removeEventListener('click', closeBox);
      }
    };
    setTimeout(() => document.addEventListener('click', closeBox), 0);
  }

  static showAcModal(storyId) {
    const story = store.state.stories.find(s => s.id === storyId);
    if (!story) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" style="max-width: 440px;">
        <div class="modal-header">
          <h3>Criterios de Aceptación: ${story.code}</h3>
          <button class="close-btn" id="close-ac-view-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body" style="padding: 16px 20px;">
          <div style="font-weight: 600; font-size: 13.5px; margin-bottom: 8px;">${story.title}</div>
          <pre style="
            background: var(--surface-2);
            border: 1px solid var(--border);
            padding: 12px;
            border-radius: var(--radius);
            font-family: inherit;
            white-space: pre-wrap;
            font-size: 12.5px;
            color: var(--text-muted);
            margin: 0;
            line-height: 1.5;
          ">${story.acText}</pre>
        </div>
        <div class="modal-footer" style="padding: 10px 16px;">
          <button class="btn btn-primary" id="close-ac-view-btn-2">Entendido</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById('close-ac-view-btn').addEventListener('click', close);
    document.getElementById('close-ac-view-btn-2').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  }
}
