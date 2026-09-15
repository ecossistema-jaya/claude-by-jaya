import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { guides } from './content';
import { rooms } from './rooms';
import LibraryCatalog from './LibraryCatalog';
import styles from './library.module.css';

export const metadata: Metadata = { alternates: { canonical: 'https://jayaroberta.com/biblioteca' } };

export default function LibraryPage() {
  return <main id="conteudo">
    <section className={styles.hero} aria-labelledby="library-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span className={styles.dot} /> BIBLIOTECA GRATUITA · EM PORTUGUÊS</p>
        <h1 id="library-title">Inteligência<br />se <em>constrói.</em></h1>
        <p className={styles.heroLead}>Aprenda Claude. Depois ensine Claude<br className={styles.desktopBreak} /> a trabalhar com você.</p>
        <p className={styles.heroDescription}>Da primeira conversa aos sistemas com agentes: guias, exercícios e caminhos para transformar conhecimento em prática.</p>
        <div className={styles.heroButtons}>
          <Link href="/biblioteca/primeira-entrega" className={styles.primary}>Começar do zero <span aria-hidden="true">↗</span></Link>
          <a href="#ambientes" className={styles.textLink}>Explorar os ambientes <span aria-hidden="true">↓</span></a>
        </div>
        <p className={styles.heroFoot}>Seu repertório é o ponto de partida.</p>
      </div>
      <div className={styles.blueprint} aria-label="Mapa dos nove ambientes">
        <div className={styles.blueprintTop}><span>ATLAS / INTELIGÊNCIA APLICADA</span><span>FIG. 01</span></div>
        <div className={styles.orbit} aria-hidden="true"><div /><div /><span>✳</span></div>
        <div className={styles.blueprintFloors}>
          {['Autonomia', 'Expansão', 'Fundação'].map((group, index) => <div className={styles.floor} key={group}>
            <span className={styles.floorLabel}>{String(3-index).padStart(2, '0')} / {group}</span>
            <div>{rooms.filter(room => room.group === group).map(room => <Link key={room.id} href={`/biblioteca?ambiente=${room.id}#acervo`}><small>{room.number}</small>{room.title}<span aria-hidden="true">↗</span></Link>)}</div>
          </div>)}
        </div>
        <div className={styles.blueprintBottom}><span>UMA CONVERSA ABRE CAMINHOS.</span><span aria-hidden="true">↑</span></div>
      </div>
    </section>

    <div className={styles.ribbon}><span>CONVERSAR</span><b aria-hidden="true">↗</b><span>CRIAR</span><b aria-hidden="true">↗</b><span>CONSTRUIR</span><b aria-hidden="true">↗</b><span>ORQUESTRAR</span><b aria-hidden="true">✳</b></div>

    <section className={styles.startSection} aria-labelledby="start-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>01 / PONTOS DE PARTIDA</p><h2 id="start-title">Uma boa ideia.<br /><em>Um próximo passo.</em></h2></div><p>Escolha o que faz sentido para o seu momento.<br />Você pode entrar por qualquer caminho.</p></div>
      <div className={styles.featureGrid}>
        {[
          { slug: 'primeira-entrega', label: 'ESTOU COMEÇANDO', cover: <>Primeira<br /><i>entrega.</i></>, text: 'Saia da conversa com algo que você consegue usar.', className: styles.wine },
          { slug: 'instrucoes-reutilizaveis', label: 'JÁ TRABALHO COM CLAUDE', cover: <>Do seu<br /><i>jeito.</i></>, text: 'Transforme seus critérios em instruções reutilizáveis.', className: styles.peach },
          { slug: 'primeira-ferramenta', label: 'QUERO CONSTRUIR', cover: <>Ideia em<br /><i>ação.</i></>, text: 'Dê forma a uma ferramenta para um problema real.', className: styles.petrol },
        ].map((item, index) => <Link className={`${styles.featureCard} ${item.className}`} key={item.slug} href={`/biblioteca/${item.slug}`}>
          <div className={styles.featureTop}><span>{item.label}</span><span aria-hidden="true">↗</span></div>
          <div className={styles.featureTitle}>{item.cover}</div>
          <p>{item.text}</p><div className={styles.featureBottom}><span>GUIA {String(index+1).padStart(2,'0')}</span><span>ABRIR E EXPERIMENTAR</span></div>
        </Link>)}
      </div>
    </section>

    <section className={styles.environments} id="ambientes" aria-labelledby="environments-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>02 / ARQUITETURA DA INTELIGÊNCIA APLICADA</p><h2 id="environments-title">Nove ambientes.<br /><em>Muitas possibilidades.</em></h2></div><p>Um mapa para explorar capacidades.<br />Siga uma trilha ou vá direto ao que precisa.</p></div>
      <div className={styles.roomGroups}>
        {['Fundação', 'Expansão', 'Autonomia'].map((group, index) => <div className={styles.roomGroup} key={group}>
          <div className={styles.groupHeader}><span>{['I', 'II', 'III'][index]}</span><h3>{group}</h3></div>
          {rooms.filter(room => room.group === group).map(room => <Link href={`/biblioteca?ambiente=${room.id}#acervo`} key={room.id} className={styles.roomLink}>
            <span>{room.number}</span><div><h4>{room.title}</h4><p>{room.description}</p></div><span aria-hidden="true">↗</span>
          </Link>)}
        </div>)}
      </div>
    </section>

    <section className={styles.catalogSection} id="acervo" aria-labelledby="catalog-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>03 / O ACERVO</p><h2 id="catalog-title">Conhecimento para<br /><em>colocar em prática.</em></h2></div><p>{guides.length} guias autorais para explorar.<br />Exercícios, prompts e fontes para continuar.</p></div>
      <Suspense fallback={<p className={styles.loading}>Preparando a busca do acervo…</p>}><LibraryCatalog /></Suspense>
    </section>

    <section className={styles.editorialNote}>
      <span className={styles.noteSymbol} aria-hidden="true">✳</span>
      <div><p className={styles.eyebrow}>O CRITÉRIO CONTINUA SENDO SEU.</p><h2>A ferramenta amplia.<br /><em>Você dá direção.</em></h2><p>Aqui, cada guia parte de um problema, propõe uma experiência e mostra o que conferir. Sua experiência entra na pergunta, na escolha e na revisão.</p><Link href="/biblioteca/primeira-entrega" className={styles.textLink}>Experimente com uma tarefa sua <span aria-hidden="true">↗</span></Link></div>
    </section>
  </main>;
}
