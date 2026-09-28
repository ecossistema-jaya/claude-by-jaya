export const DESTINO_CURSO = '/claude-do-zero';
export const DESTINO_ZONA = '/zona-de-genialidade/iniciar';
export const DESTINO_CONSCIENCIA = '/arquitetura-da-consciencia';

export function normalizarDestinoLogin(valor: string | null | undefined) {
  if (valor === DESTINO_ZONA) return DESTINO_ZONA;
  if (valor === DESTINO_CONSCIENCIA) return DESTINO_CONSCIENCIA;
  return DESTINO_CURSO;
}

export function destinoEhZona(destino: string) {
  return destino === DESTINO_ZONA;
}

export function destinoEhConsciencia(destino: string) {
  return destino === DESTINO_CONSCIENCIA;
}
