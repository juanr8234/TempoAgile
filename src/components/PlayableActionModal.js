// --- Playable Wizards for Resolving Insights Interactively ---
import { store } from '../store.js';
import { Toast } from './Toast.js';

export class PlayableActionModal {
  static open(insightId) {
    const insights = store.getInsights();
    const insight = insights.find(i => i.id === insightId);
    if (!insight) return;

    const project = store.getProjectById(insight.projectId);
    if (!project) return;

    const existing = document.getElementById('playable-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'playable-modal-overlay';
    overlay.className = 'modal-overlay';

    let modalTitle = '';
    let modalBodyHTML = '';
    let modalFooterHTML = '';

    // Cargar contenido basado en el tipo de acción
    if (insight.actionType === 'estimate') {
      modalTitle = `Asistente de Estimación Rápida`;
      const stories = store.getProjectStories(project.id).filter(s => s.points === null);
      
      modalBodyHTML = `
        <p style="margin-bottom: 16px; color: var(--text-muted);">
          El proyecto <strong>${project.name}</strong> tiene <strong>${stories.length} historias sin estimar</strong>. 
          Al estimarlas, mejorarás el indicador de Entregables (M1) de manera inmediata.
        </p>
        <div style="display:flex; flex-direction:column; gap:14px; max-height: 400px; overflow-y:auto; padding-right:6px;">
          ${stories.map(s => `
            <div style="background: var(--surface-2); padding: 12px; border-radius: var(--radius); border: 1px solid var(--border); display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <span class="mono" style="font-weight:600; color:var(--primary); font-size:12px;">${s.code}</span>
                <span class="badge" style="background:var(--surface);">${s.status}</span>
              </div>
              <div style="font-weight:600; font-size:13.5px;">${s.title}</div>
              <div style="display:flex; align-items:center; gap:10px; margin-top:4px;">
                <span style="font-size:12px; color:var(--text-muted); font-weight:550;">Puntos Fibonacci:</span>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                  ${[1, 2, 3, 5, 8, 13].map(pt => `
                    <button class="btn btn-ghost p-btn-${s.id}" data-id="${s.id}" data-val="${pt}" style="padding: 4px 10px; font-size:11.5px; border-radius:6px; min-width:32px;">${pt}</button>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      modalFooterHTML = `
        <button class="btn btn-ghost" id="cancel-play-btn">Cancelar</button>
        <button class="btn btn-primary" id="save-estimates-btn" style="min-width:120px;">Estimar todo</button>
      `;
    } else if (insight.actionType === 'acceptance_criteria') {
      modalTitle = `Editor de Criterios de Aceptación (M4)`;
      // Filtramos las historias sin criterios del Ecommerce Deportes
      const stories = store.getProjectStories(project.id).filter(s => !s.hasAcceptanceCriteria);
      
      modalBodyHTML = `
        <p style="margin-bottom: 16px; color: var(--text-muted);">
          El indicador de Requerimientos (M4) de <strong>${project.name}</strong> cayó debido a la falta de Criterios de Aceptación. 
          Agregá criterios para las historias listadas abajo:
        </p>
        <div style="display:flex; flex-direction:column; gap:14px; max-height:400px; overflow-y:auto; padding-right:6px;">
          ${stories.map(s => `
            <div style="background: var(--surface-2); padding: 14px; border-radius: var(--radius); border: 1px solid var(--border); display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:space-between;">
                <span class="mono" style="font-weight:600; color:var(--primary); font-size:12px;">${s.code}</span>
                <span style="font-size:12px; font-weight:550; color:var(--text-muted);">${s.points ? s.points + ' pts' : 'Sin estimar'}</span>
              </div>
              <div style="font-weight:600; font-size:13.5px; margin-bottom:4px;">${s.title}</div>
              <textarea class="form-control ac-input-${s.id}" data-id="${s.id}" style="min-height:70px; resize:vertical; font-size:12.5px;" placeholder="Ej:\n1. Dado que... \n2. Cuando se hace clic...\n3. Entonces..."></textarea>
            </div>
          `).join('')}
        </div>
      `;
      modalFooterHTML = `
        <button class="btn btn-ghost" id="cancel-play-btn">Cancelar</button>
        <button class="btn btn-primary" id="save-ac-btn">Guardar criterios</button>
      `;
    } else if (insight.actionType === 'magic_link') {
      modalTitle = `Validación Externa de Releases (M3)`;
      modalBodyHTML = `
        <div style="text-align: center; padding: 10px 0;">
          <div style="width:64px; height:64px; border-radius:50%; background:var(--primary-soft); display:flex; align-items:center; justify-content:center; margin: 0 auto 16px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          <h4 style="margin: 0 0 8px; font-size:15px; font-weight:700;">Enviar enlace de validación rápida al cliente</h4>
          <p style="color: var(--text-muted); font-size:13px; max-width: 420px; margin: 0 auto 20px; line-height: 1.5;">
            Generaremos un Magic Link temporal y se lo enviaremos al cliente de <strong>${project.name}</strong> por correo electrónico. 
            Una vez aprobado, el indicador de Cliente (M3) se elevará automáticamente.
          </p>
          
          <!-- Loader simulado -->
          <div id="loader-magic" style="display:none; flex-direction:column; align-items:center; gap:12px; margin-top:16px;">
            <div style="width:24px; height:24px; border:3px solid var(--border); border-top-color:var(--primary); border-radius:50%; animation: spin 1s infinite linear;"></div>
            <span id="loader-magic-text" style="font-size:12px; color:var(--text-muted); font-weight:550;">Enviando correo al cliente...</span>
          </div>
        </div>
      `;
      modalFooterHTML = `
        <button class="btn btn-ghost" id="cancel-play-btn">Cancelar</button>
        <button class="btn btn-primary" id="send-magic-btn">Generar y enviar link</button>
      `;
    } else if (insight.actionType === 'sprint_summary') {
      modalTitle = `Resumen Automatizado de Retro`;
      
      const stories = store.getProjectStories(project.id).filter(s => s.status === 'Completada');
      const totalPts = stories.reduce((acc, curr) => acc + (curr.points || 0), 0);
      const metrics = store.calculateProjectMetrics(project.id);
      
      const markdown = `### Reporte de Cierre de Sprint — ${project.name}
**Sprint:** ${project.sprint}
**Estado:** ¡Concluido exitosamente en Verde! 🎉

#### 📊 Logros y Métricas Clave:
* **M1 Entregables:** ${metrics.m1}/16 (Estable y al 100%)
* **M2 Equipo:** ${metrics.m2}/16 (Distribución balanceada y alta revisión)
* **M3 Cliente:** ${metrics.m3}/16 (Aprobación rápida sin retrasos)
* **M4 Requerimientos:** ${metrics.m4}/16 (100% de historias con criterios de aceptación)

#### 📝 Historias Cerradas en el Sprint (${stories.length} tareas - ${totalPts} puntos totales):
${stories.map(s => `* [x] **${s.code}** - ${s.title} (${s.points || 0} pts)`).join('\n')}

---
*Reporte generado automáticamente por Cadence Quality Intelligence.*`;

      modalBodyHTML = `
        <p style="margin-bottom: 12px; color: var(--text-muted);">
          ¡Excelente trabajo! Hemos recopilado y estructurado todos los logros del último sprint de <strong>${project.name}</strong> para que puedas compartirlo en la reunión retrospectiva:
        </p>
        <div style="position:relative;">
          <textarea id="summary-md-text" class="form-control mono" style="min-height:220px; font-size:11.5px; background:var(--surface-2); line-height:1.45; padding:12px; border:1px solid var(--border-strong);" readonly>${markdown}</textarea>
          <button class="btn btn-primary" id="copy-summary-btn" style="position:absolute; bottom:12px; right:12px; padding:6px 12px; font-size:11.5px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:2px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copiar
          </button>
        </div>
      `;
      modalFooterHTML = `
        <button class="btn btn-ghost" id="cancel-play-btn">Cerrar</button>
        <button class="btn btn-success" id="done-summary-btn">Finalizar recomendación</button>
      `;
    }

    // Renderizar modal base
    overlay.innerHTML = `
      <div class="modal" id="playable-modal">
        <div class="modal-header">
          <h3>${modalTitle}</h3>
          <button class="close-btn" id="close-play-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">
          ${modalBodyHTML}
        </div>
        <div class="modal-footer">
          ${modalFooterHTML}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Eventos genéricos de cierre
    const close = () => {
      overlay.style.animation = 'fadeIn 0.15s reverse ease-out forwards';
      document.getElementById('playable-modal').style.animation = 'fadeIn 0.15s reverse ease-out forwards';
      setTimeout(() => overlay.remove(), 150);
    };
    document.getElementById('close-play-btn').addEventListener('click', close);
    document.getElementById('cancel-play-btn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // --- Lógica Particular por Asistente ---

    // 1. Lógica de Estimación Rápida
    if (insight.actionType === 'estimate') {
      const estimates = {};
      const stories = store.getProjectStories(project.id).filter(s => s.points === null);

      // Selección de puntos
      stories.forEach(s => {
        const btns = document.querySelectorAll(`.p-btn-${s.id}`);
        btns.forEach(btn => {
          btn.addEventListener('click', () => {
            // Deseleccionar anteriores
            btns.forEach(b => {
              b.classList.remove('btn-primary');
              b.classList.add('btn-ghost');
            });
            // Seleccionar este
            btn.classList.remove('btn-ghost');
            btn.classList.add('btn-primary');
            estimates[s.id] = parseInt(btn.getAttribute('data-val'), 10);
          });
        });
      });

      // Guardar todo
      document.getElementById('save-estimates-btn').addEventListener('click', () => {
        const unestimatedLeft = stories.filter(s => !estimates[s.id]);
        if (unestimatedLeft.length > 0) {
          Toast.show(`Por favor estimá todas las historias para continuar`, 'warning');
          return;
        }

        // Aplicar al store
        Object.keys(estimates).forEach(id => {
          store.estimateStory(id, estimates[id]);
        });

        Toast.show(`¡Se estimaron correctamente las historias! Calidad global de ${project.name} en alza.`, 'success');
        close();
      });
    }

    // 2. Lógica de Criterios de Aceptación
    else if (insight.actionType === 'acceptance_criteria') {
      document.getElementById('save-ac-btn').addEventListener('click', () => {
        const textareas = document.querySelectorAll('[class^="form-control ac-input-"]');
        let filledCount = 0;

        textareas.forEach(ta => {
          const storyId = ta.getAttribute('data-id');
          const val = ta.value.trim();
          if (val) {
            store.saveAcceptanceCriteria(storyId, val);
            filledCount++;
          }
        });

        if (filledCount === 0) {
          Toast.show(`Por favor redactá criterios para al menos una historia`, 'warning');
          return;
        }

        Toast.show(`Se guardaron criterios para ${filledCount} historias. Calidad M4 actualizada.`, 'success');
        close();
      });
    }

    // 3. Lógica de Enviar Magic Link
    else if (insight.actionType === 'magic_link') {
      const sendBtn = document.getElementById('send-magic-btn');
      const loader = document.getElementById('loader-magic');
      const loaderText = document.getElementById('loader-magic-text');

      sendBtn.addEventListener('click', () => {
        sendBtn.disabled = true;
        loader.style.display = 'flex';

        // Simulación animada de pasos
        setTimeout(() => {
          loaderText.innerText = 'Magic link generado: https://cadence.io/magic-approve/t92-9h283...';
          
          setTimeout(() => {
            loaderText.innerText = 'Esperando aprobación del cliente...';
            
            setTimeout(() => {
              store.validateClientRelease(project.id);
              Toast.show(`¡Cliente aprobó el release con éxito! M3 subió a Excelente.`, 'success');
              close();
            }, 1200);

          }, 1200);

        }, 1200);
      });
    }

    // 4. Lógica de Copiar Reporte
    else if (insight.actionType === 'sprint_summary') {
      const copyBtn = document.getElementById('copy-summary-btn');
      copyBtn.addEventListener('click', () => {
        const text = document.getElementById('summary-md-text');
        text.select();
        document.execCommand('copy');
        
        copyBtn.innerText = '¡Copiado!';
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-success');

        Toast.show('Resumen copiado al portapapeles', 'success');
        
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:2px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copiar
          `;
          copyBtn.classList.remove('btn-success');
          copyBtn.classList.add('btn-primary');
        }, 2000);
      });

      document.getElementById('done-summary-btn').addEventListener('click', () => {
        store.dismissInsight(insight.id);
        Toast.show(`¡Insight de retro finalizado!`, 'success');
        close();
      });
    }
  }
}
