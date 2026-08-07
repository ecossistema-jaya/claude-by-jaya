import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buscarAluno, TABELA_ACESSOS, TABELA_ALUNOS, type Aluno } from '@/app/lib/aluno';
import { clienteServidor } from '@/app/lib/supabase/servidor';
import { alternarAtivo, removerAluno } from './acoes';
import BotaoRemover from './BotaoRemover';
import FormNovo from './FormNovo';

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
