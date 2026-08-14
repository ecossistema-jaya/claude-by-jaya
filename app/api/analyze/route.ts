import { NextResponse } from 'next/server';
import { analisar, excedeu, ipDe, STATUS } from '@/app/lib/gemini';

export const runtime = 'nodejs';
export const maxDuration = 60; // teto do plano Hobby da Vercel

/* A rota das aulas. Quem chega aqui já passou pelo middleware, então é aluno com
   sessão viva e linha ativa em alunos_claude — não há portaria a fazer neste
   arquivo. O motor e o teto por IP moram em app/lib/gemini.ts, compartilhados com
   /api/zona/analyze, que atende o visitante público com outra portaria.

   Teto: 12 chamadas por IP por hora (~3 análises completas, já que cada dashboard
   dispara 4 chamadas). */
const TETO = 12;

export async function POST(req: Request) {
  const ip = ipDe(req);
  if (excedeu('aulas', ip, TETO)) {
    console.warn('teto por ip', ip);
    return NextResponse.json({ error: 'limite' }, { status: 429 });
  }

  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  if (!text) return NextResponse.json({ error: 'texto ausente' }, { status: 400 });

  const r = await analisar(text);
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: STATUS[r.erro] });

  return NextResponse.json({ text: r.text });
}
