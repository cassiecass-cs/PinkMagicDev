import { ModalManager } from './modal.js';
const modal = new ModalManager();
// 1. Controlar el modal escrito en el HTML
document.getElementById('btn-open-static')?.addEventListener('click', () => {
    modal.open('demo-modal');
});
document.getElementById('btn-confirm-static')?.addEventListener('click', () => {
    modal.close('demo-modal');
});
// 2. Lanzar una confirmación rápida sin escribir HTML extra
document.getElementById('btn-open-dynamic')?.addEventListener('click', async () => {
    const acepto = await modal.confirm({
        title: '¿Eliminar artículo?',
        subtitle: 'Esta acción no se puede deshacer',
        message: 'El producto se quitará permanentemente de tu lista.',
        icon: 'ri-delete-bin-6-fill',
        confirmText: 'Sí, eliminar',
        accentConfirm: true
    });
    if (acepto) {
        console.log('Artículo eliminado');
    }
});
