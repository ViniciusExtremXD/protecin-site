import { useCallback, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu as MenuIcone } from "lucide-react";
import { NAV, UI } from "../../data/site";
import { Link, usePath } from "../../lib/router";
import { Container } from "../layout/Container";
import { TextRoll } from "../motion/TextRoll";
import { EASE_OUT, SPRING, ease } from "../motion/tokens";
import { OrcamentoCta, WhatsAppLink } from "../ui/cta";
import { GlifoWhatsApp } from "../ui/glifos";
import { Logo } from "../ui/Logo";
import { Menu } from "./Menu";

/**
 * Nav (§7.3, rodada de sobriedade): transparente no topo; acima de 40 px ganha fundo noite-950/92 e linha noite-700
 * (sem blur); esconde ao descer depois de 420 px e volta ao subir. O logo, o Orçamento e o botão do menu ficam
 * parados e visíveis desde o primeiro paint (desktop e celular); só os links entram (CSS .e-sobe, antes da
 * hidratação), com subida curta.
 */
export function Nav() {
  const path = usePath();
  const [aberto, setAberto] = useState(false);
  const [solido, setSolido] = useState(false);
  const [oculto, setOculto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const anterior = scrollY.getPrevious() ?? 0;
    setSolido(y > 40);
    setOculto(y > anterior && y > 420 && !aberto);
  });

  const fechar = useCallback(() => setAberto(false), []);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-nav"
        initial={false}
        animate={{ y: oculto ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: ease(EASE_OUT) }}
        data-motion="nav"
      >
        <div>
          <div className={`border-b transition-colors duration-300 ${solido ? "border-noite-700 bg-noite-950/[0.92]" : "border-transparent bg-transparent"}`}>
            <Container className="flex h-16 items-center justify-between gap-6 lg:h-[76px]">
              <Logo tone="escuro" asLink className="shrink-0" />

              <nav aria-label={UI.menuNavegacao} className="hidden xl:block">
                <ul className="flex items-center gap-7">
                  {NAV.map((l, i) => {
                    const ativo = path === l.to;
                    return (
                      <li key={l.to} className="e-sobe" style={{ "--d": `${120 + i * 40}ms`, "--dur": "500ms" } as CSSProperties}>
                        <Link
                          to={l.to}
                          aria-current={ativo ? "page" : undefined}
                          className="group relative inline-flex h-11 items-center text-[15px] font-medium text-papel-50/85 transition-colors duration-200 hover:text-papel-50"
                        >
                          <TextRoll text={l.label} />
                          {ativo && (
                            <motion.span
                              layoutId="nav-ativo"
                              aria-hidden
                              className="absolute bottom-0.5 left-1/2 -ml-[3px] h-1.5 w-1.5 rounded-full bg-brasa-400"
                              transition={{ type: "spring", ...SPRING.pilula }}
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <div>
                  <OrcamentoCta size="sm" formLocation="nav" className="hidden md:inline-flex" />
                  <OrcamentoCta size="sm" icon="none" formLocation="nav" className="px-4 md:hidden">
                    {UI.orcamentoCurto}
                  </OrcamentoCta>
                </div>
                <WhatsAppLink
                  location="nav"
                  aria-label={UI.falarWhatsapp}
                  className="hidden h-11 w-11 place-items-center rounded-full border border-papel-50/25 text-papel-50 transition-colors duration-200 hover:border-whatsapp hover:text-whatsapp md:grid"
                >
                  <GlifoWhatsApp size={20} />
                </WhatsAppLink>
                <button
                  ref={botao}
                  type="button"
                  onClick={() => setAberto(true)}
                  aria-label={UI.menuAbrir}
                  aria-expanded={aberto}
                  aria-haspopup="dialog"
                  className="grid h-11 w-11 place-items-center rounded-full border border-papel-50/25 text-papel-50 transition-colors duration-200 hover:border-papel-50/80"
                >
                  <MenuIcone size={20} strokeWidth={1.5} />
                </button>
              </div>
            </Container>
          </div>
        </div>
      </motion.header>
      <Menu open={aberto} onClose={fechar} returnFocusRef={botao} />
    </>
  );
}
