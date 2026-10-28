// Pipeline de imagens (design-final §12.1): converte as imagens do site atual e os posters dos vídeos em
// AVIF + WebP responsivos em public/img/, gera src/data/imagens.gen.ts (dimensões, alt e crédito),
// public/favicon.svg, public/apple-touch-icon.png e public/og-protecin.jpg.
// Rode depois de `npm run videos` (os posters saem dos vídeos). É idempotente: pula o que já está atualizado.
// Uso: node scripts/imagens.mjs [--force]
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const raiz = process.cwd();
const ORIGEM = path.join(raiz, "referencia", "imagens-site-atual");
const POSTERS = path.join(raiz, "scratch", "videos-src", "posters");
const SAIDA = path.join(raiz, "public", "img");
const PUBLICO = path.join(raiz, "public");
const GEN = path.join(raiz, "src", "data", "imagens.gen.ts");
const CACHE = path.join(raiz, "scratch", "imagens-cache.json");
const FORCE = process.argv.includes("--force");
const VERSAO = "5";

/*
 * Qualidade (rodada de sobriedade, qa/AJUSTES-SOBRIEDADE.md §4): sem teto de bytes nas fotos (o teto de 60 KB a
 * 1000 px deixava a foto empapada). AVIF q55 (4:4:4, padrão do sharp) e WebP q80 com smartSubsample (bordas
 * vermelhas sem borrão de croma). Logos: WebP q85 com alfa q90.
 */
const Q = { avif: 55, webp: 80, logo: 85, alfa: 90 };
// Larguras: G = foto exibida grande (até 2400, onde a origem permite); M = foto de cartão/capítulo (até 1920).
const G = [640, 960, 1280, 1600, 1920, 2400];
const M = [640, 960, 1280, 1600, 1920];

// Cores da marca (design-final §4.1).
const COR = { navy: "#0E3452", brasa500: "#BE1E29", brasa400: "#E8442E", papel50: "#F3EFE9", noite950: "#050A12" };

/*
 * MAPA: id publicado → origem e opções. Nenhum id leva nome de cliente.
 * A foto dos cilindros é localizada pelo SHA-256 do arquivo, para que o nome original não apareça neste código.
 * crédito: "acervo" (foto real da Protecin), "ilustrativa" (banco de imagens) ou "marca" (logos e capas).
 * nitidez: sigma de um sharpen leve DEPOIS de reduzir (só nas origens que já chegaram moles).
 * maxOrigem: maior largura gerada para origens moles (a foto só é entregue com redução de 2× ou mais).
 */
const OBRA = { modulate: { saturation: 0.92 }, gamma: 1.05, sharpen: true };
const MAPA = [
  // Posters dos vídeos (scripts/videos.mjs)
  // posters: até 1920 / 608 quando o scripts/videos.mjs --force regerar os quadros da fonte de 1080p (hoje 1280 / 540)
  { id: "hero-poster", poster: "hero-poster.jpg", larguras: [828, 1280, 1920], credito: "ilustrativa",
    alt: "Módulos vermelhos de sistema fixo de supressão de incêndio, com válvulas e tubulação" },
  { id: "hero-poster-v", poster: "hero-poster-v.jpg", larguras: [540, 608], credito: "ilustrativa",
    alt: "Módulos vermelhos de sistema fixo de supressão de incêndio, com válvulas e tubulação" },
  // (posters de tablet, extintor e fogo saíram: os vídeos não são mais usados nas seções)

  // Fotos reais do acervo
  { id: "obra-parede-sistemas", arquivo: "4.jpg", larguras: G, credito: "acervo", tratamento: OBRA,
    alt: "Parede com tubulação vermelha, painel de alarme, extintor com etiqueta PROTECIN, abrigo de mangueira e placa de saída" },
  { id: "obra-cilindros-supressao", sha256: "11c395f2eee33820d6dfbb7d55f7eb98509094627b72a9eb03b3ffb0ff3528e9", larguras: G, credito: "acervo",
    tratamento: OBRA,
    alt: "Bateria de cilindros vermelhos numerados de sistema fixo de supressão, com coletor, válvulas e mangueiras" },
  { id: "app-splash", arquivo: "App_1.png", larguras: [360, 540, 720, 1080], credito: "acervo",
    alt: "Tela de abertura do aplicativo Protecin, com o logo branco sobre azul-marinho" },
  { id: "app-webmaster-notebook", arquivo: "App_2.png", larguras: [640, 960, 1280, 1600, 2048], credito: "acervo",
    alt: "Notebook com a tela de login do Web Master da Protecin" },
  { id: "app-login-celular", arquivo: "App_3.png", larguras: [360, 540, 720, 1080], credito: "acervo",
    alt: "Celular com a tela de login do aplicativo Protecin" },
  { id: "kids-ong-colagem", arquivo: "Institucional_4.png", larguras: [640, 860, 1080], credito: "acervo",
    alt: "Colagem de fotos de ações do Kids ONG, com os rostos das crianças borrados" },
  { id: "kids-ong-logo", arquivo: "logo_kids_ong.png", larguras: [240, 479], credito: "marca", alt: "Kids ONG, Trabalho Voluntário" },
  { id: "catalogo-capa", arquivo: "Screenshot-2025-07-30-143726.png", larguras: [360, 554], credito: "marca", alt: "Capa do Catálogo Digital Protecin" },

  // Banco de imagens herdado do site atual
  { id: "co2-cilindros", arquivo: "Home_BG_1-1.jpg", larguras: G, credito: "ilustrativa",
    alt: "Bateria de cilindros vermelhos de CO2 com mangueiras e válvulas" },
  { id: "valvulas-sprinkler", arquivo: "Design_sem_nome.png", larguras: [480, 640, 960, 1280, 1600, 2048], credito: "ilustrativa",
    alt: "Estação de válvulas vermelhas de sprinkler com manômetros e volantes" },
  { id: "servico-instalacao", arquivo: "Instalacao_1.jpg", larguras: M, credito: "ilustrativa",
    alt: "Linha de válvulas de sprinkler vermelhas e amarelas" },
  { id: "servico-instalacao-2", arquivo: "Inspecao_1.jpg", larguras: M, credito: "ilustrativa",
    alt: "Painel de alarme de incêndio aberto, com a placa eletrônica, detectores e acionadores manuais" },
  // origem mole (foto de banco ampliada, 3500 px): sem foto melhor do mesmo assunto no acervo; entregue até 1600 px
  // (redução ≥ 2,2×) com nitidez leve depois de reduzir. Seções: exibir até ~1000 px CSS de largura.
  { id: "servico-projetos", arquivo: "Servicos_2.jpg", larguras: [640, 960, 1280, 1600], credito: "ilustrativa", nitidez: 0.5,
    alt: "Planta técnica sobre a mesa, com óculos, capacete e trena" },
  { id: "servico-documentacao", arquivo: "architect-project-engineer-is-checking-house-building-quality-checklist-inspecting-1-1.jpg",
    larguras: M, credito: "ilustrativa", alt: "Profissional preenchendo um checklist em prancheta" },
  { id: "servico-inspecoes", arquivo: "Inspecao_2.jpg", larguras: M, credito: "ilustrativa",
    alt: "Mão com caneta conferindo o manômetro de um extintor, ao lado de um tablet" },
  { id: "servico-inspecoes-2", arquivo: "Manutencao_2.jpg", larguras: M, credito: "ilustrativa",
    alt: "Técnico de capacete e colete anotando ao lado de um abrigo de hidrante" },
  { id: "servico-gestao", arquivo: "Manutencao_1.jpg", larguras: M, credito: "ilustrativa",
    alt: "Dois técnicos de capacete conferindo extintores com um tablet" },
  { id: "servico-riscos", arquivo: "Riscos_2.jpg", larguras: M, credito: "ilustrativa",
    alt: "Equipe de capacete reunida diante de um quadro, em orientação de segurança" },
  { id: "servico-venda", arquivo: "Venda_2.jpg", larguras: M, credito: "ilustrativa",
    alt: "Mangueiras de incêndio vermelhas enroladas, com conexões" },
  // origem mole (5695 px muito comprimidos): única foto de sinalização de saída do acervo; entregue até 1920 px
  // (redução ≥ 3×) com nitidez leve depois de reduzir.
  { id: "servico-sinalizacao", arquivo: "Riscos_1.jpg", larguras: M, credito: "ilustrativa", nitidez: 0.5,
    alt: "Placa verde de saída de emergência no teto" },
  { id: "setor-financeiro-tecnologia-saude", arquivo: "Inspecao_1.jpg", larguras: G, credito: "ilustrativa",
    crop: { left: 0, top: 436, width: 4183, height: 2353 },
    alt: "Painel de alarme de incêndio aberto, com a placa eletrônica e acionadores manuais" },
  { id: "setor-industrial-agronegocio", arquivo: "Servicos_1.jpg", larguras: G, credito: "ilustrativa",
    alt: "Dois engenheiros de capacete com um tablet em uma planta industrial" },
  { id: "setor-energia-transporte", arquivo: "Home_Image_1-e1754481613736.png", larguras: [640, 960, 1280, 1635], credito: "ilustrativa",
    alt: "Esfera de armazenamento de gás em uma planta industrial" },
  // PNGs de 2048 px que já vieram ampliados: na largura cheia o AVIF dobra de peso (ruído da ampliação) sem ganhar
  // detalhe; vão até 1600 px.
  { id: "institucional-pilar", arquivo: "Institucional_3.png", larguras: [640, 960, 1280, 1600], credito: "ilustrativa",
    alt: "Pilar de concreto com tubulação vermelha, abrigo de hidrante, extintor, acionador manual e sirene" },
  { id: "institucional-maos", arquivo: "Institucional_7.png", larguras: [480, 800, 1200], credito: "ilustrativa", alt: "Mãos segurando uma muda de planta" },
  { id: "institucional-paisagem", arquivo: "Institucional_8.jpg", larguras: G, credito: "ilustrativa",
    alt: "Paisagem verde com uma árvore ao nascer do sol" },
  { id: "institucional-extintor", arquivo: "Institucional_2.png", larguras: [640, 960, 1280, 1600], credito: "ilustrativa",
    alt: "Mão com luva segurando um extintor vermelho" },
  { id: "institucional-compromisso", arquivo: "compromisso.png", larguras: [640, 960, 1280, 1600], credito: "ilustrativa", alt: "Mãos empilhadas de uma equipe" },
  { id: "clientes-aperto", arquivo: "Clientes_1.jpg", larguras: [640, 960, 1280, 1784], credito: "ilustrativa", alt: "Aperto de mão entre dois executivos" },

  // Logos de fabricantes e entidades: aparados, só WebP
  ...[
    ["logo-kidde", "4.png", "Kidde"],
    ["logo-everlux", "3.png", "Everlux"],
    ["logo-everlux-branco", "2.png", "Everlux"],
    ["logo-notifier", "5.png", "Notifier by Honeywell"],
    ["logo-vesda", "6.png", "VESDA by Xtralis"],
    ["logo-simplex", "Simplex.png", "Simplex"],
    ["logo-bosch", "BOSCH.png", "Bosch"],
    ["logo-firebee", "FIREBEE.png", "Firebee"],
    ["logo-germek", "LOGO-GRMK-AZUL-GERMEK.png", "Germek Equipamentos"],
    ["entidade-abspk", "ABSPK.png", "ABSpk, Associação Brasileira de Sprinklers"],
    ["entidade-nfpa", "NFPA.png", "NFPA"],
  ].map(([id, arquivo, alt]) => ({ id, arquivo, larguras: [240, 480], credito: "marca", trim: true, soWebp: true, logo: true, alt })),

  // Wordmark recortado do logo horizontal (§4.5)
  { id: "protecin-wordmark", arquivo: "Ativo-1.png", larguras: [400, 800], credito: "marca", wordmark: "original", logo: true, alt: "Protecin" },
  { id: "protecin-wordmark-negativo", arquivo: "Ativo-1.png", larguras: [400, 800], credito: "marca", wordmark: "negativo", logo: true, alt: "Protecin" },
];

// ---------- utilidades ----------
const kb = (n) => Math.round(n / 1024);
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

let indiceHash = null;
function porHash(sha) {
  if (!indiceHash) {
    indiceHash = new Map();
    for (const f of fs.readdirSync(ORIGEM)) {
      if (!/\.jpe?g$/i.test(f)) continue;
      const h = crypto.createHash("sha256").update(fs.readFileSync(path.join(ORIGEM, f))).digest("hex");
      indiceHash.set(h, path.join(ORIGEM, f));
    }
  }
  const p = indiceHash.get(sha);
  if (!p) throw new Error(`origem com sha256 ${sha.slice(0, 12)}… não encontrada`);
  return p;
}

function origemDe(e) {
  if (e.poster) return path.join(POSTERS, e.poster);
  if (e.sha256) return porHash(e.sha256);
  return path.join(ORIGEM, e.arquivo);
}

/** Recorta o wordmark: o primeiro bloco opaco é o símbolo; o wordmark começa depois de um vão de ≥ 20 colunas transparentes. */
async function recortarWordmark(src, modo) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const colunaVazia = (x) => {
    for (let y = 0; y < H; y++) if (data[(y * W + x) * 4 + 3] > 8) return false;
    return true;
  };
  let x = 0;
  while (x < W && colunaVazia(x)) x++; // margem
  while (x < W && !colunaVazia(x)) x++; // símbolo
  let vao = 0;
  let inicio = -1;
  for (; x < W; x++) {
    if (colunaVazia(x)) vao++;
    else {
      if (vao >= 20) { inicio = x; break; }
      vao = 0;
    }
  }
  if (inicio < 0) throw new Error("wordmark: vão não encontrado");
  let img = sharp(src).extract({ left: inicio, top: 0, width: W - inicio, height: H });
  if (modo === "negativo") {
    const r = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const [cr, cg, cb] = hexRgb(COR.papel50);
    const [vr, vg, vb] = hexRgb(COR.brasa400);
    const px = r.data;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i + 3] === 0) continue;
      const vermelho = px[i] > px[i + 1] + 50 && px[i] > px[i + 2] + 40;
      if (vermelho) { px[i] = vr; px[i + 1] = vg; px[i + 2] = vb; }
      else { px[i] = cr; px[i + 1] = cg; px[i + 2] = cb; }
    }
    img = sharp(px, { raw: r.info });
  }
  // materializa o recorte antes de aparar (no sharp, trim encadeado roda antes do extract)
  return sharp(await img.png().toBuffer()).trim();
}

/** Monta a imagem-mestre (orientação, recorte, aparo, tratamento) e devolve buffer cru + dimensões. */
async function mestre(e) {
  const src = origemDe(e);
  let img;
  if (e.wordmark) img = await recortarWordmark(src, e.wordmark);
  else {
    img = sharp(src).rotate();
    if (e.crop) img = img.extract(e.crop);
    if (e.trim) img = img.trim();
  }
  const t = e.tratamento;
  if (t) {
    if (t.modulate) img = img.modulate(t.modulate);
    if (t.gamma) img = img.gamma(t.gamma);
    if (t.sharpen) img = img.sharpen({ sigma: 0.6 });
  }
  const png = await img.png().toBuffer();
  const base = sharp(png);
  const meta = await base.metadata();
  const stats = await base.stats();
  const alpha = Boolean(meta.hasAlpha) && !stats.isOpaque;
  const raw = await sharp(png)[alpha ? "ensureAlpha" : "removeAlpha"]().raw().toBuffer({ resolveWithObject: true });
  return { raw, w: meta.width, h: meta.height, alpha };
}

/** Reduz (Lanczos3), aplica a nitidez leve da entrada (se houver) e codifica. Sem teto de bytes. */
async function codificar(raw, largura, formato, e) {
  let p = sharp(raw.data, { raw: raw.info }).resize({ width: largura, withoutEnlargement: true });
  if (e.nitidez) p = p.sharpen({ sigma: e.nitidez });
  if (formato === "avif") return p.avif({ quality: Q.avif, effort: 6 }).toBuffer();
  return p.webp({ quality: e.logo ? Q.logo : Q.webp, alphaQuality: Q.alfa, smartSubsample: true, effort: 6 }).toBuffer();
}

function assinatura(e, src) {
  const st = fs.statSync(src);
  return crypto.createHash("sha1").update(JSON.stringify({ VERSAO, e, size: st.size, mtime: st.mtimeMs })).digest("hex");
}

// ---------- favicon, apple-touch-icon e imagem OG ----------
const SIMBOLO_PATHS = (cTl, cTr, cGota) => `
  <path fill="${cTl}" d="M44 0 H9 A9 9 0 0 0 0 9 V44 H13 V13 H44 Z"/>
  <path fill="${cTr}" d="M56 0 H91 A9 9 0 0 1 100 9 V44 H87 V13 H56 Z"/>
  <path fill="${cTl}" d="M0 56 V91 A9 9 0 0 0 9 100 H44 V87 H13 V56 Z"/>
  <path fill="${cTl}" d="M100 56 V91 A9 9 0 0 1 91 100 H56 V87 H87 V56 Z"/>
  <path fill="${cGota}" d="M50 25 H75 V50 A25 25 0 0 1 50 75 A25 25 0 0 1 25 50 A25 25 0 0 1 50 25 Z"/>`;

async function extras(cache) {
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 108 108">${SIMBOLO_PATHS(COR.navy, COR.brasa500, COR.brasa500)}\n</svg>\n`;
  fs.writeFileSync(path.join(PUBLICO, "favicon.svg"), favicon);

  const touch = path.join(PUBLICO, "apple-touch-icon.png");
  if (FORCE || !fs.existsSync(touch)) {
    const simb = await sharp(path.join(ORIGEM, "cropped-SIMBOLO.png")).trim().resize(132, 132, { fit: "contain", background: "#FFFFFF00" }).toBuffer();
    await sharp({ create: { width: 180, height: 180, channels: 4, background: "#FFFFFF" } })
      .composite([{ input: simb, gravity: "center" }])
      .flatten({ background: "#FFFFFF" })
      .png()
      .toFile(touch);
  }

  const og = path.join(PUBLICO, "og-protecin.jpg");
  const posterSrc = path.join(POSTERS, "hero-poster.jpg");
  const sigOg = assinatura({ id: "og" }, posterSrc);
  if (FORCE || !fs.existsSync(og) || cache.og !== sigOg) {
    const fundo = await sharp(posterSrc).resize(1200, 630, { fit: "cover" }).modulate({ brightness: 0.55, saturation: 0.9 }).toBuffer();
    const veu = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs>
        <linearGradient id="h" x1="0" x2="1"><stop offset="0" stop-color="${COR.noite950}" stop-opacity=".92"/><stop offset=".7" stop-color="${COR.noite950}" stop-opacity=".25"/></linearGradient>
        <linearGradient id="v" x1="0" x2="0" y1="0" y2="1"><stop offset=".5" stop-color="${COR.noite950}" stop-opacity="0"/><stop offset="1" stop-color="${COR.noite950}" stop-opacity=".8"/></linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#h)"/><rect width="1200" height="630" fill="url(#v)"/>
      <g transform="translate(80 78) scale(0.84)">${SIMBOLO_PATHS(COR.papel50, COR.brasa400, COR.brasa400)}</g>
      <g font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="76" fill="${COR.papel50}" letter-spacing="-1">
        <text x="80" y="300">PROTEGENDO VIDAS</text>
        <text x="80" y="380">E PATRIMÔNIOS</text>
        <text x="80" y="460">HÁ <tspan fill="${COR.brasa400}">50</tspan> ANOS</text>
      </g>
      <text x="80" y="548" font-family="Consolas, 'Courier New', monospace" font-size="22" letter-spacing="3" fill="#B8BFC9">ENGENHARIA E PROTEÇÃO TÉCNICA CONTRA INCÊNDIO · DESDE 1976</text>
    </svg>`);
    const marca = await recortarWordmark(path.join(ORIGEM, "Ativo-1.png"), "negativo");
    const marcaBuf = await marca.resize({ width: 230 }).png().toBuffer();
    await sharp(fundo)
      .composite([{ input: veu }, { input: marcaBuf, left: 186, top: 93 }])
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(og);
    cache.og = sigOg;
  }
}

// ---------- principal ----------
async function main() {
  fs.mkdirSync(SAIDA, { recursive: true });
  fs.mkdirSync(path.dirname(GEN), { recursive: true });
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : {};
  const gerados = new Set();
  const registro = {};
  const relatorio = [];

  for (const e of MAPA) {
    const src = origemDe(e);
    if (!fs.existsSync(src)) throw new Error(`${e.id}: origem não encontrada`);
    const sig = assinatura(e, src);
    const anterior = cache.entradas?.[e.id];
    const formatos = e.soWebp ? ["webp"] : ["avif", "webp"];

    if (!FORCE && anterior && anterior.sig === sig && anterior.arquivos.every((f) => fs.existsSync(path.join(SAIDA, f)))) {
      anterior.arquivos.forEach((f) => gerados.add(f));
      registro[e.id] = anterior.info;
      relatorio.push(`${e.id.padEnd(36)} (atualizado) ${anterior.resumo}`);
      continue;
    }

    const m = await mestre(e);
    const larguras = e.larguras.filter((l) => l <= m.w);
    if (larguras.length === 0 || larguras[larguras.length - 1] < Math.min(m.w, Math.max(...e.larguras))) {
      // a maior largura pedida passa a do original: usa a largura do original no lugar
      const maxOk = Math.min(m.w, Math.max(...e.larguras));
      if (!larguras.includes(maxOk)) larguras.push(maxOk);
    }
    const arquivos = [];
    const pesos = [];
    for (const l of larguras) {
      for (const f of formatos) {
        const buf = await codificar(m.raw, l, f, e);
        const nome = `${e.id}-${l}.${f}`;
        fs.writeFileSync(path.join(SAIDA, nome), buf);
        arquivos.push(nome);
        gerados.add(nome);
        pesos.push(`${l}.${f}=${kb(buf.length)}KB`);
      }
    }
    const info = { w: m.w, h: m.h, larguras, alpha: m.alpha, avif: !e.soWebp, credito: e.credito, alt: e.alt };
    registro[e.id] = info;
    const resumo = pesos.join(" ");
    (cache.entradas ??= {})[e.id] = { sig, arquivos, info, resumo };
    relatorio.push(`${e.id.padEnd(36)} ${m.w}x${m.h}${m.alpha ? " alfa" : ""} ${resumo}`);
  }

  // remove saídas antigas que não pertencem mais ao MAPA
  for (const f of fs.readdirSync(SAIDA)) if (!gerados.has(f)) fs.rmSync(path.join(SAIDA, f));

  await extras(cache);
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1));

  const linhas = MAPA.map((e) => `  ${JSON.stringify(e.id)}: ${JSON.stringify(registro[e.id])},`);
  const ts = `// Gerado por scripts/imagens.mjs. Não editar à mão.
export type CreditoImagem = "acervo" | "ilustrativa" | "marca";

export interface ImagemInfo {
  /** largura e altura da imagem-mestre (proporção usada em width/height) */
  w: number;
  h: number;
  /** larguras geradas em public/img/<id>-<largura>.<ext> */
  larguras: readonly number[];
  alpha: boolean;
  /** false = só WebP (logos) */
  avif: boolean;
  credito: CreditoImagem;
  alt: string;
}

export const IMAGENS = {
${linhas.join("\n")}
} as const satisfies Record<string, ImagemInfo>;

export type ImagemId = keyof typeof IMAGENS;
`;
  fs.writeFileSync(GEN, ts);
  console.log(relatorio.join("\n"));
  console.log(`\n${MAPA.length} imagens · imagens.gen.ts, favicon.svg, apple-touch-icon.png e og-protecin.jpg gravados.`);
}

await main();
