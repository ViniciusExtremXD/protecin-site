import Lenis from "lenis";

/*
 * Rolagem suave (Lenis, padrão do Extin Seven). Instância única, lerp 0.11, RAF próprio.
 * O movimento fica sempre ligado (AJUSTES-SOBRIEDADE §1): o Lenis suaviza a roda do mouse mesmo com
 * prefers-reduced-motion: reduce no sistema (respectReducedMotion: false; sem isso o Lenis 1.3 força lerp 1 e torna
 * as rolagens programadas instantâneas). Em aparelho só de toque ele não é criado (a rolagem do dedo é nativa de
 * qualquer forma): as âncoras usam o scroll suave do navegador.
 */
let lenis: Lenis | null = null;

/** Folga da nav fixa = scroll-padding-top do <html> (styles.css). Uma fonte só para os dois caminhos de rolagem. */
function folgaNav(): number {
  const v = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(v) ? v : 0;
}

/** Aparelho de toque (sem mouse): o Lenis só suaviza a roda do mouse; no toque ele só gastaria um quadro por frame. */
const soToque = () => typeof window !== "undefined" && !!window.matchMedia?.("(hover: none) and (pointer: coarse)").matches;

export function initSmoothScroll(): () => void {
  if (lenis || soToque()) return () => {};
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95, respectReducedMotion: false });
  // o preloader ou o menu podem ter travado a página antes do Lenis existir
  if (document.documentElement.style.overflow === "hidden") lenis.stop();
  let frame = 0;
  const raf = (time: number) => {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);
  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
  };
}

function alvoDe(hash: string): HTMLElement | 0 | null {
  if (hash === "#topo" || hash === "#") return 0;
  try {
    return document.querySelector<HTMLElement>(hash);
  } catch {
    return null;
  }
}

export function scrollToHash(hash: string): void {
  const target = alvoDe(hash);
  if (target === null) return;
  if (lenis) {
    // o Lenis 1.3 já desconta o scroll-padding-top (e o scroll-margin) do alvo: sem offset extra
    lenis.scrollTo(target, { duration: 1.4 });
    return;
  }
  const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - folgaNav();
  window.scrollTo({ top, behavior: "smooth" });
}

export function scrollToY(y: number, opts: { immediate?: boolean; duration?: number } = {}): void {
  if (lenis) {
    lenis.scrollTo(y, { immediate: opts.immediate, duration: opts.duration ?? 1.2, force: true });
    return;
  }
  window.scrollTo({ top: y, behavior: opts.immediate ? "auto" : "smooth" });
}

/** Rola até o ponto p (0 a 1) de uma cena fixada (seção alta com palco sticky). */
export function scrollToProgress(el: HTMLElement, p: number): void {
  const r = el.getBoundingClientRect();
  const topo = r.top + window.scrollY;
  const percurso = Math.max(0, el.offsetHeight - window.innerHeight);
  scrollToY(topo + percurso * Math.min(1, Math.max(0, p)) + 1, { duration: 1.1 });
}

let travado = false;
let pendentes: (() => void)[] = [];

export function lockScroll(locked: boolean): void {
  travado = locked;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  if (typeof document !== "undefined") document.documentElement.style.overflow = locked ? "hidden" : "";
  if (!locked && pendentes.length) {
    const fila = pendentes;
    pendentes = [];
    // um quadro depois de soltar: o Lenis já voltou a aceitar scrollTo
    requestAnimationFrame(() => fila.forEach((f) => f()));
  }
}

/**
 * Roda `f` agora, ou assim que a rolagem for destravada (preloader da 1ª visita, menu aberto). Com o Lenis parado,
 * um scrollTo é ignorado: abrir /servicos/#slug direto na 1ª visita não rolava até a âncora.
 */
export function quandoLivre(f: () => void): void {
  if (travado) pendentes.push(f);
  else f();
}

/** Recalcula as dimensões do Lenis (troca de rota, conteúdo novo). */
export function resizeSmoothScroll(): void {
  lenis?.resize();
}

/** Leva todo clique em âncora interna (href="#...") para a rolagem suave. */
export function bindAnchorLinks(): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor) return;
    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;
    event.preventDefault();
    scrollToHash(hash);
    history.replaceState(history.state, "", hash);
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
