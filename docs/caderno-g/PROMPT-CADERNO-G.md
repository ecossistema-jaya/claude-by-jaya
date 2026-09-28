# Prompt — Material impresso para Caderno Inteligente G

> Modelo extraído do Guia de Estudo GenAI Leader (`Projetos/google/_fonte-do-guia/`, ago/2026).
> Cole o bloco abaixo no Claude, substituindo os campos entre colchetes.
> Arquivos de apoio nesta pasta: `esqueleto-caderno-g.doc` (HTML Word com todo o CSS) e `converter-docx.ps1`.

---

## Prompt

```
Gere um material impresso de [TEMA] a partir dos arquivos anexos.

FORMATO FÍSICO
- Caderno Inteligente G: folha 200 × 275 mm, retrato.
- Margens 14 mm topo, 12 mm direita, 14 mm base, 24 mm esquerda (reserva dos discos).
- Cabeçalho e rodapé a 8 mm.
- Use o esqueleto em esqueleto-caderno-g.doc como base. Não altere o @page.

ARQUITETURA DE ARQUIVOS
- Fonte única em HTML com marcação Word (ProgId=Word.Document, @page com
  size/margin em mm). Salve como _fonte/<slug>-fonte.doc.
- Entregáveis gerados a partir da fonte:
    <slug>.docx  (Word COM, SaveAs2 formato 16 — script converter-docx.ps1)
    <slug>.html  (leitura em tela, mesmo CSS dentro de @media print)
- Nunca edite os entregáveis. Edite a fonte e regenere.
- Após converter, leia PageSetup.PageWidth/PageHeight de volta e confirme 200 × 275 mm.

CONTEÚDO
- Capa: barra de cores da marca [BRAND], kicker, título, tabela-ficha
  (data, cobertura, formato "200 × 275 mm — Caderno Inteligente G")
  e caixa de aviso "Antes de imprimir: escala 100%, nunca ajustar à página".
- Sumário numerado. Cada seção começa em página nova (<div class="pb"></div>).
- Componentes disponíveis no esqueleto: table.data (zebrada), table.cards
  (2 colunas), .box / .box.warn / .box.ok / .box.stop, .code com .cap,
  table.flow (fluxos), table.notes (linhas pontilhadas de 22pt para
  anotação à mão — coloque uma ao fim de cada seção prática).
- Tipografia: Arial 10.5pt corpo, h1 26pt, h2 15.5pt em fundo colorido,
  h3 12pt, h4 10pt caixa alta, código 8.5pt Consolas.
- Acentos em UTF-8 direto. Sem travessão, sem exclamação.

MÉTODO DE EDIÇÃO (vale para todas as revisões seguintes)
- Toda alteração é um script Python troca(antigo, novo, rótulo) com âncora
  exata, conferida por grep ANTES de escrever. Nunca âncora de memória.
- Âncora que bater 0 ou 2+ vezes aborta sem gravar.
- Não ancore em <tr> (o zebrado muda a cada build); ancore no <td>.
- Guardas ao final: conteúdo obrigatório presente, proibido ausente,
  número de <h2> inalterado, exatamente um </html>.
- Backup automático da fonte (.bak) antes de gravar.
- Fatos: verificar contra fonte oficial antes de afirmar. Auditar o que
  está FALTANDO comparando contra lista externa, não só o que está escrito.

ENTREGA
- HANDOFF.md com: árvore de arquivos, tabela "o que editar onde",
  fatos verificados que não devem ser revertidos, pendências numeradas.
```

---

## Como converter para .docx

Abra **pwsh** (PowerShell 7, não o 5.1) e rode:

```
pwsh -File converter-docx.ps1 -Fonte "_fonte\<slug>-fonte.doc" -Saida "<slug>.docx"
```

Regras que custaram tempo:

1. `powershell.exe` 5.1 aninhado congela o COM do Word no `SaveAs2`. Só `pwsh`.
2. Se o `.docx` estiver aberto no Word, o script avisa e não grava.
3. Heredoc no Git Bash come um nível de escape: em scripts Python escritos por heredoc, use `chr(10)` em vez de `\n`.

## Por que HTML-Word e não python-docx

Word respeita `@page { size; margin }` em milímetros quando o arquivo declara `ProgId=Word.Document`. A fonte fica em texto puro: editável por script, versionável em git, `grep`-ável. Zero template `.dotx`, zero biblioteca.
