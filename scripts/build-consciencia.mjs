import fs from 'node:fs';
import path from 'node:path';
import questions from '../app/lib/consciencia-schema.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'originais', name), 'utf8');
let html = read('arquitetura-da-consciencia.html');
let app = read('consciencia-app.js') + '\n' + read('consciencia-reading.js') + '\nintro();';
const marker = '/*__QUESTIONS__*/[]/*__/QUESTIONS__*/';
if (!app.includes(marker) || !html.includes('<!--__STYLE__-->') || !html.includes('<!--__APP__-->')) {
  throw new Error('Missing Consciousness template markers');
}
app = app.replace(marker, JSON.stringify(questions).replace(/</g, '\\u003c'));
html = html.replace('<!--__STYLE__-->', () => `<style>${read('consciencia.css')}</style>`)
  .replace('<!--__APP__-->', () => `<script>${app}</script>`);
const output = path.join(root, 'public', 'consciencia', 'index.html');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html);
console.log(`Consciousness: ${questions.length} questions → public/consciencia/index.html`);
