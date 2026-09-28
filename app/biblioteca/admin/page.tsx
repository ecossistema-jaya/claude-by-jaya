import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import SecaoConvites from '@/app/admin/SecaoConvites';
import { buscarAluno } from '@/app/lib/aluno';
import {
  PRODUTO_BIBLIOTECA,
  TABELA_ACESSOS_PRODUTOS,
  type AcessoProduto,
} from '@/app/lib/acesso-produto';
import { clienteServidor } from '@/app/lib/supabase/servidor';

export const metadata: Metadata = {
  title: 'Acessos da biblioteca',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

/* Painel próprio da biblioteca, no mesmo molde do EIXO: quem administra o
   curso administra aqui, e mais ninguém sabe que a página existe. As políticas
   de acessos_produtos só deixam admin ler e escrever, então o banco continua
   sendo a última palavra. */
export default async function AdminBiblioteca() {
  const supabase = await clienteServidor();
  const { data: usuario } = await supabase.auth.getUser();
  if (!usuario.user) redirect('/biblioteca/entrar?next=%2Fbiblioteca%2Fadmin');
  const eu = usuario.user?.email ? await buscarAluno(supabase, usuario.user.email) : null;
  if (eu?.papel !== 'admin') notFound();

  const { data: convites } = await supabase
    .from(TABELA_ACESSOS_PRODUTOS)
    .select('id, produto, email, nome, ativo, expira_em, criado_em, criado_por')
    .eq('produto', PRODUTO_BIBLIOTECA)
    .order('criado_em', { ascending: false });

  const lista = (convites ?? []) as AcessoProduto[];
  const liberados = lista.filter(
    (c) => c.ativo && (!c.expira_em || new Date(c.expira_em) > new Date()),
  ).length;

  return (
    <main id="conteudo" className="admin">
      <header>
        <Link href="/biblioteca" className="voltar">
          ← biblioteca
        </Link>
        <h1>Acessos permitidos</h1>
        <p>
          {liberados} {liberados === 1 ? 'convite ativo' : 'convites ativos'} · acesso
          independente do curso Claude do Zero
        </p>
      </header>

      <SecaoConvites produto={PRODUTO_BIBLIOTECA} acessos={lista} titulo="Adicionar acesso" />
    </main>
  );
}
