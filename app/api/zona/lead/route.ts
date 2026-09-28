import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from '@/app/lib/supabase/config';
import { excedeu, ipDe } from '@/app/lib/gemini';
import {
  COOKIE_LEAD_ZONA,
  emailPlausivel,
  emitirLeadVinculado,
  normalizarEmail,
  opcoesCookieLead,
} from '@/app/lib/lead';
import { exigirAcessoZona } from '@/app/lib/exigir-acesso-produto';

export const runtime = 'nodejs';

/* A porta da Zona de Genialidade.

   Fica entre o fim do questionário e o começo da análise, não entre a análise e o
   resultado. A ordem importa: se o e-mail viesse depois, as quatro chamadas ao
   Gemini já teriam sido pagas antes de existir um lead, e a portaria não protegeria
   nada. Aqui, quem não deixa o e-mail não gasta cota.

   Vale para a pessoa também: a espera de um minuto acontece depois do compromisso,
   não antes. Ninguém investe meia hora de questionário e desiste na tela de carga.

   Teto próprio de 20 por IP por hora, para o formulário não virar torneira de
   escrita no banco. */
const TETO = 20;
/* O sufixo _zng marca a procedência: leads nascidos na Zona de Genialidade,
   separados de qualquer outra captura que venha a existir no mesmo banco. */
const TABELA = 'leads_zng';
const ORIGEM_PADRAO = 'zona-de-genialidade';

export async function POST(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin) {
    return NextResponse.json({ error: 'origem' }, { status: 403 });
  }
  const { resposta, email: emailConta, userId } = await exigirAcessoZona();
  if (resposta) return resposta;

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    console.error('AUTH_SECRET ausente');
    return NextResponse.json({ error: 'servidor' }, { status: 500 });
  }

  const ip = ipDe(req);
  if (excedeu('zona-lead', ip, TETO)) {
    console.warn('teto de leads por ip', ip);
    return NextResponse.json({ error: 'limite' }, { status: 429 });
  }

  const corpo = (await req.json().catch(() => ({}))) as {
    email?: string;
    consentimento?: boolean;
    origem?: string;
  };

  const email = normalizarEmail(corpo.email);
  if (!emailPlausivel(email)) {
    return NextResponse.json({ error: 'email' }, { status: 400 });
  }
  if (email !== normalizarEmail(emailConta)) {
    return NextResponse.json({ error: 'email-da-conta' }, { status: 400 });
  }

  /* O consentimento é a base legal do envio posterior. Sem a marcação explícita não
     há gravação — e, como o cookie só sai junto, também não há análise. */
  if (corpo.consentimento !== true) {
    return NextResponse.json({ error: 'consentimento' }, { status: 400 });
  }

  /* insert, não upsert. Upsert exigiria política de UPDATE para `anon`, e a chave
     anônima é pública por construção (NEXT_PUBLIC_): com UPDATE aberto, qualquer um
     reescreveria linha de lead alheia chamando a API do Supabase por fora do site.
     Com INSERT apenas, e-mail repetido bate na restrição de unicidade e volta
     23505 — que aqui é sucesso, porque significa que o lead já estava lá. */
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { error } = await supabase.from(TABELA).insert({
    email,
    origem: (corpo.origem ?? ORIGEM_PADRAO).slice(0, 120),
    consentimento_em: new Date().toISOString(),
  });

  /* Falha de gravação não pode travar a análise: a pessoa cumpriu a parte dela e
     merece o resultado. Fica o log para reconciliar o lead depois. */
  if (error && error.code !== '23505') {
    console.error('lead nao gravado', error.code, error.message);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    COOKIE_LEAD_ZONA,
    await emitirLeadVinculado(email, userId!, secret),
    opcoesCookieLead(),
  );
  return res;
}
