'use client';

import { useState } from 'react';

export default function Login() {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro('');

    const r = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: senha }),
    });

    if (r.ok) {
      window.location.href = '/';
      return;
    }
    setErro(r.status === 401 ? 'Senha incorreta.' : 'Algo travou. Tente de novo.');
    setEnviando(false);
  }

  return (
    <main className="login">
      <form onSubmit={entrar}>
        <div className="eyebrow">Série Claude do Zero</div>
        <h1>Área do aluno</h1>
        <p>Digite a senha que você recebeu para entrar.</p>

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          autoFocus
          autoComplete="current-password"
        />
        <button type="submit" disabled={enviando || !senha}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="erro">{erro}</p>
      </form>
    </main>
  );
}
