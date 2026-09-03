import AulaFrame from '@/app/AulaFrame';

export const metadata = { title: '8 recursos do Claude — Manual de trabalho' };

/* A rota é /recursos e o HTML mora em /manual/index.html de propósito: rota do
   App Router e arquivo de public/ com o mesmo nome disputariam a mesma URL. */
export default function Page() {
  return <AulaFrame src="/manual/index.html" titulo="8 recursos do Claude — Manual de trabalho" />;
}
