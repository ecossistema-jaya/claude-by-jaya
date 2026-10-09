/* Webhook da Hotmart: confirma o pagamento e libera (ou retira) o acesso ao
   Claude do Zero em `alunos_claude`. Publicada com verify_jwt desligado, porque
   a Hotmart não manda JWT do Supabase: o único portão é o hottok, então esta
   função fica mínima. A regra de concessão mora em
   public.hotmart_processar_evento (migração 20261009120000).
   Segredos: HOTMART_HOTTOK, HOTMART_PRODUCT_ID. Nunca registrar e-mail nem corpo. */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { lerEvento, tokenValido } from './logic.ts';

function responder(status: number, corpo: Record<string, unknown>) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return responder(405, { erro: 'metodo' });

  if (!tokenValido(req.headers.get('x-hotmart-hottok'), Deno.env.get('HOTMART_HOTTOK'))) {
    return responder(401, { erro: 'token' });
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return responder(400, { erro: 'json' });
  }

  /* 200 nos casos ignorados: a Hotmart repete a entrega enquanto receber erro. */
  const ev = lerEvento(corpo);
  if (!ev) return responder(200, { ignorado: 'formato' });
  if (ev.produtoId !== Deno.env.get('HOTMART_PRODUCT_ID')) {
    return responder(200, { ignorado: 'produto' });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );
  const { data, error } = await supabase.rpc('hotmart_processar_evento', {
    p_transacao: ev.transacao,
    p_evento: ev.evento,
    p_email: ev.email,
    p_nome: ev.nome,
    p_produto_id: ev.produtoId,
  });

  /* 5xx só para falha transitória: assim a Hotmart tenta de novo. */
  if (error) {
    console.error('hotmart-webhook: falha no banco', ev.evento, ev.transacao, error.code);
    return responder(500, { erro: 'banco' });
  }

  console.log('hotmart-webhook', ev.evento, ev.transacao, data);
  return responder(200, { resultado: data });
});
