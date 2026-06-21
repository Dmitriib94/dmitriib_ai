export function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (!header) return;

    const updateHeaderState = () => {
        if (window.scrollY > 12) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    updateHeaderState();

    window.addEventListener('scroll', updateHeaderState, {
        passive: true
    });
}