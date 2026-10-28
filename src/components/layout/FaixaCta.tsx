import { Phone } from "lucide-react";
import { COMPANY, FAIXA_CTA, type PageId } from "../../data/site";
import { Reveal, RevealGroup, RevealItem } from "../motion/Reveal";
import { OrcamentoCta, PhoneLink, WhatsAppCta } from "../ui/cta";
import { Container } from "./Container";

/**
 * Faixa de CTA no fim de toda página interna (§7.10, rodada de sobriedade): faixa compacta noite-900 com borda de
 * 1 px, a frase à esquerda e o CTA principal (orçamento) com um secundário (WhatsApp) à direita; o telefone vem
 * como link de texto. Sem letreiro gigante correndo, sem glow vermelho e sem brasas.
 */
export function FaixaCta({ page }: { page: PageId }) {
  return (
    <section id="fale-com-a-protecin" aria-label={FAIXA_CTA.titulo} className="border-t border-noite-700 bg-noite-900">
      <Container className="flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-14">
        <Reveal className="max-w-[44ch]">
          <p className="titulo text-balance text-papel-50">{FAIXA_CTA.titulo}</p>
          <p className="mt-2 text-[16px] leading-relaxed text-papel-300 lg:text-[17px]">
            {FAIXA_CTA.frase}{" "}
            <PhoneLink location="faixa_cta" detail={page} className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap font-semibold text-papel-50 underline decoration-papel-50/30 underline-offset-4 transition-colors duration-200 hover:decoration-papel-50">
              <Phone aria-hidden size={16} strokeWidth={1.75} />
              <span className="tnum">{COMPANY.phoneDisplay}</span>
            </PhoneLink>
          </p>
        </Reveal>
        <RevealGroup stagger={0.06} className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <RevealItem>
            <OrcamentoCta formLocation="faixa_cta" full className="sm:w-auto" />
          </RevealItem>
          <RevealItem>
            <WhatsAppCta location="faixa_cta" detail={page} full className="sm:w-auto" />
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  );
}
