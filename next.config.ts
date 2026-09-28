import path from 'node:path';
import type { NextConfig } from 'next';

/* Existe um pnpm-lock.yaml solto em C:\Users\Jaya. Com dois lockfiles à vista, o
   Next elege o home inteiro como raiz do workspace e passa a varrer os ~20
   projetos que moram lá — em desenvolvimento isso trava a compilação das rotas.
   Fixar a raiz no próprio projeto resolve, sem mexer no lockfile alheio. */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(import.meta.dirname),

  /* Os assessments protegidos são servidos por Route Handlers. Permanecem aqui
     somente as vitrines e materiais explicitamente públicos. */
  async rewrites() {
    return [
      /* Mesma história para o deck da palestra: HTML autocontido em public/deck/,
         público, com o <head> real servindo a prévia dos links. */
      { source: '/deck-arquitetura-da-consciencia', destination: '/deck/index.html' },
      { source: '/deck-arquitetura-da-consciencia/', destination: '/deck/index.html' },
      /* E para a oferta do curso: vitrine pública, com a prévia de link própria. */
      { source: '/claude', destination: '/oferta/index.html' },
      { source: '/claude/', destination: '/oferta/index.html' },
      /* Entrada do aluno: reutiliza o índice existente, com a mesma proteção. */
      { source: '/claude-do-zero', destination: '/' },
      { source: '/claude-do-zero/', destination: '/' },
    ];
  },
};

export default nextConfig;
