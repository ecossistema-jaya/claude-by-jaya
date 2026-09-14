'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export type CourseLessonData = {
  number: number;
  title: string;
  description: string;
  headerImage: string;
  headerImageAlt: string;
  headerImageFocus: 'left' | 'right';
  slideSrc: string;
  slideTitle: string;
  duration: string;
  outcomes: Array<{ label: string; text: string }>;
  preparation: Array<{ title: string; text: string }>;
  conceptTitle: string;
  conceptIntro: string;
  concepts: Array<{ marker: string; title: string; text: string }>;
  example: { before: string; after: string };
  practiceTitle: string;
  practiceIntro: string;
  promptLabel: string;
  prompt: string;
  taskTitle: string;
  taskText: string;
  deliverable: string;
  success: Array<{ title: string; text: string }>;
  next: { href: string; number: number; title: string };
};

const LESSONS = [
  'Conversar com o Claude',
  'Botar o Claude pra trabalhar',
  'Documento Mestre',
  'Psicometria e Zona de Genialidade',
  'Landing Page com Identidade Visual',
];

function CourseBonusNav({ footer = false }: { footer?: boolean }) {
  return (
    <div
      className={footer ? 'course-bonus-nav course-bonus-footer' : 'course-bonus-nav'}
      aria-label="Bônus e materiais"
    >
      <p>Bônus e materiais</p>
      <Link href="/aula-3" className="course-bonus-link">
        <span aria-hidden="true">✦</span>
        <strong>Minha Personalidade<small>Disponível na Aula 3</small></strong>
      </Link>
      <Link href="/recursos" className="course-bonus-link">
        <span aria-hidden="true">✦</span>
        <strong>8 recursos do Claude<small>Manual de trabalho</small></strong>
      </Link>
    </div>
  );
}

export default function CourseLessonPage({ lesson }: { lesson: CourseLessonData }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const storageKey = `claude-do-zero:aula-${lesson.number}`;
  const totalChecks = lesson.preparation.length + lesson.success.length;
  const [checks, setChecks] = useState<boolean[]>(() => Array(totalChecks).fill(false));
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (Array.isArray(saved.checks) && saved.checks.length === totalChecks) setChecks(saved.checks);
      setCompleted(saved.completed === true);
    } catch {}
  }, [storageKey, totalChecks]);

  useEffect(() => {
    const keys = ['ArrowRight', 'ArrowLeft', ' ', 'PageUp', 'PageDown'];
    function forwardKey(event: KeyboardEvent) {
      if (!keys.includes(event.key)) return;
      const documentInsideFrame = frameRef.current?.contentDocument;
      if (!documentInsideFrame) return;
      event.preventDefault();
      documentInsideFrame.dispatchEvent(new KeyboardEvent('keydown', { key: event.key, bubbles: true }));
    }
    window.addEventListener('keydown', forwardKey);
    return () => window.removeEventListener('keydown', forwardKey);
  }, []);

  function saveProgress(nextChecks: boolean[], nextCompleted = completed) {
    setChecks(nextChecks);
    setCompleted(nextCompleted);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ checks: nextChecks, completed: nextCompleted }));
    } catch {}
  }

  function toggleCheck(index: number) {
    const next = checks.map((value, itemIndex) => (itemIndex === index ? !value : value));
    saveProgress(next);
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(lesson.prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function toggleCompleted() {
    saveProgress(checks, !completed);
  }

  const completedChecks = checks.filter(Boolean).length;

  return (
    <div className="course-page">
      <header className="course-topbar">
        <Link href="/" className="course-brand" aria-label="Voltar ao índice do curso">
          <small>Curso</small>
          Claude do Zero
        </Link>
        <div className="course-position">
          Aula {String(lesson.number).padStart(2, '0')} de {LESSONS.length}
        </div>
        <Link href="/" className="course-index-link">
          Ver todas as aulas
        </Link>
      </header>

      <div className="course-layout">
        <aside className="course-rail" aria-label="Aulas do curso">
          <p className="course-eyebrow">Seu percurso</p>
          <div className="course-progress-copy">
            <span>{lesson.number} de {LESSONS.length} aulas</span>
            <span>{Math.round((lesson.number / LESSONS.length) * 100)}%</span>
          </div>
          <div className="course-progress-track" aria-hidden="true">
            <span style={{ width: `${(lesson.number / LESSONS.length) * 100}%` }} />
          </div>
          <nav>
            {LESSONS.map((title, index) => {
              const number = index + 1;
              return (
                <Link
                  key={title}
                  href={`/aula-${number}`}
                  className={number === lesson.number ? 'course-nav-item current' : 'course-nav-item'}
                  aria-current={number === lesson.number ? 'page' : undefined}
                >
                  <span>{String(number).padStart(2, '0')}</span>
                  <strong>{title}</strong>
                </Link>
              );
            })}
          </nav>
          <CourseBonusNav />
          <div className="course-rail-note">
            <strong>{completedChecks}/{totalChecks} passos conferidos</strong>
            Seu progresso nesta aula fica salvo neste navegador.
          </div>
        </aside>

        <main className="course-main">
          <section className="course-hero">
            <div className={`course-hero-image focus-${lesson.headerImageFocus}`}>
              <img src={lesson.headerImage} alt={lesson.headerImageAlt} />
            </div>
            <p className="course-eyebrow">Módulo 01 · Aula {String(lesson.number).padStart(2, '0')}</p>
            <h1>{lesson.title}</h1>
            <p className="course-intro">{lesson.description}</p>
            <div className="course-outcomes">
              {lesson.outcomes.map((outcome) => (
                <div key={outcome.label}>
                  <strong>{outcome.label}</strong>
                  <span>{outcome.text}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="course-slides" aria-labelledby="slides-title">
            <div className="course-section-heading">
              <div>
                <p className="course-eyebrow">Apresentação guiada · {lesson.duration}</p>
                <h2 id="slides-title">Acompanhe a aula pelos slides</h2>
              </div>
              <a href={lesson.slideSrc} target="_blank" rel="noreferrer" className="course-secondary-button">
                Abrir em tela cheia
              </a>
            </div>
            <p className="course-section-intro">
              Clique na apresentação e use as setas do teclado para avançar ou voltar.
            </p>
            <div className="course-slide-frame">
              <iframe ref={frameRef} src={lesson.slideSrc} title={lesson.slideTitle} />
            </div>
          </section>

          <section className="course-section">
            <p className="course-eyebrow">Antes de praticar</p>
            <h2>Prepare o seu caso real.</h2>
            <div className="course-check-grid">
              {lesson.preparation.map((item, index) => (
                <label key={item.title} className={checks[index] ? 'checked' : ''}>
                  <input type="checkbox" checked={checks[index]} onChange={() => toggleCheck(index)} />
                  <span><strong>{item.title}</strong><small>{item.text}</small></span>
                </label>
              ))}
            </div>
          </section>

          <section className="course-section">
            <p className="course-eyebrow">O conceito para consultar</p>
            <h2>{lesson.conceptTitle}</h2>
            <p className="course-section-intro">{lesson.conceptIntro}</p>
            <div className={`course-concepts ${lesson.concepts.length === 3 ? 'three' : ''}`}>
              {lesson.concepts.map((concept) => (
                <article key={concept.title}>
                  <span>{concept.marker}</span>
                  <h3>{concept.title}</h3>
                  <p>{concept.text}</p>
                </article>
              ))}
            </div>
            <div className="course-comparison">
              <div><strong>Antes</strong><p>{lesson.example.before}</p></div>
              <div><strong>Depois</strong><p>{lesson.example.after}</p></div>
            </div>
          </section>

          <section className="course-section">
            <p className="course-eyebrow">Faça agora</p>
            <h2>{lesson.practiceTitle}</h2>
            <p className="course-section-intro">{lesson.practiceIntro}</p>
            <div className="course-prompt">
              <div>
                <span>{lesson.promptLabel}</span>
                <button type="button" onClick={copyPrompt}>{copied ? 'Copiado' : 'Copiar prompt'}</button>
              </div>
              <pre><code>{lesson.prompt}</code></pre>
            </div>
          </section>

          <section className="course-task">
            <p className="course-eyebrow">Entrega da aula</p>
            <h2>{lesson.taskTitle}</h2>
            <p>{lesson.taskText}</p>
            <div><strong>Você terminou quando:</strong> {lesson.deliverable}</div>
          </section>

          <section className="course-section">
            <p className="course-eyebrow">Teste de sucesso</p>
            <h2>Confira antes de avançar.</h2>
            <div className="course-check-grid">
              {lesson.success.map((item, itemIndex) => {
                const index = lesson.preparation.length + itemIndex;
                return (
                  <label key={item.title} className={checks[index] ? 'checked' : ''}>
                    <input type="checkbox" checked={checks[index]} onChange={() => toggleCheck(index)} />
                    <span><strong>{item.title}</strong><small>{item.text}</small></span>
                  </label>
                );
              })}
            </div>
            <button type="button" className={completed ? 'course-complete completed' : 'course-complete'} onClick={toggleCompleted}>
              {completed ? 'Aula concluída ✓' : 'Marcar aula como concluída'}
            </button>
          </section>

          <Link href={lesson.next.href} className="course-next">
            <span><small>Próxima aula</small><strong>{String(lesson.next.number).padStart(2, '0')} · {lesson.next.title}</strong></span>
            <b aria-hidden="true">→</b>
          </Link>
          <CourseBonusNav footer />
        </main>
      </div>
    </div>
  );
}
