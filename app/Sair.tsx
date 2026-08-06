'use client';

/* POST em vez de link: uma rota GET de logout pode ser disparada por prefetch
   ou por um scanner de links e derrubar a sessão sem o aluno pedir. */
export default function Sair() {
  async function sair() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <button type="button" className="sair" onClick={sair}>
      Sair
    </button>
  );
}
