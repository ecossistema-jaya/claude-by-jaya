/* Webhook da Hotmart: confirma o pagamento e libera (ou retira) o acesso. Cada
   produto tem o seu destino: o Claude do Zero grava em `alunos_claude` e o Tarot
   da Jaya em `acessos_tarot` (12 meses). Publicada com verify_jwt desligado, porque
   a Hotmart não manda JWT do Supabase: o único portão é o hottok, então esta
   função fica mínima. As regras de concessão moram em
   public.hotmart_processar_evento (curso, migração 20261009120000) e em
   public.hotmart_processar_evento_tarot (migração 20261015120000).
   Segredos: HOTMART_HOTTOK, HOTMART_PRODUCT_ID, HOTMART_PRODUCT_ID_TAROT.
   Nunca registrar e-mail nem corpo. */
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { destinoDoProduto, lerEvento, tokenValido } from './logic.ts';

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
  const destino = destinoDoProduto(ev.produtoId, {
    curso: Deno.env.get('HOTMART_PRODUCT_ID'),
    tarot: Deno.env.get('HOTMART_PRODUCT_ID_TAROT'),
  });
  if (!destino) return responder(200, { ignorado: 'produto' });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );
  const funcao = destino === 'tarot' ? 'hotmart_processar_evento_tarot' : 'hotmart_processar_evento';
  const { data, error } = await supabase.rpc(funcao, {
    p_transacao: ev.transacao,
    p_evento: ev.evento,
    p_email: ev.email,
    p_nome: ev.nome,
    p_produto_id: ev.produtoId,
  });

  /* 5xx só para falha transitória: assim a Hotmart tenta de novo. */
  if (error) {
    console.error('hotmart-webhook: falha no banco', destino, ev.evento, ev.transacao, error.code);
    return responder(500, { erro: 'banco' });
  }

  console.log('hotmart-webhook', destino, ev.evento, ev.transacao, data);
  return responder(200, { resultado: data });
});
