import BotaoGoogle from './BotaoGoogle';
import { destinoEhZona, normalizarDestinoLogin } from '@/app/lib/destino-login';

type LoginProps = {
  searchParams: Promise<{ erro?: string; next?: string }>;
};

export async function generateMetadata({ searchParams }: LoginProps) {
  const { next } = await searchParams;
  return {
    title: destinoEhZona(normalizarDestinoLogin(next))
      ? 'Acesso à Zona de Genialidade · Jaya Roberta'
      : 'Área do aluno · Claude do Zero',
  };
}

const RECADOS: Record<string, string> = {
  google: 'O Google não completou a entrada. Tente de novo.',
  saiu: 'Você saiu. Entre de novo quando quiser.',
};

export default async function Login({ searchParams }: LoginProps) {
  const { erro, next } = await searchParams;
  const destino = normalizarDestinoLogin(next);
  const zona = destinoEhZona(destino);

  return (
    <main className="login">
      <span className="claude-float f1" aria-hidden="true" />
      <span className="claude-float f2" aria-hidden="true" />
      <span className="claude-float f3" aria-hidden="true" />
      <div className="caixa">
        <div className="eyebrow">{zona ? 'Zona de Genialidade' : 'Série Claude do Zero'}</div>
        <h1>{zona ? 'Acesso por convite' : 'Área do aluno'}</h1>
        <p>
          {zona
            ? 'Entre com a conta Google que recebeu o convite.'
            : 'Entre com a conta Google que você usou na inscrição.'}
        </p>

        <BotaoGoogle destino={destino} />

        <p className="erro">{erro ? RECADOS[erro] ?? RECADOS.google : ''}</p>
      </div>
    </main>
  );
}
