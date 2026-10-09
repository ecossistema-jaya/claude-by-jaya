/* Lógica pura do webhook da Hotmart (v2). Sem Deno nem rede, para rodar também
   em `node --test`. Formato confirmado por evento de teste real em 2026-10-09:
   o hottok vem no cabeçalho `x-hotmart-hottok`; o corpo é
   { id, event, version, creation_date, data: { product, purchase, buyer, ... } }. */

export type EventoHotmart = {
  evento: string;
  transacao: string;
  email: string;
  nome: string;
  produtoId: string;
};

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Mesma regra de `normalizarEmail` em app/lib/aluno.ts. */
export function normalizarEmail(email: unknown) {
  return (typeof email === 'string' ? email : '').trim().toLowerCase();
}

function texto(valor: unknown) {
  return typeof valor === 'string' || typeof valor === 'number' ? String(valor).trim() : '';
}

/* Devolve null quando faltam evento ou transação: sem eles não há como deduplicar.
   E-mail ausente ou inválido volta como string vazia, e o banco registra o evento
   como `email_invalido` em vez de perder o rastro. */
export function lerEvento(corpo: unknown): EventoHotmart | null {
  if (!corpo || typeof corpo !== 'object') return null;
  const raiz = corpo as Record<string, any>;
  const evento = texto(raiz.event);
  const transacao = texto(raiz.data?.purchase?.transaction);
  if (!evento || !transacao) return null;

  const email = normalizarEmail(raiz.data?.buyer?.email);
  return {
    evento,
    transacao,
    email: EMAIL_VALIDO.test(email) ? email : '',
    nome: texto(raiz.data?.buyer?.name),
    produtoId: texto(raiz.data?.product?.id),
  };
}

/* Comparação em tempo constante: não revela por onde os tokens começam a diferir. */
export function tokenValido(recebido: string | null, esperado: string | undefined) {
  if (!recebido || !esperado) return false;
  const a = new TextEncoder().encode(recebido);
  const b = new TextEncoder().encode(esperado);
  let diferenca = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diferenca |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return diferenca === 0;
}
