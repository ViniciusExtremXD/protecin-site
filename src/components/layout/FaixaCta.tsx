import { FAIXA_CTA, type PageId } from "../../data/site";
import { Reveal, RevealGroup, RevealItem } from "../motion/Reveal";
import { SectionRise } from "../motion/SectionRise";
import { VelocityMarquee } from "../motion/VelocityMarquee";
import { OrcamentoCta, PhoneCta, WhatsAppCta } from "../ui/cta";
import { Container } from "./Container";

/**
 * Faixa de CTA no fim de toda página interna (§7.10): mundo-vermelho atenuado, letreiro gigante decorativo
 * "SOLICITAR ORÇAMENTO ·" correndo e os três caminhos de contato.
 * Sem brasas aqui: pelo QA, elas ficam só no fecho do Orçamento (H10) e no fim da Abertura.
 */
export function FaixaCta({ page }: { page: PageId }) {
  return (
    <SectionRise id="fale-com-a-protecin" className="isolate bg-noite-950">
      <div aria-hidden className="absolute inset-0 -z-10 bg-mundo-vermelho opacity-60" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-luz-brasa opacity-50" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-b from-transparent to-noite-950" />
      <div aria-hidden className="pt-14 lg:pt-20">
        <VelocityMarquee baseVelocity={-0.8} className="display-xxl select-none py-[0.1em] text-papel-50/[0.07]">
          <span className="pr-[0.25em]">{FAIXA_CTA.letreiro}</span>
        </VelocityMarquee>
      </div>
      <Container className="relative pb-24 pt-10 text-center lg:pb-32 lg:pt-14">
        <Reveal>
          <p className="corpo-l mx-auto max-w-[40ch] text-balance text-papel-50">{FAIXA_CTA.frase}</p>
        </Reveal>
        <RevealGroup stagger={0.06} className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:mt-10">
          <RevealItem>
            <OrcamentoCta formLocation="faixa_cta" full className="sm:w-auto" />
          </RevealItem>
          <RevealItem>
            <WhatsAppCta location="faixa_cta" detail={page} full className="sm:w-auto" />
          </RevealItem>
          <RevealItem>
            <PhoneCta location="faixa_cta" full className="sm:w-auto" />
          </RevealItem>
        </RevealGroup>
      </Container>
    </SectionRise>
  );
}
