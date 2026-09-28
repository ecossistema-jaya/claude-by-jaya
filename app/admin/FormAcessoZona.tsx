'use client';

import { useActionState } from 'react';
import type { ProdutoComConvite } from '@/app/lib/acesso-produto';
import { concederAcessoProduto, type Resultado } from './acoes';

const INICIAL: Resultado = {};

export default function FormAcessoProduto({ produto }: { produto: ProdutoComConvite }) {
  const [estado, acao, enviando] = useActionState(concederAcessoProduto, INICIAL);

  return (
    <form action={acao} className="novo">
      <input name="produto" type="hidden" value={produto} />
      <input name="email" type="email" placeholder="e-mail da conta Google" required />
      <input name="nome" type="text" placeholder="nome (opcional)" />
      <button type="submit" disabled={enviando}>
        {enviando ? 'Convidando…' : 'Convidar'}
      </button>
      {estado.erro && <p className="erro">{estado.erro}</p>}
      {estado.ok && <p className="ok">{estado.ok}</p>}
    </form>
  );
}
