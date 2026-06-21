// Main entry point
import { initMobileMenu } from './components/mobile-menu.js';
import { initCases } from './sections/cases.js';
import { initAccordion } from './components/accordion.js';
import { initSmoothScroll } from './components/smooth-scroll.js';
import { initLightbox } from './components/lightbox.js';
import { initHeaderScroll } from './components/header-scroll.js';
import { initScrollAnimations } from './sections/animations.js';
import { initResults } from './sections/results.js';
import { initServices } from './sections/services.js';
import { initProcess } from './sections/process.js';
import { initButtonInteractions } from './sections/buttons.js';
import { initGlobalBackground } from './sections/global-background.js';
import { initLazyLoad } from './utils/lazy-load.js';

document.addEventListener('DOMContentLoaded', () => {
    initLazyLoad();
    initMobileMenu();
    initCases();
    initAccordion();
    initSmoothScroll();
    initLightbox();
    initHeaderScroll();
    initScrollAnimations();
    initResults();
    initServices();
    initProcess();
    initButtonInteractions();
    initGlobalBackground();
});
