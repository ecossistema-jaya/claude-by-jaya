import mapaQuestions from './mapa-schema.mjs';

const questions = structuredClone(mapaQuestions);
const additions = [
  ['ordinary_activity', 'O que você consegue fazer quando precisa, mas não tem muita vontade de repetir?', 'Pense em uma tarefa cotidiana. Conte o que consegue fazer; não precisa ser algo em que se destaca.'],
  ['learning_edge', 'O que gostaria de aprender, mesmo que hoje precise de ajuda?', 'Pode ser algo para sua casa, seus interesses ou sua convivência. Precisar aprender não diminui suas capacidades.'],
  ['contribution_episode', 'Lembre de uma situação em que sua ajuda fez diferença. O que você fez e como percebeu que ajudou?', 'Conte uma ação e o sinal que percebeu: o que alguém disse ou o que mudou. Se não lembrar, tudo bem.'],
  ['energy_after', 'Depois de fazer uma atividade de que gosta, como você costuma se sentir? Conte um exemplo.', 'Você pode gostar e ainda assim ficar cansado. Considere também o descanso, o tempo e as condições daquele dia.'],
].map(([id, title, hint]) => ({ id, section: 'O que chama você', title, type: 'text', options: [], hint, optional: true }));

questions.splice(questions.findIndex(q => q.id === 'good_not_like') + 1, 0, ...additions);

const refinements = [
  {
    after: 'episode', id: 'repeat_episode', section: 'O que chama você',
    title: 'Você lembra de outra situação em que fez algo parecido e também se sentiu bem? O que se repetiu?',
    type: 'text', options: [], optional: true,
    hint: 'Conte o que aconteceu e o que foi parecido ou diferente. Se não lembrar de outro exemplo, pode pular.',
    when: { id: 'episode', mode: 'meaningful' },
  },
  {
    after: 'setting', id: 'rhythm', section: 'Seu jeito de agir',
    title: 'Quando pode escolher seu ritmo, como costuma avançar melhor em algo importante?',
    type: 'single', optional: false,
    options: ['Em períodos curtos e frequentes', 'Em períodos mais longos, com pausas', 'Em etapas com um prazo combinado', 'Com companhia ou combinando com alguém', 'Depende da atividade e da fase', 'Ainda não sei'],
    hint: 'Pense no que ajuda hoje. Seu ritmo pode mudar conforme a atividade e suas condições.',
  },
  {
    after: 'barrier', id: 'frustration_example', section: 'Seu próximo passo',
    title: 'Que situação se repete no seu dia a dia e dificulta essa mudança? Conte um exemplo.',
    type: 'text', options: [], optional: true,
    hint: 'Pode ser uma situação pequena. Se não houver algo recorrente ou você não lembrar, pode pular.',
    when: { id: 'barrier', mode: 'meaningful', exclude: ['Não vejo uma dificuldade importante'] },
  },
  {
    after: 'frustration_example', id: 'next_clarity', section: 'Seu próximo passo',
    title: 'Sobre algo que você gostaria de mudar, onde está hoje?',
    type: 'single', optional: false,
    options: ['Ainda não sei o que quero mudar', 'Tenho possibilidades, mas não sei qual escolher', 'Sei a direção, mas não sei o primeiro passo', 'Sei o primeiro passo, mas ainda não defini quando', 'Sei o primeiro passo e quando posso tentar', 'Ainda não sei'],
    hint: 'Escolha o que mais se aproxima do seu momento. Não precisa ter um plano pronto.',
  },
  {
    after: 'time', id: 'time_context', section: 'Seu próximo passo',
    title: 'Esse espaço que você tem hoje costuma ser assim ou está diferente nesta fase?',
    type: 'single', optional: true,
    options: ['É uma escolha minha e deve continuar assim', 'É uma fase e imagino quando pode mudar', 'Depende de algo que não controlo', 'É o máximo que consigo e não vejo mudando', 'Ainda não sei'],
    hint: 'Considere também se hoje não consegue reservar tempo. Não é preciso prever quando isso vai mudar.',
    when: { id: 'time', mode: 'meaningful' },
  },
];
for (const { after, ...question } of refinements) {
  questions.splice(questions.findIndex(q => q.id === after) + 1, 0, question);
}

export default questions;
