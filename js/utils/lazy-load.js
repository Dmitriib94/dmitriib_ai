// Ленивая загрузка изображений и отложенная инициализация тяжёлых модулей

export function initLazyLoad() {
    initLazyImages();
}

function initLazyImages() {
    document.querySelectorAll('img').forEach((img) => {
        if (img.closest('.hero') || img.id === 'lightboxImage') {
            img.loading = 'eager';
            img.fetchPriority = 'high';
            img.decoding = 'async';
            return;
        }

        if (!img.hasAttribute('loading')) {
            img.loading = 'lazy';
        }

        img.decoding = 'async';
    });
}

export function deferHeavyInit(callback) {
    scheduleIdle(callback, 2000);
}

/** Отложенный запуск canvas — после load и idle, с fallback по первому взаимодействию */
export function deferCanvasInit(callback) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    let started = false;

    const run = () => {
        if (started) return;
        started = true;
        cleanup();
        callback();
    };

    const cleanup = () => {
        window.removeEventListener('load', onLoad);
        window.removeEventListener('scroll', onInteraction, { capture: true });
        window.removeEventListener('pointerdown', onInteraction, { capture: true });
        window.removeEventListener('keydown', onInteraction, { capture: true });
    };

    const onLoad = () => scheduleIdle(run, 2500);

    const onInteraction = () => scheduleIdle(run, 800);

    if (document.readyState === 'complete') {
        scheduleIdle(run, 2500);
    } else {
        window.addEventListener('load', onLoad, { once: true });
    }

    window.addEventListener('scroll', onInteraction, { once: true, passive: true, capture: true });
    window.addEventListener('pointerdown', onInteraction, { once: true, capture: true });
    window.addEventListener('keydown', onInteraction, { once: true, capture: true });
}

function scheduleIdle(callback, timeout) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout });
        return;
    }

    setTimeout(callback, Math.min(timeout, 300));
}
