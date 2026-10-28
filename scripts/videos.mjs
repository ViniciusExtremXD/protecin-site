// Pipeline de vídeos (design-final §12.2): baixa as fontes de banco livre (Pexels/Mixkit), remuxa com +faststart,
// extrai 1 quadro por segundo para revisão, recorta e comprime dentro do teto de peso, gera os posters (JPG, que o
// scripts/imagens.mjs converte) e grava src/data/videos.gen.ts.
// Uso: node scripts/videos.mjs [--force]   (HERO_FONTE=principal|reserva1|reserva2 troca a fonte do hero; padrão reserva1)
// Rodada 2: só o vídeo do hero continua no site (tablet, extintor e fogo saíram das seções). HERO_1080=1 troca a
// fonte do hero pela versão de 1920×1080 do mesmo vídeo (Pexels 34775769, 17,5 MB para baixar): vídeo de 1920 e
// vertical de 608×1080, posters em 1920 (desktop) e 608×1080 (vertical); rode com --force e depois npm run imagens.
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);
const raiz = process.cwd();
const SRC = path.join(raiz, "scratch", "videos-src");
const QUADROS = path.join(SRC, "quadros");
const POSTERS = path.join(SRC, "posters");
const SAIDA = path.join(raiz, "public", "videos");
const GEN = path.join(raiz, "src", "data", "videos.gen.ts");
const FORCE = process.argv.includes("--force");
const MB = 1024 * 1024;

// Fontes (MP4 direto, referencia/videos.md). Todas de licença livre, crédito "Imagem ilustrativa".
const FONTES = {
  principal: {
    url: "https://videos.pexels.com/video-files/34775810/14743116_1920_1080_30fps.mp4",
    arquivo: "pexels-34775810-1080.mp4",
    fonte: "Pexels 34775810",
    autor: "Val А.",
    pagina: "https://www.pexels.com/video/industrial-fire-suppression-system-setup-34775810/",
    licenca: "Licença Pexels",
  },
  // fonte do hero (1280×720). Com HERO_1080=1 vale a versão de 1920×1080 do mesmo vídeo (o "download" da Pexels
  // redireciona para ela): vídeo de 1920, vertical de 608×1080 e posters nessas resoluções.
  reserva1: process.env.HERO_1080 ? {
    url: "https://videos.pexels.com/video-files/34775769/14743052_1920_1080_30fps.mp4",
    arquivo: "pexels-34775769-1080.mp4",
    fonte: "Pexels 34775769",
    autor: "Val А.",
    pagina: "https://www.pexels.com/video/industrial-red-valve-fire-safety-system-34775769/",
    licenca: "Licença Pexels",
    duracaoMax: 8,
  } : {
    url: "https://videos.pexels.com/video-files/34775769/14743051_1280_720_30fps.mp4",
    arquivo: "pexels-34775769-720.mp4",
    fonte: "Pexels 34775769",
    autor: "Val А.",
    pagina: "https://www.pexels.com/video/industrial-red-valve-fire-safety-system-34775769/",
    licenca: "Licença Pexels",
    duracaoMax: 8,
  },
  reserva2: {
    url: "https://videos.pexels.com/video-files/34775772/14743044_1920_1080_30fps.mp4",
    arquivo: "pexels-34775772-1080.mp4",
    fonte: "Pexels 34775772",
    autor: "Val А.",
    pagina: "https://www.pexels.com/video/34775772/",
    licenca: "Licença Pexels",
  },
};

// o hero publicado usa a reserva1 (Pexels 34775769, o mesmo crédito de videos.gen.ts)
const HERO = process.env.HERO_FONTE ?? "reserva1";
if (!FONTES[HERO]) throw new Error(`HERO_FONTE inválida: ${HERO}`);

// Saídas: filtros, CRF inicial e teto (MB) de §12.2. Com HERO_1080=1 (fonte 1920×1080) o vídeo do desktop sai em
// 1920 e o vertical no recorte 9:16 cheio da altura (608×1080), com o mesmo teto de peso (o CRF sobe até caber).
const H1080 = !!process.env.HERO_1080;
const SAIDAS = [
  H1080
    ? // em 1920 o CRF que cabe no teto (32) borra demais: duas passadas na taxa que enche o teto (≈ 3.050 kbps)
      { id: "hero", fonte: HERO, arquivo: "hero-supressao-1920.mp4", vf: "scale=1920:-2,fps=30", duasPassadas: true, teto: 3.0, t: FONTES[HERO].duracaoMax, dims: [1920, 1080] }
    : { id: "hero", fonte: HERO, arquivo: "hero-supressao-1280.mp4", vf: "scale=1280:-2,fps=30", crf: 27, teto: 3.0, t: FONTES[HERO].duracaoMax, dims: [1280, 720] },
  {
    id: "hero",
    mobile: true,
    fonte: HERO,
    arquivo: H1080 ? "hero-supressao-608v.mp4" : "hero-supressao-540v.mp4",
    // recorte vertical central: 9:16 da altura da fonte (no 1080p sem reescala: 608×1080)
    vf: H1080 ? "crop=round(ih*9/32)*2:ih:(iw-round(ih*9/32)*2)/2:0,fps=30" : "crop=round(ih*9/32)*2:ih:(iw-round(ih*9/32)*2)/2:0,scale=540:960,fps=30",
    crf: H1080 ? 29 : 28,
    teto: H1080 ? 1.6 : 1.5,
    t: FONTES[HERO].duracaoMax,
  },
];

// Posters (quadro de 0,5 s). O hero-poster sai da fonte em resolução cheia (1920×1080) e o vertical no recorte 9:16
// cheio da altura (608×1080); o scripts/imagens.mjs gera as larguras (até 1920 e 608).
const POSTER_DE = {
  hero: { id: "hero-poster", vf: null },
  heroV: { id: "hero-poster-v", vf: "crop=round(ih*9/32)*2:ih:(iw-round(ih*9/32)*2)/2:0" },
};

const ff = (args) => run(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], { maxBuffer: 64 * MB });

async function baixar(chave) {
  const f = FONTES[chave];
  const destino = path.join(SRC, f.arquivo);
  if (fs.existsSync(destino) && fs.statSync(destino).size > 0) return destino;
  const bruto = destino.replace(/\.mp4$/, ".orig.mp4");
  console.log(`baixando ${f.fonte}…`);
  const resp = await fetch(f.url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) protecin-build" } });
  if (!resp.ok) throw new Error(`${f.url} respondeu ${resp.status}`);
  fs.writeFileSync(bruto, Buffer.from(await resp.arrayBuffer()));
  // remux com +faststart (as fontes da Pexels são MP4 fragmentado)
  await ff(["-i", bruto, "-c", "copy", "-movflags", "+faststart", destino]);
  fs.rmSync(bruto);
  return destino;
}

async function duracao(arquivo) {
  // ffmpeg -i sem saída escreve a duração no stderr e sai com erro: é o esperado.
  try {
    await run(ffmpegPath, ["-hide_banner", "-i", arquivo]);
  } catch (e) {
    const m = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(String(e.stderr));
    if (m) return Math.round((+m[1] * 3600 + +m[2] * 60 + +m[3]) * 10) / 10;
  }
  return 0;
}

async function quadros(chave, origem) {
  const dir = path.join(QUADROS, chave);
  if (fs.existsSync(dir) && fs.readdirSync(dir).length > 0 && !FORCE) return;
  fs.mkdirSync(dir, { recursive: true });
  await ff(["-i", origem, "-vf", "fps=1,scale=960:-2", "-q:v", "4", path.join(dir, "q%02d.jpg")]);
}

async function codificar(s, origem) {
  const destino = path.join(SAIDA, s.arquivo);
  if (fs.existsSync(destino) && !FORCE) return destino;
  if (s.duasPassadas) {
    // taxa média que enche 97% do teto na duração do trecho
    const kbps = Math.floor((s.teto * 0.97 * MB * 8) / s.t / 1000);
    const log = path.join(SRC, `passadas-${s.arquivo}`);
    const base = ["-i", origem, "-t", String(s.t), "-an", "-vf", s.vf, "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-b:v", `${kbps}k`, "-passlogfile", log];
    await ff([...base, "-pass", "1", "-f", "mp4", process.platform === "win32" ? "NUL" : "/dev/null"]);
    await ff([...base, "-pass", "2", "-pix_fmt", "yuv420p", "-movflags", "+faststart", destino]);
    for (const f of fs.readdirSync(SRC)) if (f.startsWith(path.basename(log))) fs.rmSync(path.join(SRC, f));
    console.log(`  ${s.arquivo}: 2 passadas a ${kbps} kbps → ${(fs.statSync(destino).size / MB).toFixed(2)} MB (teto ${s.teto} MB)`);
    return destino;
  }
  for (let crf = s.crf; crf <= 32; crf += 2) {
    const args = ["-i", origem];
    if (s.t) args.push("-t", String(s.t));
    args.push(
      "-an", "-vf", s.vf, "-c:v", "libx264", "-profile:v", "high", "-preset", "slow",
      "-crf", String(crf), "-pix_fmt", "yuv420p", "-movflags", "+faststart", destino,
    );
    await ff(args);
    const mb = fs.statSync(destino).size / MB;
    console.log(`  ${s.arquivo}: CRF ${crf} → ${mb.toFixed(2)} MB (teto ${s.teto} MB)`);
    if (mb <= s.teto) return destino;
  }
  console.warn(`  atenção: ${s.arquivo} ficou acima do teto mesmo com CRF 32`);
  return destino;
}

async function poster(origem, { id, vf }) {
  const destino = path.join(POSTERS, `${id}.jpg`);
  if (fs.existsSync(destino) && !FORCE) return;
  const args = ["-ss", "0.5", "-i", origem, "-frames:v", "1", "-q:v", "2"];
  if (vf) args.push("-vf", vf);
  args.push(destino);
  await ff(args);
}

async function main() {
  if (!ffmpegPath) throw new Error("ffmpeg-static não encontrado");
  for (const d of [SRC, QUADROS, POSTERS, SAIDA, path.dirname(GEN)]) fs.mkdirSync(d, { recursive: true });

  const chaves = [HERO];
  const origens = {};
  for (const c of chaves) {
    origens[c] = await baixar(c);
    await quadros(c === HERO ? "hero" : c, origens[c]);
  }

  const resultado = {};
  for (const s of SAIDAS) {
    const destino = await codificar(s, origens[s.fonte]);
    const bytes = fs.statSync(destino).size;
    const info = resultado[s.id] ?? (resultado[s.id] = {});
    if (s.mobile) {
      info.arquivoMobile = s.arquivo;
      info.bytesMobile = bytes;
    } else {
      info.arquivo = s.arquivo;
      info.bytes = bytes;
      info.duracao = await duracao(destino);
      const f = FONTES[s.fonte];
      Object.assign(info, { fonte: f.fonte, autor: f.autor, url: f.pagina, licenca: f.licenca });
    }
  }

  await poster(origens[HERO], POSTER_DE.hero);
  await poster(origens[HERO], POSTER_DE.heroV);

  // tira de public/videos/ o que não é mais gerado (ex.: tablet, extintor e fogo, fora do site na rodada 2)
  const produzidos = new Set(SAIDAS.map((s) => s.arquivo));
  for (const f of fs.readdirSync(SAIDA)) if (/\.mp4$/.test(f) && !produzidos.has(f)) fs.rmSync(path.join(SAIDA, f));

  const dims = { hero: SAIDAS.find((s) => s.id === "hero" && !s.mobile).dims };
  const posterDe = { hero: "hero-poster" };
  const linhas = Object.entries(resultado).map(([id, v]) => {
    const campos = {
      arquivo: v.arquivo,
      arquivoMobile: v.arquivoMobile ?? null,
      w: dims[id][0],
      h: dims[id][1],
      bytes: v.bytes,
      bytesMobile: v.bytesMobile ?? null,
      duracao: v.duracao,
      poster: posterDe[id],
      posterMobile: id === "hero" ? "hero-poster-v" : null,
      fonte: v.fonte,
      autor: v.autor,
      url: v.url,
      licenca: v.licenca,
    };
    return `  ${id}: ${JSON.stringify(campos)},`;
  });

  const ts = `// Gerado por scripts/videos.mjs. Não editar à mão.
import type { ImagemId } from "./imagens.gen";

export interface VideoInfo {
  arquivo: string;
  arquivoMobile: string | null;
  w: number;
  h: number;
  bytes: number;
  bytesMobile: number | null;
  duracao: number;
  poster: ImagemId;
  posterMobile: ImagemId | null;
  fonte: string;
  autor: string;
  url: string;
  licenca: string;
}

export const VIDEOS = {
${linhas.join("\n")}
} as const satisfies Record<string, VideoInfo>;

export type VideoId = keyof typeof VIDEOS;
`;
  fs.writeFileSync(GEN, ts);
  console.log(`videos.gen.ts gravado (${Object.keys(resultado).length} vídeos). Fonte do hero: ${FONTES[HERO].fonte}.`);
}

await main();
