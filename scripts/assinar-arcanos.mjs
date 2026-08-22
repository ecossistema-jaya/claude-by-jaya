/* Assina as cartas dos arcanos com o símbolo da marca.

   originais/arcanos-brutos/ guarda o que saiu do gerador, sem assinatura. Este script
   compõe a logo no canto inferior direito e grava em originais/zona-genialidade/, de
   onde build-artes.mjs converte para WebP.

   A arte carrega tudo sozinha. Numeral e nome do arcano ficam no card da página, em
   HTML, onde já estão — repeti-los dentro da imagem só rouba espaço da ilustração.

   Idempotente por mtime: uma segunda execução não recompõe nada. Trocar a logo ou
   mexer neste script invalida as saídas, porque a data dos dois também é comparada. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const BRUTOS = path.join(ROOT, 'originais', 'arcanos-brutos');
const DEST = path.join(ROOT, 'originais', 'zona-genialidade');
const LOGO = path.join(
  ROOT, 'public', 'imagens', 'Logo', 'RGB (digital)', 'PNG (sem fundo)',
  'jaya-logo-símbolo-bege.png',
);

/* Frações da largura da carta. A margem de baixo é menor que a da direita de
   propósito: a assinatura fica próxima da borda inferior, discreta. */
const LARGURA_LOGO = 0.05;
const MARGEM_LATERAL = 0.055;
const MARGEM_BASE = 0.03;

/* Opacidade da assinatura, de 0 a 1. Em 1 ela é um selo chapado; abaixo de ~0.5 vira
   marca d'água, presente para quem procura e discreta para quem só olha a carta.
   O valor multiplica o alfa do PNG, então a forma continua exatamente a mesma. */
const OPACIDADE = 0.75;

/** "arcano-A Torre.png" -> "a-torre". Mesma normalização de build-artes.mjs. */
function slugificar(texto) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

/** A logo na largura pedida, com o alfa multiplicado pela opacidade da marca d'água.
 *
 *  trim() antes do resize: o PNG da logo é 1500x1500 com a marca pequena no meio de
 *  muito transparente. Sem recortar essa moldura vazia, dimensionar pela largura do
 *  arquivo entrega um símbolo três vezes menor do que o pedido.
 *
 *  A translucidez é feita no canal alfa, e não desbotando a cor, porque desbotar
 *  aproximaria o bege do papel e a marca sumiria sobre fundo claro em vez de ficar
 *  discreta sobre qualquer fundo. */
async function marcaDagua(largura) {
  const base = sharp(LOGO).trim().resize({ width: largura }).ensureAlpha();

  if (OPACIDADE >= 1) return base.png().toBuffer();

  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) data[i] = Math.round(data[i] * OPACIDADE);

  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

if (!fs.existsSync(BRUTOS)) {
  console.log('= sem originais/arcanos-brutos, nada a fazer');
  process.exit(0);
}
if (!fs.existsSync(LOGO)) {
  console.error('! não achei a logo em ' + path.relative(ROOT, LOGO));
  process.exit(1);
}

/* O próprio script entra na conta: posição e tamanho da logo são definidos aqui, então
   mexer nele invalida as saídas tanto quanto trocar a logo. Sem isto, ajustar o layout
   e rodar de novo não mudaria nada — e o silêncio pareceria sucesso. */
const ESTE = path.join(import.meta.dirname, path.basename(import.meta.filename));

/** Só recompõe se o bruto, a logo ou este script mudaram depois da saída. */
function precisa(origem, saida) {
  if (!fs.existsSync(saida)) return true;
  const alvo = fs.statSync(saida).mtimeMs;
  return [origem, LOGO, ESTE].some((f) => fs.statSync(f).mtimeMs > alvo);
}

fs.mkdirSync(DEST, { recursive: true });

const fontes = fs
  .readdirSync(BRUTOS)
  .filter((f) => /^arcano-.+\.(png|jpe?g)$/i.test(f))
  .sort();

let assinadas = 0;
let pulos = 0;

for (const arquivo of fontes) {
  const slug = slugificar(arquivo.replace(/^arcano-/, '').replace(/\.(png|jpe?g)$/i, ''));
  const origem = path.join(BRUTOS, arquivo);
  const saida = path.join(DEST, `arcano-${slug}.png`);

  if (!precisa(origem, saida)) {
    pulos++;
    continue;
  }

  const { width, height } = await sharp(origem).metadata();

  /* trim() antes do resize: o PNG da logo é 1500x1500 com a marca pequena no meio de
     muito transparente. Sem recortar essa moldura vazia, dimensionar pela largura do
     arquivo entrega um símbolo três vezes menor do que o pedido. */
  const logo = await marcaDagua(Math.round(width * LARGURA_LOGO));
  const info = await sharp(logo).metadata();

  await sharp(origem)
    .composite([
      {
        input: logo,
        left: width - info.width - Math.round(width * MARGEM_LATERAL),
        top: height - info.height - Math.round(width * MARGEM_BASE),
      },
    ])
    .png()
    .toFile(saida);

  console.log(`→ arcano-${slug}.png`);
  assinadas++;
}

console.log(`arcanos: ${assinadas} assinadas, ${pulos} já em dia`);
