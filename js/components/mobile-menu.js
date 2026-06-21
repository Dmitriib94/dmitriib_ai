// Mobile menu toggle
export function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    if (!mobileToggle || !mobileMenu || !closeMenu) return;

    const isMenuOpen = () => mobileMenu.classList.contains('active');

    const openMenu = () => {
        if (isMenuOpen()) return;

        mobileMenu.classList.add('active');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
    };

    const closeMobileMenu = () => {
        if (!isMenuOpen()) return;

        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
    };

    mobileToggle.addEventListener('click', () => {
        if (isMenuOpen()) {
            closeMobileMenu();
        } else {
            openMenu();
        }
    });

    closeMenu.addEventListener('click', closeMobileMenu);

    const mobileLinks = mobileMenu.querySelectorAll('a');

    mobileLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');

            if (href && href.startsWith('#') && href !== '#') {
                event.preventDefault();
                closeMobileMenu();

                const target = document.querySelector(href);

                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 260);
                }
            } else {
                closeMobileMenu();
            }
        });
    });

    mobileMenu.addEventListener('click', (event) => {
        if (event.target === mobileMenu) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isMenuOpen()) {
            closeMobileMenu();
        }
    });
}