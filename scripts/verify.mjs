/**
 * Verificação do site (design-final §16 e §17.8, passo 7). Obrigatória antes de publicar.
 *
 * puppeteer-core com o Chrome instalado, perfil em caminho curto (o Chrome recusa perfil em caminho longo).
 * Seis telas: 1440×900, 1366×657, 768×1024, 390×844, 320×720 e 844×390, com prefers-reduced-motion emulado em
 * no-preference ("full") e em reduce ("reduzido"). Contrato da rodada de sobriedade (qa/AJUSTES-SOBRIEDADE.md):
 * não existe modo reduzido para o visitante — nos dois casos o site ANIMA (motion-full, Lenis no desktop, cenas
 * fixadas, entradas), sem botão nem aviso de movimento e sem ?motion=.
 *
 * Critérios (AC-xx de §16): conteúdo (01–05), motion (06–12), funcional e conversão (13–19), SEO e
 * acessibilidade (20–23, com axe-core), peso da home (25), o teto das cenas fixadas (AC-QA-PIN: rolagem presa =
 * altura da seção − 100vh ≤ 1,2 tela no desktop, no máximo 3 cenas na home; no celular só a Abertura prende, até
 * 0,6) e o comprimento das páginas (AC-QA-ALTURA, scrollHeight em 1440×900 e 390×844, §2). Lighthouse e fps
 * ficam fora (AC-24/26: scripts/medir-desempenho.mjs e Lighthouse).
 *
 * Uso:
 *   node scripts/verify.mjs --estatico            dist/ servido em http://127.0.0.1:4195/protecin-site/ (GitHub Pages)
 *   node scripts/verify.mjs                       dist/ de um build com base "/" servido em http://127.0.0.1:4195/
 *   node scripts/verify.mjs --url <url-base>      um site já no ar (ex.: a prévia publicada)
 *   --so home,servicos   filtra rotas   ·   --telas 1440,390   filtra telas   ·   --rapido   só 1440 e 390
 *   --dist <pasta>   serve outra pasta no lugar do dist/ (build de teste)   ·   --porta 4195   ·   --saida <pasta> do relatório
 * Saída: verificacao/relatorio.json (+ verificacao/relatorio.txt) e código 1 se algum critério falhar.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import puppeteer from "puppeteer-core";

const RAIZ = process.cwd();
const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const arg = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const ESTATICO = args.includes("--estatico");
const URL_EXTERNA = arg("--url");
const RAPIDO = args.includes("--rapido");
const filtroRotas = arg("--so")?.split(",");
const filtroTelas = arg("--telas")?.split(",").map(Number);
const PORTA = Number(arg("--porta") ?? 4195);
const SAIDA = path.resolve(arg("--saida") ?? path.join(RAIZ, "verificacao"));
const DIST = path.resolve(arg("--dist") ?? path.join(RAIZ, "dist"));

const CHROMES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  path.join(os.homedir(), "AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"),
  "/usr/bin/google-chrome",
];

const TODAS_TELAS = [
  { nome: "1440", width: 1440, height: 900, deviceScaleFactor: 1 },
  { nome: "1366", width: 1366, height: 657, deviceScaleFactor: 1 },
  { nome: "768", width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { nome: "390", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { nome: "320", width: 320, height: 720, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { nome: "844", width: 844, height: 390, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];
const TELAS = TODAS_TELAS.filter((t) => (RAPIDO ? [1440, 390].includes(t.width) : true)).filter((t) => !filtroTelas || filtroTelas.includes(t.width));
const T1440 = TODAS_TELAS[0];
const T390 = TODAS_TELAS[3];

const TODAS_ROTAS = [
  { rota: "/", nome: "home", page: "home" },
  { rota: "/institucional/", nome: "institucional", page: "institucional" },
  { rota: "/servicos/", nome: "servicos", page: "servicos" },
  { rota: "/nossos-clientes/", nome: "clientes", page: "clientes" },
  { rota: "/catalogo-digital/", nome: "catalogo", page: "catalogo" },
  { rota: "/nosso-app/", nome: "app", page: "app" },
  { rota: "/contato/", nome: "contato", page: "contato" },
  { rota: "/creditos/", nome: "creditos", page: "creditos" },
  { rota: "/pagina-que-nao-existe/", nome: "404", page: "404" },
];
const ROTAS = TODAS_ROTAS.filter((r) => !filtroRotas || filtroRotas.includes(r.nome));
const SEM_CTA_OBRIGATORIO = new Set(["creditos", "404"]);

const LEAD_LOCATIONS = new Set([
  "nav", "menu", "hero", "servicos", "plataforma", "historia", "orcamento", "formulario", "rodape", "botao_flutuante", "barra_mobile",
  "pagina_institucional", "pagina_servicos", "pagina_clientes", "pagina_catalogo", "pagina_app", "pagina_contato", "faixa_cta", "avcb", "pagina_404",
]);
const NOME_BANCO = Buffer.from("YnJhZGVzY28=", "base64").toString();
const PROIBIDAS = [NOME_BANCO, "gratuito", "transformando o setor", "elevar o padrão", "jornada", "sinergia", "parceiro de confiança", "no coração de", "o futuro da segurança", "soluções inovadoras de ponta", "excelência incomparável"];
const ARQUIVOS_PROIBIDOS = [/^team-/i, /^testi-/i, /^icon-/i, /^image-[12]\./i, /^logo-[1-4]\./i, /^logo-fire-01/i, /^teste-1/i, /^placeholder/i, /firefighter/i, /with-notepad-/i, /ecofriendly_logo/i, /design_sem_nome_16/i, new RegExp(NOME_BANCO, "i")];

// ------------------------------------------------------------------ servidor
let servidor = null;
let BASE_URL;
let PREFIXO = "";
if (URL_EXTERNA) {
  BASE_URL = URL_EXTERNA.replace(/\/$/, "");
} else {
  if (!existsSync(path.join(DIST, "index.html"))) {
    console.error("dist/ não existe. Rode `npm run build:gh` (ou `npm run build`) antes.");
    process.exit(1);
  }
  const html = readFileSync(path.join(DIST, "index.html"), "utf8");
  const temBaseGh = html.includes("/protecin-site/assets/");
  if (ESTATICO && !temBaseGh) {
    console.error("verify --estatico: o dist/ não foi gerado com VITE_BASE=/protecin-site/. Rode `npm run build:gh`.");
    process.exit(1);
  }
  PREFIXO = temBaseGh ? "/protecin-site" : "";
  const { servir } = await import(pathToFileURL(path.join(RAIZ, "scripts", "servir-estatico.mjs")).href);
  servidor = await servir(PORTA, PREFIXO, DIST);
  BASE_URL = `http://127.0.0.1:${PORTA}${PREFIXO}`;
}
const PREVIA = URL_EXTERNA ? !/protecin\.com\.br/.test(URL_EXTERNA) : PREFIXO !== "";

// ------------------------------------------------------------------ relatório
const relatorio = { inicio: new Date().toISOString(), base: BASE_URL, telas: TELAS.map((t) => t.nome), criterios: {}, medidas: {} };
const NOMES = {
  "AC-01": "números só de conteudo-site-atual.md (e exceções da spec)",
  "AC-02": "nenhuma copy proibida (e nenhum nome do banco em src/public/dist)",
  "AC-03": "Autorizada só com Kidde, Everlux, Notifier e Simplex",
  "AC-04": "toda figure com crédito; nenhum arquivo proibido em public/img",
  "AC-05": "espaços reservados só com ?proposta=1 (e os 4 aparecem)",
  "AC-06": "cobertura de animação ≥ 98%",
  "AC-07": "nada invisível depois de rolar (os dois modos)",
  "AC-08": "cenas fixadas: cada elemento ≥ 0,9 em alguma amostra",
  "AC-09": "entradas: ≥ 5 valores e 200 a 900 ms",
  "AC-10": "sem JS e com animation:none: nada invisível, H1 e CTA na tela",
  "AC-11": "movimento sempre ligado: com reduce emulado o site anima (motion-full, Lenis, cenas, entradas); sem toggle, aviso nem brasas",
  "AC-12": "animação infinita só em fitas/pacotes; nada roda fora da tela",
  "AC-13": "CTA de orçamento visível sem rolar (1440×900 e 390×844)",
  "AC-14": "formato dos links wa.me, tel: e mailto:",
  "AC-15": "clique em CTA empurra lead_click completo",
  "AC-16": "formulário: validação, máscara, Enviando…, sucesso demo sem formsubmit",
  "AC-17": "menu: toque, Enter, foco preso, Esc, toque fora, link, trava rolagem",
  "AC-18": "navegação interna com cortina, head atualizado, voltar, âncora direta",
  "AC-19": "sem GTM e com noindex, nofollow na prévia",
  "AC-20": "title, description, canonical, og:image absoluto, lang e 1 h1",
  "AC-21": "alt em toda img; favicon e 404.html",
  "AC-22": "axe-core: contraste AA e sem violação séria",
  "AC-23": "celular: alvos ≥ 44×44 e nenhum texto longo < 13 px",
  "AC-25": "peso da home: 1ª carga < 700 KB e rolada < 2 MB (sem vídeo)",
  "AC-QA-PIN": "cenas fixadas: ≤ 1,2 tela presa (desktop, ≤ 3 na home); celular só a Abertura, ≤ 0,6",
  "AC-QA-ALTURA": "comprimento das páginas (scrollHeight) dentro do teto de AJUSTES-SOBRIEDADE §2",
  CONSOLE: "zero erro ou aviso de console",
  OVERFLOW: "zero rolagem horizontal",
};
function registrar(ac, ok, detalhe) {
  const c = (relatorio.criterios[ac] ??= { nome: NOMES[ac] ?? ac, ok: true, falhas: [], notas: [] });
  if (!ok) {
    c.ok = false;
    if (detalhe && c.falhas.length < 60) c.falhas.push(detalhe);
  }
}
function nota(ac, texto) {
  const c = (relatorio.criterios[ac] ??= { nome: NOMES[ac] ?? ac, ok: true, falhas: [], notas: [] });
  if (c.notas.length < 40) c.notas.push(texto);
}
for (const ac of Object.keys(NOMES)) registrar(ac, true);
const log = (...m) => console.log(...m);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ navegador
const perfil = path.join(os.tmpdir(), `ptvf${process.pid % 10000}`);
rmSync(perfil, { recursive: true, force: true });
const browser = await puppeteer.launch({
  executablePath: CHROMES.find((c) => existsSync(c)),
  headless: true,
  userDataDir: perfil,
  args: ["--hide-scrollbars", "--force-color-profile=srgb", "--autoplay-policy=no-user-gesture-required", "--disable-features=PaintHolding"],
});
const requisicoesGtm = [];
const RUIDO_CONSOLE = [/React DevTools/i];
const ehAntivirus = (u = "") => /kaspersky-labs\.com|\.scr\.kaspersky/.test(u);

// Teto do comprimento das páginas (AJUSTES-SOBRIEDADE §2): [1440×900, 390×844]. "Demais" = o que tinham na prévia
// publicada antes da rodada (28/10/2026), arredondado para cima.
const TETO_ALTURA = {
  home: [13000, 15000],
  servicos: [9000, 11000],
  institucional: [7500, 9500],
  app: [7500, 9500],
  clientes: [7500, 9500],
  catalogo: [3700, 5300],
  contato: [3900, 5600],
  creditos: [3100, 5300],
  404: [2100, 3200],
};

/**
 * Página nova em contexto limpo (storage zerado). modo: "full" (prefers-reduced-motion: no-preference) ou "reduzido"
 * (prefers-reduced-motion: reduce emulado). Os dois têm de animar igual. js=false desliga o JavaScript.
 */
async function abrir(rota, tela, { modo = "full", js = true, query = "", antes, semIntro = true, esperar = 1300 } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(tela);
  if (tela.isMobile) {
    await page.setUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36");
  }
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: modo === "reduzido" ? "reduce" : "no-preference" }]);
  if (!js) await page.setJavaScriptEnabled(false);
  const consoleMsgs = [];
  const falhas = [];
  page.on("console", (m) => {
    if (!["error", "warn", "warning"].includes(m.type())) return;
    const t = m.text();
    if (RUIDO_CONSOLE.some((r) => r.test(t)) || ehAntivirus(m.location()?.url) || /ERR_NO_BUFFER_SPACE/.test(t)) return;
    // o próprio documento da 404 responde 404 (é o comportamento do GitHub Pages)
    if (rota.includes("nao-existe") && /status of 404/.test(t)) return;
    consoleMsgs.push(`${m.type()}: ${t.slice(0, 300)}`);
  });
  page.on("pageerror", (e) => consoleMsgs.push(`pageerror: ${e.message.slice(0, 300)}`));
  page.on("request", (r) => {
    if (/googletagmanager\.com/.test(r.url())) requisicoesGtm.push(r.url());
  });
  page.on("requestfailed", (r) => {
    const t = r.failure()?.errorText ?? "";
    if (!/ERR_ABORTED|ERR_BLOCKED_BY_CLIENT/.test(t) && !ehAntivirus(r.url())) falhas.push(`${t} ${r.url()}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !(rota.includes("nao-existe") && r.url().includes("nao-existe"))) falhas.push(`${r.status()} ${r.url()}`);
  });
  if (js) {
    await page.evaluateOnNewDocument((semIntro) => {
      try {
        if (semIntro) sessionStorage.setItem("pt-intro", "1");
      } catch {}
    }, semIntro);
  }
  if (antes) await antes(page);
  const url = `${BASE_URL}${rota}${query ? `?${query}` : ""}`;
  await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
  if (esperar) await espera(esperar);
  return { page, ctx, consoleMsgs, falhas, url };
}

async function varrer(page, passoPct = 0.6, pausa = 140) {
  await page.evaluate(
    async (passoPct, pausa) => {
      const passo = Math.round(innerHeight * passoPct);
      for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, pausa));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
    },
    passoPct,
    pausa,
  );
  await espera(900);
}

// Funções de auditoria injetadas na página.
const AUDITORIA = `
window.__pt = {
  opac(el) { let o = 1; for (let a = el; a && a.nodeType === 1; a = a.parentElement) o *= parseFloat(getComputedStyle(a).opacity); return o; },
  oculto(el) {
    for (let a = el; a && a.nodeType === 1; a = a.parentElement) { const c = getComputedStyle(a); if (c.display === "none" || c.visibility === "hidden") return true; }
    return false;
  },
  textoProprio(el) { for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim().length > 0) return true; return false; },
  descr(el) {
    const s = el.closest("[data-section]")?.dataset.section ?? el.closest("section[id]")?.id ?? el.closest("header,footer,nav")?.tagName.toLowerCase() ?? "";
    const t = (el.textContent || el.getAttribute("alt") || el.getAttribute("aria-label") || "").trim().replace(/\\s+/g, " ").slice(0, 50);
    return el.tagName.toLowerCase() + (s ? "@" + s : "") + (t ? ' "' + t + '"' : "");
  },
  alvos(raiz = document.body) {
    return [...raiz.querySelectorAll("*")].filter((el) => {
      if (el.closest(".sr-only, style, script, noscript, title, desc, template, .pt-preloader, [href='#conteudo']")) return false;
      // texto próprio, mídia, svg de topo e botões/links só de ícone (o svg do lucide é aria-hidden)
      const icone = el.matches("a[href], button") && !(el.textContent || "").trim();
      if (!(this.textoProprio(el) || icone || ["IMG", "VIDEO", "CANVAS"].includes(el.tagName) || (el.tagName === "svg" && !el.parentElement.closest("svg")))) return false;
      if (this.oculto(el)) return false;
      const b = el.getBoundingClientRect();
      return b.width >= 1 && b.height >= 1;
    });
  },
};`;

// ================================================================== 1. HTML estático (sem navegador)
log(`\nverify: ${BASE_URL} (${PREVIA ? "prévia" : "produção"})`);
const conteudoAtual = readFileSync(path.join(RAIZ, "referencia", "conteudo-site-atual.md"), "utf8");
const numerosPermitidos = new Set((conteudoAtual.match(/\d+(?:[.,]\d+)*/g) ?? []).map((n) => n));
for (const n of ["50", "1976", "2026", "2021", "100", "10"]) numerosPermitidos.add(n);

async function obter(url) {
  const r = await fetch(url, { redirect: "manual" });
  return { status: r.status, texto: await r.text(), headers: r.headers };
}

log("\n# HTML de cada rota");
for (const r of TODAS_ROTAS) {
  const { status, texto: html } = await obter(`${BASE_URL}${r.rota}`);
  const esperado = r.page === "404" ? 404 : 200;
  registrar("AC-20", status === esperado, `${r.rota}: status ${status} (esperado ${esperado})`);
  const corpo = html.slice(html.indexOf("<body"));
  const titulo = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "";
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1];
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  const og = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
  const h1 = (corpo.match(/<h1[\s>]/g) ?? []).length;
  registrar("AC-20", !!titulo, `${r.rota}: sem <title>`);
  registrar("AC-20", r.page === "404" || !!desc, `${r.rota}: sem meta description`);
  registrar("AC-20", !!canonical && canonical.startsWith("https://protecin.com.br/"), `${r.rota}: canonical ${canonical}`);
  registrar("AC-20", !!og && /^https:\/\//.test(og), `${r.rota}: og:image ${og}`);
  registrar("AC-20", /<html lang="pt-BR"/.test(html), `${r.rota}: sem lang="pt-BR"`);
  registrar("AC-20", h1 === 1, `${r.rota}: ${h1} <h1>`);
  registrar("AC-19", !/googletagmanager/.test(html), `${r.rota}: snippet do GTM no HTML`);
  if (PREVIA) registrar("AC-19", /<meta name="robots" content="noindex, nofollow"/.test(html), `${r.rota}: sem noindex, nofollow na prévia`);
  const textoMin = html.toLowerCase();
  for (const p of PROIBIDAS) registrar("AC-02", !textoMin.includes(p), `${r.rota}: contém "${p}"`);
  relatorio.medidas[`html ${r.rota}`] = { kb: +(html.length / 1024).toFixed(1), titulo, h1 };
}
// títulos e descrições próprios
{
  const vistos = new Map();
  for (const r of TODAS_ROTAS.filter((x) => x.page !== "404")) {
    const t = relatorio.medidas[`html ${r.rota}`].titulo;
    registrar("AC-20", !vistos.has(t), `${r.rota}: título repetido de ${vistos.get(t)}`);
    vistos.set(t, r.rota);
  }
}
{
  const fav = await obter(`${BASE_URL}/favicon.svg`);
  registrar("AC-21", fav.status === 200, `favicon.svg: ${fav.status}`);
  const n404 = await obter(`${BASE_URL}/404.html`);
  registrar("AC-21", n404.status === 200 && n404.texto.includes("<h1"), `404.html: ${n404.status}`);
}
// arquivos: nome do banco em src/public/dist e lista proibida em public/img
if (!URL_EXTERNA) {
  const andar = (dir, f) => {
    for (const n of readdirSync(dir)) {
      const p = path.join(dir, n);
      const s = statSync(p);
      if (s.isDirectory()) andar(p, f);
      else f(p, n);
    }
  };
  const achados = [];
  for (const dir of [path.join(RAIZ, "src"), path.join(RAIZ, "public"), DIST]) {
    andar(dir, (p, n) => {
      if (new RegExp(NOME_BANCO, "i").test(n)) achados.push(p);
      else if (/\.(tsx?|css|html|js|json|txt|xml|svg)$/.test(n) && new RegExp(NOME_BANCO, "i").test(readFileSync(p, "utf8"))) achados.push(p);
    });
  }
  registrar("AC-02", achados.length === 0, `nome do banco em: ${achados.map((p) => path.relative(RAIZ, p)).join(", ")}`);
  for (const n of readdirSync(path.join(RAIZ, "public", "img"))) registrar("AC-04", !ARQUIVOS_PROIBIDOS.some((re) => re.test(n)), `arquivo proibido em public/img: ${n}`);
}

// ================================================================== 2. varredura por tela, rota e modo
log("\n# Varredura (telas × rotas × modos)");
const pesosPagina = {};
for (const tela of TELAS) {
  const celular = tela.width < 768;
  const desktop = tela.width >= 1024;
  for (const r of ROTAS) {
    for (const modo of ["full", "reduzido"]) {
      const inicio = Date.now();
      const { page, ctx, consoleMsgs, falhas } = await abrir(r.rota, tela, { modo });
      await page.evaluate(AUDITORIA);
      const rot = `${tela.nome} ${modo} ${r.rota}`;

      // AC-13: CTA de orçamento inteiro na primeira tela, sem nada por cima
      if ((tela.width === 1440 || tela.width === 390) && !SEM_CTA_OBRIGATORIO.has(r.nome)) {
        const cta = await page.evaluate(() => {
          // o TextRoll duplica o rótulo ("Solicitar orçamentoSolicitar orçamento"): vale conter "orçamento"
          const cands = [...document.querySelectorAll("a, button")].filter((a) => {
            const t = (a.textContent || "").trim();
            return /orçamento/i.test(t) && t.length <= 60;
          });
          for (const a of cands) {
            const b = a.getBoundingClientRect();
            if (b.width < 1 || b.top < 0 || b.left < 0 || b.bottom > innerHeight || b.right > innerWidth) continue;
            if (window.__pt.opac(a) < 0.9) continue;
            const topo = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
            if (topo && (a === topo || a.contains(topo))) return (a.textContent || "").trim();
          }
          return null;
        });
        registrar("AC-13", !!cta, `${rot}: nenhum CTA de orçamento inteiro e livre na 1ª tela`);
      }

      // AC-11: movimento sempre ligado, nos dois modos (com reduce emulado o site anima igual)
      const estado = await page.evaluate(() => ({
        full: document.documentElement.classList.contains("motion-full"),
        reduced: /motion-reduced/.test(document.documentElement.className),
        falhou: document.documentElement.classList.contains("motion-failed"),
        subiu: document.documentElement.classList.contains("motion-up"),
        lenis: document.documentElement.classList.contains("lenis"),
        pins: [...document.querySelectorAll("[data-pin-stage]")].map((s) => s.dataset.pin),
        brasas: document.querySelectorAll('canvas[data-motion="brasas"]').length,
        toggle: document.querySelectorAll('[data-motion="toggle"], [data-motion="toast"]').length + (/Animações:|Ativar movimento|Manter reduzido/.test(document.body.innerText) ? 1 : 0),
      }));
      registrar("AC-11", estado.full && !estado.reduced, `${rot}: html sem motion-full ou com motion-reduced (${estado.full}/${estado.reduced})`);
      registrar("AC-11", estado.subiu && !estado.falhou, `${rot}: motor não subiu ou seguro motion-failed disparou (up ${estado.subiu}, failed ${estado.falhou})`);
      registrar("AC-11", estado.toggle === 0, `${rot}: botão ou aviso de movimento na página`);
      registrar("AC-11", estado.brasas === 0, `${rot}: ${estado.brasas} canvas de brasas`);
      // Lenis: só com mouse (no toque ele não é criado de propósito)
      if (!tela.hasTouch) registrar("AC-11", estado.lenis, `${rot}: Lenis não criado (o movimento é sempre ligado)`);
      if (desktop && tela.height >= 640 && estado.pins.length && r.page === "home") registrar("AC-11", estado.pins.includes("on"), `${rot}: nenhuma cena fixada ligada`);

      // teto das cenas fixadas (AJUSTES-SOBRIEDADE §2): rolagem presa = altura − 100vh
      {
        const cenas = await page.evaluate(() =>
          [...document.querySelectorAll('[data-pin-stage][data-pin="on"]')].map((s) => ({
            id: s.id || s.closest("[data-section]")?.dataset.section || s.querySelector("[data-section]")?.dataset.section || s.getAttribute("aria-label") || "?",
            abertura: false, // marcado abaixo: só a cena #topo da home é a Abertura
            telas: +((s.offsetHeight - innerHeight) / innerHeight).toFixed(2),
          })),
        );
        const ehAbertura = r.page === "home";
        for (const c of cenas) c.abertura = c.abertura || (ehAbertura && c.id === "topo");
        if (desktop) {
          for (const c of cenas) registrar("AC-QA-PIN", c.telas <= 1.2 + 0.02, `${rot}: cena ${c.id} prende ${c.telas} telas (teto 1,2)`);
          if (r.page === "home") registrar("AC-QA-PIN", cenas.length <= 3, `${rot}: ${cenas.length} cenas fixadas na home (teto 3)`);
        } else {
          for (const c of cenas) {
            registrar("AC-QA-PIN", c.abertura, `${rot}: cena ${c.id} fixada no celular/tablet (só a Abertura pode)`);
            if (c.abertura) registrar("AC-QA-PIN", c.telas <= 0.6 + 0.02, `${rot}: Abertura prende ${c.telas} telas (teto 0,6)`);
          }
        }
        for (const c of cenas) relatorio.medidas[`pin ${tela.nome} ${modo} ${r.rota} ${c.id}`] = c.telas;
      }

      // rola a página inteira (dispara entradas e lazy)
      await varrer(page);
      {
        const brasas = await page.evaluate(() => document.querySelectorAll('canvas[data-motion="brasas"]').length);
        registrar("AC-11", brasas === 0, `${rot}: ${brasas} canvas de brasas`);
      }

      // AC-QA-ALTURA: comprimento da página (depois de rolar: lazy e cenas já ligadas)
      if (tela.width === 1440 || tela.width === 390) {
        const altura = await page.evaluate(() => document.documentElement.scrollHeight);
        const teto = TETO_ALTURA[r.page]?.[tela.width === 1440 ? 0 : 1];
        relatorio.medidas[`altura ${tela.nome} ${modo} ${r.rota}`] = altura;
        if (teto) registrar("AC-QA-ALTURA", altura <= teto, `${rot}: scrollHeight ${altura} px (teto ${teto})`);
      }

      // AC-07: nada invisível depois de rolar (fora das cenas fixadas, que o AC-08 cobre)
      const invisiveis = await page.evaluate(() =>
        window.__pt
          .alvos()
          .filter((el) => !el.closest('[aria-hidden="true"], [data-pin-stage][data-pin="on"], [role="dialog"]'))
          .filter((el) => !(el.tagName === "VIDEO" && !el.classList.contains("is-playing")))
          .filter((el) => window.__pt.opac(el) < 0.1)
          .map((el) => window.__pt.descr(el)),
      );
      registrar("AC-07", invisiveis.length === 0, invisiveis.length ? `${rot}: ${invisiveis.length} invisíveis: ${[...new Set(invisiveis)].slice(0, 6).join(" | ")}` : "");

      // AC-06: cobertura (os dois modos animam igual: mede no full)
      if (modo === "full") {
        const cob = await page.evaluate(() => {
          const alvos = window.__pt.alvos();
          const sem = alvos.filter((el) => !el.closest("[data-motion]")).map((el) => window.__pt.descr(el));
          return { total: alvos.length, sem };
        });
        const pct = ((cob.total - cob.sem.length) / Math.max(1, cob.total)) * 100;
        relatorio.medidas[`cobertura ${tela.nome} ${r.rota}`] = +pct.toFixed(1);
        registrar("AC-06", pct >= 98, `${rot}: cobertura ${pct.toFixed(1)}% (${cob.sem.length} sem data-motion: ${[...new Set(cob.sem)].slice(0, 6).join(" | ")})`);
      }

      // rolagem horizontal
      const sobra = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth <= vw + 1) return null;
        const culpado = [...document.querySelectorAll("body *")].find((el) => {
          const b = el.getBoundingClientRect();
          return b.right > vw + 1 && getComputedStyle(el).position !== "fixed";
        });
        return `${document.documentElement.scrollWidth - vw}px (${culpado ? window.__pt.descr(culpado) : "?"})`;
      });
      registrar("OVERFLOW", !sobra, `${rot}: rolagem horizontal ${sobra}`);

      // AC-23: celular (alvos de toque e texto pequeno)
      if (celular && modo === "reduzido") {
        const toque = await page.evaluate(() => {
          const pequenos = [];
          for (const a of document.querySelectorAll("a[href], button, input, select, textarea, [role='button']")) {
            if (window.__pt.oculto(a) || a.closest("[aria-hidden='true'], .sr-only, [href='#conteudo']") || a.type === "hidden" || a.tabIndex < 0) continue;
            const b = a.getBoundingClientRect();
            if (b.width < 1 || b.height < 1) continue;
            // links dentro de texto corrido valem pela linha (WCAG 2.5.8, exceção "inline")
            if (a.tagName === "A" && a.closest("p") && getComputedStyle(a).display === "inline") continue;
            if (b.width < 43.5 || b.height < 43.5) pequenos.push(`${window.__pt.descr(a)} ${Math.round(b.width)}×${Math.round(b.height)}`);
          }
          const textos = [];
          for (const el of document.querySelectorAll("body *")) {
            if (!window.__pt.textoProprio(el) || el.closest(".sr-only, [aria-hidden='true'], style, script, noscript, title, desc")) continue;
            const t = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
            if (t.length <= 20 || window.__pt.oculto(el)) continue;
            const fs = parseFloat(getComputedStyle(el).fontSize);
            if (fs < 13) textos.push(`${fs}px ${window.__pt.descr(el)}`);
          }
          return { pequenos: [...new Set(pequenos)], textos: [...new Set(textos)] };
        });
        registrar("AC-23", toque.pequenos.length === 0, toque.pequenos.length ? `${rot}: alvos < 44px: ${toque.pequenos.slice(0, 8).join(" | ")}` : "");
        registrar("AC-23", toque.textos.length === 0, toque.textos.length ? `${rot}: texto < 13px: ${toque.textos.slice(0, 5).join(" | ")}` : "");
      }

      registrar("CONSOLE", consoleMsgs.length === 0, consoleMsgs.length ? `${rot}: ${[...new Set(consoleMsgs)].slice(0, 4).join(" | ")}` : "");
      registrar("CONSOLE", falhas.length === 0, falhas.length ? `${rot}: requisições com falha: ${[...new Set(falhas)].slice(0, 4).join(" | ")}` : "");
      log(`  ${rot.padEnd(42)} ${((Date.now() - inicio) / 1000).toFixed(1)}s  console ${consoleMsgs.length}  invisíveis ${invisiveis.length}`);
      await ctx.close();
    }
  }
}

// ================================================================== 3. cenas fixadas (AC-08)
log("\n# Cenas fixadas (AC-08)");
for (const tela of [T1440, T390]) {
  for (const r of ROTAS) {
    const { page, ctx } = await abrir(r.rota, tela, { modo: "full" });
    await page.evaluate(AUDITORIA);
    const n = await page.evaluate(() => document.querySelectorAll('[data-pin-stage][data-pin="on"]').length);
    for (let i = 0; i < n; i++) {
      const melhor = new Map();
      let nomeCena = "";
      const amostrar = async (p) => {
        await page.evaluate(
          (i, p) => {
            const s = document.querySelectorAll('[data-pin-stage][data-pin="on"]')[i];
            const topo = s.getBoundingClientRect().top + window.scrollY;
            window.scrollTo(0, Math.round(topo + (s.offsetHeight - innerHeight) * p));
          },
          i,
          p,
        );
        await espera(1200); // 600 ms da spec + o assentamento da mola de rolagem (SPRING.rolagem) depois do salto
        const amostra = await page.evaluate((i) => {
          const s = document.querySelectorAll('[data-pin-stage][data-pin="on"]')[i];
          const out = {};
          window.__pt
            .alvos(s)
            .filter((el) => !el.closest('[aria-hidden="true"]') && !(el.tagName === "VIDEO" && el.hasAttribute("data-lazy-video") && !el.classList.contains("is-playing")))
            .forEach((el, k) => {
              const b = el.getBoundingClientRect();
              const naTela = b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth;
              { const chave = window.__pt.descr(el); out[chave] = Math.max(out[chave] ?? 0, naTela ? window.__pt.opac(el) : 0); }
            });
          return { nome: s.id || s.querySelector("[data-section]")?.dataset.section || s.closest("[data-section]")?.dataset.section || s.getAttribute("aria-label") || `cena ${i}`, out };
        }, i);
        nomeCena = amostra.nome;
        for (const [k, v] of Object.entries(amostra.out)) melhor.set(k, Math.max(melhor.get(k) ?? 0, v));
      };
      // as 5 amostras da spec (p = 0; 0,25; 0,5; 0,75; 1)
      for (const p of [0, 0.25, 0.5, 0.75, 1]) await amostrar(p);
      const fracos5 = [...melhor.entries()].filter(([, v]) => v < 0.9).map(([k]) => k);
      // cenas com mais fases que 5 (o diagrama tem 7 camadas, uma por vez): amostra densa (passo de 0,05) para
      // conferir que cada elemento aparece em algum ponto; a nota registra quem precisou dela
      if (fracos5.length) for (let k = 1; k < 20; k++) if (k % 5) await amostrar(k / 20);
      const fracos = [...melhor.entries()].filter(([, v]) => v < 0.9).map(([k, v]) => `${k.replace(/^\d+ /, "")} (${v.toFixed(2)})`);
      if (fracos5.length) nota("AC-08", `${tela.nome} ${r.rota} ${nomeCena}: ${fracos5.length} elementos só passam de 0,9 fora dos 5 pontos da spec (amostra densa)`);
      registrar("AC-08", fracos.length === 0, fracos.length ? `${tela.nome} ${r.rota} ${nomeCena}: ${fracos.length} elementos nunca ≥ 0,9: ${fracos.slice(0, 6).join(" | ")}` : "");
      log(`  ${tela.nome} ${r.rota} ${nomeCena}: ${melhor.size} elementos, ${fracos5.length} fora dos 5 pontos, ${fracos.length} nunca visíveis`);
    }
    await ctx.close();
  }
}

// ================================================================== 4. entradas quadro a quadro (AC-09)
// No modo "reduzido" (reduce emulado) as entradas da home e de /servicos/ também são medidas: têm de animar igual
// (AC-11, movimento sempre ligado).
log("\n# Entradas (AC-09; reduce emulado conta também no AC-11)");
const CASOS_ENTRADA = [
  ...ROTAS.filter((x) => x.page !== "404").map((r) => ({ r, modo: "full" })),
  ...ROTAS.filter((x) => ["home", "servicos"].includes(x.nome)).map((r) => ({ r, modo: "reduzido" })),
];
for (const { r, modo } of CASOS_ENTRADA) {
  const ac = modo === "full" ? "AC-09" : "AC-11";
  const { page, ctx } = await abrir(r.rota, T1440, { modo });
  const candidatos = await page.evaluate(() => {
    const tipos = ["sobe", "linha", "palavra", "fade", "monta", "virada", "carimbo", "cortina"];
    const vistos = new Set();
    const out = [];
    // de cima para baixo, cada candidato pelo menos 2 telas abaixo do anterior: ao saltar até um, o próximo ainda
    // não entrou na tela (senão ele já teria animado antes da medida)
    let ultimo = innerHeight * 1.5;
    const ordem = [...document.querySelectorAll("[data-motion]")]
      .map((el) => ({ el, top: el.getBoundingClientRect().top + scrollY }))
      .sort((a, b) => a.top - b.top);
    for (const { el, top } of ordem) {
      const t = el.dataset.motion;
      if (!tipos.includes(t) || vistos.has(t) || el.closest('[data-pin-stage][data-pin="on"], [aria-hidden="true"]')) continue;
      // só entradas de topo: as que um grupo (pai com data-motion) dispara medem o grupo, não o elemento
      if (el.parentElement.closest("[data-motion]")) continue;
      const b = el.getBoundingClientRect();
      if (top < ultimo || b.width < 2 || b.height < 2) continue;
      ultimo = top + innerHeight * 2;
      el.setAttribute("data-vf-entrada", String(out.length));
      vistos.add(t);
      out.push(t);
      if (out.length === 3) break;
    }
    return out;
  });
  for (let i = 0; i < candidatos.length; i++) {
    const medida = await page.evaluate(async (i) => {
      const el = document.querySelector(`[data-vf-entrada="${i}"]`);
      // o que anima: o próprio elemento ou o miolo (linha/palavra: o span dentro da máscara)
      // linha/palavra: o que anima é o miolo dentro da máscara (o 1º span com transform próprio); vale para as
      // primitivas e para as cópias locais das seções
      const alvo = el.dataset.motion === "linha" || el.dataset.motion === "palavra" ? el.querySelector('span[style*="transform"]') ?? el : el;
      const prop = () => {
        const c = getComputedStyle(alvo);
        return `${c.opacity}|${c.transform}|${c.clipPath}`;
      };
      const y = el.getBoundingClientRect().top + window.scrollY - innerHeight * 0.55;
      window.scrollTo(0, y);
      const amostras = [];
      const t0 = performance.now();
      while (performance.now() - t0 < 2200) {
        amostras.push([performance.now() - t0, prop()]);
        await new Promise((r) => requestAnimationFrame(r));
      }
      const valores = amostras.map((a) => a[1]);
      const distintos = new Set(valores).size;
      let ini = null;
      let fim = null;
      for (let k = 1; k < amostras.length; k++) {
        if (amostras[k][1] !== amostras[k - 1][1]) {
          ini ??= amostras[k - 1][0];
          fim = amostras[k][0];
        }
      }
      return { distintos, duracao: ini === null ? 0 : Math.round(fim - ini) };
    }, i);
    const ok = medida.distintos >= 5 && medida.duracao >= 180 && medida.duracao <= 1000;
    registrar(ac, ok, `${modo} ${r.rota} ${candidatos[i]}: ${medida.distintos} valores em ${medida.duracao} ms`);
    relatorio.medidas[`entrada ${modo} ${r.rota} ${candidatos[i]}`] = medida;
    log(`  ${modo} ${r.rota} ${candidatos[i]}: ${medida.distintos} valores, ${medida.duracao} ms`);
  }
  if (modo === "reduzido") registrar("AC-11", candidatos.length > 0, `reduzido ${r.rota}: nenhuma entrada animada encontrada`);
  // entrada CSS do hero (2ª visita da sessão, sem preloader)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.goto(`${BASE_URL}${r.rota}`, { waitUntil: "domcontentloaded" });
  const hero = await page.evaluate(async () => {
    const el = document.querySelector("h1 .e-linha-i, h1[data-motion] span span span, .e-sobe, .e-linha-i");
    if (!el) return null;
    const amostras = [];
    const t0 = performance.now();
    while (performance.now() - t0 < 1800) {
      const c = getComputedStyle(el);
      amostras.push([performance.now() - t0, `${c.opacity}|${c.transform}`]);
      await new Promise((r) => requestAnimationFrame(r));
    }
    let ini = null;
    let fim = null;
    for (let k = 1; k < amostras.length; k++) if (amostras[k][1] !== amostras[k - 1][1]) { ini ??= amostras[k - 1][0]; fim = amostras[k][0]; }
    return { distintos: new Set(amostras.map((a) => a[1])).size, duracao: ini === null ? 0 : Math.round(fim - ini) };
  });
  if (hero) {
    relatorio.medidas[`entrada ${modo} ${r.rota} hero-css`] = hero;
    registrar(ac, hero.distintos >= 5 && hero.duracao >= 180 && hero.duracao <= 1000, `${modo} ${r.rota} hero CSS: ${hero.distintos} valores em ${hero.duracao} ms`);
    log(`  ${modo} ${r.rota} hero CSS: ${hero.distintos} valores, ${hero.duracao} ms`);
  }
  await ctx.close();
}

// ================================================================== 5. sem JS e com animation:none (AC-10)
log("\n# Sem JS e animation:none (AC-10)");
async function checarLeitura(page, rot, nome) {
  await page.evaluate(AUDITORIA);
  const r = await page.evaluate(() => {
    const esc = [];
    for (const el of window.__pt.alvos()) {
      if (el.closest('[aria-hidden="true"], [data-motion="fita"], .pt-preloader')) continue;
      const b = el.getBoundingClientRect();
      let cortado = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const c = getComputedStyle(a);
        if (c.overflowY !== "visible" || c.overflow !== "visible") {
          const ra = a.getBoundingClientRect();
          if (b.bottom <= ra.top + 1 || b.top >= ra.bottom - 1) cortado = true;
        }
      }
      if (window.__pt.opac(el) < 0.1 || cortado) esc.push(window.__pt.descr(el) + (cortado ? " (recortado)" : ""));
    }
    const h1 = document.querySelector("h1");
    const bh = h1?.getBoundingClientRect();
    const h1ok = !!bh && bh.bottom > 0 && bh.top < innerHeight && window.__pt.opac(h1) > 0.9;
    const ctas = [...document.querySelectorAll("main a, main button, header a")].filter((a) => /orçamento/i.test(a.textContent || ""));
    const ctaOk = ctas.some((a) => {
      const b = a.getBoundingClientRect();
      return b.width > 0 && b.top >= 0 && b.bottom <= innerHeight && window.__pt.opac(a) > 0.9;
    });
    return { esc: [...new Set(esc)], h1ok, ctaOk };
  });
  registrar("AC-10", r.esc.length === 0, r.esc.length ? `${rot}: ${r.esc.length} escondidos: ${r.esc.slice(0, 6).join(" | ")}` : "");
  registrar("AC-10", r.h1ok, `${rot}: H1 fora da tela ou invisível`);
  if (!SEM_CTA_OBRIGATORIO.has(nome)) registrar("AC-10", r.ctaOk, `${rot}: CTA de orçamento fora da 1ª tela`);
  return r;
}
for (const tela of [T1440, T390]) {
  for (const r of ROTAS) {
    // sem JavaScript: o HTML pré-renderizado sozinho
    {
      const { page, ctx } = await abrir(r.rota, tela, { modo: "full", js: false, esperar: 300 });
      await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important}" });
      const res = await checarLeitura(page, `${tela.nome} sem-JS ${r.rota}`, r.nome);
      log(`  ${tela.nome} sem-JS ${r.rota}: escondidos ${res.esc.length}, h1 ${res.h1ok}, cta ${res.ctaOk}`);
      await ctx.close();
    }
    // animation:none e transition:none desde o primeiro quadro (com preloader: 1ª visita da sessão)
    {
      const css = "*,*::before,*::after{animation:none!important;transition:none!important}";
      const { page, ctx, consoleMsgs } = await abrir(r.rota, tela, {
        modo: "full",
        semIntro: false,
        esperar: 1200,
        antes: (p) =>
          p.evaluateOnNewDocument((css) => {
            const st = document.createElement("style");
            st.textContent = css;
            const por = () => (document.head || document.documentElement).appendChild(st);
            if (document.documentElement) por();
            else
              new MutationObserver((_, o) => {
                if (!document.documentElement) return;
                o.disconnect();
                por();
              }).observe(document, { childList: true });
            document.addEventListener("DOMContentLoaded", () => document.head.appendChild(st));
          }, css),
      });
      // 1ª tela: H1 e CTA à vista; o que está abaixo entra com a rolagem (o framer não usa animação CSS)
      await page.evaluate(AUDITORIA);
      const topo = await page.evaluate(() => {
        const h1 = document.querySelector("h1");
        const bh = h1?.getBoundingClientRect();
        const ctas = [...document.querySelectorAll("main a, main button, header a")].filter((a) => /orçamento/i.test(a.textContent || ""));
        return {
          h1ok: !!bh && bh.bottom > 0 && bh.top < innerHeight && window.__pt.opac(h1) > 0.9,
          ctaOk: ctas.some((a) => {
            const b = a.getBoundingClientRect();
            return b.width > 0 && b.top >= 0 && b.bottom <= innerHeight && window.__pt.opac(a) > 0.9;
          }),
        };
      });
      registrar("AC-10", topo.h1ok, `${tela.nome} anim-none ${r.rota}: H1 fora da tela ou invisível`);
      if (!SEM_CTA_OBRIGATORIO.has(r.nome)) registrar("AC-10", topo.ctaOk, `${tela.nome} anim-none ${r.rota}: CTA de orçamento fora da 1ª tela`);
      await varrer(page, 0.6, 120);
      const inv = await page.evaluate(() =>
        window.__pt
          .alvos()
          .filter((el) => !el.closest('[aria-hidden="true"], [data-pin-stage][data-pin="on"], [role="dialog"]'))
          .filter((el) => !(el.tagName === "VIDEO" && !el.classList.contains("is-playing")))
          .filter((el) => window.__pt.opac(el) < 0.1)
          .map((el) => window.__pt.descr(el)),
      );
      registrar("AC-10", inv.length === 0, inv.length ? `${tela.nome} anim-none ${r.rota}: ${inv.length} invisíveis depois de rolar: ${[...new Set(inv)].slice(0, 6).join(" | ")}` : "");
      const res = { esc: inv, ...topo };
      registrar("CONSOLE", consoleMsgs.length === 0, consoleMsgs.length ? `${tela.nome} anim-none ${r.rota}: ${consoleMsgs.slice(0, 3).join(" | ")}` : "");
      log(`  ${tela.nome} anim-none ${r.rota}: escondidos ${res.esc.length}, h1 ${res.h1ok}, cta ${res.ctaOk}`);
      await ctx.close();
    }
  }
}

// ================================================================== 6. conteúdo no DOM hidratado (AC-01, 03, 04, 05, 14, 21)
log("\n# Conteúdo (AC-01/03/04/05/14/21)");
const reservadosVistos = new Set();
const numerosFora = new Map();
for (const r of ROTAS) {
  for (const proposta of [false, true]) {
    const { page, ctx } = await abrir(r.rota, T1440, { modo: "reduzido", query: proposta ? "proposta=1" : "" });
    await varrer(page, 0.9, 60);
    const d = await page.evaluate(() => {
      const textos = [];
      const it = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = it.nextNode(); n; n = it.nextNode()) {
        if (n.parentElement.closest("script, style, noscript, title, desc, [aria-hidden='true']")) continue;
        const t = n.textContent.replace(/\s+/g, " ").trim();
        if (t) textos.push(t);
      }
      const corpo = textos.join(" · ");
      const autorizadas = [];
      for (const el of document.querySelectorAll("body *")) {
        if (!window.getComputedStyle || ![...el.childNodes].some((n) => n.nodeType === 3 && /\bautorizad[ao]s?\b/i.test(n.textContent))) continue;
        const grupo = el.closest("[data-marca]")?.dataset.marca;
        autorizadas.push({ grupo: grupo ?? null, texto: el.textContent.trim().slice(0, 80) });
      }
      const figuras = [...document.querySelectorAll("figure")].map((f) => ({
        ok: !!f.querySelector("figcaption") || /acervo protecin|imagem ilustrativa/i.test(f.textContent || ""),
        txt: (f.querySelector("img")?.getAttribute("alt") || f.textContent || "").trim().slice(0, 50),
      }));
      const imgsSemAlt = [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).map((i) => i.currentSrc || i.src);
      const reservados = [...document.querySelectorAll("[data-reservado]")].map((e) => e.dataset.reservado);
      const links = [...document.querySelectorAll("a[href]")].map((a) => ({
        href: a.getAttribute("href"),
        canal: a.dataset.leadChannel ?? null,
        local: a.dataset.leadLocation ?? null,
        txt: (a.textContent || a.getAttribute("aria-label") || "").trim().slice(0, 40),
      }));
      return { corpo, autorizadas, figuras, imgsSemAlt, reservados, temTextoReservado: /espaço reservado/i.test(corpo), links };
    });
    if (!proposta) {
      // AC-01: dígitos do texto contra conteudo-site-atual.md e exceções da spec
      const exc = [
        /\b0[1-9]\s*\/\s*0[1-9]\b/g, // "01 / 05"
        /\b[CR]-0[1-9]\b/g, // C-01…C-06, R-01…R-08
        /\b[1-3] de 3\b/g, // "1 de 3"
        /\bTotal 3 \(1 extintor e 2 hidrantes\)/g,
        /\bCO2\b/g,
        /\b(Pexels|Mixkit)[^·]{0,40}?\d{4,}/g, // ids de crédito
        /\bNBR \d{4,5}\b/g,
        /\+55 11 \d{4,5}-\d{4}/g, // telefone e WhatsApp reais
        /\b\d{5}-\d{3}\b/g, // CEP
      ];
      let corpo = d.corpo;
      for (const re of exc) corpo = corpo.replace(re, " ");
      corpo = corpo.replace(/https?:\/\/\S+/g, " ");
      for (const m of corpo.matchAll(/\d+(?:[.,]\d+)*/g)) {
        const tok = m[0];
        if (numerosPermitidos.has(tok) || /^0[1-9]$|^10$/.test(tok)) continue;
        if (r.page === "404" && tok === "404") continue; // o odômetro "404" é da spec (§10.7)
        const ctx2 = corpo.slice(Math.max(0, m.index - 30), m.index + tok.length + 30);
        numerosFora.set(`${tok} — "${ctx2}"`, r.rota);
      }
      // AC-03
      for (const a of d.autorizadas) {
        const ok = a.grupo === "autorizada" || (/kidde|everlux|notifier|simplex/i.test(a.texto) && !/vesda|bosch|firebee|germek|abspk|nfpa/i.test(a.texto));
        registrar("AC-03", ok, `${r.rota}: "${a.texto}" (grupo ${a.grupo})`);
      }
      // AC-04 e AC-21
      for (const f of d.figuras) registrar("AC-04", f.ok, `${r.rota}: figure sem crédito: ${f.txt}`);
      registrar("AC-21", d.imgsSemAlt.length === 0, `${r.rota}: img sem alt: ${d.imgsSemAlt.slice(0, 4).join(", ")}`);
      // AC-05 sem proposta
      registrar("AC-05", d.reservados.length === 0 && !d.temTextoReservado, `${r.rota}: espaço reservado sem ?proposta=1`);
      // AC-14
      for (const l of d.links) {
        if (/^https:\/\/wa\.me\//.test(l.href)) {
          registrar("AC-14", /^https:\/\/wa\.me\/5511945651751\?text=.+/.test(l.href) && !/undefined|%2B55/.test(l.href), `${r.rota}: wa.me fora do padrão: ${l.href.slice(0, 80)}`);
          registrar("AC-14", l.canal === "whatsapp" && LEAD_LOCATIONS.has(l.local), `${r.rota}: wa.me "${l.txt}" com canal ${l.canal} / local ${l.local}`);
        } else if (/^tel:/.test(l.href)) {
          registrar("AC-14", l.href === "tel:+551149778720" && l.canal === "phone" && LEAD_LOCATIONS.has(l.local), `${r.rota}: tel "${l.href}" canal ${l.canal} local ${l.local}`);
        } else if (/^mailto:/.test(l.href)) {
          registrar("AC-14", /^mailto:(comercial|falecom)@protecin\.com\.br(\?|$)/.test(l.href) && l.canal === "email" && LEAD_LOCATIONS.has(l.local), `${r.rota}: mailto "${l.href.slice(0, 60)}" canal ${l.canal} local ${l.local}`);
        } else if (/wa\.me|whatsapp\.com|api\.whatsapp/.test(l.href)) {
          registrar("AC-14", false, `${r.rota}: link de WhatsApp fora do wa.me: ${l.href}`);
        }
      }
    } else {
      d.reservados.forEach((x) => reservadosVistos.add(x));
    }
    await ctx.close();
  }
}
for (const [k, rota] of numerosFora) registrar("AC-01", false, `${rota}: ${k}`);
if (!filtroRotas) for (const id of ["clientes", "obras", "depoimentos", "preco-unico"]) registrar("AC-05", reservadosVistos.has(id), `com ?proposta=1 o reservado "${id}" não apareceu`);
nota("AC-05", `reservados vistos com ?proposta=1: ${[...reservadosVistos].join(", ") || "nenhum"}`);

// ================================================================== 7. animações infinitas e fora da tela (AC-12)
log("\n# Animações infinitas e fora da tela (AC-12)");
for (const r of ROTAS.filter((x) => ["home", "servicos", "app", "catalogo", "institucional", "clientes"].includes(x.nome))) {
  const { page, ctx } = await abrir(r.rota, T1440, { modo: "full" });
  await varrer(page, 0.8, 90);
  const infinitas = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.effect?.getComputedTiming().iterations === Infinity && a.playState === "running")
      .map((a) => {
        const t = a.effect.target;
        return `${a.animationName ?? a.id ?? "wa"}@${t?.closest("[data-motion]")?.dataset.motion ?? t?.tagName}`;
      }),
  );
  const fora = infinitas.filter((x) => !/@(fita|pacote)$/.test(x));
  registrar("AC-12", fora.length === 0, fora.length ? `${r.rota}: animação infinita fora das fitas/pacotes: ${[...new Set(fora)].join(", ")}` : "");
  // fora da tela: fitas, pacotes e brasas param
  const parados = await page.evaluate(async () => {
    const res = [];
    const alvos = [...document.querySelectorAll('[data-motion="fita"] > div, [data-motion="pacote"], canvas[data-motion="brasas"]')];
    for (const el of alvos) {
      const b = el.getBoundingClientRect();
      const topo = b.top + window.scrollY;
      // leva o elemento para bem longe da tela (acima ou abaixo)
      const y = topo > innerHeight * 3 ? topo - innerHeight * 2.5 : topo + b.height + innerHeight * 1.5;
      window.scrollTo(0, Math.max(0, y));
      await new Promise((r) => setTimeout(r, 500));
      const ler = () => (el.tagName === "CANVAS" ? el.toDataURL().length + ":" + el.toDataURL().slice(-64) : getComputedStyle(el).transform + getComputedStyle(el).opacity);
      const a = ler();
      await new Promise((r) => setTimeout(r, 500));
      const bb = el.getBoundingClientRect();
      if (bb.bottom > 0 && bb.top < innerHeight) continue; // não deu para tirar da tela
      res.push({ alvo: el.closest("[data-motion]").dataset.motion, mudou: a !== ler() });
    }
    return res;
  });
  for (const p of parados) registrar("AC-12", !p.mudou, `${r.rota}: ${p.alvo} continua animando fora da tela`);
  log(`  ${r.rota}: ${infinitas.length} infinitas (${[...new Set(infinitas)].join(", ") || "—"}), ${parados.length} conferidos fora da tela`);
  await ctx.close();
}

// ================================================================== 8. leads, formulário, menu e navegação (AC-15 a 18)
log("\n# Interações (AC-15 a AC-18)");
const ehHome = !filtroRotas || filtroRotas.includes("home");
const interceptarExternos = (p) =>
  p.evaluateOnNewDocument(() => {
    window.__externos = [];
    window.addEventListener(
      "click",
      (e) => {
        const a = e.target instanceof Element ? e.target.closest("a") : null;
        if (a && !a.href.startsWith(location.origin)) {
          e.preventDefault();
          window.__externos.push(a.href);
        }
      },
      true,
    );
    window.open = (u) => {
      window.__externos.push(String(u));
      return null;
    };
  });
const dataLayer = (page) => page.evaluate(() => (window.dataLayer || []).filter((e) => e.event && !String(e.event).startsWith("gtm")));

if (ehHome) {
  // AC-15: um CTA de cada canal
  for (const tela of [T1440, T390]) {
    const { page, ctx } = await abrir("/", tela, { modo: "full", antes: interceptarExternos });
    for (const canal of ["whatsapp", "phone", "email"]) {
      const clicou = await page.evaluate((canal) => {
        const a = [...document.querySelectorAll(`a[data-lead-channel="${canal}"]`)].find((x) => {
          const b = x.getBoundingClientRect();
          return b.width > 0 && b.height > 0 && getComputedStyle(x).visibility !== "hidden";
        });
        if (!a) return null;
        a.scrollIntoView({ block: "center" });
        a.click();
        return a.dataset.leadLocation;
      }, canal);
      await espera(150);
      const ev = (await dataLayer(page)).filter((e) => e.event === "lead_click" && e.lead_channel === canal).pop();
      registrar("AC-15", !!clicou && !!ev && ev.lead_location === clicou && ev.lead_page === "home", `${tela.nome} ${canal}: ${clicou ? JSON.stringify(ev ?? "sem lead_click") : "nenhum link visível"}`);
    }
    const ext = await page.evaluate(() => window.__externos.length);
    registrar("AC-15", ext >= 3, `${tela.nome}: cliques externos interceptados ${ext}`);
    await ctx.close();
  }
}

// AC-16: formulário (home e contato)
for (const r of ROTAS.filter((x) => ["home", "contato"].includes(x.nome))) {
  const tela = r.nome === "home" ? T1440 : T390;
  const pedidos = [];
  const { page, ctx } = await abrir(r.rota, tela, {
    modo: "full",
    antes: async (p) => {
      await interceptarExternos(p);
      p.on("request", (q) => pedidos.push(q.url()));
    },
  });
  const rot = `${tela.nome} ${r.rota}`;
  try {
    await page.evaluate(() => document.querySelector("#orcamento form")?.scrollIntoView({ block: "center" }));
    await espera(1800);
    const clicarTexto = (txt) =>
      page.evaluate((t) => {
        const b = [...document.querySelectorAll("#orcamento form button")].find((x) => x.textContent.trim().startsWith(t) && !x.disabled);
        b?.click();
        return !!b;
      }, txt);
    const chips = await page.$$eval("#orcamento form button[aria-pressed]", (bs) => bs.map((b) => b.textContent.trim()));
    registrar("AC-16", chips.length > 2, `${rot}: sem chips de serviço (${chips.length})`);
    await page.evaluate(() => {
      const b = [...document.querySelectorAll("#orcamento form button[aria-pressed]")].find((x) => x.textContent.trim() !== "Ainda não sei");
      b?.click();
    });
    await espera(300);
    await clicarTexto("Continuar");
    await espera(900);
    const cidade = await page.$('#orcamento form input[name="cidade"]');
    if (cidade) {
      await cidade.type("Santo André/SP");
    }
    await clicarTexto("Continuar");
    await espera(900);
    await clicarTexto("Enviar solicitação");
    await espera(600);
    const erros = await page.evaluate(() => (document.querySelector("#orcamento form")?.textContent ?? ""));
    for (const m of ["Informe seu nome.", "Informe um e-mail válido.", "Informe um telefone com DDD."]) registrar("AC-16", erros.includes(m), `${rot}: sem a mensagem "${m}"`);
    await page.type('#orcamento input[name="nome"]', "Teste da verificação");
    await page.type('#orcamento input[name="email"]', "teste@exemplo.com.br");
    await page.type('#orcamento input[name="telefone"]', "11987654321");
    const mascara = await page.$eval('#orcamento input[name="telefone"]', (i) => i.value);
    registrar("AC-16", mascara === "(11) 98765-4321", `${rot}: máscara de telefone deu "${mascara}"`);
    await clicarTexto("Enviar solicitação");
    await espera(250);
    const enviando = await page.evaluate(() => /Enviando…/.test(document.querySelector("#orcamento form")?.textContent ?? ""));
    registrar("AC-16", enviando, `${rot}: sem o estado "Enviando…"`);
    await espera(2200);
    const sucesso = await page.evaluate(() => {
      const s = document.querySelector("#orcamento .msg-sucesso");
      return s ? s.textContent : "";
    });
    registrar("AC-16", /Demonstração/.test(sucesso), `${rot}: sucesso sem a linha "Demonstração" (${sucesso.slice(0, 60)})`);
    registrar("AC-16", !pedidos.some((u) => /formsubmit\.co/.test(u)), `${rot}: requisição a formsubmit.co`);
    const ev = (await dataLayer(page)).map((e) => e.event);
    registrar("AC-16", ev.includes("form_lead") && ev.includes("form_step"), `${rot}: eventos ${[...new Set(ev)].join(", ")}`);
  } catch (e) {
    registrar("AC-16", false, `${rot}: erro no roteiro: ${e.message}`);
  }
  await ctx.close();
}

// AC-17: menu
for (const tela of [T390, T1440]) {
  if (!ehHome) break;
  const { page, ctx } = await abrir("/", tela, { modo: "full" });
  const rot = `${tela.nome} menu`;
  try {
    await page.evaluate(() => window.scrollTo(0, 300));
    await espera(400);
    const y0 = await page.evaluate(() => window.scrollY);
    const botao = await page.$(`button[aria-label="Abrir menu"]`);
    if (tela.hasTouch) await botao.tap();
    else await botao.click();
    await espera(900);
    let estado = await page.evaluate(() => ({
      aberto: !!document.querySelector('[role="dialog"][aria-modal="true"]'),
      foco: !!document.activeElement?.closest('[role="dialog"]'),
      trava: document.documentElement.style.overflow === "hidden" || document.documentElement.classList.contains("lenis-stopped"),
    }));
    registrar("AC-17", estado.aberto, `${rot}: não abriu por ${tela.hasTouch ? "toque" : "clique"}`);
    registrar("AC-17", estado.foco, `${rot}: foco não foi para o menu`);
    registrar("AC-17", estado.trava, `${rot}: rolagem não travou`);
    await page.mouse.wheel({ deltaY: 600 });
    await espera(400);
    registrar("AC-17", (await page.evaluate(() => window.scrollY)) === y0, `${rot}: a página rolou com o menu aberto`);
    // foco preso: 40 Tabs e o foco continua dentro
    let fora = false;
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      if (!(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')))) fora = true;
    }
    registrar("AC-17", !fora, `${rot}: o foco escapou do menu com Tab`);
    await page.keyboard.press("Escape");
    await espera(800);
    estado = await page.evaluate(() => ({
      aberto: !!document.querySelector('[role="dialog"][aria-modal="true"]'),
      foco: document.activeElement?.getAttribute("aria-label"),
      trava: document.documentElement.style.overflow === "hidden",
    }));
    registrar("AC-17", !estado.aberto, `${rot}: Esc não fechou`);
    registrar("AC-17", estado.foco === "Abrir menu", `${rot}: foco não voltou ao botão (${estado.foco})`);
    registrar("AC-17", !estado.trava, `${rot}: rolagem continuou travada`);
    // Enter abre
    await page.focus(`button[aria-label="Abrir menu"]`);
    await page.keyboard.press("Enter");
    await espera(900);
    registrar("AC-17", await page.evaluate(() => !!document.querySelector('[role="dialog"][aria-modal="true"]')), `${rot}: Enter não abriu`);
    // toque/clique na área vazia fecha
    const vazio = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      const b = d.getBoundingClientRect();
      for (const [fx, fy] of [[0.02, 0.5], [0.98, 0.5], [0.5, 0.985], [0.02, 0.98], [0.98, 0.98], [0.5, 0.12]]) {
        const x = b.left + b.width * fx;
        const y = b.top + b.height * fy;
        const el = document.elementFromPoint(x, y);
        if (el && !el.closest("a, button, input, img, picture, h1, h2, h3, p, li")) return [x, y];
      }
      return null;
    });
    if (vazio) {
      if (tela.hasTouch) await page.touchscreen.tap(vazio[0], vazio[1]);
      else await page.mouse.click(vazio[0], vazio[1]);
      await espera(900);
      registrar("AC-17", !(await page.evaluate(() => !!document.querySelector('[role="dialog"][aria-modal="true"]'))), `${rot}: toque na área vazia não fechou`);
    } else registrar("AC-17", false, `${rot}: não achei área vazia no menu`);
    // clique num link fecha e navega
    await page.evaluate(() => document.querySelector('button[aria-label="Abrir menu"]').click());
    await espera(900);
    await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] nav a')].find((a) => /contato/i.test(a.textContent))?.click());
    await espera(1800);
    const depois = await page.evaluate(() => ({ aberto: !!document.querySelector('[role="dialog"][aria-modal="true"]'), path: location.pathname }));
    registrar("AC-17", !depois.aberto && /\/contato\/$/.test(depois.path), `${rot}: link do menu: aberto=${depois.aberto} path=${depois.path}`);
  } catch (e) {
    registrar("AC-17", false, `${rot}: erro no roteiro: ${e.message}`);
  }
  await ctx.close();
}

// AC-18: navegação interna, cortina, head, voltar e âncora direta
if (ehHome) {
  const { page, ctx, consoleMsgs } = await abrir("/", T1440, { modo: "full" });
  try {
    await page.evaluate(() => {
      window.__marca = 1;
      window.__cortina = false;
      new MutationObserver(() => {
        if (document.querySelector('[data-motion="cortina-rota"]')) window.__cortina = true;
      }).observe(document.body, { childList: true, subtree: true });
    });
    await page.evaluate(() => [...document.querySelectorAll("header nav a")].find((a) => /servi/i.test(a.textContent))?.click());
    await espera(2000);
    const s = await page.evaluate(() => ({
      marca: window.__marca,
      cortina: window.__cortina,
      path: location.pathname,
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      h1: document.querySelectorAll("h1").length,
    }));
    registrar("AC-18", s.marca === 1, "a troca de rota recarregou a página");
    registrar("AC-18", s.cortina, "a cortina não apareceu na troca de rota");
    registrar("AC-18", /\/servicos\/$/.test(s.path), `path depois do clique: ${s.path}`);
    registrar("AC-18", /^Serviços/.test(s.title), `title depois da troca: ${s.title}`);
    registrar("AC-18", /^Instalação de sistemas/.test(s.desc ?? ""), `description depois da troca: ${s.desc}`);
    registrar("AC-18", s.canonical === "https://protecin.com.br/servicos/", `canonical depois da troca: ${s.canonical}`);
    registrar("AC-18", s.h1 === 1, `h1 depois da troca: ${s.h1}`);
    const vpv = (await dataLayer(page)).filter((e) => e.event === "virtual_page_view");
    registrar("AC-18", vpv.length >= 1, "sem virtual_page_view");
    await page.goBack();
    await espera(2000);
    const v = await page.evaluate(() => ({ marca: window.__marca, title: document.title, path: location.pathname }));
    registrar("AC-18", v.marca === 1 && /^Protecin: engenharia/.test(v.title), `voltar: ${JSON.stringify(v)}`);
  } catch (e) {
    registrar("AC-18", false, `erro no roteiro: ${e.message}`);
  }
  registrar("CONSOLE", consoleMsgs.length === 0, consoleMsgs.length ? `navegação interna: ${consoleMsgs.slice(0, 3).join(" | ")}` : "");
  await ctx.close();
  // âncora direta: cai no capítulo, logo abaixo da nav
  for (const [tela, modo] of [[T1440, "full"], [T1440, "reduzido"], [T390, "full"]]) {
    const { page: p2, ctx: c2 } = await abrir("/servicos/", tela, { modo, query: "", esperar: 0 });
    await p2.goto(`${BASE_URL}/servicos/#projetos-tecnicos`, { waitUntil: "networkidle2" });
    await espera(2600);
    const topo = await p2.evaluate(() => {
      const el = document.getElementById("projetos-tecnicos");
      return el ? Math.round(el.getBoundingClientRect().top) : null;
    });
    registrar("AC-18", topo !== null && topo >= 40 && topo <= 140, `${tela.nome} ${modo}: #projetos-tecnicos a ${topo}px do topo (esperado logo abaixo da nav)`);
    relatorio.medidas[`ancora ${tela.nome} ${modo}`] = topo;
    log(`  âncora direta ${tela.nome} ${modo}: ${topo}px do topo`);
    await c2.close();
  }
}
registrar("AC-19", requisicoesGtm.length === 0, `requisições ao googletagmanager.com: ${requisicoesGtm.slice(0, 3).join(", ")}`);

// ================================================================== 9. axe-core (AC-22)
log("\n# axe-core (AC-22)");
const axeFonte = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
for (const tela of [T1440, T390]) {
  for (const r of ROTAS) {
    for (const modo of ["reduzido", "full"]) {
      const { page, ctx } = await abrir(r.rota, tela, { modo });
      await varrer(page, 0.6, 120);
      await page.evaluate(axeFonte);
      const res = await page.evaluate(async () => {
        // eslint-disable-next-line no-undef
        const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] }, resultTypes: ["violations"] });
        const DECORATIVOS = new Set(["letreiro", "fita"]);
        const motionDe = (n) => document.querySelector(n.target[0])?.closest("[data-motion]");
        return r.violations
          .map((v) => {
            const nos = v.nodes.filter((n) => {
              if (v.id !== "color-contrast") return true;
              const m = motionDe(n);
              return !(m && DECORATIVOS.has(m.dataset.motion) && document.querySelector(n.target[0]).closest('[aria-hidden="true"]'));
            });
            return {
              id: v.id,
              impacto: v.impact,
              nos: nos.map((n) => `${n.target.join(" ")} [${motionDe(n)?.dataset.motion ?? ""}] ${(n.failureSummary || "").split("\n")[1]?.trim().slice(0, 120) ?? ""}`).slice(0, 4),
              n: nos.length,
              decorativos: v.nodes.length - nos.length,
            };
          })
          .filter((v) => v.n > 0 || v.decorativos > 0);
      });
      for (const v of res) {
        if (v.decorativos) nota("AC-22", `${tela.nome} ${modo} ${r.rota}: ${v.decorativos} nós de ${v.id} em letreiro decorativo aria-hidden (fora da regra)`);
        if (!v.n) continue;
        const grave = v.id === "color-contrast" || v.impacto === "serious" || v.impacto === "critical";
        // ScrollLitText (AppFecho): as palavras começam a 0,18 e acendem com a rolagem; o contraste de quem ainda
        // não acendeu é esperado (o movimento é sempre ligado, nos dois modos)
        const soAcende = v.id === "color-contrast" && v.nos.every((n) => /\[acende\]/.test(n));
        if (grave && !soAcende) registrar("AC-22", false, `${tela.nome} ${modo} ${r.rota}: ${v.id} (${v.impacto}, ${v.n}): ${v.nos.join(" || ")}`);
        else nota("AC-22", `${tela.nome} ${modo} ${r.rota}: ${v.id} (${v.impacto}, ${v.n})${soAcende ? " [ScrollLitText antes de acender]" : ""}`);
      }
      log(`  ${tela.nome} ${modo} ${r.rota}: ${res.length} regras com violação ${res.map((v) => v.id).join(", ")}`);
      await ctx.close();
    }
  }
}
registrar("AC-22", true);

// ================================================================== 10. peso da home (AC-25)
if (ehHome) {
  log("\n# Peso da home (AC-25)");
  for (const [tela, modo] of [[T1440, "full"], [T390, "full"], [T390, "reduzido"]]) {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    await page.setViewport(tela);
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: modo === "reduzido" ? "reduce" : "no-preference" }]);
    const cdp = await page.createCDPSession();
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    // Peso transferido: soma o encodedDataLength de cada resposta, sem vídeo. Duas correções para medir o que o
    // visitante baixa de fato: (1) o antivírus desta máquina (Kaspersky) injeta scripts em toda página: fora da
    // conta; (2) ele também descomprime o HTML para injetar: resposta de texto sem Content-Encoding conta pelo
    // tamanho em gzip do corpo (o GitHub Pages e a Locaweb servem texto comprimido).
    const resp = new Map();
    let primeira = 0;
    let total = 0;
    let video = 0;
    let fase = "carga";
    const pendentes = [];
    cdp.on("Network.responseReceived", (e) => resp.set(e.requestId, { tipo: e.response.mimeType, url: e.response.url, enc: Object.keys(e.response.headers).some((h) => h.toLowerCase() === "content-encoding") }));
    cdp.on("Network.loadingFinished", (e) => {
      const r = resp.get(e.requestId) ?? {};
      if (ehAntivirus(r.url) || /^data:/.test(r.url ?? "")) return;
      const minhaFase = fase;
      const somar = (b) => {
        if (/^video\//.test(r.tipo ?? "")) video += b;
        else {
          total += b;
          if (minhaFase === "carga") primeira += b;
        }
      };
      if (/^(text\/|application\/(javascript|json|xml)|image\/svg)/.test(r.tipo ?? "") && !r.enc) {
        pendentes.push(
          cdp
            .send("Network.getResponseBody", { requestId: e.requestId })
            .then((b) => somar(gzipSync(Buffer.from(b.body, b.base64Encoded ? "base64" : "utf8")).length))
            .catch(() => somar(e.encodedDataLength)),
        );
      } else somar(e.encodedDataLength);
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle0", timeout: 90000 });
    await espera(1500);
    await Promise.all(pendentes);
    fase = "rolagem";
    await varrer(page, 0.5, 160);
    await espera(1500);
    await Promise.all(pendentes);
    const kb = (b) => Math.round(b / 1024);
    relatorio.medidas[`peso home ${tela.nome} ${modo}`] = { primeiraCargaKB: kb(primeira), roladaKB: kb(total), videoKB: kb(video) };
    registrar("AC-25", primeira < 700 * 1024, `${tela.nome} ${modo}: 1ª carga ${kb(primeira)} KB (meta < 700)`);
    registrar("AC-25", total < 2 * 1024 * 1024, `${tela.nome} ${modo}: home rolada ${kb(total)} KB sem vídeo (meta < 2048)`);
    log(`  ${tela.nome} ${modo}: 1ª carga ${kb(primeira)} KB, rolada ${kb(total)} KB, vídeo ${kb(video)} KB`);
    await ctx.close();
  }
}

// ================================================================== fim
await browser.close();
servidor?.close();
rmSync(perfil, { recursive: true, force: true });
for (const c of Object.values(relatorio.criterios)) c.falhas = c.falhas.filter(Boolean);
relatorio.fim = new Date().toISOString();
const falhou = Object.entries(relatorio.criterios).filter(([, c]) => !c.ok);
relatorio.resultado = falhou.length ? "FALHOU" : "PASSOU";
mkdirSync(SAIDA, { recursive: true });
writeFileSync(path.join(SAIDA, "relatorio.json"), JSON.stringify(relatorio, null, 1));
const linhas = [`verify ${relatorio.resultado} — ${BASE_URL} — ${relatorio.fim}`, ""];
for (const [ac, c] of Object.entries(relatorio.criterios).sort()) {
  linhas.push(`${c.ok ? "ok   " : "FALHA"} ${ac} ${c.nome}`);
  for (const f of c.falhas.slice(0, 12)) linhas.push(`        - ${f}`);
}
writeFileSync(path.join(SAIDA, "relatorio.txt"), linhas.join("\n"));
log(`\n${linhas.join("\n")}\n\nrelatório: verificacao/relatorio.json`);
process.exit(falhou.length ? 1 : 0);
