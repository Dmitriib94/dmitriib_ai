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
        particleCount: 65,
        maxDistance: 160,  
        mouseDistance: 220, 
        colors: ['rgba(30, 64, 175, 0.8)', 'rgba(6, 182, 212, 0.8)'] 
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
                ctx.beginPath();
                ctx.arc(particles[i].x, particles[i].y, particles[i].radius * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = particles[i].color;
                ctx.fill();

                // 1. Связи между частицами
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < config.maxDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(30, 64, 175, ${0.35 * (1 - dist / config.maxDistance)})`;
                        ctx.lineWidth = 1.5;
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
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.6 * (1 - dist / config.mouseDistance)})`;
                        ctx.lineWidth = 2;
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