import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, X } from "lucide-react";
import { COMPANY, MENU, UI } from "../../data/site";
import { useMotionPref } from "../../lib/motion-pref";
import { Link, usePath } from "../../lib/router";
import { lockScroll } from "../../lib/smooth-scroll";
import { pushEvent } from "../../lib/track";
import { Container } from "../layout/Container";
import { EASE_IN_OUT, EASE_OUT, ease } from "../motion/tokens";
import { EmailLink, PhoneLink, WhatsAppLink } from "../ui/cta";
import { GlifoWhatsApp } from "../ui/glifos";
import { Img } from "../ui/Img";
import { Logo } from "../ui/Logo";
import { MotionToggle } from "./MotionToggle";

const CIRCULO = (r: string) => `circle(${r} at calc(100% - 44px) 32px)`;

/**
 * Menu em tela cheia (§7.4): abre por clip-path circular a partir do botão, itens 01–07 em display-xl entrando
 * linha a linha, imagem em gota à direita (desktop) com crossfade no hover. Foco preso; fecha com X, Esc,
 * toque na área vazia ou clique num link; o foco volta ao botão.
 */
export function Menu({ open, onClose, returnFocusRef }: { open: boolean; onClose: () => void; returnFocusRef: RefObject<HTMLButtonElement> }) {
  const path = usePath();
  const reduced = useMotionPref() === "reduced";
  const painel = useRef<HTMLDivElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);
  const [topo, setTopo] = useState(MENU.findIndex((m) => m.to === path) < 0 ? 0 : MENU.findIndex((m) => m.to === path));
  const [base, setBase] = useState<number | null>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    pushEvent("menu_open");
    const t = window.setTimeout(() => fechar.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !painel.current) return;
      const focaveis = Array.from(painel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focaveis.length) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const botao = returnFocusRef.current;
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      botao?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  const destacar = (i: number) => {
    if (i === topo) return;
    setBase(topo);
    setTopo(i);
    setN((x) => x + 1);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={painel}
          role="dialog"
          aria-modal="true"
          aria-label={UI.menu}
          data-lenis-prevent=""
          data-motion="menu"
          className="fixed inset-0 z-menu overflow-y-auto overscroll-contain bg-noite-900"
          initial={reduced ? { opacity: 0 } : { clipPath: CIRCULO("0%") }}
          animate={reduced ? { opacity: 1 } : { clipPath: CIRCULO("150%") }}
          exit={reduced ? { opacity: 0 } : { clipPath: CIRCULO("0%") }}
          transition={reduced ? { duration: 0.2 } : { duration: 0.6, ease: ease(EASE_IN_OUT) }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <Container className="flex min-h-full flex-col" >
            <div className="flex h-16 shrink-0 items-center justify-between lg:h-[76px]">
              <Logo tone="escuro" />
              <button
                ref={fechar}
                type="button"
                onClick={onClose}
                aria-label={UI.menuFechar}
                className="group grid h-11 w-11 place-items-center rounded-full border border-papel-50/25 text-papel-50 transition-colors duration-200 hover:border-papel-50/80"
              >
                <X size={20} strokeWidth={1.5} className="transition-transform duration-[350ms] ease-out group-hover:rotate-90" />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 items-center gap-10 py-8 lg:grid-cols-12 lg:py-10" onClick={(e) => e.target === e.currentTarget && onClose()}>
              <nav aria-label={UI.menuNavegacao} className="lg:col-span-7">
                <ol className="flex flex-col">
                  {MENU.map((m, i) => {
                    const ativo = m.to === path;
                    return (
                      <li key={m.to} className="border-b border-noite-700/70 first:border-t">
                        <Link
                          to={m.to}
                          onClick={onClose}
                          onPointerEnter={() => destacar(i)}
                          onFocus={() => destacar(i)}
                          aria-current={ativo ? "page" : undefined}
                          className="group flex min-h-11 items-baseline gap-4 py-2.5 lg:gap-6 lg:py-3"
                        >
                          <span className={`w-7 shrink-0 font-mono text-[13px] font-medium tracking-[0.16em] ${ativo ? "text-brasa-300" : "text-papel-500"}`}>{m.numero}</span>
                          <span className="-mt-[0.2em] block overflow-clip pb-[0.06em] pt-[0.2em]">
                            <motion.span
                              className={`display-xl block !text-[clamp(2.25rem,min(6vw,8.5svh),5.5rem)] transition-colors duration-200 ${ativo ? "text-brasa-400" : "text-papel-50 group-hover:text-brasa-400"}`}
                              initial={reduced ? false : { y: "110%", rotate: 3 }}
                              animate={{ y: "0%", rotate: 0 }}
                              transition={{ duration: 0.8, ease: ease(EASE_OUT), delay: 0.2 + i * 0.06 }}
                            >
                              {m.label}
                            </motion.span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div aria-hidden className="relative hidden justify-self-center lg:col-span-5 lg:block">
                <motion.div
                  className="relative overflow-clip rounded-gota bg-noite-800"
                  style={{ width: "32vw", height: "32vw", maxWidth: 520, maxHeight: 520 }}
                  initial={reduced ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: ease(EASE_OUT), delay: 0.25 }}
                >
                  {base !== null && <Img id={MENU[base].imagem} alt="" sizes="32vw" eager className="absolute inset-0 block h-full w-full" imgClassName="h-full w-full object-cover" />}
                  <motion.div key={`${topo}-${n}`} className="absolute inset-0" initial={{ opacity: n === 0 ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <Img id={MENU[topo].imagem} alt="" sizes="32vw" eager className="block h-full w-full" imgClassName="h-full w-full object-cover" />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="flex shrink-0 flex-col gap-4 border-t border-noite-700 py-6 text-[15px] text-papel-300 md:flex-row md:flex-wrap md:items-center md:justify-between"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: ease(EASE_OUT), delay: 0.55 }}
            >
              <p className="rotulo text-papel-500">{UI.menuRotuloCanais}</p>
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
                <WhatsAppLink location="menu" className="inline-flex min-h-11 items-center gap-2 hover:text-papel-50">
                  <GlifoWhatsApp size={18} className="text-whatsapp" />
                  {COMPANY.whatsappDisplay}
                </WhatsAppLink>
                <PhoneLink location="menu" className="inline-flex min-h-11 items-center gap-2 tnum hover:text-papel-50">
                  <Phone aria-hidden size={17} strokeWidth={1.5} />
                  {COMPANY.phoneDisplay}
                </PhoneLink>
                <EmailLink location="menu" className="inline-flex min-h-11 items-center gap-2 hover:text-papel-50">
                  <Mail aria-hidden size={17} strokeWidth={1.5} />
                  {COMPANY.email}
                </EmailLink>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
                <span>{COMPANY.horario}</span>
                <MotionToggle />
              </div>
            </motion.div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
