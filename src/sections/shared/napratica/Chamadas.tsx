import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { NA_PRATICA, UI } from "../../../data/site";
import { IMAGENS } from "../../../data/imagens.gen";
import { useMotionPref } from "../../../lib/motion-pref";
import { ClipReveal, DUR, EASE_IN_OUT, EASE_OUT, Odometer, ParallaxMedia, Reveal, SPRING, ease } from "../../../components/motion";
import { Img } from "../../../components/ui/Img";

/*
 * Bloco dos cilindros (H4, depois da cena): foto real na proporção nativa 16:9, "250+" por cima e as chamadas
 * desenhadas (enxerto D2). Desktop (≥ 1024): ponto + fio em 2 segmentos + rótulo mono. Abaixo disso: pontos
 * numerados sobre a foto e a legenda das chamadas em lista. A foto nunca leva nome de cliente nem de local.
 */
const DADOS = NA_PRATICA.cilindros;

/** Onde cada rótulo pousa (% da foto) e para que lado ele corre a partir do cotovelo. Ordem de DADOS.chamadas. */
// O ParallaxMedia escala a camada em 1,12: rótulos ficam entre ~8% e ~88% da largura para não serem cortados.
const POUSO: { ex: number; ey: number; lado: "esq" | "dir" }[] = [
  { ex: 66, ey: 88, lado: "esq" }, // Cilindros numerados (72,5; 80)
  { ex: 58, ey: 71, lado: "dir" }, // Válvulas com manômetro (51; 57)
  { ex: 52, ey: 15, lado: "dir" }, // Coletor e tubulação (45; 29)
  { ex: 35, ey: 36, lado: "dir" }, // Mangueiras de conexão (27; 42)
];
const STUB = 2.6; // segundo segmento do fio, em % da largura
const PASSO = 0.18; // stagger entre chamadas (s)

/** Fio da chamada: polilinha de 2 segmentos (diagonal até o cotovelo + trecho reto até o rótulo). */
function Fio({ i, ativo, foco }: { i: number; ativo: boolean; foco: number | null }) {
  const reduced = useMotionPref() === "reduced";
  const c = DADOS.chamadas[i];
  const pouso = POUSO[i];
  const sinal = pouso.lado === "dir" ? 1 : -1;
  const fimX = pouso.ex + sinal * STUB;
  const mostrar = ativo || reduced;
  const atraso = reduced ? 0 : i * PASSO;
  const esmaecida = foco !== null && foco !== i;
  const emFoco = foco === i;

  return (
    <g
      className="transition-opacity duration-[350ms] ease-out"
      style={{ opacity: esmaecida ? 0.5 : 1 }}
      data-chamada={i}
    >
      <motion.polyline
        points={`${c.x * 16},${c.y * 9} ${pouso.ex * 16},${pouso.ey * 9} ${fimX * 16},${pouso.ey * 9}`}
        fill="none"
        stroke={emFoco ? "#E8442E" : "rgba(243,239,233,0.85)"}
        strokeWidth={emFoco ? 2.4 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={mostrar ? { pathLength: 1 } : undefined}
        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: ease(EASE_IN_OUT), delay: atraso + 0.12 }}
        style={{ transition: "stroke 350ms cubic-bezier(0.16,1,0.3,1), stroke-width 350ms cubic-bezier(0.16,1,0.3,1)" }}
      />
    </g>
  );
}

function PontoChamada({ i, ativo, foco }: { i: number; ativo: boolean; foco: number | null }) {
  const reduced = useMotionPref() === "reduced";
  const c = DADOS.chamadas[i];
  const mostrar = ativo || reduced;
  const atraso = reduced ? 0 : i * PASSO;
  const esmaecida = foco !== null && foco !== i;
  return (
    // hover (esmaecer e crescer) por CSS no invólucro; a entrada (carimbo + 1 pulso) por framer no miolo
    <span
      aria-hidden
      className="pointer-events-none absolute z-[2] block h-0 w-0 transition-opacity duration-[350ms] ease-out"
      style={{ left: `${c.x}%`, top: `${c.y}%`, opacity: esmaecida ? 0.5 : 1 }}
    >
      <span
        className="absolute -left-[7px] -top-[7px] block h-[14px] w-[14px] transition-transform duration-[350ms] ease-out"
        style={{ transform: foco === i ? "scale(1.4)" : undefined }}
      >
        {mostrar && !reduced && (
          <motion.span
            className="absolute inset-0 block rounded-full border border-brasa-300"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
            transition={{ duration: 0.9, ease: ease(EASE_OUT), delay: atraso + 0.1 }}
          />
        )}
        <motion.span
          className="absolute inset-0 block rounded-full border-2 border-papel-50 bg-brasa-400 shadow-[0_0_0_3px_rgba(5,10,18,0.45)]"
          initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 1.35, rotate: reduced ? 0 : -8 }}
          animate={mostrar ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
          transition={reduced ? { duration: 0 } : { type: "spring", ...SPRING.encaixe, delay: atraso }}
        />
      </span>
    </span>
  );
}

function ChamadaRotulo({ i, ativo, foco, setFoco }: { i: number; ativo: boolean; foco: number | null; setFoco: (n: number | null) => void }) {
  const reduced = useMotionPref() === "reduced";
  const c = DADOS.chamadas[i];
  const pouso = POUSO[i];
  const dir = pouso.lado === "dir";
  const fimX = pouso.ex + (dir ? STUB : -STUB);
  const mostrar = ativo || reduced;
  // o rótulo entra enquanto o fio termina de desenhar: o último começa em 0,84 s (régua: nada escondido > 1 s)
  const atraso = reduced ? 0 : i * PASSO + 0.3;
  const esmaecida = foco !== null && foco !== i;
  return (
    <span
      className="absolute z-[3] block h-0 w-0 transition-opacity duration-[350ms] ease-out"
      style={{ left: `${fimX}%`, top: `${pouso.ey}%`, opacity: esmaecida ? 0.5 : 1 }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setFoco(i)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setFoco(null)}
    >
      <motion.span
        className={`rotulo absolute top-0 block whitespace-nowrap rounded-[6px] border px-2.5 py-1.5 text-papel-50 transition-[border-color,background-color] duration-[350ms] ease-out ${
          dir ? "left-1.5" : "right-1.5"
        } ${foco === i ? "border-brasa-400 bg-noite-950/90" : "border-papel-50/15 bg-noite-950/80"}`}
        style={{ translate: "0 -50%" }}
        initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : dir ? -8 : 8 }}
        animate={mostrar ? { opacity: 1, x: 0 } : undefined}
        transition={reduced ? { duration: 0 } : { duration: DUR.curta, ease: ease(EASE_OUT), delay: atraso }}
      >
        {c.rotulo}
      </motion.span>
    </span>
  );
}

/** Ponto numerado (celular e tablet): sem fio nem rótulo sobre a foto; a legenda vai em lista abaixo. */
function PontoNumerado({ i, ativo }: { i: number; ativo: boolean }) {
  const reduced = useMotionPref() === "reduced";
  const c = DADOS.chamadas[i];
  const mostrar = ativo || reduced;
  return (
    <span aria-hidden className="absolute z-[2] block h-0 w-0" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
      <motion.span
        className="absolute -left-[13px] -top-[13px] grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-papel-50 bg-brasa-400 font-mono text-[12px] font-bold text-noite-950 shadow-[0_0_0_3px_rgba(5,10,18,0.45)]"
        initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 1.35, rotate: reduced ? 0 : -8 }}
        animate={mostrar ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
        transition={reduced ? { duration: 0 } : { type: "spring", ...SPRING.encaixe, delay: i * PASSO }}
      >
        {i + 1}
      </motion.span>
    </span>
  );
}

export function BlocoCilindros() {
  const caixa = useRef<HTMLDivElement>(null);
  const ativo = useInView(caixa, { once: true, amount: 0.4 });
  const [foco, setFoco] = useState<number | null>(null);
  const alt = IMAGENS[DADOS.imagem].alt;
  const ponto = foco !== null ? DADOS.chamadas[foco] : null;
  const indices = DADOS.chamadas.map((_, i) => i);

  const numero = (
    <Odometer value={DADOS.numero} className="display-xl stretch-66 text-papel-50" ariaLabel={`${DADOS.numero} ${DADOS.rotulo}`} />
  );

  return (
    <div data-bloco="cilindros">
      {/* celular: o número vem antes da foto (sobre a foto ele ficaria ilegível em 350 px) */}
      <div className="mb-8 flex flex-col gap-3 md:hidden">
        {numero}
        <Reveal as="p" y={12} className="corpo-l max-w-[24ch] text-papel-300">
          {DADOS.rotulo}
        </Reveal>
      </div>

      <figure>
        <div ref={caixa} className="relative aspect-[16/9]">
          <ClipReveal radius={28} className="absolute inset-0 overflow-clip">
            <ParallaxMedia amount={6}>
              <div className="relative h-full w-full">
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: ponto ? 1.04 : 1 }}
                  transition={{ duration: DUR.longa, ease: ease(EASE_OUT) }}
                  style={{ transformOrigin: ponto ? `${ponto.x}% ${ponto.y}%` : "50% 50%" }}
                >
                  <Img
                    id={DADOS.imagem}
                    alt={alt}
                    sizes="(min-width: 1440px) 1312px, (min-width: 1024px) 92vw, 100vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover [filter:contrast(1.06)_saturate(0.94)]"
                  />
                </motion.div>

                {/* chamadas desenhadas (desktop) */}
                <div className="absolute inset-0 hidden lg:block">
                  <svg viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible">
                    {indices.map((i) => (
                      <Fio key={i} i={i} ativo={ativo} foco={foco} />
                    ))}
                  </svg>
                  {indices.map((i) => (
                    <PontoChamada key={i} i={i} ativo={ativo} foco={foco} />
                  ))}
                  {indices.map((i) => (
                    <ChamadaRotulo key={i} i={i} ativo={ativo} foco={foco} setFoco={setFoco} />
                  ))}
                </div>

                {/* pontos numerados (celular e tablet) */}
                <div className="absolute inset-0 lg:hidden">
                  {indices.map((i) => (
                    <PontoNumerado key={i} i={i} ativo={ativo} />
                  ))}
                </div>
              </div>
            </ParallaxMedia>
            {/* véu para o número por cima da foto (≥ 768) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_top,rgba(5,10,18,0.88)_0%,rgba(5,10,18,0)_52%),linear-gradient(to_right,rgba(5,10,18,0.55)_0%,rgba(5,10,18,0)_46%)] md:block"
            />
          </ClipReveal>

          {/* "250+" por cima da foto (≥ 768) */}
          <div className="pointer-events-none absolute bottom-0 left-0 z-[4] hidden flex-col gap-3 p-8 md:flex lg:p-12">
            {numero}
            <Reveal as="p" y={12} delay={0.15} className="corpo-l max-w-[22ch] text-papel-50">
              {DADOS.rotulo}
            </Reveal>
          </div>
        </div>

        <figcaption>
          <Reveal y={12} className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-baseline lg:justify-between">
          <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-papel-500">
            <span className="text-[15px] leading-snug text-papel-300">{DADOS.legenda}</span>
            <span className="rotulo">{UI.fotoAcervo.toUpperCase()}</span>
          </span>
          {/* legenda das chamadas: a lista é o texto das chamadas abaixo de 1024 px */}
          <ol className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:hidden">
            {DADOS.chamadas.map((c, i) => (
              <li key={c.rotulo} className="rotulo flex items-center gap-3 text-papel-300">
                <span aria-hidden className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-brasa-400 font-mono text-[11px] font-bold tracking-normal text-noite-950">
                  {i + 1}
                </span>
                {c.rotulo}
              </li>
            ))}
          </ol>
          </Reveal>
        </figcaption>
      </figure>
    </div>
  );
}
