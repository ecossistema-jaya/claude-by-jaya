'use client';

import { useState } from 'react';

type ApiResult = {
  answers: Record<string, any>;
  confidence: Record<string, number>;
  meta: { model: string; experiment: string };
};

const labels: Record<string, string> = {
  aprender: 'Aprender',
  criar: 'Criar',
  organizar: 'Organizar',
  pesquisar: 'Pesquisar',
  analisar: 'Analisar',
  automatizar: 'Automatizar',
  programar: 'Programar',
  decidir: 'Decidir',
  conversa: 'Conversa',
  pesquisa: 'Pesquisa',
  codigo: 'Código',
  workflow: 'Workflow',
  diagnostico: 'Diagnóstico',
  humano: 'Revisão humana',
};

function pct(value?: number) {
  return typeof value === 'number' ? `${Math.round(value * 100)}%` : '—';
}

export default function JevRouterClient() {
  const [request, setRequest] = useState(
    'Quero transformar as respostas do diagnóstico da minha sessão estratégica em prioridades de automação e indicar qual ferramenta de IA usar em cada etapa.',
  );
  const [data, setData] = useState<ApiResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch('/api/jev-router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request }),
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Falha ao consultar o Jev.');
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  const territory = data?.answers?.territory;
  const complexity = data?.answers?.complexity;
  const bestMode = data?.answers?.bestMode;

  return (
    <main className="jev-shell">
      <section className="jev-hero">
        <span className="jev-kicker">JAYA AI · EXPERIMENTO 01</span>
        <h1>Radar de Intenção com Jev</h1>
        <p>
          Descreva uma tarefa real. O Jev não escreve a resposta: ele decide como a tarefa
          deveria ser tratada.
        </p>
      </section>

      <section className="jev-card">
        <label htmlFor="request">O que você quer fazer?</label>
        <textarea
          id="request"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          rows={7}
          placeholder="Ex.: Quero analisar 50 respostas de clientes e separar oportunidades de conteúdo, produto e automação."
        />
        <div className="jev-actions">
          <button onClick={run} disabled={loading || request.trim().length < 8}>
            {loading ? 'Jev está decidindo…' : 'Analisar com Jev'}
          </button>
          <span>typesafe-ai/jev · decisão estruturada</span>
        </div>
        {error && <p className="jev-error">{error}</p>}
      </section>

      {data && (
        <section className="jev-results">
          <div className="jev-primary">
            <span>Território</span>
            <strong>{labels[territory?.choice] ?? territory?.choice}</strong>
            <small>
              prob. {pct(territory?.probabilities?.[territory?.choice])} · confiança{' '}
              {pct(data.confidence?.territory)}
            </small>
          </div>

          <div className="jev-primary">
            <span>Próximo modo</span>
            <strong>{labels[bestMode?.choice] ?? bestMode?.choice}</strong>
            <small>
              prob. {pct(bestMode?.probabilities?.[bestMode?.choice])} · confiança{' '}
              {pct(data.confidence?.bestMode)}
            </small>
          </div>

          <div className="jev-grid">
            <article>
              <span>Complexidade</span>
              <strong>{Number(complexity?.score ?? 0).toFixed(1)} / 4</strong>
            </article>
            <article>
              <span>Precisa de web?</span>
              <strong>{pct(data.answers?.needsWeb?.probability)}</strong>
            </article>
            <article>
              <span>Precisa de código?</span>
              <strong>{pct(data.answers?.needsCode?.probability)}</strong>
            </article>
            <article>
              <span>Revisão humana?</span>
              <strong>{pct(data.answers?.needsHumanReview?.probability)}</strong>
            </article>
          </div>

          <details>
            <summary>Ver decisão bruta do Jev</summary>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </section>
      )}

      <style jsx>{`
        .jev-shell {
          min-height: 100vh;
          background: #0d0908;
          color: #f9f4f0;
          padding: 64px 22px 100px;
          font-family: Jost, sans-serif;
        }
        .jev-shell > section { max-width: 880px; margin-left: auto; margin-right: auto; }
        .jev-hero { margin-bottom: 34px; }
        .jev-kicker { color: #ff4d00; font-size: 12px; letter-spacing: .18em; font-weight: 600; }
        h1 { font-family: Petrona, serif; font-size: clamp(42px, 7vw, 78px); line-height: .96; margin: 16px 0 20px; font-weight: 600; }
        .jev-hero p { max-width: 650px; color: #c9bdb7; font-size: 18px; line-height: 1.55; }
        .jev-card, .jev-results { border: 1px solid #493d37; background: #17100d; border-radius: 22px; padding: 24px; }
        .jev-card label { display:block; margin-bottom: 10px; font-weight: 600; }
        textarea { width:100%; box-sizing:border-box; resize:vertical; border:1px solid #493d37; border-radius:16px; background:#0d0908; color:#f9f4f0; padding:18px; font:inherit; font-size:16px; line-height:1.55; outline:none; }
        textarea:focus { border-color:#ff4d00; }
        .jev-actions { display:flex; gap:16px; justify-content:space-between; align-items:center; margin-top:16px; flex-wrap:wrap; }
        button { border:0; border-radius:999px; background:#ff4d00; color:white; padding:13px 19px; font:inherit; font-weight:600; cursor:pointer; }
        button:disabled { opacity:.55; cursor:default; }
        .jev-actions span { color:#8f817b; font-size:12px; }
        .jev-error { color:#ff9b73; }
        .jev-results { margin-top:20px; display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .jev-primary { border:1px solid #493d37; border-radius:16px; padding:20px; }
        .jev-primary span, article span { display:block; color:#9f918a; font-size:12px; text-transform:uppercase; letter-spacing:.11em; }
        .jev-primary strong { display:block; font-family:Petrona, serif; font-size:32px; margin:8px 0; color:#f9f4f0; }
        .jev-primary small { color:#9f918a; }
        .jev-grid { grid-column:1/-1; display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
        article { border:1px solid #302722; background:#0d0908; border-radius:14px; padding:16px; }
        article strong { display:block; margin-top:8px; font-size:20px; }
        details { grid-column:1/-1; margin-top:4px; }
        summary { cursor:pointer; color:#ff6929; }
        pre { overflow:auto; padding:16px; background:#0d0908; border-radius:12px; font-size:12px; }
        @media (max-width:720px) {
          .jev-shell { padding-top:40px; }
          .jev-results { grid-template-columns:1fr; }
          .jev-grid { grid-template-columns:1fr 1fr; }
        }
      `}</style>
    </main>
  );
}
