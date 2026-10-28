// Gerado por scripts/videos.mjs. Não editar à mão.
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
  hero: {"arquivo":"hero-supressao-1920.mp4","arquivoMobile":"hero-supressao-608v.mp4","w":1920,"h":1080,"bytes":3083341,"bytesMobile":1622315,"duracao":8,"poster":"hero-poster","posterMobile":"hero-poster-v","fonte":"Pexels 34775769","autor":"Val А.","url":"https://www.pexels.com/video/industrial-red-valve-fire-safety-system-34775769/","licenca":"Licença Pexels"},
} as const satisfies Record<string, VideoInfo>;

export type VideoId = keyof typeof VIDEOS;
