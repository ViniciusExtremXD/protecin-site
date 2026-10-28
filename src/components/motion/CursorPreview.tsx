import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import type { ImagemId } from "../../data/imagens.gen";
import { useFinePointer } from "../../lib/media";
import { Img } from "../ui/Img";
import { EASE_OUT, SPRING, ease } from "./tokens";

/**
 * Prévia de imagem que segue o ponteiro dentro de `containerRef` (fixed, por portal no body).
 * Só com ponteiro fino; no toque não renderiza. Abre com fade e escala 0,96 → 1 (sem giro).
 */
export function CursorPreview({ image, containerRef, width = 318, height = 220 }: { image: ImagemId | null; containerRef: RefObject<HTMLElement>; width?: number; height?: number }) {
  const fino = useFinePointer();
  const [dentro, setDentro] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING.previa);
  const sy = useSpring(y, SPRING.previa);
  const ligado = fino;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !ligado) return;
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX + 28);
      y.set(e.clientY - height / 2);
    };
    const entrar = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.jump(e.clientX + 28);
      y.jump(e.clientY - height / 2);
      sx.jump(e.clientX + 28);
      sy.jump(e.clientY - height / 2);
      setDentro(true);
    };
    const sair = () => setDentro(false);
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerenter", entrar);
    el.addEventListener("pointerleave", sair);
    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerenter", entrar);
      el.removeEventListener("pointerleave", sair);
    };
  }, [containerRef, ligado, height, x, y, sx, sy]);

  if (!ligado) return null;
  const aberto = dentro && image !== null;
  return createPortal(
    <motion.div
      aria-hidden
      data-motion="previa"
      className="pointer-events-none fixed left-0 top-0 z-[46] overflow-clip rounded-r-md bg-noite-800 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
      style={{ x: sx, y: sy, width, height }}
      initial={false}
      animate={{ opacity: aberto ? 1 : 0, scale: aberto ? 1 : 0.96 }}
      transition={{ duration: 0.35, ease: ease(EASE_OUT) }}
    >
      <AnimatePresence initial={false}>
        {image && (
          <motion.div key={image} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Img id={image} alt="" sizes={`${width}px`} className="block h-full w-full" imgClassName="h-full w-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body,
  );
}
