export interface ConfirmModalOptions {
    title: string;
    subtitle?: string;
    message: string;
    icon?: string;
    confirmText?: string;
    cancelText?: string;
    accentConfirm?: boolean;
}

export class ModalManager {
    private static escListenerAttached = false;

    constructor() {
        this.initDelegatedListeners();
    }

    /**
     * Abre un modal existente en el DOM por su ID
     */
    public open(modalId: string): void {
        const backdrop = document.getElementById(modalId);
        if (!backdrop) return;

        backdrop.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Evita scroll detrás del modal
    }

    /**
     * Cierra un modal existente en el DOM por su ID
     */
    public close(modalId: string): void {
        const backdrop = document.getElementById(modalId);
        if (!backdrop) return;

        backdrop.classList.remove('open');
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /**
     * Crea y muestra un modal de confirmación dinámico que devuelve true o false
     */
    public confirm(options: ConfirmModalOptions): Promise<boolean> {
        const {
            title,
            subtitle = '',
            message,
            icon = 'ri-question-fill',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            accentConfirm = false
        } = options;

        return new Promise((resolve) => {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop';
            backdrop.setAttribute('role', 'dialog');
            backdrop.setAttribute('aria-modal', 'true');

            const confirmClass = accentConfirm ? 'modal-btn-accent' : 'modal-btn-primary';

            backdrop.innerHTML = `
                <div class="modal-card">
                    <div class="modal-header">
                        <div class="modal-header-info">
                            <div class="modal-icon">
                                <i class="${icon}"></i>
                            </div>
                            <div>
                                <h3 class="modal-title">${title}</h3>
                                ${subtitle ? `<span class="modal-subtitle">${subtitle}</span>` : ''}
                            </div>
                        </div>
                        <button type="button" class="modal-close" aria-label="Cerrar">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="modal-btn modal-btn-secondary" data-action="cancel">
                            ${cancelText}
                        </button>
                        <button type="button" class="modal-btn ${confirmClass}" data-action="confirm">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            `;

            const cleanup = (result: boolean) => {
                backdrop.classList.remove('open');
                document.body.style.overflow = '';
                backdrop.addEventListener('transitionend', () => backdrop.remove(), { once: true });
                resolve(result);
            };

            // Eventos internos del modal dinámico
            backdrop.querySelector('.modal-close')?.addEventListener('click', () => cleanup(false));
            backdrop.querySelector('[data-action="cancel"]')?.addEventListener('click', () => cleanup(false));
            backdrop.querySelector('[data-action="confirm"]')?.addEventListener('click', () => cleanup(true));

            // Cerrar al hacer clic fuera de la tarjeta
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) cleanup(false);
            });

            document.body.appendChild(backdrop);
            document.body.style.overflow = 'hidden';

            requestAnimationFrame(() => {
                backdrop.classList.add('open');
            });
        });
    }

    /**
     * Configura cierres globales (clic afuera, data-modal-close y tecla Escape)
     */
    private initDelegatedListeners(): void {
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            // Botón con atributo data-modal-close
            const closeTrigger = target.closest('[data-modal-close]');
            if (closeTrigger) {
                const parentModal = closeTrigger.closest('.modal-backdrop');
                if (parentModal?.id) this.close(parentModal.id);
                return;
            }

            // Clic directamente en el fondo oscuro de un modal estático
            if (target.classList.contains('modal-backdrop') && target.id) {
                this.close(target.id);
            }
        });

        if (!ModalManager.escListenerAttached) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const openModals = document.querySelectorAll('.modal-backdrop.open');
                    const lastModal = openModals[openModals.length - 1] as HTMLElement | undefined;
                    if (lastModal?.id) {
                        this.close(lastModal.id);
                    }
                }
            });
            ModalManager.escListenerAttached = true;
        }
    }
}