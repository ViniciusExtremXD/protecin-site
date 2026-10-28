import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { VIEWPORT, useIsoLayoutEffect } from "../../../components/motion";
import { motionPrefAtual } from "../../../lib/motion-pref";

/*
 * Revelação de texto da unidade historia-institucional, versão local dos presets "linha" e "palavra" (§5.2).
 *
 * Por que local: o SplitLines/SplitWords da base saem do servidor com a máscara fechada (transform inline, sem
 * opacity:0), e o <noscript> do index.html só desfaz opacity:0, então sem JavaScript o título some. Aqui o HTML do
 * servidor traz o texto parado e visível; a máscara só fecha depois de montar com movimento completo e abre ao
 * entrar na tela. Movimento reduzido: nada se mexe.
 *
 * - "linha": mede em que linha cada palavra caiu (fontes e redimensionamento) e abre linha a linha
 *   (y 110% → 0, rotate 3° → 0, 800 ms, 80 ms por linha). Funciona com texto corrido, sem quebra fixa.
 * - "palavra": abre palavra a palavra (rotate 4°, 700 ms, cascata de até 600 ms).
 * `texto` em lista = quebras fixas (cada item numa linha). O texto continua real para leitores de tela.
 */
export interface RevelaProps {
  texto: string | readonly string[];
  as?: "p" | "h2" | "h3" | "span";
  modo?: "linha" | "palavra";
  className?: string;
  destaque?: readonly string[];
  destaqueClassName?: string;
  delay?: number;
}

const limpa = (w: string) => w.replace(/[.,:;!?…]/g, "");

export function Revela({ texto, as: Tag = "p", modo = "linha", className, destaque = [], destaqueClassName = "text-brasa-400", delay = 0 }: RevelaProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const [armado, setArmado] = useState(false);
  const [linhaDe, setLinhaDe] = useState<number[]>([]);
  const linhas = typeof texto === "string" ? [texto] : texto;
  const palavras = linhas.map((l) => l.split(" "));
  const total = palavras.flat().length;
  const alvo = new Set(destaque.map(limpa));
  const passo = Math.min(0.04, 0.6 / Math.max(1, total));

  useEffect(() => {
    if (motionPrefAtual() === "full") setArmado(true);
  }, []);

  // linha em que cada palavra caiu (só no modo "linha")
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || modo !== "linha") return;
    const medir = () => {
      let linha = -1;
      let topo = -Infinity;
      const r: number[] = [];
      el.querySelectorAll<HTMLElement>("[data-p]").forEach((s) => {
        if (s.offsetTop > topo + 4) {
          linha++;
          topo = s.offsetTop;
        }
        r.push(linha);
      });
      setLinhaDe((a) => (a.length === r.length && a.every((v, i) => v === r[i]) ? a : r));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    let vivo = true;
    document.fonts?.ready.then(() => vivo && medir());
    return () => {
      vivo = false;
      ro.disconnect();
    };
  }, [modo, typeof texto === "string" ? texto : texto.join("|")]);

  const fechado = armado && !inView;
  const giro = modo === "linha" ? 3 : 4;
  const dur = modo === "linha" ? 800 : 700;

  let k = 0;
  return (
    <Tag ref={ref as never} data-motion={modo} className={className}>
      {palavras.map((ws, li) => {
        const conteudo = ws.map((w, wi) => {
          const i = k++;
          const atraso = modo === "linha" ? delay + (linhaDe[i] ?? 0) * 0.08 : delay + i * passo;
          return (
            <span key={wi}>
              <span data-p="" className="-mb-[0.1em] -mt-[0.2em] inline-block overflow-clip pb-[0.1em] pt-[0.2em] align-bottom">
                <span
                  className={`inline-block origin-bottom-left ${alvo.has(limpa(w)) ? destaqueClassName : ""}`}
                  style={
                    fechado
                      ? { transform: `translate3d(0,110%,0) rotate(${giro}deg)`, transition: "none" }
                      : { transform: "none", transition: `transform ${dur}ms cubic-bezier(0.16,1,0.3,1) ${Math.round(atraso * 1000)}ms` }
                  }
                >
                  {w}
                </span>
              </span>
              {wi < ws.length - 1 ? " " : ""}
            </span>
          );
        });
        return linhas.length > 1 ? (
          <span key={li} className="block">
            {conteudo}
            {li < linhas.length - 1 ? " " : ""}
          </span>
        ) : (
          <span key={li}>{conteudo}</span>
        );
      })}
    </Tag>
  );
}
