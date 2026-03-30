// Cases + lightbox
export function initLightbox() {
    const caseCards = document.querySelectorAll('.case-card');

    if (caseCards.length) {
        caseCards.forEach((card) => {
            const toggle = card.querySelector('.case-card-toggle');
            const details = card.querySelector('.case-details');

            if (!toggle || !details) return;

            details.style.maxHeight = '0px';

            toggle.addEventListener('click', () => {
                const isOpen = card.classList.contains('active');

                caseCards.forEach((otherCard) => {
                    const otherToggle = otherCard.querySelector('.case-card-toggle');
                    const otherDetails = otherCard.querySelector('.case-details');

                    if (!otherToggle || !otherDetails) return;

                    otherCard.classList.remove('active');
                    otherToggle.setAttribute('aria-expanded', 'false');
                    otherDetails.style.maxHeight = '0px';
                });

                if (!isOpen) {
                    card.classList.add('active');
                    toggle.setAttribute('aria-expanded', 'true');
                    details.style.maxHeight = `${details.scrollHeight}px`;

                    setTimeout(() => {
                        const cardTop = card.getBoundingClientRect().top + window.scrollY;
                        const offset = 90;

                        window.scrollTo({
                            top: cardTop - offset,
                            behavior: 'smooth'
                        });
                    }, 180);
                }
            });
        });

        let resizeTimer;

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                caseCards.forEach((card) => {
                    const details = card.querySelector('.case-details');

                    if (!details) return;

                    if (card.classList.contains('active')) {
                        details.style.maxHeight = `${details.scrollHeight}px`;
                    }
                });
            }, 120);
        });
    }

    let lightboxModal = document.getElementById('lightboxModal');
    let lightboxImage = document.getElementById('lightboxImage');
    let lightboxCaption = document.getElementById('lightboxCaption');
    let lightboxClose = null;

    if (!lightboxModal) {
        const modalHTML = `
            <div class="lightbox-modal" id="lightboxModal" aria-hidden="true">
                <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Просмотр изображения кейса">
                    <button class="lightbox-close" type="button" aria-label="Закрыть окно">×</button>
                    <img class="lightbox-content" id="lightboxImage" alt="">
                    <div class="lightbox-caption" id="lightboxCaption"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        lightboxModal = document.getElementById('lightboxModal');
        lightboxImage = document.getElementById('lightboxImage');
        lightboxCaption = document.getElementById('lightboxCaption');
    }

    lightboxClose = lightboxModal.querySelector('.lightbox-close');

    const expandButtons = document.querySelectorAll('.case-image-expand');

    function openLightbox(card) {
        const image = card.querySelector('.case-image img');
        const title = card.querySelector('.case-title');

        if (!image || !lightboxModal || !lightboxImage || !lightboxCaption) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || '';

        lightboxCaption.textContent = title ? title.textContent.trim() : '';

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;

        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        setTimeout(() => {
            if (lightboxImage) {
                lightboxImage.src = '';
                lightboxImage.alt = '';
            }

            if (lightboxCaption) {
                lightboxCaption.textContent = '';
            }
        }, 250);
    }

    expandButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();

            const card = button.closest('.case-card');
            if (!card) return;

            openLightbox(card);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (event) => {
            if (event.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });
}