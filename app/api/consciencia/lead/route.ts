import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from '@/app/lib/supabase/config';
import { excedeu, ipDe } from '@/app/lib/gemini';
import {
  COOKIE_LEAD,
  emailPlausivel,
  emitirLeadVinculado,
  normalizarEmail,
  opcoesCookieLead,
} from '@/app/lib/lead';
import { exigirAcessoConsciencia } from '@/app/lib/exigir-acesso-produto';

export const runtime = 'nodejs';

const TETO = 20;
const TABELA = 'leads_zng';
const ORIGEM = 'arquitetura-da-consciencia';

export async function POST(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin) {
    return NextResponse.json({ error: 'origem' }, { status: 403 });
  }
  const { resposta, email: emailConta, userId } = await exigirAcessoConsciencia();
  if (resposta) return resposta;

  if (req.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return NextResponse.json({ error: 'json-necessario' }, { status: 415 });
  }
  if (Number(req.headers.get('content-length')) > 4096) {
    return NextResponse.json({ error: 'corpo-longo' }, { status: 413 });
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) return NextResponse.json({ error: 'servidor' }, { status: 500 });

  const ip = ipDe(req);
  if (excedeu('consciencia-lead', ip, TETO)) {
    return NextResponse.json({ error: 'limite' }, { status: 429 });
  }

  const corpo = (await req.json().catch(() => ({}))) as {
    email?: string;
    consentimento?: boolean;
  };
  const email = normalizarEmail(corpo.email);
  if (!emailPlausivel(email)) {
    return NextResponse.json({ error: 'email' }, { status: 400 });
  }
  if (email !== normalizarEmail(emailConta)) {
    return NextResponse.json({ error: 'email-da-conta' }, { status: 400 });
  }
  if (corpo.consentimento !== true) {
    return NextResponse.json({ error: 'consentimento' }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { error } = await supabase.from(TABELA).insert({
    email,
    origem: ORIGEM,
    consentimento_em: new Date().toISOString(),
  });
  if (error && error.code !== '23505') {
    console.error('lead consciencia nao gravado', error.code, error.message);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    COOKIE_LEAD,
    await emitirLeadVinculado(email, userId!, secret),
    opcoesCookieLead(),
  );
  return res;
}
