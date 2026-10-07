'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { pedirCodigo, verificarCodigo } from './acoes-codigo';

/* Alternativa ao Google no curso, para quem comprou com e-mail que não é conta
   Google. Fica recolhida atrás de um link para não competir com o botão principal. */

const ESPERA_REENVIO = 60;

type Etapa = 'fechado' | 'email' | 'codigo';

export default function EntrarComCodigo() {
  const [etapa, setEtapa] = useState<Etapa>('fechado');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [indo, setIndo] = useState(false);
  const [erro, setErro] = useState('');
  const [espera, setEspera] = useState(0);

  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera(espera - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  async function enviar(e?: FormEvent) {
    e?.preventDefault();
    setIndo(true);
    setErro('');
    const r = await pedirCodigo(email);
    setIndo(false);
    if (!r.ok) {
      setErro(r.erro);
      return;
    }
    setCodigo('');
    setEtapa('codigo');
    setEspera(ESPERA_REENVIO);
  }

  async function confirmar(e: FormEvent) {
    e.preventDefault();
    setIndo(true);
    setErro('');
    /* Dando certo, a action redireciona e esta tela sai de cena; só volta
       resposta aqui quando o código não serviu. */
    const r = await verificarCodigo(email, codigo);
    if (r && !r.ok) {
      setErro(r.erro);
      setIndo(false);
    }
  }

  if (etapa === 'fechado') {
    return (
      <div className="codigo">
        <button type="button" className="codigo-abrir" onClick={() => setEtapa('email')}>
          Não usa Google? Receba um código por e-mail
        </button>
      </div>
    );
  }

  if (etapa === 'email') {
    return (
      <form className="codigo" onSubmit={enviar}>
        <label htmlFor="codigo-email">Seu e-mail de acesso</label>
        <input
          id="codigo-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
        />
        <button type="submit" className="codigo-enviar" disabled={indo || !email}>
          {indo ? 'Enviando…' : 'Receber código'}
        </button>
        <p className="erro" role="alert">{erro}</p>
      </form>
    );
  }

  return (
    <form className="codigo" onSubmit={confirmar}>
      <label htmlFor="codigo-numero">
        Código enviado para <strong>{email}</strong>
      </label>
      <input
        id="codigo-numero"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6,10}"
        maxLength={10}
        required
        autoFocus
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
        placeholder="000000"
      />
      <button type="submit" className="codigo-enviar" disabled={indo || codigo.length < 6}>
        {indo ? 'Entrando…' : 'Entrar'}
      </button>
      <p className="erro" role="alert">{erro}</p>
      <p className="codigo-ajuda">
        Não chegou? Olhe o spam.{' '}
        <button type="button" onClick={() => enviar()} disabled={indo || espera > 0}>
          {espera > 0 ? `Reenviar em ${espera}s` : 'Reenviar código'}
        </button>
        {' · '}
        <button
          type="button"
          onClick={() => {
            setEtapa('email');
            setErro('');
          }}
          disabled={indo}
        >
          Trocar e-mail
        </button>
      </p>
    </form>
  );
}
