import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides, type LibraryGuide } from '../content';
import ReaderActions, { CopyPrompt } from '../ReaderActions';
import styles from '../reader.module.css';
import { exigirLeitor } from '../acesso';

const baseUrl = 'https://jayaroberta.com';
type GuidePageProps = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const url = `${baseUrl}/biblioteca/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: guide.title,
      description: guide.description,
      url,
      locale: 'pt_BR',
      siteName: 'Biblioteca Claude by Jaya',
      images: [{ url: `${baseUrl}/biblioteca/opengraph-image`, width: 1200, height: 630, alt: 'Biblioteca Claude by Jaya' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
      images: [`${baseUrl}/biblioteca/opengraph-image`],
    },
  };
}

function reviewDate(date: string) {
  const parsed = new Date(date.length === 10 ? `${date}T12:00:00Z` : date);
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(parsed);
}

function CollectionNav({ currentSlug }: { currentSlug: string }) {
  return (
    <nav aria-label="Guias da biblioteca" className={styles.collectionNav}>
      <Link className={styles.libraryBack} href="/biblioteca">← Toda a biblioteca</Link>
      {guides.map((guide) => (
        <Link key={guide.slug} href={`/biblioteca/${guide.slug}`} aria-current={guide.slug === currentSlug ? 'page' : undefined}>
          <small>{guide.kind} · {guide.level}</small>
          <span>{guide.title}</span>
        </Link>
      ))}
    </nav>
  );
}

function Contents({ guide }: { guide: LibraryGuide }) {
  return (
    <nav aria-label="Nesta página" className={styles.contentsNav}>
      <a href="#antes-de-comecar">Antes de começar</a>
      {guide.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
      <a href="#confira-sua-entrega">Confira sua entrega</a>
      <a href="#fontes">Fontes</a>
    </nav>
  );
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  await exigirLeitor(`/biblioteca/${guide.slug}`);
  const words = [guide.description, guide.outcome, guide.prerequisite,
    ...guide.sections.flatMap((section) => [section.title, ...section.paragraphs, ...(section.steps ?? []), section.prompt ?? '', section.note ?? '']),
    ...guide.checklist,
  ].join(' ').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  const next = guides.find((item) => item.slug === guide.nextSlug && item.slug !== guide.slug);

  return (
    <main className={styles.reader} id="conteudo">
      <div className={styles.mobileNavigation}>
        <details><summary>Explorar o acervo</summary><CollectionNav currentSlug={slug} /></details>
        <details><summary>Nesta página</summary><Contents guide={guide} /></details>
      </div>

      <div className={styles.columns}>
        <aside className={styles.collectionRail}>
          <p className={styles.railLabel}>O acervo</p>
          <CollectionNav currentSlug={slug} />
        </aside>

        <article className={styles.article} aria-labelledby="guide-title">
          <header className={styles.articleHeader}>
            <p className={styles.eyebrow}>{guide.kind} <span aria-hidden="true">/</span> {guide.level}</p>
            <h1 id="guide-title">{guide.title}</h1>
            <p className={styles.description}>{guide.description}</p>
            <div className={styles.articleMeta}>
              <span>Por Jaya Roberta</span>
              <span title="Estimativa calculada a 200 palavras por minuto; não inclui o tempo do exercício.">{minutes} min de leitura estimada</span>
              <span>Revisado em <time dateTime={guide.reviewedAt}>{reviewDate(guide.reviewedAt)}</time></span>
            </div>
            {guide.tools.length > 0 && <ul className={styles.tools} aria-label="Ferramentas citadas">{guide.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>}
            <ReaderActions slug={guide.slug} />
          </header>

          <section className={styles.preparation} id="antes-de-comecar" aria-labelledby="prepare-title">
            <div><p className={styles.boxLabel}>A entrega</p><h2 id="prepare-title">O que você vai produzir</h2><p>{guide.outcome}</p></div>
            <div><h3>Antes de começar</h3><p>{guide.prerequisite}</p></div>
          </section>

          {guide.sections.map((section, index) => (
            <section className={styles.section} id={section.id} key={section.id} aria-labelledby={`heading-${section.id}`}>
              <p className={styles.sectionNumber}>Parte {String(index + 1).padStart(2, '0')}</p>
              <h2 id={`heading-${section.id}`}>{section.title}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
              {section.steps && section.steps.length > 0 && <ol className={styles.steps}>{section.steps.map((step, stepIndex) => <li key={stepIndex}>{step}</li>)}</ol>}
              {section.prompt && <CopyPrompt text={section.prompt} label={section.title} />}
              {section.note && <aside className={styles.note}><strong>Vale observar</strong><p>{section.note}</p></aside>}
            </section>
          ))}

          <section className={styles.checklistSection} id="confira-sua-entrega" aria-labelledby="checklist-title">
            <p className={styles.boxLabel}>Seu critério de conclusão</p>
            <h2 id="checklist-title">Confira sua entrega</h2>
            <ul>{guide.checklist.map((item, index) => <li key={index}><span aria-hidden="true">□</span>{item}</li>)}</ul>
          </section>

          <section className={styles.sources} id="fontes" aria-labelledby="sources-title">
            <h2 id="sources-title">Fontes para consultar</h2>
            <p>Consulte a documentação original para confirmar recursos e disponibilidade na sua conta.</p>
            <ul>{guide.sources.map(({ title, url }) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{title}<span aria-hidden="true"> ↗</span><span className={styles.srOnly}> (abre em nova aba)</span></a></li>)}</ul>
          </section>

          <div className={styles.nextReading}>
            <Link href="/biblioteca">← Voltar à biblioteca</Link>
            {next && <Link href={`/biblioteca/${next.slug}`}><small>Próxima leitura</small><strong>{next.title} <span aria-hidden="true">→</span></strong></Link>}
          </div>
        </article>

        <aside className={styles.contentsRail}>
          <p className={styles.railLabel}>Nesta página</p>
          <Contents guide={guide} />
          <p className={styles.readingNote}>Leia com uma tarefa sua em mãos. A prática faz parte do guia.</p>
        </aside>
      </div>
    </main>
  );
}
