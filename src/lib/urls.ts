import { COMPANY, WA } from "../data/site";
import type { ImagemId } from "../data/imagens.gen";

/** Base do build ("/" em produção, "/protecin-site/" na prévia do GitHub Pages). */
const BASE = (() => {
  const b = import.meta.env.BASE_URL || "/";
  return b.endsWith("/") ? b : `${b}/`;
})();

export const IS_DEMO: boolean = BASE !== "/";

/** Prefixa a base num arquivo de public/. */
export function assetUrl(path: string): string {
  return `${BASE}${path.replace(/^\//, "")}`;
}

/** Prefixa a base numa rota interna ("/servicos/#x" → "/protecin-site/servicos/#x"). */
export function routeUrl(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${BASE}${path.replace(/^\//, "")}`;
}

export function imgUrl(id: ImagemId, w: number, ext: "avif" | "webp"): string {
  return assetUrl(`img/${id}-${w}.${ext}`);
}

export function videoUrl(arquivo: string): string {
  return assetUrl(`videos/${arquivo}`);
}

export function buildWhatsAppUrl(message: string = WA.padrao): string {
  return `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(email: string, subject?: string, body?: string): string {
  const q: string[] = [];
  if (subject) q.push(`subject=${encodeURIComponent(subject)}`);
  if (body) q.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}${q.length ? `?${q.join("&")}` : ""}`;
}
