// Lightbox для скриншотов кейсов
export function initLightbox() {
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

    function openLightbox(src, alt, caption) {
        if (!lightboxModal || !lightboxImage || !lightboxCaption || !src) return;

        lightboxImage.src = src;
        lightboxImage.alt = alt || '';
        lightboxCaption.textContent = caption || '';

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

    document.addEventListener('click', (event) => {
        const button = event.target.closest('.case-expand-btn');
        if (!button) return;

        const card = button.closest('.case-item');
        const isTouch = window.matchMedia('(hover: none)').matches;

        if (isTouch && card && !card.classList.contains('is-active')) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        openLightbox(
            button.dataset.img,
            button.dataset.caption || '',
            button.dataset.caption || ''
        );
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
        if (event.key === 'Escape' && lightboxModal?.classList.contains('active')) {
            closeLightbox();
        }
    });
}
