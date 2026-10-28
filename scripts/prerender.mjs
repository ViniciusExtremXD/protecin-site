/**
 * Pré-renderização multirrota (design-final §8 e §17.8, passo 5).
 * Lê o template dist/index.html (saída do vite build) e o entry-server compilado em dist-server/, e grava:
 *   dist/<rota>/index.html para cada rota de ROUTES, dist/404.html e dist/sitemap.xml.
 * O bloco <!--lcp:inicio-->…<!--lcp:fim--> (preload do poster do hero) só fica na home. Apaga dist-server/ no fim.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const raiz = process.cwd();
const dist = path.join(raiz, "dist");
const servidor = path.join(raiz, "dist-server", "entry-server.js");
const base = (process.env.VITE_BASE ?? "/").replace(/\/?$/, "/");
const previa = base !== "/";
// origem absoluta do og:image: a prévia mora no GitHub Pages; a produção, no domínio da Protecin
const origem = previa ? "https://viniciusextremxd.github.io" : "https://protecin.com.br";

const { render, head, structuredData, ROUTES, NOT_FOUND } = await import(pathToFileURL(servidor).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
for (const marca of ['<div id="root"></div>', "<!--head-->", "<!--structured-data-->", "<!--lcp:inicio", "<!--lcp:fim-->"]) {
  if (!template.includes(marca)) throw new Error(`prerender: marcador ${marca} não encontrado em dist/index.html`);
}
const jsonLd = structuredData()
  .map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\u003c")}</script>`)
  .join("\n    ");

function pagina(url) {
  let html = template;
  html = html.replace("<!--head-->", head(url, origem, previa));
  html = html.replace("<!--structured-data-->", jsonLd);
  html =
    url === "/"
      ? html.replace(/<!--lcp:inicio[^>]*-->\s*/, "").replace(/\s*<!--lcp:fim-->/, "")
      : html.replace(/\s*<!--lcp:inicio[\s\S]*?<!--lcp:fim-->/, "");
  const corpo = render(url);
  if (/<!--\$!-->/.test(corpo)) throw new Error(`prerender: Suspense sem resolver em ${url}`);
  const h1 = (corpo.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) throw new Error(`prerender: ${url} tem ${h1} <h1> (precisa de exatamente 1)`);
  return { html: html.replace('<div id="root"></div>', `<div id="root">${corpo}</div>`), kb: corpo.length / 1024 };
}

for (const r of ROUTES) {
  const { html, kb } = pagina(r.path);
  const destino = path.join(dist, r.path, "index.html");
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html);
  console.log(`prerender ${r.path.padEnd(20)} ${kb.toFixed(1)} kB`);
}
{
  const { html, kb } = pagina(NOT_FOUND.path);
  fs.writeFileSync(path.join(dist, "404.html"), html);
  console.log(`prerender ${"404.html".padEnd(20)} ${kb.toFixed(1)} kB`);
}

// sitemap com o domínio de produção (a prévia tem noindex de qualquer forma)
const hoje = new Date().toISOString().slice(0, 10);
const urls = ROUTES.filter((r) => !r.noindex)
  .map((r) => `  <url><loc>https://protecin.com.br${r.path}</loc><lastmod>${hoje}</lastmod></url>`)
  .join("\n");
fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

fs.rmSync(path.join(raiz, "dist-server"), { recursive: true, force: true });
console.log(`prerender: ${ROUTES.length} rotas + 404.html + sitemap.xml (base ${base})`);
