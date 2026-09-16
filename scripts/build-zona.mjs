/* Publica a Zona de Genialidade.

   originais/zona-de-genialidade.html é a fonte editável; protected/zona/index.html
   é o artefato completo, servido somente pela rota autenticada. public/zona/index.html
   é um redirecionamento seguro para a apresentação pública.

   A apresentação vive em app/zona-de-genialidade. O assessment completo sai de
   app/zona-de-genialidade/iniciar/route.ts depois de conferir login e convite.

   A cópia não é literal: a taxonomia da Carta de Travessia entra aqui. Ver
   injetarTaxonomia() abaixo. */
import fs from 'node:fs';
import path from 'node:path';
import { auditarTaxonomia, formatarAchados } from './audit-taxonomia.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const FONTE = path.join(ROOT, 'originais', 'zona-de-genialidade.html');
const DEST = path.join(ROOT, 'protected', 'zona', 'index.html');
const DEST_PUBLICO = path.join(ROOT, 'public', 'zona', 'index.html');
const TAXONOMIA = path.join(ROOT, 'docs', 'carta-travessia-1.1.json');

/* Marcadores no HTML-fonte. O miolo entre eles é substituído pela taxonomia podada;
   no fonte ele é `null`, e o scorer trata null como "sem taxonomia" e não roda. Por
   isso abrir originais/zona-de-genialidade.html direto no browser continua válido:
   a página inteira funciona, só o scorer fica inerte. */
const ABRE = '/*__TAX__*/';
const FECHA = '/*__/TAX__*/';

/* O JSON de docs/ é escrito para gente ler: metade dele é prosa que o runtime nunca
   consulta (pares, estado_de_carencia, eixo_exibido, saida, notas_de_traducao). Podar
   derruba 52KB para 29KB no arquivo servido, e a poda é projeção mecânica — nenhuma
   chave é reescrita, só omitida. O que sobra é exatamente o que pontuarArcanos() lê. */
function podar(tax) {
  return {
    versao: tax.versao,
    escalas: tax.regras_globais.escalas,
    arcanos: tax.arcanos.map((a) => ({
      id: a.id,
      nome: a.nome,
      romano: a.romano,
      sinais: (a.sinais || []).map((s) => ({
        id: s.id,
        tipo: s.tipo,
        fonte: s.fonte,
        familia_evidencia: s.familia_evidencia,
        peso: s.peso,
        condicao: s.condicao,
      })),
      contra_sinais: (a.contra_sinais || []).map((c) => ({
        id: c.id,
        fonte: c.fonte,
        efeito: c.efeito,
        classe: c.classe,
        condicao: c.condicao,
      })),
    })),
  };
}

/** Troca o miolo entre os marcadores pela taxonomia podada. Falta de marcador é erro
    de build, não aviso: o scorer sairia mudo e ninguém perceberia. */
function injetarTaxonomia(html) {
  if (!fs.existsSync(TAXONOMIA)) {
    throw new Error(`sem ${path.relative(ROOT, TAXONOMIA)}: a taxonomia da carta não tem de onde sair`);
  }
  const i = html.indexOf(ABRE);
  const f = html.indexOf(FECHA);
  if (i === -1 || f === -1 || f < i) {
    throw new Error(`marcadores ${ABRE}…${FECHA} não encontrados em originais/zona-de-genialidade.html`);
  }
  const tax = JSON.parse(fs.readFileSync(TAXONOMIA, 'utf8'));

  /* Sinal que não consegue disparar não quebra nada — só faz o arcano nunca pontuar,
     e o sintoma chega como "o scorer não gosta d'A Torre". Falhar o build aqui é o
     que separa taxonomia com defeito de taxonomia com julgamento discutível. */
  const { total, achados } = auditarTaxonomia({ tax, html });
  if (achados.length) {
    throw new Error(
      `taxonomia da carta com ${achados.length} problema(s) em ${total} sinais:\n${formatarAchados(achados)}`
    );
  }
  console.log(`  ✓ ${total} sinais da carta auditados contra as perguntas reais`);

  return html.slice(0, i + ABRE.length) + JSON.stringify(podar(tax)) + html.slice(f);
}

if (!fs.existsSync(FONTE)) {
  console.log('= sem originais/zona-de-genialidade.html, nada a fazer');
  process.exit(0);
}

fs.mkdirSync(path.dirname(DEST), { recursive: true });
const html = injetarTaxonomia(fs.readFileSync(FONTE, 'utf8'));
fs.writeFileSync(DEST, html);

const publico = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0;url=/zona-de-genialidade">
<title>Zona de Genialidade</title></head>
<body><p><a href="/zona-de-genialidade">Abrir a apresentação da Zona de Genialidade</a></p></body></html>`;
fs.mkdirSync(path.dirname(DEST_PUBLICO), { recursive: true });
fs.writeFileSync(DEST_PUBLICO, publico);

const kb = Math.round(fs.statSync(DEST).size / 1024);
console.log(`→ protected/zona/index.html (${kb}KB, taxonomia da carta injetada)`);
console.log('→ public/zona/index.html (redirecionamento público, sem perguntas ou prompts)');
