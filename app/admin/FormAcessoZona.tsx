'use client';

import { useActionState } from 'react';
import { concederAcessoZona, type Resultado } from './acoes';

const INICIAL: Resultado = {};

export default function FormAcessoZona() {
  const [estado, acao, enviando] = useActionState(concederAcessoZona, INICIAL);

  return (
    <form action={acao} className="novo">
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
