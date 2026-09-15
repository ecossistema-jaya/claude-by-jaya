import { NextResponse } from 'next/server';
import { analisar, excedeu, ipDe, STATUS } from '@/app/lib/gemini';
import { COOKIE_LEAD, conferirLead } from '@/app/lib/lead';
import { prepareConsciencia, mapPromptConsciencia, parseConsciencia, MapError } from '@/app/lib/consciencia.mjs';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  if (req.headers.get('origin') !== new URL(req.url).origin) return reply({ error: 'Origem não autorizada.' }, 403);
  if (req.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply({ error: 'Envie as respostas em JSON.' }, 415);
  const secret = process.env.AUTH_SECRET;
  if (!secret) return reply({ error: 'Não foi possível autorizar a análise agora.' }, 500);

  try {
    const token = req.headers.get('cookie')?.split(';').map(p => p.trim())
      .find(p => p.startsWith(`${COOKIE_LEAD}=`))?.slice(COOKIE_LEAD.length + 1);
    if (!(await conferirLead(token, secret))) return reply({ error: 'Confirme seu acesso para gerar a leitura.' }, 401);
    if (excedeu('consciencia', ipDe(req), 12)) return reply({ error: 'Limite de análises atingido. Tente mais tarde.' }, 429);

    if (Number(req.headers.get('content-length')) > 32768) return reply({ error: 'Respostas longas demais.' }, 413);
    const reader = req.body?.getReader();
    if (!reader) throw new MapError('Respostas ausentes.', 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 32768) {
          await reader.cancel();
          throw new MapError('Respostas longas demais.', 413);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    let body;
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    catch { throw new MapError('Respostas inválidas.', 400); }
    const input = prepareConsciencia(body);
    const signal = AbortSignal.any([req.signal, AbortSignal.timeout(50000)]);
    const result = await analisar(mapPromptConsciencia(input), signal);
    if (!result.ok) return reply({ error: 'Não foi possível gerar a leitura agora. Suas respostas continuam salvas.' }, STATUS[result.erro]);
    return reply({ analysis: parseConsciencia(result.text, input) });
  } catch (error) {
    return reply({ error: error instanceof MapError ? error.message : 'A análise não terminou. Tente novamente.' }, error instanceof MapError ? error.status : 502);
  }
}
