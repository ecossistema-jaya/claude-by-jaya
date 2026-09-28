#!/usr/bin/env node
// Smoke test de produção — checagens do docs/RUNBOOK.md sem login.
// Uso: node smoke-prod.mjs [baseUrl]   (padrão: produção)

const base = (process.argv[2] || 'https://claude-by-jaya.vercel.app').replace(/\/$/, '');

const checks = [
  { rota: '/aula-1', metodo: 'GET', espera: (r) => r.status === 307 && /\/login/.test(r.headers.get('location') || ''), desc: '307 → /login (middleware vivo)' },
  { rota: '/zona-de-genialidade', metodo: 'GET', espera: (r) => r.status === 200 && /text\/html/.test(r.headers.get('content-type') || ''), desc: '200 text/html' },
  { rota: '/claude', metodo: 'GET', espera: (r) => r.status === 200 && /text\/html/.test(r.headers.get('content-type') || ''), desc: '200 text/html (vitrine pública)' },
  { rota: '/claude-do-zero', metodo: 'GET', espera: (r) => r.status === 307 && /\/login/.test(r.headers.get('location') || ''), desc: '307 → /login (entrada do aluno)' },
  { rota: '/api/zona/analyze', metodo: 'POST', espera: (r) => r.status === 401 && /json/.test(r.headers.get('content-type') || ''), desc: '401 JSON (API protegida)' },
  { rota: '/admin', metodo: 'GET', espera: (r) => r.status === 307 && /\/login/.test(r.headers.get('location') || ''), desc: '307 → /login' },
];

let falhas = 0;
for (const c of checks) {
  const inicio = Date.now();
  let linha;
  try {
    const r = await fetch(base + c.rota, {
      method: c.metodo,
      redirect: 'manual',
      headers: c.metodo === 'POST' ? { 'content-type': 'application/json' } : {},
      body: c.metodo === 'POST' ? '{}' : undefined,
      signal: AbortSignal.timeout(15_000),
    });
    const ok = c.espera(r);
    if (!ok) falhas++;
    const loc = r.headers.get('location');
    linha = `${ok ? 'OK ' : 'ERR'}  ${c.metodo.padEnd(4)} ${c.rota.padEnd(22)} ${String(r.status).padEnd(4)} ${loc ? '→ ' + loc : (r.headers.get('content-type') || '').split(';')[0]}`;
  } catch (e) {
    falhas++;
    linha = `ERR  ${c.metodo.padEnd(4)} ${c.rota.padEnd(22)} ---  ${e.name === 'TimeoutError' ? 'timeout 15s' : e.message}`;
  }
  console.log(`${linha}   [${c.desc}, ${Date.now() - inicio}ms]`);
}

console.log(falhas ? `\n${falhas} falha(s) em ${base}` : `\nTudo verde em ${base}`);
process.exit(falhas ? 1 : 0);
