import { NextResponse } from 'next/server';
import { exigirAcessoZona } from '@/app/lib/exigir-acesso-produto';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { resposta, email, userId } = await exigirAcessoZona();
  return resposta ?? NextResponse.json({ ok: true, email, userId });
}
