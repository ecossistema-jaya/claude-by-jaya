'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

/* O iframe é same-origin, então clipboard, localStorage e download funcionam
   normalmente dentro dele.

   O teclado é o ponto delicado: focar o iframe por código não faz o Chrome
   rotear as setas para dentro dele enquanto o aluno não clicar na página. Sem
   isso o deck não navega por teclado logo que abre. A solução é reencaminhar:
   o que chega no documento externo é redisparado dentro do iframe. Não há eco
   — eventos de teclado não atravessam a fronteira do iframe, então quando o
   foco já está lá dentro este listener nem roda. */
export default function AulaFrame({
  src,
  titulo,
  deck = false,
}: {
  src: string;
  titulo: string;
  deck?: boolean;
}) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!deck) return;
    const TECLAS = ['ArrowRight', 'ArrowLeft', ' ', 'PageUp', 'PageDown'];

    function repassa(e: KeyboardEvent) {
      if (!TECLAS.includes(e.key)) return;
      const doc = ref.current?.contentDocument;
      if (!doc) return;
      e.preventDefault();
      doc.dispatchEvent(new KeyboardEvent('keydown', { key: e.key, bubbles: true }));
    }

    window.addEventListener('keydown', repassa);
    return () => window.removeEventListener('keydown', repassa);
  }, [deck]);

  return (
    <>
      <Link href="/" className="voltar">
        ← índice
      </Link>
      {/* sem focus() programático no iframe: com ele o Chrome engole as setas
          (o iframe vira activeElement mas o documento interno não recebe o
          teclado). Deixando o foco no documento externo, o repasse acima
          sempre funciona; e se o aluno clicar dentro, o deck escuta direto. */}
      <iframe ref={ref} className="frame" src={src} title={titulo} />
    </>
  );
}
