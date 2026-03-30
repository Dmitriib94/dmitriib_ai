// Value section slider
export function initValueSlider() {
    const track = document.querySelector('.value-slider-track');
    const prevBtn = document.querySelector('.slider-btn-prev');
    const nextBtn = document.querySelector('.slider-btn-next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.children);
    let currentIndex = 0;

    function getCardsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1100) return 2;
        return 3;
    }

    function getGap() {
        const styles = window.getComputedStyle(track);
        return parseInt(styles.columnGap || styles.gap || 0, 10);
    }

    function getMaxIndex() {
        return Math.max(0, Math.ceil(cards.length / getCardsPerView()) - 1);
    }

    function updateButtons() {
        const maxIndex = getMaxIndex();
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    function createDots() {
        if (!dotsContainer) return;

        const totalSlides = getMaxIndex() + 1;
        dotsContainer.innerHTML = '';

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);

            if (i === currentIndex) {
                dot.classList.add('active');
            }

            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;

        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goToSlide(index) {
        const cardsPerView = getCardsPerView();
        const maxIndex = getMaxIndex();
        const gap = getGap();

        currentIndex = Math.max(0, Math.min(index, maxIndex));

        const cardWidth = cards[0].getBoundingClientRect().width;
        const offset = currentIndex * ((cardWidth + gap) * cardsPerView);

        track.style.transform = `translateX(-${offset}px)`;

        updateDots();
        updateButtons();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            currentIndex = 0;
            createDots();
            goToSlide(0);
        }, 180);
    });

    createDots();
    goToSlide(0);
}