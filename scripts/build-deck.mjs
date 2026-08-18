/* Publica o deck da palestra Arquitetura da Consciência.

   A fonte é o HTML autocontido exportado pelo bundler (React, fontes e imagens
   embutidos), que mora em originais/arquitetura-da-consciencia/. O nome do
   arquivo vem do exportador e carrega acento e espaço — por isso a busca é por
   padrão, não por nome fixo: reexportar não quebra o build.

   O destino é index.html porque next.config.ts reescreve
   /deck-arquitetura-da-consciencia para /deck/index.html. Mesma relação entre
   originais/ e public/ dos outros scripts.

   O head exportado diz só "Bundled Page" e não tem prévia de link. Como a página
   é pública e vai circular no WhatsApp, o build injeta título, descrição e og:*
   antes de copiar. O arquivo original fica intacto. */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PASTA = path.join(ROOT, 'originais', 'arquitetura-da-consciencia');
const DEST = path.join(ROOT, 'public', 'deck', 'index.html');
const ARTE_OG = path.join(ROOT, 'originais', 'zona-genialidade', '09.png');
const OG = path.join(ROOT, 'public', 'deck', 'og.jpg');

const SITE = 'https://claude-by-jaya.vercel.app';
const URL = `${SITE}/deck-arquitetura-da-consciencia`;
const TITULO = 'Arquitetura da Consciência · Palestra';
const DESCRICAO =
  'O sistema operacional por trás da sua zona de genialidade. Vinte anos de sistemas críticos e um caderno de Kundalini lendo a mesma pergunta: por que você sabia o que fazer e não conseguiu fazer?';

if (!fs.existsSync(PASTA)) {
  console.log('= sem originais/arquitetura-da-consciencia/, nada a fazer');
  process.exit(0);
}

const fonte = fs
  .readdirSync(PASTA)
  .filter((nome) => nome.toLowerCase().endsWith('.html'))
  .sort()[0];

if (!fonte) {
  console.log('= nenhum .html em originais/arquitetura-da-consciencia/, nada a fazer');
  process.exit(0);
}

let html = fs.readFileSync(path.join(PASTA, fonte), 'utf8');

/* O bundler troca <html> inteiro quando termina de desempacotar, e o documento
   interno não traz <title>. O listener e o observer vivem em window e em
   document — sobrevivem à troca — e devolvem o nome da aba depois dela. */
const CABECA = `<title>${TITULO}</title>
  <meta name="description" content="${DESCRICAO}">
  <link rel="canonical" href="${URL}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="${TITULO}">
  <meta property="og:description" content="${DESCRICAO}">
  <meta property="og:url" content="${URL}">
  <meta property="og:image" content="${SITE}/deck/og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Uma mulher sentada de costas em postura de meditação diante de um vale, com cérebro, nervo vago e coração desenhados sobre o corpo e uma onda azul de respiração saindo em direção ao horizonte.">
  <meta name="twitter:card" content="summary_large_image">
  <!-- Vercel Analytics. O componente <Analytics /> de app/layout.tsx não alcança
       esta página: ela é HTML estático servido por rewrite e nunca passa pelo
       layout do Next. Mesma situação da Zona de Genialidade, mesmo remédio.

       Sem a fila window.vaq que a Zona precisa: lá existem eventos de funil que
       um clique precoce perderia. Aqui só interessa o pageview, e "defer" já
       garante que ele acontece — script defer executa antes do DOMContentLoaded,
       que é quando o bundler troca o documento e apaga este <head>. O coletor
       registra a visita; a tag some depois, com o evento já enviado.

       Só existe quando servido pela Vercel; em localhost dá 404 e o "defer"
       garante que isso não atrapalha nada. -->
  <script defer src="/_vercel/insights/script.js"></script>
  <script>
    (function () {
      var titulo = ${JSON.stringify(TITULO)};
      document.title = titulo;
      new MutationObserver(function () {
        if (document.title !== titulo) document.title = titulo;
      }).observe(document, { childList: true });
    })();
  </script>`;

const ALVO = '<title>Bundled Page</title>';
if (!html.includes(ALVO)) {
  console.error(`x ${fonte} não tem o <title> do bundler — head mudou, revise o script`);
  process.exit(1);
}
html = html.replace(ALVO, CABECA);
html = html.replace('<html>', '<html lang="pt-BR">');

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.writeFileSync(DEST, html);

const kb = Math.round(fs.statSync(DEST).size / 1024);
console.log(`→ public/deck/index.html (${kb}KB)`);

/* ---------- prévia dos links ----------
   Arte 09 do acervo da Zona de Genialidade: a figura sentada com cérebro, nervo
   vago e coração desenhados sobre o corpo. É o assunto da palestra em imagem.
   Deliberadamente diferente da 13, que já é a prévia de /zona-de-genialidade —
   dois links irmãos com a mesma miniatura viram o mesmo link aos olhos de quem
   recebe.

   Horizontal (1672x941), quase na proporção que WhatsApp e Facebook esperam:
   o recorte centrado tira uns 30px de cada borda vertical e não come a cena.
   JPEG, não WebP: leitor de prévia que tropeça em WebP entrega link sem imagem,
   e prévia quebrada não tem segunda chance. */
if (fs.existsSync(ARTE_OG)) {
  const precisa =
    !fs.existsSync(OG) || fs.statSync(ARTE_OG).mtimeMs > fs.statSync(OG).mtimeMs;
  if (precisa) {
    await sharp(ARTE_OG)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(OG);
    console.log(`→ public/deck/og.jpg ${Math.round(fs.statSync(OG).size / 1024)}KB (prévia dos links)`);
  } else {
    console.log('= public/deck/og.jpg já em dia');
  }
} else {
  console.log('= sem originais/zona-genialidade/09.png, prévia dos links sem imagem');
}
