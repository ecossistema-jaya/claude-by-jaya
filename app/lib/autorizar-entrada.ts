import { buscarAluno, TABELA_ACESSOS } from '@/app/lib/aluno';
import {
  buscarAcessoProduto,
  PRODUTO_CONSCIENCIA,
  PRODUTO_ZONA,
} from '@/app/lib/acesso-produto';
import {
  destinoEhBiblioteca,
  destinoEhConsciencia,
  destinoEhZona,
} from '@/app/lib/destino-login';
import { temAcessoBiblioteca } from '@/app/lib/exigir-acesso-produto';
import type { clienteServidor } from '@/app/lib/supabase/servidor';

type Supabase = Awaited<ReturnType<typeof clienteServidor>>;

/* A decisão "pode entrar por esta porta?" depois que a pessoa já provou quem é,
   seja pelo Google, seja pelo código no e-mail. Fica num lugar só para que os
   dois caminhos nunca divirjam: ter sessão não basta, é preciso estar na lista
   da porta pedida. Quem não está sai da sessão no mesmo instante.

   Devolve o caminho para onde mandar a pessoa. */
export async function autorizarEntrada(
  supabase: Supabase,
  destino: string,
  userAgent: string | null,
): Promise<string> {
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;

  if (destinoEhBiblioteca(destino)) {
    if (!email || !(await temAcessoBiblioteca(supabase, email))) {
      await supabase.auth.signOut();
      return '/biblioteca/sem-acesso';
    }
    return destino;
  }

  if (destinoEhConsciencia(destino)) {
    const acesso = email
      ? await buscarAcessoProduto(supabase, email, PRODUTO_CONSCIENCIA)
      : null;
    if (!acesso) {
      await supabase.auth.signOut();
      return '/sem-acesso?produto=consciencia';
    }
    return destino;
  }

  if (destinoEhZona(destino)) {
    const acesso = email ? await buscarAcessoProduto(supabase, email, PRODUTO_ZONA) : null;
    if (!acesso) {
      await supabase.auth.signOut();
      return '/sem-acesso?produto=zona';
    }
    return destino;
  }

  const aluno = email ? await buscarAluno(supabase, email) : null;

  if (!aluno) {
    await supabase.auth.signOut();
    return '/sem-acesso';
  }

  /* Registro de entrada. Falhar aqui não pode barrar a aula, então o erro é
     ignorado de propósito. */
  await supabase.from(TABELA_ACESSOS).insert({
    aluno_id: aluno.id,
    email: aluno.email,
    user_agent: userAgent,
  });

  return destino;
}
