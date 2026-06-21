import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontsDir = path.join(root, 'fonts');

const fontFiles = [
    [
        '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
        'inter-latin.woff2',
    ],
    [
        '@fontsource-variable/inter/files/inter-cyrillic-wght-normal.woff2',
        'inter-cyrillic.woff2',
    ],
    [
        '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2',
        'jetbrains-mono-latin-400.woff2',
    ],
    [
        '@fontsource/jetbrains-mono/files/jetbrains-mono-cyrillic-400-normal.woff2',
        'jetbrains-mono-cyrillic-400.woff2',
    ],
    [
        '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2',
        'jetbrains-mono-latin-500.woff2',
    ],
    [
        '@fontsource/jetbrains-mono/files/jetbrains-mono-cyrillic-500-normal.woff2',
        'jetbrains-mono-cyrillic-500.woff2',
    ],
];

await fs.mkdir(fontsDir, { recursive: true });

for (const [source, filename] of fontFiles) {
    const from = path.join(root, 'node_modules', source);
    const to = path.join(fontsDir, filename);

    try {
        await fs.access(from);
    } catch {
        console.warn(`setup-fonts: пропуск — не найден ${source}. Запустите npm install.`);
        continue;
    }

    await fs.copyFile(from, to);
}

console.log('setup-fonts: woff2 скопированы в fonts/');
