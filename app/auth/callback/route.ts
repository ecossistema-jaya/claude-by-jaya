import { NextRequest, NextResponse } from 'next/server';
import { buscarAluno, TABELA_ACESSOS } from '@/app/lib/aluno';
import { clienteServidor } from '@/app/lib/supabase/servidor';

/* Volta do Google. É aqui que a autorização é decidida pela primeira vez:
   ter conta Google não basta, é preciso estar na allowlist. Quem não está sai
   da sessão no mesmo instante, antes de conseguir ver qualquer aula. */

export async function GET(req: NextRequest) {
  const { origin, searchParams } = req.nextUrl;
  const code = searchParams.get('code');

  if (!code || searchParams.get('error')) {
    return NextResponse.redirect(new URL('/login?erro=google', origin));
  }

  const supabase = await clienteServidor();

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL('/login?erro=google', origin));
  }

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;
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

  return NextResponse.redirect(new URL('/claude-do-zero', origin));
}
