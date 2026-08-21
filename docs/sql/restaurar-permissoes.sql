-- Restaura o acesso das três tabelas do claude-by-jaya
--
-- Rode no SQL Editor do Supabase, no projeto `zflksglibxhbnxndfwxo`. Pode rodar mais
-- de uma vez: cada trecho confere o estado antes de agir e nada é sobrescrito.
--
-- O sintoma: o banco passou a devolver 42501 ("permission denied for table ...") nas
-- três tabelas, com a dica "GRANT SELECT ... TO anon". Não é RLS — é privilégio de
-- tabela, camada abaixo. As tabelas continuam lá, com as colunas certas; o que sumiu
-- foram os GRANTs para os roles anon e authenticated.
--
-- O estrago é desigual e silencioso dos dois lados:
--   - o gate do aluno faz SELECT em alunos_claude; sem privilégio, `data` volta nulo e
--     o código não distingue isso de "não está na lista". Ninguém entra no curso.
--   - a rota /api/zona/lead tolera falha de gravação de propósito, para não travar a
--     análise de quem já preencheu. Resultado: a Zona segue funcionando e todo e-mail
--     capturado se perde, deixando só um console.error na Vercel.
--
-- A ordem abaixo é deliberada: RLS e políticas ANTES dos privilégios. Assim não existe
-- nenhum instante em que a tabela esteja alcançável sem regra de linha — que é como uma
-- allowlist de alunos vaza.
--
-- Procedência de cada regra:
--   - leads_zng: cópia fiel de docs/sql/leads-zng.sql, com o mesmo nome de política.
--   - alunos_claude e acessos_claude: nunca tiveram DDL versionado. As políticas aqui
--     foram derivadas do que o código exige e do que docs/acesso-com-google.md descreve
--     em prosa ("o aluno só enxerga a própria linha", "apenas papel = 'admin' escreve").
--     Se alguma política original sobreviveu, ela é preservada: os blocos abaixo só
--     criam o que estiver faltando.

-- ------------------------------------------------------------------ 1. RLS ligada
alter table public.alunos_claude  enable row level security;
alter table public.acessos_claude enable row level security;
alter table public.leads_zng      enable row level security;

-- --------------------------------------------------- 2. quem é admin, sem recursão
-- Uma política de SELECT em alunos_claude que consultasse alunos_claude para descobrir
-- o papel dispararia a própria política de novo — o Postgres corta isso com o erro
-- 42P17 (infinite recursion detected in policy). SECURITY DEFINER executa como dono da
-- função, não passa pela RLS, e resolve o ciclo. O search_path fixo impede que alguém
-- desvie a consulta criando um schema de mesmo nome.
create or replace function public.eh_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $funcao$
  select exists (
    select 1 from public.alunos_claude a
    where a.email = (auth.jwt() ->> 'email')
      and a.papel = 'admin'
      and a.ativo
  );
$funcao$;

revoke all on function public.eh_admin() from public, anon;
grant execute on function public.eh_admin() to authenticated;

-- ---------------------------------------------------------------- 3. as políticas
do $politicas$
begin
  -- alunos_claude: o aluno enxerga a própria linha; o admin enxerga e escreve tudo.
  if not exists (select 1 from pg_policies where schemaname = 'public'
                 and tablename = 'alunos_claude' and cmd = 'SELECT') then
    create policy "aluno lê a própria linha" on public.alunos_claude
      for select to authenticated
      using (email = (auth.jwt() ->> 'email'));

    create policy "admin lê todos os alunos" on public.alunos_claude
      for select to authenticated
      using (public.eh_admin());
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public'
                 and tablename = 'alunos_claude' and cmd = 'INSERT') then
    create policy "admin cadastra aluno" on public.alunos_claude
      for insert to authenticated
      with check (public.eh_admin());
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public'
                 and tablename = 'alunos_claude' and cmd = 'UPDATE') then
    create policy "admin edita aluno" on public.alunos_claude
      for update to authenticated
      using (public.eh_admin()) with check (public.eh_admin());
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public'
                 and tablename = 'alunos_claude' and cmd = 'DELETE') then
    create policy "admin remove aluno" on public.alunos_claude
      for delete to authenticated
      using (public.eh_admin());
  end if;

  -- acessos_claude: cada um registra a própria entrada; só o admin lê o histórico.
  if not exists (select 1 from pg_policies where schemaname = 'public'
                 and tablename = 'acessos_claude' and cmd = 'INSERT') then
    create policy "aluno registra o próprio acesso" on public.acessos_claude
      for insert to authenticated
      with check (email = (auth.jwt() ->> 'email'));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public'
                 and tablename = 'acessos_claude' and cmd = 'SELECT') then
    create policy "admin lê os acessos" on public.acessos_claude
      for select to authenticated
      using (public.eh_admin());
  end if;
end
$politicas$;

-- leads_zng: idêntica a docs/sql/leads-zng.sql, mesmo nome, para não criar uma segunda
-- política com o mesmo efeito. INSERT e só: sem SELECT (a lista se lê pelo painel do
-- Supabase, que usa service role e passa por cima da RLS), sem UPDATE (a rota usa insert
-- e trata 23505 como sucesso) e sem DELETE (exclusão LGPD é manual).
drop policy if exists "anon insere lead" on public.leads_zng;
create policy "anon insere lead"
  on public.leads_zng
  for insert
  to anon
  with check (true);

-- ------------------------------------------------------ 4. privilégios, os mínimos
-- Amplos de propósito: é a política da seção 3 que estreita para a linha certa.
grant select, insert, update, delete on public.alunos_claude  to authenticated;
grant select, insert                 on public.acessos_claude to authenticated;
grant insert                         on public.leads_zng      to anon;

-- Se acessos_claude.id for serial em vez de identity, o INSERT também precisa da
-- sequence. Com identity isto não faz falta nem atrapalha.
do $sequencias$
declare s record;
begin
  for s in
    select quote_ident(n.nspname) || '.' || quote_ident(c.relname) as seq
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'S' and n.nspname = 'public' and c.relname like 'acessos_claude%'
  loop
    execute 'grant usage, select on sequence ' || s.seq || ' to authenticated';
  end loop;
end
$sequencias$;

-- ---------------------------------------- 5. a unicidade de que o código depende
-- docs/sql/leads-zng.sql declara `email text not null unique`, e a rota trata o erro
-- 23505 como sucesso ("o lead já estava lá"). Sem a restrição, e-mail repetido vira
-- linha nova e a deduplicação some sem avisar.
do $unicidade$
begin
  if not exists (
    select 1 from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    where t.relnamespace = 'public'::regnamespace
      and t.relname = 'leads_zng' and c.contype = 'u'
  ) then
    begin
      alter table public.leads_zng add constraint leads_zng_email_unico unique (email);
    exception when unique_violation then
      raise notice 'Ha e-mails repetidos em leads_zng: limpe as duplicatas antes de criar a restricao.';
    end;
  end if;
end
$unicidade$;

-- ------------------------------------------------ 6. o id do log precisa se gerar
-- acessos_claude.id é bigint sem default. Se o identity tiver se perdido, todo registro
-- de login falha por id nulo — e falharia mesmo com os privilégios de volta.
do $identidade$
begin
  if (select is_identity from information_schema.columns
      where table_schema = 'public' and table_name = 'acessos_claude' and column_name = 'id') = 'NO'
     and (select column_default from information_schema.columns
      where table_schema = 'public' and table_name = 'acessos_claude' and column_name = 'id') is null
  then
    alter table public.acessos_claude alter column id add generated by default as identity;
  end if;
end
$identidade$;

-- ----------------------------------------------------------------- 7. o resultado
-- O SQL Editor mostra apenas o resultado do último comando, então a conferência vem por
-- último e num select só. Esperado: RLS `true` nas três, os grants da seção 4 e as
-- políticas da seção 3.
select 'RLS' as bloco, c.relname as tabela, c.relrowsecurity::text as detalhe, '' as extra
from pg_class c
where c.relnamespace = 'public'::regnamespace
  and c.relname in ('alunos_claude', 'acessos_claude', 'leads_zng')
union all
select 'GRANT', table_name, grantee, string_agg(privilege_type, ',' order by privilege_type)
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('alunos_claude', 'acessos_claude', 'leads_zng')
  and grantee in ('anon', 'authenticated')
group by table_name, grantee
union all
select 'POLICY', tablename, policyname, cmd || ' / ' || array_to_string(roles, '+')
from pg_policies
where schemaname = 'public' and tablename in ('alunos_claude', 'acessos_claude', 'leads_zng')
order by 1, 2, 3;
