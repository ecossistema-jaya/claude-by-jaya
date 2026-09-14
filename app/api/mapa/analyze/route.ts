import { NextResponse } from 'next/server';
import { analisar, excedeu, ipDe, STATUS } from '@/app/lib/gemini';
import { prepareMap, mapPrompt, parseMap, MapError } from '@/app/lib/mapa.mjs';

export const runtime = 'nodejs';
export const maxDuration = 60;

// The existing middleware requires an authorized course session for this route.
export async function POST(req: Request) {
  if (excedeu('mapa', ipDe(req), 12)) return NextResponse.json({error:'Limite de análises atingido. Tente mais tarde.'}, {status:429});
  try {
    const reader = req.body?.getReader();
    if (!reader) throw new MapError('Respostas ausentes.',400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const {done,value} = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 32768) { await reader.cancel(); throw new MapError('Respostas longas demais.',413); }
      chunks.push(value);
    }
    let body;
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new MapError('Respostas inválidas.',400); }
    const input = prepareMap(body);
    const result = await analisar(mapPrompt(input), AbortSignal.timeout(50000));
    if (!result.ok) return NextResponse.json({error:'Não foi possível gerar a leitura agora. Suas respostas continuam salvas.'}, {status:STATUS[result.erro]});
    return NextResponse.json({analysis:parseMap(result.text,input)}, {headers:{'Cache-Control':'no-store'}});
  } catch (e) {
    return NextResponse.json({error:e instanceof MapError ? e.message : 'A análise não terminou. Tente novamente.'}, {status:e instanceof MapError ? e.status : 502});
  }
}
