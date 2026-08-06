/* Cookie de sessão assinado com HMAC-SHA256. A chave é a própria CURSO_SENHA:
   trocar a senha invalida todos os cookies já emitidos, que é o que se quer. */

export const COOKIE = 'curso';
export const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

const enc = new TextEncoder();

async function key(secret: string) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
}

async function sign(payload: string, secret: string) {
  const sig = await crypto.subtle.sign('HMAC', await key(secret), enc.encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Emite um token "expiraEm.assinatura". */
export async function issue(secret: string) {
  const exp = String(Date.now() + MAX_AGE * 1000);
  return `${exp}.${await sign(exp, secret)}`;
}

/** Confere assinatura e validade. Nunca lança. */
export async function verify(token: string | undefined, secret: string) {
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  return (await sign(exp, secret)) === sig;
}
