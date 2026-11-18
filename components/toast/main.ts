import { ToastManager } from './toast.js';

const toast = new ToastManager();

// Notificación suave por defecto
toast.show({
    title: '¡Guardado!',
    message: 'Los cambios se aplicaron correctamente.'
});

// Notificación rosa intenso
toast.show({
    title: 'Nuevo artículo',
    message: 'Se agregó al catálogo sin problemas.',
    variant: 'pink',
    duration: 4000
});

// Notificación de alerta / acento vino
toast.show({
    title: 'Atención',
    message: 'Revisa los campos obligatorios antes de continuar.',
    variant: 'accent'
});