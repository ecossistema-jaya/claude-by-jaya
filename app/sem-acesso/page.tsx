import Link from 'next/link';

export default async function SemAcesso({
  searchParams,
}: {
  searchParams: Promise<{ produto?: string }>;
}) {
  const { produto } = await searchParams;
  const zona = produto === 'zona';
  const consciencia = produto === 'consciencia';
  const biblioteca = produto === 'biblioteca';
  const destino = zona
    ? '/login?next=%2Fzona-de-genialidade%2Finiciar'
    : consciencia
      ? '/login?next=%2Farquitetura-da-consciencia'
      : biblioteca
        ? '/login?next=%2Fbiblioteca'
        : '/login';
  const eyebrow = zona
    ? 'Zona de Genialidade'
    : consciencia
      ? 'Arquitetura da Consciência'
      : biblioteca
        ? 'Biblioteca Claude by Jaya'
        : 'Série Claude do Zero';
  const mensagem = zona
    ? 'Essa conta Google ainda não recebeu convite para a Zona de Genialidade. Se o convite foi enviado para outro e-mail, entre com ele.'
    : consciencia
      ? 'Essa conta Google ainda não recebeu convite para a Arquitetura da Consciência. Se o convite foi enviado para outro e-mail, entre com ele.'
      : biblioteca
        ? 'Essa conta Google ainda não recebeu convite para a Biblioteca. Se o convite foi enviado para outro e-mail, entre com ele.'
        : 'Essa conta Google não está na lista de alunos. Se você se inscreveu com outro email, entre com ele. Se acha que é engano, me chame que eu libero.';

  return (
    <main className="login">
      <div className="caixa">
        <div className="eyebrow">{eyebrow}</div>
        <h1>Conta não liberada</h1>
        <p>
          {mensagem}
        </p>

        <Link className="botao" href={destino}>
          Tentar com outra conta
        </Link>
      </div>
    </main>
  );
}
