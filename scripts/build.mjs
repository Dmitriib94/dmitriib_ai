import * as esbuild from 'esbuild';
import { minify as minifyHtml } from 'html-minifier-terser';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

async function emptyDir(dir) {
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
}

async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
            continue;
        }

        await fs.copyFile(srcPath, destPath);
    }
}

async function buildAssets() {
    await Promise.all([
        esbuild.build({
            entryPoints: [path.join(root, 'css/main.css')],
            outdir: dist,
            entryNames: 'css/[name]',
            assetNames: 'fonts/[name]',
            publicPath: '/',
            bundle: true,
            minify: true,
            logLevel: 'info',
            loader: {
                '.woff2': 'file',
            },
        }),
        esbuild.build({
            entryPoints: [path.join(root, 'js/main.js')],
            outfile: path.join(dist, 'js/main.js'),
            bundle: true,
            minify: true,
            format: 'esm',
            logLevel: 'info',
        }),
    ]);
}

async function buildHtml() {
    const html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
    const minified = await minifyHtml(html, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        keepClosingSlash: true,
        minifyCSS: false,
        minifyJS: false,
    });

    await fs.writeFile(path.join(dist, 'index.html'), minified, 'utf8');
}

async function copyStatic() {
    await Promise.all([
        copyDir(path.join(root, 'img'), path.join(dist, 'img')),
        copyDir(path.join(root, 'favicons'), path.join(dist, 'favicons')),
    ]);
}

async function printStats() {
    const files = [
        ['index.html', path.join(root, 'index.html'), path.join(dist, 'index.html')],
        ['css/main.css (bundle)', path.join(root, 'css/main.css'), path.join(dist, 'css/main.css')],
        ['js/main.js (bundle)', path.join(root, 'js/main.js'), path.join(dist, 'js/main.js')],
    ];

    const jsFiles = await collectFiles(path.join(root, 'js'), '.js');
    const cssFiles = await collectFiles(path.join(root, 'css'), '.css');
    const jsSourceSize = await totalSize(jsFiles);
    const cssSourceSize = await totalSize(cssFiles);

    console.log('\nРазмеры после сборки:\n');

    for (const [label, , builtPath] of files) {
        const builtStat = await fs.stat(builtPath);
        console.log(`  ${label.padEnd(24)} ${formatBytes(builtStat.size)}`);
    }

    const builtJs = await fs.stat(path.join(dist, 'js/main.js'));
    const builtCss = await fs.stat(path.join(dist, 'css/main.css'));
    const builtHtml = await fs.stat(path.join(dist, 'index.html'));

    console.log('\nЭкономия:');
    console.log(`  JS:  ${formatBytes(jsSourceSize)} → ${formatBytes(builtJs.size)}`);
    console.log(`  CSS: ${formatBytes(cssSourceSize)} → ${formatBytes(builtCss.size)}`);
    console.log(`  HTML: ${formatBytes((await fs.stat(path.join(root, 'index.html'))).size)} → ${formatBytes(builtHtml.size)}`);
    console.log(`\nГотово: ${dist}\n`);
}

async function collectFiles(dir, ext, result = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await collectFiles(fullPath, ext, result);
            continue;
        }
        if (entry.name.endsWith(ext)) {
            result.push(fullPath);
        }
    }

    return result;
}

async function totalSize(files) {
    let size = 0;
    for (const file of files) {
        size += (await fs.stat(file)).size;
    }
    return size;
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
}

console.log('Сборка production-версии...\n');

await emptyDir(dist);
await fs.mkdir(path.join(dist, 'css'), { recursive: true });
await fs.mkdir(path.join(dist, 'js'), { recursive: true });

await buildAssets();
await buildHtml();
await copyStatic();
await printStats();
