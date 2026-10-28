import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { DIAGRAMA } from "../../../data/site";
import { useMotionPref } from "../../../lib/motion-pref";
import { DrawPath, EASE_OUT, FocusBrackets, SPRING, ease } from "../../../components/motion";
import { BICOS, LAJES, PAREDES, PICTOS, TRACOS, VIEWBOX_CENA, VIEWBOX_COMPACTO, vb, type CorTraco, type Picto, type Traco } from "./iso";

/*
 * Desenho do diagrama (design-final §10.2.1). Só recebe estado: quanto cada camada já desenhou (MotionValue 0–1,
 * ligado à rolagem na cena ou ao tempo no fluxo normal), quais pictogramas estão de pé, quais camadas apagam a 35%
 * e o transform da câmera. Hover num pictograma: rótulo mono com o nome do item e cantoneiras de foco.
 */
const COR: Record<CorTraco, string> = {
  linha: "text-marinho-300",
  brasa: "text-brasa-400",
  fio: "text-marinho-300",
  papel: "text-papel-50",
  rota: "text-papel-50",
};

// larguras de traço multiplicadas por --k (mais grosso quando o desenho fica pequeno)
const LARGURA: Record<number, string> = {
  1: "[stroke-width:calc(1px*var(--k,1))]",
  1.25: "[stroke-width:calc(1.25px*var(--k,1))]",
  1.5: "[stroke-width:calc(1.5px*var(--k,1))]",
  2: "[stroke-width:calc(2px*var(--k,1))]",
  2.5: "[stroke-width:calc(2.5px*var(--k,1))]",
};

export interface IsoDiagramProps {
  /** recorte justo no prédio (fluxo normal) em vez do viewBox 1200×820 da cena */
  compacto?: boolean;
  /** progresso do desenho por camada: [estrutura, C-01..C-06] */
  tracos: MotionValue<number>[];
  /** pictogramas de pé por camada (índice 1..6; o 0 é ignorado) */
  pictos: boolean[];
  /** camadas apagadas a 35% (índice 1..6) */
  apagadas?: boolean[];
  /** atributo transform do grupo câmera */
  camera?: MotionValue<string>;
  /** ocupa a caixa do pai (a cena define a altura); sem isso a caixa segue a proporção do viewBox */
  preencher?: boolean;
  className?: string;
}

interface Foco {
  nome: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

function Pictograma({ p, visivel, indice }: { p: Picto; visivel: boolean; indice: number }) {
  const reduced = useMotionPref() === "reduced";
  const entrada = reduced
    ? { initial: false as const, animate: { scale: visivel ? 1 : 0, opacity: visivel ? 1 : 0 }, transition: { duration: 0 } }
    : {
        initial: { scale: 0, opacity: 0 },
        animate: visivel ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 },
        transition: visivel ? { type: "spring" as const, ...SPRING.encaixe, delay: indice * 0.04 } : { duration: 0.2 },
      };

  let forma: JSX.Element;
  switch (p.tipo) {
    case "extintor":
      forma = (
        <>
          <rect x={p.x - 8} y={p.y - 8} width={16} height={16} rx={2.5} fill="#E8442E" />
          <path
            d={`M ${p.x - 2.6} ${p.y - 3} h 5.2 v 8.2 a 1.4 1.4 0 0 1 -1.4 1.4 h -2.4 a 1.4 1.4 0 0 1 -1.4 -1.4 Z M ${p.x - 1} ${p.y - 3} v -2 h 2.6 l 1.6 -1.2`}
            fill="#F3EFE9"
            stroke="#F3EFE9"
            strokeWidth={1}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </>
      );
      break;
    case "abrigo":
      forma = (
        <>
          <path d={p.d} fill="#8F141B" stroke="#E8442E" strokeWidth={1.5} strokeLinejoin="round" />
          <ellipse cx={p.x} cy={p.y - 6} rx={5.5} ry={6.2} fill="#050A12" stroke="#E8442E" strokeWidth={1} />
        </>
      );
      break;
    case "detector":
      forma = (
        <>
          <circle cx={p.x} cy={p.y} r={6.5} fill="none" stroke="#9DB8D0" strokeWidth={1} opacity={0.7} />
          <circle cx={p.x} cy={p.y} r={3.2} fill="#F3EFE9" />
        </>
      );
      break;
    case "acionador":
      forma = (
        <>
          <rect x={p.x - 5} y={p.y - 5} width={10} height={10} rx={1.5} fill="#E8442E" />
          <circle cx={p.x} cy={p.y} r={1.8} fill="#F3EFE9" />
        </>
      );
      break;
    case "painel":
      forma = (
        <>
          <path d={p.d} fill="#09111C" stroke="#9DB8D0" strokeWidth={1.5} strokeLinejoin="round" />
          <circle cx={p.x + 4} cy={p.y - 4} r={2.2} fill="#FF6A4D" />
          <path d={`M ${p.x - 8} ${p.y - 6} l 7 4 M ${p.x - 8} ${p.y - 1} l 7 4`} stroke="#9DB8D0" strokeWidth={1} strokeLinecap="round" />
        </>
      );
      break;
    case "cilindro":
      forma = (
        <>
          <path d={p.extra} stroke="#E8442E" strokeWidth={9} strokeLinecap="round" fill="none" />
          <path d={p.extra} stroke="#FFB199" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.55} transform="translate(-2 0)" />
        </>
      );
      break;
    case "porta":
      forma = (
        <>
          <path d={p.extra} fill="none" stroke="#F3EFE9" strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
          <path d={p.d} fill="rgba(243,239,233,0.14)" stroke="#F3EFE9" strokeWidth={1.5} strokeLinejoin="round" />
        </>
      );
      break;
    case "placa":
      forma = (
        <g style={{ filter: visivel ? "drop-shadow(0 0 6px #D8F36A)" : "none", transition: "filter 400ms cubic-bezier(0.16,1,0.3,1)" }}>
          <path d={p.d} fill="#D8F36A" stroke="#D8F36A" strokeWidth={1} strokeLinejoin="round" />
          <path d={`M ${p.x - 5} ${p.y + 1} l 6 3.4 m -2.2 -3.6 l 2.2 3.6 l -1 2.4`} stroke="#050A12" strokeWidth={1.2} fill="none" strokeLinecap="round" />
        </g>
      );
      break;
  }

  return (
    // invólucro sem framer: escala dos pictogramas no recorte compacto (--kp), em volta do próprio centro
    <g className="[scale:var(--kp,1)] [transform-box:fill-box] [transform-origin:center]">
      <motion.g {...entrada}>{forma}</motion.g>
      {/* 1 pulso por detector: o anel só existe com a camada acesa, então montar = acender */}
      {p.tipo === "detector" && visivel && !reduced && (
        <motion.circle
          cx={p.x}
          cy={p.y}
          r={4}
          fill="none"
          stroke="#FF6A4D"
          strokeWidth={1.5}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.9, ease: ease(EASE_OUT), delay: 0.15 + indice * 0.04 }}
        />
      )}
    </g>
  );
}

function TracoDesenhado({ t, progresso }: { t: Traco; progresso: MotionValue<number> }) {
  return <DrawPath d={t.d} progress={progresso} range={[0, 1]} strokeWidth={t.largura} dashed={t.tracejado} className={`${COR[t.cor]} ${LARGURA[t.largura] ?? ""}`} />;
}

/** Com pathLength 0 a ponta redonda ainda pinta um ponto: o grupo só aparece quando o traço começa. */
function GrupoTracos({ progresso, children }: { progresso: MotionValue<number>; children: ReactNode }) {
  const opacity = useTransform(progresso, [0, 0.015], [0, 1]);
  return <motion.g style={{ opacity }}>{children}</motion.g>;
}

export function IsoDiagram({ compacto = false, tracos, pictos, apagadas = [], camera, preencher = false, className }: IsoDiagramProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const caixa = useRef<HTMLDivElement>(null);
  const grupo = useRef<SVGGElement>(null);
  const [foco, setFoco] = useState<Foco | null>(null);
  const estrutura = tracos[0];
  const preenchimento = useTransform(estrutura, [0.3, 1], [0, 1]);
  const v = compacto ? VIEWBOX_COMPACTO : VIEWBOX_CENA;

  // câmera: escreve o atributo transform direto no <g> (sem re-render por quadro)
  useEffect(() => {
    if (!camera) return;
    const g = grupo.current;
    if (!g) return;
    const aplicar = (tr: string) => g.setAttribute("transform", tr);
    aplicar(camera.get());
    return camera.on("change", aplicar);
  }, [camera]);

  const entrar = (p: Picto) => (e: ReactPointerEvent<SVGGElement>) => {
    if (e.pointerType !== "mouse" || !pictos[p.camada] || !caixa.current) return;
    const a = caixa.current.getBoundingClientRect();
    const b = e.currentTarget.getBoundingClientRect();
    const nome = DIAGRAMA.camadas[p.camada - 1].itens[p.item];
    setFoco({ nome, x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height });
  };
  const sair = () => setFoco(null);

  const porCamada = (c: number) => TRACOS.filter((t) => t.camada === c && (!compacto || !t.detalhe));
  const pictosDe = (c: number) => PICTOS.filter((p) => p.camada === c);

  const desc = DIAGRAMA.camadas.map((c) => `${c.codigo} ${c.nome}: ${c.textos.join(" ")}`).join(" ");

  return (
    <div
      ref={caixa}
      className={`relative ${compacto ? "[--k:1.9] [--kp:1.5] md:[--k:1.35] md:[--kp:1.2] lg:[--k:1.1] lg:[--kp:1.05]" : ""} ${className ?? ""}`}
      style={preencher ? undefined : ({ aspectRatio: `${v.w} / ${v.h}` } as CSSProperties)}
    >
      <svg
        viewBox={vb(v)}
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        className="absolute inset-0 block h-full w-full overflow-visible"
      >
        <title id={`${id}-t`}>{DIAGRAMA.svgTitulo}</title>
        <desc id={`${id}-d`}>{desc}</desc>
        <g ref={grupo}>
          {/* estrutura: paredes do fundo e lajes (preenchimento entra junto com o traço) */}
          <motion.g style={{ opacity: preenchimento }}>
            <path d={PAREDES.fundoX} fill="rgba(10,39,65,0.45)" />
            <path d={PAREDES.fundoY} fill="rgba(7,26,43,0.55)" />
            {LAJES.map((d, i) => (
              <path key={i} d={d} fill="rgba(7,26,43,0.6)" />
            ))}
          </motion.g>
          <GrupoTracos progresso={estrutura}>
            {porCamada(0).map((t, i) => (
              <TracoDesenhado key={i} t={t} progresso={estrutura} />
            ))}
          </GrupoTracos>

          {[1, 2, 3, 4, 5, 6].map((c) => (
            <g
              key={c}
              data-camada={c}
              className="transition-opacity duration-[400ms] ease-out"
              style={{ opacity: apagadas[c] ? 0.35 : 1 }}
            >
              <GrupoTracos progresso={tracos[c]}>
                {porCamada(c).map((t, i) => (
                  <TracoDesenhado key={i} t={t} progresso={tracos[c]} />
                ))}
                {c === 4 && !compacto && (
                  <DrawPath
                    d={BICOS.map(([x, y]) => `M ${x} ${y} l 0 4`).join(" ")}
                    progress={tracos[4]}
                    range={[0.4, 1]}
                    strokeWidth={1.25}
                    className="text-brasa-300"
                  />
                )}
              </GrupoTracos>
              {pictosDe(c).map((p, j) => (
                <g key={p.id} onPointerEnter={entrar(p)} onPointerLeave={sair} className={pictos[c] ? "cursor-default" : "pointer-events-none"}>
                  <Pictograma p={p} visivel={!!pictos[c]} indice={j} />
                </g>
              ))}
            </g>
          ))}
        </g>
      </svg>

      {foco && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-[2]"
          style={{ left: foco.x - 6, top: foco.y - 6, width: foco.w + 12, height: foco.h + 12 }}
        >
          <FocusBrackets mode="enter" size={20} offset={8} key={`${foco.nome}-${foco.x}-${foco.y}`} />
          <span
            className="rotulo absolute bottom-full left-1/2 mb-3 whitespace-nowrap rounded-[6px] border border-marinho-300/30 bg-noite-950/90 px-2.5 py-1.5 text-papel-50"
            style={{ translate: "-50% 0" }}
          >
            {foco.nome}
          </span>
        </div>
      )}
    </div>
  );
}
