#!/usr/bin/env node
// SessionStart hook: injects the memory index into the session context.
// Registered in .claude/settings.json. Whatever this prints becomes context.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const memoryDir = join(root, 'memory');
const indexPath = join(memoryDir, 'MEMORY.md');

try {
  const index = readFileSync(indexPath, 'utf8');
  const count = readdirSync(memoryDir).filter(
    (f) => f.endsWith('.md') && f !== 'MEMORY.md',
  ).length;

  process.stdout.write(
    `# Memória do projeto (${count} ${count === 1 ? 'aprendizado' : 'aprendizados'})\n\n` +
      `Contexto acumulado sobre como o Jaya trabalha. Aplique sem precisar ser lembrado.\n` +
      `Cada linha aponta para um arquivo em \`memory/\` — leia o arquivo antes de agir sobre\n` +
      `um item específico; o índice é só o gancho. Memórias descrevem o que era verdade\n` +
      `quando foram escritas: se uma citar arquivo, função ou flag, confirme que ainda existe.\n\n` +
      `Ao fim da sessão, se surgirem padrões novos, rode \`/improve-system\`.\n\n` +
      `---\n\n${index}`,
  );
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
  // No memory/ yet — stay silent rather than injecting noise into every session.
}
