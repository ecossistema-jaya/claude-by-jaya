import AulaFrame from '@/app/AulaFrame';

export const metadata = { title: '7 agentes que fazem conteúdo — Guia bônus' };

/* Mesmo arranjo do manual (app/recursos): a rota embrulha um HTML de public/ no
   AulaFrame. O arquivo mora em /aulas/ junto das aulas, gerado de originais/ por
   build-aulas.mjs; a rota tem outro nome, então não disputa a URL com ele. */
export default function Page() {
  return <AulaFrame src="/aulas/guia-7-agentes.html" titulo="7 agentes que fazem conteúdo — Guia bônus" />;
}
