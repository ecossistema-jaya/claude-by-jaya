# As duas saídas + o teste

Depois de montar o seu documento, gere **três arquivos** e envie todos com a ferramenta de envio de arquivo:

1. `a-sua-cara-[nome].md` — o documento completo
2. `colar-no-claude.md` — versão para o Claude
3. `colar-no-chatgpt.md` — versão para o ChatGPT

Nunca entregue só no chat. A pessoa precisa do arquivo.

---

## 1. Versão Claude

O Claude tem dois lugares onde esse texto pode morar. Explique os dois e deixe a pessoa escolher:

| Onde | Quando usar |
|---|---|
| **Preferências pessoais** (Configurações → Perfil) | Vale para **todas** as conversas. Ideal se a pessoa usa o Claude só pro próprio negócio. Campo mais curto. |
| **Instruções do Projeto** (dentro de um Projeto) | Vale só naquele Projeto. Ideal se a pessoa usa o Claude pra várias frentes. Aceita texto mais longo. |

**Recomendação padrão:** versão compacta nas Preferências pessoais + documento completo dentro de um Projeto.

Gere as duas:

- **Compacta** — Sobre mim, Público (1 linha), O que entrego (1 linha), e a seção `COMO VOCÊ DEVE TRABALHAR COMIGO` inteira. A camada de comportamento nunca é cortada; se precisar encurtar, corte do posicionamento.
- **Completa** — o documento inteiro, para as Instruções de Projeto.

Se o campo recusar o texto por tamanho, corte pela ordem: referências visuais → processo detalhado → provas → transformações. Nunca corte "Nunca faça isto".

Instrução de colagem para a pessoa (escreva assim, literal):

> **No Claude:** clique no seu nome no canto → Configurações → Perfil → cole no campo de preferências pessoais → salve. Abra uma conversa nova (a antiga não pega a mudança).

---

## 2. Versão ChatGPT

O ChatGPT usa **Instruções Personalizadas**, com campos separados. Os nomes mudam conforme a versão, mas a lógica é sempre a mesma: um campo sobre **quem você é**, outro sobre **como responder**. Divida assim:

**Campo "sobre você" ←** Sobre mim, Meu público, O que eu entrego, O que eu vendo, Meu processo, Provas de autoridade, Frase de posicionamento.

**Campo "como responder" ←** Tom, Formato padrão, Nunca faça isto, O que significa pronto, Limites e ética, Anti-invenção.

No arquivo `colar-no-chatgpt.md`, separe os dois blocos com um cabeçalho bem visível para a pessoa não colar tudo no mesmo campo:

```
═══════════════════════════════
BLOCO 1 → cole no campo SOBRE VOCÊ
═══════════════════════════════

[conteúdo]


═══════════════════════════════
BLOCO 2 → cole no campo COMO RESPONDER
═══════════════════════════════

[conteúdo]
```

Instrução de colagem:

> **No ChatGPT:** clique no seu nome no canto → Personalização → Instruções personalizadas → cole o Bloco 1 no primeiro campo e o Bloco 2 no segundo → salve. Abra um chat novo.

Se a versão da pessoa tiver um campo único em vez de dois, ela cola os dois blocos seguidos, na ordem.

---

## 3. O teste de verificação — não pule

Sem teste, a pessoa não sabe se funcionou. Entregue os três prompts abaixo e o que ela deve procurar na resposta.

> Cole isso numa conversa **nova**, num de cada vez:

**Teste 1 — reconhecimento**
`Em duas frases: quem é meu público e qual o maior problema que eu resolvo pra ele?`
✅ Funcionou se veio com as **suas palavras**, incluindo as frases literais do seu público.
❌ Falhou se veio genérico ou se perguntou "me conta mais sobre seu negócio".

**Teste 2 — comportamento**
`Me escreve uma legenda de Instagram sobre o meu trabalho.`
✅ Funcionou se respeitou o tamanho, o tom e não usou nada da sua lista "nunca faça isto".
❌ Falhou se veio com emoji demais, "jornada", "transformador", ou aquele "Ótima ideia!" no começo.

**Teste 3 — honestidade**
`Quantas pessoas eu já atendi?`
✅ Funcionou se disse que não sabe, ou citou só o que está no documento.
❌ Falhou se inventou um número.

Se algum teste falhar, volte no documento e deixe **mais específica** a seção correspondente — Teste 1 → Meu público; Teste 2 → Nunca faça isto; Teste 3 → Anti-invenção. Vago não pega. Literal pega.

---

## Fechamento

Diga à pessoa, em no máximo três linhas:

- Onde colar (Claude e ChatGPT)
- Que precisa abrir conversa nova pra valer
- Que o documento é vivo: quando ela mudar de oferta ou de público, é só voltar e editar a seção — não precisa refazer tudo
