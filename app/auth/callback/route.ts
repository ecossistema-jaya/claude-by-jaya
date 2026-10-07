import { NextRequest, NextResponse } from 'next/server';
import { autorizarEntrada } from '@/app/lib/autorizar-entrada';
import { destinoEhBiblioteca, normalizarDestinoLogin } from '@/app/lib/destino-login';
import { clienteServidor } from '@/app/lib/supabase/servidor';

/* Volta do Google. É aqui que a autorização é decidida pela primeira vez:
   ter conta Google não basta, é preciso estar na allowlist. Quem não está sai
   da sessão no mesmo instante, antes de conseguir ver qualquer aula. A regra
   de cada porta mora em app/lib/autorizar-entrada.ts, compartilhada com a
   entrada por código no e-mail. */

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

  const para = await autorizarEntrada(supabase, destino, req.headers.get('user-agent'));
  return NextResponse.redirect(new URL(para, origin));
}

function loginComErro(origin: string, destino: string) {
  const url = new URL(destinoEhBiblioteca(destino) ? '/biblioteca/entrar' : '/login', origin);
  url.searchParams.set('erro', 'google');
  url.searchParams.set('next', destino);
  return url;
}
