"""Extrai o conteúdo (títulos, textos, botões, imagens, links) das páginas do site atual da Protecin.

Uso: python -I scripts/extrair-conteudo.py referencia/conteudo-site-atual.md
"""
import re
import sys
import urllib.request
from html.parser import HTMLParser

BASE = "https://protecin.com.br"
PAGINAS = ["/", "/institucional/", "/servicos/", "/nossos-clientes/", "/catalogo-digital/", "/nosso-app/", "/contato/"]
IGNORAR = {"script", "style", "noscript", "svg", "template"}


class Leitor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.linhas, self.imagens, self.links = [], [], []
        self.pilha, self.texto, self.tag_texto = [], [], None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in IGNORAR:
            self.pilha.append(tag)
            return
        if tag == "img":
            src = a.get("src") or a.get("data-src") or ""
            if src and not src.startswith("data:"):
                self.imagens.append((src, a.get("alt", "")))
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "a", "button", "span", "div"):
            self._fechar()
            self.tag_texto = tag

    def handle_endtag(self, tag):
        if self.pilha and self.pilha[-1] == tag:
            self.pilha.pop()
            return
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "a", "button"):
            self._fechar()

    def handle_data(self, data):
        if self.pilha:
            return
        self.texto.append(data)

    def _fechar(self):
        t = re.sub(r"\s+", " ", "".join(self.texto)).strip()
        if t:
            prefixo = {"h1": "# ", "h2": "## ", "h3": "### ", "h4": "#### ", "li": "- ", "a": "[link] ", "button": "[botão] "}.get(self.tag_texto, "")
            self.linhas.append(prefixo + t)
        self.texto = []


def main(saida):
    partes = []
    for p in PAGINAS:
        html = urllib.request.urlopen(urllib.request.Request(BASE + p, headers={"User-Agent": "Mozilla/5.0"}), timeout=30).read().decode("utf-8", "replace")
        titulo = (re.search(r"<title>([^<]*)", html) or [None, ""])[1]
        desc = (re.search(r'name="description" content="([^"]*)', html) or [None, ""])[1]
        leitor = Leitor()
        leitor.feed(html)
        vistas, linhas = set(), []
        for l in leitor.linhas:
            if l not in vistas:
                vistas.add(l)
                linhas.append(l)
        imgs = sorted({s for s, _ in leitor.imagens})
        links = sorted({h for h in leitor.links if not h.startswith("#")})
        partes.append(f"\n\n==================== PÁGINA {p} ====================\nTítulo: {titulo}\nDescrição: {desc}\n\n" + "\n".join(linhas)
                      + "\n\n--- Imagens ---\n" + "\n".join(imgs) + "\n\n--- Links ---\n" + "\n".join(links))
    with open(saida, "w", encoding="utf-8") as f:
        f.write("# Conteúdo do site atual da Protecin (extraído de https://protecin.com.br)\n" + "".join(partes))
    print("ok", saida)


if __name__ == "__main__":
    main(sys.argv[1])
