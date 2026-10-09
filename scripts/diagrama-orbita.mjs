/* Gera os dois desenhos "high-tech" da página de oferta (SVG inline com animação):
   o diagrama do método (5 aulas em volta do Claude, estilo radar) e o do Manual (o Claude como
   um chip, com 8 recursos ligados por trilhas, estilo placa de circuito).

   Uso:  node scripts/diagrama-orbita.mjs              atualiza a página de oferta + o arquivo avulso
         node scripts/diagrama-orbita.mjs --bootstrap  só na primeira vez: coloca os marcadores na página

   A página (originais/claude-do-zero.html) recebe cada desenho entre marcadores
   (DIAGRAMA:INI/FIM e DIAGRAMA-MANUAL:INI/FIM) e o CSS entre DIAGRAMA-CSS:INI/FIM.
   Não edite o que está entre os marcadores: mude CFG aqui e rode de novo.

   Como os desenhos são construídos (tudo em um viewBox de 600 x 600, centro em 300,300):
   1. Anéis e marcas: círculos com stroke-dasharray. A marca fina é 1 traço a cada 6 graus
      (circunferência / 60); a marca laranja é 1 a cada 30 graus (circunferência / 12).
   2. Posição de um ponto na órbita: x = C + r * cos(ângulo), y = C + r * sin(ângulo).
      Os itens ficam em ângulos iguais (360 / n), começando às 12h (-90 graus).
   3. Chips numerados nessas posições, ligados ao centro por linhas com nós luminosos;
      pontinhos de dados (com halo) correm pelas linhas com animateMotion.
   4. Atmosfera: reflexos diagonais, flares, partículas que piscam e circuitos nos cantos.
      As partículas usam uma semente fixa, então o desenho é sempre o mesmo.
   5. Brilho: filtros de desfoque só em peças PARADAS. Peças que giram usam gradientes e
      traços largos de baixa opacidade, para a animação ficar leve no celular.
   6. Radar, anel de marcas e núcleo giram ou pulsam por CSS (.spin, .spin-rev, .pulse).
      Com "reduzir movimento" no sistema, tudo para.
   7. CFG.orbitar = true faz as aulas girarem em volta do centro (.orbita); cada chip gira ao
      contrário (.contra) para o número ficar em pé. Nesse modo os nomes saem do desenho. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAGINA = path.join(ROOT, 'originais', 'claude-do-zero.html');
const LOGO = path.join(ROOT, 'public', 'icones', 'claude.svg');
const AVULSO = 'C:/Users/Jaya/Projetos/ecosistema-jaya/jaya/diagrama-claude-do-zero.html';

export const CFG = {
  aulas: ['Conversar', 'Trabalhar', 'Documento Mestre', 'Autoconhecimento', 'Landing Page'], // nomes completos (aria-label)
  rotulos: [['Conversar'], ['Trabalhar'], ['Documento', 'Mestre'], ['Auto', 'conhecimento'], ['Landing', 'Page']], // o que aparece no desenho, uma linha por item
  destaque: 2, // índice da aula em marsala (a 3, Documento Mestre)
  orbitar: false, // true: as aulas giram em volta do Claude (sem nomes no desenho)
  periodoOrbita: '90s', // uma volta das aulas, se orbitar; menor = mais rápido
  raioOrbita: 108, // onde as aulas ficam (menor = nomes mais longe do anel graduado)
  raioSatelites: 235, // onde Mapa e Manual ficam
  angulosSatelites: [-48, 132],
  raioAnel: 243, // anel fino
  raioMarcas: 258, // anel graduado
  recursosManual: 8, // quantos recursos no Manual (layout fixo de 2 colunas de 4)
  nomesManual: ['Projects', 'Memória', 'Artifacts', 'Busca web', 'Arquivos', 'Conectores', 'Office', 'Code & Cowork'], // um por pad, na ordem 01 a 08; aparece embaixo do pad
  fonteTitulo: 'Petrona, Georgia, serif',
  fonteMono: 'ui-monospace, Consolas, monospace',
  cores: { tinta: '#12363f', cobre: '#df6e36', brilho: '#ff8a50', marsala: '#86050c', papel: '#fffdf8', creme: '#fff6ee' },
};

const C = 300;
const f = (x) => Number(x.toFixed(1));
const ponto = (r, graus) => [C + r * Math.cos((graus * Math.PI) / 180), C + r * Math.sin((graus * Math.PI) / 180)];
const hex = (cx, cy, r) =>
  [-90, -30, 30, 90, 150, 210].map((g) => ponto(r, g).map((v, i) => f(v - C + (i ? cy : cx)))).map((p) => p.join(',')).join(' ');
/* gerador pseudoaleatório com semente (mulberry32): mesmas partículas a cada rodada */
function rng(semente) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const CSS_DIAGRAMA = `
  .hero-art {
    border: 1px solid var(--linha); border-radius: 24px; padding: 4px; position: relative; overflow: hidden;
    background:
      radial-gradient(circle at 50% 50%, rgba(223,110,54,.20) 0, rgba(223,110,54,0) 55%),
      linear-gradient(rgba(18,54,63,.06) 1px, transparent 1px) 0 0 / 28px 28px,
      linear-gradient(90deg, rgba(18,54,63,.06) 1px, transparent 1px) 0 0 / 28px 28px,
      linear-gradient(160deg, #fffdf8 0%, #fbf1e4 100%);
    box-shadow: 0 18px 40px -26px rgba(134,5,12,.35);
  }
  .orbit { width: 100%; height: auto; display: block; }
  .manual-art {
    padding: 4px; display: grid; place-items: center;
    background:
      radial-gradient(circle at 50% 50%, rgba(223,110,54,.20) 0, rgba(223,110,54,0) 55%),
      linear-gradient(rgba(18,54,63,.06) 1px, transparent 1px) 0 0 / 28px 28px,
      linear-gradient(90deg, rgba(18,54,63,.06) 1px, transparent 1px) 0 0 / 28px 28px,
      linear-gradient(160deg, #fffdf8 0%, #fbf1e4 100%);
  }
  .manual-art svg { width: 100%; height: auto; max-height: 350px; display: block; }
  .spin { transform-origin: 300px 300px; animation: spin 14s linear infinite; }
  .spin-rev { transform-origin: 300px 300px; animation: spin 60s linear infinite reverse; }
  .orbita { transform-origin: 300px 300px; animation: spin var(--orbita, 90s) linear infinite; }
  .contra { transform-box: fill-box; transform-origin: center; animation: spin var(--orbita, 90s) linear infinite reverse; }
  .pulse { transform-origin: 300px 300px; animation: pulse 4s ease-in-out infinite; }
  .tw { animation: tw 5s ease-in-out infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: .5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
  @keyframes tw { 0%, 100% { opacity: .2; } 50% { opacity: 1; } }
  @keyframes scan { from { transform: translateY(-175px); } to { transform: translateY(175px); } }
  .scan { animation: scan 6s ease-in-out infinite alternate; }
  @media (prefers-reduced-motion: reduce) { .spin, .spin-rev, .orbita, .contra, .pulse, .scan, .tw { animation: none; } .dado { display: none; } }
`;

/* ---------- pedaços comuns aos dois desenhos ---------- */
function defs(p) {
  const { cores: k } = CFG;
  const [vx, vy] = ponto(205, -40);
  const cunha = `M${C} ${C} L${C + 205} ${C} A205 205 0 0 0 ${f(vx)} ${f(vy)} Z`;
  return `<defs>
        <radialGradient id="${p}aura" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${k.cobre}" stop-opacity=".55"/><stop offset="1" stop-color="${k.cobre}" stop-opacity="0"/></radialGradient>
        <radialGradient id="${p}halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${k.brilho}" stop-opacity=".75"/><stop offset="1" stop-color="${k.brilho}" stop-opacity="0"/></radialGradient>
        <radialGradient id="${p}flare" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".4" stop-color="#ffd9b8" stop-opacity=".4"/><stop offset="1" stop-color="#ffd9b8" stop-opacity="0"/></radialGradient>
        <radialGradient id="${p}flare2" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${k.brilho}" stop-opacity=".55"/><stop offset="1" stop-color="${k.brilho}" stop-opacity="0"/></radialGradient>
        <linearGradient id="${p}streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <linearGradient id="${p}varre" gradientUnits="userSpaceOnUse" x1="${C + 205}" y1="${C}" x2="${f(vx)}" y2="${f(vy)}"><stop offset="0" stop-color="${k.cobre}" stop-opacity=".42"/><stop offset="1" stop-color="${k.cobre}" stop-opacity="0"/></linearGradient>
        <linearGradient id="${p}nucleo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${k.papel}"/><stop offset="1" stop-color="#f6e2cc"/></linearGradient>
        <linearGradient id="${p}chipfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#f7e8d6"/></linearGradient>
        <linearGradient id="${p}rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a60"/><stop offset=".3" stop-color="${k.tinta}"/><stop offset=".7" stop-color="${k.tinta}"/><stop offset="1" stop-color="#ff7a3d"/></linearGradient>
        <filter id="${p}sombra" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${k.marsala}" flood-opacity=".22"/></filter>
        <filter id="${p}glowS" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="${p}glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${p}cunha"><path d="${cunha}"/></clipPath>
      </defs>`;
}

/* reflexos, flares, partículas e circuitos nos cantos: tudo atrás das peças principais */
function atmosfera(p, semente) {
  const { cores: k } = CFG;
  const r = rng(semente);
  const particulas = Array.from({ length: 26 }, () => {
    const x = 14 + r() * 572;
    const y = 14 + r() * 572;
    const s = 0.6 + r() * 1.6;
    const op = 0.35 + r() * 0.5;
    const atraso = f(r() * 6);
    return `<g class="tw" style="animation-delay:-${atraso}s" opacity="${f(op)}"><circle cx="${f(x)}" cy="${f(y)}" r="${f(s * 7)}" fill="url(#${p}halo)"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(s * 1.2)}" fill="#fff"/></g>`;
  }).join('');
  const canto = `<path d="M24 100V150L44 170V225"/><path d="M74 24H140L158 42H216"/>`;
  const cantoPontos = `<circle cx="44" cy="225" r="3"/><circle cx="216" cy="42" r="3"/><circle cx="24" cy="100" r="2.4"/>`;
  const baixo = `<path d="M24 500V450L44 430V375"/>`;
  const baixoPontos = `<circle cx="44" cy="375" r="3"/><circle cx="24" cy="500" r="2.4"/>`;
  const espelho = (dentro, ex, ey) => `<g transform="translate(${ex} ${ey}) scale(${ex ? -1 : 1} ${ey ? -1 : 1})">${dentro}</g>`;
  return `<!-- atmosfera -->
      <g opacity=".9">
        <polygon points="420,0 500,0 170,600 90,600" fill="url(#${p}streak)" opacity=".30"/>
        <polygon points="520,0 565,0 335,600 290,600" fill="url(#${p}streak)" opacity=".22"/>
        <polygon points="150,0 185,0 -30,430 -65,430" fill="url(#${p}streak)" opacity=".18"/>
        <circle cx="575" cy="35" r="150" fill="url(#${p}flare)" opacity=".6"/>
        <circle cx="25" cy="575" r="125" fill="url(#${p}flare2)" opacity=".45"/>
      </g>
      <g fill="none" stroke="${k.tinta}" stroke-width="1.2" opacity=".4" stroke-linejoin="round">
        ${canto}${espelho(canto, 600, 0)}${baixo}${espelho(baixo, 600, 0)}
      </g>
      <g fill="${k.cobre}" opacity=".85">${cantoPontos}${espelho(cantoPontos, 600, 0)}${baixoPontos}${espelho(baixoPontos, 600, 0)}</g>
      <g>${particulas}</g>`;
}

function moldura(textoEsq, textoDir) {
  const { cores: k, fonteMono: M } = CFG;
  return `<g fill="none" stroke="${k.tinta}" stroke-width="2.4" opacity=".7" stroke-linecap="square">
        <path d="M18 52V18H52"/><path d="M548 18H582V52"/><path d="M18 548V582H52"/><path d="M582 548V582H548"/>
      </g>
      <g font-family="${M}" font-size="11" letter-spacing="1.6" fill="${k.tinta}" opacity=".8">
        <text x="30" y="40"><tspan fill="${k.cobre}">//</tspan>${textoEsq}</text>
        <text x="570" y="570" text-anchor="end">${textoDir}</text>
      </g>`;
}

function aneis(raioInterno) {
  const { cores: k, fonteMono: M } = CFG;
  const cMarcas = 2 * Math.PI * CFG.raioMarcas;
  const longa = `stroke-dasharray="2.4 ${f(cMarcas / 12 - 2.4)}"`;
  return `<g class="spin-rev">
        <circle cx="${C}" cy="${C}" r="${CFG.raioMarcas}" fill="none" stroke="${k.tinta}" stroke-width="7" stroke-dasharray="1.4 ${f(cMarcas / 60 - 1.4)}" opacity=".5"/>
        <circle cx="${C}" cy="${C}" r="${CFG.raioMarcas}" fill="none" stroke="${k.brilho}" stroke-width="32" ${longa} opacity=".16"/>
        <circle cx="${C}" cy="${C}" r="${CFG.raioMarcas}" fill="none" stroke="${k.brilho}" stroke-width="20" ${longa} opacity=".22"/>
        <circle cx="${C}" cy="${C}" r="${CFG.raioMarcas}" fill="none" stroke="${k.cobre}" stroke-width="15" ${longa} opacity=".95"/>
      </g>
      <circle cx="${C}" cy="${C}" r="${CFG.raioAnel}" fill="none" stroke="${k.tinta}" stroke-width="1" opacity=".4"/>
      <circle cx="${C}" cy="${C}" r="225" fill="none" stroke="${k.tinta}" stroke-width="1" stroke-dasharray="1 5" opacity=".3"/>
      <circle cx="${C}" cy="${C}" r="205" fill="none" stroke="${k.cobre}" stroke-width="1" opacity=".3"/>
      <circle cx="${C}" cy="${C}" r="165" fill="none" stroke="${k.cobre}" stroke-width="1" stroke-dasharray="2 7" opacity=".6"/>
      <circle cx="${C}" cy="${C}" r="${raioInterno}" fill="none" stroke="${k.tinta}" stroke-width="1" opacity=".3"/>
      <circle cx="${C}" cy="${C}" r="${raioInterno - 40}" fill="none" stroke="${k.cobre}" stroke-width=".8" stroke-dasharray="1 4" opacity=".4"/>
      <g font-family="${M}" font-size="10" fill="${k.tinta}" opacity=".7" text-anchor="middle">
        <text x="${C}" y="24">000</text><text x="${C}" y="587">180</text>
        <text x="583" y="304" text-anchor="end">090</text><text x="17" y="304" text-anchor="start">270</text>
      </g>`;
}

/* radar com grade dentro da cunha */
function radar(p) {
  const { cores: k } = CFG;
  const [vx, vy] = ponto(205, -40);
  const raios = Array.from({ length: 6 }, (_, i) => {
    const [x, y] = ponto(205, -i * 8);
    return `<line x1="${C}" y1="${C}" x2="${f(x)}" y2="${f(y)}"/>`;
  }).join('');
  const arcos = [60, 110, 160, 205]
    .map((r) => {
      const [x, y] = ponto(r, -40);
      return `<path d="M${C + r} ${C} A${r} ${r} 0 0 0 ${f(x)} ${f(y)}"/>`;
    })
    .join('');
  return `<g class="spin"><path d="M${C} ${C} L${C + 205} ${C} A205 205 0 0 0 ${f(vx)} ${f(vy)} Z" fill="url(#${p}varre)"/>
        <g clip-path="url(#${p}cunha)" stroke="${k.cobre}" stroke-width=".8" opacity=".4" fill="none">${raios}${arcos}</g>
        <line x1="${C}" y1="${C}" x2="${C + 205}" y2="${C}" stroke="${k.brilho}" stroke-width="1.6" opacity=".9"/></g>`;
}

const trilhas = (p, nos) => `<g stroke="${CFG.cores.tinta}" stroke-width="1.3" opacity=".6" fill="none">${nos.map((o, i) => `<path id="${p}t${i + 1}" d="M${C} ${C} L${o.x} ${o.y}"/>`).join('')}</g>`;
/* pontinho de dados com halo: o grupo inteiro anda pela linha */
const dados = (p, nos, dur = 3.2) =>
  `<g>${nos.map((_, i) => `<g class="dado"><circle r="9" fill="url(#${p}halo)"/><circle r="3.6" fill="${CFG.cores.cobre}"/><animateMotion dur="${dur}s" repeatCount="indefinite" begin="${f(-i * (dur / nos.length))}s"><mpath href="#${p}t${i + 1}"/></animateMotion></g>`).join('')}</g>`;
/* nós luminosos nas duas pontas de cada linha, como nas imagens */
function nosLuminosos(p, nos) {
  const { cores: k } = CFG;
  return `<g>${nos
    .map((o) => {
      const d = Math.hypot(o.x - C, o.y - C);
      const ux = (o.x - C) / d;
      const uy = (o.y - C) / d;
      return [78, d - 37].map((r) => `<circle cx="${f(C + ux * r)}" cy="${f(C + uy * r)}" r="12" fill="url(#${p}halo)"/><circle cx="${f(C + ux * r)}" cy="${f(C + uy * r)}" r="4.3" fill="${k.cobre}"/>`).join('');
    })
    .join('')}</g>`;
}

/* chip numerado: quadrado de cantos redondos ou octógono; luz na borda e brilho por trás */
function chip(o, p, tam, classe, destaque, fonte = tam > 50 ? 17 : 15, forma = 'quadrado') {
  const { cores: k, fonteMono: M } = CFG;
  const m = tam / 2;
  const c = 13;
  const oct = [[-m + c, -m], [m - c, -m], [m, -m + c], [m, m - c], [m - c, m], [-m + c, m], [-m, m - c], [-m, -m + c]].map((q) => q.join(',')).join(' ');
  const desenho = (attrs) => (forma === 'octogono' ? `<polygon points="${oct}" ${attrs}/>` : `<rect x="-${m}" y="-${m}" width="${tam}" height="${tam}" rx="${tam > 50 ? 12 : 11}" ${attrs}/>`);
  const luz = destaque ? '#ff5a4a' : k.brilho;
  const acentos =
    forma === 'octogono'
      ? `<path d="M${-m + c} ${-m}L${-m} ${-m + c}" stroke="${destaque ? '#ffb27a' : k.cobre}" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M${m - c} ${m}L${m} ${m - c}" stroke="${destaque ? '#ffb27a' : k.cobre}" stroke-width="3" stroke-linecap="round" fill="none"/>`
      : `<path d="M-${m} -${m - 13}V-${m}H-${m - 13}" fill="none" stroke="${destaque ? '#ffb27a' : k.cobre}" stroke-width="2" stroke-linecap="round"/><path d="M${m} ${m - 13}V${m}H${m - 13}" fill="none" stroke="${destaque ? '#ffb27a' : k.cobre}" stroke-width="2" stroke-linecap="round" opacity=".85"/>`;
  return `<g transform="translate(${o.x} ${o.y})"><g${classe ? ` class="${classe}"` : ''}>
          ${desenho(`fill="none" stroke="${luz}" stroke-width="3" opacity=".55" filter="url(#${p}glowS)"`)}
          ${desenho(`fill="${destaque ? k.marsala : `url(#${p}chipfill)`}" stroke="${destaque ? '#ff6a5a' : `url(#${p}rim)`}" stroke-width="1.8"`)}
          <path d="M${-m + 9} ${-m + 3.5}H${m - 9}" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity="${destaque ? 0.5 : 0.95}"/>
          ${acentos}
          <text y="${Math.round(fonte * 0.36)}" text-anchor="middle" font-family="${M}" font-size="${fonte}" font-weight="700" fill="${destaque ? k.creme : k.marsala}">${o.numero}</text>
        </g></g>`;
}

/* ---------- diagrama do método: 5 aulas em volta do Claude ---------- */
export function svg() {
  const { cores: k, fonteMono: M } = CFG;
  const n = CFG.aulas.length;
  const nos = CFG.aulas.map((nome, i) => {
    const [x, y] = ponto(CFG.raioOrbita, -90 + (i * 360) / n);
    return { nome, linhas: CFG.rotulos[i] ?? [nome], x: f(x), y: f(y), numero: String(i + 1).padStart(2, '0'), destaque: i === CFG.destaque };
  });
  const chips = nos.map((o) => chip(o, '', 54, CFG.orbitar ? 'contra' : '', o.destaque)).join('\n        ');

  // nomes em volta das aulas (só quando elas ficam paradas); nomes de duas palavras ficam em duas linhas
  const rotulos = CFG.orbitar
    ? ''
    : `<g class="lbl" font-family="${M}" font-size="12" font-weight="700" letter-spacing="1.4" fill="${k.tinta}">
        ${nos
          .map((o) => {
            const cos = (o.x - C) / CFG.raioOrbita;
            const linhas = o.linhas.map((l) => l.toUpperCase());
            const entre = 14; // distância entre as linhas de um mesmo nome
            const texto = (x, yBase, ancora) => linhas.map((l, j) => `<text x="${x}" y="${f(yBase + j * entre)}" text-anchor="${ancora}">${l}</text>`).join('');
            if (Math.abs(cos) < 0.2) {
              // em cima, a última linha fica rente ao chip; embaixo, a primeira
              return o.y < C ? texto(o.x, o.y - 39 - (linhas.length - 1) * entre, 'middle') : texto(o.x, o.y + 46, 'middle');
            }
            const yBase = o.y + 4 - ((linhas.length - 1) * entre) / 2; // centraliza o bloco na altura do chip
            return cos > 0 ? texto(f(o.x + 37), yBase, 'start') : texto(f(o.x - 37), yBase, 'end');
          })
          .join('\n        ')}
      </g>`;

  const corpo = `${trilhas('', nos)}${nosLuminosos('', nos)}${dados('', nos)}
        ${chips}`;
  const miolo = CFG.orbitar ? `<g class="orbita">${corpo}</g>` : `${corpo}
      ${rotulos}`;

  // Mapa: hexágono com bússola. Manual: hexágono com 8 pontos.
  const sat = CFG.angulosSatelites.map((g) => ponto(CFG.raioSatelites, g).map(f));
  const [mx, my] = sat[0];
  const [qx, qy] = sat[1];
  const oito = Array.from({ length: 8 }, (_, i) => `<circle cx="${f(qx + 12 * Math.cos((i * Math.PI) / 4))}" cy="${f(qy + 12 * Math.sin((i * Math.PI) / 4))}" r="3.6"/>`).join('');
  const hexagono = (cx, cy) => `<polygon points="${hex(cx, cy, 30)}" fill="url(#chipfill)" stroke="url(#rim)" stroke-width="2"/>`;

  return `<svg class="orbit" style="--orbita:${CFG.periodoOrbita}" viewBox="0 0 600 600" role="img" aria-label="Diagrama em estilo instrumento técnico: no centro o ícone do Claude, em volta as ${n} aulas (${CFG.aulas.join(', ')}) e, na órbita de fora, o Mapa de Autoconhecimento e o Manual dos 8 recursos">
      ${defs('')}

      ${atmosfera('', 7)}
      ${moldura(' CLAUDE DO ZERO', `${String(n).padStart(2, '0')} AULAS . 02 FERRAMENTAS`)}
      ${aneis(CFG.raioOrbita)}
      ${radar('')}

      ${miolo}

      <circle class="pulse" cx="${C}" cy="${C}" r="100" fill="url(#aura)"/>
      <circle cx="${C}" cy="${C}" r="62" fill="none" stroke="${k.brilho}" stroke-width="3" opacity=".8" filter="url(#glowS)"/>
      <g class="spin-rev"><circle cx="${C}" cy="${C}" r="72" fill="none" stroke="${k.cobre}" stroke-width="1.5" stroke-dasharray="4 6"/></g>
      <circle cx="${C}" cy="${C}" r="52" fill="url(#nucleo)" stroke="${k.cobre}" stroke-width="2" filter="url(#sombra)"/>
      <use href="#claude" x="${C - 34}" y="${C - 34}" width="68" height="68"/>

      <g>
        <polygon points="${hex(mx, my, 30)}" fill="none" stroke="${k.brilho}" stroke-width="3" opacity=".5" filter="url(#glowS)"/>
        <polygon points="${hex(qx, qy, 30)}" fill="none" stroke="${k.brilho}" stroke-width="3" opacity=".5" filter="url(#glowS)"/>
        ${hexagono(mx, my)}${hexagono(qx, qy)}
      </g>
      <circle cx="${mx}" cy="${my}" r="14" fill="none" stroke="${k.tinta}" stroke-width="1.5"/>
      <polygon points="${mx},${f(my - 14.4)} ${f(mx + 4.2)},${my} ${mx},${f(my + 14.4)} ${f(mx - 4.2)},${my}" fill="${k.cobre}"/>
      <polygon points="${mx},${f(my - 14.4)} ${f(mx + 4.2)},${my} ${f(mx - 4.2)},${my}" fill="${k.marsala}"/>
      <g fill="${k.cobre}">${oito}</g>
      <g font-family="${M}" font-size="12" font-weight="700" letter-spacing="2" fill="${k.marsala}" text-anchor="middle">
        <text x="${mx}" y="${f(my + 57)}">MAPA</text><text x="${qx}" y="${f(qy + 57)}">MANUAL 8</text>
      </g>
    </svg>`;
}

/* ---------- diagrama do Manual: o Claude como um chip, com 8 recursos ligados por trilhas ----------
   Outra composição, a mesma linguagem: papel, grade, tinta, cobre e marsala. Em vez de órbita,
   uma placa de circuito. O logo do Claude fica no chip do meio; oito trilhas saem dele, quatro
   para cada lado, e chegam a oito pads octogonais numerados. Pontinhos de dados correm pelas
   trilhas e uma linha de varredura passa por cima da placa.
   Geometria: o chip é um quadrado de 150 centrado em (300,300). As trilhas saem de pinos nas
   laterais do chip, andam na horizontal, sobem ou descem em ângulo reto e entram no pad. Cada
   trilha usa uma distância diferente para o desvio vertical, para nenhuma cruzar a outra.
   Layout fixo para 8 recursos (2 colunas de 4). */
export function svgManual() {
  const { cores: k, fonteTitulo: T } = CFG;
  const n = CFG.recursosManual;
  const yPads = [150, 250, 350, 450]; // altura dos pads, de cima para baixo
  const yPinos = [262, 287, 313, 338]; // pinos do chip de onde as trilhas saem
  const desvio = [110, 130, 130, 110]; // distância do centro até o desvio vertical de cada trilha
  const metade = n / 2;
  const nos = [];
  const trilhasM = [];
  const vias = [];
  for (let lado = 0; lado < 2; lado++) {
    const s = lado === 0 ? -1 : 1; // -1 esquerda, +1 direita
    for (let j = 0; j < metade; j++) {
      const i = lado * metade + j;
      nos.push({ x: C + s * 212, y: yPads[j], numero: String(i + 1).padStart(2, '0'), nome: CFG.nomesManual[i] });
      trilhasM.push({ id: `mt${i + 1}`, d: `M${C + s * 75} ${yPinos[j]} H${C + s * desvio[j]} V${yPads[j]} H${C + s * 184}` });
      for (const yy of [yPinos[j], yPads[j]]) vias.push(`<circle cx="${C + s * desvio[j]}" cy="${yy}" r="11" fill="url(#mhalo)"/><circle cx="${C + s * desvio[j]}" cy="${yy}" r="3.8" fill="${k.cobre}"/>`);
    }
  }
  const pads = nos.map((o) => chip(o, 'm', 58, '', false, 21, 'octogono')).join('\n      ');
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const nomes = nos.map((o) => `<text x="${o.x}" y="${o.y + 48}" text-anchor="middle" font-family="${T}" font-weight="600" font-size="22" fill="${k.tinta}">${esc(o.nome)}</text>`).join('\n      ');
  const rastros = trilhasM.map((t) => `<path id="${t.id}" d="${t.d}"/>`).join('');
  const dadosM = trilhasM.map((t, i) => `<g class="dado"><circle r="9" fill="url(#mhalo)"/><circle r="3.8" fill="${k.cobre}"/><animateMotion dur="3.4s" repeatCount="indefinite" begin="${f(-i * (3.4 / trilhasM.length))}s"><mpath href="#${t.id}"/></animateMotion></g>`).join('');
  const pinosLaterais = [237, 262, 287, 313, 338, 363].flatMap((y) => [`<rect x="211" y="${y - 3}" width="14" height="6" rx="1.5"/>`, `<rect x="375" y="${y - 3}" width="14" height="6" rx="1.5"/>`]).join('');
  const pinosVerticais = [250, 270, 290, 310, 330, 350].flatMap((x) => [`<rect x="${x - 3}" y="211" width="6" height="14" rx="1.5"/>`, `<rect x="${x - 3}" y="375" width="6" height="14" rx="1.5"/>`]).join('');

  return `<svg viewBox="0 0 600 600" role="img" aria-label="Diagrama em estilo placa de circuito: o ícone do Claude em um chip no centro, com oito trilhas saindo dele até oito recursos numerados de 01 a 08: ${esc(CFG.nomesManual.join(', '))}">
      ${defs('m')}
      <defs><linearGradient id="mscan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${k.cobre}" stop-opacity="0"/><stop offset=".5" stop-color="${k.brilho}" stop-opacity=".85"/><stop offset="1" stop-color="${k.cobre}" stop-opacity="0"/></linearGradient></defs>

      ${atmosfera('m', 21)}
      ${moldura(' MANUAL', `${String(n).padStart(2, '0')} RECURSOS`)}

      <!-- contornos em volta do chip -->
      <rect x="185" y="185" width="230" height="230" rx="28" fill="none" stroke="${k.tinta}" stroke-width="1" opacity=".3"/>
      <rect x="160" y="160" width="280" height="280" rx="38" fill="none" stroke="${k.cobre}" stroke-width="1" stroke-dasharray="2 7" opacity=".6"/>
      <circle cx="${C}" cy="${C}" r="205" fill="none" stroke="${k.cobre}" stroke-width=".8" stroke-dasharray="1 5" opacity=".35"/>

      <!-- trilhas decorativas que não levam a nada, só para a placa parecer uma placa -->
      <g fill="none" stroke="${k.tinta}" stroke-width="1.2" opacity=".32" stroke-linejoin="round">
        <path d="M270 211V150H238V108"/><path d="M330 211V150H362V108"/><path d="M270 389V450H238V492"/><path d="M330 389V450H362V492"/>
      </g>
      <g fill="none" stroke="${k.tinta}" stroke-width="1.4" opacity=".4"><circle cx="238" cy="104" r="5"/><circle cx="362" cy="104" r="5"/><circle cx="238" cy="496" r="5"/><circle cx="362" cy="496" r="5"/></g>

      <!-- as oito trilhas, as vias luminosas nas dobras e os pontinhos de dados -->
      <g fill="none" stroke="${k.tinta}" stroke-width="1.8" opacity=".65" stroke-linejoin="round" stroke-linecap="round">${rastros}</g>
      <g>${vias.join('')}</g>
      <g>${dadosM}</g>

      <!-- varredura -->
      <g class="scan"><rect x="62" y="298" width="476" height="3" fill="url(#mscan)"/></g>

      <!-- chip com o ícone do Claude -->
      <circle class="pulse" cx="${C}" cy="${C}" r="125" fill="url(#maura)"/>
      <g fill="${k.brilho}" stroke="${k.cobre}" stroke-width=".8" filter="url(#mglowS)">${pinosLaterais}${pinosVerticais}</g>
      <rect x="225" y="225" width="150" height="150" rx="18" fill="none" stroke="${k.brilho}" stroke-width="4" opacity=".5" filter="url(#mglow)"/>
      <rect x="225" y="225" width="150" height="150" rx="18" fill="url(#mchipfill)" stroke="url(#mrim)" stroke-width="2.4" filter="url(#msombra)"/>
      <path d="M241 229H359" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".95"/>
      <rect x="246" y="246" width="108" height="108" rx="12" fill="url(#mnucleo)" stroke="${k.cobre}" stroke-width="2" filter="url(#mglowS)"/>
      <circle cx="238" cy="238" r="3" fill="${k.cobre}"/>
      <use href="#claude" x="${C - 40}" y="${C - 40}" width="80" height="80"/>
      <circle cx="372" cy="228" r="17" fill="${k.marsala}" stroke="${k.papel}" stroke-width="2"/>
      <text x="372" y="236" text-anchor="middle" font-family="${T}" font-weight="600" font-size="22" fill="${k.creme}">${n}</text>

      <!-- os oito recursos -->
      ${pads}
      ${nomes}
    </svg>`;
}

/* ---------- escrita ---------- */
const blocoMetodo = () => `<!-- DIAGRAMA:INI -->\n      <div class="hero-art">\n      ${svg()}\n      </div>\n      <!-- DIAGRAMA:FIM -->`;
const blocoManual = () => `<!-- DIAGRAMA-MANUAL:INI -->\n        <div class="manual-art">\n        ${svgManual()}\n        </div>\n        <!-- DIAGRAMA-MANUAL:FIM -->`;
const cssBloco = () => `/* DIAGRAMA-CSS:INI */${CSS_DIAGRAMA}  /* DIAGRAMA-CSS:FIM */`;

function trocar(texto, ini, fim, novo) {
  const a = texto.indexOf(ini);
  const b = texto.indexOf(fim, a);
  if (a < 0 || b < 0) throw new Error('marcador não encontrado: ' + ini);
  return texto.slice(0, a) + novo + texto.slice(b + fim.length);
}

if (process.argv.includes('--bootstrap')) {
  let h = fs.readFileSync(PAGINA, 'utf8');
  if (!h.includes('DIAGRAMA:INI')) throw new Error('a página precisa já ter os marcadores do diagrama do método');
  if (!h.includes('DIAGRAMA-MANUAL:INI')) {
    const a = h.indexOf('<div class="manual-art"');
    const fimSvg = h.indexOf('</svg>', a) + '</svg>'.length;
    const fimDiv = h.indexOf('</div>', fimSvg) + '</div>'.length;
    h = h.slice(0, a) + '<!-- DIAGRAMA-MANUAL:INI -->\n        <!-- DIAGRAMA-MANUAL:FIM -->' + h.slice(fimDiv);
    console.log('marcadores do Manual colocados');
  }
  fs.writeFileSync(PAGINA, h);
}

let h = fs.readFileSync(PAGINA, 'utf8');
h = trocar(h, '<!-- DIAGRAMA:INI -->', '<!-- DIAGRAMA:FIM -->', blocoMetodo());
h = trocar(h, '<!-- DIAGRAMA-MANUAL:INI -->', '<!-- DIAGRAMA-MANUAL:FIM -->', blocoManual());
h = trocar(h, '/* DIAGRAMA-CSS:INI */', '/* DIAGRAMA-CSS:FIM */', cssBloco());
fs.writeFileSync(PAGINA, h);
console.log('+ diagramas na página (' + CFG.aulas.length + ' aulas' + (CFG.orbitar ? ', em órbita, volta em ' + CFG.periodoOrbita : ', paradas') + '; ' + CFG.recursosManual + ' recursos no Manual)');

// arquivo avulso, para abrir direto no navegador
const logo = fs.readFileSync(LOGO, 'utf8');
const simbolo = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="claude" viewBox="0 0 1200 1200">${logo.slice(logo.indexOf('<g'), logo.lastIndexOf('</svg>'))}</symbol></svg>`;
fs.writeFileSync(
  AVULSO,
  `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Diagramas Claude do Zero</title>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;600&family=Petrona:wght@500;600&display=swap" rel="stylesheet">
<style>
  :root { --card: #fffdf8; --linha: #e7d6be; --areia-bg: #faf4ea; }
  body { margin: 0; background: var(--areia-bg); display: grid; gap: 28px; justify-items: center; padding: 24px 20px; }
  .caixa { width: min(640px, 100%); }
${CSS_DIAGRAMA}
  .caixa .manual-art { border: 1px solid var(--linha); border-radius: 24px; }
</style></head>
<body>
${simbolo}
<div class="caixa"><div class="hero-art">${svg()}</div></div>
<div class="caixa"><div class="manual-art">${svgManual()}</div></div>
</body></html>
`,
);
console.log('+ ' + AVULSO);
