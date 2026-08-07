import BotaoGoogle from './BotaoGoogle';

const RECADOS: Record<string, string> = {
  google: 'O Google não completou a entrada. Tente de novo.',
  saiu: 'Você saiu. Entre de novo quando quiser.',
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main className="login">
      <div className="caixa">
        <div className="eyebrow">Série Claude do Zero</div>
        <h1>Área do aluno</h1>
        <p>Entre com a conta Google que você usou na inscrição.</p>

        <BotaoGoogle />

        <p className="erro">{erro ? RECADOS[erro] ?? RECADOS.google : ''}</p>
      </div>
    </main>
  );
}
