import type { SupabaseClient } from '@supabase/supabase-js';
import { normalizarEmail } from '@/app/lib/aluno';

export const TABELA_ACESSOS_PRODUTOS = 'acessos_produtos';
export const PRODUTO_ZONA = 'zona-de-genialidade';
export const PRODUTO_CONSCIENCIA = 'arquitetura-da-consciencia';
export const PRODUTO_ATLAS = 'atlas-de-forcas';
export const PRODUTO_BIBLIOTECA = 'biblioteca-claude';
export const PRODUTOS_COM_CONVITE = [
  PRODUTO_ZONA,
  PRODUTO_CONSCIENCIA,
  PRODUTO_ATLAS,
  PRODUTO_BIBLIOTECA,
] as const;
export type ProdutoComConvite = (typeof PRODUTOS_COM_CONVITE)[number];

export function nomeProduto(produto: ProdutoComConvite) {
  const nomes: Record<ProdutoComConvite, string> = {
    [PRODUTO_ZONA]: 'Zona de Genialidade',
    [PRODUTO_CONSCIENCIA]: 'Arquitetura da Consciência',
    [PRODUTO_ATLAS]: 'Atlas de Forças',
    [PRODUTO_BIBLIOTECA]: 'Biblioteca Claude by Jaya',
  };
  return nomes[produto];
}

export type AcessoProduto = {
  id: string;
  produto: string;
  email: string;
  nome: string | null;
  ativo: boolean;
  expira_em: string | null;
  criado_em: string;
  criado_por: string | null;
};

export async function buscarAcessoProduto(
  supabase: SupabaseClient,
  email: string,
  produto: ProdutoComConvite,
): Promise<AcessoProduto | null> {
  const agora = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABELA_ACESSOS_PRODUTOS)
    .select('id, produto, email, nome, ativo, expira_em, criado_em, criado_por')
    .eq('produto', produto)
    .eq('email', normalizarEmail(email))
    .eq('ativo', true)
    .or(`expira_em.is.null,expira_em.gt.${agora}`)
    .maybeSingle();

  if (error) {
    console.error('falha ao conferir acesso ao produto', produto, error.code, error.message);
    return null;
  }

  return (data as AcessoProduto | null) ?? null;
}
