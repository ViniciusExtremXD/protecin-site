import type { CSSProperties } from "react";
import { IMAGENS, type ImagemId } from "../../data/imagens.gen";
import { imgUrl } from "../../lib/urls";

export interface ImgProps {
  id: ImagemId;
  alt: string;
  sizes?: string;
  className?: string; // no <picture>
  imgClassName?: string; // no <img>
  priority?: boolean; // eager + fetchpriority="high" (só o LCP)
  eager?: boolean;
  mobile?: ImagemId; // <source media="(max-width: 767px)">
  fit?: "cover" | "contain";
  position?: string;
}

const srcset = (id: ImagemId, ext: "avif" | "webp") =>
  IMAGENS[id].larguras.map((w) => `${imgUrl(id, w, ext)} ${w}w`).join(", ");

/** <picture> com AVIF e WebP responsivos (larguras de IMAGENS[id]) e width/height do original (sem CLS). */
export function Img({ id, alt, sizes = "100vw", className, imgClassName, priority = false, eager = false, mobile, fit, position }: ImgProps) {
  const info = IMAGENS[id];
  const larguras = info.larguras;
  const meio = larguras[Math.min(1, larguras.length - 1)];
  const estilo: CSSProperties | undefined = fit || position ? { objectFit: fit, objectPosition: position } : undefined;
  const prioridade = priority ? ({ fetchpriority: "high" } as Record<string, string>) : {};
  const mob = mobile ? IMAGENS[mobile] : null;

  return (
    <picture className={className}>
      {mobile && mob && (
        <>
          {mob.avif && <source type="image/avif" media="(max-width: 767px)" srcSet={srcset(mobile, "avif")} sizes="100vw" />}
          <source type="image/webp" media="(max-width: 767px)" srcSet={srcset(mobile, "webp")} sizes="100vw" />
        </>
      )}
      {info.avif && <source type="image/avif" srcSet={srcset(id, "avif")} sizes={sizes} />}
      <source type="image/webp" srcSet={srcset(id, "webp")} sizes={sizes} />
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
