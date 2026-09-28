# Acesso ao curso com login do Google

A senha única saiu. Agora o aluno entra com a conta Google dele, e só entra
quem estiver na tabela `alunos_claude` do Supabase.

## Como funciona

1. `/claude-do-zero` abre a área protegida do aluno; sem sessão, vai para `/login`,
   que manda o aluno para o Google. `/claude` é a apresentação pública do curso.
2. O Google devolve em `/auth/callback`, que confere a allowlist. Quem não está
   nela é deslogado na hora e vai para `/sem-acesso`. Quem está autorizado retorna
   para `/claude-do-zero`.
3. O `middleware.ts` protege todo o resto — inclusive os HTML das aulas em
   `/aulas` e as imagens. Ele guarda a resposta "pode entrar" num cookie
   assinado de 10 minutos para não consultar o banco a cada arquivo.
4. Desativar um aluno no painel corta o acesso dele em no máximo 10 minutos.

## Banco (projeto "Projetos", `zflksglibxhbnxndfwxo`)

| Tabela | Para quê |
|---|---|
| `alunos_claude` | A allowlist. `ativo = false` bloqueia sem apagar o histórico. |
| `acessos_claude` | Um registro por login concluído. |

As políticas RLS garantem que o aluno só enxerga a própria linha e que apenas
quem tem `papel = 'admin'` escreve na lista — mesmo que alguém chame a API do
Supabase por fora do site.

## Painel

`/admin`, visível só para admin (para os outros a rota devolve 404). De lá dá
para liberar, desativar, reativar e remover aluno, e ver as últimas entradas.

## Configuração que precisa ser feita à mão

### 1. Google Cloud Console

1. <https://console.cloud.google.com> → crie ou escolha um projeto.
2. **APIs e serviços → Tela de consentimento OAuth**: tipo **Externo**, nome do
   app "Claude do Zero", email de suporte, salvar. Deixe em **Produção**
   (em modo Teste só entram os emails que você listar lá).
3. **Credenciais → Criar credenciais → ID do cliente OAuth → App da Web**.
4. Em **URIs de redirecionamento autorizados**, cole exatamente:

   ```
   https://zflksglibxhbnxndfwxo.supabase.co/auth/v1/callback
   ```

5. Guarde o **Client ID** e o **Client Secret**.

### 2. Supabase

1. Painel do projeto → **Authentication → Sign In / Providers → Google**:
   ligue e cole Client ID e Client Secret.
2. **Authentication → URL Configuration**:
   - Site URL: `https://claude-by-jaya.vercel.app`
   - Redirect URLs: `https://claude-by-jaya.vercel.app/**` e
     `http://localhost:3000/**`
   - Domínio próprio: `https://jayaroberta.com/auth/callback`, adicionado e
     confirmado no painel em 15/09/2026. Os endereços existentes e a Site URL
     foram preservados; este projeto Supabase também atende outros aplicativos.
   - `https://jayaroberta.com/**`, adicionado em 28/09/2026. O endereço exato
     acima não cobre `/auth/callback?next=...`: sem o curinga, o Supabase
     trocava o retorno pela Site URL (`claude-by-jaya.vercel.app`), sem sessão,
     e a pessoa via um segundo login que levava ao curso.

### 3. Vercel

Em **Settings → Environment Variables**, cadastre (os valores estão no `.env`
local):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `AUTH_SECRET`
- `GEMINI_API_KEY` (já existia)

`CURSO_SENHA` pode ser apagada.

## Liberar o primeiro aluno

Entre no site com a sua conta Google (`betinha.potter@gmail.com`, já cadastrada
como admin), abra **Alunos** no canto superior da capa e adicione os emails.
O email precisa ser o mesmo da conta Google que a pessoa vai usar.

## Quando ninguém consegue entrar

Em 21/08/2026 o banco passou a devolver `42501 permission denied for table` nas três
tabelas, durante a migração das chaves de API antigas (JWT `anon`/`service_role`) para
as novas (`sb_publishable_…`). As políticas RLS estavam intactas, com os nomes
originais: o que se perdeu foram os privilégios de tabela (`GRANT`) dos roles `anon` e
`authenticated` — a camada abaixo da RLS.

O sintoma engana dos dois lados, porque nenhum deles mostra erro:

- o gate faz `SELECT` em `alunos_claude`; sem privilégio o retorno é nulo, e o código
  não distingue isso de "não está na lista". O aluno cai em `/sem-acesso` achando que o
  problema é a conta dele.
- `/api/zona/lead` tolera falha de gravação de propósito, para não travar quem acabou de
  responder o assessment. A Zona segue funcionando de ponta a ponta e todo lead se perde,
  deixando só um `console.error` nos logs da Vercel.

O caminho de volta é [`sql/restaurar-permissoes.sql`](sql/restaurar-permissoes.sql).
É idempotente: devolve os `GRANT`s mínimos, cria apenas as políticas que estiverem
faltando — preservando as que sobreviveram — e termina imprimindo o estado final.

Duas coisas que economizam tempo no diagnóstico:

- `42501` é privilégio de tabela e acontece **depois** da autenticação. Trocar a chave de
  API não causa nem resolve. Se a chave estivesse errada, a resposta seria
  `Invalid API key`, e a requisição nem chegaria à tabela.
- Se o erro fosse `PGRST106`, o problema seria outro: o schema `public` deixou de estar
  exposto no Data API, e o conserto é em Settings → API, não no SQL.
