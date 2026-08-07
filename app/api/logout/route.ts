import { NextResponse } from 'next/server';
import { COOKIE_ACESSO } from '@/app/lib/auth';
import { clienteServidor } from '@/app/lib/supabase/servidor';

export async function POST() {
  const supabase = await clienteServidor();
  await supabase.auth.signOut();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ACESSO, '', { path: '/', maxAge: 0 });
  return res;
}
