import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './library.module.css';

const title = 'Biblioteca Claude by Jaya · Inteligência Aplicada';
const description = 'Guias gratuitos, exercícios e instruções para aprender Claude e construir o seu jeito de trabalhar com IA. Explore nove ambientes de inteligência aplicada.';

export const metadata: Metadata = {
  metadataBase: new URL('https://jayaroberta.com'),
  title: { default: title, template: '%s · Claude by Jaya' },
  description,
  openGraph: { title, description, siteName: 'Biblioteca Claude by Jaya', type: 'website', locale: 'pt_BR', images: [{ url: 'https://jayaroberta.com/biblioteca/opengraph-image', width: 1200, height: 630, alt: 'Claude by Jaya — Biblioteca de Inteligência Aplicada' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['https://jayaroberta.com/biblioteca/opengraph-image'] },
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.library}>
    <a className={styles.skip} href="#conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <Link href="/biblioteca" className={styles.brand} aria-label="Claude by Jaya — início da biblioteca">
        <span className={styles.brandMark} aria-hidden="true">✳</span>
        <span>Claude <i>by Jaya</i></span>
      </Link>
      <nav aria-label="Navegação principal" className={styles.topNav}>
        <Link href="/biblioteca#acervo">Biblioteca</Link>
        <Link href="/biblioteca#ambientes">Os 9 ambientes</Link>
        <Link href="/claude">O curso <span aria-hidden="true">↗</span></Link>
      </nav>
      <Link className={styles.headerCta} href="/biblioteca/primeira-entrega">Comece aqui <span aria-hidden="true">↗</span></Link>
      <Link className={styles.mobileSearch} href="/biblioteca#acervo">Buscar <span aria-hidden="true">⌕</span></Link>
    </header>
    {children}
    <footer className={styles.footer}>
      <div><Link href="/biblioteca" className={styles.footerBrand}>Claude <i>by Jaya</i></Link><p>Curadoria, prática e inteligência aplicada.</p></div>
      <div><span>FEITO PARA APRENDER. ABERTO PARA EXPLORAR.</span><p>Biblioteca independente de Jaya Roberta.<br />Sem vínculo oficial com a Anthropic.</p></div>
      <Link href="/biblioteca#acervo">Voltar à biblioteca <span aria-hidden="true">↗</span></Link>
    </footer>
  </div>;
}
