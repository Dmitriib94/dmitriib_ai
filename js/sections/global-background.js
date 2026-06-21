// global-background.js — нейросеть + связь с hover карточек
import { deferCanvasInit } from '../utils/lazy-load.js';

const CARD_SELECTOR =
    '.service-card, .results-card, .cta-block, ' +
    '.accordion-item, .case-item, .step, .about-principle, .about-ai-note, .about-image';

export function initGlobalBackground() {
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image img');
    const backgroundRoot = document.getElementById('global-background');

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hoverZone = createHoverZone(canHover);
    initHeroParallax({ hero, heroImage, canHover, reduceMotion });

    if (!backgroundRoot || reduceMotion) return;

    deferCanvasInit(() => {
        initCanvasNetwork(backgroundRoot, { canHover, hoverZone });
    });
}

function createHoverZone(canHover) {
    const zone = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        strength: 0,
        targetStrength: 0,
        activeCard: null,
    };

    if (!canHover) {
        return {
            zone,
            getInfluence: () => 0,
            tick: () => {},
        };
    }

    const updateRect = (el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        zone.x = rect.left;
        zone.y = rect.top;
        zone.w = rect.width;
        zone.h = rect.height;
    };

    document.addEventListener('mouseover', (event) => {
        const card = event.target.closest(CARD_SELECTOR);
        if (!card || card === zone.activeCard) return;

        zone.activeCard = card;
        zone.targetStrength = 1;
        updateRect(card);
    });

    document.addEventListener('mouseout', (event) => {
        if (!zone.activeCard) return;

        const card = event.target.closest(CARD_SELECTOR);
        if (card !== zone.activeCard) return;

        const next = event.relatedTarget;
        if (next instanceof Node && zone.activeCard.contains(next)) return;

        zone.activeCard = null;
        zone.targetStrength = 0;
    });

    const syncZoneOnScroll = () => {
        if (zone.activeCard) updateRect(zone.activeCard);
    };

    window.addEventListener('scroll', syncZoneOnScroll, { passive: true });
    window.addEventListener('resize', syncZoneOnScroll);

    return {
        zone,
        getInfluence(x, y) {
            if (zone.strength < 0.01 || zone.w <= 0) return 0;

            const pad = 28;
            const cx = zone.x + zone.w / 2;
            const cy = zone.y + zone.h / 2;
            const nx = (x - cx) / (zone.w / 2 + pad);
            const ny = (y - cy) / (zone.h / 2 + pad);
            const dist = Math.sqrt(nx * nx + ny * ny);

            if (dist >= 1) return 0;

            const falloff = 1 - dist;
            return falloff * falloff * zone.strength;
        },
        tick() {
            zone.strength += (zone.targetStrength - zone.strength) * 0.09;

            if (zone.activeCard && zone.targetStrength > 0) {
                updateRect(zone.activeCard);
            }
        },
    };
}

function initHeroParallax({ hero, heroImage, canHover, reduceMotion }) {
    let rafId = null;

    const onMouseMove = (event) => {
        if (!canHover || reduceMotion || !hero || !heroImage || rafId) return;

        rafId = requestAnimationFrame(() => {
            const px = event.clientX / window.innerWidth - 0.5;
            const py = event.clientY / window.innerHeight - 0.5;

            hero.style.setProperty('--hero-img-x', `${px * 10}px`);
            hero.style.setProperty('--hero-img-y', `${py * 8}px`);
            rafId = null;
        });
    };

    const onMouseLeave = () => {
        if (!canHover || !hero || !heroImage) return;

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        hero.style.setProperty('--hero-img-x', '0px');
        hero.style.setProperty('--hero-img-y', '0px');
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
}

function initCanvasNetwork(backgroundRoot, { canHover, hoverZone }) {
    if (backgroundRoot.querySelector('#global-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'global-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    backgroundRoot.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId = null;
    let isPaused = document.hidden;
    let mouseX = null;
    let mouseY = null;

    const config = {
        particleCount: 70,
        maxDistance: 175,
        mouseDistance: 240,
        lineColor: '88, 166, 255',
        glowColor: '#58A6FF',
        zoneLineBoost: 1.35,
        zoneAlphaBoost: 1.6,
        zoneNodeBoost: 0.35,
        colors: [
            'rgba(88, 166, 255, 0.65)',
            'rgba(56, 189, 248, 0.45)',
        ],
    };

    const resizeCanvas = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
    }

    resizeCanvas();
    const particles = Array.from({ length: config.particleCount }, () => new Particle());

    const drawNode = (particle) => {
        const influence = hoverZone.getInfluence(particle.x, particle.y);
        const radius = particle.radius * (1.4 + influence * config.zoneNodeBoost);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 8 + influence * 14;
        ctx.shadowColor = config.glowColor;
        ctx.fill();
        ctx.shadowBlur = 0;
    };

    const drawLink = (x1, y1, x2, y2, baseAlpha, baseWidth = 1) => {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const influence = hoverZone.getInfluence(midX, midY);
        const alpha = Math.min(baseAlpha * (1 + influence * config.zoneAlphaBoost), 0.95);
        const lineWidth = baseWidth + influence * config.zoneLineBoost;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${config.lineColor}, ${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };

    const animateCanvas = () => {
        animationId = null;

        if (isPaused) return;

        hoverZone.tick();
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            drawNode(particles[i]);

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < config.maxDistance) {
                    const alpha = 0.28 * (1 - dist / config.maxDistance);
                    drawLink(
                        particles[i].x,
                        particles[i].y,
                        particles[j].x,
                        particles[j].y,
                        alpha
                    );
                }
            }

            if (mouseX !== null && mouseY !== null && canHover) {
                const dx = particles[i].x - mouseX;
                const dy = particles[i].y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < config.mouseDistance) {
                    const alpha = 0.7 * (1 - dist / config.mouseDistance);
                    drawLink(particles[i].x, particles[i].y, mouseX, mouseY, alpha, 1.4);
                }
            }
        }

        animationId = requestAnimationFrame(animateCanvas);
    };

    const startAnimation = () => {
        if (animationId !== null || isPaused) return;
        animationId = requestAnimationFrame(animateCanvas);
    };

    const stopAnimation = () => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    document.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });
    document.addEventListener('visibilitychange', () => {
        isPaused = document.hidden;

        if (isPaused) {
            stopAnimation();
            return;
        }

        startAnimation();
    });

    resizeCanvas();
    startAnimation();

    requestAnimationFrame(() => {
        canvas.classList.add('is-ready');
    });
}
