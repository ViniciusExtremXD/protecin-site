import { CONTATO, SECOES, UI } from "../../data/site";
import { Reveal } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { usePath } from "../../lib/router";
import { H2_FRASE, H3 } from "./historia/estilo";
import Canais from "./orcamento/Canais";
import OrcamentoForm from "./orcamento/OrcamentoForm";

/*
 * H10. Orçamento (#orcamento, design-final §9 H10, com qa/AJUSTES-SOBRIEDADE.md por cima).
 * Fecho da home: seção escura com um brilho vermelho discreto e parado ao fundo (o único fora da Abertura),
 * título, texto e canais à esquerda e o formulário à direita. Variante "contato": fundo noite-900 simples.
 * Fora da rodada 1: letreiro gigante "SOLICITAR ORÇAMENTO", brasas (Embers), gota vermelha crescendo, vídeo de
 * fogo e a luz que escalava com a rolagem.
 */

export interface OrcamentoProps {
  /** "home" (padrão) ou "contato". Sem a prop, a rota /contato/ escolhe "contato". */
  variant?: "home" | "contato";
}

/** Brilho da marca: vermelho vindo de baixo, atrás do formulário, que apaga antes do rodapé. */
const BRILHO =
  "radial-gradient(60% 50% at 68% 78%, rgba(190,30,41,0.40) 0%, rgba(143,20,27,0.22) 40%, rgba(5,10,18,0) 74%), radial-gradient(50% 40% at 12% 100%, rgba(190,30,41,0.18), rgba(5,10,18,0) 70%)";

export default function Orcamento({ variant }: OrcamentoProps) {
  const path = usePath();
  const contato = (variant ?? (path === "/contato/" ? "contato" : "home")) === "contato";

  return (
    <section id="orcamento" data-section="H10" className={`relative isolate overflow-clip text-papel-50 ${contato ? "bg-noite-900" : "bg-noite-950"}`}>
      {!contato && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-[1]" style={{ backgroundImage: BRILHO }} />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-[1] h-24 bg-gradient-to-b from-noite-950/0 to-noite-950" />
        </>
      )}

      <Container className="py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-12">
          <div className="lg:col-span-5">
            {contato ? (
              <>
                <SectionLabel index="01" label={CONTATO.label} />
                <Reveal y={20} delay={0.06}>
                  {/* o H1 da página já diz "Contate a Protecin": aqui o título é discreto, sobre os canais */}
                  <h2 className={`${H3} mt-4 text-papel-50 lg:mt-5`}>{UI.menuRotuloCanais}</h2>
                </Reveal>
              </>
            ) : (
              <>
                <SectionLabel index={SECOES.orcamento.index} label={SECOES.orcamento.label} />
                <Reveal y={20} delay={0.06}>
                  <h2 className={`${H2_FRASE} mt-4 max-w-[20ch] text-papel-50 lg:mt-5`}>{CONTATO.h2}</h2>
                </Reveal>
                <Reveal y={20} delay={0.12}>
                  <p className="mt-5 max-w-[46ch] text-pretty text-[17px] leading-[1.6] text-papel-300 lg:mt-6 lg:text-[18px]">{CONTATO.texto}</p>
                </Reveal>
              </>
            )}
          </div>
          {/* desktop: o cartão acompanha a rolagem enquanto os canais passam ao lado */}
          <div className="lg:sticky lg:top-28 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-start">
            <Reveal y={20} delay={0.1}>
              <OrcamentoForm formLocation={contato ? "pagina_contato" : "orcamento"} card={contato ? "fundo" : "escuro"} />
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:row-start-2">
            {contato ? <Canais location="pagina_contato" email2 tone="escuro" /> : <Canais location="orcamento" tone="vermelho" />}
          </div>
        </div>
      </Container>
    </section>
  );
}
