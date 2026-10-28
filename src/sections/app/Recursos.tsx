import { PLATAFORMA } from "../../data/site";
import { Reveal, RevealGroup, RevealItem, SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { ICONES } from "../../components/ui/icones";

/*
 * Recursos que fazem a diferença (§10.5), na rodada de sobriedade (qa/AJUSTES-SOBRIEDADE.md): os 8 recursos
 * literais de §1.7 viram uma ficha técnica em duas colunas, com ícone e nome e um fio entre as linhas (sem
 * ladrilhos, sem contador "R-01", sem brilho nem cantoneiras). Entram em cascata quando a lista aparece.
 */
const R = PLATAFORMA.recursos;
const ROTULO = { index: "03", label: "Recursos" } as const;
const H2 = "display-xl text-[clamp(2.25rem,4.4vw,4rem)] text-papel-50";
/** O título literal em duas linhas ("Recursos que" / "fazem a diferença"), que cabem na coluna de 5. */
const PALAVRAS = R.titulo.split(" ");
const LINHAS = [PALAVRAS.slice(0, 2).join(" "), PALAVRAS.slice(2).join(" ")];

export default function Recursos() {
  return (
    <section id="recursos" data-section="APP-RECURSOS" aria-label={R.titulo} className="grain relative bg-noite-950 py-16 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-5">
            <SectionLabel index={ROTULO.index} label={ROTULO.label} />
            <SplitLines as="h2" lines={LINHAS} text={R.titulo} className={`${H2} mt-5`} />
            <Reveal as="p" y={16} delay={0.1} className="corpo-l mt-5 max-w-[34ch] text-papel-300">
              {R.subtitulo}
            </Reveal>
          </div>

          <RevealGroup as="ul" y={16} stagger={0.05} className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:col-span-7 lg:self-end">
            {R.itens.map((item) => {
              const Icone = ICONES[item.icone];
              return (
                <RevealItem as="li" key={item.nome} className="flex items-center gap-4 border-b border-noite-700 py-4 lg:py-5">
                  <Icone aria-hidden size={22} strokeWidth={1.5} className="shrink-0 text-brasa-300" />
                  <span className="text-[17px] font-medium leading-snug text-papel-50">{item.nome}</span>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
