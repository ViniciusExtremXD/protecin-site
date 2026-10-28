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
  hero: {"arquivo":"hero-supressao-1280.mp4","arquivoMobile":"hero-supressao-540v.mp4","w":1280,"h":720,"bytes":2707079,"bytesMobile":1476420,"duracao":8,"poster":"hero-poster","posterMobile":"hero-poster-v","fonte":"Pexels 34775769","autor":"Val А.","url":"https://www.pexels.com/video/industrial-red-valve-fire-safety-system-34775769/","licenca":"Licença Pexels"},
  tablet: {"arquivo":"app-tablet-720.mp4","arquivoMobile":null,"w":1280,"h":720,"bytes":412625,"bytesMobile":null,"duracao":12,"poster":"poster-tablet","posterMobile":null,"fonte":"Pexels 7100844","autor":"Gustavo Fring","url":"https://www.pexels.com/video/a-fireman-using-digital-tablet-7100844/","licenca":"Licença Pexels"},
  extintor: {"arquivo":"extintor-fumaca-720.mp4","arquivoMobile":null,"w":1280,"h":720,"bytes":580244,"bytesMobile":null,"duracao":6.4,"poster":"poster-extintor","posterMobile":null,"fonte":"Pexels 8965440","autor":"Mikael Blomkvist","url":"https://www.pexels.com/video/a-man-carrying-a-fire-extinguisher-entering-a-room-with-thick-smoke-8965440/","licenca":"Licença Pexels"},
  fogo: {"arquivo":"fogo-final-720.mp4","arquivoMobile":null,"w":1280,"h":720,"bytes":1200301,"bytesMobile":null,"duracao":8,"poster":"poster-fogo","posterMobile":null,"fonte":"Mixkit 52312","autor":"Mixkit","url":"https://mixkit.co/free-stock-video/mesmerizing-close-up-of-flames-over-a-black-background-52312/","licenca":"Mixkit Stock Video Free License"},
} as const satisfies Record<string, VideoInfo>;

export type VideoId = keyof typeof VIDEOS;
