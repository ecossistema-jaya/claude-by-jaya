'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { normalizarEmail } from '@/app/lib/aluno';
import { autorizarEntrada } from '@/app/lib/autorizar-entrada';
import { DESTINO_CURSO } from '@/app/lib/destino-login';
import { clienteServidor } from '@/app/lib/supabase/servidor';

/* Entrada sem Google no curso Claude do Zero: o Supabase manda um código de 6
   dígitos para o e-mail e a pessoa digita na mesma aba. Código e não link
   porque, no celular, o link abre no navegador do app de e-mail, longe da
   sessão que pediu, e a entrada falha.

   Não há consulta à lista antes de mandar o código: quem não está nela recebe,
   digita e cai em sem-acesso, igual a uma conta Google sem convite. A decisão
   de autorização é a mesma do Google, em app/lib/autorizar-entrada.ts.

   O destino é fixo no curso de propósito: Zona, Consciência e biblioteca
   continuam só com Google, e uma chamada direta à action não muda isso. */

export type RespostaCodigo = { ok: true } | { ok: false; erro: string };

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODIGO_VALIDO = /^\d{6,10}$/;

export async function pedirCodigo(emailBruto: string): Promise<RespostaCodigo> {
  const email = normalizarEmail(emailBruto);
  if (!EMAIL_VALIDO.test(email)) {
    return { ok: false, erro: 'Confira o e-mail: parece que falta alguma parte.' };
  }

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    console.error('falha ao pedir código de entrada', error.code, error.message);
    if (error.status === 429) {
      return { ok: false, erro: 'Muitos pedidos seguidos. Espere um minuto e tente de novo.' };
    }
    return { ok: false, erro: 'Não consegui mandar o código agora. Tente de novo.' };
  }

  return { ok: true };
}

export async function verificarCodigo(
  emailBruto: string,
  codigoBruto: string,
): Promise<RespostaCodigo> {
  const email = normalizarEmail(emailBruto);
  const codigo = codigoBruto.replace(/\D/g, '');

  if (!EMAIL_VALIDO.test(email) || !CODIGO_VALIDO.test(codigo)) {
    return { ok: false, erro: 'Digite o código que chegou no e-mail.' };
  }

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.verifyOtp({ email, token: codigo, type: 'email' });

  if (error) {
    if (error.status === 429) {
      return { ok: false, erro: 'Muitas tentativas. Espere um minuto e tente de novo.' };
    }
    return { ok: false, erro: 'Código errado ou vencido. Confira ou peça um novo.' };
  }

  const userAgent = (await headers()).get('user-agent');
  redirect(await autorizarEntrada(supabase, DESTINO_CURSO, userAgent));
}
