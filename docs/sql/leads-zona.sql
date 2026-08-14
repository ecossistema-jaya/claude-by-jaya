-- Leads da Zona de Genialidade (/zona-de-genialidade)
--
-- Rode no SQL Editor do Supabase. O projeto não versiona migrations: as tabelas
-- alunos_claude e acessos_claude estão descritas em prosa em docs/acesso-com-google.md,
-- e este arquivo segue a mesma convenção, só que com o DDL pronto para colar.
--
-- Guarda o mínimo: e-mail, de onde veio e quando consentiu. Sem IP, sem user-agent,
-- sem respostas do questionário. As respostas ficam no navegador da pessoa
-- (localStorage) e nunca chegam ao banco — o que não é coletado não vaza.

create table if not exists public.leads_zona (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  origem text,
  consentimento_em timestamptz not null default now(),
  criado_em timestamptz not null default now()
);

comment on table public.leads_zona is
  'Leads capturados no assessment público da Zona de Genialidade.';
comment on column public.leads_zona.origem is
  'De onde veio o preenchimento. Padrão: zona-de-genialidade.';
comment on column public.leads_zona.consentimento_em is
  'Momento da marcação explícita de consentimento. Base legal do envio posterior.';

alter table public.leads_zona enable row level security;

-- INSERT e só. A rota /api/zona/lead usa a chave anônima, que é pública por
-- construção (NEXT_PUBLIC_): tudo que for liberado aqui está liberado para
-- qualquer um que chame a API do Supabase por fora do site.
--
-- Sem SELECT: ninguém lê a lista pelo cliente, nem logado.
-- Sem UPDATE: por isso a rota usa insert e trata 23505 (e-mail repetido) como
-- sucesso, em vez de upsert. Upsert precisaria de UPDATE aberto, e aí qualquer
-- pessoa reescreveria a linha de outra.
-- Sem DELETE: pedido de exclusão (LGPD) é operação manual, feita pelo painel.
drop policy if exists "anon insere lead" on public.leads_zona;
create policy "anon insere lead"
  on public.leads_zona
  for insert
  to anon
  with check (true);

-- Leitura da lista: pelo painel do Supabase, que usa a service role e passa por
-- cima da RLS. Se um dia a lista precisar aparecer dentro do site, esta é a
-- política a habilitar — mesmo critério de admin já usado em alunos_claude:
--
-- create policy "admin lê leads"
--   on public.leads_zona
--   for select
--   to authenticated
--   using (exists (
--     select 1 from public.alunos_claude a
--     where a.email = auth.jwt() ->> 'email'
--       and a.papel = 'admin'
--       and a.ativo
--   ));

create index if not exists leads_zona_criado_em_idx
  on public.leads_zona (criado_em desc);
