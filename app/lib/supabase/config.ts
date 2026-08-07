/* As duas variáveis viajam para o navegador, então precisam ser lidas por nome
   completo — o Next substitui `process.env.NEXT_PUBLIC_*` em tempo de build e
   não enxerga acesso dinâmico. Faltando qualquer uma, é melhor quebrar aqui do
   que servir uma tela de login que não loga. */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias.');
}
