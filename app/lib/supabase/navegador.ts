'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_KEY, SUPABASE_URL } from './config';

/** Cliente do lado do aluno. Só usado para iniciar o login com o Google. */
export function clienteNavegador() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
