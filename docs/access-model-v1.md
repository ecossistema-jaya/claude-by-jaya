# Modelo de acesso v1 · Plataforma SHAKTI JAYA

## Decisão

A Zona de Genialidade é o piloto do controle por produto. Sua apresentação continua
pública, mas as perguntas, prompts e aplicação completa são servidos apenas pela rota
autenticada. Iniciar o assessment, enviar o e-mail e consumir a análise exigem:

1. sessão válida com Google;
2. convite ativo para `zona-de-genialidade` em `acessos_produtos`;
3. convite dentro da validade, quando houver `expira_em`.

O curso Claude mantém a regra existente em `alunos_claude`. Os dois acessos são
independentes: ser aluna do Claude não libera a Zona, e receber convite para a Zona
não libera o curso.

## Limites desta entrega

| Superfície | Regra |
|---|---|
| `/zona-de-genialidade` | apresentação pública, sem perguntas ou prompts do assessment |
| `/zona-de-genialidade/iniciar` | login Google + convite; serve o HTML completo sem cache público |
| início do assessment | login Google + convite ativo |
| `/api/zona/access` | informa 401 sem login, 403 sem convite e 200 com convite |
| `/api/zona/lead` | login + convite; mantém consentimento explícito para captar o e-mail |
| `/api/zona/analyze` | login + convite + confirmação do e-mail |
| `/claude-do-zero` e aulas | regra atual de `alunos_claude`, sem alteração comercial |

## Operação

O painel `/admin` ganha a seção “Convites · Zona de Genialidade”. A administradora
pode convidar, desativar e reativar. Não há exclusão na interface: desativar preserva
o histórico e corta o acesso imediatamente na próxima verificação.

O banco remoto do projeto Supabase `zflksglibxhbnxndfwxo` foi preparado em
16/09/2026 com `docs/sql/acessos-produtos.sql`. A implantação criou a tabela,
ativou RLS, instalou as quatro políticas, restringiu os privilégios do papel
`authenticated` a `SELECT`, `INSERT` e `UPDATE` e concedeu o primeiro convite à
conta da Jaya. O script continua sendo a fonte idempotente para repetir ou auditar
essa configuração.

## Critérios de aceite

1. Visitante anônimo vê a apresentação da Zona.
2. Ao começar, visitante anônimo vai para o login específico da Zona.
3. Conta sem convite recebe “Conta não liberada” e não consome a análise.
4. Conta convidada volta do Google e recebe o assessment completo.
5. Chamar `lead` ou `analyze` diretamente sem login ou convite falha.
6. Curso Claude continua aceitando apenas alunos ativos, como antes.
7. Desativar um convite no painel bloqueia a próxima tentativa sem apagar a linha.
8. Progresso, blueprint e dashboard salvos no aparelho ficam vinculados ao `user.id`.
9. O consentimento de lead só aceita o e-mail verificado da conta Google e o cookie
   resultante só vale para aquela sessão de usuário.
