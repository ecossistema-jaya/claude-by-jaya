'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { LibraryGuide } from './content';
import { rooms } from './rooms';
import styles from './library.module.css';

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

/* O acervo chega por prop, vindo da página já autorizada. Importar content.ts
   aqui embutiria todos os guias no JS público de /_next/static. */
export default function LibraryCatalog({ guides }: { guides: LibraryGuide[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const requestedRoom = params.get('ambiente');
  const roomId = rooms.some(room => room.id === requestedRoom) ? requestedRoom : null;
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('Todos');
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const results = guides.filter(guide => {
    const room = rooms.find(item => item.id === guide.room)!;
    const searchable = normalize([guide.title, guide.description, guide.outcome, guide.kind, guide.level, room.title, room.group, ...guide.tools, ...guide.sections.map(section => `${section.title} ${section.paragraphs.join(' ')}`)].join(' '));
    return (!roomId || guide.room === roomId) && (level === 'Todos' || guide.level === level) && terms.every(term => searchable.includes(term));
  });
  const active = !!roomId || !!query || level !== 'Todos';

  function clearFilters() {
    setQuery('');
    setLevel('Todos');
    router.replace('/biblioteca#acervo', { scroll: false });
  }

  return <>
    <div className={styles.searchRow}>
      <label className={styles.search}><span aria-hidden="true">⌕</span><span className={styles.srOnly}>Buscar na biblioteca</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="O que você quer fazer com Claude?" /></label>
      <label className={styles.levelFilter}>Nível<select value={level} onChange={event => setLevel(event.target.value)}><option>Todos</option><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></label>
    </div>
    <nav className={styles.filters} aria-label="Filtrar por ambiente">
      <Link href="/biblioteca#acervo" scroll={false} aria-current={!roomId ? 'true' : undefined}>Todos os ambientes</Link>
      {rooms.map(room => <Link href={`/biblioteca?ambiente=${room.id}#acervo`} scroll={false} aria-current={roomId === room.id ? 'true' : undefined} key={room.id}>{room.title}</Link>)}
    </nav>
    <div className={styles.resultsHeader}><p role="status">{results.length} {results.length === 1 ? 'guia encontrado' : 'guias encontrados'}{roomId ? ` em ${rooms.find(room => room.id === roomId)?.title}` : ''}</p>{active && <button onClick={clearFilters}>Limpar filtros <span aria-hidden="true">×</span></button>}</div>
    {results.length ? <div className={styles.guideGrid}>{results.map(guide => {
      const room = rooms.find(item => item.id === guide.room)!;
      return <Link href={`/biblioteca/${guide.slug}`} className={`${styles.guideCard} ${guide.slug === 'primeira-entrega' ? styles.guideFeatured : ''}`} key={guide.slug}>
        <div className={styles.guideTop}><span>{room.number} / {room.title}</span><span>{guide.kind}</span></div>
        <h3>{guide.title}</h3><p>{guide.description}</p>
        <div className={styles.guideBottom}><span>{guide.level}</span><span aria-hidden="true">↗</span></div>
      </Link>;
    })}</div> : <div className={styles.empty}><h3>Nenhum guia com essa combinação.</h3><p>Experimente uma palavra mais ampla, como “contexto”, ou explore todos os ambientes.</p><button onClick={clearFilters}>Ver todos os guias <span aria-hidden="true">↗</span></button></div>}
  </>;
}
