import Link from 'next/link';

const AULAS = [
  {
    n: 1,
    titulo: 'Conversar com o Claude',
    desc: 'Planos, modelos, a fórmula OCAS e como deixar o Claude te conhecer.',
  },
  {
    n: 2,
    titulo: 'Botar o Claude pra Trabalhar',
    desc: 'Artefatos, Projetos, Conectores, Skills, Cowork e Design.',
  },
  {
    n: 3,
    titulo: 'Documento Mestre',
    desc: 'O documento que ensina o Claude quem você é — com os prompts prontos.',
  },
  {
    n: 4,
    titulo: 'Psicometria e Zona de Genialidade',
    desc: '43 perguntas que viram o seu blueprint e o seu dashboard psicométrico.',
  },
  {
    n: 5,
    titulo: 'Landing Page com Identidade Visual',
    desc: 'Os prompts para criar uma página com a sua cara, do zero.',
  },
];

export default function Home() {
  return (
    <main className="wrap">
      <div className="eyebrow">Jaya Roberta · Série Claude do Zero</div>
      <h1>O curso</h1>
      <p className="sub">
        Cinco aulas na ordem. Cada uma é pra fazer junto — abra o Claude do lado.
      </p>

      <div className="lista">
        {AULAS.map((a) => (
          <Link key={a.n} href={`/aula-${a.n}`} className="aula">
            <span className="n">{String(a.n).padStart(2, '0')}</span>
            <span>
              <h2>{a.titulo}</h2>
              <p>{a.desc}</p>
            </span>
          </Link>
        ))}
      </div>

      <div className="rodape">
        Jaya Roberta ·{' '}
        <a href="https://instagram.com/jayaroberta.ai" target="_blank" rel="noopener">
          @jayaroberta.ai
        </a>
      </div>
    </main>
  );
}
