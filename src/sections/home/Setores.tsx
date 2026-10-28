import { useEffect, useId, useState } from "react";
import { Plus } from "lucide-react";
import { SECOES, SETORES, UI, type Setor } from "../../data/site";
import { Reveal, RevealGroup, RevealItem, SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { GhostCta } from "../../components/ui/cta";
import { IMAGENS } from "../../data/imagens.gen";
import { Img } from "../../components/ui/Img";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { useIsDesktop } from "../../lib/media";
import { pushEvent } from "../../lib/track";
import { quebrar } from "../clientes/linhas";

/*
 * H8. Setores (design-final §9 H8, compactada pela qa/AJUSTES-SOBRIEDADE.md), tom escuro.
 * Desktop: H2 e texto à esquerda; à direita, os 3 setores em linhas (miniatura 3:2, nome e o texto literal).
 * Celular: a mesma lista, com o texto de cada setor num acordeão (<h3><button aria-expanded>) para a seção não
 * passar de uma tela e meia. O texto fica sempre no DOM; o recolhimento só vale no celular e com o motor no ar
 * (html.motion-up): sem JS, tudo aberto. Sem nomes gigantes, sem prévia que segue o ponteiro.
 */

const MINI = { desktop: 160, celular: 96 } as const; // largura da miniatura 3:2, em px (o Img soma o recorte e a densidade)
// Foto recortada (PNG com fundo transparente): zoom leve a partir da esquerda esconde o canto recortado em diagonal.
const RECORTE = 1.12;
// Nome do setor: o mesmo tamanho no HTML pré-renderizado (botão) e no desktop hidratado (texto), sem salto.
const NOME = "block font-semibold leading-snug text-[19px] lg:text-[clamp(1.375rem,1.8vw,1.75rem)] lg:leading-[1.2]";

function Linha({ setor, desktop, aberto, alternar }: { setor: Setor; desktop: boolean; aberto: boolean; alternar: () => void }) {
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const id = useId();
  const painel = `${id}-painel`;
  const botao = `${id}-botao`;
  const recolhido = !desktop && !aberto;

  return (
    <div className="grid grid-cols-[6rem_1fr] items-center gap-x-4 border-t border-papel-50/10 py-4 lg:grid-cols-[10rem_1fr] lg:items-start lg:gap-x-6 lg:py-6">
      <div className="relative aspect-[3/2] overflow-clip rounded-lg bg-noite-900 lg:row-span-2">
        <Img
          id={setor.imagem}
          alt=""
          sizes={`(min-width: 1024px) ${MINI.desktop}px, ${MINI.celular}px`}
          frame={3 / 2}
          zoom={IMAGENS[setor.imagem].alpha ? RECORTE : 1}
          className="block h-full w-full"
          imgClassName={`h-full w-full object-cover ${IMAGENS[setor.imagem].alpha ? "origin-[0%_35%] scale-[1.12]" : ""}`}
        />
      </div>

      <h3 className="min-w-0">
        {desktop ? (
          <span className={`${NOME} text-papel-50`}>{setor.nome}</span>
        ) : (
          <button
            id={botao}
            type="button"
            aria-expanded={aberto}
            aria-controls={painel}
            onClick={alternar}
            className="group flex min-h-16 w-full items-center justify-between gap-3 text-left lg:min-h-0"
          >
            <span className={`${NOME} transition-colors duration-200 ${aberto ? "text-brasa-300" : "text-papel-50"}`}>{setor.nome}</span>
            <span
              aria-hidden
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border lg:hidden transition-[transform,border-color] duration-300 ease-out ${
                aberto ? "rotate-45 border-brasa-400 text-brasa-300" : "border-papel-50/25 text-papel-50"
              }`}
            >
              <Plus size={18} strokeWidth={1.5} />
            </span>
          </button>
        )}
      </h3>

      <div
        id={painel}
        role={desktop ? undefined : "region"}
        aria-labelledby={desktop ? undefined : botao}
        aria-hidden={montado && recolhido ? true : undefined}
        className={`col-span-2 grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out lg:col-span-1 lg:col-start-2 lg:!grid-rows-[1fr] ${recolhido ? "[.motion-up_&]:grid-rows-[0fr]" : ""}`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="corpo pb-1 pt-3 text-papel-300 lg:pt-2">{setor.texto}</p>
        </div>
      </div>
    </div>
  );
}

/** H8 da home (`#setores`). Sem props. */
export default function Setores() {
  const desktop = useIsDesktop();
  const [aberto, setAberto] = useState<Setor["id"] | null>(null);

  const alternar = (s: Setor) => {
    const abrir = aberto !== s.id;
    if (abrir) pushEvent("sector_open", { setor: s.id });
    setAberto(abrir ? s.id : null);
  };

  return (
    <section id="setores" data-section="H8" className="grain relative bg-noite-950 py-16 lg:py-24">
      <Container>
        <SectionLabel index={SECOES.setores.index} label={SECOES.setores.label} />

        <div className="mt-8 grid grid-cols-1 gap-y-10 lg:mt-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:gap-y-10">
          <div className="lg:col-span-5">
            <SplitLines
              as="h2"
              lines={quebrar(SETORES.h2.texto, 3)}
              text={SETORES.h2.texto}
              className="display-xl text-[2rem] text-papel-50 lg:text-[clamp(2.5rem,3.9vw,3.5rem)]"
            />
            <Reveal as="p" delay={0.1} className="corpo mt-6 text-papel-300 lg:mt-8 lg:max-w-[42ch]">
              {SETORES.texto}
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <RevealGroup as="ul" stagger={0.08} className="border-b border-papel-50/10">
              {SETORES.itens.map((s, i) => (
                <RevealItem key={s.id} as="li" index={i}>
                  <Linha setor={s} desktop={desktop} aberto={aberto === s.id} alternar={() => alternar(s)} />
                </RevealItem>
              ))}
            </RevealGroup>
            <p className="rotulo mt-4 text-papel-500">{UI.imagemIlustrativa}</p>
          </div>

          <Reveal className="lg:col-span-5 lg:row-start-2">
            <GhostCta to={SETORES.link.to}>{SETORES.link.label}</GhostCta>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
