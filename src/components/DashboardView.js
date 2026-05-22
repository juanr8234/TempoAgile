// --- Dashboard View Component ---
import { store } from '../store.js';
import { PlayableActionModal } from './PlayableActionModal.js';
import { Toast } from './Toast.js';

export class DashboardView {
  static render() {
    const projects = store.getProjects();
    const insights = store.getInsights();
    const globalQuality = store.getGlobalWorkspaceMetrics();
    const members = store.getAllMembers();

    // Obtener fecha actual en formato "viernes, 22 mayo 2026"
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = today.toLocaleDateString('es-ES', options);

    // Encontrar primer proyecto activo en el workspace actual para el "Sprint activo" del Dashboard
    const activeProject = projects.find(p => p.status === 'activo') || projects[0];
    const activeStories = activeProject ? store.getProjectStories(activeProject.id) : [];
    const activeUnestimated = activeStories.filter(s => s.points === null).length;
    const activeSprintNum = activeProject ? activeProject.sprint.replace(/^\D+/g, '') : '--';

    // Calcular circunferencia y stroke-dashoffset para el anillo global
    // Radio r=42 -> Circunferencia ~ 263.9
    const circumference = 263.9;
    const globalPercent = globalQuality.score / 16;
    const globalDashoffset = circumference * (1 - globalPercent);

    // Mapeo de clase de color para el anillo global
    let globalColorClass = 'q-good';
    let globalStrokeColor = 'var(--good)';
    if (globalQuality.score >= 12) {
      globalColorClass = 'q-excellent';
      globalStrokeColor = 'var(--excellent)';
    } else if (globalQuality.score < 6 && globalQuality.score >= 0) {
      globalColorClass = 'q-risk';
      globalStrokeColor = 'var(--risk)';
    } else if (globalQuality.score < 0) {
      globalColorClass = 'q-poor';
      globalStrokeColor = 'var(--poor)';
    }

    // --- Main Panel HTML ---
    const mainHTML = `
      <div class="view-container">
        <div class="greet">
          <div>
            <h1>Buenas tardes, Juan</h1>
            <p>Tenés <strong>${insights.length} insights</strong> esperándote y un sprint que termina mañana.</p>
          </div>
          <div class="date">${dateStr}</div>
        </div>

        <div class="pulse-row">
          <!-- Tarjeta Calidad Global -->
          <div class="stat stat-pulse" onclick="window.location.hash='#settings'" style="cursor:pointer;" title="Ver ajustes de calidad">
            <div class="ring">
              <svg viewBox="0 0 100 100">
                <circle class="track" cx="50" cy="50" r="42"/>
                <circle class="fill" cx="50" cy="50" r="42" 
                  stroke-dasharray="${circumference}" 
                  stroke-dashoffset="${globalDashoffset}" 
                  stroke="${globalStrokeColor}"/>
              </svg>
              <div class="num"><span class="${globalColorClass}">${globalQuality.score}</span><small>/16</small></div>
            </div>
            <div>
              <div class="label">Calidad global · workspace</div>
              <div class="value ${globalColorClass}">${globalQuality.label} <span class="delta up">${globalQuality.delta}</span></div>
              <div class="sub">Promediado sobre ${projects.length} proyectos activos · últimos 7 días</div>
            </div>
          </div>

          <!-- Tarjeta Sprint Activo -->
          <div class="stat" ${activeProject ? `onclick="window.location.hash='#projects/${activeProject.id}'"` : `onclick="window.location.hash='#dashboard'"`} style="cursor:pointer;" title="${activeProject ? `Ver detalles de ${activeProject.name}` : 'Sin proyectos'}">
            <div class="label">Sprint activo</div>
            <div class="value">${activeSprintNum}<span style="color: var(--text-muted); font-size: 14px; font-weight: 550;">${activeProject ? ` · ${activeProject.name}` : ' · Sin proyectos'}</span></div>
            <div class="sub">Termina mañana · ${activeProject ? (activeUnestimated > 0 ? `<strong class="q-poor">${activeUnestimated} US sin estimar</strong>` : 'Cero tareas sin estimar') : 'No hay sprints activos'}</div>
          </div>

          <!-- Tarjeta Velocidad Media -->
          <div class="stat" onclick="window.location.hash='#team'" style="cursor:pointer;" title="Ver métricas del equipo">
            <div class="label">Velocidad media</div>
            <div class="value">28 <span class="mono" style="font-size:12px; color: var(--text-muted); font-weight:600;">pts/sprint</span> <span class="delta up">+12%</span></div>
            <div class="sub">vs. trimestre anterior</div>
          </div>
        </div>

        <div class="section-head">
          <h2>Proyectos · calidad por métrica</h2>
          <div class="actions">
            <button class="btn btn-ghost" id="sort-projects-btn" style="font-size:12px; padding:4px 9px;">Más recientes ▾</button>
          </div>
        </div>

        <div class="projects-grid" id="projects-grid-container">
          ${projects.map(p => {
            // Circunferencia del miniring (r=42)
            const pcPercent = p.qualityScore / 16;
            const pcDashoffset = circumference * (1 - pcPercent);

            // Determinar color
            let pColorClass = 'q-good';
            let pStrokeColor = 'var(--good)';
            if (p.qualityScore >= 12) {
              pColorClass = 'q-excellent';
              pStrokeColor = 'var(--excellent)';
            } else if (p.qualityScore < 6) {
              pColorClass = 'q-risk';
              pStrokeColor = 'var(--risk)';
            }
            if (p.qualityScore < 0) {
              pColorClass = 'q-poor';
              pStrokeColor = 'var(--poor)';
            }

            // Mapear avatares
            const projMembers = members.filter(m => p.members.includes(m.id));

            return `
              <article class="project-card" data-id="${p.id}">
                <div class="pc-head">
                  <div>
                    <div class="pc-title">${p.name}</div>
                    <div class="pc-sub">${p.sprint} · ${p.status}</div>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
                    <span class="badge">${p.methodology}</span>
                    <div class="ring" style="width:48px;height:48px;">
                      <svg viewBox="0 0 100 100">
                        <circle class="track" cx="50" cy="50" r="42"/>
                        <circle class="fill" cx="50" cy="50" r="42" 
                          stroke-dasharray="${circumference}" 
                          stroke-dashoffset="${pcDashoffset}" 
                          stroke="${pStrokeColor}"/>
                      </svg>
                      <div class="num" style="font-size:13px;"><span class="${pColorClass}">${p.qualityScore}</span></div>
                    </div>
                  </div>
                </div>
                
                <!-- 4 Metrics bar -->
                <div class="pc-metrics">
                  <div class="m-bar" title="M1 Entregables: ${p.metrics.m1}/16">
                    <span class="ml">M1</span>
                    <div class="mb">
                      <i style="width:${(p.metrics.m1 / 16) * 100}%; background: ${this.getMetricColor(p.metrics.m1)};"></i>
                    </div>
                  </div>
                  <div class="m-bar" title="M2 Equipo: ${p.metrics.m2}/16">
                    <span class="ml">M2</span>
                    <div class="mb">
                      <i style="width:${(p.metrics.m2 / 16) * 100}%; background: ${this.getMetricColor(p.metrics.m2)};"></i>
                    </div>
                  </div>
                  <div class="m-bar" title="M3 Cliente: ${p.metrics.m3}/16">
                    <span class="ml">M3</span>
                    <div class="mb">
                      <i style="width:${(p.metrics.m3 / 16) * 100}%; background: ${this.getMetricColor(p.metrics.m3)};"></i>
                    </div>
                  </div>
                  <div class="m-bar" title="M4 Requerimientos: ${p.metrics.m4}/16">
                    <span class="ml">M4</span>
                    <div class="mb">
                      <i style="width:${(p.metrics.m4 / 16) * 100}%; background: ${this.getMetricColor(p.metrics.m4)};"></i>
                    </div>
                  </div>
                </div>

                <div class="pc-foot">
                  <div class="avatars">
                    ${projMembers.map(m => `
                      <div class="avatar" style="background: linear-gradient(135deg, ${m.color}, #ffffff50); border: 2px solid var(--surface);" title="${m.name}">${m.avatar}</div>
                    `).join('')}
                    ${p.id === 'p1' ? '<div class="more">+2</div>' : ''}
                    ${p.id === 'p3' ? '<div class="more">+3</div>' : ''}
                  </div>
                  <span class="last-sync">
                    <span style="width:6px;height:6px;background:${p.syncStatus === 'excellent' ? 'var(--excellent)' : p.syncStatus === 'risk' ? 'var(--risk)' : 'var(--border-strong)'};border-radius:50%;display:inline-block;"></span>
                    sync ${p.lastSync}
                  </span>
                </div>
              </article>
            `;
          }).join('')}
        </div>

        <div class="legend-row">
          <span><span class="legend-dot bg-excellent"></span>Excelente · 12+</span>
          <span><span class="legend-dot bg-good"></span>Aceptable · 6 a 11</span>
          <span><span class="legend-dot bg-risk"></span>Riesgo · 0 a 5</span>
          <span><span class="legend-dot bg-poor"></span>Deficiente · &lt; 0</span>
          <span style="margin-left:auto;">M1 Entregables · M2 Equipo · M3 Cliente · M4 Requerimientos</span>
        </div>
      </div>
    `;

    // --- Right Rail (Inbox) HTML ---
    let railHTML = `<h2>Inbox · insights</h2>`;
    
    if (insights.length === 0) {
      railHTML += `
        <div style="text-align:center; padding:40px 0; color:var(--text-subtle); display:flex; flex-direction:column; align-items:center; gap:10px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
          <span style="font-weight:550; font-size:13px;">¡Todo al día!</span>
          <span style="font-size:11px; max-width:180px;">No tenés recomendaciones de calidad pendientes de resolución.</span>
        </div>
      `;
    } else {
      railHTML += insights.map(i => {
        let catClass = 'crit';
        let svgStroke = 'var(--poor)';
        let iconPath = '<path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/>';
        let typeLabel = 'Crítico';

        if (i.category === 'warn') {
          catClass = 'warn';
          svgStroke = 'var(--risk)';
          iconPath = '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>';
          typeLabel = 'Tendencia';
        } else if (i.category === 'suggest') {
          catClass = '';
          svgStroke = 'var(--good)';
          iconPath = '<circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4 -4"/>';
          typeLabel = 'Sugerencia';
        } else if (i.category === 'info') {
          catClass = 'info';
          svgStroke = 'var(--primary)';
          iconPath = '<path d="M9 11l3 3l8 -8"/><path d="M20 12v6a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h9"/>';
          typeLabel = 'Logro';
        }

        const projectOfInsight = projects.find(p => p.id === i.projectId);
        const projName = projectOfInsight ? projectOfInsight.name : 'Proyecto';

        return `
          <div class="insight ${catClass}" data-id="${i.id}">
            <div class="insight-head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${svgStroke}" stroke-width="2.3">${iconPath}</svg>
              <span class="insight-type" style="color: ${svgStroke};">${typeLabel} · ${projName}</span>
            </div>
            <div class="insight-title">${i.title}</div>
            <div class="insight-body">${i.body}</div>
            <div class="insight-actions">
              <button class="dismiss-btn" data-id="${i.id}">Después</button>
              <button class="apply-btn apply" data-id="${i.id}">${i.actionLabel}</button>
            </div>
          </div>
        `;
      }).join('');
    }

    return {
      main: mainHTML,
      rail: railHTML
    };
  }

  static setupListeners() {
    // Escuchar redirección a detalle de proyecto
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        window.location.hash = `#projects/${id}`;
      });
    });

    // Escuchar ordenamiento de proyectos
    const sortBtn = document.getElementById('sort-projects-btn');
    if (sortBtn) {
      sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        Toast.show('Filtro "Más recientes" aplicado', 'info');
      });
    }

    // Escuchar botones de Insights (Inbox Rail)
    const applyBtns = document.querySelectorAll('.apply-btn');
    applyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        PlayableActionModal.open(id);
      });
    });

    const dismissBtns = document.querySelectorAll('.dismiss-btn');
    dismissBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        store.dismissInsight(id);
        Toast.show('Insight pospuesto', 'info');
      });
    });
  }

  static getMetricColor(score) {
    if (score >= 12) return 'var(--excellent)';
    if (score >= 6) return 'var(--good)';
    if (score >= 0) return 'var(--risk)';
    return 'var(--poor)';
  }
}
