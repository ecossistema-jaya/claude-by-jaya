"""Gera o .html de leitura em tela a partir da fonte HTML-Word (.doc).

Uso:
    python gerar-html.py _fonte/<slug>-fonte.doc <slug>.html

Regras:
- Nunca edite o .html gerado. Edite a fonte e rode de novo.
- O CSS da fonte é preservado integralmente; o @page vai para dentro de
  @media print, e um bloco de estilos de tela (largura da folha, sombra,
  quebras de página visíveis) é acrescentado.
"""
import re
import sys
from pathlib import Path

SCREEN_CSS = """
/* ---- tela: simula a folha 200 x 275 mm ---- */
@media screen {
  html { background: #E9E2D6; }
  body { padding: 24px 12px; }
  div.Section1 {
    max-width: 164mm; margin: 0 auto; background: #FFFFFF;
    padding: 14mm 12mm 14mm 24mm; box-shadow: 0 2px 14px rgba(43,35,32,.18);
  }
  .pb { border-top: 1px dashed #C9BBA3; margin: 28pt 0 22pt 0; height: 0; }
  .pb::after {
    content: "nova página"; display: block; text-align: right;
    font-size: 7pt; color: #9AA0A6; letter-spacing: .8pt; text-transform: uppercase;
    margin-top: -8pt;
  }
}
@media print { .pb { border: none; margin: 0; } .pb::after { content: none; } }
"""


def main(fonte: str, saida: str) -> None:
    src = Path(fonte).read_text(encoding="utf-8")

    # Word-only markup que não faz sentido no navegador.
    html = re.sub(r"<!--\[if gte mso 9\]>.*?<!\[endif\]-->", "", src, flags=re.S)
    html = re.sub(r'<meta name="(ProgId|Generator)"[^>]*>\n?', "", html)
    html = html.replace(
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" '
        'xmlns:w="urn:schemas-microsoft-com:office:word" '
        'xmlns="http://www.w3.org/TR/REC-html40">',
        '<!DOCTYPE html>\n<html lang="pt-BR">',
    )

    # @page só vale na impressão; o resto do CSS fica como está.
    m = re.search(r"@page Section1 \{.*?\}\n", html, flags=re.S)
    if not m:
        sys.exit("abortado: bloco @page Section1 não encontrado na fonte")
    page_rule = m.group(0)
    html = html.replace(page_rule, "@media print {\n" + page_rule + "}\n", 1)
    html = html.replace("</style>", SCREEN_CSS + "</style>", 1)
    html = html.replace(
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">',
        '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">',
    )

    if html.count("</html>") != 1:
        sys.exit("abortado: número de </html> diferente de 1")
    Path(saida).write_text(html, encoding="utf-8")
    print(f"gerado: {saida} ({len(html):,} bytes)")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
