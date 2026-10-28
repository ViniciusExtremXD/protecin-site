import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Check } from "lucide-react";
import { PLATAFORMA, type Modulo } from "../../data/site";
import { DrawIcon, DrawPath, PinStage, Reveal, RevealGroup, RevealItem, SplitLines, usePin, variantesPreset } from "../../components/motion";
import { DUR, EASE_OUT, ease } from "../../components/motion/tokens";
import { Container } from "../../components/layout/Container";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { ICONES } from "../../components/ui/icones";
import { useMotionPref } from "../../lib/motion-pref";

/*
 * Como funciona o Protecin App (§10.5): App de Coleta → Processador de Coleta Online → Web Master.
 * Desktop: cena fixada de 2,5 telas (corte do QA). O traço liga os três nós (1º trecho em p 0,1→0,4, 2º em
 * 0,45→0,75), três pacotes "COLETA" andam por ele e cada nó carimba quando o traço chega, abrindo a lista.
 * Celular, tela baixa, reduzido e sem JS: fluxo vertical sem fixação, com a linha ligada à rolagem.
 */
const C = PLATAFORMA.comoFunciona;
const MODULOS = PLATAFORMA.modulos;
/** Rótulo da seção na página do app (as páginas internas recomeçam em 01). */
const ROTULO = { index: "01", label: "Como funciona" } as const;

/** p em que cada nó carimba (o 1º logo no começo da cena; os outros quando o traço chega). */
const CHEGADA = [0.03, 0.4, 0.75] as const;
/** o 1º trecho do traço começa a desenhar em p 0,1 */
const INICIO_TRACO = 0.1;
const DEFASAGEM = 0.06;
/** O título literal em duas linhas ("Como funciona o" / "Protecin App"). */
const PALAVRAS = C.titulo.split(" ");
const LINHAS = [PALAVRAS.slice(0, 3).join(" "), PALAVRAS.slice(3).join(" ")];

export default function ComoFunciona() {
  return (
    <PinStage id="como-funciona" mode="pin" heightClassName="h-[250vh]" label={C.titulo} className="bg-marinho-900">
      <Conteudo />
    </PinStage>
  );
}

function Conteudo() {
  const { active } = usePin();
  return active ? <Fixada /> : <Fluxo />;
}

function Cabecalho() {
  return (
    <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-6">
      <div className="lg:col-span-8">
        <SectionLabel index={ROTULO.index} label={ROTULO.label} />
        <SplitLines as="h2" lines={LINHAS} text={C.titulo} className="display-xl mt-5 text-papel-50" />
      </div>
      <Reveal y={16} className="lg:col-span-4 lg:col-start-9">
        <p className="corpo-l text-papel-300">{C.frase}</p>
      </Reveal>
    </div>
  );
}

/** Nó da cena fixada: carimba (scale 1,35 → 1, rotate -8° → 0) quando o traço chega; antes, fica o contorno tracejado. */
function No({ modulo, chegou, tamanho = 72 }: { modulo: Modulo; chegou: boolean; tamanho?: number }) {
  const Icone = ICONES[modulo.icone];
  const v = variantesPreset("carimbo");
  return (
    <span className="relative block shrink-0" style={{ width: tamanho, height: tamanho }}>
      <span aria-hidden className="absolute inset-0 rounded-[18px] border border-dashed border-marinho-300/40" />
      <motion.span
        data-motion="carimbo"
        className="absolute inset-0 grid place-items-center rounded-[18px] border border-brasa-400/70 bg-marinho-800 text-brasa-300 shadow-[0_0_0_5px_rgba(232,68,46,0.1),0_20px_40px_-18px_rgba(0,0,0,0.8)]"
        initial={false}
        variants={v}
        animate={chegou ? "show" : "hidden"}
      >
        <Icone size={Math.round(tamanho * 0.44)} strokeWidth={1.5} aria-hidden />
      </motion.span>
    </span>
  );
}

/** Lista do módulo na cena fixada: entra com "sobe" (stagger 60 ms) e cada item desenha o Check. Não some depois. */
function Lista({ modulo, aberta }: { modulo: Modulo; aberta: boolean }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5 [@media(max-height:720px)]:mt-3 [@media(max-height:720px)]:gap-1.5">
      {modulo.itens.map((item, i) => (
        <motion.li
          key={item}
          data-motion="sobe"
          className="flex items-start gap-3 text-[16px] leading-snug text-papel-300 lg:text-[17px] [@media(max-height:720px)]:text-[15px]"
          initial={false}
          animate={aberta ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: DUR.base, ease: ease(EASE_OUT), delay: aberta ? 0.12 + i * 0.06 : 0 }}
        >
          <DrawIcon icon={Check} size={18} strokeWidth={2} drawn={aberta} delay={0.2 + i * 0.06} className="mt-[3px] text-brasa-300" />
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

function Titulo({ modulo }: { modulo: Modulo }) {
  return (
    <div className="mt-5 [@media(max-height:720px)]:mt-3">
      <h3 className="titulo text-papel-50">{modulo.nome}</h3>
      {modulo.uso && <p className="rotulo mt-1.5 text-papel-500">{modulo.uso}</p>}
    </div>
  );
}

// ================================================================ cena fixada (desktop)
function Fixada() {
  const { progress: p } = usePin();
  const linha = useRef<HTMLDivElement>(null);
  const nos = useRef<(HTMLSpanElement | null)[]>([]);
  const [geo, setGeo] = useState<{ y: number; x: number[]; w: number } | null>(null);
  const [chegou, setChegou] = useState([false, false, false]);

  useMotionValueEvent(p, "change", (v) => {
    const novo = CHEGADA.map((c) => v >= c);
    setChegou((a) => (a.every((x, i) => x === novo[i]) ? a : novo));
  });
  useEffect(() => setChegou(CHEGADA.map((c) => p.get() >= c)), [p]);

  // geometria dos nós (centros e bordas) para o traço e os pacotes
  useEffect(() => {
    const el = linha.current;
    if (!el) return;
    const medir = () => {
      const base = el.getBoundingClientRect();
      const r = nos.current.map((n) => n?.getBoundingClientRect());
      if (r.some((x) => !x)) return;
      const rs = r as DOMRect[];
      setGeo({ y: rs[0].top - base.top + rs[0].height / 2, x: rs.flatMap((x) => [x.left - base.left, x.right - base.left]), w: base.width });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative flex h-[100svh] flex-col overflow-clip">
      <div aria-hidden className="absolute inset-0 opacity-60">
        <div className="bg-blueprint h-full w-full" />
      </div>
      <Container className="relative flex h-full flex-col justify-center gap-[clamp(1.75rem,6svh,4.5rem)] pb-6 pt-[80px] [@media(min-height:760px)]:pt-[96px]">
        <Cabecalho />
        <div ref={linha} className="relative">
          {geo && <Traco p={p} geo={geo} />}
          <div className="relative grid grid-cols-3 gap-x-6">
            {MODULOS.map((m, i) => (
              <div key={m.id} className="relative z-[2]">
                <span
                  className="block w-fit"
                  ref={(n) => {
                    nos.current[i] = n;
                  }}
                >
                  <No modulo={m} chegou={chegou[i]} />
                </span>
                <Titulo modulo={m} />
                <Lista modulo={m} aberta={chegou[i]} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

/** Mapeia p para a posição da cabeça do traço ao longo da linha inteira (0–1), com a parada no nó do meio. */
function cabeca(v: number, sMeio: number): number {
  if (v <= INICIO_TRACO) return 0;
  if (v <= CHEGADA[1]) return ((v - INICIO_TRACO) / (CHEGADA[1] - INICIO_TRACO)) * sMeio;
  if (v <= 0.45) return sMeio;
  if (v <= CHEGADA[2]) return sMeio + ((v - 0.45) / (CHEGADA[2] - 0.45)) * (1 - sMeio);
  return 1;
}

function Traco({ p, geo }: { p: MotionValue<number>; geo: { y: number; x: number[]; w: number } }) {
  const [, d1, e2, d2, e3] = geo.x; // borda direita do nó 1, bordas do nó 2, borda esquerda do nó 3
  const inicio = d1;
  const fim = e3;
  const meio = (e2 + d2) / 2;
  const sMeio = (meio - inicio) / (fim - inicio);
  return (
    <>
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible text-marinho-300">
        <DrawPath d={`M${inicio + 10} ${geo.y} H${e2 - 10}`} progress={p} range={[0.1, 0.4]} dashed strokeWidth={1.5} />
        <DrawPath d={`M${d2 + 10} ${geo.y} H${fim - 10}`} progress={p} range={[0.45, 0.75]} dashed strokeWidth={1.5} />
      </svg>
      {[0, 1, 2].map((j) => (
        <Pacote key={j} p={p} j={j} inicio={inicio} fim={fim} y={geo.y} sMeio={sMeio} />
      ))}
    </>
  );
}

function Pacote({ p, j, inicio, fim, y, sMeio }: { p: MotionValue<number>; j: number; inicio: number; fim: number; y: number; sMeio: number }) {
  const s = useTransform(p, (v) => cabeca(v - j * DEFASAGEM, sMeio));
  const x = useTransform(s, (v) => inicio + (fim - inicio) * v);
  const opacity = useTransform(s, [0, 0.02, 0.97, 1], [0, 1, 1, 0]);
  return (
    <motion.span aria-hidden className="pointer-events-none absolute left-0 top-0 z-[1]" style={{ x, y, opacity }}>
      <span
        className="flex h-6 w-16 items-center justify-center rounded-[6px] bg-brasa-500 font-mono text-[11px] font-semibold tracking-[0.14em] text-white shadow-[0_10px_24px_-10px_rgba(190,30,41,0.9)]"
        style={{ translate: "-50% -50%" }}
      >
        {C.pacote}
      </span>
    </motion.span>
  );
}

// ================================================================ fluxo vertical (celular, reduzido, sem JS)
function Fluxo() {
  const reduced = useMotionPref() === "reduced";
  const lista = useRef<HTMLOListElement>(null);
  const ultimo = useRef<HTMLLIElement>(null);
  const [fimLinha, setFimLinha] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: lista, offset: ["start 75%", "end 60%"] });
  const escala = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pacoteY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const pacoteOp = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const el = lista.current;
    const u = ultimo.current;
    if (!el || !u) return;
    const medir = () => setFimLinha(el.offsetHeight - u.offsetTop - 28);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative overflow-clip py-24 lg:py-40">
      <div aria-hidden className="absolute inset-0 opacity-60">
        <div className="bg-blueprint h-full w-full" />
      </div>
      <Container className="relative">
        <Cabecalho />
        <ol ref={lista} className="relative mt-14 flex flex-col gap-12 lg:mt-20 lg:max-w-[52rem]">
          {/* linha vertical ligada à rolagem (no reduzido, já desenhada) */}
          <span aria-hidden className="absolute left-[27px] top-[28px] w-[2px] lg:left-[35px] lg:top-[36px]" style={{ bottom: fimLinha ?? 0 }}>
            <motion.span
              data-motion="traco"
              className="absolute inset-0 origin-top bg-[repeating-linear-gradient(180deg,#9DB8D0_0_4px,transparent_4px_7px)] opacity-70"
              style={{ scaleY: reduced ? 1 : escala }}
            />
            {!reduced && (
              <motion.span className="absolute inset-x-0 top-0 h-full" style={{ y: pacoteY, opacity: pacoteOp }}>
                <span
                  className="absolute left-1/2 top-0 flex h-6 w-16 items-center justify-center rounded-[6px] bg-brasa-500 font-mono text-[11px] font-semibold tracking-[0.14em] text-white shadow-[0_10px_24px_-10px_rgba(190,30,41,0.9)]"
                  style={{ translate: "-50% -50%" }}
                >
                  {C.pacote}
                </span>
              </motion.span>
            )}
          </span>
          {MODULOS.map((m, i) => (
            <li key={m.id} ref={i === MODULOS.length - 1 ? ultimo : undefined} className="relative grid grid-cols-[56px_1fr] gap-x-5 lg:grid-cols-[72px_1fr] lg:gap-x-8">
              <Reveal preset="carimbo" className="relative z-[1]">
                <NoFluxo modulo={m} />
              </Reveal>
              <div className="pt-1 lg:pt-2">
                <Reveal y={16}>
                  <h3 className="titulo text-papel-50">{m.nome}</h3>
                  {m.uso && <p className="rotulo mt-1.5 text-papel-500">{m.uso}</p>}
                </Reveal>
                <RevealGroup as="ul" stagger={0.06} className="mt-4 flex flex-col gap-2.5">
                  {m.itens.map((item, j) => (
                    <RevealItem as="li" key={item} className="flex items-start gap-3 text-[16px] leading-snug text-papel-300 lg:text-[17px]">
                      <DrawIcon icon={Check} size={18} strokeWidth={2} delay={0.15 + j * 0.06} className="mt-[3px] text-brasa-300" />
                      {item}
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}

function NoFluxo({ modulo }: { modulo: Modulo }) {
  const Icone = ICONES[modulo.icone];
  return (
    <span className="grid h-14 w-14 place-items-center rounded-[16px] border border-brasa-400/70 bg-marinho-800 text-brasa-300 shadow-[0_0_0_5px_rgba(232,68,46,0.1)] lg:h-[72px] lg:w-[72px] lg:rounded-[18px]">
      <Icone size={26} strokeWidth={1.5} aria-hidden className="lg:h-8 lg:w-8" />
    </span>
  );
}
