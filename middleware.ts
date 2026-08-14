import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_ACESSO, ACESSO_MAX_AGE, conferirAcesso, emitirAcesso } from '@/app/lib/auth';
import { buscarAluno } from '@/app/lib/aluno';
import { SUPABASE_KEY, SUPABASE_URL } from '@/app/lib/supabase/config';

/* Duas perguntas diferentes, respondidas em ordem:
   1. quem é você?    -> sessão do Supabase, criada pelo login com o Google;
   2. você pode?      -> uma linha ativa em alunos_claude.

   A segunda pergunta custa uma ida ao banco, e o middleware roda para cada
   imagem e cada HTML de aula. Por isso a resposta fica dez minutos guardada no
   cookie assinado de app/lib/auth.ts. */

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return new NextResponse('AUTH_SECRET não configurada no servidor.', { status: 500 });
  }

  const res = NextResponse.next({ request: req });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (lista) => {
        lista.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  /* getSession só lê e renova o cookie, sem ida à rede. Serve para saber se há
     sessão e para amarrar o cookie de autorização a ela — a validação de
     verdade fica com getUser(), logo abaixo. */
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (!accessToken) {
    return paraLogin(req, res);
  }

  if (await conferirAcesso(req.cookies.get(COOKIE_ACESSO)?.value, accessToken, secret)) {
    return res;
  }

  const { data: usuario } = await supabase.auth.getUser();
  const email = usuario.user?.email;
  if (!email) {
    return paraLogin(req, res);
  }

  if (!(await buscarAluno(supabase, email))) {
    await supabase.auth.signOut();
    return redirecionar(req, res, '/sem-acesso');
  }

  res.cookies.set(COOKIE_ACESSO, await emitirAcesso(accessToken, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ACESSO_MAX_AGE,
  });
  return res;
}

/** A API responde 401; o resto vai para o login. */
function paraLogin(req: NextRequest, res: NextResponse) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return herdarCookies(NextResponse.json({ error: 'nao-autenticado' }, { status: 401 }), res);
  }
  return redirecionar(req, res, '/login');
}

function redirecionar(req: NextRequest, res: NextResponse, destino: string) {
  return herdarCookies(NextResponse.redirect(new URL(destino, req.url)), res);
}

/* O cliente do Supabase escreve os cookies renovados (ou limpos, no signOut) na
   resposta original. Ao trocá-la por um redirect, esses cookies precisam vir
   junto, senão a sessão renovada se perde e o aluno volta para o login. */
function herdarCookies(destino: NextResponse, origem: NextResponse) {
  origem.cookies.getAll().forEach((cookie) => destino.cookies.set(cookie));
  return destino;
}

/* Protege TUDO menos o que precisa ser lido sem sessão:
   - login, auth/callback e sem-acesso: as próprias telas da porta de entrada;
   - img/login.webp: a arte de fundo da tela de login;
   - icones/claude.svg: os asteriscos que flutuam atrás dessa mesma tela — quem
     está no login ainda não tem cookie, então o asset protegido virava um 307
     para /login e a animação ficava invisível;
   - img/og.jpg: a prévia dos links; os robôs do WhatsApp, Facebook e afins
     nunca têm cookie, então uma imagem protegida vira link sem imagem;
   - zona-de-genialidade e zona/: a única superfície pública do projeto. Quem chega
     nela não é aluno e não pode ser mandado para o login;
   - api/zona/: as rotas que essa página chama. Não ficam sem portaria — trocam a
     sessão de aluno por uma autorização própria, o cookie assinado de
     app/lib/lead.ts, conferida dentro do próprio handler. Ficam separadas de
     /api/analyze de propósito: handler com dois modos de autenticação é onde erro
     de autorização nasce, e o caminho do aluno continua exatamente como está.
   Os HTML em /aulas e todas as outras imagens seguem fechados. */
export const config = {
  matcher: [
    '/((?!login|auth/callback|sem-acesso|zona-de-genialidade|zona/|api/zona/|img/login\\.webp|icones/claude\\.svg|img/og\\.jpg|_next/static|_next/image|_vercel|favicon.ico).*)',
  ],
};
