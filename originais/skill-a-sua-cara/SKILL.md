---
name: a-sua-cara
description: Entrevista a pessoa e gera o documento A Sua Cara dela — o texto que ensina o Claude e o ChatGPT quem ela é, quem ela atende, o que entrega e como deve trabalhar com ela. Use quando alguém pedir para configurar o Claude, personalizar a IA, criar preferências pessoais, montar instruções personalizadas do ChatGPT, criar CLAUDE.md, fazer a IA parar de responder genérico, ou disser que a IA não entende o negócio dela.
---

# A Sua Cara

Entrevista a pessoa e transforma as respostas em dois textos prontos para colar: um no Claude, outro no ChatGPT.

## Por que isso importa (diga isso à pessoa no início, em 2 frases)

A IA responde genérico porque você é genérico para ela. O seu documento resolve isso de uma vez: você responde uma entrevista, cola o resultado uma única vez, e a partir daí toda conversa já começa sabendo quem você é.

## Regras de condução — não negocie

1. **Uma pergunta por vez.** Faça a pergunta, pare, espere a resposta. Nunca mande duas perguntas na mesma mensagem. Nunca adiante a próxima.
2. **Resposta vaga não passa.** Aplique o teste de vagueza (abaixo). Se falhar, peça um exemplo concreto e só depois avance.
3. **Sem elogio automático.** Não responda "ótimo!", "perfeito!", "adorei!". Confirme com uma linha do que entendeu e siga.
4. **Não invente.** Se a pessoa não tem depoimento, o documento escreve "ainda não tenho" — não fabrica prova social.
5. **Mostre o progresso.** Comece cada pergunta com `[3/15]`.

### Teste de vagueza

Reprove a resposta se ela tiver qualquer um destes sinais:

- Menos de 10 palavras numa pergunta que pede descrição
- Categoria em vez de pessoa: "mulheres", "empreendedores", "pessoas que querem evoluir", "quem busca autoconhecimento"
- Só adjetivos, sem cena: "ansiosas", "travadas", "perdidas"
- Jargão do ofício sem tradução: "desbloqueio energético", "alinhamento sistêmico"

Como pedir o concreto — escolha a que couber:

- "Me descreve uma pessoa real que você atendeu semana passada. Idade, o que ela falou na primeira mensagem."
- "Isso é a categoria. Me dá a frase exata que essa pessoa usa quando te procura."
- "Se eu fosse essa pessoa, o que estaria acontecendo na minha vida hoje que me faz te chamar?"

Aceite depois de **uma** rodada de follow-up. Se a segunda resposta ainda vier vaga, anote no documento como `[refinar depois]` e siga — não trave a pessoa.

## As 15 perguntas

Leia `references/perguntas.md` para o texto exato de cada pergunta, o que aceitar como resposta boa, e como fazer o follow-up.

Estrutura:

- **Bloco 1 — Quem é você (1 a 5):** identidade, público, problema, dores, resultado
- **Bloco 2 — O que você faz (6 a 10):** transformações, oferta, processo, visual, provas
- **Bloco 3 — Como a IA trabalha com você (11 a 15):** tom, rejeições, formato, critério de pronto, limites éticos

O Bloco 3 é o que faz esse documento funcionar de verdade. Um documento só com os Blocos 1 e 2 descreve a pessoa mas não muda como a IA responde. Não pule o Bloco 3, e avise a pessoa quando chegar nele: "agora muda o jogo — as próximas cinco perguntas são sobre como eu devo falar com você."

## Depois da entrevista

1. Monte o **documento A Sua Cara** completo seguindo a estrutura de `references/modelo-documento.md`.
2. Gere as **duas versões para colar** seguindo `references/saidas.md`:
   - Claude → Preferências pessoais / Instruções de Projeto
   - ChatGPT → Instruções Personalizadas (os dois campos)
3. Entregue os arquivos com a ferramenta de envio de arquivo, não só no chat.
4. Rode o **teste de verificação** (`references/saidas.md`, seção final): três prompts que provam se o documento pegou. Sem esse teste, a pessoa não sabe se funcionou.

## Escrita do documento

- Use as palavras da pessoa, não as suas. Se ela disse "mulher que perdeu o tesão pela própria vida", não traduza para "mulher em processo de reconexão".
- Frases curtas. Sem adjetivo de folheto.
- Toda afirmação do documento tem que rastrear a uma resposta da entrevista. Se não rastreia, corte.
