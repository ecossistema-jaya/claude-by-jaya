import { NextResponse } from 'next/server';
import { buscarAcessoProduto, PRODUTO_ZONA } from '@/app/lib/acesso-produto';
import { clienteServidor } from '@/app/lib/supabase/servidor';

export async function exigirAcessoZona() {
  const supabase = await clienteServidor();
  const { data, error } = await supabase.auth.getUser();
  const email = data.user?.email;

  if (error || !email) {
    return {
      resposta: NextResponse.json({ error: 'login-necessario' }, { status: 401 }),
      supabase,
    };
  }

  const acesso = await buscarAcessoProduto(supabase, email, PRODUTO_ZONA);
  if (!acesso) {
    return {
      resposta: NextResponse.json({ error: 'convite-necessario' }, { status: 403 }),
      supabase,
    };
  }

  return { resposta: null, supabase, email, userId: data.user!.id, acesso };
}
