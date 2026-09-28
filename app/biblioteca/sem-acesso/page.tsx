import type { Metadata } from 'next';
import Link from 'next/link';
import ArteEntrada from '../ArteEntrada';
import styles from '../library.module.css';

export const metadata: Metadata = {
  title: 'Conta não liberada',
  robots: { index: false, follow: false },
};

/* O callback já encerrou a sessão antes de mandar para cá, então o botão abre
   a escolha de conta do Google de novo. */
export default function SemAcessoBiblioteca() {
  return (
    <main id="conteudo" className={`${styles.hero} ${styles.entry}`}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span className={styles.dot} /> ACESSO POR CONVITE</p>
        <h1>Conta<br /><em>não liberada.</em></h1>
        <p className={styles.heroLead}>
          Essa conta Google ainda não recebeu convite para a Biblioteca. Se o convite foi enviado
          para outro e-mail, entre com ele.
        </p>
        <div className={styles.heroButtons}>
          <Link href="/biblioteca/entrar" className={styles.primary}>
            Entrar com outra conta <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <ArteEntrada />
    </main>
  );
}
