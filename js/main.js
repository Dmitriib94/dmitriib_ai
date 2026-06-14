// Main entry point
import { initMobileMenu } from './components/mobile-menu.js';
import { initAccordion } from './components/accordion.js';
import { initSmoothScroll } from './components/smooth-scroll.js';
import { initLightbox } from './components/lightbox.js';
import { initHeaderScroll } from './components/header-scroll.js';
import { initScrollAnimations } from './sections/animations.js';
import { initValueSlider } from './sections/value-slider.js';
import { initButtonInteractions } from './sections/buttons.js';
import { initGlobalBackground } from './sections/global-background.js';

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initAccordion();
    initSmoothScroll();
    initLightbox();
    initHeaderScroll();
    initScrollAnimations();
    initValueSlider();
    initButtonInteractions();
    initGlobalBackground()
});