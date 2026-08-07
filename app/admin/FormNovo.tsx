'use client';

import { useActionState } from 'react';
import { adicionarAluno, type Resultado } from './acoes';

const INICIAL: Resultado = {};

export default function FormNovo() {
  const [estado, acao, enviando] = useActionState(adicionarAluno, INICIAL);

  return (
    <form action={acao} className="novo">
      <input name="email" type="email" placeholder="email da conta Google" required />
      <input name="nome" type="text" placeholder="nome (opcional)" />
      <button type="submit" disabled={enviando}>
        {enviando ? 'Liberando…' : 'Liberar'}
      </button>
      {estado.erro && <p className="erro">{estado.erro}</p>}
      {estado.ok && <p className="ok">{estado.ok}</p>}
    </form>
  );
}
