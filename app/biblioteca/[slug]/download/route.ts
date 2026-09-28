import { guides } from '../../content';
import { toMarkdown } from '../../markdown';
import { exigirAcessoBiblioteca } from '@/app/lib/exigir-acesso-produto';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { resposta } = await exigirAcessoBiblioteca();
  if (resposta) return resposta;

  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) {
    return new Response('Guia não encontrado.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(toMarkdown(guide), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${guide.slug}.md"`,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
