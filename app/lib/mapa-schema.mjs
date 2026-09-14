// Canonical questionnaire contract; verified against the HTML by tests.
export default [
  {
    "id": "name",
    "section": "Sua vida hoje",
    "title": "Como você gostaria de ser chamado?",
    "type": "text",
    "options": [],
    "hint": "Pode ser só o primeiro nome ou um apelido.",
    "optional": true
  },
  {
    "id": "routine",
    "section": "Sua vida hoje",
    "title": "O que costuma ocupar boa parte dos seus dias?",
    "type": "text",
    "options": [],
    "hint": "Por exemplo: estudar, atender pessoas, cuidar de alguém, trabalhar em casa ou procurar trabalho.",
    "optional": true
  },
  {
    "id": "moment",
    "section": "Sua vida hoje",
    "title": "O que você procura neste mapa?",
    "type": "single",
    "options": [
      "Me conhecer melhor",
      "Entender o que gosto de fazer",
      "Reconhecer minhas capacidades",
      "Encontrar uma direção para esta fase",
      "Explorar possibilidades de trabalho",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "interest",
    "section": "O que chama você",
    "title": "Quando pode escolher, o que dá vontade de fazer?",
    "type": "multi",
    "options": [
      "Investigar e aprender",
      "Criar e imaginar",
      "Organizar e planejar",
      "Cuidar e acolher",
      "Conversar e explicar",
      "Fazer e resolver"
    ],
    "hint": "Marque o que desperta sua curiosidade, mesmo que você ainda não saiba fazer bem.",
    "optional": false
  },
  {
    "id": "easy",
    "section": "O que chama você",
    "title": "No dia a dia, o que costuma sair com menos esforço?",
    "type": "multi",
    "options": [
      "Investigar e aprender",
      "Criar e imaginar",
      "Organizar e planejar",
      "Cuidar e acolher",
      "Conversar e explicar",
      "Fazer e resolver"
    ],
    "hint": "Agora pense no que já consegue fazer. Pode ser diferente do que gosta; marque o que reconhecer.",
    "optional": false
  },
  {
    "id": "help",
    "section": "O que chama você",
    "title": "Qual destes pedidos você já ouviu de alguém?",
    "type": "multi",
    "options": [
      "Investigar e aprender",
      "Criar e imaginar",
      "Organizar e planejar",
      "Cuidar e acolher",
      "Conversar e explicar",
      "Fazer e resolver"
    ],
    "hint": "Lembre de conversas com amigos, familiares ou colegas. Marque os pedidos que combinam com situações reais.",
    "optional": false
  },
  {
    "id": "episode",
    "section": "O que chama você",
    "title": "Conte uma situação recente em que gostou do que estava fazendo.",
    "type": "text",
    "options": [],
    "hint": "O que você estava fazendo? Qual parte foi boa? Pode ser uma coisa pequena.",
    "optional": true
  },
  {
    "id": "tired",
    "section": "O que chama você",
    "title": "O que costuma deixar você mais cansado?",
    "type": "multi",
    "options": [
      "Muitas conversas seguidas",
      "Passar muito tempo sozinho",
      "Repetir a mesma tarefa",
      "Lidar com mudanças de última hora",
      "Resolver tudo com pressa",
      "Cuidar de muitos detalhes",
      "Assumir responsabilidades demais"
    ],
    "hint": "O cansaço pode depender da situação, do descanso e das condições do dia.",
    "optional": false
  },
  {
    "id": "good_not_like",
    "section": "O que chama você",
    "title": "Tem algo que você faz bem, mas preferia fazer menos?",
    "type": "text",
    "options": [],
    "hint": "Pode ser organizar compromissos, ouvir problemas, consertar coisas ou outra atividade. “Não lembro” também vale.",
    "optional": true
  },
  {
    "id": "learn",
    "section": "Seu jeito de agir",
    "title": "Quando quer aprender algo, o que costuma ajudar primeiro?",
    "type": "single",
    "options": [
      "Ver alguém fazendo",
      "Experimentar por conta própria",
      "Ler ou pesquisar",
      "Conversar e fazer perguntas",
      "Depende do que vou aprender",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "start",
    "section": "Seu jeito de agir",
    "title": "Quando precisa começar uma tarefa nova, o que costuma fazer primeiro?",
    "type": "single",
    "options": [
      "Procuro informações",
      "Organizo os passos",
      "Faço uma tentativa pequena",
      "Peço ajuda ou uma opinião",
      "Depende da tarefa",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "decision",
    "section": "Seu jeito de agir",
    "title": "Quando precisa escolher entre duas opções, o que costuma ajudar?",
    "type": "single",
    "options": [
      "Comparar informações",
      "Perceber qual combina mais comigo",
      "Conversar com alguém",
      "Experimentar antes de decidir",
      "Depende da escolha",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "change",
    "section": "Seu jeito de agir",
    "title": "Quando um plano muda de repente, o que costuma ajudar você?",
    "type": "single",
    "options": [
      "Ter um tempo para reorganizar",
      "Entender por que mudou",
      "Testar outro caminho logo",
      "Combinar o próximo passo com alguém",
      "Depende da mudança",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "setting",
    "section": "Seu jeito de agir",
    "title": "Em qual situação você costuma se concentrar melhor?",
    "type": "single",
    "options": [
      "Com silêncio e poucas interrupções",
      "Com alguém por perto, mesmo sem conversar",
      "Trocando ideias durante a atividade",
      "Alternando momentos sozinho e com outras pessoas",
      "Ainda estou descobrindo",
      "Não se aplica à minha vida agora"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "group",
    "section": "Você com outras pessoas",
    "title": "Quando faz algo em grupo, qual contribuição aparece mais?",
    "type": "single",
    "options": [
      "Coloco as tarefas em prática",
      "Ajudo a organizar",
      "Sugiro ideias",
      "Ajudo as pessoas a se entenderem",
      "Explico ou compartilho informações",
      "Prefiro observar antes de participar",
      "Depende do grupo",
      "Não se aplica à minha vida agora"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "communication",
    "section": "Você com outras pessoas",
    "title": "Quando quer explicar uma ideia, como costuma fazer?",
    "type": "single",
    "options": [
      "Vou direto ao ponto",
      "Uso um exemplo ou uma história",
      "Explico por etapas",
      "Faço perguntas e construo a conversa",
      "Prefiro escrever",
      "Depende da pessoa",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "limits",
    "section": "Você com outras pessoas",
    "title": "Quando alguém pede algo que você não consegue fazer, o que costuma acontecer?",
    "type": "single",
    "options": [
      "Explico que não posso",
      "Tento combinar outra forma de ajudar",
      "Aceito e depois fica pesado",
      "Preciso de um tempo para responder",
      "Depende de quem pede",
      "Prefiro não responder"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "recognition",
    "section": "Você com outras pessoas",
    "title": "Que elogio você lembra de ter recebido?",
    "type": "text",
    "options": [],
    "hint": "Pode ser de um amigo, familiar, colega ou alguém que você ajudou. Não precisa ser uma grande conquista.",
    "optional": true
  },
  {
    "id": "values",
    "section": "O que importa para você",
    "title": "O que gostaria de ter mais presente na sua vida hoje?",
    "type": "multi",
    "options": [
      "Tranquilidade",
      "Aprendizado",
      "Criatividade",
      "Conexão com pessoas",
      "Autonomia",
      "Estabilidade",
      "Cuidado comigo",
      "Contribuição para outras pessoas"
    ],
    "hint": "Escolha até três prioridades.",
    "optional": false
  },
  {
    "id": "wish",
    "section": "Seu próximo passo",
    "title": "Que pequena mudança faria diferença na sua vida nos próximos meses?",
    "type": "text",
    "options": [],
    "hint": "Por exemplo: voltar a desenhar, organizar melhor a semana, aprender algo ou reservar tempo para mim.",
    "optional": true
  },
  {
    "id": "barrier",
    "section": "Seu próximo passo",
    "title": "O que mais dificulta dar espaço a essa mudança?",
    "type": "single",
    "options": [
      "Falta de tempo ou excesso de tarefas",
      "Dúvida sobre qual caminho escolher",
      "Receio de começar ou errar",
      "Falta de dinheiro ou recursos",
      "Falta de apoio",
      "Cansaço",
      "Não vejo uma dificuldade importante",
      "Ainda não sei"
    ],
    "hint": "Escolha o que pesa mais agora. Isso não define quem você é.",
    "optional": false
  },
  {
    "id": "support",
    "section": "Seu próximo passo",
    "title": "O que poderia ajudar neste momento?",
    "type": "multi",
    "options": [
      "Ter alguém com quem conversar",
      "Aprender uma habilidade",
      "Ter um passo pequeno e claro",
      "Organizar tempo ou recursos",
      "Descansar e reduzir a sobrecarga",
      "Receber ajuda prática"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "experiment",
    "section": "Seu próximo passo",
    "title": "Que experiência pequena você toparia fazer?",
    "type": "single",
    "options": [
      "Experimentar uma atividade que me interessa",
      "Repetir uma atividade que já gosto",
      "Pedir a alguém um exemplo de como eu ajudo",
      "Observar minha rotina por alguns dias",
      "Conversar com alguém sobre uma possibilidade",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "time",
    "section": "Seu próximo passo",
    "title": "Quanto tempo caberia na sua semana para essa experiência?",
    "type": "single",
    "options": [
      "Uns 10 minutos",
      "Até meia hora",
      "Cerca de uma hora",
      "Mais de uma hora",
      "Neste momento, não consigo reservar tempo",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "signal",
    "section": "Seu próximo passo",
    "title": "O que você gostaria de observar nessa experiência?",
    "type": "single",
    "options": [
      "Se desperta minha curiosidade",
      "Se gosto de fazer, além de fazer bem",
      "Se consigo fazer no meu ritmo",
      "Se faz sentido para o que valorizo",
      "Se quero repetir ou aprender mais",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "professional",
    "section": "Uma parte opcional",
    "title": "Quer explorar também trabalho e renda?",
    "type": "single",
    "options": [
      "Sim, quero explorar",
      "Não, quero ficar com o mapa pessoal"
    ],
    "hint": "Seu mapa pessoal fica completo mesmo se você escolher não.",
    "optional": false
  },
  {
    "id": "work_goal",
    "section": "Trabalho e renda · opcional",
    "title": "O que você gostaria de explorar?",
    "type": "single",
    "options": [
      "Melhorar minha experiência no trabalho atual",
      "Mudar de área ou função",
      "Voltar ao trabalho ou buscar uma oportunidade",
      "Prestar um serviço ou ter uma renda extra",
      "Criar um negócio",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "work_use",
    "section": "Trabalho e renda · opcional",
    "title": "Qual capacidade sua gostaria de usar mais no trabalho?",
    "type": "text",
    "options": [],
    "hint": "Pode escolher algo que apareceu no mapa. Se não souber, deixe em branco.",
    "optional": true
  },
  {
    "id": "work_style",
    "section": "Trabalho e renda · opcional",
    "title": "Que forma de trabalhar gostaria de experimentar?",
    "type": "single",
    "options": [
      "Com mais autonomia",
      "Em equipe, sem precisar liderar",
      "Ajudando pessoas individualmente",
      "Ensinando ou orientando um grupo",
      "Organizando atividades ou projetos",
      "Criando ou fazendo algo prático",
      "Ainda não sei",
      "Não se aplica à minha vida agora"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "income",
    "section": "Trabalho e renda · opcional",
    "title": "Você quer que essa exploração ajude a gerar renda?",
    "type": "single",
    "options": [
      "Não é meu objetivo agora",
      "Talvez, quero entender as possibilidades",
      "Sim, como complemento",
      "Sim, como renda principal",
      "Prefiro não responder"
    ],
    "hint": "",
    "optional": false
  },
  {
    "id": "work_step",
    "section": "Trabalho e renda · opcional",
    "title": "Qual primeiro passo parece possível?",
    "type": "single",
    "options": [
      "Conversar com alguém que conhece essa área",
      "Pesquisar uma atividade ou formação",
      "Experimentar uma tarefa pequena",
      "Organizar um exemplo do que sei fazer",
      "Entender melhor minhas condições antes de decidir",
      "Ainda não sei"
    ],
    "hint": "",
    "optional": false
  }
];
