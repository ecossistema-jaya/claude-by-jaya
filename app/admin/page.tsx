import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buscarAluno, TABELA_ACESSOS, TABELA_ALUNOS, type Aluno } from '@/app/lib/aluno';
import {
  PRODUTO_ATLAS,
  PRODUTO_BIBLIOTECA,
  PRODUTOS_COM_CONVITE,
  TABELA_ACESSOS_PRODUTOS,
  type AcessoProduto,
} from '@/app/lib/acesso-produto';
import { clienteServidor } from '@/app/lib/supabase/servidor';
import { alternarAtivo, removerAluno } from './acoes';
import BotaoRemover from './BotaoRemover';
import FormNovo from './FormNovo';
import SecaoConvites from './SecaoConvites';

/* Produtos com painel próprio ficam fora daqui: cada um é administrado na
   própria área, e este painel só aponta para lá. */
const CONVITES_NESTE_PAINEL = PRODUTOS_COM_CONVITE.filter(
  (produto) => produto !== PRODUTO_BIBLIOTECA && produto !== PRODUTO_ATLAS,
);

export const metadata = { title: 'Alunos · Claude do Zero' };
export const dynamic = 'force-dynamic';

type Acesso = { id: number; email: string; entrou_em: string };

const quando = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export default async function Admin() {
  const supabase = await clienteServidor();
  const { data: usuario } = await supabase.auth.getUser();

  const eu = usuario.user?.email ? await buscarAluno(supabase, usuario.user.email) : null;

  /* Aluno comum não vê que existe um painel: 404, não "acesso negado". */
  if (eu?.papel !== 'admin') notFound();

  const { data: alunos } = await supabase
    .from(TABELA_ALUNOS)
    .select('id, email, nome, papel, ativo, observacao, criado_em, criado_por')
    .order('criado_em', { ascending: false });

  const { data: acessos } = await supabase
    .from(TABELA_ACESSOS)
    .select('id, email, entrou_em')
    .order('entrou_em', { ascending: false })
    .limit(15);

  const { data: acessosProduto } = await supabase
    .from(TABELA_ACESSOS_PRODUTOS)
    .select('id, produto, email, nome, ativo, expira_em, criado_em, criado_por')
    .in('produto', CONVITES_NESTE_PAINEL)
    .order('criado_em', { ascending: false });

  const lista = (alunos ?? []) as Aluno[];
  const ativos = lista.filter((a) => a.ativo).length;

  return (
    <main className="admin">
      <header>
        <Link href="/" className="voltar">
          ← índice
        </Link>
        <h1>Alunos</h1>
        <p>
          {lista.length} na lista · {ativos} com acesso liberado
        </p>
      </header>

      <section>
        <h2>Liberar alguém</h2>
        <FormNovo />
      </section>

      <section>
        <h2>Biblioteca Claude by Jaya</h2>
        <p className="sub">
          Os acessos da biblioteca têm painel próprio:{' '}
          <Link href="/biblioteca/admin">jayaroberta.com/biblioteca/admin</Link>
        </p>
      </section>

      <section>
        <h2>Atlas de Forças</h2>
        <p className="sub">
          Os acessos do Atlas têm painel próprio:{' '}
          <a href="https://quiz.jayaroberta.com.br/admin">quiz.jayaroberta.com.br/admin</a>
        </p>
      </section>

      {CONVITES_NESTE_PAINEL.map((produto) => (
        <SecaoConvites
          key={produto}
          produto={produto}
          acessos={((acessosProduto ?? []) as AcessoProduto[]).filter(
            (acesso) => acesso.produto === produto,
          )}
        />
      ))}

      <section>
        <h2>Lista</h2>
        <table>
          <tbody>
            {lista.map((a) => (
              <tr key={a.id} className={a.ativo ? '' : 'inativo'}>
                <td>
                  <strong>{a.nome || a.email}</strong>
                  {a.nome && <span className="sub">{a.email}</span>}
                  {a.papel === 'admin' && <span className="tag">admin</span>}
                </td>
                <td className="sub">{quando(a.criado_em)}</td>
                <td className="acoes">
                  <form action={alternarAtivo}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="ativo" value={String(a.ativo)} />
                    <button type="submit">{a.ativo ? 'desativar' : 'reativar'}</button>
                  </form>
                  {a.id !== eu.id && (
                    <form action={removerAluno}>
                      <input type="hidden" name="id" value={a.id} />
                      <BotaoRemover email={a.email} />
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Últimas entradas</h2>
        {acessos?.length ? (
          <ul className="acessos">
            {(acessos as Acesso[]).map((ac) => (
              <li key={ac.id}>
                <span>{ac.email}</span>
                <span className="sub">{quando(ac.entrou_em)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="sub">Ninguém entrou ainda.</p>
        )}
      </section>
    </main>
  );
}
