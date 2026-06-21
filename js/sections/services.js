// services.js — счётчики микро-результатов в карточках продуктов
import { initCounters } from '../utils/counter.js';

export function initServices() {
    initCounters('.service-result .counter-value');
}
