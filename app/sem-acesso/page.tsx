import Link from 'next/link';

export default function SemAcesso() {
  return (
    <main className="login">
      <div className="caixa">
        <div className="eyebrow">Série Claude do Zero</div>
        <h1>Conta não liberada</h1>
        <p>
          Essa conta Google não está na lista de alunos. Se você se inscreveu com outro email,
          entre com ele. Se acha que é engano, me chame que eu libero.
        </p>

        <Link className="botao" href="/login">
          Tentar com outra conta
        </Link>
      </div>
    </main>
  );
}
