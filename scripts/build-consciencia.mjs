import fs from 'node:fs';
import path from 'node:path';
import questions from '../app/lib/consciencia-schema.mjs';

const root = path.resolve(import.meta.dirname, '..');
const protectedOutput = path.join(root, 'protected', 'consciencia', 'index.html');
const publicOutput = path.join(root, 'public', 'consciencia', 'index.html');
const publicRedirect = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Acesso · Arquitetura da Consciência</title></head>
<body><p>Redirecionando para o acesso protegido…</p><script>location.replace('/arquitetura-da-consciencia')</script></body></html>\n`;
// Vercel excludes authoring sources; os dois artefatos revisados ficam versionados.
if (!fs.existsSync(path.join(root, 'originais', 'arquitetura-da-consciencia.html'))) {
  if (!fs.existsSync(protectedOutput) || !fs.existsSync(publicOutput)) {
    throw new Error('Missing Consciousness source and generated protected pages');
  }
  console.log('Consciousness: using the generated protected page');
  process.exit(0);
}
const read = name => fs.readFileSync(path.join(root, 'originais', name), 'utf8');
let html = read('arquitetura-da-consciencia.html');
let app = read('consciencia-app.js') + '\n' + read('consciencia-reading.js') + '\nintro();';
const marker = '/*__QUESTIONS__*/[]/*__/QUESTIONS__*/';
if (!app.includes(marker) || !app.includes('/*__AUTH_CONTEXT__*/null/*__/AUTH_CONTEXT__*/') || !html.includes('<!--__STYLE__-->') || !html.includes('<!--__APP__-->')) {
  throw new Error('Missing Consciousness template markers');
}
app = app.replace(marker, JSON.stringify(questions).replace(/</g, '\\u003c'));
html = html.replace('<!--__STYLE__-->', () => `<style>${read('consciencia.css')}</style>`)
  .replace('<!--__APP__-->', () => `<script>${app}</script>`);
fs.mkdirSync(path.dirname(protectedOutput), { recursive: true });
fs.mkdirSync(path.dirname(publicOutput), { recursive: true });
fs.writeFileSync(protectedOutput, html);
fs.writeFileSync(publicOutput, publicRedirect);
console.log(`Consciousness: ${questions.length} questions → protected/consciencia/index.html; public path redirects to login`);
