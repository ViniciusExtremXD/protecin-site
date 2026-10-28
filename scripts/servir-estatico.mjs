/**
 * Servidor estático mínimo que imita o GitHub Pages (design-final §17.8, passo 6): serve dist/ em /protecin-site/,
 * redireciona pasta sem barra para pasta com barra (301, como o Pages), resolve pasta → index.html e cai no
 * 404.html com status 404. Comprime em gzip os arquivos de texto, como o Pages (o peso medido é o real).
 * Usado pelo verify --estatico, pelo medir-desempenho e pelo qa/capturar.mjs.
 *
 * Uso: node scripts/servir-estatico.mjs [porta] [--base /protecin-site]
 * Também exporta servir(porta, base) para os outros scripts.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".pdf": "application/pdf",
};

async function ehPasta(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}
async function ehArquivo(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

const TEXTO = /^(text\/|application\/(json|xml)|image\/svg)/;
const gz = new Map();

export function servir(porta = 4195, base = "/protecin-site", raizDist = path.resolve("dist")) {
  const BASE = base.replace(/\/$/, "");
  const servidor = createServer(async (req, res) => {
    const [cru, query = ""] = (req.url ?? "/").split("?");
    let url;
    try {
      url = decodeURIComponent(cru);
    } catch {
      res.writeHead(400);
      return res.end();
    }
    if (BASE && !url.startsWith(`${BASE}/`) && url !== BASE) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("fora da base");
    }
    const relativo = url.slice(BASE.length) || "/";
    const alvo = path.join(raizDist, relativo);
    if (!alvo.startsWith(raizDist)) {
      res.writeHead(403);
      return res.end();
    }
    if (!relativo.endsWith("/") && (await ehPasta(alvo))) {
      res.writeHead(301, { Location: `${cru}/${query ? `?${query}` : ""}` });
      return res.end();
    }
    let final = null;
    if (await ehPasta(alvo)) final = (await ehArquivo(path.join(alvo, "index.html"))) ? path.join(alvo, "index.html") : null;
    else if (await ehArquivo(alvo)) final = alvo;
    const status = final ? 200 : 404;
    final ??= path.join(raizDist, "404.html");
    const corpo = await readFile(final).catch(() => null);
    if (!corpo) {
      res.writeHead(404);
      return res.end("404");
    }
    const tipo = TIPOS[path.extname(final).toLowerCase()] ?? "application/octet-stream";
    const range = req.headers.range;
    if (range && tipo.startsWith("video/")) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      const ini = m && m[1] ? Number(m[1]) : 0;
      const fim = m && m[2] ? Math.min(Number(m[2]), corpo.length - 1) : corpo.length - 1;
      res.writeHead(206, { "Content-Type": tipo, "Content-Range": `bytes ${ini}-${fim}/${corpo.length}`, "Accept-Ranges": "bytes", "Content-Length": fim - ini + 1 });
      return res.end(corpo.subarray(ini, fim + 1));
    }
    if (TEXTO.test(tipo) && /gzip/.test(String(req.headers["accept-encoding"] ?? ""))) {
      const chave = `${final}:${corpo.length}`;
      if (!gz.has(chave)) gz.set(chave, gzipSync(corpo, { level: 9 }));
      res.writeHead(status, { "Content-Type": tipo, "Content-Encoding": "gzip", Vary: "Accept-Encoding", "Cache-Control": "no-cache" });
      return res.end(gz.get(chave));
    }
    res.writeHead(status, { "Content-Type": tipo, "Accept-Ranges": "bytes", "Cache-Control": "no-cache" });
    res.end(corpo);
  });
  return new Promise((ok, erro) => {
    servidor.once("error", erro);
    servidor.listen(porta, "127.0.0.1", () => ok(servidor));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const porta = Number(args.find((a) => /^\d+$/.test(a)) ?? 4195);
  const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "/protecin-site";
  await servir(porta, base);
  console.log(`dist/ em http://127.0.0.1:${porta}${base}/`);
}

