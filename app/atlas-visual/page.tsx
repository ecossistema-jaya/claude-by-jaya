import AulaFrame from '@/app/AulaFrame';

export const metadata = { title: 'Caderno de Criação Visual — Bônus' };

/* Mesmo arranjo do guia dos 7 agentes: a rota embrulha um HTML de public/aulas/, gerado de
   originais/guia-atlas-visual.html por build-aulas.mjs. A rota tem outro nome, então não
   disputa a URL com o arquivo. */
export default function Page() {
  return <AulaFrame src="/aulas/guia-atlas-visual.html" titulo="Caderno de Criação Visual — Bônus" sand />;
}
