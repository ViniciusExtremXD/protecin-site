import { AUTORIZADAS, COMPROMISSO, FILIACOES, GRUPOS_MARCAS, MARCAS, SECOES, SELOS, type Marca } from "../../data/site";
import { DrawIcon, Reveal, RevealGroup, RevealItem, Rule, SectionRise, SplitLines, VelocityMarquee } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { LogoTile } from "../shared/marcas/LogoTile";

/*
 * H2. Credibilidade (design-final §9 H2), tom claro ("papel"). Autorizações oficiais, marcas com que trabalhamos e
 * filiações técnicas. Regra de honestidade §2: "AUTORIZADA" só junto de Kidde Brasil, Everlux, Notifier e Simplex;
 * os logos são de fabricantes e entidades, nunca de clientes.
 */

function Fita({ grupo, itens, velocidade }: { grupo: "autorizada" | "marca"; itens: Marca[]; velocidade: number }) {
  const g = GRUPOS_MARCAS[grupo];
  return (
    <div>
      <Container>
        <Reveal y={12} className="mb-3 flex items-center gap-3 lg:mb-4">
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${grupo === "autorizada" ? "bg-brasa-500" : "bg-marinho-700"}`} />
          <p className="rotulo text-grafite-600">{g.titulo}</p>
        </Reveal>
      </Container>
      {/* A fita inteira dispara a entrada ao entrar na tela (a variante desce pelas cópias): nenhum logo fica
          esperando entrar pela lateral para aparecer. */}
      <RevealGroup preset="virada" stagger={0.05}>
        <VelocityMarquee
          baseVelocity={velocidade}
          ariaLabel={g.aria}
          className="min-h-[72px] border-y border-noite-950/10 bg-papel-50 py-2 lg:min-h-[104px]"
          trackClassName="items-center"
        >
          {itens.map((m, i) => (
            <RevealItem key={m.id} as="span" index={i} className="flex items-center">
              <span className="flex items-center" data-marca={m.grupo}>
                <LogoTile marca={m} variante="fita" className="mx-5 lg:mx-9" />
                <span className="rotulo bg-papel-50 px-1 text-grafite-600">{g.rotulo}</span>
              </span>
            </RevealItem>
          ))}
        </VelocityMarquee>
      </RevealGroup>
    </div>
  );
}

/** H2 da home (`#autorizacoes`). Sem props. A página insere `<ReservedSlot id="clientes" />` logo depois. */
export default function Credibilidade() {
  const filiacao = GRUPOS_MARCAS.filiacao;
  return (
    <SectionRise id="autorizacoes" className="tom-claro bg-papel-50 text-noite-950">
      <div className="relative py-24 lg:py-40">
        <div
          aria-hidden
          className="bg-blueprint-claro pointer-events-none absolute inset-0 opacity-80 [-webkit-mask-image:radial-gradient(75%_65%_at_50%_45%,#000_25%,transparent_100%)] [mask-image:radial-gradient(75%_65%_at_50%_45%,#000_25%,transparent_100%)]"
        />

        <Container className="relative">
          <SectionLabel index={SECOES.credibilidade.index} label={SECOES.credibilidade.label} tone="claro" />
          <div className="mt-10 grid grid-cols-1 gap-y-12 lg:mt-14 lg:grid-cols-12 lg:gap-x-6">
            <div className="lg:col-span-7">
              <Reveal as="p" className="text-[17px] font-semibold leading-snug text-brasa-500 lg:text-[19px]">
                {COMPROMISSO.sobretitulo}
              </Reveal>
              <SplitLines as="h2" lines={COMPROMISSO.h2.linhas} text={COMPROMISSO.h2.texto} delay={0.08} className="display-xl mt-5 text-noite-950 lg:text-[clamp(2.75rem,4.6vw,5rem)]" />
            </div>
            <div className="lg:col-span-4 lg:col-start-9 lg:pt-2">
              <Reveal as="p" delay={0.15} className="corpo text-grafite-600">
                {COMPROMISSO.texto}
              </Reveal>
              <RevealGroup as="ul" preset="monta" stagger={0.06} className="mt-8 flex flex-col gap-3 lg:mt-10">
                {SELOS.map((s, i) => (
                  <RevealItem
                    key={s.texto}
                    as="li"
                    index={i}
                    className="group flex items-center gap-4 rounded-r-md border border-noite-950/10 bg-papel-100/80 px-5 py-4 transition-colors duration-300 hover:border-brasa-500/40"
                  >
                    <DrawIcon icon={s.icone} size={26} delay={0.15 + i * 0.06} redrawOnHover className="text-brasa-500" />
                    <span className="text-[16px] font-semibold leading-snug text-noite-950 lg:text-[17px]">{s.texto}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </Container>

        <div className="relative mt-20 flex flex-col gap-10 lg:mt-28 lg:gap-12">
          <Fita grupo="autorizada" itens={AUTORIZADAS} velocidade={-1.2} />
          <Fita grupo="marca" itens={MARCAS} velocidade={1.2} />
        </div>

        <Container className="relative mt-20 lg:mt-28">
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-6">
            <div className="lg:col-span-4">
              <Rule className="bg-noite-950/15" />
              <Reveal y={12} className="mt-5 flex items-center gap-3">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-marinho-700" />
                <h3 className="rotulo text-grafite-600">{filiacao.titulo}</h3>
              </Reveal>
              <Reveal as="p" delay={0.1} className="titulo mt-4 text-noite-950">
                {filiacao.legenda}
              </Reveal>
            </div>
            <RevealGroup as="ul" preset="virada" stagger={0.1} className="grid grid-cols-2 gap-4 lg:col-span-8 lg:gap-6">
              {FILIACOES.map((m, i) => (
                <RevealItem key={m.id} as="li" index={i}>
                  <LogoTile marca={m} parallax />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </div>
    </SectionRise>
  );
}
