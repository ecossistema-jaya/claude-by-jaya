import {
  nomeProduto,
  type AcessoProduto,
  type ProdutoComConvite,
} from '@/app/lib/acesso-produto';
import { alternarAcessoProduto } from './acoes';
import FormAcessoZona from './FormAcessoZona';

const quando = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

/* Uma seção de convites por produto. Usada no /admin do curso e nos painéis
   próprios de cada produto, como /biblioteca/admin. */
export default function SecaoConvites({
  produto,
  acessos,
  titulo,
}: {
  produto: ProdutoComConvite;
  acessos: AcessoProduto[];
  titulo?: string;
}) {
  return (
    <section>
      <h2>{titulo ?? `Convites · ${nomeProduto(produto)}`}</h2>
      <p className="sub">
        Login Google e convite ativo são obrigatórios para acessar.
      </p>
      <FormAcessoZona produto={produto} />
      <table>
        <tbody>
          {acessos.map((acesso) => {
            const expirado = !!acesso.expira_em && new Date(acesso.expira_em) <= new Date();
            const liberado = acesso.ativo && !expirado;
            return (
              <tr key={acesso.id} className={liberado ? '' : 'inativo'}>
                <td>
                  <strong>{acesso.nome || acesso.email}</strong>
                  {acesso.nome && <span className="sub">{acesso.email}</span>}
                  {expirado && <span className="tag">expirado</span>}
                </td>
                <td className="sub">
                  {acesso.expira_em ? `até ${quando(acesso.expira_em)}` : 'sem expiração'}
                </td>
                <td className="acoes">
                  <form action={alternarAcessoProduto}>
                    <input type="hidden" name="id" value={acesso.id} />
                    <input type="hidden" name="ativo" value={String(liberado)} />
                    <button type="submit">{liberado ? 'revogar' : 'reativar'}</button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
