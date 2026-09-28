/* Empacota as skills que o aluno baixa.

   originais/skill-<nome>/ é a fonte editável; public/skill/<nome>.skill é o
   arquivo servido — mesma relação de build-zona.mjs entre originais/ e public/.

   Um .skill é um zip com SKILL.md na raiz e references/ ao lado. É o formato
   que minha-personalidade.skill já usa e que a aula 03 entrega por download.

   Este script NÃO entra na cadeia de `npm run build`. O build roda na Vercel e
   o .skill é artefato commitado, igual ao que já existe. Rode à mão depois de
   editar a fonte:

       npm run skill

   O zip é escrito com método "store" (sem compressão) e sem dependência
   externa. Zip com entradas armazenadas é zip válido em qualquer leitor, e a
   diferença de tamanho aqui é irrelevante — são arquivos de texto pequenos. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ORIGEM = path.join(ROOT, 'originais');
const DESTINO = path.join(ROOT, 'public', 'skill');

/* CRC-32 conforme o zip exige. Tabela gerada uma vez. */
const TABELA = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = TABELA[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

/* Percorre a pasta e devolve [{ nome: 'references/motor.md', dados: Buffer }].
   O nome dentro do zip usa barra normal, sempre — inclusive no Windows. */
function coletar(dir, prefixo = '') {
  const saida = [];
  const itens = fs.readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name));
  for (const item of itens) {
    const completo = path.join(dir, item.name);
    const interno = prefixo + item.name;
    if (item.isDirectory()) saida.push(...coletar(completo, interno + '/'));
    else saida.push({ nome: interno, dados: fs.readFileSync(completo) });
  }
  return saida;
}

/* Zip mínimo: cabeçalho local por arquivo, diretório central, fim do diretório.
   Sem data real — timestamp fixo para que o mesmo conteúdo gere o mesmo arquivo
   e o git não registre mudança quando nada mudou. */
const DATA_FIXA = 0x0021; /* 1980-01-01 */
const HORA_FIXA = 0x0000;

function zipar(arquivos) {
  const locais = [];
  const central = [];
  let deslocamento = 0;

  for (const { nome, dados } of arquivos) {
    const nomeBuf = Buffer.from(nome, 'utf8');
    const soma = crc32(dados);

    const cabecalho = Buffer.alloc(30);
    cabecalho.writeUInt32LE(0x04034b50, 0);   /* assinatura */
    cabecalho.writeUInt16LE(20, 4);           /* versão necessária */
    cabecalho.writeUInt16LE(0x0800, 6);       /* flag: nome em UTF-8 */
    cabecalho.writeUInt16LE(0, 8);            /* método: store */
    cabecalho.writeUInt16LE(HORA_FIXA, 10);
    cabecalho.writeUInt16LE(DATA_FIXA, 12);
    cabecalho.writeUInt32LE(soma, 14);
    cabecalho.writeUInt32LE(dados.length, 18);
    cabecalho.writeUInt32LE(dados.length, 22);
    cabecalho.writeUInt16LE(nomeBuf.length, 26);
    cabecalho.writeUInt16LE(0, 28);

    locais.push(cabecalho, nomeBuf, dados);

    const entrada = Buffer.alloc(46);
    entrada.writeUInt32LE(0x02014b50, 0);
    entrada.writeUInt16LE(20, 4);             /* versão que criou */
    entrada.writeUInt16LE(20, 6);
    entrada.writeUInt16LE(0x0800, 8);
    entrada.writeUInt16LE(0, 10);
    entrada.writeUInt16LE(HORA_FIXA, 12);
    entrada.writeUInt16LE(DATA_FIXA, 14);
    entrada.writeUInt32LE(soma, 16);
    entrada.writeUInt32LE(dados.length, 20);
    entrada.writeUInt32LE(dados.length, 24);
    entrada.writeUInt16LE(nomeBuf.length, 28);
    entrada.writeUInt32LE(deslocamento, 42);

    central.push(entrada, nomeBuf);
    deslocamento += cabecalho.length + nomeBuf.length + dados.length;
  }

  const corpoCentral = Buffer.concat(central);
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt16LE(arquivos.length, 8);
  fim.writeUInt16LE(arquivos.length, 10);
  fim.writeUInt32LE(corpoCentral.length, 12);
  fim.writeUInt32LE(deslocamento, 16);

  return Buffer.concat([...locais, corpoCentral, fim]);
}

/* ---- execução ---- */

const pastas = fs.readdirSync(ORIGEM, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name.startsWith('skill-'))
  .map(d => d.name);

if (!pastas.length) {
  console.error('Nenhuma pasta originais/skill-* encontrada.');
  process.exit(1);
}

fs.mkdirSync(DESTINO, { recursive: true });

for (const pasta of pastas) {
  const origem = path.join(ORIGEM, pasta);
  const nome = pasta.replace(/^skill-/, '');

  const arquivos = coletar(origem);
  if (!arquivos.some(a => a.nome === 'SKILL.md')) {
    console.error(`${pasta}: falta SKILL.md na raiz. Uma skill sem SKILL.md não carrega.`);
    process.exit(1);
  }

  const destino = path.join(DESTINO, `${nome}.skill`);
  fs.writeFileSync(destino, zipar(arquivos));

  const kb = (fs.statSync(destino).size / 1024).toFixed(1);
  console.log(`${nome}.skill  ${arquivos.length} arquivos  ${kb} KB`);
  for (const a of arquivos) console.log(`   ${a.nome}`);
}
