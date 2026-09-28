#!/usr/bin/env node
// PreToolUse hook (Edit|Write): impede edição de arquivos GERADOS e de .env.
// Registered in .claude/settings.json. Exit 2 bloqueia; stderr vira feedback.
//
// Regra do projeto (docs/RUNBOOK.md): edita-se originais/, roda-se o npm script,
// o derivado em public/ e protected/ é reescrito. Editar o derivado é trabalho perdido.

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

  // caminho gerado → script que o regenera
  const gerados = [
    [/\/public\/aulas\//, 'npm run aulas  (fonte: originais/aula-*.html)'],
    [/\/public\/consciencia\//, 'npm run consciencia  (fonte: originais/arquitetura-da-consciencia.html + consciencia-*.js/css)'],
    [/\/protected\//, 'npm run consciencia | npm run zona  (fonte: originais/)'],
    [/\/public\/zona\/index\.html$/, 'npm run zona  (fonte: originais/zona-de-genialidade.html)'],
    [/\/public\/zona\/arte\//, 'npm run artes  (fonte: originais/zona-genialidade/*.png)'],
    [/\/public\/oferta\//, 'npm run oferta  (fonte: originais/claude-do-zero.html)'],
    [/\/public\/deck\//, 'npm run deck  (fonte: originais/arquitetura-da-consciencia/)'],
    [/\/public\/manual\//, 'npm run manual  (fonte: originais/manual-8-recursos/)'],
    [/\/public\/skill\//, 'npm run skill  (fonte: originais/skill-<nome>/)'],
  ];
  for (const [re, script] of gerados) {
    if (re.test(file)) {
      process.stderr.write(
        `BLOQUEADO: ${file} é arquivo GERADO. Edite a fonte em originais/ e rode: ${script}\n`,
      );
      process.exit(2);
    }
  }

  if (/\/\.env(\.[\w-]+)?$/.test(file) && !file.endsWith('.env.example')) {
    process.stderr.write(`BLOQUEADO: ${file} contém credenciais. Jaya edita na mão.\n`);
    process.exit(2);
  }

  process.exit(0);
});
