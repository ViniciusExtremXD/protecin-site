import { useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DrawIcon, Odometer, Reveal, RevealGroup, RevealItem, SplitWords, DUR, EASE_OUT, VIEWPORT, ease } from "../../../components/motion";
import { Chip } from "../../../components/ui/Chip";
import { OrcamentoCta, WhatsAppCta } from "../../../components/ui/cta";
import { SERVICOS_HEADER, UI, WA, type Servico } from "../../../data/site";
import { useInViewport } from "../../../lib/media";
import { useMotionPref } from "../../../lib/motion-pref";
import { Link } from "../../../lib/router";
import { pushEvent } from "../../../lib/track";
import { TOTAL_SERVICOS, redesenhar } from "../../servicos/capitulos/util";
import { MidiaCartao } from "./MidiaCartao";
import { cobertura, fixado, usePilhaCtx } from "./pilha";

/** Link de texto "Detalhes" (§5.4): sublinhado que cresce no hover (sempre visível no celular) e seta que avança. */
function LinkDetalhes({ servico }: { servico: Servico }) {
  return (
    <Link
      to={`/servicos/#${servico.slug}`}
      onClick={() => pushEvent("service_open", { servico: servico.slug, origem: "home" })}
      className="group/link relative -my-2 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-papel-50"
    >
      <span className="relative">
        <span className="lg:hidden">{SERVICOS_HEADER.verDetalhes}</span>
        <span className="hidden lg:inline">{SERVICOS_HEADER.detalhes}</span>
        <span className="sr-only">: {servico.nome}</span>
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-200 ease-out lg:scale-x-0 lg:group-hover/link:scale-x-100 lg:group-focus-visible/link:scale-x-100"
        />
      </span>
      <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} className="text-brasa-300 transition-transform duration-200 ease-out group-hover/link:translate-x-1" />
    </Link>
  );
}

/**
 * Um cartão da pilha de serviços. Entra com y 80 → 0 e opacidade 0,6 → 1; quando o cartão seguinte sobe por cima,
 * encolhe para 0,94 e escurece com o véu (até 0,55, o texto nunca some). Número e ícone disparam quando o cartão fixa.
 */
export function Cartao({ servico, indice }: { servico: Servico; indice: number }) {
  const pilha = usePilhaCtx();
  const reduced = useMotionPref() === "reduced";
  const raiz = useRef<HTMLDivElement>(null);
  const noFluxoVisto = useInView(raiz, VIEWPORT);
  const naTela = useInViewport(raiz);
  const [preso, setPreso] = useState(false);
  const [noTopo, setNoTopo] = useState(false);

  const p = useTransform([pilha.scrollY, pilha.versao], ([y]: number[]) => cobertura(pilha.medidas.current, indice, y));
  const fix = useTransform([pilha.scrollY, pilha.versao], ([y]: number[]) => (fixado(pilha.medidas.current, indice, y) ? 1 : 0));
  const escala = useTransform(p, [0, 1], [1, 0.94]);
  const veu = useTransform(p, [0, 1], [0, 0.55]);

  useMotionValueEvent(fix, "change", (v) => {
    if (v === 1) setPreso(true);
    setNoTopo(v === 1 && p.get() < 0.5);
  });
  useMotionValueEvent(p, "change", (v) => setNoTopo(fix.get() === 1 && v < 0.5));

  const ativo = pilha.ligada ? preso : noFluxoVisto;
  const videoAtivo = pilha.ligada ? noTopo && naTela : naTela;
  const numero = servico.numero;

  // O 1º render é sempre "full" (casa com o SSR): no reduzido o estado final precisa ser aplicado explicitamente,
  // senão o cartão fica preso no estado inicial (opacidade 0,6 e y 80) que o 1º render montou.
  const entrada = reduced
    ? { initial: { y: 80, opacity: 0.6 }, animate: { y: 0, opacity: 1 }, transition: { duration: DUR.micro, y: { duration: 0 } } }
    : {
        initial: { y: 80, opacity: 0.6 },
        whileInView: { y: 0, opacity: 1 },
        viewport: { once: true, margin: "0px 0px -6% 0px" },
        transition: { duration: DUR.longa, ease: ease(EASE_OUT) },
      };

  return (
    <li ref={pilha.registrar(indice)} className={`${pilha.ligada ? "sticky" : "relative"} mb-5 last:mb-0 lg:mb-10`} style={{ zIndex: indice + 1 }}>
      <motion.article data-motion="sobe" {...entrada}>
        <motion.div
          ref={raiz}
          onPointerEnter={(e) => e.pointerType === "mouse" && redesenhar(raiz.current)}
          className="relative flex min-h-[72svh] flex-col overflow-clip rounded-r-lg border border-noite-700 bg-noite-800 p-3 transition-colors duration-[350ms] ease-out hover:border-brasa-400/60 lg:grid lg:min-h-[78vh] lg:grid-cols-12 lg:gap-x-6 lg:p-10 xl:gap-x-10"
          style={pilha.ligada && !reduced ? { scale: escala, transformOrigin: "50% 0%" } : undefined}
        >
          {/* mídia: em cima no celular, à direita (colunas 6–12) no desktop */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <MidiaCartao servico={servico} videoAtivo={videoAtivo} />
          </div>

          {/* texto: colunas 1–5 */}
          <div className="flex flex-1 flex-col px-2 pb-2 pt-5 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:p-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <DrawIcon icon={servico.icone} size={40} drawn={ativo} className="hidden text-brasa-400 lg:inline-flex" />
                <p className="rotulo flex items-center text-papel-500">
                  <Odometer value={numero} className="text-brasa-300" ariaLabel={`${numero} de ${TOTAL_SERVICOS}`} />
                  <span aria-hidden className="px-2 text-papel-50/25">
                    /
                  </span>
                  <span aria-hidden>{TOTAL_SERVICOS}</span>
                </p>
              </div>
              <LinkDetalhes servico={servico} />
            </div>

            <SplitWords as="h3" text={servico.nome} className="display-l mt-4 block max-w-[16ch] text-balance text-papel-50 lg:mt-8" />

            <Reveal delay={0.1} className="mt-4 lg:mt-6">
              <p className="corpo-l max-w-[46ch] text-papel-50/90">{servico.resumo}</p>
            </Reveal>
            {servico.descricao && (
              <Reveal delay={0.2} className="mt-4 hidden lg:block">
                <p className="corpo text-papel-300">{servico.descricao}</p>
              </Reveal>
            )}

            <div className="mt-6 flex flex-col gap-6 lg:mt-auto lg:pt-8">
              <RevealGroup as="ul" preset="monta" stagger={0.05} className="hidden flex-wrap gap-2 lg:flex" y={28}>
                {servico.chips.map((c, i) => (
                  <RevealItem as="li" key={c} index={i}>
                    <Chip>{c}</Chip>
                  </RevealItem>
                ))}
              </RevealGroup>
              <RevealGroup stagger={0.06} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <RevealItem>
                  <OrcamentoCta formLocation="servicos" servico={servico.slug} full className="sm:w-auto">
                    {SERVICOS_HEADER.ctaServico}
                  </OrcamentoCta>
                </RevealItem>
                <RevealItem>
                  <WhatsAppCta location="servicos" detail={servico.slug} message={WA.servico(servico.nome)} full className="sm:w-auto">
                    {UI.whatsapp}
                  </WhatsAppCta>
                </RevealItem>
              </RevealGroup>
            </div>
          </div>

          {/* véu do cartão coberto (só na pilha) */}
          {pilha.ligada && !reduced && (
            <motion.span aria-hidden className="pointer-events-none absolute inset-0 z-[4] rounded-[inherit] bg-noite-950" style={{ opacity: veu }} />
          )}
        </motion.div>
      </motion.article>
    </li>
  );
}
