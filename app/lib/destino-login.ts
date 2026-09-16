export const DESTINO_CURSO = '/claude-do-zero';
export const DESTINO_ZONA = '/zona-de-genialidade/iniciar';

export function normalizarDestinoLogin(valor: string | null | undefined) {
  return valor === DESTINO_ZONA ? DESTINO_ZONA : DESTINO_CURSO;
}

export function destinoEhZona(destino: string) {
  return destino === DESTINO_ZONA;
}
