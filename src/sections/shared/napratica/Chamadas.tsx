import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { NA_PRATICA, UI } from "../../../data/site";
import { IMAGENS } from "../../../data/imagens.gen";
import { DUR, EASE_OUT, Odometer, Reveal, ease } from "../../../components/motion";
import { Img } from "../../../components/ui/Img";

/*
 * Bloco dos cilindros (H4, depois da cena), compacto na rodada de sobriedade: a foto real na proporção nativa 16:9
 * ao lado do "250+" (antes o número ia por cima de uma foto de largura total). As 4 chamadas viraram pontos
 * numerados sobre a foto com a legenda em lista (sem fio desenhado nem rótulo sobre a imagem). Passar o mouse num
 * item da legenda destaca o ponto. A foto nunca leva nome de cliente nem de local.
 */
const DADOS = NA_PRATICA.cilindros;

function Ponto({ i, ativo, foco }: { i: number; ativo: boolean; foco: number | null }) {
  const c = DADOS.chamadas[i];
  const esmaecido = foco !== null && foco !== i;
  return (
    <span
      aria-hidden
      className="absolute z-[2] block h-0 w-0 transition-opacity duration-300 ease-out"
      style={{ left: `${c.x}%`, top: `${c.y}%`, opacity: esmaecido ? 0.45 : 1 }}
    >
      <motion.span
        className="absolute -left-[13px] -top-[13px] block h-[26px] w-[26px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={ativo ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: DUR.curta, ease: ease(EASE_OUT), delay: 0.25 + i * 0.08 }}
      >
        <span
          className="grid h-full w-full place-items-center rounded-full border-2 border-papel-50 bg-brasa-400 font-mono text-[12px] font-bold text-noite-950 shadow-[0_0_0_3px_rgba(5,10,18,0.4)] transition-transform duration-300 ease-out"
          style={{ transform: foco === i ? "scale(1.2)" : undefined }}
        >
          {i + 1}
        </span>
      </motion.span>
    </span>
  );
}

export function BlocoCilindros() {
  const caixa = useRef<HTMLDivElement>(null);
  const ativo = useInView(caixa, { once: true, amount: 0.4 });
  const [foco, setFoco] = useState<number | null>(null);
  const indices = DADOS.chamadas.map((_, i) => i);

  return (
    <div data-bloco="cilindros" className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:items-center lg:gap-x-6">
      {/* número, legenda das chamadas e crédito */}
      <div className="lg:order-2 lg:col-span-5 lg:pl-8 xl:col-span-6 xl:pl-16">
        {/* no celular o número e o rótulo dividem a linha */}
        <div className="flex items-center gap-5 lg:block">
          <Odometer value={DADOS.numero} className="display-xl stretch-66 shrink-0 text-[clamp(3.5rem,7vw,7rem)] text-papel-50" ariaLabel={`${DADOS.numero} ${DADOS.rotulo}`} />
          <Reveal as="p" y={16} className="corpo-l max-w-[26ch] text-papel-300 lg:mt-2">
            {DADOS.rotulo}
          </Reveal>
        </div>
        <Reveal as="ol" y={16} delay={0.08} className="mt-5 grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-1">
          {DADOS.chamadas.map((c, i) => (
            <li
              key={c.rotulo}
              className="flex items-center gap-3 text-[15px] leading-snug text-papel-300"
              onPointerEnter={(e) => e.pointerType === "mouse" && setFoco(i)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setFoco(null)}
            >
              <span aria-hidden className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-brasa-400 font-mono text-[11px] font-bold text-noite-950">
                {i + 1}
              </span>
              {c.rotulo}
            </li>
          ))}
        </Reveal>
      </div>

      {/* foto 16:9 com os pontos */}
      <Reveal as="figure" preset="fade" className="m-0 lg:order-1 lg:col-span-7 xl:col-span-6">
        <div>
          <div ref={caixa} className="relative aspect-[16/9] overflow-clip rounded-[14px] bg-noite-900 ring-1 ring-papel-50/10">
            <Img
              id={DADOS.imagem}
              alt={IMAGENS[DADOS.imagem].alt}
              sizes="(min-width: 1280px) 1000px, (min-width: 1024px) 90vw, 100vw"
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
            {indices.map((i) => (
              <Ponto key={i} i={i} ativo={ativo} foco={foco} />
            ))}
          </div>
        </div>
        <figcaption className="mt-3 text-[14px] leading-snug text-papel-500">
          {DADOS.legenda} {UI.fotoAcervo}.
        </figcaption>
      </Reveal>
    </div>
  );
}
