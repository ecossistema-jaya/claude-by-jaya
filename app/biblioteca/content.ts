export type RoomId =
  | 'conversar'
  | 'organizar'
  | 'criar'
  | 'ensinar'
  | 'conectar'
  | 'delegar'
  | 'automatizar'
  | 'construir'
  | 'orquestrar';

export type LibraryGuide = {
  slug: string;
  room: RoomId;
  title: string;
  description: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  kind: 'Guia' | 'Exercício' | 'Template';
  tools: string[];
  outcome: string;
  prerequisite: string;
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    steps?: string[];
    prompt?: string;
    note?: string;
  }[];
  checklist: string[];
  sources: { title: string; url: string }[];
  reviewedAt: string;
  nextSlug?: string;
};

const sources = {
  accuracy: {
    title: 'Anthropic · Respostas incorretas e verificação de fontes',
    url: 'https://support.claude.com/en/articles/8525154-claude-is-providing-incorrect-or-misleading-responses-what-s-going-on',
  },
  projects: {
    title: 'Anthropic · Criar e gerenciar Projetos',
    url: 'https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects',
  },
  memory: {
    title: 'Anthropic · Busca em conversas e memória',
    url: 'https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context',
  },
  artifacts: {
    title: 'Anthropic · O que são Artifacts',
    url: 'https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them',
  },
  skills: {
    title: 'Anthropic · O que são Skills',
    url: 'https://support.claude.com/en/articles/12512176-what-are-skills',
  },
  connectors: {
    title: 'Anthropic · Usar conectores e controlar permissões',
    url: 'https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities',
  },
  cowork: {
    title: 'Anthropic · Começar com Claude Cowork',
    url: 'https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork',
  },
  surfaces: {
    title: 'Anthropic · Cowork na web, no desktop e no celular',
    url: 'https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile',
  },
  agents: {
    title: 'Anthropic · Subagentes no Claude Code',
    url: 'https://code.claude.com/docs/en/subagents',
  },
};

export const guides: LibraryGuide[] = [
  {
    slug: 'primeira-entrega',
    room: 'conversar',
    title: 'Da primeira conversa à primeira entrega',
    description: 'Transforme um material seu em uma explicação que alguém consiga usar. Aprenda a pedir, revisar e reconhecer quando terminou.',
    level: 'Iniciante',
    kind: 'Guia',
    tools: ['Claude Chat'],
    outcome: 'Uma explicação curta, revisada e fiel ao seu material original.',
    prerequisite: 'Uma conta no Claude e um texto seu que possa ser compartilhado na ferramenta.',
    sections: [
      {
        id: 'escolha-a-entrega',
        title: 'Comece pelo que precisa ganhar forma',
        paragraphs: [
          'Talvez você tenha uma explicação que repete para clientes, anotações de uma aula ou um conteúdo que precisa ficar mais claro. Escolha um desses materiais. Neste exercício, vamos transformá-lo em uma explicação curta para alguém que ainda não conhece o assunto.',
          'A sua experiência aparece nas decisões: o que é essencial, qual exemplo esclarece e que ressalva não pode desaparecer. Claude pode ajudar a escrever e reorganizar. Você continua responsável por reconhecer se a versão representa o que sabe e atende a quem vai ler.',
          'Separe um texto que possa compartilhar, sem informações confidenciais. Trabalhe sobre uma cópia. Se o material for extenso, escolha uma seção que tenha sentido sozinha. Uma entrega pequena facilita observar o que funcionou e corrigir o que ainda não ficou bom.',
        ],
      },
      {
        id: 'defina-o-criterio',
        title: 'Decida como uma boa versão deve funcionar',
        paragraphs: [
          'Antes de escrever o pedido, responda às quatro perguntas abaixo. Elas dão ao trabalho um destino e permitem avaliar a resposta sem depender apenas da impressão de que ficou bonita.',
          'Um critério útil descreve algo observável. “Texto excelente” é difícil de conferir. “Explica o conceito para uma iniciante, preserva as duas ressalvas do original e termina com uma ação possível” permite uma revisão objetiva. Adapte o tamanho à situação em que a pessoa vai ler.',
        ],
        steps: [
          'Quem vai ler esta explicação?',
          'O que essa pessoa precisa entender ao terminar?',
          'Quais informações, exemplos ou condições devem permanecer?',
          'Que sinais vão mostrar que a versão está pronta para uso?',
        ],
      },
      {
        id: 'faca-o-pedido',
        title: 'Entregue contexto, material e critérios',
        paragraphs: [
          'Abra uma conversa no Claude. Preencha os campos do pedido abaixo e acrescente seu material. Leia o pedido uma vez antes de enviar: a tarefa deve estar compreensível para alguém que não acompanhou seus pensamentos.',
          'A instrução para sinalizar lacunas ajuda a orientar a resposta, mas não garante ausência de erros. Claude pode acrescentar informações incorretas ou apresentar afirmações convincentes sem fundamento. É por isso que a conferência faz parte da entrega.',
        ],
        prompt: `Transforme o material abaixo em uma explicação para [público].

Ao terminar, a pessoa precisa entender [objetivo].
Preserve [informações, exemplos e ressalvas indispensáveis].
A versão estará boa quando [critérios observáveis].
Use o material como fonte. Não acrescente dados, resultados, depoimentos ou promessas que não estejam nele.
Se faltar algo indispensável, pergunte antes de escrever. Sinalize outras lacunas ao final.
Entregue uma primeira versão e indique o que precisa da minha conferência.

Material:
[cole seu texto]`,
      },
      {
        id: 'dirija-a-revisao',
        title: 'Revise o sentido antes do acabamento',
        paragraphs: [
          'Coloque o original e a resposta lado a lado. Confira nomes, números, relações de causa e efeito e condições importantes. Observe também o que sumiu: um texto pode ficar fluido justamente porque perdeu uma ressalva necessária. Abra e leia fontes citadas antes de confiar nelas.',
          'Depois, avalie a linguagem. A pessoa escolhida entenderia os termos? O exemplo ajuda ou distrai? O texto explica o que prometeu? Evite pedir apenas “melhore”. Aponte o trecho, o problema e a mudança desejada. Isso torna a revisão mais fácil de acompanhar.',
        ],
        prompt: `Revise apenas [trecho].
O problema é [o que está errado ou confuso].
Quero que a pessoa entenda [ideia].
Use [exemplo do original] e preserve [ressalva].
Entregue o trecho revisado e indique qualquer mudança de sentido.`,
      },
      {
        id: 'reconheca-o-final',
        title: 'Feche a primeira entrega',
        paragraphs: [
          'Quando os critérios passarem, salve a versão aprovada em um lugar que você encontrará depois. Guarde junto o original e o pedido que funcionou. Dê um nome que descreva o conteúdo e a data. Você acabou de produzir uma pequena referência para trabalhos futuros.',
          'Se ainda falhar, reduza o problema: trabalhe um parágrafo, esclareça uma informação ou forneça um exemplo melhor. Quando a lacuna estiver no próprio material, resolva-a antes de pedir outra versão. Repetir a mesma instrução não cria a informação ausente.',
          'Registre o tempo de preparação, conversa e revisão. Se houver uma medida anterior da tarefa manual, compare as duas execuções considerando também o retrabalho. Sem essa medida, registre o resultado de hoje como referência; ainda não há um ganho comprovado.',
          'Leia a versão final fora da conversa, no formato em que será usada. Essa última passagem costuma revelar títulos vagos, frases dependentes do contexto do chat ou instruções que ficaram incompletas. Aprove a entrega antes de enviá-la a outra pessoa.',
        ],
      },
    ],
    checklist: [
      'O texto responde à necessidade do público escolhido.',
      'Conferi fatos e preservei as ressalvas do original.',
      'Corrigi acréscimos sem fundamento e trechos confusos.',
      'Salvei a versão aprovada, o original e o pedido usado.',
    ],
    sources: [sources.accuracy],
    reviewedAt: '2026-09-14',
    nextSlug: 'contexto-que-ajuda',
  },
  {
    slug: 'contexto-que-ajuda',
    room: 'organizar',
    title: 'Contexto que ajuda a trabalhar',
    description: 'Monte uma referência curta com o que Claude precisa saber para repetir uma tarefa sem você explicar tudo outra vez.',
    level: 'Iniciante',
    kind: 'Exercício',
    tools: ['Claude Chat', 'Projetos'],
    outcome: 'Uma ficha de contexto reutilizável para uma tarefa recorrente.',
    prerequisite: 'Uma tarefa conhecida e um exemplo de resultado que você considera bom.',
    sections: [
      {
        id: 'contexto-com-proposito',
        title: 'Organize em torno de uma tarefa',
        paragraphs: [
          'Escolha algo que você já faz: revisar uma explicação, preparar uma pauta ou transformar anotações em um resumo. Reúna somente as referências necessárias para essa tarefa. Um arquivo cheio de assuntos diferentes exige que cada pedido explique novamente o que importa.',
          'Projetos permitem reunir instruções e materiais de referência. Memória e busca de conversas são recursos diferentes, com configurações próprias. Não trate nenhum deles como garantia de que toda decisão passada estará disponível ou será aplicada corretamente: registre explicitamente as regras que precisam permanecer.',
        ],
      },
      {
        id: 'ficha-de-contexto',
        title: 'Escreva sua ficha de contexto',
        paragraphs: [
          'Preencha os campos abaixo com informações reais. Prefira um exemplo curto acompanhado do motivo pelo qual ele funciona. “Tom profissional” deixa muitas interpretações; uma explicação aprovada mostra vocabulário, profundidade e limites com mais precisão.',
        ],
        prompt: `Use esta ficha para a tarefa de [tarefa].
Público: [quem recebe].
Entrega: [formato e finalidade].
Critérios: [três condições verificáveis].
Referências válidas: [nomes e datas dos materiais].
Exemplo aprovado: [trecho].
Por que funciona: [características concretas].
Limites: [o que não afirmar ou alterar].
Se referências divergirem, indique a divergência antes de escolher.
Pedido desta execução: [tarefa de hoje].`,
      },
      {
        id: 'teste-em-outra-conversa',
        title: 'Confira se a ficha se sustenta',
        paragraphs: [
          'Teste a ficha em uma nova conversa com um segundo material real. Se usar um Projeto, adicione as referências pertinentes e verifique as instruções configuradas. Observe se o resultado preserva os critérios sem depender de explicações que só existiam na conversa anterior.',
          'Se faltou uma condição, acrescente-a à ficha. Se a resposta usou uma referência antiga, identifique qual é a vigente e retire a ambiguidade do conjunto de trabalho, preservando seu arquivo original. Mantenha data e responsável pela atualização. A ficha está pronta quando o segundo teste funciona e você consegue explicar de onde vieram suas regras.',
        ],
      },
    ],
    checklist: ['A ficha descreve uma tarefa específica.', 'As referências têm nome e data.', 'Testei com um segundo material.', 'As regras essenciais estão explícitas.'],
    sources: [sources.projects, sources.memory],
    reviewedAt: '2026-09-14',
    nextSlug: 'artefatos-na-pratica',
  },
  {
    slug: 'artefatos-na-pratica',
    room: 'criar',
    title: 'Uma ideia que dá para abrir e usar',
    description: 'Crie um checklist em um Artifact e teste a experiência de quem vai utilizá-lo.',
    level: 'Iniciante',
    kind: 'Exercício',
    tools: ['Claude Chat', 'Artifacts'],
    outcome: 'Um checklist utilizável e conferido a partir de um processo seu.',
    prerequisite: 'Uma lista real de etapas de uma atividade que você conhece.',
    sections: [
      {
        id: 'escolha-um-objeto',
        title: 'Dê uma forma à sua ideia',
        paragraphs: [
          'Artifacts são conteúdos apresentados em uma área própria, que podem incluir documentos, páginas e componentes interativos. Para começar, escolha uma necessidade pequena: um checklist de preparação. O teste é simples de acompanhar porque você conhece as etapas e consegue perceber o que ficou faltando.',
          'Escreva quem usará o checklist, em que momento e qual tarefa estará concluída ao marcar o último item. Use etapas reais. Se não souber alguma delas, resolva a lacuna com quem executa o processo antes de transformá-lo em ferramenta.',
        ],
      },
      {
        id: 'peca-o-artefato',
        title: 'Peça a primeira versão',
        paragraphs: [
          'O pedido abaixo mantém o exercício pequeno e evita acrescentar funções que você ainda não precisa. Caso Artifacts não esteja disponível na sua conta ou configuração, peça a mesma estrutura como documento; você ainda poderá validar o conteúdo.',
        ],
        prompt: `Crie um Artifact com um checklist para [público], usado antes de [situação].
Etapas reais: [lista].
Cada item deve ter uma ação clara e uma caixa de marcação.
Inclua título, orientação curta e indicação de conclusão.
Use texto legível no celular e controles acessíveis por teclado.
Não adicione cadastro, envio de dados ou serviços externos.
Informe se as marcações são preservadas ao fechar e reabrir.
Não publique; entregue a versão para minha revisão.`,
      },
      {
        id: 'teste-o-uso',
        title: 'Use como se fosse a primeira vez',
        paragraphs: [
          'Abra a versão produzida e execute cada etapa. Marque e desmarque itens, use a tecla Tab e confira o que acontece ao atualizar a página. Compare o comportamento observado com a explicação sobre preservação das marcações. Aparência pronta não comprova que o estado foi salvo.',
          'Confira a leitura em uma tela pequena e peça a alguém do público para interpretar uma etapa. Se houver dúvida, reescreva a ação e teste novamente. Salve a versão aprovada e registre como acessá-la. Compartilhamento e armazenamento dependem do tipo de Artifact e das condições da conta; consulte a documentação antes de prometer acesso ou persistência a outras pessoas.',
        ],
      },
    ],
    checklist: ['As etapas correspondem ao processo real.', 'Marcar e desmarcar funciona.', 'Verifiquei teclado, leitura e reabertura.', 'A versão final foi revisada antes de compartilhar.'],
    sources: [sources.artifacts],
    reviewedAt: '2026-09-14',
    nextSlug: 'instrucoes-reutilizaveis',
  },
  {
    slug: 'instrucoes-reutilizaveis',
    room: 'ensinar',
    title: 'Ensine o seu jeito de fazer',
    description: 'Transforme critérios que estão na sua cabeça em instruções que você consegue testar e reutilizar.',
    level: 'Intermediário',
    kind: 'Template',
    tools: ['Claude Chat', 'Projetos', 'Skills'],
    outcome: 'Uma instrução reutilizável validada com um caso normal e um caso incompleto.',
    prerequisite: 'Um procedimento conhecido e exemplos que você tem autorização para usar.',
    sections: [
      {
        id: 'torne-o-criterio-visivel',
        title: 'Explique o que você observa',
        paragraphs: [
          'Quando dizemos “ensinar” aqui, falamos de fornecer instruções, referências e exemplos para orientar uma tarefa. Isso não equivale a treinar os pesos do modelo. O objetivo é tornar explícito o seu procedimento para que você possa conferir como ele foi aplicado.',
          'Escolha uma atividade e anote três decisões que costuma tomar. Ao revisar um texto, por exemplo, você pode conferir fidelidade à fonte, clareza para o público e presença de uma ação concreta. Descreva como reconhecer cada condição; adjetivos sozinhos deixam o julgamento aberto demais.',
        ],
      },
      {
        id: 'instrucao-testavel',
        title: 'Escreva uma instrução testável',
        paragraphs: [
          'Preencha este modelo usando seu próprio processo. Comece na conversa. Quando a instrução funcionar, avalie guardá-la em um Projeto ou organizá-la como Skill. Skills reúnem instruções e podem incluir recursos e scripts carregados conforme a tarefa; o pacote só deve conter o que o procedimento realmente exige.',
        ],
        prompt: `Procedimento: [nome].
Use quando: [situação específica].
Entrada necessária: [material].
Passos: [sequência que você realmente usa].
Critérios de qualidade: [condições observáveis].
Exemplo aprovado: [trecho e justificativa].
Se faltar entrada essencial: indique exatamente o que falta.
Se houver conflito: mostre os trechos e peça a decisão necessária.
Saída: [formato].
Execute sobre este material: [caso real].`,
      },
      {
        id: 'teste-a-falha',
        title: 'Teste também quando faltar informação',
        paragraphs: [
          'Rode um caso completo e confira o resultado contra seus critérios. Depois faça uma cópia do caso retirando uma informação essencial. A instrução deve levar Claude a sinalizar a ausência, sem preencher a lacuna por conta própria. Esse segundo teste revela se o procedimento lida com uma dificuldade previsível.',
          'Se falhar, ajuste a regra específica e repita o caso que expôs o problema. Registre versão, data e exemplos usados. A instrução está pronta para reaproveitar quando você consegue identificar onde ela se aplica, reconhecer uma execução correta e interromper uma execução sem dados suficientes.',
        ],
      },
    ],
    checklist: ['Os critérios descrevem sinais observáveis.', 'O exemplo pertence ao contexto da tarefa.', 'O caso completo passou.', 'O caso incompleto gerou a sinalização esperada.'],
    sources: [sources.skills, sources.projects],
    reviewedAt: '2026-09-14',
    nextSlug: 'conectar-com-criterio',
  },
  {
    slug: 'conectar-com-criterio',
    room: 'conectar',
    title: 'Conecte uma fonte com propósito',
    description: 'Faça uma primeira consulta a um serviço conectado e confira de onde vieram as informações.',
    level: 'Intermediário',
    kind: 'Guia',
    tools: ['Claude Chat', 'Conectores'],
    outcome: 'Uma consulta verificável a uma fonte que você autorizou.',
    prerequisite: 'Um serviço disponível como conector e permissão para consultar o material escolhido.',
    sections: [
      {
        id: 'defina-a-consulta',
        title: 'Escolha a pergunta antes da conexão',
        paragraphs: [
          'Conectores permitem que Claude consulte informações e, conforme o serviço, execute ações externas. As permissões da conta conectada delimitam o acesso, mas podem incluir escrita. Antes de conectar, escolha uma pergunta concreta e identifique qual fonte contém a resposta.',
          'Um primeiro exercício útil é localizar uma decisão em um documento conhecido. Anote título, localização e data aproximada. Isso permite verificar o resultado e evita começar por uma busca ampla cujo alcance você ainda não conhece.',
        ],
      },
      {
        id: 'confira-o-acesso',
        title: 'Confira o que o serviço permite',
        paragraphs: [
          'Leia a descrição do conector e as permissões solicitadas na autenticação. Confira a conta usada e as regras da sua organização. Onde houver controle de ações, restrinja a execução ao necessário para o exercício. Um pedido escrito orienta Claude, mas não substitui os controles de permissão do serviço.',
          'Se o conector adequado não estiver disponível, use uma cópia autorizada do documento para praticar a pergunta. O exercício de conferência continua válido, embora isso não teste a conexão nem a atualização da fonte.',
        ],
        prompt: `Consulte [serviço] para localizar [documento ou decisão], em [local e período].
Faça apenas leitura. Não crie, altere, envie ou exclua nada.
Responda à pergunta: [pergunta].
Informe o documento consultado, o link quando disponível e o trecho que sustenta a resposta.
Se não encontrar ou não tiver acesso, diga isso claramente.
Não trate ausência no resultado da busca como prova de inexistência.`,
      },
      {
        id: 'valide-na-origem',
        title: 'Abra a fonte e compare',
        paragraphs: [
          'Abra o documento indicado e procure o trecho citado. Confira se a data, a versão e o contexto correspondem à pergunta. Uma frase retirada de uma proposta antiga pode parecer uma decisão vigente quando lida isoladamente.',
          'Se o resultado estiver errado, esclareça o local ou o período e repita a consulta. Se houver falha de acesso, confira as permissões na origem. Conclua quando a resposta estiver sustentada pelo documento correto e você souber qual conta e qual serviço foram utilizados.',
        ],
      },
    ],
    checklist: ['A conexão atende a uma pergunta definida.', 'Conferi conta e permissões.', 'Abri o documento original.', 'A resposta corresponde à versão e ao contexto corretos.'],
    sources: [sources.connectors, sources.accuracy],
    reviewedAt: '2026-09-14',
    nextSlug: 'delegar-uma-tarefa',
  },
  {
    slug: 'delegar-uma-tarefa',
    room: 'delegar',
    title: 'Delegue uma tarefa com começo e fim',
    description: 'Prepare uma tarefa de Cowork com entrada, destino, limites e uma forma clara de conferir o resultado.',
    level: 'Intermediário',
    kind: 'Template',
    tools: ['Claude Cowork'],
    outcome: 'Um resumo rastreável produzido a partir de materiais delimitados.',
    prerequisite: 'Acesso ao Cowork e um pequeno conjunto de arquivos que você pode compartilhar.',
    sections: [
      {
        id: 'descreva-a-entrega',
        title: 'Uma entrega que cabe em uma frase',
        paragraphs: [
          'Cowork pode executar tarefas com várias etapas e produzir arquivos. Para experimentar, escolha três documentos curtos e peça um resumo comparativo. Defina a pergunta que o resumo precisa responder e indique onde o novo arquivo deve ficar.',
          'Na documentação consultada, sessões em nuvem continuam sem o computador ligado. O acesso a recursos locais, como arquivos no seu computador, depende do aplicativo desktop aberto e conectado. Verifique quais recursos a sua tarefa usa antes de contar com uma execução enquanto você está ausente.',
        ],
      },
      {
        id: 'contrato-de-tarefa',
        title: 'Escreva o acordo de trabalho',
        paragraphs: [
          'Nomeie os arquivos de entrada. Se forem locais, forneça acesso apenas à pasta necessária e trabalhe com cópias. Indique um destino novo para o resultado. Leia o plano proposto antes da execução para conferir se a tarefa foi compreendida.',
        ],
        prompt: `Prepare um resumo comparativo para responder: [pergunta].
Entradas autorizadas: [nomes dos três arquivos].
Saída: um novo documento em [destino], com síntese, diferenças e pendências.
Preserve os arquivos originais. Não mova nem apague nada.
Relacione cada conclusão ao arquivo que a sustenta.
Se houver contradição, apresente as duas versões sem inventar uma resolução.
Não envie ou publique o resultado.
Antes de executar, apresente seu plano e indique qualquer informação essencial ausente.`,
      },
      {
        id: 'aceite-da-entrega',
        title: 'Confira o arquivo, além da mensagem final',
        paragraphs: [
          'Abra o documento gerado. Confira se todos os arquivos previstos foram considerados e se cada conclusão tem apoio no material correspondente. Verifique também se o arquivo está no destino combinado e se os originais continuam preservados.',
          'Se uma entrada não puder ser lida, mantenha o resultado como incompleto até resolver a falha ou reduzir explicitamente o escopo. Se o resumo interpretar algo além da fonte, peça a correção do trecho e confira de novo. A tarefa termina quando o arquivo responde à pergunta e suas pendências estão visíveis para quem vai usá-lo.',
        ],
      },
    ],
    checklist: ['As entradas e o destino foram definidos.', 'O plano correspondeu ao pedido.', 'Abri e conferi o documento final.', 'As conclusões têm origem identificável e os originais foram preservados.'],
    sources: [sources.cowork, sources.surfaces],
    reviewedAt: '2026-09-14',
    nextSlug: 'rotinas-com-revisao',
  },
  {
    slug: 'rotinas-com-revisao',
    room: 'automatizar',
    title: 'Uma rotina que você consegue conferir',
    description: 'Desenhe e teste uma rotina de resumo antes de colocá-la para repetir sozinha.',
    level: 'Intermediário',
    kind: 'Guia',
    tools: ['Claude Cowork', 'Tarefas agendadas'],
    outcome: 'Uma rotina documentada, com teste manual, regra de falha e revisão humana.',
    prerequisite: 'Uma tarefa repetida que já funcione manualmente e uma fonte definida.',
    sections: [
      {
        id: 'uma-execucao-primeiro',
        title: 'Faça funcionar uma vez',
        paragraphs: [
          'Escolha um resumo recorrente de materiais que você tem autorização para consultar. Execute a tarefa manualmente com Claude e confira a saída. Agendar uma instrução ambígua apenas repete a ambiguidade; resolva primeiro quais entradas entram, qual período conta e o que caracteriza uma entrega útil.',
          'Registre o tempo gasto hoje, incluindo conferência e correções. Esse número permite comparar execuções futuras. Defina também quem revisa a saída e o que acontece quando a fonte não está disponível.',
        ],
      },
      {
        id: 'desenhe-a-rotina',
        title: 'Escreva a rotina inteira',
        paragraphs: [
          'Use o modelo como especificação antes de configurar o agendamento. Horário sem fuso, período sem início ou destino sem nome deixam decisões importantes para cada execução. Uma rotina curta deve ser compreensível por quem precisar retomá-la.',
        ],
        prompt: `Rotina: [nome].
Gatilho: [dias, horário e fuso].
Fonte autorizada: [origem exata].
Período de consulta: [regra de início e fim].
Entrega: [resumo, formato e destino].
Inclua fontes, período consultado e pendências.
Se não houver novidade, registre isso sem inventar conteúdo.
Se não houver acesso, registre a falha e não apresente dados antigos como atuais.
Produza somente rascunho; a revisão cabe a [responsável].
Não envie mensagens nem publique.
Primeiro, execute uma vez para eu conferir.`,
      },
      {
        id: 'agende-e-confira',
        title: 'Verifique o ambiente de execução',
        paragraphs: [
          'Cowork oferece tarefas agendadas em nuvem. A continuidade do agendamento não garante acesso a tudo: recursos locais ainda podem depender do aplicativo desktop e conectores dependem de autorização. Confira as condições do ambiente e a confirmação do agendamento criado, incluindo horário e fuso.',
          'Revise a primeira execução automática e compare com o teste manual. Confira duplicações, período usado e destino. Se falhar, pause a rotina e ajuste a causa antes de reativar. Considere a rotina pronta quando houver uma execução automática conferida, um responsável e um caminho claro para corrigir ou interromper o processo.',
        ],
      },
    ],
    checklist: ['O teste manual passou.', 'Gatilho, fuso, período e destino estão explícitos.', 'A falha de acesso tem tratamento definido.', 'A primeira execução automática foi conferida.'],
    sources: [sources.cowork, sources.surfaces],
    reviewedAt: '2026-09-14',
    nextSlug: 'primeira-ferramenta',
  },
  {
    slug: 'primeira-ferramenta',
    room: 'construir',
    title: 'Sua primeira ferramenta pequena',
    description: 'Transforme uma regra simples em uma calculadora local e teste entradas normais, vazias e inválidas.',
    level: 'Intermediário',
    kind: 'Exercício',
    tools: ['Artifacts', 'Claude Code'],
    outcome: 'Uma calculadora de duração com regra explícita e testes conferidos.',
    prerequisite: 'Conhecer a regra do cálculo; acesso a um ambiente capaz de criar e executar a ferramenta.',
    sections: [
      {
        id: 'uma-regra-pequena',
        title: 'Construa algo cujo resultado você sabe conferir',
        paragraphs: [
          'Uma primeira ferramenta precisa resolver uma tarefa delimitada. Neste exercício, crie uma calculadora de duração: quantidade de encontros multiplicada pelos minutos de cada encontro. O resultado deve aparecer em minutos e em horas com minutos restantes.',
          'A conta é determinística: para as mesmas entradas, o resultado deve ser o mesmo. Claude ajuda a construir o código; a ferramenta usa a regra matemática para calcular. Isso permite conferir o funcionamento sem depender da interpretação de uma nova resposta a cada uso.',
        ],
      },
      {
        id: 'especifique-a-ferramenta',
        title: 'Descreva entradas, regra e erros',
        paragraphs: [
          'Você pode experimentar como Artifact ou usar Claude Code em uma pasta de projeto destinada ao exercício. A disponibilidade e a execução variam conforme o ambiente. Peça que Claude explique onde o resultado pode ser aberto e teste a versão real.',
        ],
        prompt: `Construa uma calculadora local de duração total.
Entradas: quantidade de encontros e minutos por encontro, ambos inteiros positivos.
Regra: total = quantidade × minutos.
Mostre o total em minutos e em horas com minutos restantes.
Campos vazios, zero, negativos e valores fracionários devem gerar uma mensagem clara, sem resultado enganoso.
Use rótulos visíveis e navegação por teclado.
Não use cadastro, API, banco ou envio de dados.
Não altere arquivos fora da pasta do exercício e não publique.
Explique como abrir e testar a ferramenta.`,
      },
      {
        id: 'confira-as-contas',
        title: 'Teste o que costuma escapar',
        paragraphs: [
          'Comece com três encontros de quarenta e cinco minutos: o resultado esperado é cento e trinta e cinco minutos, ou duas horas e quinze minutos. Depois teste um encontro de sessenta minutos. Confira se a apresentação mantém a equivalência entre os formatos.',
          'Apague um campo, informe zero, um número negativo e uma fração. A ferramenta deve explicar o problema e não manter um resultado antigo como se fosse válido. Corrija qualquer falha e repita o caso. Conclua quando as contas e os estados de erro funcionarem no arquivo ou endereço que você realmente vai usar.',
        ],
      },
    ],
    checklist: ['A regra do cálculo está explícita.', 'As duas contas de referência passaram.', 'Entradas inválidas não exibem resultado enganoso.', 'Testei a ferramenta real e a navegação por teclado.'],
    sources: [sources.artifacts],
    reviewedAt: '2026-09-14',
    nextSlug: 'coordenar-agentes',
  },
  {
    slug: 'coordenar-agentes',
    room: 'orquestrar',
    title: 'Coordene agentes sem perder o critério',
    description: 'Divida uma revisão em trabalhos independentes e reúna os resultados com evidência e responsabilidade.',
    level: 'Avançado',
    kind: 'Guia',
    tools: ['Claude Code', 'Subagentes'],
    outcome: 'Uma revisão com responsabilidades separadas e uma decisão final rastreável.',
    prerequisite: 'Um ambiente com suporte a subagentes e um material que já esteja pronto para revisão.',
    sections: [
      {
        id: 'quando-dividir',
        title: 'Divida quando os trabalhos forem independentes',
        paragraphs: [
          'No Claude Code, subagentes podem executar subtarefas em contextos próprios, com instruções e acesso a ferramentas específicos. Essa separação pode ajudar quando uma investigação produz muito material ou quando duas verificações podem acontecer sem depender uma da outra.',
          'Para este exercício, use um guia que você escreveu e suas fontes. Separe a conferência factual da revisão de clareza. Se o trabalho for curto e simples, faça as duas passagens na mesma conversa. Mais agentes acrescentam coordenação e consumo; o número de participantes não comprova qualidade.',
        ],
      },
      {
        id: 'distribua-responsabilidades',
        title: 'Dê uma responsabilidade a cada agente',
        paragraphs: [
          'Forneça o mesmo material de referência e um formato de retorno. Evite pedir que dois agentes alterem simultaneamente o mesmo arquivo. Neste teste, ambos fazem leitura e devolvem achados; a pessoa responsável decide quais correções aplicar.',
        ],
        prompt: `Revise [guia] usando [fontes autorizadas].
Se houver suporte a subagentes, distribua estas duas revisões independentes:
1. Conferência factual: localize afirmações sem apoio ou em conflito com as fontes.
2. Clareza: localize trechos que impedem [público] de realizar [tarefa].
Nenhum revisor deve alterar arquivos.
Cada achado deve trazer trecho, problema, evidência e correção sugerida.
Depois reúna os achados, elimine duplicações e mostre divergências.
Não transforme consenso em prova. Informe o que precisa de decisão humana.
Se não houver suporte, faça as revisões em sequência e informe isso.`,
      },
      {
        id: 'integre-com-evidencia',
        title: 'Confira a revisão antes de aplicar',
        paragraphs: [
          'Abra as evidências de cada achado. Um revisor também pode interpretar mal a fonte ou sugerir uma alteração que prejudique o objetivo do texto. Quando houver discordância, compare os argumentos com o material original e o critério de aceite.',
          'Aplique somente as correções justificadas, preservando uma versão anterior. Faça uma última leitura do conjunto: mudanças corretas isoladamente podem criar repetição ou contradição quando reunidas. A revisão termina quando os problemas relevantes foram resolvidos ou registrados como pendências explícitas e uma pessoa assumiu a aprovação final.',
        ],
      },
    ],
    checklist: ['As subtarefas tinham responsabilidades distintas.', 'Cada achado trouxe evidência verificável.', 'Conferi divergências e descartei sugestões sem fundamento.', 'O conjunto corrigido passou por revisão humana.'],
    sources: [sources.agents, sources.accuracy],
    reviewedAt: '2026-09-14',
  },
];
