import { experimental_evaluate as evaluate } from 'ai';

export const runtime = 'nodejs';

type Body = {
  request?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const request = body.request?.trim();

  if (!request || request.length < 8) {
    return Response.json(
      { error: 'Descreva um objetivo com um pouco mais de contexto.' },
      { status: 400 },
    );
  }

  if (request.length > 6000) {
    return Response.json(
      { error: 'Para este experimento, limite a descrição a 6.000 caracteres.' },
      { status: 400 },
    );
  }

  const result = await evaluate({
    model: 'typesafe-ai/jev',
    state: {
      request,
      context:
        'Biblioteca Claude by Jaya. O objetivo é orientar uma pessoa a escolher o melhor tipo de fluxo de IA para executar uma demanda prática.',
    },
    questions: {
      territory: {
        type: 'choice',
        instructions: 'Qual é o território principal desta demanda?',
        criteria: {
          aprender: 'Aprender um conceito, ferramenta ou método de IA.',
          criar: 'Criar texto, imagem, apresentação, página, material ou conteúdo.',
          organizar: 'Organizar conhecimento, arquivos, rotina, processos ou informações.',
          pesquisar: 'Pesquisar, comparar, investigar ou reunir informações externas.',
          analisar: 'Analisar dados, documentos, situações, diagnósticos ou padrões.',
          automatizar: 'Automatizar tarefas, integrar sistemas, criar agentes ou fluxos recorrentes.',
          programar: 'Escrever, revisar, depurar ou arquitetar software e código.',
          decidir: 'Apoiar uma decisão com critérios, alternativas ou priorização.',
        },
      },
      complexity: {
        type: 'score',
        instructions: 'Qual é a complexidade operacional desta demanda?',
        criteria: [
          'Uma ação simples, direta e curta.',
          'Poucos passos e pouca dependência de contexto.',
          'Vários passos ou necessidade moderada de contexto.',
          'Fluxo complexo com ferramentas, integrações ou validações.',
          'Arquitetura avançada, alto impacto ou múltiplos sistemas/agentes.',
        ],
      },
      needsWeb: {
        type: 'boolean',
        instructions:
          'A resposta correta depende de informação externa atualizada, pesquisa na web ou verificação de fontes?',
      },
      needsCode: {
        type: 'boolean',
        instructions:
          'A execução provavelmente exige escrever, alterar ou executar código?',
      },
      needsHumanReview: {
        type: 'boolean',
        instructions:
          'Uma decisão final ou ação irreversível deveria passar por revisão humana antes de ser executada?',
      },
      bestMode: {
        type: 'choice',
        instructions: 'Qual modo de assistência é mais adequado como próximo passo?',
        criteria: {
          conversa: 'Resolver diretamente em conversa com um modelo generativo.',
          pesquisa: 'Usar pesquisa/web antes de gerar a resposta final.',
          codigo: 'Usar um agente de código ou ambiente de desenvolvimento.',
          workflow: 'Executar um fluxo multi-etapas com ferramentas ou automações.',
          diagnostico: 'Fazer perguntas e diagnóstico antes de executar.',
          humano: 'Preparar a análise, mas manter a decisão/execução final com uma pessoa.',
        },
      },
    },
    providerOptions: {
      gateway: {
        zeroDataRetention: true,
      },
    },
  });

  const confidence = result.providerMetadata?.typesafe?.confidence as
    | Record<string, number>
    | undefined;

  return Response.json({
    answers: result.answers,
    confidence: confidence ?? {},
    meta: {
      model: 'typesafe-ai/jev',
      experiment: 'Jaya AI Router v0.1',
    },
  });
}
