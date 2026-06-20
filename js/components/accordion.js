// FAQ Accordion
export function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (!accordionItems.length) return;

    accordionItems.forEach((item) => {
        const header = item.querySelector('.accordion-header');
        const body = item.querySelector('.accordion-body');

        if (!header || !body) return;

        body.style.maxHeight = '0px';
        header.setAttribute('aria-expanded', 'false');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            accordionItems.forEach((otherItem) => {
                const otherHeader = otherItem.querySelector('.accordion-header');
                const otherBody = otherItem.querySelector('.accordion-body');

                if (!otherHeader || !otherBody) return;

                otherItem.classList.remove('active');
                otherHeader.setAttribute('aria-expanded', 'false');
                otherBody.style.maxHeight = '0px';
            });

            if (!isActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = `${body.scrollHeight}px`;
            }
        });
    });

    let resizeTimer;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            accordionItems.forEach((item) => {
                const body = item.querySelector('.accordion-body');

                if (!body) return;

                if (item.classList.contains('active')) {
                    body.style.maxHeight = `${body.scrollHeight}px`;
                }
            });
        }, 120);
    });
}