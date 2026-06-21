# Структура проекта — портфолио Дмитрий Бутузов

Краткий справочник для правок без поломки вёрстки и логики.

## Файловая карта

```
Sayt/
├── index.html              # Единственная страница сайта
├── css/
│   ├── main.css            # Точка входа — только @import
│   ├── tokens.css          # CSS-переменные (:root)
│   ├── base/
│   │   ├── reset.css       # Сброс, html/body
│   │   ├── layout.css      # .container, section, .section-title
│   │   ├── typography.css  # Заголовки, .step-number, .contact-label
│   │   └── utilities.css   # Глобальные media-утилиты
│   ├── components/         # Переиспользуемые блоки
│   │   ├── buttons.css
│   │   ├── header.css
│   │   ├── footer.css
│   │   ├── lightbox.css
│   │   ├── global-background.css
│   │   └── card.css        # Общий chrome для .service-card / .ai-benefit-card
│   └── sections/           # Стили по секциям страницы
│       ├── hero.css
│       ├── results.css
│       ├── cases.css
│       ├── services.css
│       ├── process.css
│       ├── about.css
│       ├── ai-benefits.css
│       ├── faq.css
│       └── cta.css
├── js/
│   ├── main.js             # Инициализация модулей
│   ├── components/         # UI-компоненты
│   └── sections/           # Логика секций
├── img/                    # Изображения
└── favicons/
```

## Порядок загрузки CSS

Каскад задаётся в `css/main.css`:

1. **tokens** → переменные темы  
2. **base** → reset, layout, typography  
3. **components** → кнопки, шапка, футер и т.д.  
4. **sections** → стили конкретных блоков  
5. **card.css** → общие hover/тени карточек (после секций)  
6. **utilities** → финальные media-правки  

> Новые глобальные переопределения добавляй **в конец цепочки** (utilities или отдельный файл после секций), а не в середину.

## Секции на странице

| ID / класс   | HTML-блок        | CSS                    | JS                          |
|--------------|------------------|------------------------|-----------------------------|
| `.hero`      | Первый экран     | `sections/hero.css`    | `global-background.js`      |
| `.results`   | Цифры            | `sections/results.css` | `results.js`                |
| `#cases`     | Портфолио        | `sections/cases.css`   | `cases.js`                  |
| `#services`  | Продукты         | `sections/services.css`| —                           |
| `#process`   | Процесс          | `sections/process.css` | —                           |
| `#about`     | Обо мне          | `sections/about.css`   | —                           |
| AI-блок      | Преимущества AI  | `sections/ai-benefits.css` | —                       |
| `#faq`       | FAQ              | `sections/faq.css`     | `accordion.js`              |
| `#contacts`  | Контакты         | `sections/cta.css`     | —                           |

## Дизайн-токены (`css/tokens.css`)

Основные переменные для правки темы:

| Переменная            | Назначение                          |
|-----------------------|-------------------------------------|
| `--color-bg`          | Фон страницы                        |
| `--color-surface`     | Карточки, панели                    |
| `--color-text`        | Основной текст                      |
| `--color-text-soft`   | Вторичный текст                     |
| `--color-primary`     | Фон primary-кнопок (светлый)        |
| `--color-on-primary`  | Текст на primary-кнопках (тёмный)   |
| `--color-accent`      | Акцент (ссылки, метки, точки)       |
| `--radius-card`       | Скругление карточек в секциях (20px)|
| `--radius-card-lg`    | Скругление в `card.css` (24px)      |
| `--glass-surface`     | Фон стеклянных карточек             |
| `--glass-blur`        | Размытие backdrop-filter            |
| `--shadow-card`       | Тень карточек                       |

## Кнопки

Все кнопки строятся на базовых классах из `components/buttons.css`:

```html
<a class="btn btn-primary">...</a>
<a class="btn btn-secondary">...</a>
```

Специальные модификаторы:

- `.header-btn` — размеры CTA в шапке (цвета от `.btn-primary`)
- `.cta-telegram-btn` — ширина кнопки Telegram в контактах
- `.mobile-menu-cta` — CTA в мобильном меню

**Не добавляй** `!important` для цветов кнопок — правь `--color-primary` / `--color-on-primary` в tokens.

## Кейсы (портфолио)

- Разметка: `.case-item` в `.cases-grid`
- Мобайл (<640px): первые 3 кейса в сетке + кнопка «Показать ещё» + карусель (`cases.js`)
- Скриншот: `.case-expand-btn` с `data-img` и `data-caption` → `lightbox.js`
- Тач: первый тап открывает overlay, второй — действия (`cases.js`)

## JS-модули (`js/main.js`)

| Модуль               | Ответственность                    |
|----------------------|------------------------------------|
| `mobile-menu.js`     | Бургер-меню                        |
| `header-scroll.js`   | Класс `.scrolled` на шапке         |
| `smooth-scroll.js`   | Плавный скролл по якорям           |
| `accordion.js`       | FAQ                                |
| `lightbox.js`        | Просмотр скриншотов кейсов         |
| `cases.js`           | Тач-overlay + мобильная карусель   |
| `results.js`         | Анимация цифр                      |
| `animations.js`      | Появление блоков при скролле (reveal) |
| `utils/lazy-load.js` | Lazy images, defer canvas             |
| `buttons.js`         | Закрытие меню при клике «Обсудить» |
| `global-background.js` | Canvas + параллакс hero          |

## Чеклист при добавлении секции

1. Разметка в `index.html` внутри `<main>`
2. Новый файл `css/sections/имя.css`
3. `@import` в `css/main.css` (блок sections)
4. При необходимости — модуль в `js/sections/` + вызов в `main.js`
5. Использовать `.container`, `.section-title`, `.section-subtitle` из base

## Чего избегать

- Дублировать стили кнопок/шапки в `main.css` — только tokens и imports
- Legacy-классы: `.case-card`, `.value-card` — не используются в HTML
- `100vw` для full-width фонов — использовать `inset: 0`
- Копии файлов (`— копия`) — не хранить в репозитории

## Локальный просмотр

Статический сайт — достаточно любого HTTP-сервера или открытия `index.html`.  
JS использует ES modules (`type="module"` в `main.js`).
