"""QA técnico do site no ar: metadados, títulos, imagens, links e arquivos de cada página.

Uso: python -I scripts/qa-site-atual.py qa/qa-site-atual.json
Só faz GET/HEAD; não envia formulários. Para se o servidor responder com desafio do WAF.
"""
import json
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

BASE = "https://protecin.com.br"
PAGINAS = ["/", "/institucional/", "/servicos/", "/nossos-clientes/", "/catalogo-digital/", "/nosso-app/", "/contato/"]
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"}


class Coletor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.meta, self.links, self.recursos, self.imgs, self.h1, self.forms = {}, [], [], [], [], []
        self.lang, self.titulo, self._em_titulo, self._em_h1, self._h1 = None, "", False, False, []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "title":
            self._em_titulo = True
        elif tag == "meta":
            k = a.get("name") or a.get("property")
            if k:
                self.meta[k.lower()] = a.get("content", "")
        elif tag == "link":
            rel = (a.get("rel") or "").lower()
            if a.get("href"):
                self.recursos.append(("link:" + rel, a["href"]))
                if rel in ("canonical", "icon", "apple-touch-icon"):
                    self.meta["link:" + rel] = a["href"]
        elif tag == "script" and a.get("src"):
            self.recursos.append(("script", a["src"]))
        elif tag == "img":
            src = a.get("src") or ""
            self.imgs.append({"src": src, "alt": a.get("alt"), "width": a.get("width"), "height": a.get("height"), "loading": a.get("loading")})
            if src and not src.startswith("data:"):
                self.recursos.append(("img", src))
        elif tag == "a" and a.get("href"):
            self.links.append({"href": a["href"], "target": a.get("target"), "rel": a.get("rel")})
        elif tag == "h1":
            self._em_h1, self._h1 = True, []
        elif tag == "form":
            self.forms.append({"action": a.get("action"), "id": a.get("id"), "class": a.get("class")})

    def handle_endtag(self, tag):
        if tag == "title":
            self._em_titulo = False
        elif tag == "h1" and self._em_h1:
            self._em_h1 = False
            self.h1.append(re.sub(r"\s+", " ", "".join(self._h1)).strip())

    def handle_data(self, d):
        if self._em_titulo:
            self.titulo += d
        if self._em_h1:
            self._h1.append(d)


def buscar(url, metodo="GET"):
    req = urllib.request.Request(url, headers=UA, method=metodo)
    t = time.time()
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            corpo = r.read() if metodo == "GET" else b""
            return r.status, r.geturl(), corpo, dict(r.headers), round(time.time() - t, 2)
    except urllib.error.HTTPError as e:
        return e.code, url, b"", dict(e.headers or {}), round(time.time() - t, 2)
    except Exception as e:  # noqa: BLE001
        return f"erro: {e.__class__.__name__}: {e}", url, b"", {}, round(time.time() - t, 2)


def status_url(url):
    host = urlparse(url).netloc
    metodo = "HEAD" if host.endswith("protecin.com.br") else "GET"
    st, final, _, h, _ = buscar(url, metodo)
    if metodo == "HEAD" and st in (403, 405):
        st, final, _, h, _ = buscar(url, "GET")
    return url, st, final, h.get("Content-Length") or h.get("content-length"), h.get("Content-Type") or h.get("content-type")


def main(saida):
    paginas, todos = {}, set()
    for p in PAGINAS:
        st, final, corpo, headers, tempo = buscar(BASE + p)
        html = corpo.decode("utf-8", "replace")
        if "captcha" in html.lower() and len(html) < 20000:
            raise SystemExit("WAF pediu captcha; parei.")
        c = Coletor()
        c.feed(html)
        abs_ = lambda u: urljoin(BASE + p, u)
        recursos = [(k, abs_(u)) for k, u in c.recursos]
        links = [dict(l, abs=abs_(l["href"])) for l in c.links]
        for _, u in recursos:
            todos.add(u.split("#")[0])
        for l in links:
            if l["abs"].startswith("http"):
                todos.add(l["abs"].split("#")[0])
        paginas[p] = {
            "status": st, "final": final, "tempo_s": tempo, "bytes_html": len(corpo),
            "titulo": c.titulo.strip(), "lang": c.lang, "meta": c.meta, "h1": c.h1,
            "imgs_sem_alt": [i["src"] for i in c.imgs if not (i["alt"] or "").strip()],
            "imgs_total": len(c.imgs),
            "imgs_http": [i["src"] for i in c.imgs if i["src"].startswith("http://")],
            "forms": c.forms,
            "links_externos_sem_noopener": [l["abs"] for l in links if l.get("target") == "_blank" and "noopener" not in (l.get("rel") or "")],
            "links": sorted({l["abs"] for l in links}),
            "n_scripts": sum(1 for k, _ in recursos if k == "script"),
            "n_css": sum(1 for k, _ in recursos if k.startswith("link:stylesheet")),
            "cache_headers": {k: v for k, v in headers.items() if k.lower() in ("cache-control", "server", "x-cache", "content-encoding")},
        }
        time.sleep(1)
    alvos = sorted(u for u in todos if u.startswith("http") and not u.startswith(("mailto:", "tel:")))
    with ThreadPoolExecutor(max_workers=4) as ex:
        resultados = list(ex.map(status_url, alvos))
    quebrados = [r for r in resultados if not (isinstance(r[1], int) and r[1] < 400)]
    tamanhos = sorted(((int(r[3]) if (r[3] or "").isdigit() else 0), r[0]) for r in resultados if r[0].endswith((".png", ".jpg", ".jpeg", ".webp", ".gif")))
    json.dump({"paginas": paginas, "urls_verificadas": len(resultados), "quebrados": quebrados,
               "maiores_imagens": tamanhos[-15:][::-1], "todos": resultados}, open(saida, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("páginas:", len(paginas), "urls:", len(resultados), "quebrados:", len(quebrados))


if __name__ == "__main__":
    main(sys.argv[1])
