import type { ReactNode } from "react";
import { UI } from "../../data/site";
import { ClipReveal } from "../motion/ClipReveal";
import { FocusBrackets } from "../motion/FocusBrackets";
import { ParallaxMedia } from "../motion/ParallaxMedia";
import { Reveal } from "../motion/Reveal";
import { Img, type ImgProps } from "./Img";

export interface CaptionedFigureProps {
  img: ImgProps;
  credit: "acervo" | "ilustrativa";
  caption?: string;
  reveal?: "cortina" | "fade" | "none";
  parallax?: 0 | 6 | 8 | 12;
  aspect?: string; // "16/10"
  brackets?: boolean;
  creditPosition?: "abaixo" | "sobre";
  radius?: number; // 28
  tone?: "escuro" | "claro";
  className?: string;
}

/**
 * Figura com crédito obrigatório no tipo (enxerto D3): "FOTO DO ACERVO PROTECIN" para fotos reais e
 * "IMAGEM ILUSTRATIVA" para banco. "sobre" = canto inferior esquerdo com fundo noite-950/70.
 */
export function CaptionedFigure({
  img,
  credit,
  caption,
  reveal = "cortina",
  parallax = 0,
  aspect = "16/10",
  brackets = false,
  creditPosition = "abaixo",
  radius = 28,
  tone = "escuro",
  className,
}: CaptionedFigureProps) {
  const textoCredito = (credit === "acervo" ? UI.fotoAcervo : UI.imagemIlustrativa).toUpperCase();
  const imagem = <Img {...img} className="block h-full w-full" imgClassName={`h-full w-full object-cover ${img.imgClassName ?? ""}`} />;
  const midia = parallax ? <ParallaxMedia amount={parallax}>{imagem}</ParallaxMedia> : imagem;
  const janela = (conteudo: ReactNode) => {
    const cls = "relative h-full w-full overflow-clip";
    if (reveal === "cortina")
      return (
        <ClipReveal radius={radius} className={cls}>
          {conteudo}
        </ClipReveal>
      );
    if (reveal === "fade")
      return (
        <Reveal preset="fade" className={cls}>
          {conteudo}
        </Reveal>
      );
    return <div className={cls}>{conteudo}</div>;
  };
  const corLegenda = tone === "claro" ? "text-grafite-600" : "text-papel-500";

  return (
    <figure className={`group ${className ?? ""}`}>
      <div className="relative" style={{ aspectRatio: aspect }}>
        <div className="absolute inset-0 overflow-clip transition-transform duration-[800ms] ease-out" style={{ borderRadius: radius }}>
          {janela(
            <div className="h-full w-full transition-transform duration-[800ms] ease-out [@media(hover:hover)]:group-hover:scale-[1.04]">{midia}</div>,
          )}
        </div>
        {brackets && <FocusBrackets mode="hover" tone={tone} />}
        {creditPosition === "sobre" && (
          <Reveal as="span" preset="fade" delay={0.35} className="rotulo absolute bottom-3 left-3 z-[1] rounded-[6px] bg-noite-950/70 px-2.5 py-1.5 text-papel-50">
            {textoCredito}
          </Reveal>
        )}
      </div>
      {(caption || creditPosition === "abaixo") && (
        <figcaption className="mt-3">
          {/* a legenda entra junto da figura (sobe curto, depois da cortina) */}
          <Reveal as="span" y={10} delay={0.25} className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 ${corLegenda}`}>
            {caption && <span className="text-[15px] leading-snug">{caption}</span>}
            {creditPosition === "abaixo" && <span className="rotulo">{textoCredito}</span>}
          </Reveal>
        </figcaption>
      )}
    </figure>
  );
}
