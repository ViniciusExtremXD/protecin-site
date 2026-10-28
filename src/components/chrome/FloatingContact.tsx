import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Phone } from "lucide-react";
import { UI } from "../../data/site";
import { useIsDesktop } from "../../lib/media";
import { usePath } from "../../lib/router";
import { EASE_OUT, ease } from "../motion/tokens";
import { OrcamentoCta, PhoneLink, WhatsAppLink } from "../ui/cta";
import { GlifoWhatsApp } from "../ui/glifos";

/**
 * Contato flutuante (§7.6). Celular: barra inferior com WhatsApp, Ligar e Orçamento (56 px + safe-area).
 * Desktop: botão redondo de WhatsApp (entra com fade e subida curta, sem mola nem anel pulsando) e rótulo no hover.
 * Entra depois de 640 px de rolagem; some com #orcamento, formulário ou rodapé na tela, ou com um campo em foco.
 */
export function FloatingContact() {
  const desktop = useIsDesktop();
  const path = usePath();
  const { scrollY } = useScroll();
  const [passou, setPassou] = useState(false);
  const [conflito, setConflito] = useState(false);
  const [digitando, setDigitando] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setPassou(y > 640));

  // some quando o orçamento, um formulário ou o rodapé estão na tela
  useEffect(() => {
    const vistos = new Set<Element>();
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => (e.isIntersecting ? vistos.add(e.target) : vistos.delete(e.target)));
      setConflito(vistos.size > 0);
    });
    const observar = () => document.querySelectorAll("#orcamento, form, footer").forEach((el) => io.observe(el));
    const t = window.setTimeout(observar, 300); // depois da troca de rota
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [path]);

  // some quando um campo tem foco (teclado aberto no celular)
  useEffect(() => {
    const campo = (el: EventTarget | null) => el instanceof HTMLElement && el.matches("input, textarea, select");
    const on = (e: FocusEvent) => campo(e.target) && setDigitando(true);
    const off = (e: FocusEvent) => campo(e.target) && setDigitando(false);
    document.addEventListener("focusin", on);
    document.addEventListener("focusout", off);
    return () => {
      document.removeEventListener("focusin", on);
      document.removeEventListener("focusout", off);
    };
  }, []);

  const visivel = passou && !conflito && !digitando;

  return (
    <AnimatePresence>
      {visivel &&
        (desktop ? (
          <motion.div
            key="botao"
            data-motion="flutuante"
            className="fixed bottom-6 right-6 z-flutuante"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: ease(EASE_OUT) }}
          >
            <WhatsAppLink
              location="botao_flutuante"
              aria-label={UI.falarWhatsapp}
              className="group flex h-14 items-center rounded-full bg-noite-900 pl-[17px] pr-[17px] text-papel-50 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.75)] ring-1 ring-noite-600 transition-colors duration-200 hover:ring-whatsapp"
            >
              <GlifoWhatsApp size={22} className="relative shrink-0 text-whatsapp" />
              <span className="relative max-w-0 overflow-hidden whitespace-nowrap text-[15px] font-semibold transition-[max-width,margin] duration-[350ms] ease-out group-hover:ml-3 group-hover:max-w-[180px] group-focus-visible:ml-3 group-focus-visible:max-w-[180px]">
                {UI.falarWhatsapp}
              </span>
            </WhatsAppLink>
          </motion.div>
        ) : (
          <motion.div
            key="barra"
            data-motion="barra"
            className="fixed inset-x-0 bottom-0 z-flutuante border-t border-noite-700 bg-noite-950/95 pb-[env(safe-area-inset-bottom)]"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: ease(EASE_OUT) }}
          >
            <div className="grid h-14 grid-cols-3">
              <WhatsAppLink location="barra_mobile" className="flex items-center justify-center gap-2 text-[15px] font-semibold text-papel-50">
                <span aria-hidden className="h-2 w-2 rounded-full bg-whatsapp" />
                {UI.whatsapp}
              </WhatsAppLink>
              <PhoneLink location="barra_mobile" className="flex items-center justify-center gap-2 border-x border-noite-700 text-[15px] font-semibold text-papel-50">
                <Phone aria-hidden size={17} strokeWidth={1.75} />
                {UI.ligar}
              </PhoneLink>
              <div className="flex">
                <OrcamentoCta formLocation="barra_mobile" icon="none" full className="!h-14 !rounded-none !shadow-none">
                  {UI.orcamentoCurto}
                </OrcamentoCta>
              </div>
            </div>
          </motion.div>
        ))}
    </AnimatePresence>
  );
}
