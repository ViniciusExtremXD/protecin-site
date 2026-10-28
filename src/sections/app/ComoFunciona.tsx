import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { PLATAFORMA, type Modulo } from "../../data/site";
import { DUR, EASE_IN_OUT, EASE_OUT, Reveal, RevealGroup, RevealItem, SplitLines, ease } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { ICONES } from "../../components/ui/icones";

/*
 * Como funciona o Protecin App (§10.5): App de Coleta → Processador de Coleta Online → Web Master.
 * Rodada de sobriedade (qa/AJUSTES-SOBRIEDADE.md): sem cena fixada e sem os pacotes "COLETA" andando. Os três
 * módulos ficam lado a lado (desktop) ou em fila (celular), ligados por um tracejado que se desenha uma vez quando
 * o bloco entra na tela; cada módulo sobe em sequência e a lista entra item a item.
 */
const C = PLATAFORMA.comoFunciona;
const MODULOS = PLATAFORMA.modulos;
/** Rótulo da seção na página do app (as páginas internas recomeçam em 01). */
const ROTULO = { index: "01", label: "Como funciona" } as const;
const H2 = "display-xl text-[clamp(2.25rem,4.4vw,4rem)] text-papel-50";
/** O título literal em duas linhas ("Como funciona o" / "Protecin App"). */
const PALAVRAS = C.titulo.split(" ");
const LINHAS = [PALAVRAS.slice(0, 3).join(" "), PALAVRAS.slice(3).join(" ")];

function No({ modulo }: { modulo: Modulo }) {
  const Icone = ICONES[modulo.icone];
  return (
    <span className="relative z-[1] grid h-14 w-14 shrink-0 place-items-center rounded-[14px] border border-marinho-300/40 bg-marinho-800 text-brasa-300">
      <Icone size={26} strokeWidth={1.5} aria-hidden />
    </span>
  );
}

export default function ComoFunciona() {
  const fila = useRef<HTMLOListElement>(null);
  const visto = useInView(fila, { once: true, amount: 0.3 });
  const linha = { duration: 1.1, ease: ease(EASE_IN_OUT), delay: 0.2 };

  return (
    <section id="como-funciona" data-section="APP-COMO" aria-label={C.titulo} className="relative isolate overflow-clip bg-marinho-900 py-16 lg:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-50">
        <div className="bg-blueprint h-full w-full" />
      </div>
      <Container>
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="lg:col-span-7">
            <SectionLabel index={ROTULO.index} label={ROTULO.label} />
            <SplitLines as="h2" lines={LINHAS} text={C.titulo} className={`${H2} mt-5`} />
          </div>
          <Reveal as="p" y={16} delay={0.1} className="corpo-l text-papel-300 lg:col-span-5 lg:col-start-8">
            {C.frase}
          </Reveal>
        </div>

        <ol ref={fila} className="relative mt-12 grid grid-cols-1 gap-y-10 lg:mt-16 lg:grid-cols-3 lg:gap-x-6">
          {/* tracejado que liga os nós: horizontal no desktop, vertical no celular */}
          <motion.span
            aria-hidden
            className="absolute left-[27px] top-7 hidden h-px origin-left bg-[repeating-linear-gradient(90deg,#9DB8D0_0_4px,transparent_4px_7px)] lg:block"
            style={{ right: "calc((100% - 48px) / 3 - 28px)" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={visto ? { scaleX: 1, opacity: 0.7 } : undefined}
            transition={linha}
          />
          {MODULOS.map((m, i) => (
            <li key={m.id} className="relative grid grid-cols-[56px_1fr] gap-x-5 lg:block">
              {/* celular: trecho vertical do nó até o próximo (40 px de vão + metade do nó) */}
              {i < MODULOS.length - 1 && (
                <motion.span
                  aria-hidden
                  className="absolute -bottom-[68px] left-[27px] top-7 w-px origin-top bg-[repeating-linear-gradient(180deg,#9DB8D0_0_4px,transparent_4px_7px)] lg:hidden"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={visto ? { scaleY: 1, opacity: 0.7 } : undefined}
                  transition={{ ...linha, duration: 0.6, delay: 0.3 + i * 0.35 }}
                />
              )}
              <motion.div
                data-motion="no-modulo"
                initial={{ opacity: 0, y: 16 }}
                animate={visto ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: DUR.base, ease: ease(EASE_OUT), delay: 0.15 + i * 0.35 }}
              >
                <No modulo={m} />
              </motion.div>
              <div className="pt-1 lg:mt-6 lg:pt-0">
                <Reveal y={16} delay={0.1 + i * 0.1}>
                  <h3 className="text-[21px] font-semibold leading-snug text-papel-50 lg:text-[22px]">{m.nome}</h3>
                  {m.uso && <p className="mt-1 text-[15px] text-marinho-300">{m.uso}</p>}
                </Reveal>
                <RevealGroup as="ul" stagger={0.06} delay={0.15 + i * 0.1} y={16} className="mt-4 flex flex-col gap-2.5">
                  {m.itens.map((item) => (
                    <RevealItem as="li" key={item} className="flex items-start gap-3 text-[16px] leading-snug text-papel-300 lg:text-[17px]">
                      <Check aria-hidden size={18} strokeWidth={2} className="mt-[3px] shrink-0 text-brasa-300" />
                      {item}
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
