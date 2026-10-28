import { createContext, useContext, useEffect, useRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { COMPANY, NOT_FOUND, ROUTES, type Rota } from "../data/site";
import { quandoLivre, resizeSmoothScroll, scrollToHash, scrollToY } from "./smooth-scroll";
import { definirCaminhoAtual, pushEvent } from "./track";
import { routeUrl } from "./urls";

/*
 * Roteador próprio, sem dependência (design-final §6). Rotas com barra no fim.
 * Troca de rota: cortina cobre (450 ms) → troca a rota por baixo → cortina sai (550 ms).
 */
type Fase = "idle" | "cobrindo" | "saindo";
interface Estado {
  path: string;
  phase: Fase;
  destino: string | null;
}

const RouterCtx = createContext<Estado>({ path: "/", phase: "idle", destino: null });
let controlador: ((to: string, opts: { replace?: boolean }) => void) | null = null;

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

/** Caminho sem a base, sem query/hash, sempre com "/" no fim (exceto arquivos .html). */
export function normalizarPath(p: string): string {
  let s = p.split(/[?#]/)[0] || "/";
  if (BASE !== "/" && s.startsWith(BASE)) s = `/${s.slice(BASE.length)}`;
  if (!s.startsWith("/")) s = `/${s}`;
  if (!s.endsWith("/") && !/\.html?$/.test(s)) s = `${s}/`;
  return s;
}

function separar(to: string): { path: string; hash: string; search: string } {
  const h = to.indexOf("#");
  const hash = h >= 0 ? to.slice(h) : "";
  const semHash = h >= 0 ? to.slice(0, h) : to;
  const q = semHash.indexOf("?");
  const search = q >= 0 ? semHash.slice(q) : "";
  const path = normalizarPath(q >= 0 ? semHash.slice(0, q) : semHash || "/");
  return { path, hash, search };
}

export function matchRoute(path: string): Rota | undefined {
  const p = normalizarPath(path);
  return ROUTES.find((r) => r.path === p);
}

function meta(sel: string, attr: string, valor: string) {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(sel);
  if (!el) return;
  el.setAttribute(attr, valor);
}

/** document.title + meta description + canonical (+ og:title/description/url quando existem). */
export function applyHead(rota: Rota | null): void {
  if (typeof document === "undefined") return;
  const r = rota ?? NOT_FOUND;
  document.title = r.title;
  meta('meta[name="description"]', "content", r.description);
  meta('link[rel="canonical"]', "href", `${COMPANY.dominio}${r.path}`);
  meta('meta[property="og:title"]', "content", r.title);
  meta('meta[property="og:description"]', "content", r.description);
  meta('meta[property="og:url"]', "content", `${COMPANY.dominio}${r.path}`);
}

/** Navega para uma rota interna (ou rola, se for a mesma página com #âncora). */
export function navigate(to: string, opts: { replace?: boolean } = {}): void {
  if (controlador) controlador(to, opts);
  else if (typeof window !== "undefined") window.location.assign(routeUrl(to));
}

export function RouterProvider({ initialPath, children, memory = false }: { initialPath: string; children: ReactNode; memory?: boolean }) {
  const [estado, setEstado] = useState<Estado>({ path: normalizarPath(initialPath), phase: "idle", destino: null });
  const atual = useRef(estado);
  atual.current = estado;

  useEffect(() => definirCaminhoAtual(estado.path), [estado.path]);

  useEffect(() => {
    const timers: number[] = [];
    const trocar = (to: string, opts: { replace?: boolean }, empilhar: boolean) => {
      const { path, hash, search } = separar(to);
      if (atual.current.phase !== "idle") return;
      if (path === atual.current.path) {
        if (empilhar && !memory && (hash || search)) history.replaceState(history.state, "", routeUrl(path) + search + hash);
        if (hash) scrollToHash(hash);
        else if (empilhar) scrollToY(0);
        return;
      }
      const tCobrir = 450;
      const tSair = 550;
      setEstado({ ...atual.current, phase: "cobrindo", destino: path });
      timers.push(
        window.setTimeout(() => {
          if (empilhar && !memory) {
            const url = routeUrl(path) + search + hash;
            if (opts.replace) history.replaceState(null, "", url);
            else history.pushState(null, "", url);
          }
          setEstado({ path, phase: "saindo", destino: path });
          scrollToY(0, { immediate: true });
          requestAnimationFrame(() => resizeSmoothScroll());
          applyHead(matchRoute(path) ?? null);
          pushEvent("virtual_page_view", { page_path: routeUrl(path), page_title: document.title });
          timers.push(
            window.setTimeout(() => {
              setEstado((s) => ({ ...s, phase: "idle", destino: null }));
              if (hash) scrollToHash(hash);
            }, tSair),
          );
        }, tCobrir),
      );
    };
    controlador = (to, opts) => trocar(to, opts, true);
    const onPop = () => trocar(window.location.pathname + window.location.search + window.location.hash, {}, false);
    if (!memory) window.addEventListener("popstate", onPop);
    // abrir direto em /servicos/#slug cai no capítulo certo (na 1ª visita, depois que o preloader solta a rolagem)
    if (!memory && window.location.hash) {
      const h = window.location.hash;
      timers.push(window.setTimeout(() => quandoLivre(() => scrollToHash(h)), 400));
    }
    return () => {
      controlador = null;
      window.removeEventListener("popstate", onPop);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [memory]);

  return <RouterCtx.Provider value={estado}>{children}</RouterCtx.Provider>;
}

/** Caminho atual sem a base, sempre com "/" no fim. */
export function usePath(): string {
  return useContext(RouterCtx).path;
}

/** Rota atual; null = 404. */
export function useRoute(): Rota | null {
  return matchRoute(usePath()) ?? null;
}

export function useRouteTransition(): { phase: Fase; destino: string | null } {
  const { phase, destino } = useContext(RouterCtx);
  return { phase, destino };
}

/** Link interno: href real com a base; intercepta o clique esquerdo sem modificadores. */
export function Link({ to, onClick, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return (
    <a
      href={routeUrl(to)}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === "_blank") return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
