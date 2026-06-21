// cases.js — тач-overlay и мобильная карусель портфолио

const MOBILE_CASES_MQ = '(max-width: 639px)';

export function initCases() {
    initCaseTouchOverlay();
    initMobileCasesCarousel();
}

function initCaseTouchOverlay() {
    const casesSection = document.querySelector('.cases');
    if (!casesSection) return;

    const isTouchDevice = () => window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice()) return;

    const closeAll = () => {
        casesSection.querySelectorAll('.case-item.is-active').forEach((card) => {
            card.classList.remove('is-active');
        });
    };

    casesSection.addEventListener('click', (event) => {
        const card = event.target.closest('.case-item');
        if (!card || !casesSection.contains(card)) return;

        if (card.classList.contains('is-active') && event.target.closest('a, button')) {
            return;
        }

        if (!card.classList.contains('is-active')) {
            event.preventDefault();
            closeAll();
            card.classList.add('is-active');
        }
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.case-item')) {
            closeAll();
        }
    });

    let scrollTimer;
    window.addEventListener(
        'scroll',
        () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(closeAll, 150);
        },
        { passive: true }
    );
}

function initMobileCasesCarousel() {
    const section = document.querySelector('.cases');
    const grid = section?.querySelector('.cases-grid');
    const showMoreBtn = document.getElementById('casesShowMore');
    const carousel = document.getElementById('casesCarousel');
    const track = document.getElementById('casesCarouselTrack');
    const dotsContainer = document.getElementById('casesCarouselDots');
    const viewport = carousel?.querySelector('.cases-carousel-viewport');
    const prevBtn = carousel?.querySelector('.cases-carousel-prev');
    const nextBtn = carousel?.querySelector('.cases-carousel-next');
    const mq = window.matchMedia(MOBILE_CASES_MQ);

    if (!grid || !showMoreBtn || !carousel || !track || !viewport || !dotsContainer) return;

    const sourceCards = [...grid.querySelectorAll('.case-item')];
    const realCount = sourceCards.length;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (realCount <= 3) {
        showMoreBtn.hidden = true;
        return;
    }

    let carouselBuilt = false;
    let index = 1;
    let isAnimating = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchDeltaX = 0;
    let isSwiping = false;
    let suppressClick = false;

    const getTransition = () =>
        reduceMotion ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';

    const getRealIndex = () => {
        if (index === 0) return realCount - 1;
        if (index === realCount + 1) return 0;
        return index - 1;
    };

    const updateDots = () => {
        const activeIndex = getRealIndex();
        dotsContainer.querySelectorAll('.cases-carousel-dot').forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    };

    const updateTrack = (animate = true) => {
        const slideWidth = viewport.offsetWidth;
        track.style.transition = animate ? getTransition() : 'none';
        track.style.transform = `translate3d(${-index * slideWidth}px, 0, 0)`;
        updateDots();
    };

    const normalizeIndex = () => {
        if (index === 0) {
            index = realCount;
            updateTrack(false);
            return true;
        }

        if (index === realCount + 1) {
            index = 1;
            updateTrack(false);
            return true;
        }

        return false;
    };

    const goToRealIndex = (realIndex, animate = true) => {
        if (isAnimating) return;
        index = realIndex + 1;
        isAnimating = animate && !reduceMotion;
        updateTrack(animate);
    };

    const next = () => {
        if (isAnimating) return;

        if (reduceMotion) {
            index = index >= realCount ? 1 : index + 1;
            updateTrack(false);
            return;
        }

        isAnimating = true;
        index += 1;
        updateTrack(true);
    };

    const prev = () => {
        if (isAnimating) return;

        if (reduceMotion) {
            index = index <= 1 ? realCount : index - 1;
            updateTrack(false);
            return;
        }

        isAnimating = true;
        index -= 1;
        updateTrack(true);
    };

    const buildCarousel = () => {
        if (carouselBuilt) return;

        track.innerHTML = '';
        dotsContainer.innerHTML = '';

        sourceCards.forEach((card, cardIndex) => {
            const slide = document.createElement('div');
            slide.className = 'cases-carousel-slide';
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `${cardIndex + 1} из ${realCount}`);

            const clone = card.cloneNode(true);
            clone.classList.remove('is-active', 'reveal-card', 'is-visible');
            clone.style.removeProperty('--reveal-i');
            clone.querySelectorAll('.reveal-inner, .reveal-icon').forEach((el) => {
                el.classList.remove('reveal-inner', 'reveal-icon', 'is-visible');
            });
            slide.appendChild(clone);
            track.appendChild(slide);

            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'cases-carousel-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Проект ${cardIndex + 1}`);
            dot.addEventListener('click', () => goToRealIndex(cardIndex));
            dotsContainer.appendChild(dot);
        });

        const slides = [...track.querySelectorAll('.cases-carousel-slide')];
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        firstClone.classList.add('cases-carousel-slide--clone');
        lastClone.classList.add('cases-carousel-slide--clone');
        firstClone.querySelector('.case-item')?.classList.remove('is-active');
        lastClone.querySelector('.case-item')?.classList.remove('is-active');

        track.insertBefore(lastClone, slides[0]);
        track.appendChild(firstClone);

        index = 1;
        carouselBuilt = true;
        updateTrack(false);
    };

    const openCarousel = () => {
        buildCarousel();
        carousel.hidden = false;
        carousel.classList.add('is-visible');
        carousel.setAttribute('aria-hidden', 'false');
        showMoreBtn.hidden = true;
        showMoreBtn.setAttribute('aria-expanded', 'true');

        requestAnimationFrame(() => {
            updateTrack(false);
            carousel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
        });
    };

    const resetForDesktop = () => {
        carousel.hidden = true;
        carousel.classList.remove('is-visible');
        carousel.setAttribute('aria-hidden', 'true');
        showMoreBtn.hidden = false;
        showMoreBtn.setAttribute('aria-expanded', 'false');
        isAnimating = false;
    };

    showMoreBtn.addEventListener('click', openCarousel);
    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    track.addEventListener('transitionend', (event) => {
        if (event.target !== track || event.propertyName !== 'transform') return;
        isAnimating = false;
        normalizeIndex();
        updateDots();
    });

    viewport.addEventListener(
        'touchstart',
        (event) => {
            if (!carousel.classList.contains('is-visible')) return;
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
            touchDeltaX = 0;
            isSwiping = false;
        },
        { passive: true }
    );

    viewport.addEventListener(
        'touchmove',
        (event) => {
            if (!carousel.classList.contains('is-visible')) return;

            const currentX = event.touches[0].clientX;
            const currentY = event.touches[0].clientY;
            const diffX = currentX - touchStartX;
            const diffY = currentY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                isSwiping = true;
                touchDeltaX = diffX;
            }
        },
        { passive: true }
    );

    viewport.addEventListener(
        'touchend',
        () => {
            if (!carousel.classList.contains('is-visible') || !isSwiping) return;

            if (touchDeltaX > 50) {
                prev();
            } else if (touchDeltaX < -50) {
                next();
            }

            suppressClick = true;
            window.setTimeout(() => {
                suppressClick = false;
            }, 300);

            isSwiping = false;
            touchDeltaX = 0;
        },
        { passive: true }
    );

    carousel.addEventListener(
        'click',
        (event) => {
            if (suppressClick) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        true
    );

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (carouselBuilt && carousel.classList.contains('is-visible')) {
                updateTrack(false);
            }
        }, 120);
    });

    const syncViewport = (event) => {
        if (event.matches) {
            showMoreBtn.hidden = carousel.classList.contains('is-visible');
            return;
        }

        resetForDesktop();
    };

    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', syncViewport);
    } else {
        mq.addListener(syncViewport);
    }
}
