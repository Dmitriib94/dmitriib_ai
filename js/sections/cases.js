// cases.js — управление hover-overlay на тач-устройствах

export function initCases() {
    const isTouchDevice = () =>
        window.matchMedia('(hover: none)').matches;

    if (!isTouchDevice()) return;

    const cards = document.querySelectorAll('.case-item');
    if (!cards.length) return;

    const closeAll = () => {
        cards.forEach((c) => c.classList.remove('is-active'));
    };

    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            const isActive = card.classList.contains('is-active');

            // Если карточка ещё не открыта — открываем, не переходим
            if (!isActive) {
                e.preventDefault();
                closeAll();
                card.classList.add('is-active');
                return;
            }

            // Если карточка уже открыта — разрешаем дефолтное поведение
            // (клик по кнопкам и ссылкам внутри сработает нативно)
        });
    });

    // Закрыть при клике вне карточек
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.case-item')) {
            closeAll();
        }
    });

    // Закрыть при скролле
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