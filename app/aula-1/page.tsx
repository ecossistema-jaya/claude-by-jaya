import CourseLessonPage, { type CourseLessonData } from '@/app/CourseLessonPage';

export const metadata = { title: 'Aula 1 — Conversar com o Claude' };

const lesson: CourseLessonData = {
  number: 1,
  title: 'Conversar com o Claude',
  description: 'Saia da pergunta genérica e construa um pedido que o Claude entende, executa e devolve no formato certo.',
  headerImage: '/img/aula-01-header.webp',
  headerImageAlt: 'Jaya conversa com um assistente robô diante do computador',
  headerImageFocus: 'right',
  slideSrc: '/aulas/aula-01-conversar-com-o-claude.html',
  slideTitle: 'Slides da Aula 1 — Conversar com o Claude',
  duration: '20 minutos',
  outcomes: [
    { label: 'Você vai fazer', text: 'Transformar uma tarefa real em um prompt OCAS.' },
    { label: 'Tenha em mãos', text: 'Uma tarefa desta semana que você quer resolver.' },
    { label: 'Entrega da aula', text: 'Um resultado aproveitável, refinado em pelo menos uma rodada.' },
  ],
  preparation: [
    { title: 'Abra o Claude', text: 'Deixe em outra aba ou ao lado desta página.' },
    { title: 'Escolha uma tarefa real', text: 'Use algo que você precisa resolver nesta semana.' },
    { title: 'Defina a saída', text: 'Decida se quer uma lista, texto, tabela ou plano.' },
  ],
  conceptTitle: 'OCAS: quatro decisões antes de enviar.',
  conceptIntro: 'Use esta referência sempre que o Claude devolver algo genérico ou pouco aproveitável.',
  concepts: [
    { marker: 'O', title: 'Objetivo', text: 'O que você quer alcançar de verdade?' },
    { marker: 'C', title: 'Contexto', text: 'O que a IA precisa saber para decidir bem?' },
    { marker: 'A', title: 'Ação', text: 'O que deve ser feito agora?' },
    { marker: 'S', title: 'Saída', text: 'Como a resposta precisa chegar?' },
  ],
  example: {
    before: '“Melhore meu currículo.”',
    after: '“Quero disputar vagas de analista de dados. Analise meu currículo, priorize ajustes para triagem de RH e devolva uma lista por impacto.”',
  },
  practiceTitle: 'Preencha e envie o seu primeiro OCAS.',
  practiceIntro: 'Troque os campos entre colchetes pelo seu caso. Depois, envie o pedido ao Claude.',
  promptLabel: 'Template OCAS',
  prompt: `Meu objetivo é [resultado que quero].

Contexto: [situação, público, dados e limites].

Quero que você [ação que deve executar].

Entregue em [formato da saída]. Antes de concluir, confira [critério de qualidade].`,
  taskTitle: 'Uma tarefa real resolvida.',
  taskText: 'Envie o prompt, leia a resposta e faça pelo menos um ajuste conversando: “deixe mais curto”, “mude o tom” ou “me dê três versões”.',
  deliverable: 'você consegue usar a resposta no mundo real sem recomeçar o pedido do zero.',
  success: [
    { title: 'Tem contexto', text: 'O Claude não precisou adivinhar para quem ou para quê.' },
    { title: 'Tem formato', text: 'A resposta chegou organizada do jeito que você pediu.' },
    { title: 'Virou uso', text: 'Você aproveitou ou refinou a resposta em uma tarefa real.' },
  ],
  next: { href: '/aula-2', number: 2, title: 'Botar o Claude pra trabalhar' },
};

export default function Page() {
  return <CourseLessonPage lesson={lesson} />;
}
