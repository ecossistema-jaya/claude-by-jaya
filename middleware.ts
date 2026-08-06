import { NextRequest, NextResponse } from 'next/server';
import { COOKIE, verify } from '@/app/lib/auth';

export async function middleware(req: NextRequest) {
  const senha = process.env.CURSO_SENHA;
  if (!senha) {
    return new NextResponse('CURSO_SENHA não configurada no servidor.', { status: 500 });
  }

  if (await verify(req.cookies.get(COOKIE)?.value, senha)) {
    return NextResponse.next();
  }

  // A API responde 401; o resto vai para o login.
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'nao-autenticado' }, { status: 401 });
  }
  return NextResponse.redirect(new URL('/login', req.url));
}

/* Protege TUDO menos o login e os assets que a própria tela de login precisa.
   Os HTML em /aulas e as imagens em /img passam por aqui de propósito — a
   única exceção é a arte de fundo do login, que precisa carregar antes de o
   aluno ter cookie, senão a tela de senha aparece sem imagem. */
export const config = {
  matcher: [
    '/((?!login|api/login|img/login\\.webp|_next/static|_next/image|_vercel|favicon.ico).*)',
  ],
};
