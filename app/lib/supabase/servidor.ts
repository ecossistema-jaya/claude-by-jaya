import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_KEY, SUPABASE_URL } from './config';

/** Cliente para Server Components, Server Actions e Route Handlers. */
export async function clienteServidor() {
  const pote = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => pote.getAll(),
      setAll: (lista) => {
        /* Server Component não pode escrever cookie. Ignorar é seguro porque o
           middleware já renovou a sessão antes desta renderização. */
        try {
          lista.forEach(({ name, value, options }) => pote.set(name, value, options));
        } catch {
          /* renderização — nada a fazer */
        }
      },
    },
  });
}
