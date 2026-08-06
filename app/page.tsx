import Link from 'next/link';
import Sair from '@/app/Sair';

/* Posições medidas na arte de referência (inicial_com_cards.png, 1024x1536) e
   reescaladas por 0.85 para caber no vão livre da capa sem cards, que é menor
   porque o logo empurra o conteúdo. As proporções entre os cards são as da arte. */
const AULAS = [
  {
    n: 1,
    top: 45.50,
    alt: 7.06,
    titulo: 'Conversar com o Claude',
    desc: 'Planos, modelos, a fórmula OCAS e como deixar o Claude te conhecer.',
    icone: (
      <>
        <rect x="3" y="4" width="13" height="10" rx="2.5" />
        <path d="M8 18v-4" />
        <rect x="11" y="9" width="10" height="8" rx="2.5" />
      </>
    ),
  },
  {
    n: 2,
    top: 53.32,
    alt: 7.06,
    titulo: 'Botar o Claude pra Trabalhar',
    desc: 'Artefatos, Projetos, Conectores, Skills, Cowork e Design.',
    icone: (
      <>
        <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
        <path d="M18.5 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" />
        <path d="M5 16.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" />
      </>
    ),
  },
  {
    n: 3,
    top: 61.14,
    alt: 7.06,
    titulo: 'Documento Mestre',
    desc: 'O documento que ensina o Claude quem você é — com os prompts prontos.',
    icone: (
      <>
        <path d="M6 2.5h8l5 5v14H6z" />
        <path d="M14 2.5v5h5" />
        <path d="M9 12h7M9 15.5h7M9 19h4" />
      </>
    ),
  },
  {
    n: 4,
    top: 68.96,
    alt: 7.82,
    titulo: 'Psicometria e Zona de Genialidade',
    desc: '43 perguntas que viram o seu blueprint e o seu dashboard psicométrico.',
    icone: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
      </>
    ),
  },
  {
    n: 5,
    top: 77.55,
    alt: 6.97,
    titulo: 'Landing Page com Identidade Visual',
    desc: 'Os prompts para criar uma página com a sua cara, do zero.',
    icone: (
      <>
        <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
        <path d="M2.5 9h19" />
        <circle cx="6" cy="6.5" r="0.8" />
        <circle cx="8.8" cy="6.5" r="0.8" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <main className="capa">
      <Sair />
      {AULAS.map((a) => (
        <Link
          key={a.n}
          href={`/aula-${a.n}`}
          className="cartao"
          style={{ top: `${a.top}%`, height: `${a.alt}%` }}
        >
          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
            {a.icone}
          </svg>
          <div className="txt">
            <div className="cab">
              <span className="num">{String(a.n).padStart(2, '0')}</span>
              <h2>{a.titulo}</h2>
            </div>
            <p>{a.desc}</p>
          </div>
        </Link>
      ))}
    </main>
  );
}
