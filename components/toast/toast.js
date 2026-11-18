export class ToastManager {
    container;
    constructor(containerId = 'toast-container') {
        const existing = document.getElementById(containerId);
        if (existing) {
            this.container = existing;
        }
        else {
            this.container = document.createElement('div');
            this.container.id = containerId;
            this.container.className = 'toast-container';
            this.container.setAttribute('aria-live', 'polite');
            document.body.appendChild(this.container);
        }
    }
    show(options) {
        const { title, message = '', variant = 'default', duration = 3500, icon = this.getDefaultIcon(variant) } = options;
        // Crear el elemento principal
        const toast = document.createElement('div');
        toast.className = `toast ${variant !== 'default' ? `toast-${variant}` : ''}`.trim();
        // Estructura interna
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast-content">
                <h5 class="toast-title">${title}</h5>
                ${message ? `<p class="toast-message">${message}</p>` : ''}
            </div>
            <button type="button" class="toast-close" aria-label="Cerrar">
                <i class="ri-close-line"></i>
            </button>
            <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
        `;
        // Evento de cierre manual
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn?.addEventListener('click', () => this.dismiss(toast));
        // Agregar al DOM y disparar animación de entrada
        this.container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        // Auto-cierre al terminar el tiempo
        const timeoutId = window.setTimeout(() => {
            this.dismiss(toast);
        }, duration);
        // Limpiar timeout si se cierra manualmente antes
        closeBtn?.addEventListener('click', () => clearTimeout(timeoutId), { once: true });
    }
    dismiss(toast) {
        if (toast.classList.contains('hide'))
            return;
        toast.classList.remove('show');
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        }, { once: true });
    }
    getDefaultIcon(variant) {
        switch (variant) {
            case 'pink':
                return 'ri-sparkling-2-fill';
            case 'accent':
                return 'ri-error-warning-fill';
            default:
                return 'ri-heart-3-fill';
        }
    }
}
