import { PLATAFORMA, WA } from "../../data/site";
import { RevealGroup, RevealItem, ScrollLitText } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta, WhatsAppCta } from "../../components/ui/cta";
import { Symbol } from "../../components/ui/Symbol";

/*
 * Fecho de /nosso-app/ (§10.5): a frase final em display-xl acende palavra por palavra com a rolagem e os dois
 * caminhos (orçamento e WhatsApp com a mensagem da plataforma) sobem em seguida. Antes da FaixaCta da página.
 */
const FRASE = PLATAFORMA.fecho.replace("resultado,", "*resultado,*");

export default function AppFecho() {
  return (
    <section id="fecho-app" data-section="APP-FECHO" className="relative isolate overflow-clip bg-marinho-900 pb-32 pt-24 lg:pb-48 lg:pt-36">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-50">
        <div className="bg-blueprint h-full w-full" />
      </div>
      <div aria-hidden className="pointer-events-none absolute -right-[12vw] top-1/2 -z-10 hidden -translate-y-1/2 opacity-[0.07] lg:block">
        <Symbol size="46vw" tone="mono" mode="desenhar" />
      </div>
      <Container>
        <ScrollLitText as="h2" text={FRASE} offset={["start 85%", "end 55%"]} className="display-xl max-w-[22ch] text-papel-50" highlightClassName="text-brasa-400" />
        <RevealGroup stagger={0.06} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-14">
          <RevealItem>
            <OrcamentoCta formLocation="pagina_app" />
          </RevealItem>
          <RevealItem>
            <WhatsAppCta location="pagina_app" message={WA.plataforma} />
          </RevealItem>
        </RevealGroup>
      </Container>
    </section>
  );
}
