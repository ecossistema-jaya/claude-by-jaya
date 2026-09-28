-- Controle de acesso por produto da Plataforma SHAKTI JAYA.
-- Zona de Genialidade, Arquitetura da Consciência e Atlas de Forças somente para convidados.
-- Rode no SQL Editor do projeto Supabase zflksglibxhbnxndfwxo antes do deploy.

create table if not exists public.acessos_produtos (
  id uuid primary key default gen_random_uuid(),
  produto text not null check (produto ~ '^[a-z0-9-]+$'),
  email text not null check (email = lower(trim(email))),
  nome text,
  ativo boolean not null default true,
  expira_em timestamptz,
  criado_em timestamptz not null default now(),
  criado_por text,
  unique (produto, email)
);

comment on table public.acessos_produtos is
  'Permissões individuais por produto. Uma conta Google só acessa quando existe linha ativa.';

alter table public.acessos_produtos enable row level security;

-- Evita recursão nas políticas de alunos_claude e permite que o painel atual
-- administre convites sem expor a lista inteira aos convidados.
create or replace function public.eh_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $funcao$
  select exists (
    select 1 from public.alunos_claude a
    where lower(a.email) = lower(auth.jwt() ->> 'email')
      and a.papel = 'admin'
      and a.ativo
  );
$funcao$;

revoke all on function public.eh_admin() from public, anon;
grant execute on function public.eh_admin() to authenticated;

drop policy if exists "convidado le o proprio acesso" on public.acessos_produtos;
create policy "convidado le o proprio acesso"
  on public.acessos_produtos
  for select
  to authenticated
  using (
    email = lower(auth.jwt() ->> 'email')
    and ativo
    and (expira_em is null or expira_em > now())
  );

drop policy if exists "admin le acessos de produtos" on public.acessos_produtos;
create policy "admin le acessos de produtos"
  on public.acessos_produtos
  for select
  to authenticated
  using (public.eh_admin());

drop policy if exists "admin cria acessos de produtos" on public.acessos_produtos;
create policy "admin cria acessos de produtos"
  on public.acessos_produtos
  for insert
  to authenticated
  with check (public.eh_admin());

drop policy if exists "admin atualiza acessos de produtos" on public.acessos_produtos;
create policy "admin atualiza acessos de produtos"
  on public.acessos_produtos
  for update
  to authenticated
  using (public.eh_admin())
  with check (public.eh_admin());

-- O Supabase pode aplicar default privileges amplos a novas tabelas. Revogamos
-- explicitamente antes de devolver somente o necessário para o painel e o acesso.
revoke all on public.acessos_produtos from anon, authenticated;
grant select, insert, update on public.acessos_produtos to authenticated;

create index if not exists acessos_produtos_ativos_idx
  on public.acessos_produtos (produto, email)
  where ativo;

-- Primeiros convites recomendados: a própria conta administradora, para o teste real.
-- Troque o e-mail somente se sua conta Google autorizada for outra.
insert into public.acessos_produtos (produto, email, nome, criado_por)
values
  ('zona-de-genialidade', 'betinha.potter@gmail.com', 'Jaya Roberta', 'implantacao-v1'),
  ('arquitetura-da-consciencia', 'betinha.potter@gmail.com', 'Jaya Roberta', 'implantacao-v1'),
  ('atlas-de-forcas', 'betinha.potter@gmail.com', 'Jaya Roberta', 'implantacao-v1')
on conflict (produto, email) do update set ativo = true, expira_em = null;

select produto, email, ativo, expira_em, criado_em
from public.acessos_produtos
order by produto, criado_em desc;
