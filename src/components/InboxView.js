// --- Inbox / Insights View Component ---
import { store } from '../store.js';
import { PlayableActionModal } from './PlayableActionModal.js';
import { Toast } from './Toast.js';

export class InboxView {
  static render() {
    const insights = store.getInsights();
    const projects = store.getProjects();
    
    // Contadores
    const total = insights.length;
    const criticals = insights.filter(i => i.category === 'crit').length;
    const warnings = insights.filter(i => i.category === 'warn').length;
    const suggestions = insights.filter(i => i.category === 'suggest').length;
    const infos = insights.filter(i => i.category === 'info').length;

    // --- Main Panel HTML ---
    let mainHTML = `
      <div class="view-container">
        <div class="greet" style="margin-bottom:16px;">
          <div>
            <h1>Centro de Diagnóstico e Insights</h1>
            <p>Monitoreo continuo de anomalías en el backlog, releases y colaboración.</p>
          </div>
        </div>

        <!-- Pestañas de Filtrado -->
        <div style="
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 10px;
          flex-wrap: wrap;
        ">
          <button class="btn btn-ghost filter-tab active" data-cat="all" style="padding:6px 12px; font-size:12.5px; border-radius:16px;">Todos (${total})</button>
          <button class="btn btn-ghost filter-tab" data-cat="crit" style="padding:6px 12px; font-size:12.5px; border-radius:16px; color:var(--poor);">Críticos (${criticals})</button>
          <button class="btn btn-ghost filter-tab" data-cat="warn" style="padding:6px 12px; font-size:12.5px; border-radius:16px; color:var(--risk);">Tendencias (${warnings})</button>
          <button class="btn btn-ghost filter-tab" data-cat="suggest" style="padding:6px 12px; font-size:12.5px; border-radius:16px; color:var(--good);">Sugerencias (${suggestions})</button>
          <button class="btn btn-ghost filter-tab" data-cat="info" style="padding:6px 12px; font-size:12.5px; border-radius:16px; color:var(--primary-strong);">Logros (${infos})</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:14px;" id="inbox-list-box">
    `;

    if (insights.length === 0) {
      mainHTML += `
        <div style="
          text-align: center;
          padding: 80px 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        ">
          <div style="width:56px; height:56px; border-radius:50%; background:rgba(79, 138, 110, 0.1); display:flex; align-items:center; justify-content:center;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--excellent)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 style="margin: 0; font-size:16px; font-weight:700;">¡Bandeja de entrada limpia!</h3>
          <p style="color: var(--text-muted); max-width: 320px; font-size:13px; margin: 0 auto; line-height: 1.5;">
            No hay anomalías críticas detectadas en el sprint. Todos los proyectos cumplen los estándares de calidad vigentes.
          </p>
          <button class="btn btn-primary" onclick="window.location.reload();" style="margin-top:10px;">Recargar Demo Data</button>
        </div>
      `;
    } else {
      mainHTML += insights.map(i => {
        let catClass = 'crit';
        let svgStroke = 'var(--poor)';
        let iconPath = '<path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/>';
        let typeLabel = 'Anomalía Crítica';

        if (i.category === 'warn') {
          catClass = 'warn';
          svgStroke = 'var(--risk)';
          iconPath = '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>';
          typeLabel = 'Tendencia a la baja';
        } else if (i.category === 'suggest') {
          catClass = '';
          svgStroke = 'var(--good)';
          iconPath = '<circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4 -4"/>';
          typeLabel = 'Sugerencia de Calidad';
        } else if (i.category === 'info') {
          catClass = 'info';
          svgStroke = 'var(--primary)';
          iconPath = '<path d="M9 11l3 3l8 -8"/><path d="M20 12v6a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h9"/>';
          typeLabel = 'Logro e Historial';
        }

        const project = projects.find(p => p.id === i.projectId);
        const projName = project ? project.name : 'Proyecto';

        return `
          <div class="insight ${catClass} inbox-page-card" data-cat="${i.category}" style="
            padding: 18px 20px;
            border-radius: var(--radius-lg);
            border-left-width: 4px;
            cursor: pointer;
          ">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <div class="insight-head">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${svgStroke}" stroke-width="2.3">${iconPath}</svg>
                  <span class="insight-type" style="color: ${svgStroke}; font-size:11px;">${typeLabel} · <strong>${projName}</strong></span>
                </div>
                <div class="insight-title" style="font-size:15px; margin-top:2px;">${i.title}</div>
                <div class="insight-body" style="font-size:13.5px; max-width:620px;">${i.body}</div>
              </div>
              
              <div style="display:flex; gap:8px;" class="inbox-actions-stack">
                <button class="btn btn-ghost page-dismiss-btn" data-id="${i.id}" style="padding:6px 12px; font-size:11.5px; border-radius:6px;">Posponer</button>
                <button class="btn btn-primary page-apply-btn apply" data-id="${i.id}" style="padding:6px 14px; font-size:11.5px; border-radius:6px;">${i.actionLabel}</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    mainHTML += `
        </div>
      </div>
    `;

    return {
      main: mainHTML,
      rail: '' // Sin barra lateral en el inbox para darle espacio de lectura ancho
    };
  }

  static setupListeners() {
    // 1. Filtrado de pestañas
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Switch clase activa
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.getAttribute('data-cat');
        const cards = document.querySelectorAll('.inbox-page-card');

        cards.forEach(card => {
          const cardCat = card.getAttribute('data-cat');
          if (cat === 'all' || cardCat === cat) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // 2. Eventos resolver y posponer en la página de Inbox
    const applyBtns = document.querySelectorAll('.page-apply-btn');
    applyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        PlayableActionModal.open(id);
      });
    });

    const dismissBtns = document.querySelectorAll('.page-dismiss-btn');
    dismissBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        store.dismissInsight(id);
        Toast.show('Insight pospuesto con éxito', 'info');
      });
    });

    // Permitir clic en la tarjeta entera para abrir el asistente
    const cards = document.querySelectorAll('.inbox-page-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.querySelector('.page-apply-btn').getAttribute('data-id');
        PlayableActionModal.open(id);
      });
    });
  }
}
