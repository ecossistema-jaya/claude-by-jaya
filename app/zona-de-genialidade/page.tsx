import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DESTINO_ZONA } from '@/app/lib/destino-login';
import { exigirAcessoZona } from '@/app/lib/exigir-acesso-produto';
import styles from './zona.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Zona de Genialidade · Jaya Roberta',
  description:
    'Um assessment por convite que cruza sete frameworks para revelar padrões de energia, talento e criação de valor.',
};

const LENTES = [
  ['Gay Hendricks', 'Onde você entrega algo que não pode ser facilmente replicado.'],
  ['Don Clifton', 'Quais padrões de pensamento aparecem sem esforço.'],
  ['Dan Sullivan', 'A capacidade única que organiza suas melhores entregas.'],
  ['Roger Hamilton', 'Como você cria valor e transforma oportunidade em movimento.'],
  ['Alex Hormozi', 'Onde sua experiência pode ganhar forma de oferta.'],
  ['Kathy Kolbe', 'Como você age quando tem liberdade para trabalhar do seu jeito.'],
  ['Sally Hogshead', 'Como sua presença é percebida antes mesmo da explicação.'],
] as const;

export default async function ZonaDeGenialidade() {
  const { resposta } = await exigirAcessoZona();
  if (resposta?.status === 401) {
    redirect(`/login?next=${encodeURIComponent(DESTINO_ZONA)}`);
  }
  if (resposta) redirect('/sem-acesso?produto=zona');

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.imageWrap}>
          <img
            src="/zona/arte/02.webp"
            alt="Uma mulher diante de um círculo de luz, com raízes douradas se espalhando a partir dos pés."
            className={styles.image}
          />
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Arquitetura da Consciência</p>
          <h1>Zona de Genialidade</h1>
          <p className={styles.lead}>
            Sete frameworks leem as mesmas respostas e revelam onde sua energia,
            seus talentos e sua capacidade de criar valor convergem.
          </p>
          <p>
            Não é teste de personalidade. É um levantamento profundo: 43 perguntas,
            um blueprint de posicionamento e um dashboard com evidências e próximos passos.
          </p>
          <dl className={styles.facts}>
            <div><dt>Duração</dt><dd>cerca de 30 minutos</dd></div>
            <div><dt>Acesso</dt><dd>somente por convite</dd></div>
            <div><dt>Entrada</dt><dd>conta Google autorizada</dd></div>
          </dl>
          <Link className={styles.cta} href="/zona-de-genialidade/iniciar">
            Entrar no assessment
          </Link>
          <p className={styles.note}>Seu progresso fica salvo neste aparelho e vinculado à sua conta.</p>
        </div>
      </section>

      <section className={styles.lenses}>
        <p className={styles.eyebrow}>Sete lentes, um questionário</p>
        <h2>O valor aparece onde elas concordam — e onde discordam.</h2>
        <div className={styles.grid}>
          {LENTES.map(([nome, descricao]) => (
            <article key={nome}>
              <h3>{nome}</h3>
              <p>{descricao}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
