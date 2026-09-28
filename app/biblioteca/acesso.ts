import { redirect } from 'next/navigation';
import { exigirAcessoBiblioteca } from '@/app/lib/exigir-acesso-produto';

/* Portaria das páginas da biblioteca. Fica em cada página, e não no layout,
   porque o layout não roda de novo em toda requisição de segmento. Quem não
   tem sessão vai a /biblioteca/entrar e volta para o mesmo guia; quem tem
   sessão sem convite vai para /biblioteca/sem-acesso. */
export async function exigirLeitor(destino: string) {
  const { resposta } = await exigirAcessoBiblioteca();
  if (resposta?.status === 401) redirect(`/biblioteca/entrar?next=${encodeURIComponent(destino)}`);
  if (resposta) redirect('/biblioteca/sem-acesso');
}
