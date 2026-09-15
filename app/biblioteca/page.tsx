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
        <p className={styles.eyebrow}><span className={styles.dot} /> CONHECIMENTO ABERTO. POSSIBILIDADES REAIS.</p>
        <h1 id="library-title">O que você<br />sabe, <em>ampliado.</em></h1>
        <p className={styles.heroLead}>Um lugar para aprender a pensar, criar e trabalhar com Claude. No seu ritmo. A partir da sua experiência.</p>
        <div className={styles.heroButtons}>
          <a href="#acervo" className={styles.primary}>Encontre seu próximo passo <span aria-hidden="true">↗</span></a>
          <Link href="/biblioteca/primeira-entrega" className={styles.textLink}>Começar do zero <span aria-hidden="true">↗</span></Link>
        </div>
        <p className={styles.heroFoot}>Seu repertório é o ponto de partida.</p>
      </div>
      <div className={styles.art} aria-hidden="true">
        <div className={styles.ring} /><div className={styles.innerRing} /><div className={styles.radial} />
        <div className={styles.core}><span>j</span></div>
        <svg className={styles.pixels} viewBox="0 0 500 500"><g fill="#ffb12b"><path d="M60 94h15v15H60zM75 79h15v15H75zM90 64h15v15H90zM425 344h16v16h-16zM441 360h16v16h-16zM409 360h16v16h-16zM425 376h16v16h-16z" /></g><g fill="#fc6c35"><path d="M392 71h11v11h-11zM403 82h11v11h-11zM75 382h23v23H75z" /></g><g fill="none" stroke="currentColor" strokeOpacity=".4"><path d="M15 244h20m-10-10v20M464 244h20m-10-10v20M244 15h20m-10-10v20M244 464h20m-10-10v20M20 62V20h42M438 20h42v42M480 438v42h-42M62 480H20v-42" /></g></svg>
        <span className={styles.artLabel}>Da experiência<br />à possibilidade</span><span className={styles.artLabelTop}>Campo de expansão / 01</span>
      </div>
    </section>

    <div className={styles.ribbon}><span>09 AMBIENTES PARA EXPLORAR</span><span>GUIAS, EXERCÍCIOS E TEMPLATES GRATUITOS</span></div>

    <section className={styles.intro} aria-label="Sobre a biblioteca"><p className={styles.eyebrow}>O PONTO DE PARTIDA É VOCÊ.</p><p>A ferramenta abre possibilidades.<br /><em>A sua experiência dá direção.</em></p></section>

    <section className={styles.catalogSection} id="acervo" aria-labelledby="catalog-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>01 / O ACERVO</p><h2 id="catalog-title">Da curiosidade<br /><em>à prática.</em></h2></div><p>{guides.length} guias autorais para explorar.<br />Exercícios, prompts e fontes para continuar.</p></div>
      <Suspense fallback={<p className={styles.loading}>Preparando a busca do acervo…</p>}><LibraryCatalog /></Suspense>
    </section>

    <section className={styles.startSection} aria-labelledby="start-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>02 / PONTOS DE PARTIDA</p><h2 id="start-title">Uma boa ideia.<br /><em>Um próximo passo.</em></h2></div><p>Escolha o que faz sentido para o seu momento.<br />Você pode entrar por qualquer caminho.</p></div>
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
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>03 / ARQUITETURA DA INTELIGÊNCIA APLICADA</p><h2 id="environments-title">Nove ambientes.<br /><em>Muitas possibilidades.</em></h2></div><p>Um mapa para explorar capacidades.<br />Siga uma trilha ou vá direto ao que precisa.</p></div>
      <div className={styles.roomGroups}>
        {['Fundação', 'Expansão', 'Autonomia'].map((group, index) => <div className={styles.roomGroup} key={group}>
          <div className={styles.groupHeader}><span>{['I', 'II', 'III'][index]}</span><h3>{group}</h3></div>
          {rooms.filter(room => room.group === group).map(room => <Link href={`/biblioteca?ambiente=${room.id}#acervo`} key={room.id} className={styles.roomLink}>
            <span>{room.number}</span><div><h4>{room.title}</h4><p>{room.description}</p></div><span aria-hidden="true">↗</span>
          </Link>)}
        </div>)}
      </div>
    </section>

    <section className={styles.editorialNote}>
      <span className={styles.noteSymbol} aria-hidden="true">✳</span>
      <div><p className={styles.eyebrow}>O CRITÉRIO CONTINUA SENDO SEU.</p><h2>A ferramenta amplia.<br /><em>Você dá direção.</em></h2><p>Aqui, cada guia parte de um problema, propõe uma experiência e mostra o que conferir. Sua experiência entra na pergunta, na escolha e na revisão.</p><Link href="/biblioteca/primeira-entrega" className={styles.textLink}>Experimente com uma tarefa sua <span aria-hidden="true">↗</span></Link></div>
    </section>
  </main>;
}
