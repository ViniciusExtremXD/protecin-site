import type { CSSProperties } from "react";
import { IMAGENS, type ImagemId } from "../../data/imagens.gen";
import { imgUrl } from "../../lib/urls";

export interface ImgProps {
  id: ImagemId;
  alt: string;
  /**
   * Largura EXIBIDA do quadro (como no CSS), por media query: "(min-width: 1024px) 40vw, 100vw". O Img multiplica
   * pelo recorte do object-cover (`frame`), pela escala extra (`zoom`) e pela densidade mínima nas telas de DPR
   * baixo (`densidade`). Não some fatores à mão aqui.
   */
  sizes?: string;
  className?: string; // no <picture>
  imgClassName?: string; // no <img>
  priority?: boolean; // eager + fetchpriority="high" (só o LCP)
  eager?: boolean;
  mobile?: ImagemId; // <source media="(max-width: 767px)">
  fit?: "cover" | "contain";
  position?: string;
  /**
   * Proporção (largura / altura) do quadro em que a foto entra com object-cover. Se a foto é mais larga que o
   * quadro, ela é ampliada até cobrir a altura: o sizes cresce na mesma razão (foto 3:2 num quadro 4:5 → × 1,875).
   * Omitido = a foto ocupa o quadro na própria proporção (fator 1).
   */
  frame?: number;
  /** Escala extra sobre a foto (parallax 1,06–1,10, hover 1,04, zoom de entrada): multiplica o sizes. Padrão 1. */
  zoom?: number;
  /**
   * Densidade mínima nas telas de DPR baixo (desktop comum, AJUSTES-SOBRIEDADE §4): padrão 1,5. Em DPR ≤ 1,1 o
   * sizes é multiplicado por ela; em DPR ≤ 1,4, por ela / 1,25. Celular (DPR 2–3) já recebe 2× ou mais. 1 desliga.
   */
  densidade?: number;
}

const srcset = (id: ImagemId, ext: "avif" | "webp") =>
  IMAGENS[id].larguras.map((w) => `${imgUrl(id, w, ext)} ${w}w`).join(", ");

/** Fator do recorte do object-cover: max(1, proporção da foto / proporção do quadro). */
export function fatorCover(id: ImagemId, frame?: number): number {
  if (!frame || frame <= 0) return 1;
  const info = IMAGENS[id];
  return Math.max(1, info.w / info.h / frame);
}

/** Divide no nível de cima (vírgulas e espaços fora de parênteses). */
function partir(s: string, sep: "," | " "): string[] {
  const out: string[] = [];
  let nivel = 0;
  let atual = "";
  for (const ch of s) {
    if (ch === "(") nivel++;
    else if (ch === ")") nivel--;
    if (ch === sep && nivel === 0) {
      if (atual.trim()) out.push(atual.trim());
      atual = "";
    } else atual += ch;
  }
  if (atual.trim()) out.push(atual.trim());
  return out;
}

const vezes = (len: string, f: number) => {
  if (Math.abs(f - 1) < 0.005) return len;
  const k = Math.round(f * 1000) / 1000;
  const miolo = len.startsWith("calc(") ? len.slice(4) : len; // calc(a - b) → (a - b)
  return `calc(${miolo} * ${k})`;
};

/**
 * Monta o sizes final: cada entrada "condição largura" vira largura × fator; com densidade > 1, entradas extras na
 * frente para DPR ≤ 1,1 (× densidade) e DPR ≤ 1,4 (× densidade / 1,25). Condições com "or"/"not" ficam sem o
 * reforço de densidade (não dá para combinar com "and" sem ambiguidade).
 */
export function ajustarSizes(sizes: string, fator = 1, densidade = 1.5): string {
  const entradas = partir(sizes, ",").map((e) => {
    const p = partir(e, " ");
    const len = p.pop() ?? "100vw";
    return { cond: p.join(" "), len };
  });
  const base = entradas.map(({ cond, len }) => `${cond ? `${cond} ` : ""}${vezes(len, fator)}`);
  if (densidade <= 1.01) return base.join(", ");
  const combinavel = (c: string) => !c || (c.startsWith("(") && !/\b(or|not)\b/.test(c));
  const reforco = (dpr: string, d: number) =>
    entradas.filter(({ cond }) => combinavel(cond)).map(({ cond, len }) => `(max-resolution: ${dpr})${cond ? ` and ${cond}` : ""} ${vezes(len, fator * d)}`);
  return [...reforco("1.1dppx", densidade), ...reforco("1.4dppx", Math.max(1, densidade / 1.25)), ...base].join(", ");
}

/** <picture> com AVIF e WebP responsivos (todas as larguras de IMAGENS[id]) e width/height do original (sem CLS). */
export function Img({ id, alt, sizes = "100vw", className, imgClassName, priority = false, eager = false, mobile, fit, position, frame, zoom = 1, densidade = 1.5 }: ImgProps) {
  const info = IMAGENS[id];
  const larguras = info.larguras;
  const meio = larguras[Math.min(1, larguras.length - 1)];
  const estilo: CSSProperties | undefined = fit || position ? { objectFit: fit, objectPosition: position } : undefined;
  const prioridade = priority ? ({ fetchpriority: "high" } as Record<string, string>) : {};
  const mob = mobile ? IMAGENS[mobile] : null;
  const tamanhos = ajustarSizes(sizes, fatorCover(id, frame) * Math.max(1, zoom), densidade);

  return (
    <picture className={className}>
      {mobile && mob && (
        <>
          {mob.avif && <source type="image/avif" media="(max-width: 767px)" srcSet={srcset(mobile, "avif")} sizes="100vw" />}
          <source type="image/webp" media="(max-width: 767px)" srcSet={srcset(mobile, "webp")} sizes="100vw" />
        </>
      )}
      {info.avif && <source type="image/avif" srcSet={srcset(id, "avif")} sizes={tamanhos} />}
      <source type="image/webp" srcSet={srcset(id, "webp")} sizes={tamanhos} />
      <img
        src={imgUrl(id, meio, "webp")}
        alt={alt}
        width={info.w}
        height={info.h}
        loading={priority || eager ? "eager" : "lazy"}
        decoding="async"
        className={imgClassName}
        style={estilo}
        {...prioridade}
      />
    </picture>
  );
}
