// --- Toast System Component ---

export class Toast {
  static init() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  static show(message, type = 'success') {
    const container = this.init();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // SVG Icons
    let icon = '';
    if (type === 'success') {
      icon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--excellent)" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>`;
    } else if (type === 'warning') {
      icon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--risk)" stroke-width="2.5" stroke-linecap="round"><path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>`;
    } else if (type === 'error') {
      icon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--poor)" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>`;
    } else {
      icon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
    }

    toast.innerHTML = `
      ${icon}
      <div class="toast-content">${message}</div>
      <button class="toast-close">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
      </button>
    `;

    container.appendChild(toast);

    // Event close click
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.style.animation = 'fadeIn 0.2s reverse ease-out forwards';
      setTimeout(() => toast.remove(), 200);
    });

    // Self-destruct
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'fadeIn 0.2s reverse ease-out forwards';
        setTimeout(() => toast.remove(), 200);
      }
    }, 3500);
  }
}
