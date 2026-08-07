'use server';

import { revalidatePath } from 'next/cache';
import { normalizarEmail, TABELA_ALUNOS } from '@/app/lib/aluno';
import { clienteServidor } from '@/app/lib/supabase/servidor';

export type Resultado = { erro?: string; ok?: string };

/* As políticas de alunos_claude só deixam um admin escrever, então o banco é a
   última palavra mesmo que alguém chame estas ações por fora da tela. O que
   estas funções acrescentam é a mensagem legível de volta para a tela. */

export async function adicionarAluno(_estado: Resultado, form: FormData): Promise<Resultado> {
  const email = normalizarEmail(String(form.get('email') ?? ''));
  const nome = String(form.get('nome') ?? '').trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { erro: 'Email inválido.' };
  }

  const supabase = await clienteServidor();
  const { data: usuario } = await supabase.auth.getUser();

  const { error } = await supabase.from(TABELA_ALUNOS).insert({
    email,
    nome: nome || null,
    criado_por: usuario.user?.email ?? null,
  });

  if (error) {
    return {
      erro:
        error.code === '23505'
          ? 'Esse email já está na lista.'
          : 'Não consegui salvar. Confira se você continua logada como admin.',
    };
  }

  revalidatePath('/admin');
  return { ok: `${email} liberado.` };
}

export async function alternarAtivo(form: FormData) {
  const id = String(form.get('id') ?? '');
  const ativo = String(form.get('ativo') ?? '') === 'true';

  const supabase = await clienteServidor();
  await supabase.from(TABELA_ALUNOS).update({ ativo: !ativo }).eq('id', id);

  revalidatePath('/admin');
}

export async function removerAluno(form: FormData) {
  const id = String(form.get('id') ?? '');

  const supabase = await clienteServidor();
  await supabase.from(TABELA_ALUNOS).delete().eq('id', id);

  revalidatePath('/admin');
}
