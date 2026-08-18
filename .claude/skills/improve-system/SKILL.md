---
name: improve-system
description: Varre a sessão atual atrás dos padrões do Jaya — jeito de escrever, decisões repetidas, correções feitas — e grava cada aprendizado como arquivo em memory/, indexado no MEMORY.md. Padrão já conhecido sobe a confiança em vez de duplicar; padrão contrariado é corrigido. Usar quando o Jaya rodar /improve-system, pedir para "guardar isso", "aprender com essa sessão", "atualizar a memória", ou ao fechar uma sessão de trabalho substantiva.
version: 1.0.0
user-invocable: true
---

# improve-system

Transforma o que aconteceu nesta sessão em memória durável em `memory/`, para que
a próxima sessão comece sabendo. A memória melhora com o uso porque cada padrão
carrega um contador de confiança: repetição sobe, contradição desce, e o que
chega a zero sai.

## Fonte: a sessão, não o repositório

Varrer **a conversa atual** — mensagens do Jaya, correções, reescritas, escolhas
feitas e desfeitas. Não varrer o git, o código ou o `CLAUDE.md`: o que já está
escrito lá não precisa virar memória (ver Portão, abaixo).

## Fluxo

### 1. Ler o estado atual

Ler `memory/MEMORY.md` inteiro e os arquivos de `memory/` cujo gancho tenha
qualquer relação com a sessão. Sem isso, o passo 4 duplica em vez de reforçar.

### 2. Varrer a sessão em quatro faixas

**Jeito de escrever** (`preferencia`) — o que o Jaya reescreveu num texto que eu
produzi, e como. Palavras e construções cortadas. Formato de entrega pedido ou
rejeitado. Tamanho, tom, uso de listas, abertura e fechamento.

**Decisões repetidas** (`decisao`) — a mesma escolha tomada duas ou mais vezes:
biblioteca, padrão de arquitetura, nomenclatura, ordem de trabalho, o que o Jaya
delega e o que faz na mão. Registrar a decisão **e o critério** por trás dela; o
critério generaliza, a decisão não.

**Correções** (`correcao`) — todo ponto em que veio alguma variante de "não é
assim", "não pedi isso", "faz de novo". Cada correção implica uma regra que eu
não tinha. Escrever a regra, não o incidente.

**Contexto que não está no código** (`contexto`) — restrições, prazos, acordos,
quem decide o quê, por que algo está do jeito que está. Só o que não é derivável
de código, git ou docs.

### 3. Aplicar o portão

Não gravar. Descartar o candidato quando **qualquer** destas for verdadeira:

- Já está no código, no git, no `CLAUDE.md` ou em outra memória.
- Apareceu **uma vez** sem afirmação explícita do Jaya — hipótese frágil vinda de
  uma amostra única não vira arquivo. Exceção: correção explícita ou fala direta
  ("sempre faça X") entram com `confianca: 1` na hora.
- É perfil psicológico ou emocional amplo ("gosta de X", "fica impaciente").
  Preferência de trabalho confirmada é `preferencia`; leitura de personalidade
  não é memória.
- Só importa dentro desta conversa.
- Contém credencial, chave, token ou dado sensível. Nunca.

Sobrevivendo ao portão: o registro tem que responder **o que fazer diferente na
próxima vez**. Se não responde, não é memória — é anotação.

### 4. Gravar — reforçar antes de criar

Para cada aprendizado, nesta ordem:

1. **Já existe memória equivalente?** Se sim: incrementar `confianca`, atualizar
   `atualizado`, e enriquecer o corpo com o novo caso. **Não criar arquivo novo.**
   Atualizar o `· c=N` na linha do índice.
2. **Contradiz uma memória existente?** Decrementar a `confianca` dela, registrar
   a exceção no corpo, e confirmar com o Jaya antes de reescrever o fato central.
   Chegando a `confianca: 0`, propor a remoção — nunca deletar sem confirmação.
3. **É novo?** Criar `memory/<slug>.md` no formato de
   `references/formato-memoria.md` e acrescentar a linha na seção certa do
   `memory/MEMORY.md`.

Um arquivo = um fato. Fato composto vira dois arquivos ligados por `[[slug]]`.

### 5. Prestar contas

Fechar com um bloco curto: o que foi criado, o que subiu de confiança, o que
desceu, e o que passou pelo portão e foi descartado — com o motivo. O descarte
é a parte útil: mostra que o sistema filtra.

Nada mudou? Dizer `nenhum padrão novo — memória inalterada` e parar. Sessão sem
aprendizado é resultado legítimo, não falha.

## Manutenção

Quando `memory/` passar de ~25 arquivos, ou quando o Jaya pedir uma poda: listar
memórias com `confianca: 1` e `atualizado` há mais de 90 dias, e propor remoção
em bloco. Memória que nunca se confirmou em três meses é ruído.

## Referências

- `references/formato-memoria.md` — formato exato do arquivo e da linha de
  índice. Carregar antes da primeira gravação de cada sessão.
