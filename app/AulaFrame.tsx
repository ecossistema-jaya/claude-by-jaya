'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const AULAS = [
  'Conversar com o Claude',
  'Botar o Claude pra trabalhar',
  'Documento Mestre',
  'Psicometria e Zona de Genialidade',
  'Landing Page com Identidade Visual',
];

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
  courseNumber,
}: {
  src: string;
  titulo: string;
  deck?: boolean;
  courseNumber?: number;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [frameHeight, setFrameHeight] = useState('100vh');

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

  useEffect(() => () => resizeObserverRef.current?.disconnect(), []);

  function fitCourseFrame() {
    if (!courseNumber) return;
    const doc = ref.current?.contentDocument;
    if (!doc) return;
    const courseDoc = doc;

    function updateHeight() {
      const height = Math.max(
        courseDoc.documentElement.scrollHeight,
        courseDoc.body.scrollHeight,
        720,
      );
      setFrameHeight(`${height}px`);
    }

    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = new ResizeObserver(updateHeight);
    resizeObserverRef.current.observe(courseDoc.documentElement);
    resizeObserverRef.current.observe(courseDoc.body);
    updateHeight();
  }

  if (courseNumber) {
    return (
      <div className="course-page">
        <header className="course-topbar">
          <Link href="/" className="course-brand" aria-label="Voltar ao índice do curso">
            <small>Curso</small>
            Claude do Zero
          </Link>
          <div className="course-position">
            Aula {String(courseNumber).padStart(2, '0')} de {AULAS.length}
          </div>
          <Link href="/" className="course-index-link">
            Ver todas as aulas
          </Link>
        </header>

        <div className="course-layout">
          <aside className="course-rail" aria-label="Aulas do curso">
            <p className="course-eyebrow">Seu percurso</p>
            <div className="course-progress-copy">
              <span>{courseNumber} de {AULAS.length} aulas</span>
              <span>{Math.round((courseNumber / AULAS.length) * 100)}%</span>
            </div>
            <div className="course-progress-track" aria-hidden="true">
              <span style={{ width: `${(courseNumber / AULAS.length) * 100}%` }} />
            </div>
            <nav>
              {AULAS.map((title, index) => {
                const number = index + 1;
                return (
                  <Link
                    key={title}
                    href={`/aula-${number}`}
                    className={number === courseNumber ? 'course-nav-item current' : 'course-nav-item'}
                    aria-current={number === courseNumber ? 'page' : undefined}
                  >
                    <span>{String(number).padStart(2, '0')}</span>
                    <strong>{title}</strong>
                  </Link>
                );
              })}
            </nav>
            <div className="course-bonus-nav" aria-label="Bônus e materiais">
              <p>Bônus e materiais</p>
              <Link href="/aula-3" className="course-bonus-link">
                <span aria-hidden="true">✦</span>
                <strong>Minha Personalidade<small>Disponível na Aula 3</small></strong>
              </Link>
              <Link href="/recursos" className="course-bonus-link">
                <span aria-hidden="true">✦</span>
                <strong>8 recursos do Claude<small>Manual de trabalho</small></strong>
              </Link>
              <Link href="/guia-7-agentes" className="course-bonus-link">
                <span aria-hidden="true">✦</span>
                <strong>7 agentes que fazem conteúdo<small>Guia bônus</small></strong>
              </Link>
            </div>
            <div className="course-rail-note">
              <strong>Aula {String(courseNumber).padStart(2, '0')} aberta</strong>
              Você pode trocar de aula sem voltar ao índice.
            </div>
          </aside>

          <main className="course-main course-legacy-main">
            <iframe
              ref={ref}
              className="course-legacy-frame"
              src={src}
              title={titulo}
              style={{ height: frameHeight }}
              onLoad={fitCourseFrame}
            />
            {courseNumber === 5 && (
              <section className="course-finish" aria-labelledby="course-finish-title">
                <p className="course-eyebrow">Trilha principal concluída</p>
                <h2 id="course-finish-title">Continue com os bônus e materiais.</h2>
                <p>
                  Reforce sua personalização e consulte os recursos do Claude quando precisar
                  transformar uma conversa em trabalho pronto.
                </p>
                <div>
                  <Link href="/aula-3">Minha Personalidade <span aria-hidden="true">→</span></Link>
                  <Link href="/recursos">8 recursos do Claude <span aria-hidden="true">→</span></Link>
                  <Link href="/guia-7-agentes">7 agentes que fazem conteúdo <span aria-hidden="true">→</span></Link>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    );
  }

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
