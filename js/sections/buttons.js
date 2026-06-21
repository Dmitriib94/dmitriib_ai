// Button interactions
export function initButtonInteractions() {
    const mobileDiscussButton = document.querySelector('.mobile-menu .btn-primary');
    const contactsSection = document.getElementById('contacts');

    if (mobileDiscussButton && contactsSection) {
        mobileDiscussButton.addEventListener('click', (e) => {
            e.preventDefault();

            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }

            setTimeout(() => {
                contactsSection.scrollIntoView({ behavior: 'smooth' });
            }, 180);
        });
    }
}