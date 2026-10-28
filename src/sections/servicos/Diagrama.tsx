import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { DIAGRAMA, linhasTexto, servicoPorSlug, type Camada, type ServicoSlug } from "../../data/site";
import { Link } from "../../lib/router";
import { pushEvent } from "../../lib/track";
import { scrollToY } from "../../lib/smooth-scroll";
import { DUR, EASE_IN_OUT, EASE_OUT, PinStage, Reel, Reveal, SplitLines, ease, usePin } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { IsoDiagram } from "./diagrama/IsoDiagram";
import { RotuloAzul } from "../shared/plataforma/RotuloAzul";
import { CENTRO, FOCOS, VIEWBOX_CENA, transformCamera } from "./diagrama/iso";

/*
 * /servicos/ · Diagrama isométrico "Camada por camada" (design-final §10.2.1), recalibrado na rodada de sobriedade
 * (qa/AJUSTES-SOBRIEDADE.md): menos ornamento (sem trilho C-01…, sem chips na base, sem carimbo nem cantoneiras).
 * Desktop (≥ 1024 × 640): cena fixada curta (190vh, 0,9 tela presa). A rolagem só escolhe a camada; o desenho,
 * a câmera e o texto mudam por tempo (0,8 s). À esquerda a lista das 7 camadas (clicável) e o texto da ativa.
 * Celular, tablet e tela baixa: nada preso. O diagrama se desenha camada por camada ao entrar na tela e as 7
 * camadas ficam numa lista que abre uma de cada vez (<details>, funciona sem JS); a aberta acende no desenho.
 */

const CAMADAS: readonly Camada[] = DIAGRAMA.camadas;
const N = CAMADAS.length; // 7 (C-01..C-06 + Engenharia)
const T0 = 0.08; // visão geral antes da 1ª camada
const ANTES = 0.15; // o passeio começa com o topo da cena a 15% da tela
const ESCALA = 1.12; // o prédio (731 de altura) não cabe no quadro de 820 acima de ~1,12
const H2 = "display-l text-[clamp(2rem,min(3.4vw,6.2svh),3.25rem)] text-balance text-papel-50";
/** O corpo repete o H2 no começo ("Da elaboração de projetos à gestão contínua dos equipamentos, oferecemos…"). */
const CORPO = (() => {
  const m = DIAGRAMA.corpo.match(/equipamentos, (.+)$/);
  return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1) : DIAGRAMA.corpo;
})();
const UI_LOCAL = { camadas: "Camadas do diagrama", servicos: "Serviços:" } as const;

const RAZAO = Math.round((VIEWBOX_CENA.w / VIEWBOX_CENA.h) * 10000) / 10000;

const indiceEm = (t: number) => (t < T0 ? -1 : Math.min(N - 1, Math.floor(((t - T0) / (1 - T0)) * N)));
const tDe = (k: number) => T0 + ((k + 0.5) / N) * (1 - T0);

// ---------------------------------------------------------------- desenho por tempo (cena e fluxo)
/**
 * `nivel`: até que camada o desenho está de pé (-1 nada, 0 só a estrutura, 1..6 = C-01..C-06). Cada traço anima
 * 0 → 1 em 0,8 s quando entra no nível (e volta em 0,3 s quando sai); os pictogramas sobem 200 ms depois.
 * `passo`: atraso entre camadas que entram juntas (o fluxo do celular desenha uma depois da outra).
 */
function useDesenho(nivel: number, passo = 0.12) {
  const t0 = useMotionValue(0);
  const t1 = useMotionValue(0);
  const t2 = useMotionValue(0);
  const t3 = useMotionValue(0);
  const t4 = useMotionValue(0);
  const t5 = useMotionValue(0);
  const t6 = useMotionValue(0);
  const tracos = useRef<MotionValue<number>[]>([t0, t1, t2, t3, t4, t5, t6]).current;
  const [pictos, setPictos] = useState<boolean[]>(() => Array(7).fill(false));

  useEffect(() => {
    const anims: { stop: () => void }[] = [];
    const timers: number[] = [];
    let ordem = 0;
    tracos.forEach((mv, c) => {
      const alvo = c <= nivel ? 1 : 0;
      if (mv.get() === alvo) return;
      const atraso = alvo ? ordem++ * passo : 0;
      anims.push(animate(mv, alvo, { duration: alvo ? DUR.longa : 0.3, ease: ease(EASE_IN_OUT), delay: atraso }));
      if (c > 0) {
        if (alvo) timers.push(window.setTimeout(() => setPictos((v) => v.map((x, i) => (i === c ? true : x))), (atraso + 0.2) * 1000));
        else setPictos((v) => v.map((x, i) => (i === c ? false : x)));
      }
    });
    return () => {
      anims.forEach((a) => a.stop());
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [nivel, passo, tracos]);

  return { tracos, pictos };
}

// ---------------------------------------------------------------- peças comuns
const COR_AMOSTRA: Record<Camada["cor"], ReactNode> = {
  brasa: <span className="h-[3px] w-6 rounded-full bg-brasa-400" />,
  alarme: (
    <span className="flex w-6 items-center gap-1">
      <span className="h-px flex-1 border-t border-dashed border-marinho-300" />
      <span className="h-1.5 w-1.5 rounded-full bg-brasa-300" />
    </span>
  ),
  papel: <span className="h-[3px] w-6 rounded-full bg-papel-50" />,
  fotolum: (
    <span className="flex w-6 items-center gap-1">
      <span className="h-[3px] w-3 rounded-full bg-fotolum" />
      <span className="h-px flex-1 border-t border-dashed border-papel-50" />
    </span>
  ),
  todas: (
    <span className="flex w-6 items-center gap-0.5">
      <span className="h-[3px] flex-1 rounded-full bg-brasa-400" />
      <span className="h-[3px] flex-1 rounded-full bg-marinho-300" />
      <span className="h-[3px] flex-1 rounded-full bg-papel-50" />
      <span className="h-[3px] flex-1 rounded-full bg-fotolum" />
    </span>
  ),
};

function Amostra({ cor }: { cor: Camada["cor"] }) {
  return (
    <span aria-hidden className="flex w-6 shrink-0 items-center">
      {COR_AMOSTRA[cor]}
    </span>
  );
}

/** Links dos serviços da camada, numa linha só ("Serviços: Instalação · Inspeções"). */
function LinksServicos({ slugs, tabIndex }: { slugs: readonly ServicoSlug[]; tabIndex?: number }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-1 text-[15px] text-papel-300">
      <span className="mr-1">{UI_LOCAL.servicos}</span>
      {slugs.map((slug, i) => {
        const s = servicoPorSlug(slug);
        return (
          <span key={slug} className="inline-flex items-center">
            {i > 0 && (
              <span aria-hidden className="mr-1 text-papel-50/30">
                ·
              </span>
            )}
            <Link
              to={`/servicos/#${slug}`}
              tabIndex={tabIndex}
              className="inline-flex min-h-11 min-w-11 items-center justify-center font-semibold text-papel-50 underline decoration-papel-50/25 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-brasa-400 lg:min-h-9 lg:min-w-0"
            >
              {s.nomeCurto}
            </Link>
          </span>
        );
      })}
    </p>
  );
}

function Textos({ camada }: { camada: Camada }) {
  return (
    <>
      {camada.textos.map((tx) => (
        <p key={tx} className="mt-2 text-[16px] leading-[1.6] text-papel-300 first:mt-0 lg:text-[17px]">
          {tx}
        </p>
      ))}
    </>
  );
}

function FundoAzul() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-mundo-azul">
      <div className="bg-blueprint h-full w-full opacity-70" />
    </div>
  );
}

// ---------------------------------------------------------------- cena fixada (desktop)
function Cena({ index }: { index: string }) {
  const palco = useRef<HTMLDivElement>(null);
  const visto = useInView(palco, { once: true, amount: 0.3 });
  const [ind, setInd] = useState(-1);
  const { scrollY } = useScroll();

  const geometria = () => {
    const sec = palco.current?.closest<HTMLElement>("[data-pin-stage]");
    if (!sec) return null;
    const vh = window.innerHeight;
    const ini = vh * ANTES;
    return { topo: sec.getBoundingClientRect().top, ini, total: ini + sec.offsetHeight - vh };
  };
  const atualizar = () => {
    const g = geometria();
    if (!g || g.total <= 0) return;
    const i = indiceEm((g.ini - g.topo) / g.total);
    setInd((a) => (a === i ? a : i));
  };
  useMotionValueEvent(scrollY, "change", atualizar);
  useEffect(() => {
    atualizar();
    window.addEventListener("resize", atualizar);
    return () => window.removeEventListener("resize", atualizar);
  }, []);

  const final = ind === N - 1;
  const nivel = !visto ? -1 : ind < 0 ? 0 : Math.min(6, ind + 1);
  const { tracos, pictos } = useDesenho(nivel);
  const apagadas = [false, ...[1, 2, 3, 4, 5, 6].map((c) => !final && ind >= 0 && c - 1 < ind)];

  // câmera por tempo: escala e foco animam até a camada ativa
  const s = useMotionValue(1);
  const fx = useMotionValue(CENTRO[0]);
  const fy = useMotionValue(CENTRO[1]);
  useEffect(() => {
    const zoom = ind >= 0 && ind < 6;
    const [ax, ay] = zoom ? FOCOS[ind] : CENTRO;
    const opts = { duration: DUR.longa, ease: ease(EASE_IN_OUT) };
    const a = [animate(s, zoom ? ESCALA : 1, opts), animate(fx, ax, opts), animate(fy, ay, opts)];
    return () => a.forEach((x) => x.stop());
  }, [ind, s, fx, fy]);
  const camera = useTransform([s, fx, fy] as MotionValue<number>[], ([e, x, y]: number[]) => transformCamera(e, [x, y]));

  const irPara = (k: number) => {
    const g = geometria();
    if (!g) return;
    scrollToY(window.scrollY + g.topo - (g.ini - tDe(k) * g.total), { duration: 0.9 });
    pushEvent("diagram_layer", { layer: CAMADAS[k].id });
  };

  const semCamada = ind < 0;
  return (
    <div ref={palco} className="relative h-full w-full overflow-clip">
      <FundoAzul />
      <Container className="relative grid h-full grid-cols-12 gap-x-6 pb-8 pt-[92px] [@media(min-height:820px)]:pb-12 [@media(min-height:820px)]:pt-[104px]">
        {/* painel */}
        <div className="col-span-5 flex min-h-0 flex-col justify-center xl:col-span-4">
          <RotuloAzul index={index} label={DIAGRAMA.label} />
          <SplitLines as="h2" lines={DIAGRAMA.h2.linhas} text={DIAGRAMA.h2.texto} className={`${H2} mt-5`} />

          <Reveal y={16} delay={0.1} className="mt-6 [@media(max-height:759px)]:hidden">
            <ol className="border-t border-marinho-300/20" aria-label={UI_LOCAL.camadas}>
            {CAMADAS.map((c, i) => {
              const on = i === ind;
              return (
                <li key={c.id} className="border-b border-marinho-300/20">
                  <button
                    type="button"
                    onClick={() => irPara(i)}
                    aria-current={on ? "step" : undefined}
                    className="group flex min-h-9 w-full items-center gap-3 py-1.5 text-left"
                  >
                    <span className={`transition-opacity duration-300 ${on || semCamada ? "opacity-100" : "opacity-45"}`}>
                      <Amostra cor={c.cor} />
                    </span>
                    <span className={`text-[16px] font-medium leading-snug transition-colors duration-300 ${on ? "text-papel-50" : "text-papel-300 group-hover:text-papel-50"}`}>
                      {c.nome}
                    </span>
                  </button>
                </li>
              );
            })}
            </ol>
          </Reveal>

          {/* texto: o corpo na visão geral; depois, a camada ativa */}
          <div className="mt-5">
            {/* itens com min-h-0: um texto mais alto que a janela não desalinha o rolo (fica recortado); px-2: o anel de foco dos links cabe na janela */}
            <Reel count={N + 1} index={ind + 1} className="-mx-2 h-[248px] px-2 xl:h-[226px] [@media(max-height:759px)]:h-[300px]" itemClassName="min-h-0 overflow-clip">
              {[
                <p key="corpo" className="text-[17px] leading-[1.6] text-papel-300">
                  {CORPO}
                </p>,
                ...CAMADAS.map((c, i) => (
                  <div key={c.id}>
                    {/* com a lista escondida (tela baixa) o nome da camada vem no próprio texto */}
                    <p className="mb-2 text-[17px] font-semibold text-papel-50 [@media(min-height:760px)]:hidden">{c.nome}</p>
                    <Textos camada={c} />
                    <LinksServicos slugs={c.servicos} tabIndex={i === ind ? undefined : -1} />
                  </div>
                )),
              ]}
            </Reel>
          </div>
        </div>

        {/* diagrama */}
        <div className="relative col-span-7 flex min-h-0 items-center justify-center xl:col-span-8" style={{ containerType: "size" }}>
          {/* caixa na proporção do viewBox, o maior possível na coluna (unidades de container: sem medir, sem salto) */}
          <div className="relative" style={{ width: `min(100cqw, calc(92cqh * ${RAZAO}))`, aspectRatio: `${VIEWBOX_CENA.w} / ${VIEWBOX_CENA.h}` }}>
            <IsoDiagram tracos={tracos} pictos={pictos} apagadas={apagadas} camera={camera} preencher className="h-full w-full" />
          </div>
        </div>
      </Container>
    </div>
  );
}

// ---------------------------------------------------------------- fluxo normal (celular, tablet, tela baixa, sem JS)
function Fluxo({ index }: { index: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const naTela = useInView(caixa, { once: true, amount: 0.3 });
  const [aberta, setAberta] = useState(-1);
  // ao entrar na tela o desenho sobe camada por camada (0,38 s entre elas)
  const { tracos, pictos } = useDesenho(naTela ? 6 : -1, 0.38);
  const apagadas = [false, ...[1, 2, 3, 4, 5, 6].map((c) => aberta >= 0 && aberta < 6 && c - 1 !== aberta)];

  const alternar = (i: number) => (e: SyntheticEvent<HTMLDetailsElement>) => {
    const aberto = e.currentTarget.open;
    setAberta((a) => (aberto ? i : a === i ? -1 : a));
    if (aberto) pushEvent("diagram_layer", { layer: CAMADAS[i].id });
  };

  return (
    <div className="relative">
      <FundoAzul />
      <Container className="relative py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
          <header className="lg:col-span-6">
            <RotuloAzul index={index} label={DIAGRAMA.label} />
            <SplitLines as="h2" lines={DIAGRAMA.h2.linhas} text={DIAGRAMA.h2.texto} className={`${H2} mt-5`} />
            <Reveal as="p" y={16} delay={0.1} className="mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-papel-300 lg:text-[17px]">
              {CORPO}
            </Reveal>
          </header>

          <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
            <div className="lg:sticky lg:top-28">
              <motion.div
                ref={caixa}
                className="relative mx-auto max-w-[520px]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: DUR.base, ease: ease(EASE_OUT) }}
              >
                <IsoDiagram compacto tracos={tracos} pictos={pictos} apagadas={apagadas} />
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ul className="border-t border-marinho-300/20" aria-label={UI_LOCAL.camadas}>
              {CAMADAS.map((c, i) => (
                <li key={c.id} className="border-b border-marinho-300/20">
                  <details {...({ name: "diagrama-camadas" } as Record<string, string>)} onToggle={alternar(i)} className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 py-2 text-left [&::-webkit-details-marker]:hidden">
                      <Amostra cor={c.cor} />
                      <span className="flex-1 text-[17px] font-medium leading-snug text-papel-50">{c.nome}</span>
                      <ChevronDown aria-hidden size={18} strokeWidth={1.75} className="shrink-0 text-marinho-300 transition-transform duration-300 group-open:rotate-180" />
                    </summary>
                    <div className="pb-5 pl-9">
                      <Textos camada={c} />
                      <LinksServicos slugs={c.servicos} />
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Conteudo({ index }: { index: string }) {
  const { active } = usePin();
  return active ? <Cena index={index} /> : <Fluxo index={index} />;
}

// ---------------------------------------------------------------- seção
export interface DiagramaProps {
  id?: string;
  index?: string;
}

export default function Diagrama({ id = "sistema", index = "01" }: DiagramaProps = {}) {
  return (
    <section id={id} data-section="diagrama" aria-label={linhasTexto(DIAGRAMA.h2.linhas)} className="relative bg-marinho-900">
      <PinStage mode="pin" heightClassName="h-[190vh]">
        <Conteudo index={index} />
      </PinStage>
    </section>
  );
}
