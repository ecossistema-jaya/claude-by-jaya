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

/* Protege TUDO menos o login e o que precisa ser lido sem cookie:
   - img/login.webp: a arte de fundo da própria tela de senha;
   - img/og.jpg: a prévia dos links; os robôs do WhatsApp, Facebook e afins
     nunca têm cookie, então uma imagem protegida vira link sem imagem.
   Os HTML em /aulas e todas as outras imagens seguem fechados. */
export const config = {
  matcher: [
    '/((?!login|api/login|img/login\\.webp|img/og\\.jpg|_next/static|_next/image|_vercel|favicon.ico).*)',
  ],
};
