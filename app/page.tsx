import Link from 'next/link';
import Sair from '@/app/Sair';
import { buscarAluno } from '@/app/lib/aluno';
import { clienteServidor } from '@/app/lib/supabase/servidor';

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
    imagem: '/icones/claude-asterisco.png',
  },
  {
    n: 2,
    top: 53.32,
    alt: 7.06,
    titulo: 'Botar o Claude pra Trabalhar',
    desc: 'Artefatos, Projetos, Conectores, Skills, Cowork e Design.',
    imagem: '/icones/claude.svg',
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
    imagem: '/icones/cerebro.png',
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

export default async function Home() {
  const supabase = await clienteServidor();
  const { data } = await supabase.auth.getUser();
  const eu = data.user?.email ? await buscarAluno(supabase, data.user.email) : null;

  return (
    <>
      <main className="capa">
      <span className="claude-float f1" aria-hidden="true" />
      <span className="claude-float f2" aria-hidden="true" />
      <span className="claude-float f3" aria-hidden="true" />
      <div className="topo">
        {eu?.papel === 'admin' && (
          <Link href="/admin" className="sair">
            Alunos
          </Link>
        )}
        <Sair />
      </div>
      {AULAS.map((a) => (
        <Link
          key={a.n}
          href={`/aula-${a.n}`}
          className="cartao"
          style={{ top: `${a.top}%`, height: `${a.alt}%` }}
        >
          {a.imagem ? (
            <img className="ico" src={a.imagem} alt="" />
          ) : (
            <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
              {a.icone}
            </svg>
          )}
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
      {/* Fora da .capa de propósito: a arte é 1024x1536 fechada, com a assinatura
          logo abaixo do último card e "Cinco aulas na ordem" estampado no pixel.
          O bônus não é uma sexta aula — é um brinde, e mora depois da arte. */}
      <Link href="/aula-3" className="bonus">
        <span className="selo">Bônus</span>
        <div className="txt">
          <h2>A skill Minha Personalidade</h2>
          <p>
            O arquivo que entrevista você e escreve o seu Documento Mestre. Instala no Claude ou
            cola no ChatGPT — está dentro da Aula 3.
          </p>
        </div>
        <span className="seta" aria-hidden="true">
          →
        </span>
      </Link>
    </>
  );
}
