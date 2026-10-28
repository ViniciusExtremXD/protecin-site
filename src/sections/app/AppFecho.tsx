import { PLATAFORMA, WA } from "../../data/site";
import { Reveal } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { WhatsAppCta } from "../../components/ui/cta";

/*
 * Fecho de /nosso-app/ (§10.5), na rodada de sobriedade: a frase final em caixa normal (em caixa alta ela passava
 * de 3 linhas no celular), com entrada de fade e subida curta, e um CTA só: o WhatsApp com a mensagem da
 * plataforma. O orçamento fica com a FaixaCta logo abaixo (antes eram os mesmos dois botões duas vezes seguidas).
 * Sem o símbolo gigante ao fundo e sem a frase acendendo palavra por palavra.
 */
export default function AppFecho() {
  return (
    <section id="fecho-app" data-section="APP-FECHO" className="relative isolate overflow-clip bg-marinho-900 py-16 lg:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40">
        <div className="bg-blueprint h-full w-full" />
      </div>
      <Container>
        <Reveal y={20}>
          <h2 className="display-l max-w-[28ch] text-balance text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.05] text-papel-50">{PLATAFORMA.fecho}</h2>
        </Reveal>
        <Reveal y={16} delay={0.1} className="mt-8 lg:mt-10">
          <WhatsAppCta location="pagina_app" message={WA.plataforma}>
            {PLATAFORMA.ctas.conhecerPlataforma}
          </WhatsAppCta>
        </Reveal>
      </Container>
    </section>
  );
}
