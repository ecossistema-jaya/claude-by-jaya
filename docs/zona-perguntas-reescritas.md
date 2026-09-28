# Zona de Genialidade — as 43 perguntas reescritas

Regras que segui: mesmo `id`, mesmo `type`, mesmo número de opções e **mesmo significado por opção** (cada opção alimenta um sinal de framework no prompt; mudei a roupa, não o corpo). Sem jargão de negócio onde dá pra dizer em português de gente. Enunciado sempre com contexto: nada de "Você prefere..." solto. Opções curtas, uma oração cada. Hints só onde a pergunta é aberta.

Legenda: **H** = hoje · **P** = proposta. Opções listadas na mesma ordem do `QUESTIONS`.

---

## Seção 1 — Quem é você hoje

### ctx_nome
H: Qual seu nome completo?
P: Como você quer ser chamado(a) aqui? *(hint: nome ou apelido; é assim que a análise vai falar com você)*

### ctx_area
H: Qual sua área de atuação principal?
P: Em que área você trabalha hoje, ou trabalhou por mais tempo?
- Tecnologia / Desenvolvimento → Tecnologia
- Marketing / Vendas → Marketing ou vendas
- Design / Criação → Design ou criação
- Gestão / Liderança → Gestão de pessoas ou projetos
- Educação / Treinamento → Educação
- Saúde / Bem-estar → Saúde, terapia ou bem-estar
- Finanças / Investimentos → Finanças
- Consultoria / Serviços Profissionais → Serviço especializado (advocacia, contabilidade, consultoria...)
- Outro (especificar) → Outra (me conta qual)

### ctx_experiencia
H: Há quanto tempo você trabalha na sua área principal?
P: Há quanto tempo você faz isso?
- Menos de 1 ano / 1 a 3 / 3 a 5 / 5 a 10 / Mais de 10 → mantém

### ctx_oque_faz (aberta)
H: Descreva em 2-3 frases: o que você faz no seu dia a dia profissional?
P: Num dia comum de trabalho, o que você passa a maior parte do tempo fazendo?
*(hint: duas ou três frases, do jeito que você contaria pra um amigo. Ex.: "Atendo pacientes de manhã, à tarde respondo mensagem, organizo agenda e estudo.")*

### ctx_sem_dinheiro (aberta)
H: Se dinheiro NÃO fosse problema, o que você faria da vida?
P: Se dinheiro não fosse questão, o que você faria com os seus dias?
*(hint: não precisa ser trabalho. Pode ser algo que você nunca contou pra ninguém.)*

### ctx_intro_extro
H: Você se considera mais...
P: Depois de um dia cheio de gente, como você fica?
- Introvertido - prefiro trabalhar sozinho, recarrego energia em silêncio → Esgotado(a). Preciso de silêncio pra recarregar
- Mais introvertido que extrovertido - gosto de pessoas mas preciso de tempo sozinho → Gostei, mas preciso de um tempo sozinho(a) depois
- Equilibrado - depende da situação → Depende do dia e das pessoas
- Mais extrovertido que introvertido - gosto de tempo sozinho mas prefiro estar com pessoas → Com energia, mas também curto ficar só
- Extrovertido - recarrego energia com pessoas, penso em voz alta → Recarregado(a). Gente me dá energia

### ctx_analitico_intuitivo
H: Na hora de tomar decisões, você e mais...
P: Quando precisa decidir algo importante, o que vem primeiro?
- Analítico - preciso de dados, planilhas, pesquisa antes de decidir → Pesquiso, comparo, só decido com dado na mão
- Mais analítico que intuitivo - prefiro dados mas confio no instinto quando preciso → Prefiro dado, mas confio no instinto quando não dá tempo
- Equilibrado - uso dados E intuição igualmente → Uso os dois na mesma medida
- Mais intuitivo que analítico - confio no feeling mas valido com dados → Sinto primeiro, depois confiro
- Intuitivo - decido rápido pelo instinto, dados são secundários → Decido pelo instinto; dado vem depois, se vier

### ctx_estrutura_flex
H: Você prefere...
P: Como você gosta de organizar o seu trabalho?
- Estrutura total - cronogramas, checklists, processos definidos → Tudo planejado: cronograma, lista, processo
- Mais estrutura - gosto de flexibilidade dentro de um framework → Um plano geral, com liberdade dentro dele
- Depende do projeto → Depende do que estou fazendo
- Mais flexibilidade - estrutura demais me sufoca → Pouca estrutura; regra demais me sufoca
- Flexibilidade total - improviso, adapto, mudo conforme necessário → Nenhuma: improviso e ajusto no caminho

---

## Seção 2 — O que te dá e o que te tira energia

### energy_drena (múltipla)
H: Quais atividades DRENAM sua energia, mesmo que você saiba fazê-las?
P: O que te deixa esgotado(a), mesmo que você saiba fazer bem? (marque todas que valem)
- Tarefas administrativas e burocráticas → Burocracia e papelada
- Reuniões longas sem pauta definida → Reunião longa que não leva a nada
- Trabalho repetitivo e operacional → Tarefa repetitiva
- Negociação e confronto direto → Negociar ou bater de frente com alguém
- Análise detalhada de números e planilhas → Planilha e número miúdo
- Atendimento ao cliente / suporte → Atender e dar suporte a cliente
- Vender e prospectar clientes → Vender, correr atrás de cliente
- Gerenciar pessoas e dar feedback → Gerenciar pessoas e dar feedback
- Escrever textos longos e documentação → Escrever texto longo
- Programar / trabalho técnico detalhado → Trabalho técnico minucioso

### energy_carrega (múltipla)
H: Quais atividades te ENERGIZAM - você termina com mais energia do que começou?
P: O que te deixa com mais energia no fim do que no começo? (marque todas que valem)
- Resolver problemas complexos → Resolver um problema difícil
- Ensinar e mentorar pessoas → Ensinar, orientar alguém
- Criar coisas novas (produtos, conteúdo, arte) → Criar algo do zero (um produto, um texto, uma arte)
- Liderar e inspirar equipes → Puxar um grupo pra frente
- Analisar dados e encontrar padrões → Achar o padrão escondido nos dados
- Conectar pessoas e fazer networking → Apresentar pessoas umas às outras
- Planejar estratégias e visão de longo prazo → Pensar o longo prazo, desenhar o caminho
- Executar e entregar resultados concretos → Executar e ver a coisa pronta
- Negociar e fechar acordos → Negociar e fechar um acordo
- Automatizar e otimizar processos → Fazer um processo rodar sozinho

### energy_agradecem
H: Quando outras pessoas te agradecem ou elogiam, geralmente e por...
P: Quando alguém te agradece, costuma ser por quê?
- Resolver um problema que ninguém mais conseguia → Você resolveu o que ninguém resolvia
- Explicar algo complexo de forma simples → Você explicou algo difícil de um jeito simples
- Conectar as pessoas certas entre si → Você juntou as pessoas certas
- Trazer energia e motivação para o grupo → Você levantou o ânimo do grupo
- Organizar o caos e criar ordem → Você botou ordem na bagunça
- Ter ideias criativas e inovadoras → Você teve a ideia que ninguém teve
- Entregar resultados rapidos e confiaveis → Você entregou rápido e certo
- Ouvir com atenção e dar conselhos certeiros → Você ouviu e disse a coisa certa

### energy_flow
H: Em qual tipo de atividade você PERDE A NOÇÃO DO TEMPO (estado de flow)?
P: Fazendo o quê você perde a noção da hora?
- Escrevendo, criando conteúdo ou arte → Escrevendo ou criando
- Programando, construindo sistemas ou produtos → Construindo algo (sistema, produto, ferramenta)
- Conversando, ensinando ou fazendo mentoria → Conversando, ensinando, orientando
- Planejando, desenhando estratégias → Planejando, desenhando o caminho
- Pesquisando, aprendendo coisas novas → Estudando, pesquisando
- Liderando reuniões, facilitando discussoes → Conduzindo uma conversa em grupo
- Negociando, vendendo, convencendo → Convencendo alguém de algo
- Organizando, sistematizando, criando processos → Organizando, criando método

### energy_inicio
H: Quando começa um projeto novo, sua primeira reação natural e...
P: Projeto novo na mão. O que você faz primeiro?
- Pesquisar bastante antes de dar o primeiro passo → Pesquiso bastante antes de começar
- Fazer um plano detalhado com etapas claras → Faço um plano com etapas
- Comecar a executar logo e ajustar no caminho → Começo logo e ajusto no caminho
- Conversar com outras pessoas para pegar opinioes → Converso com gente antes de decidir

### energy_problemas
H: Quando surge um problema inesperado no trabalho, você tende a...
P: Deu um problema que você não esperava. Sua reação natural é:
- Parar e analisar todas as opções antes de agir → Parar e olhar todas as opções antes de agir
- Agir rápido com a melhor opção disponível no momento → Agir rápido com o que tenho
- Consultar alguém de confianca antes de decidir → Ligar pra alguém de confiança
- Criar um sistema ou processo para que o problema não se repita → Resolver e criar um jeito de não repetir

### energy_manual_conceitual
H: Você prefere trabalhar com...
P: O que te atrai mais num trabalho?
- Coisas tangiveis - prototipos, ferramentas, construir fisicamente → Coisa concreta: montar, construir, testar na mão
- Mais tangível - gosto de ver resultados concretos → Mais concreto: gosto de ver o resultado
- Tanto faz - depende do projeto → Tanto faz, depende do projeto
- Mais abstrato - prefiro conceitos, estratégias, ideias → Mais abstrato: ideias, estratégias
- Coisas abstratas - modelos mentais, frameworks, teorias → Ideia pura: modelos, teorias, conceitos

### energy_detalhe
H: Quando precisa entregar um trabalho, você...
P: Na hora de entregar um trabalho, você:
- E extremamente detalhista - revisa varias vezes, precisa estar perfeito → Revisa várias vezes; tem que estar perfeito
- Cuida dos detalhes importantes mas não se perde nos pequenos → Cuida do que importa e solta o resto
- Foca no resultado geral - detalhes podem ser ajustados depois → Olha o todo; detalhe se ajusta depois
- Entrega rápido e itera - perfeição e inimiga do progresso → Entrega logo e melhora na próxima

### energy_delegacao
H: Sobre delegar tarefas, você...
P: Passar uma tarefa pra outra pessoa, pra você, é:
- Tenho muita dificuldade - prefiro fazer eu mesmo → Difícil. Prefiro fazer eu mesmo(a)
- Delego mas fico monitorando de perto → Possível, mas fico de olho
- Delego com instruções claras e confio no resultado → Tranquilo: explico e confio
- Adoro delegar - prefiro focar no que só eu sei fazer → Um alívio. Quero ficar só com o que só eu faço

### energy_ritmo
H: Seu ritmo natural de trabalho e...
P: Como é o seu ritmo quando ninguém manda em você?
- Explosoes intensas seguidas de descanso (sprint/recovery) → Arrancadas intensas, depois descanso
- Ritmo constante e previsível ao longo do dia → Constante, o dia inteiro parecido
- Comeco devagar e vou acelerando até o deadline → Devagar no começo, acelero perto do prazo
- Alta energia de manhã, desacelero à tarde → Forte de manhã, caio à tarde

### energy_inovacao_otimizacao
H: O que te da mais satisfação?
P: O que te dá mais satisfação?
- Criar algo do ZERO que nunca existiu → Criar algo que não existia
- Melhorar algo existente e tornar excelente → Pegar algo que existe e deixar excelente
- Escalar algo que já funciona para mais pessoas → Levar algo que funciona pra muito mais gente
- Conectar coisas existentes de formas novas → Juntar coisas que existem de um jeito novo

### energy_multitask
H: Você funciona melhor...
P: Como você rende mais num dia de trabalho?
- Fazendo uma coisa só com foco total por longos períodos → Uma coisa só, por horas
- Alternando entre 2-3 projetos no mesmo dia → Alternando 2 ou 3 coisas
- Gerenciando muitas coisas ao mesmo tempo → Muita coisa rodando ao mesmo tempo
- Depende - foco profundo para criar, multitask para executar → Depende: foco pra criar, várias pra executar

---

## Seção 3 — O que vem fácil pra você

### talent_padrao
H: Pense nos seus 3 maiores sucessos profissionais. O que eles têm em COMUM?
P: Lembra de três momentos em que você se saiu muito bem. O que eles têm em comum?
- Em todos eu estava liderando e influenciando pessoas → Eu estava à frente de pessoas
- Em todos eu estava criando algo novo e inovador → Eu estava criando algo novo
- Em todos eu estava organizando e executando com disciplina → Eu estava organizando e executando
- Em todos eu estava analisando e resolvendo problemas complexos → Eu estava resolvendo um problema difícil
- Em todos eu estava ensinando e desenvolvendo outros → Eu estava ensinando alguém
- Em todos eu estava conectando pessoas e construindo relacionamentos → Eu estava construindo relação
- Em todos eu estava vendendo e convencendo stakeholders → Eu estava convencendo quem decidia
- Em todos eu estava planejando estratégia de longo prazo → Eu estava pensando o longo prazo

### talent_descricao
H: Se eu perguntasse a 5 pessoas próximas 'qual a principal qualidade dessa pessoa?', a maioria diria...
P: Se eu perguntasse a cinco pessoas próximas qual é a sua maior qualidade, a maioria diria:
- Confiável e consistente - sempre entrega o que promete → "Faz o que promete"
- Criativo e visionário - sempre tem ideias incríveis → "Tem ideias que ninguém tem"
- Carismático e inspirador - todo mundo quer estar perto → "Todo mundo quer estar perto"
- Analítico e profundo - enxerga o que ninguém vê → "Enxerga o que ninguém vê"
- Prático e resolutivo - resolve qualquer pepino → "Resolve qualquer pepino"
- Cuidadoso e atencioso - se preocupa genuinamente com as pessoas → "Cuida de verdade das pessoas"
- Corajoso e ousado - não tem medo de arriscar → "Não tem medo de arriscar"

### talent_natural
H: O que você faz com FACILIDADE que outras pessoas acham difícil?
P: O que sai fácil pra você e é difícil pra maioria?
- Falar em público e apresentar ideias → Falar pra uma plateia
- Escrever textos claros e persuasivos → Escrever de um jeito que convence
- Organizar informações complexas em estruturas simples → Organizar bagunça em algo simples
- Aprender coisas novas rapidamente → Aprender rápido
- Ler pessoas e entender motivações → Ler as pessoas
- Enxergar tendencias e oportunidades antes dos outros → Ver a oportunidade antes dos outros
- Manter a calma sob pressão → Ficar calmo(a) sob pressão
- Transformar ideias abstratas em planos concretos → Transformar ideia em plano

### talent_dominio
H: Em um time, você naturalmente assume o papel de...
P: Num grupo, sem ninguém combinar, você acaba sendo quem:
- EXECUTOR - garanto que as coisas acontecam e sejam entregues → Faz acontecer e entrega
- INFLUENCIADOR - convenco, vendo, inspiro os outros a agir → Convence e anima os outros
- CONSTRUTOR DE RELACIONAMENTOS - crio harmonia e conecto pessoas → Segura o grupo unido
- PENSADOR ESTRATÉGICO - trago visão de futuro e análise profunda → Pensa mais longe que os outros

### talent_frustracao
H: O que te FRUSTRA repetidamente no trabalho?
P: O que te irrita de novo e de novo no trabalho?
- Pessoas que não cumprem prazos e compromissos → Gente que não cumpre o combinado
- Falta de visão estratégica nas decisões → Decisão sem pensar no depois
- Processos lentos e burocraticos → Lentidão e burocracia
- Falta de criatividade e inovação no time → Ninguém trazer ideia nova
- Pessoas que não se desenvolvem e ficam estagnadas → Gente que não cresce
- Conflitos interpessoais mal resolvidos → Briga mal resolvida
- Falta de dados e metricas para decisões → Decidir no achismo, sem número
- Microgerenciamento e falta de autonomia → Alguém em cima de mim o tempo todo

### talent_comunicacao
H: Seu estilo natural de comunicação e...
P: Quando você explica algo, como sai?
- Direto e objetivo - vou ao ponto sem rodeios → Direto ao ponto
- Detalhado e preciso - apresento todos os dados e evidencias → Com todos os detalhes e provas
- Inspirador e entusiasmado - uso historias e emoção → Com história e emoção
- Diplomático e cuidadoso - considero todos os lados → Com cuidado, olhando todos os lados

### talent_aprendizado
H: Quando quer aprender algo novo, você...
P: Quando quer aprender algo novo, você:
- Lê tudo sobre o assunto antes de começar (livros, artigos, cursos) → Lê tudo antes de começar
- Procura um mentor ou especialista para aprender direto com a pessoa → Procura alguém que já sabe
- Comeca a praticar e aprende fazendo, errando e ajustando → Começa fazendo, erra e ajusta
- Assiste videos e tutoriais, depois tenta replicar → Vê alguém fazendo e repete

### talent_feedback
H: Quando recebe um feedback crítico (negativo), você...
P: Alguém te critica com razão. O que acontece por dentro?
- Analisa friamente e extrai o que é útil → Filtro o útil sem me abalar
- Fica incomodado mas usa como combustível para melhorar → Me incomoda, e uso isso pra melhorar
- Precisa de um tempo para processar antes de reagir → Preciso de um tempo antes de responder
- Questiona e desafia se o feedback faz sentido → Questiono se faz sentido mesmo

### talent_contribuicao
H: Se você pudesse contribuir com UMA COISA para o mundo, seria...
P: Se você pudesse deixar uma coisa só pro mundo, seria:
- Ensinar e capacitar pessoas a se desenvolverem → Pessoas mais capazes por causa do que ensinei
- Criar produtos ou soluções que resolvam problemas reais → Algo que resolve um problema real
- Inspirar e liderar movimentos de transformação → Um movimento que mudou algo
- Organizar sistemas que funcionem de forma eficiente → Um sistema que funciona sem mim
- Conectar pessoas e criar comunidades fortes → Uma comunidade forte
- Descobrir verdades e compartilhar conhecimento profundo → Um conhecimento que ninguém tinha
- Gerar riqueza e oportunidades economicas para outros → Oportunidade e prosperidade pra outros

### talent_competencia_genialidade (sim/não + detalhe)
H: Tem algo que você faz BEM (outros até elogiam) mas que na verdade você NÃO gosta de fazer?
P: Tem algo que você faz bem, que até elogiam, mas que no fundo você não gosta de fazer?
*(hint: essa é a pergunta mais importante do teste. Ex.: "Sou boa em organizar eventos, todo mundo me pede, e eu detesto.")*

---

## Seção 4 — Como você quer que o dinheiro entre

*(Os 7 frameworks ficam; o que muda é a língua. Cada opção continua mapeando o mesmo perfil.)*

### biz_como_ganha
H: Qual modelo de trabalho/negócio te atrai MAIS?
P: Se o dinheiro viesse do jeito que você quer, ele viria de:
- Criar produtos digitais (cursos, apps, ferramentas) e vender em escala → Algo que você cria uma vez e vende muitas vezes (curso, app, material)
- Prestar serviços de alto valor (consultoria, mentoria, done-for-you) → Atender pessoas de perto, cobrando bem por isso
- Construir e gerenciar equipes que entregam resultados → Montar e conduzir uma equipe
- Fazer parcerias e conectar oportunidades (deals, joint ventures) → Juntar pessoas e oportunidades, ganhar no meio
- Investir e multiplicar recursos existentes → Investir e multiplicar o que já tem
- Automatizar sistemas que geram receita recorrente → Um sistema que gera renda sem você todo dia

### biz_risco
H: Sobre risco financeiro, você...
P: Arriscar dinheiro, pra você, é:
- Evito ao máximo - preciso de previsibilidade e segurança → Coisa que evito; preciso de segurança
- Aceito riscos calculados com rede de proteção → Aceitável, se tiver uma rede embaixo
- Tomo riscos moderados se o potencial de retorno justifica → Parte do jogo, se o retorno compensar
- Amo risco - alto risco, alto retorno e meu mantra → O que me anima: quanto maior, melhor

### biz_solo_time
H: Você funciona melhor...
P: Trabalhando, você rende mais:
- Totalmente sozinho - sou mais produtivo sem ninguém por perto → Sozinho(a), sem ninguém por perto
- Sozinho com suporte - um assistente ou VA para operacional → Sozinho(a), com alguém pra cuidar do operacional
- Em dupla - eu e um sócio complementar → Em dupla, com alguém que completa o que me falta
- Liderando um time pequeno (3-5 pessoas) → À frente de um time pequeno (3 a 5)
- Liderando uma organizacao maior (10+ pessoas) → À frente de um grupo grande (10 ou mais)

### biz_timing
H: Você prefere...
P: Numa oportunidade nova, você prefere entrar:
- Ser o PRIMEIRO em algo novo (inovar, criar mercado) → Antes de todo mundo, mesmo sem prova de que funciona
- Entrar cedo mas com algo ja validado (fast follower) → Cedo, mas depois que alguém já provou que funciona
- Entrar quando o mercado ja e grande e otimizar (melhoria) → Quando já está consolidado, fazendo melhor
- Entrar no final e consolidar (comprar, fusionar, escalar o que existe) → No fim, juntando ou ampliando o que já existe

### biz_receita
H: Se pudesse escolher UMA fonte principal de receita, seria...
P: Se tivesse que escolher uma coisa só pra vender, seria:
- Vender conhecimento (cursos, livros, palestras, mentoria) → O que você sabe (aula, livro, palestra, mentoria)
- Vender servicos especializados (consultoria, agencia, freelance) → O que você faz (atendimento, consultoria, serviço)
- Vender produtos (SaaS, apps, e-commerce, produtos fisicos) → Um produto (app, loja, coisa física)
- Vender oportunidades (intermediacao, afiliados, parcerias, investimentos) → Uma ponte (indicação, parceria, intermediação)

### biz_preco
H: Qual sua relação com cobrar caro pelo seu trabalho?
P: Cobrar caro pelo que você faz é:
- Tenho dificuldade - sempre acho que deveria cobrar menos → Difícil; sempre acho que devia cobrar menos
- Cobro um preco justo mas sei que poderia cobrar mais → Ok; cobro o justo, mas sei que cabe mais
- Cobro bem e me sinto confortavel com meu preco → Tranquilo; cobro bem e me sinto em paz
- Cobro premium - meu trabalho vale caro e eu sei disso → Natural; meu trabalho vale caro e eu sei

### biz_escala
H: O que te atrai mais?
P: Qual desses jeitos de atender te atrai mais?
- Atender POUCOS clientes com MUITA profundidade (high-touch) → Poucas pessoas, muito de perto
- Atender um NUMERO MEDIO com boa qualidade (group coaching, turmas) → Grupos e turmas
- Atender MUITAS pessoas com um produto escalavel (cursos, SaaS) → Muita gente, com algo que não depende de mim estar lá
- Nao atender ninguem diretamente - criar sistemas que funcionam sem mim → Ninguém direto; construir o que funciona sozinho

### biz_wealth_dynamics
H: Qual descrição abaixo mais se parece com você?
P: Qual dessas frases é mais a sua cara? *(sai o nome do perfil em caixa alta; fica só a frase)*
- CRIADOR - Tenho muitas ideias, começo coisas novas, sou visionário → Tenho ideia demais e começo coisa nova o tempo todo
- ESTRELA - Brilho no palco, inspiro pessoas, sou a marca → Eu sou a marca; brilho quando estou na frente
- APOIADOR - Sou o braço direito perfeito, executo a visão de outros com excelência → Sou o braço direito que faz a visão de alguém acontecer
- NEGOCIADOR - Conecto pessoas e oportunidades, faço as coisas acontecerem através de outros → Faço as coisas acontecerem juntando as pessoas certas
- COMERCIANTE - Tenho timing de mercado, compro barato e vendo caro → Tenho timing: sei a hora de entrar e de sair
- ACUMULADOR - Sou paciente, consistente, construo riqueza devagar e com segurança → Construo devagar, com segurança, sem pressa
- SENHOR DOS SISTEMAS - Amo processos, automação, construir maquinas que funcionam sozinhas → Gosto de montar o sistema que roda sem mim
- MECÂNICO - Pego coisas que já existem e torno muito melhores → Pego o que existe e deixo muito melhor

---

## Seção 5 — Pra onde você quer ir

### vision_90dias (aberta)
H: Qual RESULTADO CONCRETO você quer ter alcançado daqui a 90 dias?
P: Daqui a três meses, o que precisa ter mudado pra você dizer que valeu?
*(hint: quanto mais concreto, melhor. Pode ser dinheiro, pode ser rotina, pode ser uma decisão tomada. "Ter 5 clientes fixos" vale; "estar melhor" não ajuda.)*

### initiative_stage
H: Pensando apenas nos projetos que você considera ativos hoje, qual cenário mais se aproxima da realidade?
P: Dos projetos que você tem em andamento de verdade (não ideia anotada), qual frase descreve melhor?
- Não tenho nenhum projeto realmente iniciado → Nenhum começou de fato
- Tenho uma frente principal em andamento → Tenho um principal andando
- Tenho várias frentes, mas a maioria ainda está no começo → Tenho vários, a maioria no começo
- Tenho 2 ou mais frentes que já passaram da metade, mas ainda não concluí → Tenho 2 ou mais passados da metade, nenhum terminado
- Tenho pelo menos uma frente praticamente pronta que continuo adiando finalizar → Tenho um quase pronto que eu continuo adiando

### vision_receita
H: Qual sua meta de receita MENSAL nos próximos 6 meses?
P: Quanto você quer estar ganhando por mês com isso daqui a seis meses?
- faixas mantidas; tirar os parênteses ("estou começando", "quero escalar", "pensando grande"), que julgam a escolha

### vision_bloqueio (aberta)
H: O que está te TRAVANDO agora? Qual o maior obstáculo entre onde você está e onde quer chegar?
P: O que está te segurando hoje?
*(hint: pode ser de dentro (medo, não saber por onde começar) ou de fora (tempo, dinheiro, uma habilidade que falta).)*

### clarity_next_step
H: Pensando nos próximos 30 dias, qual frase descreve melhor sua situação?
P: Sobre os próximos 30 dias, qual frase é a sua?
- Não sei nem qual direção seguir → Não sei nem pra que lado ir
- Tenho algumas possibilidades, mas não sei qual escolher → Tenho opções e não sei escolher
- Sei a direção, mas ainda não sei qual é o próximo passo concreto → Sei a direção, não sei o próximo passo
- Sei qual é o próximo passo, mas ainda não defini quando ou como executá-lo → Sei o passo, não marquei quando
- Sei exatamente o próximo passo, quando vou executá-lo e o que contará como concluído → Sei o passo, o dia e o que conta como feito

### vision_tempo
H: Quanto tempo por SEMANA você pode dedicar ao seu projeto/negócio (fora do emprego, se aplicável)?
P: Hoje, quantas horas por semana sobram pra isso?
- faixas mantidas; tirar os parênteses explicativos

### vision_tempo_prazo (NOVA — a única pergunta acrescentada)
P: Essa quantidade de horas é:
- Minha escolha, e deve continuar assim
- Uma fase com prazo: vai mudar até ______ *(campo curto: "quando?")*
- Uma fase sem prazo: depende de algo que eu não controlo
- Já é o máximo que consigo, e não vejo mudando

Regra pro prompt de análise (bloco C e blueprint): se a resposta for "fase com prazo", o plano de 90 dias trata o tempo como **sequenciamento** ("depois de X, abre espaço pra Y"), nunca como incongruência de perfil. A distância entre meta e horas vira degrau, não diagnóstico.

### vision_ai
H: Qual seu nível de experiência com Inteligência Artificial e automação?
P: Como está a sua relação com inteligência artificial hoje?
- Zero - nunca usei ChatGPT ou ferramentas similares → Nunca usei
- Básico - uso ChatGPT para perguntas e textos simples → Uso pra perguntar coisas e escrever
- Intermediário - uso AI no dia a dia para vários fluxos de trabalho → Uso todo dia, em várias tarefas
- Avancado - crio automações, uso APIs, construo com AI → Monto automações e construo com IA
- Expert - desenvolvo soluções de AI para mim e/ou para clientes → Desenvolvo soluções de IA pra mim e pra outros

---

## Fora das perguntas, mas na mesma língua

- **Título das seções** na tela, hoje "Contexto Pessoal / Atividades e Energia / Talentos e Padrões / Estilo de Negócios / Visão e Ambição" → "Quem é você hoje / O que te dá e te tira energia / O que vem fácil pra você / Como você quer que o dinheiro entre / Pra onde você quer ir".
- **Tela de abertura**: trocar "Sete frameworks lêem as mesmas respostas" por algo que fale com a pessoa antes de falar do método. Fica pra depois; é copy, não pergunta.

## O que não mudou, de propósito

- 43 perguntas + 1 nova = 44. Nenhuma removida, nenhuma opção a mais ou a menos.
- Os `id`s, o `type` e a ordem das opções. O prompt de análise recebe o mesmo sinal.
- Os 7 frameworks e os 13 cards do dashboard.
