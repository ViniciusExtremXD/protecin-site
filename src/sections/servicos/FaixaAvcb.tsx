import { Reveal } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { WhatsAppCta } from "../../components/ui/cta";
import { FAIXA_AVCB, WA } from "../../data/site";

export interface FaixaAvcbProps {
  id?: string;
}

/**
 * Faixa AVCB de /servicos/ (`#avcb`, rodada de sobriedade): um painel claro e compacto dentro da grade, com o título
 * à esquerda e, à direita, o resumo literal do serviço 03 e o WhatsApp "Falar sobre AVCB" (botão fantasma).
 * Sem vermelho de fundo, marca d'água ou faixa que se abre. Sem prazo nem multa (honestidade, §2).
 */
export default function FaixaAvcb({ id = "avcb" }: FaixaAvcbProps = {}) {
  return (
    <section id={id} data-section="servicos-avcb" className="grain relative bg-noite-950 pb-16 lg:pb-24">
      <Container>
        <Reveal
          y={20}
          className="tom-claro rounded-[16px] bg-papel-50 px-6 py-8 text-noite-950 md:px-10 md:py-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:px-14 lg:py-12"
        >
          <h2 className="display-l text-balance text-[clamp(1.625rem,2.6vw,2.5rem)] leading-[1.02] lg:col-span-6">{FAIXA_AVCB.titulo}</h2>
          <div className="mt-4 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <p className="corpo text-pretty text-grafite-600">{FAIXA_AVCB.texto}</p>
            <div className="mt-6">
              <WhatsAppCta location="avcb" message={WA.avcb} tone="claro" size="sm">
                {FAIXA_AVCB.cta}
              </WhatsAppCta>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
