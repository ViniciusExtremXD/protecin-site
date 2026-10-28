import { CLIENTES, SETORES } from "../../data/site";
import { Odometer, Reveal, Rule, SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { quebrar } from "./linhas";

/*
 * /nossos-clientes/: escala (design-final §10.3, compactada pela qa/AJUSTES-SOBRIEDADE.md). Sobretítulo, H2 e texto
 * literais de §2.4 à esquerda e o número "20.000+ / clientes atendidos" em odômetro à direita. Tom escuro, sem glow.
 * Nenhum cliente nomeado. Os setores (SetoresEmpilhados) vêm logo abaixo, no mesmo fundo: esta faixa é o topo deles.
 */

/** ClientesEscala (`#clientes-escala`). Sem props. */
export default function ClientesEscala() {
  const { numero, rotulo, ariaLabel } = CLIENTES.escala;
  const digitos = numero.replace(/\+$/, "");
  const sufixo = numero.slice(digitos.length);

  return (
    <section id="clientes-escala" data-section="clientes-escala" className="grain relative bg-noite-950 pb-12 pt-16 lg:pb-16 lg:pt-28">
      <Container className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div className="lg:col-span-7">
          <Reveal as="p" className="text-[17px] font-semibold leading-snug text-brasa-300">
            {SETORES.sobretitulo}
          </Reveal>
          <SplitLines
            as="h2"
            lines={{ desktop: SETORES.h2.linhas, celular: quebrar(SETORES.h2.texto, 3) }}
            text={SETORES.h2.texto}
            delay={0.06}
            className="display-xl mt-4 text-[2rem] text-papel-50 lg:mt-5 lg:text-[clamp(2.5rem,3.9vw,3.5rem)]"
          />
          <Reveal as="p" delay={0.12} className="corpo mt-6 text-papel-300 lg:mt-8">
            {SETORES.texto}
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Rule className="bg-papel-50/15" />
          <p data-motion="odometro" className="display-xxl stretch-62 mt-5 text-[clamp(4.5rem,22vw,5.5rem)] leading-[0.86] text-papel-50 lg:mt-6 lg:text-[clamp(5.5rem,7.8vw,7rem)]">
            <span className="sr-only">{ariaLabel}</span>
            <span aria-hidden className="inline-flex items-start">
              <Odometer value={digitos} />
              <Reveal as="span" preset="fade" delay={0.5} className="ml-[0.04em] inline-block text-brasa-400">
                {sufixo}
              </Reveal>
            </span>
          </p>
          <Reveal as="p" delay={0.3} y={16} className="corpo-l mt-3 text-papel-300 lg:mt-4">
            {rotulo}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
