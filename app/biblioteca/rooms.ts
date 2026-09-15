import type { RoomId } from './content';

export const rooms: { id: RoomId; number: string; title: string; description: string; group: string }[] = [
  { id: 'conversar', number: '01', title: 'Conversar', description: 'Transforme uma intenção em um pedido claro.', group: 'Fundação' },
  { id: 'organizar', number: '02', title: 'Organizar', description: 'Dê contexto ao que você quer construir.', group: 'Fundação' },
  { id: 'criar', number: '03', title: 'Criar', description: 'Faça suas ideias ganharem forma.', group: 'Fundação' },
  { id: 'ensinar', number: '04', title: 'Ensinar', description: 'Torne o seu jeito de trabalhar reutilizável.', group: 'Expansão' },
  { id: 'conectar', number: '05', title: 'Conectar', description: 'Aproxime suas ferramentas, com critério.', group: 'Expansão' },
  { id: 'delegar', number: '06', title: 'Delegar', description: 'Defina a entrega e acompanhe a execução.', group: 'Expansão' },
  { id: 'automatizar', number: '07', title: 'Automatizar', description: 'Dê gatilho, limites e revisão às rotinas.', group: 'Autonomia' },
  { id: 'construir', number: '08', title: 'Construir', description: 'Crie uma ferramenta para um problema real.', group: 'Autonomia' },
  { id: 'orquestrar', number: '09', title: 'Orquestrar', description: 'Coordene agentes e confira o conjunto.', group: 'Autonomia' },
];
