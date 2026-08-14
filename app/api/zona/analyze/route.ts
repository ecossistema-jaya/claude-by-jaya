import { NextResponse } from 'next/server';
import { analisar, excedeu, ipDe, STATUS } from '@/app/lib/gemini';
import { COOKIE_LEAD, conferirLead } from '@/app/lib/lead';

export const runtime = 'nodejs';
export const maxDuration = 60; // teto do plano Hobby da Vercel

/* Mesma análise de /api/analyze, outra portaria.

   Aqui não há sessão do Supabase: quem chega é visitante da página pública. O que
   autoriza é o cookie assinado emitido por /api/zona/lead, que só existe depois de
   a pessoa ter deixado o e-mail e marcado o consentimento.

   Teto próprio de 12 por IP por hora (~3 dashboards, já que cada um dispara 4
   chamadas), em balde separado do teto das aulas: abuso na página aberta não pode
   consumir a cota de quem pagou pelo curso. */
const TETO = 12;

export async function POST(req: Request) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    console.error('AUTH_SECRET ausente');
    return NextResponse.json({ error: 'servidor' }, { status: 500 });
  }

  const token = req.headers
    .get('cookie')
    ?.split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${COOKIE_LEAD}=`))
    ?.slice(COOKIE_LEAD.length + 1);

  if (!(await conferirLead(token, secret))) {
    return NextResponse.json({ error: 'nao-autorizado' }, { status: 401 });
  }

  const ip = ipDe(req);
  if (excedeu('zona', ip, TETO)) {
    console.warn('teto da zona por ip', ip);
    return NextResponse.json({ error: 'limite' }, { status: 429 });
  }

  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  if (!text) return NextResponse.json({ error: 'texto ausente' }, { status: 400 });

  const r = await analisar(text);
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: STATUS[r.erro] });

  return NextResponse.json({ text: r.text });
}
