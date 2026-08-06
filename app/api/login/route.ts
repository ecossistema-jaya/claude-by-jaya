import { NextResponse } from 'next/server';
import { COOKIE, MAX_AGE, issue } from '@/app/lib/auth';

export async function POST(req: Request) {
  const senha = process.env.CURSO_SENHA;
  if (!senha) return NextResponse.json({ error: 'servidor' }, { status: 500 });

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (password !== senha) return NextResponse.json({ error: 'senha' }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await issue(senha), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
  return res;
}
