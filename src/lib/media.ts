import { useEffect, useState, type RefObject } from "react";

/** false no SSR e no 1º render (casa com o HTML pré-renderizado); atualiza depois de montar. */
export function useMediaQuery(q: string, ssr = false): boolean {
  const [ok, setOk] = useState(ssr);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setOk(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return ok;
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

interface NetworkInfo {
  saveData?: boolean;
  effectiveType?: string;
}

/** Vídeo só com movimento completo e conexão que aguenta (sem saveData, sem 2g/3g). */
export function useCanPlayVideo(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const lenta = !!conn && (conn.saveData === true || /(^|-)(2g|3g)$/.test(conn.effectiveType ?? ""));
    setOk(!lenta && document.documentElement.classList.contains("motion-full"));
  }, []);
  return ok;
}

/** Visibilidade contínua (sem once): pausa de vídeos, canvas e fitas fora da tela. */
export function useInViewport(ref: RefObject<Element>, opts: { rootMargin?: string; threshold?: number } = {}): boolean {
  const [visivel, setVisivel] = useState(false);
  const { rootMargin = "0px", threshold = 0 } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold]);
  return visivel;
}
