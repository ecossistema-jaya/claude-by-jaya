import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import BotaoGoogle from '@/app/login/BotaoGoogle';
import { destinoEhBiblioteca, normalizarDestinoLogin } from '@/app/lib/destino-login';
import { exigirAcessoBiblioteca } from '@/app/lib/exigir-acesso-produto';
import ArteEntrada from '../ArteEntrada';
import styles from '../library.module.css';

export const metadata: Metadata = {
  title: 'Entrar',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

const RECADOS: Record<string, string> = {
  google: 'O Google não completou a entrada. Tente de novo.',
  saiu: 'Você saiu. Entre de novo quando quiser.',
};

type EntrarProps = { searchParams: Promise<{ erro?: string; next?: string }> };

/* Porta de entrada própria da biblioteca, separada do login do curso: são
   produtos diferentes, com listas de acesso diferentes. */
export default async function Entrar({ searchParams }: EntrarProps) {
  const { erro, next } = await searchParams;
  const pedido = normalizarDestinoLogin(next);
  const destino = destinoEhBiblioteca(pedido) ? pedido : '/biblioteca';

  /* Quem já tem sessão e convite não precisa ver esta tela. */
  const { resposta } = await exigirAcessoBiblioteca();
  if (!resposta) redirect(destino);

  return (
    <main id="conteudo" className={`${styles.hero} ${styles.entry}`}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span className={styles.dot} /> ACESSO POR CONVITE</p>
        <h1>Entre na<br /><em>biblioteca.</em></h1>
        <p className={styles.heroLead}>Use a conta Google que recebeu o convite da Biblioteca Claude by Jaya.</p>
        <div className={styles.entryButton}>
          <BotaoGoogle destino={destino} />
        </div>
        {erro && RECADOS[erro] && <p className={styles.entryNote}>{RECADOS[erro]}</p>}
      </div>
      <ArteEntrada />
    </main>
  );
}
