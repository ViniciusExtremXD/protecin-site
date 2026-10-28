/*
 * Pilha de cartões sticky do H3 (design-final §9 H3).
 *
 * Cada <li> é sticky dentro da mesma <ol>, com top = 96 + i·14 px (desktop) ou 72 + i·8 px (celular). Quando o cartão
 * é mais alto que a tela, o top cai (até negativo) para o cartão só "colar" depois que o fim dele aparece: assim o
 * visitante sempre vê os CTAs antes de o próximo cartão cobrir. As posições em fluxo são medidas com os <li> em
 * position:static (leitura síncrona, sem pintar) e guardadas num ref; o progresso de cada cartão sai do scrollY.
 */
import { createContext, useContext, useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import { useMotionValue, useScroll, type MotionValue } from "framer-motion";

export interface MedidasPilha {
  ok: boolean;
  vh: number;
  base: number;
  flow: number[]; // y do topo de cada <li> em fluxo (documento)
  tops: number[]; // top sticky aplicado a cada <li>
}

export interface PilhaInfo {
  ligada: boolean;
  scrollY: MotionValue<number>;
  versao: MotionValue<number>; // muda a cada medição (recalcula os derivados sem rolar)
  medidas: MutableRefObject<MedidasPilha>;
  registrar: (i: number) => (el: HTMLLIElement | null) => void;
}

export const PilhaCtx = createContext<PilhaInfo | null>(null);

export function usePilhaCtx(): PilhaInfo {
  const c = useContext(PilhaCtx);
  if (!c) throw new Error("usePilhaCtx() fora da pilha de serviços");
  return c;
}

const limitar = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** 0 → 1 enquanto o cartão i+1 sobe da base da tela até colar por cima do cartão i. */
export function cobertura(m: MedidasPilha, i: number, y: number): number {
  if (!m.ok || i >= m.flow.length - 1) return 0;
  const ini = m.flow[i + 1] - m.vh;
  const fim = m.flow[i + 1] - m.tops[i + 1];
  if (fim <= ini) return y >= fim ? 1 : 0;
  return limitar((y - ini) / (fim - ini));
}

/** O cartão i chegou ao lugar dele na pilha (ou, se for mais alto que a tela, o topo dele chegou ao topo útil). */
export function fixado(m: MedidasPilha, i: number, y: number): boolean {
  if (!m.ok || m.flow[i] === undefined) return false;
  return y >= m.flow[i] - Math.max(m.tops[i], m.base) - 4;
}

export function usePilha(ligada: boolean, lista: RefObject<HTMLElement>): PilhaInfo {
  const { scrollY } = useScroll();
  const versao = useMotionValue(0);
  const medidas = useRef<MedidasPilha>({ ok: false, vh: 0, base: 0, flow: [], tops: [] });
  const itens = useRef<(HTMLLIElement | null)[]>([]);
  const registros = useRef<((el: HTMLLIElement | null) => void)[]>([]);

  const registrar = (i: number) => {
    if (!registros.current[i])
      registros.current[i] = (el) => {
        itens.current[i] = el;
      };
    return registros.current[i];
  };

  useEffect(() => {
    const lis = () => itens.current.filter((x): x is HTMLLIElement => Boolean(x));
    if (!ligada) {
      lis().forEach((li) => (li.style.top = ""));
      medidas.current = { ok: false, vh: 0, base: 0, flow: [], tops: [] };
      versao.set(versao.get() + 1);
      return;
    }
    let raf = 0;
    const medir = () => {
      const todos = lis();
      if (!lista.current || !todos.length) return;
      const vh = window.innerHeight;
      const desk = window.innerWidth >= 1024;
      const base = desk ? 96 : 72;
      const passo = desk ? 14 : 8;
      const reserva = desk ? 24 : 68; // celular: barra de contato fixa (56 px) + folga
      // posições em fluxo: lê com os <li> em static (sem o deslocamento do sticky) e devolve na mesma tarefa
      todos.forEach((li) => (li.style.position = "static"));
      const sy = window.scrollY;
      const flow = todos.map((li) => li.getBoundingClientRect().top + sy);
      const alturas = todos.map((li) => li.offsetHeight);
      todos.forEach((li) => (li.style.position = ""));
      const tops = alturas.map((h, i) => Math.round(Math.min(base + i * passo, vh - reserva - h)));
      todos.forEach((li, i) => (li.style.top = `${tops[i]}px`));
      medidas.current = { ok: true, vh, base, flow, tops };
      versao.set(versao.get() + 1);
    };
    const agendar = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("resize", agendar);
    const ro = new ResizeObserver(agendar);
    lis().forEach((li) => ro.observe(li));
    if (lista.current) ro.observe(lista.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", agendar);
      ro.disconnect();
    };
  }, [ligada, lista, versao]);

  return { ligada, scrollY, versao, medidas, registrar };
}
