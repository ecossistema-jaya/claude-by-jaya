import { NextRequest, NextResponse } from 'next/server';
import { buscarAluno, TABELA_ACESSOS } from '@/app/lib/aluno';
import {
  buscarAcessoProduto,
  PRODUTO_CONSCIENCIA,
  PRODUTO_ZONA,
} from '@/app/lib/acesso-produto';
import {
  destinoEhConsciencia,
  destinoEhZona,
  normalizarDestinoLogin,
} from '@/app/lib/destino-login';
import { clienteServidor } from '@/app/lib/supabase/servidor';

/* Volta do Google. É aqui que a autorização é decidida pela primeira vez:
   ter conta Google não basta, é preciso estar na allowlist. Quem não está sai
   da sessão no mesmo instante, antes de conseguir ver qualquer aula. */

export async function GET(req: NextRequest) {
  const { origin, searchParams } = req.nextUrl;
  const code = searchParams.get('code');
  const destino = normalizarDestinoLogin(searchParams.get('next'));

  if (!code || searchParams.get('error')) {
    return NextResponse.redirect(loginComErro(origin, destino));
  }

  const supabase = await clienteServidor();

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(loginComErro(origin, destino));
  }

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;

  if (destinoEhConsciencia(destino)) {
    const acesso = email
      ? await buscarAcessoProduto(supabase, email, PRODUTO_CONSCIENCIA)
      : null;
    if (!acesso) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/sem-acesso?produto=consciencia', origin));
    }
    return NextResponse.redirect(new URL(destino, origin));
  }

  if (destinoEhZona(destino)) {
    const acesso = email ? await buscarAcessoProduto(supabase, email, PRODUTO_ZONA) : null;
    if (!acesso) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/sem-acesso?produto=zona', origin));
    }

    return NextResponse.redirect(new URL(destino, origin));
  }

  const aluno = email ? await buscarAluno(supabase, email) : null;

  if (!aluno) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/sem-acesso', origin));
  }

  /* Registro de entrada. Falhar aqui não pode barrar a aula, então o erro é
     ignorado de propósito. */
  await supabase.from(TABELA_ACESSOS).insert({
    aluno_id: aluno.id,
    email: aluno.email,
    user_agent: req.headers.get('user-agent'),
  });

  return NextResponse.redirect(new URL(destino, origin));
}

function loginComErro(origin: string, destino: string) {
  const url = new URL('/login', origin);
  url.searchParams.set('erro', 'google');
  url.searchParams.set('next', destino);
  return url;
}
