import { motion } from "framer-motion";
import { Reveal, SplitLines, VIEWPORT, ease, EASE_OUT } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { WhatsAppCta } from "../../components/ui/cta";
import { Symbol } from "../../components/ui/Symbol";
import { FAIXA_AVCB, WA, servicoPorSlug } from "../../data/site";
import { useMotionPref } from "../../lib/motion-pref";
import { linhasPara } from "./capitulos/util";

export interface FaixaAvcbProps {
  id?: string;
}

/**
 * Faixa AVCB de /servicos/ (§10.2, `#avcb`): fundo brasa-500 com texto branco. Na entrada a faixa abre de 0,9 para 1
 * a partir do centro (700 ms; só o fundo escala, o texto não deforma) e o título sobe linha a linha. Texto = resumo
 * literal do serviço 03. CTA fantasma branco que inverte por varredura no hover. Sem prazo nem multa (honestidade, §2).
 */
export default function FaixaAvcb({ id = "avcb" }: FaixaAvcbProps = {}) {
  const reduced = useMotionPref() === "reduced";
  const servico = servicoPorSlug("documentacao-e-regularizacao");

  return (
    <section id={id} data-section="servicos-avcb" className="relative isolate overflow-clip py-20 text-white [--foco:#ffffff] lg:py-28">
      <motion.div
        aria-hidden
        data-motion="faixa"
        className="absolute inset-0 -z-10 bg-brasa-500"
        style={{ originX: 0.5 }}
        initial={{ scaleX: 0.9 }}
        {...(reduced
          ? { animate: { scaleX: 1 }, transition: { duration: 0 } }
          : { whileInView: { scaleX: 1 }, viewport: VIEWPORT, transition: { duration: 0.7, ease: ease(EASE_OUT) } })}
      />
      {/* o símbolo como marca d'água, cortado pela borda direita */}
      <div aria-hidden className="pointer-events-none absolute -bottom-[18%] -right-[22%] -z-10 w-[min(78vw,560px)] opacity-[0.08] lg:bottom-auto lg:right-[1%] lg:top-1/2 lg:-translate-y-1/2 lg:opacity-[0.08]">
        <Symbol tone="mono" size="100%" mode="montar" delay={0.2} className="h-auto w-full" />
      </div>

      <Container className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="lg:col-span-7">
          <Reveal y={12}>
            <p className="rotulo inline-flex items-center gap-3 text-white">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
              <span>{servico.numero}</span>
              <span aria-hidden className="text-white/50">
                —
              </span>
              <span>{servico.nomeCurto}</span>
            </p>
          </Reveal>
          <SplitLines
            as="h2"
            lines={{ desktop: linhasPara(FAIXA_AVCB.titulo, 30), celular: linhasPara(FAIXA_AVCB.titulo, 18) }}
            text={FAIXA_AVCB.titulo}
            className="display-l mt-5 text-[clamp(2.25rem,4.2vw,4.25rem)] text-white"
          />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal delay={0.15}>
            <p className="corpo-l text-pretty text-white">{FAIXA_AVCB.texto}</p>
          </Reveal>
          <Reveal delay={0.25} className="mt-8">
            <WhatsAppCta
              location="avcb"
              message={WA.avcb}
              className="!border-white/70 !text-white hover:!border-white hover:!text-brasa-500 [&_.cta-varredura]:!bg-white"
            >
              {FAIXA_AVCB.cta}
            </WhatsAppCta>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
