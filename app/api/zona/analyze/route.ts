import { NextResponse } from 'next/server';
import { analisar, excedeu, ipDe, STATUS } from '@/app/lib/gemini';
import { COOKIE_LEAD_ZONA, conferirLeadVinculado } from '@/app/lib/lead';
import { exigirAcessoZona } from '@/app/lib/exigir-acesso-produto';

export const runtime = 'nodejs';
export const maxDuration = 60; // teto do plano Hobby da Vercel

/* Mesma análise de /api/analyze, outra portaria.

   A apresentação da Zona é pública, mas a análise exige duas autorizações: sessão
   Google com convite ativo para o produto e o cookie assinado emitido por
   /api/zona/lead depois do consentimento de captura do e-mail.

   Teto próprio de 12 por IP por hora (~3 dashboards, já que cada um dispara 4
   chamadas), em balde separado do teto das aulas: abuso nesta análise não pode
   consumir a cota de quem pagou pelo curso. */
const TETO = 12;

export async function POST(req: Request) {
  const { resposta, userId } = await exigirAcessoZona();
  if (resposta) return resposta;

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    console.error('AUTH_SECRET ausente');
    return NextResponse.json({ error: 'servidor' }, { status: 500 });
  }

  const token = req.headers
    .get('cookie')
    ?.split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${COOKIE_LEAD_ZONA}=`))
    ?.slice(COOKIE_LEAD_ZONA.length + 1);

  if (!(await conferirLeadVinculado(token, userId!, secret))) {
    return NextResponse.json({ error: 'lead-necessario' }, { status: 428 });
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
