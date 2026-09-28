import { NextResponse } from 'next/server';
import { COOKIE_ACESSO } from '@/app/lib/auth';
import { clienteServidor } from '@/app/lib/supabase/servidor';

/* Saída própria da biblioteca. /api/logout passa pela portaria do curso, que
   barra quem só tem convite da biblioteca; esta rota fica sob /biblioteca, fora
   daquele middleware. POST pelo mesmo motivo de /api/logout: prefetch e
   scanners de links não derrubam a sessão. */
export async function POST(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin) {
    return NextResponse.json({ error: 'origem' }, { status: 403 });
  }

  const supabase = await clienteServidor();
  await supabase.auth.signOut();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ACESSO, '', { path: '/', maxAge: 0 });
  return res;
}
