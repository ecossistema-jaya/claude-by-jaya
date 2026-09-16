/* Portaria da Zona de Genialidade.

   Cada dashboard dispara quatro chamadas ao Gemini. O assessment exige sessão
   Google e convite, e este segundo cookie registra o consentimento para a captura
   do e-mail antes de liberar o consumo da análise.

   A troca é esta: a pessoa deixa o e-mail antes de a análise começar, o servidor
   emite este cookie assinado, e só quem tem o cookie gasta cota. O e-mail vira lead
   e o custo vira consentido — dois problemas com uma porta só.

   O e-mail e o id do usuário NÃO viajam no cookie, só os resumos. Assim o cookie
   só vale para a mesma conta que consentiu, sem carregar dados pessoais no
   navegador nem em log de proxy. */

export const COOKIE_LEAD = 'zg_lead';
export const COOKIE_LEAD_ZONA = 'zg_lead_zona';

/* 24 horas: cobre a análise inteira com folga e ainda deixa a pessoa voltar ao
   dashboard no mesmo dia sem repetir o formulário. O teto por IP de
   app/lib/gemini.ts continua valendo, então o cookie não é cheque em branco. */
export const LEAD_MAX_AGE = 60 * 60 * 24;

const enc = new TextEncoder();

function base64url(bytes: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function resumo(texto: string) {
  return base64url(await crypto.subtle.digest('SHA-256', enc.encode(texto)));
}

async function assinar(payload: string, secret: string) {
  const chave = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return base64url(await crypto.subtle.sign('HMAC', chave, enc.encode(payload)));
}

/** O e-mail chega como a pessoa digitou; tudo é comparado e gravado em minúsculas. */
export function normalizarEmail(email: string | null | undefined) {
  return (email ?? '').trim().toLowerCase();
}

/* Validação deliberadamente frouxa. A checagem que importa é a pessoa receber (ou
   não) o que for mandado para lá depois; regex ambiciosa de e-mail rejeita endereço
   válido e não impede endereço falso. Aqui só barra o que nem parece e-mail. */
export function emailPlausivel(email: string) {
  return /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

/** Cookie legado das superfícies públicas: "expiraEm.resumoDoEmail.assinatura". */
export async function emitirLead(email: string, secret: string) {
  const exp = String(Date.now() + LEAD_MAX_AGE * 1000);
  const emailId = await resumo(normalizarEmail(email));
  return `${exp}.${emailId}.${await assinar(`${exp}:${emailId}`, secret)}`;
}

/** Cookie da Zona: inclui a conta autenticada que deu o consentimento. */
export async function emitirLeadVinculado(email: string, userId: string, secret: string) {
  const exp = String(Date.now() + LEAD_MAX_AGE * 1000);
  const emailId = await resumo(normalizarEmail(email));
  const userIdHash = await resumo(userId);
  const payload = `${exp}:${emailId}:${userIdHash}`;
  return `${exp}.${emailId}.${userIdHash}.${await assinar(payload, secret)}`;
}

/** Confere o cookie legado. Nunca lança. */
export async function conferirLead(token: string | undefined, secret: string) {
  if (!token) return false;

  const [exp, emailId, sig] = token.split('.');
  if (!exp || !emailId || !sig) return false;
  if (!Number(exp) || Number(exp) < Date.now()) return false;

  return (await assinar(`${exp}:${emailId}`, secret)) === sig;
}

/** Confere validade, assinatura e vínculo da Zona com a sessão atual. */
export async function conferirLeadVinculado(
  token: string | undefined,
  userId: string,
  secret: string,
) {
  if (!token) return false;

  const [exp, emailId, userIdHash, sig] = token.split('.');
  if (!exp || !emailId || !userIdHash || !sig) return false;
  if (!Number(exp) || Number(exp) < Date.now()) return false;
  if ((await resumo(userId)) !== userIdHash) return false;

  return (await assinar(`${exp}:${emailId}:${userIdHash}`, secret)) === sig;
}

/** Opções do cookie, para não divergirem entre as rotas que o emitem. */
export function opcoesCookieLead() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: LEAD_MAX_AGE,
  };
}
