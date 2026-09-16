import Link from 'next/link';

export default async function SemAcesso({
  searchParams,
}: {
  searchParams: Promise<{ produto?: string }>;
}) {
  const { produto } = await searchParams;
  const zona = produto === 'zona';
  const destino = zona ? '/login?next=%2Fzona-de-genialidade%3Finiciar%3D1' : '/login';

  return (
    <main className="login">
      <div className="caixa">
        <div className="eyebrow">{zona ? 'Zona de Genialidade' : 'Série Claude do Zero'}</div>
        <h1>Conta não liberada</h1>
        <p>
          {zona
            ? 'Essa conta Google ainda não recebeu convite para a Zona de Genialidade. Se o convite foi enviado para outro e-mail, entre com ele.'
            : 'Essa conta Google não está na lista de alunos. Se você se inscreveu com outro email, entre com ele. Se acha que é engano, me chame que eu libero.'}
        </p>

        <Link className="botao" href={destino}>
          Tentar com outra conta
        </Link>
      </div>
    </main>
  );
}
