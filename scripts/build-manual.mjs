/* Publica o manual "8 recursos do Claude".

   originais/manual-8-recursos/ é a fonte editável; public/manual/ é derivado e
   regenerável — mesma relação de build-aulas.mjs entre originais/ e public/aulas/.

   A diferença para as aulas: o manual não é um HTML solto, é uma pasta. O
   documento referencia as artes por caminho relativo (assets/…png), então o que
   se copia é a pasta inteira, com a estrutura intacta. Abrir o arquivo direto de
   originais/ no browser continua funcionando; é o mesmo layout de diretório.

   O middleware fecha /manual junto com o resto do curso: material de aluno, não
   superfície pública como a Zona de Genialidade ou o deck.

   As artes vêm do gerador em ~900px e ~900KB cada — 4,4MB para uma página que as
   mostra a 300px de largura. O build recomprime PNG→PNG mantendo nome e dimensão,
   porque o nome é o que o HTML referencia e trocar extensão exigiria reescrever o
   documento. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PASTA = path.join(ROOT, 'originais', 'manual-8-recursos');
const DEST = path.join(ROOT, 'public', 'manual');

const FONTE = path.join(PASTA, 'manual-8-recursos-claude.html');

/* No deploy a fonte não existe: .vercelignore deixa originais/ fora do upload, e
   build-aulas, build-zona e build-deck já encontram a mesma ausência. Faltar a fonte
   é o caso normal lá, não um erro — o que a Vercel serve é o derivado versionado.
   Erro é não haver nem fonte nem derivado, porque aí não existe página nenhuma. */
if (!fs.existsSync(FONTE)) {
  if (!fs.existsSync(path.join(DEST, 'index.html'))) {
    console.error('x sem originais/manual-8-recursos/manual-8-recursos-claude.html e sem public/manual/index.html');
    process.exit(1);
  }
  console.log('= sem originais/manual-8-recursos/, mantendo public/manual/ como está');
  process.exit(0);
}

fs.mkdirSync(DEST, { recursive: true });
fs.copyFileSync(FONTE, path.join(DEST, 'index.html'));
console.log(`→ public/manual/index.html (${Math.round(fs.statSync(FONTE).size / 1024)}KB)`);

/* ---------- artes ----------
   Só recomprime o que mudou: comparar mtime evita reprocessar 5 PNGs a cada
   `npm run dev`. */
const kb = (bytes) => Math.round(bytes / 1024);

const ASSETS = path.join(PASTA, 'assets');
if (fs.existsSync(ASSETS)) {
  const DEST_ASSETS = path.join(DEST, 'assets');
  fs.mkdirSync(DEST_ASSETS, { recursive: true });

  let antes = 0;
  let depois = 0;
  for (const nome of fs.readdirSync(ASSETS).filter((n) => n.toLowerCase().endsWith('.png'))) {
    const origem = path.join(ASSETS, nome);
    const destino = path.join(DEST_ASSETS, nome);
    antes += fs.statSync(origem).size;

    const precisa =
      !fs.existsSync(destino) || fs.statSync(origem).mtimeMs > fs.statSync(destino).mtimeMs;
    if (precisa) {
      await sharp(origem).png({ quality: 80, compressionLevel: 9, palette: true }).toFile(destino);
    }
    depois += fs.statSync(destino).size;
  }

  console.log(`→ public/manual/assets/ ${kb(antes)}KB → ${kb(depois)}KB`);
} else {
  /* A versão atual do manual embute as artes do topo em base64; a pasta só existe
     enquanto a versão antiga, que as referenciava por caminho, ainda importar. */
  console.log('= sem originais/manual-8-recursos/assets/, o manual não referencia nenhuma');
}

/* ---------- imagens das oito seções ----------
   O manual mostra uma imagem no fim de cada recurso. As escolhas vivem aqui, e não
   no HTML, por dois motivos: as fontes são pesadas demais para servir cruas (as seis
   fotos somam 7,3MB, para aparecer com 460px de altura) e trocar a foto de uma seção
   deve ser uma linha, não uma caçada no meio do documento.

   O HTML referencia sempre /manual/img/<seção>.<ext>; quem muda é o arquivo de
   origem abaixo. Os dois GIFs de pixel-art têm um único frame e vêm com fundo preto
   chapado, que destoa do creme da página: viram PNG com esse fundo recortado (ver
   recortarFundo abaixo) para o card branco aparecer atrás. */
const SECOES = {
  projects: 'imagens/01.png',
  memoria: 'imagens/16.png',
  artifacts: 'imagens/20.png',
  web: 'imagens/21.png',
  arquivos: 'imagens/42-1.png',
  conectores: 'imagens/44-1.png',
  office: 'imagens/assets-claude-code/assests-claude-code3.gif',
  agentes: 'imagens/assets-claude-code/assests-claude-code4.gif',
};

const PUBLIC = path.join(ROOT, 'public');
const DEST_IMG = path.join(DEST, 'img');
fs.mkdirSync(DEST_IMG, { recursive: true });

/* Recorta o fundo escuro de um sprite, por preenchimento a partir das bordas.

   Apagar todo pixel escuro seria mais curto e estaria errado: o mascote tem preto
   dentro dele (olho, boca, vãos entre as pernas), e esses pixels viram buraco. O
   preenchimento só alcança o preto que encosta na moldura, então o desenho fica
   inteiro e apenas o fundo some. */
async function recortarFundo(origem, destino) {
  const { data, info } = await sharp(origem).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  /* O fundo não é preto chapado: o GIF foi salvo com dithering, então ele é uma
     mistura de (0,0,0), (51,0,0), (0,43,0), (0,0,51) e companhia — escuros, mas
     coloridos. Testar saturação reprovaria essa poeira e o preenchimento pararia
     nela; o que separa fundo de mascote aqui é brilho. O tom de fundo mais claro
     soma 145 e o tom mais escuro do sprite soma 289, então 210 fica no meio. */
  const fundo = (i) => data[i] + data[i + 1] + data[i + 2] < 210;

  const fila = [];
  const visto = new Uint8Array(width * height);
  for (let x = 0; x < width; x++) {
    fila.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    fila.push([0, y], [width - 1, y]);
  }

  while (fila.length) {
    const [x, y] = fila.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const p = y * width + x;
    if (visto[p]) continue;
    const i = p * channels;
    if (!fundo(i)) continue;
    visto[p] = 1;
    data[i + 3] = 0;
    fila.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(destino);
}

let brutas = 0;
let servidas = 0;
let reaproveitadas = 0;
for (const [secao, relativo] of Object.entries(SECOES)) {
  const origem = path.join(PUBLIC, relativo);
  const sprite = relativo.toLowerCase().endsWith('.gif');
  const destino = path.join(DEST_IMG, `${secao}.${sprite ? 'png' : 'webp'}`);

  /* As fontes moram em public/imagens/, que o .gitignore mantém fora do repositório
     — 430MB de acervo de trabalho. Só o derivado é versionado, então na Vercel a
     origem não existe e o arquivo pronto é o que vale. Mesma lógica do comentário
     de public/imagens/ no .gitignore: o script reconverte quando as fontes voltam. */
  if (!fs.existsSync(origem)) {
    if (!fs.existsSync(destino)) {
      console.error(`x seção ${secao} sem imagem: nem public/${relativo}, nem o derivado`);
      process.exit(1);
    }
    servidas += fs.statSync(destino).size;
    reaproveitadas++;
    continue;
  }

  brutas += fs.statSync(origem).size;
  const precisa =
    !fs.existsSync(destino) || fs.statSync(origem).mtimeMs > fs.statSync(destino).mtimeMs;

  if (precisa) {
    if (sprite) {
      await recortarFundo(origem, destino);
    } else {
      /* 900px de altura: o dobro dos 460 em que a figura aparece, para telas 2x. */
      await sharp(origem)
        .resize({ height: 900, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(destino);
    }
  }
  servidas += fs.statSync(destino).size;
}

const nota = reaproveitadas ? `, ${reaproveitadas} já prontas` : '';
console.log(`→ public/manual/img/ ${kb(brutas)}KB → ${kb(servidas)}KB (8 seções${nota})`);
