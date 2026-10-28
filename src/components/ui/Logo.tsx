import { COMPANY } from "../../data/site";
import { Link } from "../../lib/router";
import { Img } from "./Img";
import { Symbol } from "./Symbol";

/**
 * Logo horizontal: símbolo vetorial (32 px) + wordmark recortado de Ativo-1.png (132 px).
 * escuro = wordmark negativo (sobre fundo escuro); claro = cores originais.
 */
export function Logo({ tone, className, animate = false, asLink = false }: { tone: "escuro" | "claro"; className?: string; animate?: boolean; asLink?: boolean }) {
  const conteudo = (
    <>
      <Symbol size={32} tone={tone} mode={animate ? "montar" : "estatico"} className="h-7 w-7 sm:h-8 sm:w-8" />
      <Img
        id={tone === "escuro" ? "protecin-wordmark-negativo" : "protecin-wordmark"}
        alt={COMPANY.nome}
        sizes="(min-width: 640px) 132px, 104px"
        eager
        className="block w-[104px] sm:w-[132px]"
        imgClassName="block h-auto w-full"
      />
    </>
  );
  const cls = `inline-flex items-center gap-2.5 sm:gap-3 ${className ?? ""}`;
  if (asLink)
    return (
      <Link to="/" className={`${cls} rounded-[6px]`} aria-label={`${COMPANY.nome}, página inicial`}>
        {conteudo}
      </Link>
    );
  return <span className={cls}>{conteudo}</span>;
}
