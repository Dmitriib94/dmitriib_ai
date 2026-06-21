// process.js — нейросетевая линия между шагами при скролле
export function initProcess() {
    const section = document.querySelector('.process');
    const container = document.querySelector('.process-steps');
    const svg = container?.querySelector('.process-network');
    const pathEl = container?.querySelector('.process-network-path');
    const steps = container ? [...container.querySelectorAll('.step')] : [];

    if (!section || !container || !svg || !pathEl || steps.length < 2) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION_MS = 4200;

    const getPoints = () => {
        const containerRect = container.getBoundingClientRect();

        return steps.map((step) => {
            const node = step.querySelector('.step-number');
            const rect = node.getBoundingClientRect();

            return {
                x: rect.left + rect.width / 2 - containerRect.left,
                y: rect.top + rect.height / 2 - containerRect.top,
            };
        });
    };

    const buildPath = (points) => {
        if (points.length < 2) return '';

        let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

        for (let i = 1; i < points.length; i++) {
            d += ` L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
        }

        return d;
    };

    const syncSvgSize = () => {
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        svg.setAttribute('width', String(w));
        svg.setAttribute('height', String(h));
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    };

    const applyPath = (showFull = false) => {
        syncSvgSize();
        const d = buildPath(getPoints());
        pathEl.setAttribute('d', d);

        const length = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = String(length);

        if (showFull) {
            pathEl.style.transition = 'none';
            pathEl.style.strokeDashoffset = '0';
            return length;
        }

        pathEl.style.transition = 'none';
        pathEl.style.strokeDashoffset = String(length);
        return length;
    };

    const lightSteps = (duration) => {
        const interval = duration / Math.max(steps.length - 1, 1);

        steps.forEach((step, index) => {
            window.setTimeout(() => {
                step.classList.add('is-lit');
            }, Math.round(index * interval));
        });
    };

    const finish = () => {
        section.classList.add('is-complete');
        steps.forEach((step) => step.classList.add('is-lit'));
    };

    const playAnimation = () => {
        applyPath(false);
        section.classList.add('is-animating');
        steps[0]?.classList.add('is-lit');

        requestAnimationFrame(() => {
            pathEl.style.transition = `stroke-dashoffset ${DURATION_MS}ms cubic-bezier(0.35, 0, 0.15, 1)`;
            pathEl.style.strokeDashoffset = '0';
        });

        lightSteps(DURATION_MS);
        window.setTimeout(finish, DURATION_MS + 80);
    };

    if (reduceMotion) {
        applyPath(true);
        finish();
        return;
    }

    let hasPlayed = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || hasPlayed) return;
                hasPlayed = true;
                playAnimation();
                observer.disconnect();
            });
        },
        { threshold: 0.28, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(section);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            if (!section.classList.contains('is-complete')) return;
            applyPath(true);
        }, 120);
    });
}
