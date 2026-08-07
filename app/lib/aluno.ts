import type { SupabaseClient } from '@supabase/supabase-js';

export type Aluno = {
  id: string;
  email: string;
  nome: string | null;
  papel: 'aluno' | 'admin';
  ativo: boolean;
  observacao: string | null;
  criado_em: string;
  criado_por: string | null;
};

export const TABELA_ALUNOS = 'alunos_claude';
export const TABELA_ACESSOS = 'acessos_claude';

/** O email do Google chega com a caixa que o provedor mandou; a tabela guarda tudo em minúsculas. */
export function normalizarEmail(email: string | null | undefined) {
  return (email ?? '').trim().toLowerCase();
}

/* Uma linha ativa na allowlist é a única coisa que autoriza a entrada. A RLS já
   limita o SELECT à própria linha, então isto devolve null tanto para quem não
   está cadastrado quanto para quem está mas não pode ver — o efeito é o mesmo. */
export async function buscarAluno(
  supabase: SupabaseClient,
  email: string,
): Promise<Aluno | null> {
  const { data } = await supabase
    .from(TABELA_ALUNOS)
    .select('id, email, nome, papel, ativo, observacao, criado_em, criado_por')
    .eq('email', normalizarEmail(email))
    .maybeSingle();

  return data?.ativo ? (data as Aluno) : null;
}
