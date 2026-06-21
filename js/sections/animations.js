// Scroll reveal: карточки, иконки, текст
export function initScrollAnimations() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const observe = (el) => {
        if (el) observer.observe(el);
    };

    const INNER_SELECTOR =
        '.service-icon, .service-name, .service-desc, .service-result, ' +
        '.step-number, .step h4, .step p, ' +
        '.results-card-inner, .cta-block-title, .cta-block-note, ' +
        '.contact-links, .steps-list, .trust-list, .accordion-header, ' +
        '.about-principle-arrow, .about-principle-title, .about-principle-text';

    const ICON_SELECTOR = '.service-icon, .step-number, .about-principle-arrow';

    const initCardGroup = (selector) => {
        document.querySelectorAll(selector).forEach((card, index) => {
            card.classList.add('reveal-card');
            card.style.setProperty('--reveal-i', String(index));

            card.querySelectorAll(INNER_SELECTOR).forEach((inner) => {
                inner.classList.add('reveal-inner');
                if (inner.matches(ICON_SELECTOR)) {
                    inner.classList.add('reveal-icon');
                }
            });

            observe(card);
        });
    };

    initCardGroup('.services-grid .service-card');
    initCardGroup('.results-grid .results-card');
    initCardGroup('.cta-grid .cta-block');
    initCardGroup('.cases-grid .case-item');
    initCardGroup('.accordion .accordion-item');
    initCardGroup('.about-principles .about-principle');

    document.querySelectorAll(
        '.section-title, .section-subtitle, .results-label, .cases-label, .results-footnote'
    ).forEach((heading, index) => {
        heading.classList.add('reveal-heading');
        heading.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 60}ms`);
        observe(heading);
    });

    const aboutImage = document.querySelector('.about-image');
    const aboutAiNote = document.querySelector('.about-ai-note');

    if (aboutImage) {
        aboutImage.classList.add('reveal-block');
        aboutImage.style.setProperty('--reveal-delay', '60ms');
        observe(aboutImage);
    }

    if (aboutAiNote) {
        aboutAiNote.classList.add('reveal-card');
        aboutAiNote.style.setProperty('--reveal-i', '0');
        observe(aboutAiNote);
    }

    document.querySelectorAll('.about-intro, .about-focus, .about-facts, .about-cta-text').forEach((el, index) => {
        el.classList.add('reveal-block');
        el.style.setProperty('--reveal-delay', `${120 + index * 60}ms`);
        observe(el);
    });
}
