import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { RevealGroup, RevealItem, DUR, EASE_OUT, SPRING, ease } from "../../../components/motion";
import { SERVICOS, SERVICOS_HEADER } from "../../../data/site";
import { useMotionPref } from "../../../lib/motion-pref";
import { scrollToHash } from "../../../lib/smooth-scroll";

/** Rola até o capítulo (Lenis quando existe) e deixa a âncora na URL sem empilhar histórico. */
export function irPara(e: MouseEvent<HTMLAnchorElement>, slug: string) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  scrollToHash(`#${slug}`);
  try {
    history.replaceState(history.state, "", `#${slug}`);
  } catch {
    /* sandbox ou ambiente sem history: só rola */
  }
}

/**
 * Índice fixo do desktop (colunas 1–3): os 8 serviços numerados. O ativo fica em papel-50 com a barra brasa-400
 * (layoutId "svc-ativo", desliza entre os itens); os outros em papel-500 (a opacidade 0,45 da spec não passa no AA).
 */
export function Indice({ ativo }: { ativo: number }) {
  const reduced = useMotionPref() === "reduced";
  return (
    <nav aria-label={SERVICOS_HEADER.label}>
      <RevealGroup as="ol" stagger={0.05} y={12} className="relative">
        <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-noite-700" />
        {SERVICOS.map((s, i) => {
          const eh = i === ativo;
          return (
            <RevealItem as="li" key={s.slug}>
              <a
                href={`#${s.slug}`}
                onClick={(e) => irPara(e, s.slug)}
                aria-current={eh ? "true" : undefined}
                className={`relative flex min-h-11 items-baseline gap-3 py-2.5 pl-5 text-[15px] font-medium leading-snug transition-colors duration-[350ms] ease-out ${
                  eh ? "text-papel-50" : "text-papel-500 hover:text-papel-300"
                }`}
              >
                {eh && (
                  <motion.span
                    layoutId="svc-ativo"
                    aria-hidden
                    className="absolute bottom-1 left-0 top-1 w-[2px] origin-top bg-brasa-400"
                    initial={reduced ? false : { scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={reduced ? { duration: 0 } : { duration: DUR.curta, ease: ease(EASE_OUT) }}
                  />
                )}
                <span className={`font-mono text-[13px] tnum transition-colors duration-[350ms] ${eh ? "text-brasa-300" : ""}`}>{s.numero}</span>
                <span className="text-balance">{s.nome}</span>
              </a>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </nav>
  );
}

/**
 * Barra de chips do celular (sem índice fixo): rola na horizontal (data-lenis-prevent, snap-x, touch-pan-x) e gruda
 * logo abaixo da nav; quando a nav se esconde (descendo a página), a barra sobe junto. A pílula ativa desliza
 * (layoutId "svc-pill", SPRING.pilula) e a barra centraliza o chip ativo.
 */
export function BarraChips({ ativo }: { ativo: number }) {
  const reduced = useMotionPref() === "reduced";
  const barra = useRef<HTMLDivElement>(null);
  const marco = useRef<HTMLSpanElement>(null);
  const chips = useRef<(HTMLAnchorElement | null)[]>([]);
  const { scrollY } = useScroll();
  const [subir, setSubir] = useState(false);
  const presa = useRef(false);

  // a barra está presa quando o marco (logo acima dela, em fluxo) já passou da linha da nav (64 px)
  useEffect(() => {
    const m = marco.current;
    if (!m) return;
    const io = new IntersectionObserver(([e]) => {
      presa.current = !e.isIntersecting && e.boundingClientRect.top < 64;
      if (!presa.current) setSubir(false);
    }, { rootMargin: "-64px 0px 0px 0px" });
    io.observe(m);
    return () => io.disconnect();
  }, []);

  // mesma regra da Nav: esconde ao descer depois de 420 px, volta ao subir. Só desloca quando a barra está presa.
  useMotionValueEvent(scrollY, "change", (y) => {
    const anterior = scrollY.getPrevious() ?? 0;
    setSubir(y > anterior && y > 420 && presa.current);
  });

  useEffect(() => {
    const b = barra.current;
    const c = chips.current[ativo];
    if (!b || !c) return;
    const alvo = c.offsetLeft - (b.clientWidth - c.offsetWidth) / 2;
    b.scrollTo({ left: Math.max(0, alvo), behavior: reduced ? "auto" : "smooth" });
  }, [ativo, reduced]);

  return (
    <>
      <span ref={marco} aria-hidden className="block h-0 lg:hidden" />
      <motion.div
        data-motion="barra"
        className="sticky top-16 z-20 -mx-5 border-b border-noite-700 bg-noite-950/95 md:-mx-8 lg:hidden curto:relative curto:top-0"
        initial={{ opacity: 0, y: 0 }}
        animate={reduced ? { opacity: 1, y: subir ? -64 : 0 } : { y: subir ? -64 : 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: ease(EASE_OUT) }}
      >
        <nav aria-label={SERVICOS_HEADER.label}>
          <div ref={barra} data-lenis-prevent="" className="no-scrollbar flex touch-pan-x snap-x snap-mandatory gap-2 overflow-x-auto px-5 py-3 md:px-8">
            {SERVICOS.map((s, i) => {
              const eh = i === ativo;
              return (
                <a
                  key={s.slug}
                  ref={(el) => {
                    chips.current[i] = el;
                  }}
                  href={`#${s.slug}`}
                  onClick={(e) => irPara(e, s.slug)}
                  aria-current={eh ? "true" : undefined}
                  className={`relative inline-flex min-h-11 shrink-0 snap-start scroll-ml-5 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition-colors duration-200 ${
                    eh ? "border-brasa-500 text-white" : "border-noite-600 text-papel-300"
                  }`}
                >
                  {eh && (
                    <motion.span
                      layoutId="svc-pill"
                      aria-hidden
                      className="absolute inset-[-1px] rounded-full bg-brasa-500"
                      transition={reduced ? { duration: 0 } : { type: "spring", ...SPRING.pilula }}
                    />
                  )}
                  <span className={`relative font-mono text-[13px] tnum ${eh ? "text-white" : "text-papel-500"}`}>{s.numero}</span>
                  <span className="relative whitespace-nowrap">{s.nomeCurto}</span>
                </a>
              );
            })}
          </div>
        </nav>
      </motion.div>
    </>
  );
}
