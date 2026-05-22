// --- LoginView Component ---
import { store } from '../store.js';
import { Toast } from './Toast.js';

export class LoginView {
  static render() {
    const members = store.getAllMembers();

    return `
      <div class="login-page">
        <!-- Fondos con gradientes borrosos para dar atmósfera premium -->
        <div class="login-bg-glow glow-1"></div>
        <div class="login-bg-glow glow-2"></div>

        <div class="login-card-container">
          <div class="login-card">
            
            <!-- Logo SVG inline exacto al diseño del usuario -->
            <div class="login-logo-container">
              <svg width="76" height="76" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="login-logo-svg">
                <defs>
                  <linearGradient id="loginTempoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00F2FE" />
                    <stop offset="50%" stop-color="#4FACFE" />
                    <stop offset="100%" stop-color="#7F00FF" />
                  </linearGradient>
                  <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <!-- Orbitales (swooshes) -->
                <path d="M 12,50 C 12,25 35,15 65,22 C 85,26 90,45 84,65 C 78,85 55,90 32,84 C 18,80 12,65 12,50" stroke="url(#loginTempoGrad)" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.85" />
                <path d="M 88,50 C 88,75 65,85 35,78 C 15,74 10,55 16,35 C 22,15 45,10 68,16" stroke="url(#loginTempoGrad)" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.4" stroke-dasharray="6 5" />
                
                <!-- Letra T estilizada -->
                <path d="M 28,26 L 72,26 C 72,26 76,30 72,34 L 55,34 L 55,78 C 55,80 53,82 51,82 L 49,82 C 47,82 45,80 45,78 L 45,34 L 28,34 C 24,30 28,26 28,26 Z" fill="url(#loginTempoGrad)" filter="url(#glowFilter)" />
                
                <!-- Heartbeat (onda de tempo) con gap protector -->
                <path d="M 20,50 L 36,50 L 40,41 L 44,59 L 48,32 L 52,68 L 56,43 L 60,52 L 64,50 L 80,50" stroke="#0a0a0c" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <path d="M 20,50 L 36,50 L 40,41 L 44,59 L 48,32 L 52,68 L 56,43 L 60,52 L 64,50 L 80,50" stroke="url(#loginTempoGrad)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              </svg>
            </div>

            <h1 class="login-title">Tempo Agile</h1>
            <p class="login-subtitle">Quality Intelligence Platform</p>

            <form id="loginForm" class="login-form">
              <div class="form-group">
                <label for="loginEmail">Email Corporativo</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l9 6l9 -6"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>
                  <input type="email" id="loginEmail" placeholder="ejemplo@tempo.agile" required autocomplete="email" />
                </div>
              </div>

              <div class="form-group">
                <label for="loginName">Nombre Completo <span class="label-optional">(opcional)</span></label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M3 21v-2a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v2"/></svg>
                  <input type="text" id="loginName" placeholder="Tu Nombre" autocomplete="name" />
                </div>
              </div>

              <div class="form-group">
                <label for="loginPass">Contraseña</label>
                <div class="input-wrapper">
                  <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input type="password" id="loginPass" placeholder="••••••••" required value="contrasenia123" />
                </div>
              </div>

              <button type="submit" class="login-submit-btn">
                <span>Ingresar a la plataforma</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </button>
            </form>

            <div class="login-divider">
              <span>O ingresar rápido como miembro del equipo</span>
            </div>

            <div class="quick-members-grid">
              ${members.map(member => `
                <button class="quick-member-card" data-email="${member.email}" data-name="${member.name}" title="Ingresar como ${member.name}">
                  <div class="quick-avatar" style="background: ${member.color || 'var(--primary)'}">
                    ${member.avatar}
                  </div>
                  <span class="quick-name">${member.name.split(' ')[0]}</span>
                  <span class="quick-role">${member.email.includes('nikolas.studio') ? 'Dev' : 'Lead'}</span>
                </button>
              `).join('')}
            </div>

          </div>
        </div>
      </div>
    `;
  }

  static setupListeners() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const nameInput = document.getElementById('loginName');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const name = nameInput.value.trim();

        if (!email) {
          Toast.show('Por favor ingresá un correo válido', 'error');
          return;
        }

        const user = store.login(email, name);
        Toast.show(`¡Bienvenido de vuelta, ${user.name}!`, 'success');
      });
    }

    // Configurar click en tarjetas de ingreso rápido
    const quickCards = document.querySelectorAll('.quick-member-card');
    quickCards.forEach(card => {
      card.addEventListener('click', () => {
        const email = card.getAttribute('data-email');
        const name = card.getAttribute('data-name');

        if (emailInput) emailInput.value = email;
        if (nameInput) nameInput.value = name;

        // Breve animación y login
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          const user = store.login(email, name);
          Toast.show(`Sesión iniciada como ${user.name}`, 'success');
        }, 150);
      });
    });
  }
}
