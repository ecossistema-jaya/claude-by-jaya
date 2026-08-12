import path from 'node:path';
import type { NextConfig } from 'next';

/* Existe um pnpm-lock.yaml solto em C:\Users\Jaya. Com dois lockfiles à vista, o
   Next elege o home inteiro como raiz do workspace e passa a varrer os ~20
   projetos que moram lá — em desenvolvimento isso trava a compilação das rotas.
   Fixar a raiz no próprio projeto resolve, sem mexer no lockfile alheio. */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(import.meta.dirname),
};

export default nextConfig;
