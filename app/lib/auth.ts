/* Cookie de autorização — o atalho que evita ir ao banco a cada requisição.

   Quem diz se a pessoa entrou é o Supabase; quem diz se ela PODE entrar é a
   tabela alunos_claude. Consultar essa tabela a cada imagem e a cada HTML de
   aula seria caro, então, depois de confirmar uma vez, o servidor emite este
   cookie curto e passa a confiar nele até expirar.

   A assinatura cobre o access_token da sessão, não o email: assim o cookie só
   vale para a sessão exata que o originou. Um token de sessão adulterado não
   bate com a assinatura, e uma assinatura copiada não serve para outra sessão. */

export const COOKIE_ACESSO = 'acesso';

/* Dez minutos: curto o bastante para que desativar um aluno tenha efeito quase
   imediato, longo o bastante para cobrir a leitura de uma aula inteira. */
export const ACESSO_MAX_AGE = 60 * 10;

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

/** Emite um token "expiraEm.assinatura" preso ao access_token informado. */
export async function emitirAcesso(accessToken: string, secret: string) {
  const exp = String(Date.now() + ACESSO_MAX_AGE * 1000);
  return `${exp}.${await assinar(`${exp}:${await resumo(accessToken)}`, secret)}`;
}

/** Confere validade, assinatura e vínculo com a sessão atual. Nunca lança. */
export async function conferirAcesso(
  token: string | undefined,
  accessToken: string | undefined,
  secret: string,
) {
  if (!token || !accessToken) return false;

  const [exp, sig] = token.split('.');
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;

  return (await assinar(`${exp}:${await resumo(accessToken)}`, secret)) === sig;
}
