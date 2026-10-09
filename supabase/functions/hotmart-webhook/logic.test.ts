/* Rodar: node --test supabase/functions/hotmart-webhook/logic.test.ts
   O corpo de exemplo reproduz o formato do evento de teste real da Hotmart
   (2026-10-09), com dados fictícios do próprio sandbox deles. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lerEvento, normalizarEmail, tokenValido } from './logic.ts';

function corpo(sobrescrever: Record<string, unknown> = {}) {
  return {
    id: 'dc270ec6-95d3-4dfa-b7ad-97b4fbd016ce',
    event: 'PURCHASE_APPROVED',
    version: '2.0.0',
    data: {
      product: { id: 8691723, name: 'Claude do Zero' },
      purchase: { transaction: 'HP16015479281022', status: 'APPROVED' },
      buyer: { email: '  Teste.Comprador@Example.com ', name: 'Teste Comprador' },
    },
    ...sobrescrever,
  };
}

test('lê evento, transação, e-mail normalizado, nome e produto como texto', () => {
  assert.deepEqual(lerEvento(corpo()), {
    evento: 'PURCHASE_APPROVED',
    transacao: 'HP16015479281022',
    email: 'teste.comprador@example.com',
    nome: 'Teste Comprador',
    produtoId: '8691723',
  });
});

test('sem evento ou sem transação não há como deduplicar: null', () => {
  assert.equal(lerEvento(corpo({ event: undefined })), null);
  assert.equal(lerEvento(corpo({ data: { purchase: {} } })), null);
  assert.equal(lerEvento(null), null);
  assert.equal(lerEvento('texto'), null);
});

test('e-mail inválido ou ausente vira string vazia, mas o evento continua legível', () => {
  const semArroba = corpo({ data: { purchase: { transaction: 'T1' }, buyer: { email: 'sem-arroba' } } });
  assert.equal(lerEvento(semArroba)?.email, '');
  const semComprador = corpo({ data: { purchase: { transaction: 'T1' } } });
  assert.equal(lerEvento(semComprador)?.email, '');
});

test('produto numérico 0 do sandbox vira "0" e não casa com o produto real', () => {
  const sandbox = corpo({ data: { product: { id: 0 }, purchase: { transaction: 'T1' }, buyer: { email: 'a@b.co' } } });
  assert.equal(lerEvento(sandbox)?.produtoId, '0');
});

test('normalizarEmail aceita qualquer entrada sem quebrar', () => {
  assert.equal(normalizarEmail(' A@B.com '), 'a@b.com');
  assert.equal(normalizarEmail(undefined), '');
  assert.equal(normalizarEmail(42), '');
});

test('hottok: igual passa; diferente, vazio, ausente ou de outro tamanho falha', () => {
  const segredo = 'abcdefghijklmnopqrstuvwxyz0123456789A';
  assert.equal(tokenValido(segredo, segredo), true);
  assert.equal(tokenValido(segredo.slice(0, -1) + 'B', segredo), false);
  assert.equal(tokenValido(segredo + 'x', segredo), false);
  assert.equal(tokenValido(segredo.slice(0, 10), segredo), false);
  assert.equal(tokenValido('', segredo), false);
  assert.equal(tokenValido(null, segredo), false);
  assert.equal(tokenValido(segredo, undefined), false);
  assert.equal(tokenValido(segredo, ''), false);
});
