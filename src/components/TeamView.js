// --- Team View Component ---
import { store } from '../store.js';

export class TeamView {
  static render() {
    const members = store.getMembers();
    const projects = store.getProjects();
    const stories = store.state.stories;

    // Calcular la carga de trabajo por miembro
    const membersWorkload = members.map(m => {
      // Filtrar proyectos asignados
      const allocatedProjects = projects.filter(p => p.members.includes(m.id));
      
      // Filtrar historias del backlog asignadas (simulado: asignadas al miembro)
      // Como las historias no tienen un memberId explícito, simulamos asignación aleatoria/determinista basada en el hash
      // O calculamos de manera directa:
      const allocatedStories = stories.filter(s => {
        const proj = projects.find(p => p.id === s.projectId);
        // Si el proyecto contiene al miembro y el código termina de forma congruente con el ID de miembro
        return proj && proj.members.includes(m.id) && (s.code.charCodeAt(s.code.length - 1) % 3 === m.id.charCodeAt(m.id.length - 1) % 3);
      });

      const totalPts = allocatedStories.reduce((acc, curr) => acc + (curr.points || 0), 0);
      const completedPts = allocatedStories.filter(s => s.status === 'Completada').reduce((acc, curr) => acc + (curr.points || 0), 0);

      // Índices de colaboración simulados estables
      let reviewRatio = 90;
      let reviewTime = '1.8h';
      if (m.id === 'm1') { reviewRatio = 96; reviewTime = '0.8h'; }
      if (m.id === 'm2') { reviewRatio = 92; reviewTime = '1.2h'; }
      if (m.id === 'm3') { reviewRatio = 88; reviewTime = '2.1h'; }
      if (m.id === 'm4') { reviewRatio = 94; reviewTime = '1.0h'; }

      return {
        ...m,
        projectsCount: allocatedProjects.length,
        totalPts,
        completedPts,
        reviewRatio,
        reviewTime
      };
    });

    // --- Main Panel HTML ---
    let mainHTML = `
      <div class="view-container">
        <div class="greet" style="margin-bottom:20px;">
          <div>
            <h1>Métricas de Equipo y Colaboración</h1>
            <p>Monitoreo del indicador M2 (Equipo): carga de trabajo, cobertura de code review y tiempos de respuesta.</p>
          </div>
        </div>

        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        ">
          ${membersWorkload.map(m => {
            const progress = m.totalPts > 0 ? (m.completedPts / m.totalPts) * 100 : 100;
            return `
              <div class="detail-card" style="display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <div class="avatar" style="
                    background: linear-gradient(135deg, ${m.color}, #ffffff40); 
                    width: 44px; height: 44px; font-size: 16px; font-weight:700;
                    border: 2px solid var(--border-strong);
                  ">${m.avatar}</div>
                  <div style="display:flex; flex-direction:column; line-height:1.25;">
                    <span style="font-weight:700; font-size:14.5px;">${m.name}</span>
                    <span style="font-size:11.5px; color:var(--text-subtle);">${m.email}</span>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; border-top:1px dashed var(--border); border-bottom:1px dashed var(--border); padding:8px 0; margin-top:4px;">
                  <div style="display:flex; flex-direction:column;">
                    <span style="font-size:10px; color:var(--text-subtle); font-weight:700; text-transform:uppercase;">Proyectos</span>
                    <span style="font-weight:700; font-size:14px; margin-top:2px;">${m.projectsCount} activos</span>
                  </div>
                  <div style="display:flex; flex-direction:column;">
                    <span style="font-size:10px; color:var(--text-subtle); font-weight:700; text-transform:uppercase;">Code Review</span>
                    <span style="font-weight:700; font-size:14px; margin-top:2px; color:var(--excellent);">${m.reviewRatio}%</span>
                  </div>
                </div>

                <!-- Carga de trabajo points -->
                <div style="display:flex; flex-direction:column; gap:4px; margin-top:4px;">
                  <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:600;">
                    <span style="color:var(--text-muted);">Carga del Sprint:</span>
                    <span>${m.completedPts}/${m.totalPts} pts (${Math.round(progress)}%)</span>
                  </div>
                  <div class="mb" style="height:6px; background:var(--surface-2); border-radius:3px; overflow:hidden;">
                    <div style="width:${progress}%; background:var(--primary); height:100%; border-radius:3px;"></div>
                  </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; margin-top:4px; color:var(--text-muted);">
                  <span>Tiempo respuesta review:</span>
                  <span class="mono" style="font-weight:600; color:var(--text);">${m.reviewTime}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Filtrar feed de actividades para que coincida con miembros del workspace activo
    const activeMemberIds = members.map(m => m.id);
    const activities = [
      { id: 'm1', text: 'estimó 3 historias pendientes.', time: 'Hace 5 min' },
      { id: 'm2', text: 'aprobó pull request #89 en API Pagos.', time: 'Hace 22 min' },
      { id: 'm3', text: 'inició refactor de base de datos.', time: 'Hace 45 min' },
      { id: 'm4', text: 'redactó criterios para US-148.', time: 'Hace 1 hora' },
      { id: 'm5', text: 'inició code-review de pasarela de pagos.', time: 'Hace 2 horas' },
      { id: 'm6', text: 'completó login con biométricos.', time: 'Hace 4 horas' }
    ].filter(a => activeMemberIds.includes(a.id));

    // --- Right Rail (Feed de Actividad) HTML ---
    const railHTML = `
      <h2>Actividad del Sprint</h2>
      <div style="display:flex; flex-direction:column; gap:16px; font-size:12px;" id="team-activity-feed">
        ${activities.map(a => {
          const m = members.find(member => member.id === a.id);
          if (!m) return '';
          return `
            <div style="display:flex; gap:8px;">
              <div class="avatar" style="width:22px; height:22px; font-size:9px; background:linear-gradient(135deg, ${m.color}, #ffffff30); flex-shrink:0;">${m.avatar}</div>
              <div style="display:flex; flex-direction:column; line-height:1.35;">
                <span><strong>${m.name}</strong> ${a.text}</span>
                <span style="color:var(--text-subtle); font-size:10px; margin-top:2px;">${a.time}</span>
              </div>
            </div>
          `;
        }).join('')}
        ${activities.length === 0 ? '<span style="color:var(--text-subtle); font-style:italic;">Sin actividad reciente en este workspace.</span>' : ''}
      </div>
    `;

    return {
      main: mainHTML,
      rail: railHTML
    };
  }

  static setupListeners() {
    // No hay event listeners interactivos complejos en esta vista estática informativa,
    // pero podemos añadir micro-interacciones.
  }
}
