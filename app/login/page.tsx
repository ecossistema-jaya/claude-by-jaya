import { redirect } from 'next/navigation';
import BotaoGoogle from './BotaoGoogle';
import {
  destinoEhBiblioteca,
  destinoEhConsciencia,
  destinoEhZona,
  normalizarDestinoLogin,
} from '@/app/lib/destino-login';

type LoginProps = {
  searchParams: Promise<{ erro?: string; next?: string }>;
};

export async function generateMetadata({ searchParams }: LoginProps) {
  const { next } = await searchParams;
  const destino = normalizarDestinoLogin(next);
  return {
    title: destinoEhZona(destino)
      ? 'Acesso à Zona de Genialidade · Jaya Roberta'
      : destinoEhConsciencia(destino)
        ? 'Acesso à Arquitetura da Consciência · Jaya Roberta'
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
  const consciencia = destinoEhConsciencia(destino);
  /* A biblioteca tem porta própria; links antigos para cá seguem para lá. */
  if (destinoEhBiblioteca(destino)) {
    redirect(`/biblioteca/entrar?next=${encodeURIComponent(destino)}`);
  }
  const eyebrow = zona
    ? 'Zona de Genialidade'
    : consciencia
      ? 'Arquitetura da Consciência'
      : 'Série Claude do Zero';
  const titulo = zona || consciencia ? 'Acesso por convite' : 'Área do aluno';
  const instrucao = zona || consciencia
    ? 'Entre com a conta Google que recebeu o convite.'
    : 'Entre com a conta Google que você usou na inscrição.';

  return (
    <main className="login">
      <span className="claude-float f1" aria-hidden="true" />
      <span className="claude-float f2" aria-hidden="true" />
      <span className="claude-float f3" aria-hidden="true" />
      <div className="caixa">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{titulo}</h1>
        <p>{instrucao}</p>

        <BotaoGoogle destino={destino} />

        <p className="erro">{erro ? RECADOS[erro] ?? RECADOS.google : ''}</p>
      </div>
    </main>
  );
}
