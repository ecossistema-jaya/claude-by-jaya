import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { DESTINO_CONSCIENCIA } from '@/app/lib/destino-login';
import { exigirAcessoConsciencia } from '@/app/lib/exigir-acesso-produto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MARCADOR_CONTEXTO = '/*__AUTH_CONTEXT__*/null/*__/AUTH_CONTEXT__*/';

export async function GET(req: NextRequest) {
  const { resposta, email, userId } = await exigirAcessoConsciencia();
  if (resposta) {
    if (resposta.status === 403) {
      return NextResponse.redirect(new URL('/sem-acesso?produto=consciencia', req.url));
    }
    const login = new URL('/login', req.url);
    login.searchParams.set('next', DESTINO_CONSCIENCIA);
    return NextResponse.redirect(login);
  }

  const arquivo = path.join(process.cwd(), 'protected', 'consciencia', 'index.html');
  const original = await fs.readFile(arquivo, 'utf8');
  if (!original.includes(MARCADOR_CONTEXTO)) {
    return new NextResponse('Questionário protegido inválido.', { status: 500 });
  }

  const contexto = JSON.stringify({ email, userId }).replace(/</g, '\\u003c');
  const html = original.replace(MARCADOR_CONTEXTO, contexto);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex',
    },
  });
}
