import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AUTORIZADAS, type Marca } from "../../../data/site";
import { IMAGENS } from "../../../data/imagens.gen";
import { FocusBrackets } from "../../../components/motion";
import { Img } from "../../../components/ui/Img";
import { useMotionPref } from "../../../lib/motion-pref";

/*
 * Logo de fabricante ou entidade (design-final §9 H2 e §10.3). Nunca de cliente: o grupo vai em data-marca
 * ("autorizada" | "marca" | "filiacao") para o verify conferir que "AUTORIZADA" só aparece junto das quatro autorizações.
 *
 * O tamanho do logo é normalizado pela área (largura = base × √proporção, altura = base ÷ √proporção), para logos
 * largos e logos quadrados pesarem igual na fita e no ladrilho.
 * Em repouso: grayscale(1) e opacidade 0,72. Hover ou foco no pai (.group): cor original e as cantoneiras de foco.
 */

export interface LogoTileProps {
  marca?: Marca;
  variante?: "ladrilho" | "fita"; // ladrilho 3:2 com fundo (grades) ou só o logo (fitas)
  tom?: "claro" | "escuro";
  parallax?: boolean; // logo com y 4% → -4% pela rolagem (ladrilhos grandes)
  nome?: boolean; // nome mono sob o ladrilho no hover (ladrilho; padrão true)
  className?: string;
}

/** Proporção do arquivo → largura/altura relativas a uma base (CSS var --lb). */
function medidas(marca: Marca): CSSProperties {
  const info = IMAGENS[marca.imagem];
  const r = Math.sqrt(info.w / info.h);
  return { width: `calc(var(--lb) * ${r.toFixed(3)})`, height: `calc(var(--lb) / ${r.toFixed(3)})` };
}

function Logo({ marca, tom, sizes }: { marca: Marca; tom: "claro" | "escuro"; sizes: string }) {
  const id = tom === "escuro" && marca.imagemEscuro ? marca.imagemEscuro : marca.imagem;
  return (
    <span className="block shrink-0" style={medidas(marca)}>
      <Img
        id={id}
        alt={marca.nome}
        sizes={sizes}
        className="block h-full w-full"
        imgClassName="h-full w-full object-contain opacity-[.72] grayscale transition-[filter,opacity] duration-300 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-focus-within:opacity-100 group-focus-within:grayscale-0"
      />
    </span>
  );
}

function LogoParallax({ marca, tom, sizes }: { marca: Marca; tom: "claro" | "escuro"; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPref() === "reduced";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  return (
    <motion.div ref={ref} data-motion="parallax" className="grid h-full w-full place-items-center" style={reduced ? { y: 0 } : { y }}>
      <Logo marca={marca} tom={tom} sizes={sizes} />
    </motion.div>
  );
}

export function LogoTile({ marca = AUTORIZADAS[0], variante = "ladrilho", tom = "claro", parallax = false, nome = true, className }: LogoTileProps) {
  const claro = tom === "claro";

  if (variante === "fita") {
    return (
      <span data-marca={marca.grupo} className={`group relative grid shrink-0 place-items-center px-3 py-2 [--lb:52px] lg:[--lb:64px] ${className ?? ""}`}>
        <Logo marca={marca} tom={tom} sizes="(min-width: 1024px) 240px, 160px" />
        <FocusBrackets tone={tom} offset={6} size={12} />
      </span>
    );
  }

  return (
    <div data-marca={marca.grupo} className={`group relative ${className ?? ""}`}>
      <div
        className={`relative grid aspect-[3/2] place-items-center overflow-visible rounded-r-md border transition-colors duration-300 [container-type:inline-size] ${
          claro ? "border-noite-950/10 bg-papel-100 group-hover:border-noite-950/25" : "border-noite-700 bg-noite-900 group-hover:border-papel-50/25"
        }`}
      >
        <div className="absolute inset-0 grid place-items-center overflow-clip rounded-r-md [--lb:28cqw]">
          {parallax ? <LogoParallax marca={marca} tom={tom} sizes="(min-width: 1024px) 480px, 240px" /> : <Logo marca={marca} tom={tom} sizes="(min-width: 1024px) 240px, 160px" />}
        </div>
        <FocusBrackets tone={tom} offset={8} />
      </div>
      {nome && (
        <p
          aria-hidden
          className={`rotulo mt-3 translate-y-1.5 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100 ${
            claro ? "text-grafite-600" : "text-papel-500"
          }`}
        >
          {marca.nome}
        </p>
      )}
    </div>
  );
}

/** Uso isolado no sandbox (shared/marcas/LogoTile). As seções importam o LogoTile nomeado. */
export default LogoTile;
