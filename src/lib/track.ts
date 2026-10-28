import { ROUTES, type LeadChannel, type LeadLocation, type PageId } from "../data/site";

/*
 * Eventos do dataLayer (padrão Extin Seven, design-final §13). Seguro no SSR.
 * O dataLayer existe mesmo sem GTM, então os eventos não quebram na prévia.
 */

export function pushEvent(event: string, params: Record<string, string | number | boolean | undefined> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

let caminhoRoteador: string | null = null;

/** O roteador informa o caminho atual (vale também no sandbox, que usa roteador em memória). */
export function definirCaminhoAtual(path: string): void {
  caminhoRoteador = path;
}

/** PageId da rota atual: o caminho do roteador ou, sem ele, o pathname (sem a base). */
export function currentPageId(): PageId {
  if (caminhoRoteador) return ROUTES.find((r) => r.path === caminhoRoteador)?.page ?? "404";
  if (typeof window === "undefined") return "home";
  const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  let p = window.location.pathname;
  if (p.startsWith(base)) p = `/${p.slice(base.length)}`;
  if (!p.endsWith("/")) p = p.endsWith(".html") ? p : `${p}/`;
  const rota = ROUTES.find((r) => r.path === p);
  return rota ? rota.page : p === "/dev.html" ? "home" : "404";
}

/** lead_click: { lead_channel, lead_location, lead_detail, lead_page, ...extra }. */
export function trackLead(channel: LeadChannel, location: LeadLocation, detail?: string, extra: Record<string, string> = {}): void {
  pushEvent("lead_click", { lead_channel: channel, lead_location: location, lead_detail: detail, lead_page: currentPageId(), ...extra });
}
