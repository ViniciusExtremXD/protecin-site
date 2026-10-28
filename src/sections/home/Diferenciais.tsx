import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { DIFERENCIAIS, DIFERENCIAIS_HEADER, SECOES } from "../../data/site";
import { DUR, DrawIcon, EASE_IN_OUT, FocusBrackets, Reel, Reveal, Rule, ease } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { useMotionPref } from "../../lib/motion-pref";
import { Revela } from "../shared/historia/Revela";

/*
 * H6. Por que a Protecin (design-final §9 H6, tom claro). Desktop: à esquerda, uma ficha fixa (sticky) com o número
 * gigante e o ícone que trocam pelo bloco ativo; à direita, os 4 diferenciais. Celular: blocos em sequência.
 */

/** Rótulo de interface da seção (o site.ts usa "Por que a Protecin", que já é o H2; repetir o mesmo texto em cima
 * do título ficaria redundante). */
const ROTULO = "Diferenciais";

/** Número em contorno (texto real, cor noite-950 para o contraste) com a cópia brasa por baixo, que sobe ao ativar. */
function Numero({ numero, ativo }: { numero: string; ativo: boolean }) {
  const reduced = useMotionPref() === "reduced";
  return (
    <span className="relative block w-max">
      <motion.span
        aria-hidden
        className="absolute inset-0 block text-brasa-500"
        initial={false}
        animate={{ clipPath: ativo ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
        transition={reduced ? { duration: 0 } : { duration: DUR.longa, ease: ease(EASE_IN_OUT), delay: ativo ? 0.12 : 0 }}
      >
        {numero}
      </motion.span>
      <span className="relative block text-noite-950 [-webkit-text-fill-color:transparent] [-webkit-text-stroke:1.5px_rgba(5,10,18,0.55)]">
        {numero}
      </span>
    </span>
  );
}

function Bloco({ i, ativo, onAtivo }: { i: number; ativo: boolean; onAtivo: (i: number) => void }) {
  const d = DIFERENCIAIS[i];
  const ref = useRef<HTMLLIElement>(null);
  // os blocos ficam colados um no outro: sempre há um cruzando a linha do meio da tela
  const noMeio = useInView(ref, { margin: "-49% 0px -50% 0px" });
  useEffect(() => {
    if (noMeio) onAtivo(i);
  }, [noMeio, i, onAtivo]);

  return (
    <li ref={ref} className="relative">
      <Rule delay={0.05} className="bg-noite-950/15" />
      <Reveal className="lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center">
        <div className="py-12 lg:py-16">
          {/* celular: ícone e número no próprio bloco */}
          <div className="mb-6 flex items-center gap-4 lg:hidden">
            <DrawIcon icon={d.icone} size={56} className="text-brasa-500" />
          </div>
          <p className="rotulo text-brasa-500">{d.numero}</p>
          <h3
            className={`display-l mt-4 max-w-[16ch] text-noite-950 transition-opacity duration-[400ms] ease-out lg:mt-5 ${ativo ? "lg:opacity-100" : "lg:opacity-50"}`}
          >
            {d.titulo}
          </h3>
          <p
            className={`corpo-l mt-5 max-w-[44ch] text-grafite-600 transition-opacity duration-[400ms] ease-out lg:mt-6 ${ativo ? "lg:opacity-100" : "lg:opacity-90"}`}
          >
            {d.texto}
          </p>
        </div>
      </Reveal>
    </li>
  );
}

export default function Diferenciais() {
  const [ativo, setAtivo] = useState(0);
  const n = DIFERENCIAIS.length;
  const ficha = useRef<HTMLDivElement>(null);
  const vista = useInView(ficha, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <section id="diferenciais" data-section="H6" className="tom-claro relative overflow-clip bg-papel-50 py-24 text-noite-950 lg:py-40">
      <Container>
        <SectionLabel index={SECOES.diferenciais.index} label={ROTULO} tone="claro" />
        <Revela as="h2" modo="palavra" texto={DIFERENCIAIS_HEADER.h2} destaque={["Protecin"]} destaqueClassName="text-brasa-500" className="display-xl mt-5 max-w-[14ch] text-noite-950" />

        <div className="mt-12 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-x-6">
          {/* ficha fixa: número gigante + ícone que se redesenha */}
          <div aria-hidden className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 pt-px">
              <Reveal preset="fade">
                <div ref={ficha} className="bg-blueprint-claro relative flex aspect-square max-h-[calc(100svh-10rem)] w-full flex-col justify-between overflow-clip rounded-r-lg bg-papel-100 p-10 xl:p-12">
                  <FocusBrackets mode="locked" tone="claro" offset={0} size={32} className="m-5" />
                  <div className="relative flex items-start justify-between gap-6">
                    <Reel count={n} index={ativo} className="display-xxl h-[0.86em] text-[clamp(6rem,11vw,10.5rem)]">
                      {DIFERENCIAIS.map((d, i) => (
                        <Numero key={d.numero} numero={d.numero} ativo={vista && ativo === i} />
                      ))}
                    </Reel>
                    <Reel count={n} index={ativo} className="rotulo mt-3 h-[1.35em] w-[12ch] text-right text-grafite-600">
                      {DIFERENCIAIS.map((d) => (
                        <span key={d.numero} className="block truncate">
                          {d.numero} / 0{n}
                        </span>
                      ))}
                    </Reel>
                  </div>
                  <div className="relative flex items-end justify-end">
                    <Reel count={n} index={ativo} className="h-[160px] w-[160px] text-brasa-500">
                      {DIFERENCIAIS.map((d, i) => (
                        <span key={d.numero} className="block h-full">
                          <DrawIcon icon={d.icone} size={160} strokeWidth={1.25} drawn={vista && ativo === i} />
                        </span>
                      ))}
                    </Reel>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7">
            {DIFERENCIAIS.map((d, i) => (
              <Bloco key={d.numero} i={i} ativo={ativo === i} onAtivo={setAtivo} />
            ))}
            <li aria-hidden>
              <Rule delay={0.05} className="bg-noite-950/15" />
            </li>
          </ol>
        </div>
      </Container>
    </section>
  );
}
