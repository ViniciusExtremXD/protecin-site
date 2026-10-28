/**
 * Mede a carga e a fluidez da rolagem como uma pessoa rola (adaptado da Indafire; design-final §15 e AC-26).
 *
 * Carga (sem desaceleração de CPU, ou 4G + CPU 4x com --4g): FCP, LCP, TBT (soma do que passa de 50 ms em cada
 * tarefa longa até o fim da medida da carga, uma aproximação do TBT do Lighthouse), CLS e bytes sem vídeo.
 * Rolagem (CPU desacelerada, padrão 4x): roda do mouse no desktop, scrollBy no celular, intervalo entre quadros
 * e custo do navegador (estilo, layout, script).
 *
 * Uso: node scripts/medir-desempenho.mjs [url] [--cpu 4] [--mobile] [--reduzido] [--4g] [--gpu] [--saida <pasta>]
 *   --4g: a carga roda com rede e CPU do Lighthouse mobile (150 ms de RTT, 1,6 Mbps, CPU 4x) para estimar o LCP
 *   sem url: serve dist/ em http://127.0.0.1:4195/protecin-site/ e mede a home (o site anima sempre; --reduzido só
 *   emula prefers-reduced-motion: reduce, que não muda nada)
 *   → <saida, padrão verificacao>/desempenho[-mobile][-reduzido][-4g].json e resumo no console
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import puppeteer from "puppeteer-core";

const args = process.argv.slice(2);
const cpu = Number(args.includes("--cpu") ? args[args.indexOf("--cpu") + 1] : 4);
const mobile = args.includes("--mobile");
const reduzido = args.includes("--reduzido");
const rede4g = args.includes("--4g");
const SAIDA = args.includes("--saida") ? args[args.indexOf("--saida") + 1] : "verificacao";
const ehAntivirus = (u = "") => /kaspersky-labs\.com|\.scr\.kaspersky/.test(u);
let url = args.find((a) => a.startsWith("http"));
let servidor = null;
if (!url) {
  const { servir } = await import(pathToFileURL(path.resolve("scripts/servir-estatico.mjs")).href);
  servidor = await servir(4195, "/protecin-site", path.resolve("dist"));
  url = "http://127.0.0.1:4195/protecin-site/";
}

const CHROMES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  path.join(os.homedir(), "AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"),
  "/usr/bin/google-chrome",
];

async function main() {
  const perfil = path.join(os.tmpdir(), `ptdd${process.pid % 10000}`);
  await rm(perfil, { recursive: true, force: true }).catch(() => {});
  const nav = await puppeteer.launch({
    executablePath: CHROMES.find((c) => existsSync(c)),
    headless: true,
    userDataDir: perfil,
    args: [
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      ...(args.includes("--gpu") ? ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--enable-gpu-rasterization"] : []),
    ],
  });
  try {
    const page = await nav.newPage();
    await page.setViewport(mobile ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduzido ? "reduce" : "no-preference" }]);
    const cdp = await page.createCDPSession();
    await cdp.send("Performance.enable");
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    // bytes sem vídeo; fora o antivírus da máquina; texto que chega sem Content-Encoding (o antivírus descomprime
    // para injetar script) conta pelo tamanho em gzip, como o GitHub Pages e a Locaweb servem
    const resp = new Map();
    let bytes = 0;
    let video = 0;
    const pendentes = [];
    cdp.on("Network.responseReceived", (e) =>
      resp.set(e.requestId, { tipo: e.response.mimeType, url: e.response.url, enc: Object.keys(e.response.headers).some((h) => h.toLowerCase() === "content-encoding") }),
    );
    cdp.on("Network.loadingFinished", (e) => {
      const r = resp.get(e.requestId) ?? {};
      if (ehAntivirus(r.url) || /^data:/.test(r.url ?? "")) return;
      if (/^video\//.test(r.tipo ?? "")) video += e.encodedDataLength;
      else if (/^(text\/|application\/(javascript|json|xml)|image\/svg)/.test(r.tipo ?? "") && !r.enc)
        pendentes.push(
          cdp
            .send("Network.getResponseBody", { requestId: e.requestId })
            .then((b) => (bytes += gzipSync(Buffer.from(b.body, b.base64Encoded ? "base64" : "utf8")).length))
            .catch(() => (bytes += e.encodedDataLength)),
        );
      else bytes += e.encodedDataLength;
    });
    if (rede4g) {
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    await page.evaluateOnNewDocument(() => {
      window.__lcp = 0;
      window.__lcpEl = "";
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          window.__lcp = e.startTime;
          window.__lcpEl = e.element ? `${e.element.tagName.toLowerCase()} ${(e.element.currentSrc || e.element.textContent || "").slice(-60)}` : "";
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
      window.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      window.__longas = 0;
      window.__tbt = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__tbt += Math.max(0, e.duration - 50);
        window.__longas += l.getEntries().length;
      }).observe({ type: "longtask", buffered: true });
    });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
    await new Promise((r) => setTimeout(r, 2500));
    const carga = await page.evaluate(() => ({
      lcp: window.__lcp,
      lcpEl: window.__lcpEl,
      cls: window.__cls,
      tbt: window.__tbt,
      fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0,
    }));
    await Promise.all(pendentes);
    const bytesCarga = bytes;
    if (rede4g) await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });

    await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
    const antes = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
    await page.evaluate(() => {
      window.__quadros = [];
      let ultimo = performance.now();
      const loop = (t) => {
        window.__quadros.push(t - ultimo);
        ultimo = t;
        if (!window.__parar) requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
    const altura = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.mouse.move(700, 450);
    const inicio = Date.now();
    for (let i = 0; i < 900; i++) {
      if (mobile) await page.evaluate(() => window.scrollBy(0, 100));
      else await page.mouse.wheel({ deltaY: 100 });
      await new Promise((r) => setTimeout(r, 16));
      if (await page.evaluate((h) => window.scrollY + window.innerHeight >= h - 4, altura)) break;
    }
    await new Promise((r) => setTimeout(r, 1200));
    const duracao = Date.now() - inicio;
    const quadros = await page.evaluate(() => {
      window.__parar = true;
      return window.__quadros.slice(2);
    });
    const depois = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
    await Promise.all(pendentes);
    const fim = await page.evaluate(() => ({ cls: window.__cls, longas: window.__longas }));

    const ordenados = [...quadros].sort((a, b) => a - b);
    const p = (q) => ordenados[Math.floor(ordenados.length * q)] ?? 0;
    const d = (k) => +(((depois[k] ?? 0) - (antes[k] ?? 0)) * 1000).toFixed(0);
    const resultado = {
      url,
      viewport: mobile ? "390 (celular)" : "1440",
      movimento: reduzido ? "reduzido" : "completo",
      cargaComo: rede4g ? "4G simulado do Lighthouse (150 ms, 1,6 Mbps, CPU 4x)" : "rede local, CPU sem desaceleração",
      fcpMs: Math.round(carga.fcp),
      lcpMs: Math.round(carga.lcp),
      tbtMs: Math.round(carga.tbt),
      lcpElemento: carga.lcpEl,
      clsCarga: +carga.cls.toFixed(4),
      clsAposRolar: +fim.cls.toFixed(4),
      primeiraCargaKB: Math.round(bytesCarga / 1024),
      homeRoladaKB: Math.round(bytes / 1024),
      videoKB: Math.round(video / 1024),
      cpu: `${cpu}x mais lenta`,
      rolagemMs: duracao,
      quadros: quadros.length,
      fpsMedio: +(1000 / (quadros.reduce((s, q) => s + q, 0) / Math.max(1, quadros.length))).toFixed(1),
      quadroMedianoMs: +p(0.5).toFixed(1),
      quadroP95Ms: +p(0.95).toFixed(1),
      piorQuadroMs: +(ordenados.at(-1) ?? 0).toFixed(1),
      quadrosTravados: quadros.filter((q) => q > 50).length,
      percentualAcima33ms: +((quadros.filter((q) => q > 33.4).length / Math.max(1, quadros.length)) * 100).toFixed(1),
      custoEstiloMs: d("RecalcStyleDuration"),
      custoLayoutMs: d("LayoutDuration"),
      custoScriptMs: d("ScriptDuration"),
      tarefasLongas: fim.longas,
    };
    await mkdir(SAIDA, { recursive: true });
    await writeFile(path.join(SAIDA, `desempenho${mobile ? "-mobile" : ""}${reduzido ? "-reduzido" : ""}${rede4g ? "-4g" : ""}.json`), JSON.stringify(resultado, null, 2));
    console.log(resultado);
  } finally {
    await nav.close();
    servidor?.close();
    await rm(perfil, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
