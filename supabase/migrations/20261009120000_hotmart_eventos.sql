-- Hotmart: registro de eventos (idempotência + trilha de auditoria) e a regra
-- de conceder/retirar acesso ao Claude do Zero. Spec: docs/hotmart-checkout-spec.md.
-- Não guarda payload completo nem dados pessoais além do e-mail da compra.

create table if not exists public.hotmart_eventos (
  id          uuid primary key default gen_random_uuid(),
  transacao   text not null,
  evento      text not null,
  email       text,
  produto_id  text,
  resultado   text not null default 'processando',
  recebido_em timestamptz not null default now(),
  unique (transacao, evento)
);

comment on table public.hotmart_eventos is
  'Eventos do webhook da Hotmart. Só o service_role acessa. unique(transacao, evento) evita processar a mesma entrega duas vezes e liga um reembolso à compra que concedeu o acesso.';

alter table public.hotmart_eventos enable row level security;
revoke all on public.hotmart_eventos from anon, authenticated;
grant select, insert, update on public.hotmart_eventos to service_role;

create or replace function public.hotmart_processar_evento(
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
  v_evento_id uuid;
  v_aluno     public.alunos_claude%rowtype;
  v_resultado text;
begin
  insert into public.hotmart_eventos (transacao, evento, email, produto_id)
  values (p_transacao, p_evento, nullif(p_email, ''), p_produto_id)
  on conflict (transacao, evento) do nothing
  returning id into v_evento_id;

  -- Entrega repetida da Hotmart: nada a fazer.
  if v_evento_id is null then
    return 'duplicado';
  end if;

  if p_evento = 'PURCHASE_APPROVED' then
    if coalesce(p_email, '') = '' then
      v_resultado := 'email_invalido';
    else
      select * into v_aluno from public.alunos_claude where email = p_email for update;
      if not found then
        insert into public.alunos_claude (email, nome, papel, ativo, observacao, criado_por)
        values (p_email, nullif(p_nome, ''), 'aluno', true, 'hotmart:' || p_transacao, 'hotmart');
        v_resultado := 'concedido';
      elsif v_aluno.papel = 'admin' then
        v_resultado := 'ignorado_admin';
      elsif v_aluno.ativo then
        -- Já tinha acesso (por exemplo, liberado à mão): o reembolso não pode retirá-lo.
        v_resultado := 'ja_ativo';
      else
        update public.alunos_claude
           set ativo = true,
               observacao = concat_ws(' | ', nullif(observacao, ''), 'hotmart:' || p_transacao)
         where id = v_aluno.id;
        v_resultado := 'reativado';
      end if;
    end if;

  elsif p_evento in ('PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_CANCELED') then
    -- Só retira o acesso que esta mesma transação concedeu.
    if not exists (
      select 1 from public.hotmart_eventos
       where transacao = p_transacao
         and evento = 'PURCHASE_APPROVED'
         and resultado in ('concedido', 'reativado')
    ) then
      v_resultado := 'sem_concessao';
    else
      select * into v_aluno from public.alunos_claude where email = p_email for update;
      if not found then
        v_resultado := 'sem_concessao';
      elsif v_aluno.papel = 'admin' then
        v_resultado := 'ignorado_admin';
      else
        update public.alunos_claude set ativo = false where id = v_aluno.id;
        v_resultado := 'revogado';
      end if;
    end if;

  else
    -- PURCHASE_COMPLETE, PURCHASE_PROTEST e demais: só registro.
    v_resultado := 'registrado';
  end if;

  update public.hotmart_eventos set resultado = v_resultado where id = v_evento_id;
  return v_resultado;
end;
$$;

revoke all on function public.hotmart_processar_evento(text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.hotmart_processar_evento(text, text, text, text, text) to service_role;
