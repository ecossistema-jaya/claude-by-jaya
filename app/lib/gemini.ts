/* O motor de análise, sem portaria.

   Duas rotas usam a mesma chamada ao Gemini e o mesmo teto por IP, mas autorizam
   gente diferente: /api/analyze atende o aluno logado (sessão do Supabase, conferida
   pelo middleware) e /api/zona/analyze atende a pessoa convidada para a Zona
   (sessão Google, acesso por produto e cookie de app/lib/lead.ts). Misturar duas autorizações num handler só é como erro de
   autorização costuma nascer, então o que se compartilha é isto: o motor.

   Sobre o modelo — gemini-2.5-flash responde 404 ("no longer available to new
   users") nesta chave e gemini-2.0-flash já não tem cota no free tier. Sobraram:
   - gemini-3.5-flash aceita thinkingConfig.thinkingBudget = 0 (ideal: o raciocínio
     não come o maxOutputTokens e o JSON não trunca);
   - gemini-3.6-flash recusa esse campo com 400, então cai no fallback abaixo, que
     repete a chamada sem ele e com teto de tokens bem maior.
   Está em 3.5-flash: com o thinking desligado o JSON não corre risco de truncar.
   Trocar para 3.6-flash é mudar uma linha — o fallback cobre a diferença. */

const MODEL = 'gemini-3.5-flash';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const JANELA = 60 * 60 * 1000;

/* Um balde por chamador. Os dois tetos são independentes de propósito: uso da Zona
   não pode consumir a cota do aluno que pagou pelo curso.

   ATENÇÃO, o mesmo aviso de sempre: estes Map vivem na memória da instância. Zeram
   a cada deploy e não são compartilhados entre instâncias da Vercel — na prática o
   teto real pode ser um múltiplo do configurado. Para teto rígido, Vercel KV. */
const baldes = new Map<string, Map<string, number[]>>();

function balde(nome: string) {
  let b = baldes.get(nome);
  if (!b) {
    b = new Map();
    baldes.set(nome, b);
  }
  return b;
}

export function excedeu(nome: string, ip: string, teto: number) {
  const hits = balde(nome);
  const agora = Date.now();
  const recentes = (hits.get(ip) ?? []).filter((t) => agora - t < JANELA);

  if (recentes.length >= teto) {
    hits.set(ip, recentes);
    return true;
  }

  recentes.push(agora);
  hits.set(ip, recentes);
  if (hits.size > 5000) hits.clear(); // guarda contra crescimento indefinido
  return false;
}

/** O primeiro IP da cadeia do proxy, ou 'local' fora da Vercel. */
export function ipDe(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'local';
}

function corpo(text: string, comThinking: boolean) {
  return {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      temperature: 0.7,
      // sem thinking, 8192 basta; no fallback o raciocínio come do mesmo teto
      maxOutputTokens: comThinking ? 8192 : 24576,
      responseMimeType: 'text/plain',
      ...(comThinking ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
    },
  };
}

export type Falha = 'servidor' | 'limite' | 'modelo';
export type Resultado = { ok: true; text: string } | { ok: false; erro: Falha };

/** Chama o modelo e devolve o texto. Não decide quem pode chamar. */
export async function analisar(text: string, signal?: AbortSignal): Promise<Resultado> {
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) return { ok: false, erro: 'servidor' };

  const chamar = (comThinking: boolean) =>
    fetch(URL, {
      signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': chave },
      body: JSON.stringify(corpo(text, comThinking)),
    });

  let r = await chamar(true);
  // Se a versão atual da API recusar thinkingConfig, repete sem ele.
  if (r.status === 400) r = await chamar(false);

  if (r.status === 429) {
    console.warn('quota do gemini', await r.text());
    return { ok: false, erro: 'limite' };
  }
  if (!r.ok) {
    console.error('gemini', r.status, await r.text());
    return { ok: false, erro: 'modelo' };
  }

  const d = await r.json();
  const out = ((d?.candidates?.[0]?.content?.parts ?? []) as { text?: string }[])
    .map((p) => p.text ?? '')
    .join('');

  if (!out) {
    console.error('gemini resposta vazia', JSON.stringify(d).slice(0, 800));
    return { ok: false, erro: 'modelo' };
  }

  return { ok: true, text: out };
}

/** Traduz o motivo da falha no status HTTP que o front já sabe tratar. */
export const STATUS: Record<Falha, number> = {
  servidor: 500,
  limite: 429,
  modelo: 502,
};
