import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const TITULO = 'Claude do Zero · Jaya Roberta';
const DESCRICAO = 'Cinco aulas na ordem. Cada uma é pra fazer junto — abra o Claude do lado.';

/* A URL precisa ser absoluta na prévia das redes sociais. A Vercel expõe o
   domínio de produção em VERCEL_PROJECT_PRODUCTION_URL, então isto continua
   certo se um domínio próprio for apontado depois. */
const BASE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: TITULO,
  description: DESCRICAO,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Claude do Zero',
    title: TITULO,
    description: DESCRICAO,
    images: [{ url: '/img/og.jpg', width: 1254, height: 1254, alt: TITULO }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO,
    description: DESCRICAO,
    images: ['/img/og.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Petrona:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
