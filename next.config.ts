import path from 'node:path';
import type { NextConfig } from 'next';

/* Existe um pnpm-lock.yaml solto em C:\Users\Jaya. Com dois lockfiles à vista, o
   Next elege o home inteiro como raiz do workspace e passa a varrer os ~20
   projetos que moram lá — em desenvolvimento isso trava a compilação das rotas.
   Fixar a raiz no próprio projeto resolve, sem mexer no lockfile alheio. */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(import.meta.dirname),

  /* A Zona de Genialidade é um HTML autocontido em public/zona/, servido numa URL
     limpa. Sem iframe: a página é pública e o <head> dela precisa ser o <head> real
     do documento — é de lá que saem título, descrição e a prévia dos links. Dentro
     de um iframe nada disso chega ao robô do WhatsApp. */
  async rewrites() {
    return [
      { source: '/zona-de-genialidade', destination: '/zona/index.html' },
      { source: '/zona-de-genialidade/', destination: '/zona/index.html' },
      /* Mesma história para o deck da palestra: HTML autocontido em public/deck/,
         público, com o <head> real servindo a prévia dos links. */
      { source: '/deck-arquitetura-da-consciencia', destination: '/deck/index.html' },
      { source: '/deck-arquitetura-da-consciencia/', destination: '/deck/index.html' },
      /* E para a oferta do curso: vitrine pública, com a prévia de link própria. */
      { source: '/claude-do-zero', destination: '/oferta/index.html' },
      { source: '/claude-do-zero/', destination: '/oferta/index.html' },
    ];
  },
};

export default nextConfig;
