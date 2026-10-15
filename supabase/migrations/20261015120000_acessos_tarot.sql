-- Tarot da Jaya: acesso por compra na Hotmart (12 meses). Spec: TAROT-SALE-001
-- (repo Jaya_Hub_Page, docs/stories/TAROT-SALE-001.md). Só cria objetos novos,
-- todos com sufixo _tarot. Não toca em acessos_produtos nem em alunos_claude.

-- ---------------------------------------------------------------------------
-- acessos_tarot: quem pode entrar no Tarot, e até quando.
-- ---------------------------------------------------------------------------
create table if not exists public.acessos_tarot (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  nome       text,
  ativo      boolean not null default true,
  expira_em  timestamptz,
  origem     text not null check (origem in ('hotmart', 'manual')),
  transacao  text,
  criado_em  timestamptz not null default now(),
  criado_por text,
  constraint acessos_tarot_email_minusculo check (email = lower(btrim(email))),
  constraint acessos_tarot_email_unico unique (email)
);

comment on table public.acessos_tarot is
  'Acesso ao Tarot da Jaya. expira_em nulo = sem validade (liberação manual). Compra na Hotmart concede 12 meses; recompra soma 12 meses.';

alter table public.acessos_tarot enable row level security;
revoke all on public.acessos_tarot from anon;
grant select, insert, update on public.acessos_tarot to authenticated;
grant select, insert, update on public.acessos_tarot to service_role;

-- Mesmas regras do acessos_produtos: a administradora gerencia; o comprador lê
-- só a própria linha, e só enquanto ativa e dentro da validade.
create policy "admin le acessos do tarot" on public.acessos_tarot
  for select to authenticated using (public.eh_admin());
create policy "admin cria acessos do tarot" on public.acessos_tarot
  for insert to authenticated with check (public.eh_admin());
create policy "admin atualiza acessos do tarot" on public.acessos_tarot
  for update to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy "comprador le o proprio acesso ao tarot" on public.acessos_tarot
  for select to authenticated using (
    email = lower(auth.jwt() ->> 'email')
    and ativo
    and (expira_em is null or expira_em > now())
  );

-- ---------------------------------------------------------------------------
-- hotmart_eventos_tarot: idempotência e trilha de auditoria (só service_role).
-- ---------------------------------------------------------------------------
create table if not exists public.hotmart_eventos_tarot (
  id          uuid primary key default gen_random_uuid(),
  transacao   text not null,
  evento      text not null,
  email       text,
  produto_id  text,
  resultado   text not null default 'processando',
  recebido_em timestamptz not null default now(),
  unique (transacao, evento)
);

comment on table public.hotmart_eventos_tarot is
  'Eventos do webhook da Hotmart para o Tarot da Jaya. unique(transacao, evento) evita processar a mesma entrega duas vezes e liga um reembolso à compra que concedeu o acesso.';

alter table public.hotmart_eventos_tarot enable row level security;
revoke all on public.hotmart_eventos_tarot from anon, authenticated;
grant select, insert, update on public.hotmart_eventos_tarot to service_role;

-- ---------------------------------------------------------------------------
-- Regra de conceder, renovar e retirar o acesso.
--   PURCHASE_APPROVED : sem linha -> concede 12 meses (concedido);
--                       linha manual sem validade -> nada muda (ja_ativo);
--                       linha ativa e dentro da validade -> soma 12 meses (renovado);
--                       linha vencida ou desativada -> 12 meses a partir de agora (reativado).
--   REFUNDED / CHARGEBACK / CANCELED : só desfaz o que ESTA transação concedeu:
--                       se sobrou outra compra, tira 12 meses; senão desativa.
-- ---------------------------------------------------------------------------
create or replace function public.hotmart_processar_evento_tarot(
  p_transacao  text,
  p_evento     text,
  p_email      text,
  p_nome       text,
  p_produto_id text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email     text := lower(btrim(coalesce(p_email, '')));
  v_evento_id uuid;
  v_acesso    public.acessos_tarot%rowtype;
  v_resultado text;
begin
  insert into public.hotmart_eventos_tarot (transacao, evento, email, produto_id)
  values (p_transacao, p_evento, nullif(v_email, ''), p_produto_id)
  on conflict (transacao, evento) do nothing
  returning id into v_evento_id;

  -- Entrega repetida da Hotmart: nada a fazer.
  if v_evento_id is null then
    return 'duplicado';
  end if;

  if p_evento = 'PURCHASE_APPROVED' then
    if v_email = '' then
      v_resultado := 'email_invalido';
    else
      select * into v_acesso from public.acessos_tarot where email = v_email for update;
      if not found then
        insert into public.acessos_tarot (email, nome, ativo, expira_em, origem, transacao, criado_por)
        values (v_email, nullif(p_nome, ''), true, now() + interval '12 months', 'hotmart', p_transacao, 'hotmart');
        v_resultado := 'concedido';
      elsif v_acesso.ativo and v_acesso.expira_em is null then
        -- Liberada à mão, sem validade: a compra não pode encurtar nem o reembolso retirar.
        v_resultado := 'ja_ativo';
      elsif v_acesso.ativo and v_acesso.expira_em > now() then
        update public.acessos_tarot
           set expira_em = v_acesso.expira_em + interval '12 months',
               transacao = p_transacao
         where id = v_acesso.id;
        v_resultado := 'renovado';
      else
        update public.acessos_tarot
           set ativo = true,
               expira_em = now() + interval '12 months',
               transacao = p_transacao,
               nome = coalesce(nome, nullif(p_nome, ''))
         where id = v_acesso.id;
        v_resultado := 'reativado';
      end if;
    end if;

  elsif p_evento in ('PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_CANCELED') then
    if not exists (
      select 1 from public.hotmart_eventos_tarot
       where transacao = p_transacao
         and evento = 'PURCHASE_APPROVED'
         and resultado in ('concedido', 'renovado', 'reativado')
    ) then
      v_resultado := 'sem_concessao';
    else
      select * into v_acesso from public.acessos_tarot where email = v_email for update;
      if not found or v_acesso.expira_em is null then
        v_resultado := 'sem_concessao';
      elsif v_acesso.expira_em - interval '12 months' > now() then
        -- Havia outra compra por cima: tira só os 12 meses desta.
        update public.acessos_tarot
           set expira_em = v_acesso.expira_em - interval '12 months'
         where id = v_acesso.id;
        v_resultado := 'reduzido';
      else
        update public.acessos_tarot set ativo = false where id = v_acesso.id;
        v_resultado := 'revogado';
      end if;
    end if;

  else
    -- PURCHASE_COMPLETE, PURCHASE_PROTEST e demais: só registro.
    v_resultado := 'registrado';
  end if;

  update public.hotmart_eventos_tarot set resultado = v_resultado where id = v_evento_id;
  return v_resultado;
end;
$$;

revoke all on function public.hotmart_processar_evento_tarot(text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.hotmart_processar_evento_tarot(text, text, text, text, text) to service_role;
