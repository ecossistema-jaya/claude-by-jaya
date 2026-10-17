import AulaFrame from '@/app/AulaFrame';

export const metadata = { title: 'Caderno de Criação Visual — Bônus' };

/* Mesmo arranjo do guia dos 7 agentes: a rota embrulha um HTML de public/aulas/.
   A fonte é docs/atlas/ (fora do deploy), então a cópia em public/ é versionada. */
export default function Page() {
  return <AulaFrame src="/aulas/atlas-visual.html" titulo="Caderno de Criação Visual — Bônus" />;
}
