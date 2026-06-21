// Анимация числовых счётчиков при появлении в viewport
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (Number.isNaN(target)) return;

    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(easeOut(progress) * target);
        el.textContent = String(value);
        if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

export function initCounters(selector = '.counter-value, .results-number-value') {
    const counters = document.querySelectorAll(selector);
    if (!counters.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        counters.forEach((el) => {
            const target = el.dataset.target;
            if (target) el.textContent = target;
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.25, rootMargin: '0px 0px -40px 0px' }
    );

    counters.forEach((el) => observer.observe(el));
}
