import { NextResponse } from 'next/server';
import { buscarAluno } from '@/app/lib/aluno';
import {
  buscarAcessoProduto,
  PRODUTO_BIBLIOTECA,
  PRODUTO_CONSCIENCIA,
  PRODUTO_ZONA,
  type ProdutoComConvite,
} from '@/app/lib/acesso-produto';
import { clienteServidor } from '@/app/lib/supabase/servidor';

export async function exigirLogin() {
  const supabase = await clienteServidor();
  const { data, error } = await supabase.auth.getUser();
  const email = data.user?.email;

  if (error || !email) {
    return {
      resposta: NextResponse.json({ error: 'login-necessario' }, { status: 401 }),
      supabase,
    };
  }

  return { resposta: null, supabase, email, userId: data.user!.id };
}

export async function exigirAcessoProduto(produto: ProdutoComConvite) {
  const login = await exigirLogin();
  if (login.resposta) return login;

  const acesso = await buscarAcessoProduto(login.supabase, login.email!, produto);
  if (!acesso) {
    return {
      resposta: NextResponse.json({ error: 'convite-necessario' }, { status: 403 }),
      supabase: login.supabase,
    };
  }

  return { ...login, acesso };
}

export function exigirAcessoZona() {
  return exigirAcessoProduto(PRODUTO_ZONA);
}

export function exigirAcessoConsciencia() {
  return exigirAcessoProduto(PRODUTO_CONSCIENCIA);
}

/* A biblioteca tem duas portas: convite próprio no painel ou matrícula ativa no
   curso. Aluno do Claude do Zero não precisa de um segundo convite. */
export async function temAcessoBiblioteca(
  supabase: Awaited<ReturnType<typeof clienteServidor>>,
  email: string,
) {
  if (await buscarAluno(supabase, email)) return true;
  return !!(await buscarAcessoProduto(supabase, email, PRODUTO_BIBLIOTECA));
}

export async function exigirAcessoBiblioteca() {
  const login = await exigirLogin();
  if (login.resposta) return login;

  if (!(await temAcessoBiblioteca(login.supabase, login.email!))) {
    return {
      resposta: NextResponse.json({ error: 'convite-necessario' }, { status: 403 }),
      supabase: login.supabase,
    };
  }

  return login;
}
