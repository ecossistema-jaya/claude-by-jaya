#!/usr/bin/env node
// PostToolUse hook (Edit|Write): roda a verificação certa para a fonte editada.
// Registered in .claude/settings.json. Exit 2 devolve a falha ao Claude.
//
//   app/lib/{consciencia,mapa}*.mjs   → node scripts/test-consciencia.mjs
//   docs/carta-travessia-1.1.json     → npm run audit:taxonomia
//   *.ts / *.tsx                       → npx tsc --noEmit   (único typecheck do projeto)

import { spawnSync } from 'node:child_process';

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input = {};
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  const file = String(input.tool_input?.file_path ?? '').split('\\').join('/');
  if (!file) process.exit(0);

  const regras = [
    [/\/app\/lib\/(consciencia|mapa)[\w-]*\.mjs$/, 'node', ['scripts/test-consciencia.mjs'], 'test-consciencia'],
    [/\/docs\/carta-travessia-1\.1\.json$/, 'npm', ['run', 'audit:taxonomia'], 'audit:taxonomia'],
    [/\.(ts|tsx)$/, 'npx', ['tsc', '--noEmit'], 'tsc --noEmit'],
  ];
  const regra = regras.find(([re]) => re.test(file));
  if (!regra) process.exit(0);

  const [, cmd, args, nome] = regra;
  const r = spawnSync(cmd, args, {
    cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd(),
    encoding: 'utf8',
    shell: process.platform === 'win32',
    timeout: 90_000,
  });
  if (r.status === 0) {
    process.stdout.write(`${nome}: OK\n`);
    process.exit(0);
  }
  const saida = ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-40).join('\n');
  process.stderr.write(`${nome} FALHOU após editar ${file}:\n${saida}\n`);
  process.exit(2);
});
