export const DESTINO_CURSO = '/claude-do-zero';
export const DESTINO_ZONA = '/zona-de-genialidade/iniciar';
export const DESTINO_CONSCIENCIA = '/arquitetura-da-consciencia';
export const DESTINO_BIBLIOTECA = '/biblioteca';

/* A biblioteca aceita voltar para o próprio guia: /biblioteca ou /biblioteca/<slug>.
   O padrão só deixa passar caminhos internos, então não abre redirecionamento. */
const CAMINHO_BIBLIOTECA = /^\/biblioteca(?:\/[a-z0-9-]+)?$/;

export function normalizarDestinoLogin(valor: string | null | undefined) {
  if (valor === DESTINO_ZONA) return DESTINO_ZONA;
  if (valor === DESTINO_CONSCIENCIA) return DESTINO_CONSCIENCIA;
  if (valor && CAMINHO_BIBLIOTECA.test(valor)) return valor;
  return DESTINO_CURSO;
}

export function destinoEhZona(destino: string) {
  return destino === DESTINO_ZONA;
}

export function destinoEhConsciencia(destino: string) {
  return destino === DESTINO_CONSCIENCIA;
}

export function destinoEhBiblioteca(destino: string) {
  return CAMINHO_BIBLIOTECA.test(destino);
}
