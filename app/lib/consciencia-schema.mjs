import mapaQuestions from './mapa-schema.mjs';

const questions = structuredClone(mapaQuestions);
const additions = [
  ['ordinary_activity', 'O que você consegue fazer quando precisa, mas não tem muita vontade de repetir?', 'Pense em uma tarefa cotidiana. Conte o que consegue fazer; não precisa ser algo em que se destaca.'],
  ['learning_edge', 'O que gostaria de aprender, mesmo que hoje precise de ajuda?', 'Pode ser algo para sua casa, seus interesses ou sua convivência. Precisar aprender não diminui suas capacidades.'],
  ['contribution_episode', 'Lembre de uma situação em que sua ajuda fez diferença. O que você fez e como percebeu que ajudou?', 'Conte uma ação e o sinal que percebeu: o que alguém disse ou o que mudou. Se não lembrar, tudo bem.'],
  ['energy_after', 'Depois de fazer uma atividade de que gosta, como você costuma se sentir? Conte um exemplo.', 'Você pode gostar e ainda assim ficar cansado. Considere também o descanso, o tempo e as condições daquele dia.'],
].map(([id, title, hint]) => ({ id, section: 'O que chama você', title, type: 'text', options: [], hint, optional: true }));

questions.splice(questions.findIndex(q => q.id === 'good_not_like') + 1, 0, ...additions);

export default questions;
