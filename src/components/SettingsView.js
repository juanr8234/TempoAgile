// --- Settings / Ajustes View Component ---
import { store } from '../store.js';
import { Toast } from './Toast.js';

export class SettingsView {
  static render() {
    const settings = store.getSettings();
    const activeWs = store.getActiveWorkspace();

    // --- Main Panel HTML ---
    const mainHTML = `
      <div class="view-container">
        <div class="greet" style="margin-bottom:20px;">
          <div>
            <h1>Ajustes del Workspace</h1>
            <p>Configurá la ponderación de las métricas de calidad y administrá las integraciones de datos.</p>
          </div>
        </div>

        <div class="detail-grid" style="grid-template-columns: 1fr 1.2fr; gap:20px;">
          
          <!-- 1. Configuración de Nombre y Perfil -->
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div class="detail-card">
              <h3>Administración</h3>
              
              <div class="form-group" style="margin-top:12px;">
                <label for="settings-ws-name">Nombre del Workspace</label>
                <input type="text" id="settings-ws-name" class="form-control" value="${activeWs.name}" />
              </div>
              
              <button class="btn btn-primary" id="save-ws-profile-btn" style="width:100%; margin-top:8px;">Guardar cambios</button>
            </div>

            <!-- 2. Integraciones de Datos Simuladas -->
            <div class="detail-card">
              <h3>Integraciones y Webhooks</h3>
              <p style="font-size:11.5px; color:var(--text-muted); margin-bottom:12px;">Conectá fuentes externas para alimentar los indicadores automáticamente.</p>
              
              <div class="settings-switch-row">
                <div>
                  <div class="switch-label">GitHub Integration</div>
                  <div class="switch-desc">Sincroniza Pull Requests y revisiones (M2).</div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="int-github" ${settings.integrations.github ? 'checked' : ''} />
                  <span class="slider"></span>
                </label>
              </div>

              <div class="settings-switch-row">
                <div>
                  <div class="switch-label">Jira Software</div>
                  <div class="switch-desc">Ingesta de historias de usuario y sprints (M1, M4).</div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="int-jira" ${settings.integrations.jira ? 'checked' : ''} />
                  <span class="slider"></span>
                </label>
              </div>

              <div class="settings-switch-row">
                <div>
                  <div class="switch-label">Slack Webhook</div>
                  <div class="switch-desc">Notificaciones del bot de Cadence en canales.</div>
                </div>
                <label class="switch">
                  <input type="checkbox" id="int-slack" ${settings.integrations.slack ? 'checked' : ''} />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- 3. Configuración de Pesos de las Métricas -->
          <div class="detail-card" style="display:flex; flex-direction:column; gap:12px;">
            <h3>Ponderación del Algoritmo de Calidad</h3>
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
              Configurá el porcentaje de importancia para cada métrica en la Calidad Global. 
              <br/><strong style="color:var(--primary-strong);">El total debe sumar exactamente 100%</strong>.
            </p>

            ${['m1', 'm2', 'm3', 'm4'].map(mKey => {
              const val = settings.weights[mKey];
              let label = '';
              if (mKey === 'm1') label = 'M1 · Entregables (Velocity & Sprints)';
              else if (mKey === 'm2') label = 'M2 · Equipo (Colaboración & Reviews)';
              else if (mKey === 'm3') label = 'M3 · Cliente (Release Validation)';
              else if (mKey === 'm4') label = 'M4 · Requerimientos (Criterios CA)';

              return `
                <div class="form-group" style="margin-bottom:12px;">
                  <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:600; margin-bottom:4px;">
                    <span style="color:var(--text-muted);">${label}</span>
                    <span id="weight-val-${mKey}" style="color:var(--primary-strong);">${val}%</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:12px;">
                    <input type="range" id="weight-range-${mKey}" class="weight-slider" min="0" max="100" step="5" value="${val}" style="flex:1; accent-color:var(--primary);" />
                  </div>
                </div>
              `;
            }).join('')}

            <div style="
              background: var(--surface-2);
              border: 1px solid var(--border);
              padding: 12px;
              border-radius: var(--radius);
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-weight: 700;
              font-size: 13.5px;
              margin-top: 10px;
            ">
              <span>Suma total:</span>
              <span id="weights-total-indicator" style="color:var(--excellent);">100%</span>
            </div>

            <button class="btn btn-primary" id="save-weights-btn" style="margin-top:10px;">Aplicar Ponderaciones</button>
          </div>

        </div>
      </div>
    `;

    return {
      main: mainHTML,
      rail: '' // Sin barra lateral en ajustes para mayor legibilidad
    };
  }

  static setupListeners() {
    // 1. Guardar Nombre del Workspace
    const saveWsBtn = document.getElementById('save-ws-profile-btn');
    if (saveWsBtn) {
      saveWsBtn.addEventListener('click', () => {
        const nameVal = document.getElementById('settings-ws-name').value.trim();
        if (!nameVal) {
          Toast.show('Por favor ingresá un nombre válido', 'warning');
          return;
        }

        const activeWs = store.getActiveWorkspace();
        activeWs.name = nameVal;
        
        // Guardar y notificar para refrescar sidebar/topbar
        store.notify();
        Toast.show('Nombre del Workspace actualizado', 'success');
      });
    }

    // 2. Controladores de Sliders de Calidad
    const sliders = document.querySelectorAll('.weight-slider');
    const updateSumIndicator = () => {
      let sum = 0;
      sliders.forEach(s => {
        sum += parseInt(s.value, 10);
      });

      const ind = document.getElementById('weights-total-indicator');
      ind.innerText = `${sum}%`;

      if (sum === 100) {
        ind.style.color = 'var(--excellent)';
      } else {
        ind.style.color = 'var(--poor)';
      }
      return sum;
    };

    sliders.forEach(slider => {
      slider.addEventListener('input', () => {
        const key = slider.id.split('-').pop(); // m1, m2, etc.
        const indicator = document.getElementById(`weight-val-${key}`);
        indicator.innerText = `${slider.value}%`;
        updateSumIndicator();
      });
    });

    // Guardar pesos de las métricas
    const saveWeightsBtn = document.getElementById('save-weights-btn');
    if (saveWeightsBtn) {
      saveWeightsBtn.addEventListener('click', () => {
        const sum = updateSumIndicator();
        if (sum !== 100) {
          Toast.show(`El total ponderado debe sumar exactamente 100% (actualmente ${sum}%)`, 'error');
          return;
        }

        const weights = {
          m1: parseInt(document.getElementById('weight-range-m1').value, 10),
          m2: parseInt(document.getElementById('weight-range-m2').value, 10),
          m3: parseInt(document.getElementById('weight-range-m3').value, 10),
          m4: parseInt(document.getElementById('weight-range-m4').value, 10)
        };

        const integrations = {
          github: document.getElementById('int-github').checked,
          jira: document.getElementById('int-jira').checked,
          slack: document.getElementById('int-slack').checked
        };

        store.saveSettings(weights, integrations);
        Toast.show('Ponderaciones guardadas. Calidad recalculada.', 'success');
      });
    }

    // 3. Listeners rápidos en Switches de Integraciones
    ['github', 'jira', 'slack'].forEach(iKey => {
      const el = document.getElementById(`int-${iKey}`);
      if (el) {
        el.addEventListener('change', () => {
          const enabled = el.checked;
          
          // Guardar estado
          const settings = store.getSettings();
          settings.integrations[iKey] = enabled;
          store.saveToStorage();

          if (enabled) {
            Toast.show(`Sincronización con ${iKey.toUpperCase()} activada con éxito`, 'success');
          } else {
            Toast.show(`Integración con ${iKey.toUpperCase()} desconectada`, 'info');
          }
        });
      }
    });

    updateSumIndicator(); // Inicializar indicador de suma
  }
}
