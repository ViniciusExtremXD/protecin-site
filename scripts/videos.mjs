// Pipeline de vídeos (design-final §12.2): baixa as fontes de banco livre (Pexels/Mixkit), remuxa com +faststart,
// extrai 1 quadro por segundo para revisão, recorta e comprime dentro do teto de peso, gera os posters (JPG, que o
// scripts/imagens.mjs converte) e grava src/data/videos.gen.ts.
// Uso: node scripts/videos.mjs [--force]   (HERO_FONTE=reserva1|reserva2 troca a fonte do hero, se a principal tiver marca)
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
  reserva1: {
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
  tablet: {
    url: "https://videos.pexels.com/video-files/7100844/7100844-hd_1280_720_30fps.mp4",
    arquivo: "pexels-7100844-720.mp4",
    fonte: "Pexels 7100844",
    autor: "Gustavo Fring",
    pagina: "https://www.pexels.com/video/a-fireman-using-digital-tablet-7100844/",
    licenca: "Licença Pexels",
  },
  extintor: {
    url: "https://videos.pexels.com/video-files/8965440/8965440-hd_1280_720_50fps.mp4",
    arquivo: "pexels-8965440-720.mp4",
    fonte: "Pexels 8965440",
    autor: "Mikael Blomkvist",
    pagina: "https://www.pexels.com/video/a-man-carrying-a-fire-extinguisher-entering-a-room-with-thick-smoke-8965440/",
    licenca: "Licença Pexels",
  },
  fogo: {
    url: "https://assets.mixkit.co/videos/52312/52312-720.mp4",
    arquivo: "mixkit-52312-720.mp4",
    fonte: "Mixkit 52312",
    autor: "Mixkit",
    pagina: "https://mixkit.co/free-stock-video/mesmerizing-close-up-of-flames-over-a-black-background-52312/",
    licenca: "Mixkit Stock Video Free License",
  },
};

const HERO = process.env.HERO_FONTE ?? "principal";
if (!FONTES[HERO]) throw new Error(`HERO_FONTE inválida: ${HERO}`);

// Saídas: filtros, CRF inicial e teto (MB) de §12.2.
const SAIDAS = [
  { id: "hero", fonte: HERO, arquivo: "hero-supressao-1280.mp4", vf: "scale=1280:-2,fps=30", crf: 27, teto: 3.0, t: FONTES[HERO].duracaoMax },
  {
    id: "hero",
    mobile: true,
    fonte: HERO,
    arquivo: "hero-supressao-540v.mp4",
    // recorte vertical central: 9:16 da altura da fonte
    vf: "crop=round(ih*9/32)*2:ih:(iw-round(ih*9/32)*2)/2:0,scale=540:960,fps=30",
    crf: 28,
    teto: 1.5,
    t: FONTES[HERO].duracaoMax,
  },
  { id: "tablet", fonte: "tablet", arquivo: "app-tablet-720.mp4", vf: "scale=1280:-2", crf: 28, teto: 2.5, t: 12 },
  { id: "extintor", fonte: "extintor", arquivo: "extintor-fumaca-720.mp4", vf: "scale=1280:-2,fps=25", crf: 27, teto: 1.9 },
  { id: "fogo", fonte: "fogo", arquivo: "fogo-final-720.mp4", vf: "scale=1280:-2", crf: 28, teto: 3.0, t: 8 },
];

// Posters (quadro de 0,5 s). O hero-poster sai da fonte em resolução cheia.
const POSTER_DE = {
  hero: { id: "hero-poster", vf: null },
  heroV: { id: "hero-poster-v", vf: "crop=round(ih*9/32)*2:ih:(iw-round(ih*9/32)*2)/2:0,scale=540:960" },
  tablet: { id: "poster-tablet", vf: null },
  extintor: { id: "poster-extintor", vf: null },
  fogo: { id: "poster-fogo", vf: null },
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

  const chaves = [HERO, "tablet", "extintor", "fogo"];
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
  await poster(origens.tablet, POSTER_DE.tablet);
  await poster(origens.extintor, POSTER_DE.extintor);
  await poster(origens.fogo, POSTER_DE.fogo);

  const dims = { hero: [1280, 720], tablet: [1280, 720], extintor: [1280, 720], fogo: [1280, 720] };
  const posterDe = { hero: "hero-poster", tablet: "poster-tablet", extintor: "poster-extintor", fogo: "poster-fogo" };
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
