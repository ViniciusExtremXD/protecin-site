import { useEffect, useState, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { Bell, FileCheck2, FileText, Mail, MapPin, RefreshCw, ScanLine, Search, WifiOff } from "lucide-react";
import { PLATAFORMA } from "../../../data/site";
import { Odometer, Reel, variantesPreset } from "../../../components/motion";
import { EASE_OUT, ease } from "../../../components/motion/tokens";
import { Img } from "../../../components/ui/Img";
import { PHONE } from "./PhoneMock";

/*
 * As 4 telas do PhoneMock (§9 H5), recriadas em HTML só com rótulos que existem nas telas reais (§1.7).
 * Dados de cliente viram barras borradas. Medidas de projeto: 280 × 600 px (a tela do PhoneMock).
 */
const T = PLATAFORMA.telas;
const R = T.rotulosOrdem;

/** Barra borrada no lugar de um dado de cliente. */
function Borrado({ w, className }: { w: number; className?: string }) {
  return <span className={`block h-[9px] rounded-full bg-marinho-700/25 blur-[1.5px] ${className ?? ""}`} style={{ width: w }} />;
}

/** Cabeçalho marinho-700 com o wordmark negativo e os ícones de busca, leitor de código e notificações. */
export function Cabecalho() {
  return (
    <div className="bg-marinho-700 px-4 pb-3 pt-[46px] text-papel-50">
      <div className="flex items-center justify-between">
        <Img id="protecin-wordmark-negativo" alt="" sizes="92px" className="w-[92px]" imgClassName="h-auto w-full" />
        <div className="flex items-center gap-3 text-papel-50/90">
          <Search size={16} strokeWidth={1.75} />
          <ScanLine size={16} strokeWidth={1.75} />
          <span className="relative">
            <Bell size={16} strokeWidth={1.75} />
            <span className="absolute -right-0.5 -top-0.5 h-[6px] w-[6px] rounded-full bg-brasa-400" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- 1. splash (imagem real, recortada na tela)
/**
 * A captura real (app-splash) já vem com o aparelho em volta: a tela azul ocupa x 83–636 e y 36–1243 do
 * arquivo de 720 × 1280. Escala de 280/554 e deslocamento para a tela casar com a do PhoneMock.
 */
export function TelaSplash() {
  return (
    <div className="relative h-full w-full overflow-clip bg-marinho-700">
      <Img id="app-splash" alt="" sizes="(min-width: 1024px) 600px, 240px" className="absolute left-[-42px] top-[-18px] block w-[364px]" imgClassName="block h-auto w-full" />
    </div>
  );
}

// ---------------------------------------------------------------- 2. ordens de serviço
function Cartao({ andamento, barra, children }: { andamento: ReactNode; barra: ReactNode; children?: ReactNode }) {
  return (
    <div className="rounded-[14px] bg-white p-3 shadow-[0_1px_2px_rgba(5,10,18,0.08)] ring-1 ring-noite-950/[0.06]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-semibold text-marinho-700">{R.numero}</span>
        <Borrado w={58} />
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="text-[12px] text-grafite-600">{R.cliente}</span>
        <Borrado w={104} />
      </div>
      <p className="mt-2 flex items-center gap-1 text-[13px] leading-none text-grafite-600">
        <MapPin size={13} strokeWidth={1.75} className="shrink-0 text-brasa-500" />
        {R.localizacao}
        <span aria-hidden className="text-grafite-600/50">
          ·
        </span>
        <span className="font-semibold text-brasa-500 underline decoration-brasa-500/40 underline-offset-2">{R.verMapa}</span>
      </p>
      <p className="mt-2 text-[13px] leading-[1.3] text-noite-950">{R.quantidades}</p>
      <div className="mt-2 flex items-center justify-between gap-2 text-[13px] leading-none">
        <span className="text-grafite-600">{R.andamento}:</span>
        <span className="font-semibold text-marinho-700">{andamento}</span>
      </div>
      <div className="mt-2 h-[6px] overflow-clip rounded-full bg-marinho-700/15">{barra}</div>
      {children}
    </div>
  );
}

export interface TelaOrdensProps {
  /** índice do 1º cartão em PLATAFORMA.telas.andamento (0 = "1 de 3") */
  andamento?: number;
  /** progresso da barra do 1º cartão (1/3 → 1); sem ele, a barra segue o índice */
  barra?: MotionValue<number>;
  /** os 3 cartões entram com "monta" quando vira true; undefined = já no lugar */
  montar?: boolean;
  /** banner "Nova ordem de serviço" */
  banner?: boolean;
}

export function TelaOrdens({ andamento = 0, barra, montar, banner = false }: TelaOrdensProps) {
  const fixos = [1, 0]; // "2 de 3" e "1 de 3" nos outros cartões
  const barraPrincipal = barra ? (
    <motion.span className="block h-full w-full origin-left rounded-full bg-brasa-500" style={{ scaleX: barra }} />
  ) : (
    <motion.span
      className="block h-full w-full origin-left rounded-full bg-brasa-500"
      initial={false}
      animate={{ scaleX: (andamento + 1) / 3 }}
      transition={{ duration: 0.5, ease: ease(EASE_OUT) }}
    />
  );
  const animado = montar !== undefined;

  const cartao = (i: number, conteudo: ReactNode) =>
    animado ? (
      <motion.div key={i} custom={i + 2} variants={variantesPreset("monta", 28, i * 0.06)} initial="hidden" animate={montar ? "show" : "hidden"}>
        {conteudo}
      </motion.div>
    ) : (
      <div key={i}>{conteudo}</div>
    );

  return (
    <div className="relative h-full w-full bg-papel-100">
      <Cabecalho />
      <div className="flex flex-col gap-2.5 px-3 pt-3">
        {cartao(
          0,
          <Cartao
            andamento={<Odometer value={T.andamento[Math.min(2, Math.max(0, andamento))]} trigger="value" duration={0.5} className="tnum" />}
            barra={barraPrincipal}
          />,
        )}
        {fixos.map((f, i) =>
          cartao(
            i + 1,
            <Cartao andamento={T.andamento[f]} barra={<span className="block h-full w-full origin-left rounded-full bg-marinho-500" style={{ transform: `scaleX(${(f + 1) / 3})` }} />} />,
          ),
        )}
      </div>
      {/* notificação que desce quando a ordem chega do painel web */}
      <motion.div
        className="absolute inset-x-2.5 top-[42px] z-10 flex items-center gap-2.5 rounded-[14px] bg-noite-950 px-3 py-2.5 text-papel-50 shadow-[0_14px_30px_-12px_rgba(5,10,18,0.7)]"
        initial={false}
        animate={{ y: banner ? "0%" : "-170%" }}
        transition={{ duration: 0.35, ease: ease(EASE_OUT) }}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brasa-500">
          <Bell size={14} strokeWidth={1.75} />
        </span>
        <span className="text-[13px] font-semibold leading-tight">{T.banner}</span>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------- 3. offline
function Marca({ progresso, inicio }: { progresso: MotionValue<number>; inicio: number }) {
  const traco = useTransform(progresso, [inicio, inicio + 0.14], [0, 1]);
  const fundo = useTransform(progresso, [inicio, inicio + 0.06], [0, 1]);
  return (
    <span className="relative grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border border-marinho-700/30">
      <motion.span className="absolute -inset-px rounded-[6px] bg-marinho-700" style={{ opacity: fundo }} />
      <svg viewBox="0 0 24 24" width={14} height={14} className="relative" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M20 6 9 17l-5-5" style={{ pathLength: traco }} />
      </svg>
    </span>
  );
}

export interface TelaOfflineProps {
  /** 0–1: os 4 Check desenham em sequência */
  checks: MotionValue<number>;
  /** "Sincronizado" aceso (e o RefreshCw gira uma vez quando vira true) */
  sinc: boolean;
}

export function TelaOffline({ checks, sinc }: TelaOfflineProps) {
  const [giros, setGiros] = useState(0);
  useEffect(() => {
    if (sinc) setGiros((g) => g + 1);
  }, [sinc]);
  return (
    <div className="relative h-full w-full bg-papel-100">
      <Cabecalho />
      <div className="px-3 pt-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-brasa-500/10 px-3 py-1.5 text-[13px] font-semibold leading-none text-brasa-600">
          <WifiOff size={14} strokeWidth={2} />
          {T.offline.titulo}
        </p>
        <p className="mt-3 px-1 text-[15px] font-semibold leading-tight text-noite-950">{T.offline.lista}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {T.offline.itens.map((item, i) => (
            <li key={item} className="flex items-center gap-2.5 rounded-[12px] bg-white px-3 py-2.5 text-[13px] leading-tight text-noite-950 ring-1 ring-noite-950/[0.06]">
              <Marca progresso={checks} inicio={0.08 + i * 0.16} />
              {item}
            </li>
          ))}
        </ul>
        <motion.p
          className="mt-4 flex items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-[13px] font-semibold leading-none"
          initial={false}
          animate={{
            opacity: sinc ? 1 : 0.45,
            borderColor: sinc ? "rgba(14,52,82,0.9)" : "rgba(14,52,82,0.25)",
            color: sinc ? "#0E3452" : "#4B5866",
          }}
          transition={{ duration: 0.35 }}
        >
          <motion.span
            className="inline-flex"
            initial={false}
            animate={{ rotate: giros * 360 }}
            transition={{ duration: 0.6, ease: ease(EASE_OUT) }}
          >
            <RefreshCw size={15} strokeWidth={2} />
          </motion.span>
          {T.offline.sincronizado}
        </motion.p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- 4. relatório
/** Cartão "Relatório de inspeção": na tela ou, na cena fixada, saindo do aparelho (overlay do PhoneMock). */
export function CartaoRelatorio({ className }: { className?: string }) {
  return (
    <div className={`w-[244px] rounded-[16px] bg-white p-4 text-noite-950 shadow-[0_24px_50px_-20px_rgba(5,10,18,0.55)] ring-1 ring-noite-950/[0.08] ${className ?? ""}`}>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-brasa-500 text-white">
          <FileCheck2 size={20} strokeWidth={1.75} />
        </span>
        <p className="text-[15px] font-semibold leading-tight">{T.relatorio.titulo}</p>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        <Borrado w={180} />
        <Borrado w={132} />
      </div>
      <p className="mt-3 flex items-start gap-2 border-t border-noite-950/10 pt-3 text-[13px] leading-snug text-grafite-600">
        <Mail size={15} strokeWidth={1.75} className="mt-px shrink-0 text-marinho-700" />
        {T.relatorio.texto}
      </p>
    </div>
  );
}

/** Posição do cartão do relatório dentro da tela (o overlay da cena fixada usa a mesma). */
export const CARTAO_RELATORIO = { left: 18, top: 236 } as const;

export function TelaRelatorio({ cartaoFora = false }: { cartaoFora?: boolean }) {
  return (
    <div className="relative h-full w-full bg-papel-100">
      <Cabecalho />
      <ul className="flex flex-col gap-2 px-3 pt-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex items-center gap-2.5 rounded-[12px] bg-white px-3 py-3 ring-1 ring-noite-950/[0.06]">
            <FileText size={16} strokeWidth={1.75} className="shrink-0 text-marinho-700/60" />
            <span className="flex flex-1 flex-col gap-1.5">
              <Borrado w={i === 1 ? 120 : 150} />
              <Borrado w={i === 1 ? 70 : 90} className="opacity-60" />
            </span>
          </li>
        ))}
      </ul>
      <div className="absolute" style={{ left: CARTAO_RELATORIO.left, top: CARTAO_RELATORIO.top }}>
        {cartaoFora ? (
          <div className="h-[150px] w-[244px] rounded-[16px] border border-dashed border-marinho-700/30" />
        ) : (
          <CartaoRelatorio />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Reel das 4 telas
export interface TelasProps {
  /** 0 splash · 1 ordens · 2 offline · 3 relatório */
  tela: number;
  ordens: TelaOrdensProps;
  offline: TelaOfflineProps;
  cartaoFora?: boolean;
}

/** Reel horizontal das 4 telas, do tamanho da tela do PhoneMock. */
export function Telas({ tela, ordens, offline, cartaoFora }: TelasProps) {
  return (
    <Reel count={4} index={tela} axis="x" className="h-full w-full" itemClassName="h-full">
      {[
        <TelaSplash key="splash" />,
        <TelaOrdens key="ordens" {...ordens} />,
        <TelaOffline key="offline" {...offline} />,
        <TelaRelatorio key="relatorio" cartaoFora={cartaoFora} />,
      ]}
    </Reel>
  );
}

export const TELA = PHONE.tela;
