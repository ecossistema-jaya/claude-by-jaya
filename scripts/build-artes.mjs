/* Converte as artes da Zona de Genialidade para WebP em duas larguras.
   originais/zona-genialidade/ é a fonte editável (PNG de ~3MB cada, como saíram
   do gerador); public/zona/arte/ é derivado e regenerável, igual à relação entre
   originais/ e public/aulas/ em build-aulas.mjs.

   Duas larguras porque a mesma arte serve celular e desktop: -sm entra no
   srcset e evita baixar 1672px numa tela de 390. Sem upscale — a maior saída
   nunca passa da largura original.

   Idempotente por mtime: numa segunda execução não reconverte nada, senão o
   `npm run dev` pagaria 14 conversões a cada boot. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const ORIG = path.join(ROOT, 'originais', 'zona-genialidade');
const DEST = path.join(ROOT, 'public', 'zona', 'arte');

/* qualidade 80: nessas artes o ganho visual de 80→90 é invisível e o arquivo
   quase dobra. effort 6 é o joelho da curva tempo/tamanho do encoder. */
const WEBP = { quality: 80, effort: 6 };
const LARGURA_SM = 640;

if (!fs.existsSync(ORIG)) {
  console.log('= sem originais/zona-genialidade, nada a fazer');
  process.exit(0);
}

fs.mkdirSync(DEST, { recursive: true });

/** Só reconverte se a origem mudou depois da saída. */
function precisa(origem, saida) {
  if (!fs.existsSync(saida)) return true;
  return fs.statSync(origem).mtimeMs > fs.statSync(saida).mtimeMs;
}

/** "jaya-logo-símbolo-bege.png" -> "jaya-logo-simbolo-bege" */
function slugificar(arquivo) {
  return arquivo
    .replace(/\.(png|jpe?g)$/i, '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

const fontes = fs
  .readdirSync(ORIG)
  .filter((f) => /\.(png|jpe?g)$/i.test(f))
  .sort();

let convertidas = 0;
let pulos = 0;

for (const arquivo of fontes) {
  const origem = path.join(ORIG, arquivo);
  const slug = slugificar(arquivo);
  const grande = path.join(DEST, `${slug}.webp`);
  const pequena = path.join(DEST, `${slug}-sm.webp`);

  if (!precisa(origem, grande) && !precisa(origem, pequena)) {
    pulos++;
    continue;
  }

  const { width } = await sharp(origem).metadata();

  await sharp(origem).webp(WEBP).toFile(grande);

  /* Origem já estreita (os logos, por exemplo) não ganha versão -sm: reamostrar
     para cima do próprio tamanho só acrescenta ruído, e o arquivo sai MAIOR que
     o original. Sem -sm, o srcset da página cai no grande e está certo. */
  const temSm = width > LARGURA_SM;
  if (temSm) {
    await sharp(origem).resize({ width: LARGURA_SM }).webp(WEBP).toFile(pequena);
  } else if (fs.existsSync(pequena)) {
    fs.unlinkSync(pequena);
  }

  const kb = (p) => Math.round(fs.statSync(p).size / 1024);
  const sufixo = temSm ? ` · -sm ${kb(pequena)}KB` : ' · sem -sm (origem estreita)';
  console.log(`→ zona/arte/${slug}.webp ${kb(grande)}KB${sufixo}`);
  convertidas++;
}

console.log(`artes: ${convertidas} convertidas, ${pulos} já em dia`);
