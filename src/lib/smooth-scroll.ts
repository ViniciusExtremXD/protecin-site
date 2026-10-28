import Lenis from "lenis";

/*
 * Rolagem suave (Lenis, padrão do Extin Seven). Instância única, lerp 0.11, RAF próprio.
 * Com movimento reduzido o Lenis não é criado e as âncoras saltam sem animação. Em aparelho só de toque também não
 * (a rolagem do dedo é nativa de qualquer forma): as âncoras usam o scroll suave do navegador.
 */
let lenis: Lenis | null = null;

/** Folga da nav fixa = scroll-padding-top do <html> (styles.css). Uma fonte só para os dois caminhos de rolagem. */
function folgaNav(): number {
  const v = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(v) ? v : 0;
}

const reduzido = () => typeof document !== "undefined" && document.documentElement.classList.contains("motion-reduced");
/** Aparelho de toque (sem mouse): o Lenis só suaviza a roda do mouse; no toque ele só gastaria um quadro por frame. */
const soToque = () => typeof window !== "undefined" && !!window.matchMedia?.("(hover: none) and (pointer: coarse)").matches;

export function initSmoothScroll(): () => void {
  if (lenis || reduzido() || soToque()) return () => {};
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95 });
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
  window.scrollTo({ top, behavior: reduzido() ? "auto" : "smooth" });
}

export function scrollToY(y: number, opts: { immediate?: boolean; duration?: number } = {}): void {
  if (lenis) {
    lenis.scrollTo(y, { immediate: opts.immediate, duration: opts.duration ?? 1.2, force: true });
    return;
  }
  window.scrollTo({ top: y, behavior: opts.immediate || reduzido() ? "auto" : "smooth" });
}

/** Rola até o ponto p (0 a 1) de uma cena fixada (seção alta com palco sticky). */
export function scrollToProgress(el: HTMLElement, p: number): void {
  const r = el.getBoundingClientRect();
  const topo = r.top + window.scrollY;
  const percurso = Math.max(0, el.offsetHeight - window.innerHeight);
  scrollToY(topo + percurso * Math.min(1, Math.max(0, p)) + 1, { duration: 1.1 });
}

export function lockScroll(locked: boolean): void {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  if (typeof document !== "undefined") document.documentElement.style.overflow = locked ? "hidden" : "";
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
