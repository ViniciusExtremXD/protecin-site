import { useEffect, useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { IconeId } from "../../data/site";
import { ICONES } from "../ui/icones";
import { VIEWPORT, useIsoLayoutEffect } from "./tokens";

export interface DrawIconProps {
  icon: IconeId | LucideIcon;
  size?: number;
  strokeWidth?: number;
  className?: string;
  delay?: number;
  redrawOnHover?: boolean;
  drawn?: boolean; // controle externo; omitido = inView
}

const FORMAS = "path, line, circle, rect, polyline, polygon, ellipse";

/**
 * Ícone lucide que se desenha (stroke-dashoffset 1 → 0, 700 ms, stagger 80 ms por traço).
 * Sem JS (sem data-ready) o ícone aparece inteiro.
 */
export function DrawIcon({ icon, size = 24, strokeWidth, className, delay = 0, redrawOnHover = false, drawn }: DrawIconProps) {
  const Icone = typeof icon === "string" ? ICONES[icon] : icon;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const ativo = drawn ?? inView;
  const traco = strokeWidth ?? (size > 96 ? 1.25 : 1.5);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll<SVGGeometryElement>(FORMAS).forEach((f, i) => {
      f.setAttribute("pathLength", "1");
      f.style.setProperty("--i", String(i));
    });
    el.dataset.ready = "";
  }, [Icone]);

  useEffect(() => {
    const el = ref.current;
    if (!redrawOnHover || !el) return;
    const alvo = (el.closest(".group") as HTMLElement | null) ?? el;
    const refazer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !el.classList.contains("is-drawn")) return;
      el.classList.add("draw-reset");
      el.classList.remove("is-drawn");
      void el.getBoundingClientRect(); // força o reflow para recomeçar o traço
      el.classList.remove("draw-reset");
      el.classList.add("is-drawn");
    };
    alvo.addEventListener("pointerenter", refazer);
    return () => alvo.removeEventListener("pointerenter", refazer);
  }, [redrawOnHover]);

  return (
    <span
      ref={ref}
      aria-hidden
      data-motion="traco"
      className={`draw inline-flex shrink-0 ${ativo ? "is-drawn" : ""} ${className ?? ""}`}
      style={{ "--dd": `${Math.round(delay * 1000)}ms` } as CSSProperties}
    >
      <Icone size={size} strokeWidth={traco} />
    </span>
  );
}
