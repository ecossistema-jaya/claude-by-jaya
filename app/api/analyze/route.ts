import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60; // teto do plano Hobby da Vercel

/* gemini-2.5-flash responde 404 ("no longer available to new users") nesta chave
   e gemini-2.0-flash já não tem cota no free tier.
   Sobraram dois caminhos:
   - gemini-3.5-flash aceita thinkingConfig.thinkingBudget = 0 (ideal: o
     raciocínio não come o maxOutputTokens e o JSON não trunca);
   - gemini-3.6-flash recusa esse campo com 400, então cai no fallback abaixo,
     que repete a chamada sem ele e com teto de tokens bem maior.
   Está em 3.5-flash: com o thinking desligado o JSON não corre risco de
   truncar. Trocar para 3.6-flash é só mudar esta linha — o código serve os
   dois, o fallback cobre a diferença. */
const MODEL = 'gemini-3.5-flash';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/* Teto de custo: 12 chamadas por IP por hora (~3 análises completas, já que
   cada dashboard dispara 4 chamadas).
   ATENÇÃO: este Map vive na memória da instância. Ele zera a cada deploy e não
   é compartilhado entre instâncias da Vercel — na prática o teto real pode ser
   um múltiplo de 12. Para um teto rígido, trocar por Vercel KV. */
const JANELA = 60 * 60 * 1000;
const TETO = 12;
const hits = new Map<string, number[]>();

function excedeu(ip: string) {
  const agora = Date.now();
  const recentes = (hits.get(ip) ?? []).filter((t) => agora - t < JANELA);
  if (recentes.length >= TETO) {
    hits.set(ip, recentes);
    return true;
  }
  recentes.push(agora);
  hits.set(ip, recentes);
  if (hits.size > 5000) hits.clear(); // guarda contra crescimento indefinido
  return false;
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

export async function POST(req: Request) {
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) return NextResponse.json({ error: 'servidor' }, { status: 500 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'local';
  if (excedeu(ip)) {
    console.warn('teto por ip', ip);
    return NextResponse.json({ error: 'limite' }, { status: 429 });
  }

  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  if (!text) return NextResponse.json({ error: 'texto ausente' }, { status: 400 });

  const chamar = (comThinking: boolean) =>
    fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': chave },
      body: JSON.stringify(corpo(text, comThinking)),
    });

  let r = await chamar(true);
  // Se a versão atual da API recusar thinkingConfig, repete sem ele.
  if (r.status === 400) r = await chamar(false);

  if (r.status === 429) {
    console.warn('quota do gemini', await r.text());
    return NextResponse.json({ error: 'limite' }, { status: 429 });
  }
  if (!r.ok) {
    console.error('gemini', r.status, await r.text());
    return NextResponse.json({ error: 'modelo' }, { status: 502 });
  }

  const d = await r.json();
  const out = (d?.candidates?.[0]?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? '')
    .join('');

  if (!out) {
    console.error('gemini resposta vazia', JSON.stringify(d).slice(0, 800));
    return NextResponse.json({ error: 'modelo' }, { status: 502 });
  }
  return NextResponse.json({ text: out });
}
