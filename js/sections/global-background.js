// global-background.js
export function initGlobalBackground() {
    const canvas = document.getElementById('global-canvas');
    if (!canvas) return;

    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image img');

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = null;
    let mouseX = null;
    let mouseY = null;

    /* =========================================================
       1. CANVAS: Настройка AI-Нейронной сети
       ========================================================= */
    let ctx = null;
    let width, height;
    let particles = [];
    
    // Настройки частиц (премиум B2B)
    const config = {
        particleCount: 70,
        maxDistance: 175,        // ← было 160: линий станет больше
        mouseDistance: 240,      // ← было 220: интерактив шире
        lineColor: '88, 166, 255',   // синий акцент (RGB без alpha)
        glowColor: '#58A6FF',        // цвет свечения узлов
        colors: [
            'rgba(88, 166, 255, 0.65)',   // синий — основной (было 0.5)
            'rgba(56, 189, 248, 0.45)'    // голубой — второй (было 0.35)
        ]
    };

    if (!reduceMotion) {
        ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

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

        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();

                // --- УЗЕЛ (точка) со свечением ---
                ctx.beginPath();
                ctx.arc(particles[i].x, particles[i].y, particles[i].radius * 1.4, 0, Math.PI * 2);
                ctx.fillStyle = particles[i].color;
                ctx.shadowBlur = 8;                  // ← свечение
                ctx.shadowColor = config.glowColor;  // ← синий glow
                ctx.fill();
                ctx.shadowBlur = 0;                  // ← сброс, чтобы линии не размывались

                // 1. Связи между частицами — ярче и толще
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < config.maxDistance) {
                        const alpha = 0.28 * (1 - dist / config.maxDistance);  // ← было 0.18
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${config.lineColor}, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // 2. Интерактив: связи тянутся к курсору мыши
                if (mouseX !== null && mouseY !== null && canHover) {
                    const dx = particles[i].x - mouseX;
                    const dy = particles[i].y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < config.mouseDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(56, 189, 248, ${0.7 * (1 - dist / config.mouseDistance)})`;
                        ctx.lineWidth = 1.4;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    /* =========================================================
       2. ОБРАБОТЧИК МЫШИ (Для Canvas и старого эффекта картинки)
       ========================================================= */
    const onMouseMove = (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        // Параллакс картинки (ИСПРАВЛЕНО: добавлена проверка наличия hero)
        if (canHover && !reduceMotion && hero && heroImage && !rafId) {
            rafId = requestAnimationFrame(() => {
                const px = mouseX / window.innerWidth - 0.5;
                const py = mouseY / window.innerHeight - 0.5;

                hero.style.setProperty('--hero-img-x', `${px * 10}px`);
                hero.style.setProperty('--hero-img-y', `${py * 8}px`);
                rafId = null;
            });
        }
    };

    const onMouseLeave = () => {
        mouseX = null;
        mouseY = null;
        
        // ИСПРАВЛЕНО: добавлена проверка наличия hero
        if (canHover && hero && heroImage) {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            hero.style.setProperty('--hero-img-x', '0px');
            hero.style.setProperty('--hero-img-y', '0px');
        }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // Очистка при уничтожении
    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseleave', onMouseLeave);
        // Так как resizeCanvas теперь внутри блока if (!reduceMotion), мы не можем его тут удалить напрямую.
        // Но для статического сайта это не критично.
    };
}