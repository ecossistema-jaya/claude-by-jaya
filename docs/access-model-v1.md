# Modelo de acesso v1 · Plataforma SHAKTI JAYA

## Decisão

A Zona de Genialidade, a Arquitetura da Consciência e o Atlas de Forças usam
controle por produto. Apresentação, perguntas, prompts e aplicação completa exigem
login e convite. Abrir o assessment, enviar o e-mail e consumir a análise exigem:

1. sessão válida com Google;
2. convite ativo para o produto correspondente em `acessos_produtos`;
3. convite dentro da validade, quando houver `expira_em`.

O curso Claude mantém a regra existente em `alunos_claude`. Todos os acessos são
independentes: curso, Zona, Arquitetura e Atlas têm permissões próprias. Zona e
Arquitetura servem o HTML completo por rotas dinâmicas. O Atlas valida sessão e
convite no cliente e repete a autorização nas APIs privadas; links de resultado
deliberadamente compartilhados continuam públicos e não expõem nome ou e-mail.

## Limites desta entrega

| Superfície | Regra |
|---|---|
| `/zona-de-genialidade` | login Google + convite antes da apresentação |
| `/zona-de-genialidade/iniciar` | login Google + convite; serve o HTML completo sem cache público |
| `/arquitetura-da-consciencia` | login Google + convite; serve o HTML completo sem cache público |
| `/consciencia/index.html` | redirecionamento sem perguntas ou scripts do questionário |
| `/api/consciencia/lead` | login + convite; aceita somente o e-mail verificado da conta |
| `/api/consciencia/analyze` | login + convite + consentimento vinculado à mesma conta |
| `https://atlas-de-forcas.vercel.app/` | login Google + convite `atlas-de-forcas` antes do quiz |
| `quiz.submitLead` do Atlas | login + convite; usa o e-mail verificado da conta |
| link `?resultado=...` do Atlas | login + convite; token não enumerável identifica o mapa |
| início do assessment | login Google + convite ativo |
| `/api/zona/access` | informa 401 sem login, 403 sem convite e 200 com convite |
| `/api/zona/lead` | login + convite; mantém consentimento explícito para captar o e-mail |
| `/api/zona/analyze` | login + convite + confirmação do e-mail |
| `/claude-do-zero` e aulas | regra atual de `alunos_claude`, sem alteração comercial |

## Operação

O painel `/admin` possui seções separadas de convites para Zona de Genialidade,
Arquitetura da Consciência e Atlas de Forças. A administradora pode convidar,
desativar e reativar.
Não há exclusão na interface: desativar preserva o histórico e corta o acesso
imediatamente na próxima verificação.

O banco remoto do projeto Supabase `zflksglibxhbnxndfwxo` foi preparado em
16/09/2026 com `docs/sql/acessos-produtos.sql`. A implantação criou a tabela,
ativou RLS, instalou as quatro políticas, restringiu os privilégios do papel
`authenticated` a `SELECT`, `INSERT` e `UPDATE` e concedeu o primeiro convite à
conta da Jaya. O script continua sendo a fonte idempotente para repetir ou auditar
essa configuração.

## Critérios de aceite

1. Visitante anônimo que abre qualquer um dos três assessments vai para o login específico.
2. Cada assessment exige convite ativo para seu próprio slug de produto.
3. Conta sem convite recebe “Conta não liberada” e não consome a análise.
4. Conta convidada volta do Google e recebe o assessment completo.
5. Chamar `lead` ou `analyze` diretamente sem login ou convite falha.
6. Curso Claude continua aceitando apenas alunos ativos, como antes.
7. Desativar um convite no painel bloqueia a próxima tentativa sem apagar a linha.
8. Progresso, blueprint e dashboard salvos no aparelho ficam vinculados ao `user.id`.
9. O consentimento de lead só aceita o e-mail verificado da conta Google e o cookie
   resultante só vale para aquela sessão de usuário, nos dois assessments.
