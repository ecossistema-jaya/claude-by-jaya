# Acesso ao curso com login do Google

A senha única saiu. Agora o aluno entra com a conta Google dele, e só entra
quem estiver na tabela `alunos_claude` do Supabase.

## Como funciona

1. `/login` manda o aluno para o Google.
2. O Google devolve em `/auth/callback`, que confere a allowlist. Quem não está
   nela é deslogado na hora e vai para `/sem-acesso`.
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
