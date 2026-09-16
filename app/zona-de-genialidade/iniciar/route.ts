import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { DESTINO_ZONA } from '@/app/lib/destino-login';
import { exigirAcessoZona } from '@/app/lib/exigir-acesso-produto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { resposta } = await exigirAcessoZona();

  if (resposta?.status === 401) {
    const login = new URL('/login', req.url);
    login.searchParams.set('next', DESTINO_ZONA);
    return NextResponse.redirect(login);
  }
  if (resposta) {
    return NextResponse.redirect(new URL('/sem-acesso?produto=zona', req.url));
  }

  const arquivo = path.join(process.cwd(), 'protected', 'zona', 'index.html');
  const html = await fs.readFile(arquivo, 'utf8');

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
