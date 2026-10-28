import { NUMEROS, SECOES } from "../../data/site";
import { Odometer, Reveal, Rule } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";

/*
 * H1. Escala (design-final §9 H1, compactada pela qa/AJUSTES-SOBRIEDADE.md). Faixa curta: o número-título
 * "20.000+" (odômetro, até 112 px) e, ao lado, as outras 4 marcas numa grade 2 × 2 com régua fina no topo.
 * Só os números de NUMEROS (conteudo-site-atual.md). Tom escuro, sem foto, sem glow e sem réguas de ticks.
 */

/** "3M+" → { num: "3", sufixo: "M+" }. */
function separar(valor: string) {
  const m = /^([\d.]+)(.*)$/.exec(valor);
  return { num: m?.[1] ?? valor, sufixo: m?.[2] ?? "" };
}

/** Número em odômetro com o sufixo em brasa (entra com fade depois dos dígitos). */
function Numero({ valor, atraso = 0 }: { valor: string; atraso?: number }) {
  const { num, sufixo } = separar(valor);
  return (
    <span aria-hidden className="inline-flex items-start">
      <Odometer value={num} />
      {sufixo && (
        <Reveal as="span" preset="fade" delay={atraso + 0.45} className="ml-[0.04em] inline-block text-brasa-400">
          {sufixo}
        </Reveal>
      )}
    </span>
  );
}

/** H1 da home (`#numeros`). Sem props. */
export default function Escala() {
  const [principal, ...linhas] = NUMEROS;

  return (
    <section id="numeros" data-section="H1" className="grain relative bg-noite-950 py-16 lg:py-24">
      <Container>
        <SectionLabel index={SECOES.escala.index} label={SECOES.escala.label} />

        <div className="mt-8 grid grid-cols-1 gap-y-12 lg:mt-12 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="lg:col-span-5">
            <h2 aria-label={principal.ariaLabel}>
              <span className="display-xxl stretch-62 block text-[clamp(4.5rem,22vw,5.5rem)] leading-[0.86] text-papel-50 lg:text-[clamp(5.5rem,7.8vw,7rem)]">
                <Numero valor={principal.valor} />
              </span>
              <Reveal as="span" delay={0.3} y={16} className="corpo-l mt-3 block text-papel-300 lg:mt-4">
                {principal.rotulo}
              </Reveal>
            </h2>
          </div>

          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 lg:col-span-6 lg:col-start-7 lg:gap-x-10 lg:gap-y-10">
            {linhas.map((n, i) => (
              <li key={n.valor}>
                <Rule delay={i * 0.08} className="bg-papel-50/15" />
                <p className="display-l stretch-75 mt-4 text-[clamp(2.25rem,10vw,2.75rem)] text-papel-50 lg:mt-5 lg:text-[clamp(2.5rem,3.4vw,3.25rem)]">
                  <span className="sr-only">{n.ariaLabel}</span>
                  <Numero valor={n.valor} atraso={i * 0.08} />
                </p>
                <Reveal as="p" delay={0.1 + i * 0.08} y={16} className="mt-2 text-[16px] leading-snug text-papel-300 lg:text-[17px]">
                  {n.rotulo}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
