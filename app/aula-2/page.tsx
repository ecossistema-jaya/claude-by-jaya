import CourseLessonPage, { type CourseLessonData } from '@/app/CourseLessonPage';

export const metadata = { title: 'Aula 2 — Botar o Claude pra Trabalhar' };

const lesson: CourseLessonData = {
  number: 2,
  title: 'Botar o Claude pra trabalhar',
  description: 'Pare de receber apenas explicações. Organize um contexto real e peça ao Claude uma entrega que você possa usar.',
  headerImage: '/img/aula-02-header.webp',
  headerImageAlt: 'Jaya e um assistente robô transformam um trabalho em documentos, checklist, cálculo e dashboard',
  headerImageFocus: 'left',
  slideSrc: '/aulas/aula-02-botar-o-claude-pra-trabalhar.html',
  slideTitle: 'Slides da Aula 2 — Botar o Claude pra trabalhar',
  duration: '25 minutos',
  outcomes: [
    { label: 'Você vai fazer', text: 'Criar um projeto e pedir um artefato útil.' },
    { label: 'Tenha em mãos', text: 'Um tema, cliente, produto ou rotina real.' },
    { label: 'Entrega da aula', text: 'Um artefato funcional dentro de um projeto organizado.' },
  ],
  preparation: [
    { title: 'Defina o projeto', text: 'Escolha um cliente, empresa, produto, estudo ou rotina.' },
    { title: 'Junte uma fonte', text: 'Separe o texto, planilha, instrução ou dado que o Claude usará.' },
    { title: 'Escolha a entrega', text: 'Decida entre calculadora, página, plano, dashboard ou documento.' },
  ],
  conceptTitle: 'Três camadas do trabalho.',
  conceptIntro: 'Você não precisa explorar todos os recursos de uma vez. Complete uma travessia: contexto, pedido e entrega.',
  concepts: [
    { marker: '1', title: 'Projeto', text: 'Guarda o contexto que precisa continuar valendo.' },
    { marker: '2', title: 'Pedido', text: 'Define a entrega usando a clareza do OCAS.' },
    { marker: '3', title: 'Artefato', text: 'Transforma a conversa em algo que funciona e pode ser refinado.' },
  ],
  example: {
    before: '“Como faço um orçamento para minha oficina?”',
    after: '“Crie uma calculadora de orçamento com serviço, horas, peças, margem e valor final. Quero editar os campos e imprimir o resultado.”',
  },
  practiceTitle: 'Peça uma coisa pronta.',
  practiceIntro: 'O exemplo abaixo usa uma empresa fictícia. Troque os dados pelo seu contexto real.',
  promptLabel: 'Exemplo · Oficina Horizonte',
  prompt: `Crie uma calculadora simples de orçamento para a Oficina Horizonte.

Ela deve receber: nome do cliente, serviço, horas de trabalho, valor da hora, custo das peças e margem.

Calcule mão de obra, subtotal, margem e valor final. Permita editar qualquer campo e imprimir o orçamento.

Use uma interface clara, legível no celular, com uma única ação principal. Antes de concluir, teste com: 3 horas, R$ 120 por hora, R$ 450 em peças e margem de 20%.`,
  taskTitle: 'Um projeto e um artefato reais.',
  taskText: 'Crie o projeto, dê contexto, peça o artefato e faça duas mudanças por conversa. O objetivo é experimentar a passagem de resposta para entrega.',
  deliverable: 'o artefato aceita dados, produz uma saída e ficou guardado no contexto certo.',
  success: [
    { title: 'Contexto separado', text: 'O projeto tem nome e finalidade claros.' },
    { title: 'Artefato funciona', text: 'Recebe uma entrada e devolve uma saída útil.' },
    { title: 'Foi refinado', text: 'Você pediu pelo menos duas mudanças conversando.' },
  ],
  next: { href: '/aula-3', number: 3, title: 'Documento Mestre' },
};

export default function Page() {
  return <CourseLessonPage lesson={lesson} />;
}
