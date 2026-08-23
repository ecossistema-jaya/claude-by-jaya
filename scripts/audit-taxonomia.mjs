/* Verifica se cada sinal da taxonomia da Carta de Travessia consegue disparar.

   Sinal inerte é o bug mais caro dessa taxonomia porque é silencioso: a condição
   nunca casa, o arcano nunca pontua, e o sintoma que aparece é "o scorer não gosta
   d'A Torre" — julgamento ruim, não encanamento quebrado. O JSON já corrigiu três à
   mão (sol_p2, amantes_s2, torre_p2, em notas_de_traducao); esta varredura existe
   para que não haja um quarto.

   Roda dentro de build-zona.mjs: editar docs/carta-travessia-1.1.json com defeito
   quebra o build em vez de degradar o scorer em silêncio. Avulso:

     npm run audit:taxonomia

   Três classes de achado:
     MORTO   — nenhuma resposta possível satisfaz a condição
     SEMPRE  — toda resposta possível satisfaz; o sinal não discrimina nada
     ESCALA  — opção da pergunta sem linha correspondente na tabela de escala

   Cobertura: só as condições sobre perguntas de múltipla escolha são conferíveis
   contra uma lista fechada. Campos de A/B/C, perguntas abertas e as condições
   semânticas do bloco D não têm lista de valores e passam sem checagem. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const TAXONOMIA = path.join(ROOT, 'docs', 'carta-travessia-1.1.json');
const FONTE = path.join(ROOT, 'originais', 'zona-de-genialidade.html');

/* Campos produzidos pelos blocos A, B e C, conforme os SCHEMAS de CHUNKS e os
   defaults de sanitize(). Lista mantida à mão — e de propósito: campo novo que não
   estiver aqui aparece como MORTO, que é falso positivo barulhento. A direção da
   falha importa mais que a exatidão da lista: errar para o lado de reclamar demais
   é seguro; errar para o lado de calar é o bug que este arquivo existe para pegar. */
const CAMPOS_ANALISE = new Set([
  'kolbe.investigador', 'kolbe.seguimento', 'kolbe.inicioRapido', 'kolbe.implementador',
  'zones.genialidade', 'zones.excelencia', 'zones.competencia', 'zones.incompetencia',
  'wealthProfile.name', 'fascinationProfile.name', 'profile.name',
  'uniqueAbility.description', 'uniqueAbility.alignment', 'uniqueAbility.timeInZone', 'uniqueAbility.potential',
  'hormozi.resultadoSonhado', 'hormozi.probabilidade', 'hormozi.tempoEspera', 'hormozi.esforco', 'hormozi.score',
  'convergence.labels', 'convergence.current', 'convergence.potential', 'convergence.insights',
  'actionPlan.thisWeek', 'actionPlan.nextTwoWeeks', 'actionPlan.nextMonth', 'actionPlan.doNot',
  'recommendation', 'timeDistribution.current', 'timeDistribution.target', 'talents',
  /* derivados: não existem como campo bruto, o scorer os calcula */
  'convergence.gaps_altos', 'energy_drena.count', 'uniqueAbility.receita_nao_realizada',
]);

const norm = (v) =>
  String(v == null ? '' : v).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

function cmpNum(op, a, b) {
  switch (op) {
    case 'gt': return a > b;
    case 'gte': return a >= b;
    case 'lt': return a < b;
    case 'lte': return a <= b;
    case 'eq': return a === b;
    case 'neq': return a !== b;
    default: return true;
  }
}

function satisfaz(op, opcao, valor) {
  const o = norm(opcao);
  switch (op) {
    case 'contains': return o.includes(norm(valor));
    case 'eq': return o === norm(valor);
    case 'neq': return o !== norm(valor);
    case 'in': return (Array.isArray(valor) ? valor : [valor]).some((x) => norm(x) === o);
    default: return true;   // exists e between não se decidem contra a lista de opções
  }
}

/** Extrai id → {tipo, opts} da constante QUESTIONS da página. É a lista de respostas
    que a pessoa pode de fato dar — a única referência que prova se um sinal dispara. */
function lerQuestions(html) {
  const linha = html.match(/^const QUESTIONS = (\[.*\]);$/m);
  if (!linha) throw new Error('const QUESTIONS não encontrada em originais/zona-de-genialidade.html');
  const mapa = {};
  for (const q of JSON.parse(linha[1])) mapa[q.id] = { tipo: q.type, opts: q.opts || [] };
  return mapa;
}

export function auditarTaxonomia({ tax, html } = {}) {
  tax = tax || JSON.parse(fs.readFileSync(TAXONOMIA, 'utf8'));
  const OPCOES = lerQuestions(html || fs.readFileSync(FONTE, 'utf8'));
  const achados = [];
  const anota = (sev, arcano, sinal, campo, msg) => achados.push({ sev, arcano, sinal, campo, msg });

  function folha(cond, arcano, sinal) {
    const campo = cond.campo;
    if (!campo) return;

    const ehPergunta = Object.prototype.hasOwnProperty.call(OPCOES, campo);
    const subCampoDePergunta = Object.prototype.hasOwnProperty.call(OPCOES, campo.split('.')[0]);
    if (!ehPergunta && !subCampoDePergunta && !CAMPOS_ANALISE.has(campo)) {
      anota('MORTO', arcano, sinal, campo, 'campo não existe nem em QUESTIONS nem nos schemas de A/B/C');
      return;
    }
    if (!ehPergunta) return;              // campo de análise ou sub-campo: sem lista fechada
    const { tipo, opts } = OPCOES[campo];
    if (!opts.length) return;             // pergunta aberta: qualquer texto é possível

    /* Condição com escala: o limiar tem de ser alcançável por algum valor da tabela,
       e toda opção da pergunta precisa de linha correspondente — senão a resposta da
       pessoa vira undefined e o sinal morre só para quem escolheu aquela opção. */
    if (cond.escala) {
      const tabela = tax.regras_globais.escalas[cond.escala] || [];
      const orfas = opts.filter((o) => !tabela.some((l) => norm(o).startsWith(norm(l.texto))));
      if (orfas.length) {
        anota('ESCALA', arcano, sinal, campo,
          `${orfas.length} opção(ões) sem linha na tabela ${cond.escala}, a primeira: ${JSON.stringify(orfas[0])}`);
      }
      const valores = tabela.map((l) => l.valor);
      if (!valores.some((v) => cmpNum(cond.op, v, cond.valor))) {
        anota('MORTO', arcano, sinal, campo,
          `nenhum valor da escala satisfaz ${cond.op} ${cond.valor} (valores: ${valores.join(', ')})`);
      }
      return;
    }

    /* As duas perguntas cujo texto vira número ou código antes de comparar. */
    if (campo === 'clarity_next_step') {
      const valores = tax.regras_globais.campos_canonicos_novos.clarity_next_step.opcoes.map((o) => o.valor);
      if (!valores.some((v) => cmpNum(cond.op, v, cond.valor))) {
        anota('MORTO', arcano, sinal, campo, `nenhum valor (${valores.join(', ')}) satisfaz ${cond.op} ${cond.valor}`);
      }
      return;
    }
    if (campo === 'initiative_stage') {
      const codigos = tax.regras_globais.campos_canonicos_novos.initiative_stage.opcoes.map((o) => o.codigo);
      const alcanca = cond.op === 'eq' ? codigos.includes(cond.valor)
        : cond.op === 'in' ? (cond.valor || []).some((v) => codigos.includes(v))
        : true;
      if (!alcanca) anota('MORTO', arcano, sinal, campo, `código "${cond.valor}" não está em ${codigos.join(', ')}`);
      return;
    }

    const casam = opts.filter((o) => satisfaz(cond.op, o, cond.valor));
    if (!casam.length) {
      anota('MORTO', arcano, sinal, campo, `nenhuma das ${opts.length} opções satisfaz ${cond.op} "${cond.valor}"`);
    } else if (casam.length === opts.length && cond.op !== 'neq' && tipo === 'multiple_choice') {
      anota('SEMPRE', arcano, sinal, campo, `todas as ${opts.length} opções satisfazem — o sinal não discrimina nada`);
    }
  }

  function percorrer(cond, arcano, sinal) {
    if (!cond || typeof cond !== 'object') return;
    if (Array.isArray(cond.all)) return cond.all.forEach((c) => percorrer(c, arcano, sinal));
    if (Array.isArray(cond.any)) return cond.any.forEach((c) => percorrer(c, arcano, sinal));
    if (cond.avaliacao_bloco_d) return;   // semântica: só o árbitro resolve
    folha(cond, arcano, sinal);
  }

  let total = 0;
  for (const arc of tax.arcanos) {
    const rot = `${arc.romano} ${arc.nome}`;
    for (const s of arc.sinais || []) { total++; percorrer(s.condicao, rot, s.id); }
    for (const c of arc.contra_sinais || []) { total++; percorrer(c.condicao, rot, c.id); }
  }
  return { total, achados };
}

/** Formata para o console; devolve string vazia quando não há nada a dizer. */
export function formatarAchados(achados) {
  return achados
    .map((a) => `  [${a.sev}] ${a.arcano} · ${a.sinal} · ${a.campo}\n         ${a.msg}`)
    .join('\n');
}

/* Execução avulsa: npm run audit:taxonomia */
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const { total, achados } = auditarTaxonomia();
  if (!achados.length) {
    console.log(`✓ ${total} sinais auditados contra as perguntas reais: nenhum morto, nenhum sempre-ligado`);
    process.exit(0);
  }
  console.error(`✗ ${achados.length} problema(s) em ${total} sinais:\n${formatarAchados(achados)}`);
  process.exit(1);
}
