import { useId, type CSSProperties } from "react";
import { AUTORIZADAS, GRUPOS_MARCAS, type Marca } from "../../../data/site";
import { IMAGENS } from "../../../data/imagens.gen";
import { Reveal, RevealGroup, RevealItem } from "../../../components/motion";
import { Img } from "../../../components/ui/Img";

/*
 * Logo de fabricante ou entidade (design-final §9 H2 e §10.3; sobriedade §3). Nunca de cliente: o grupo vai em
 * data-marca ("autorizada" | "marca" | "filiacao") para o verify conferir que "Autorizada" só aparece junto das
 * quatro autorizações.
 *
 * O tamanho do logo é normalizado pela área (largura = base × √proporção, altura = base ÷ √proporção), para logos
 * largos e logos quadrados pesarem igual. Em repouso: tons de cinza; hover ou foco no pai (.group): cor original.
 * Sem cantoneiras, sem nome que aparece no hover, sem rótulo repetido entre logos.
 */

export interface LogoTileProps {
  marca?: Marca;
  variante?: "ladrilho" | "fita"; // ladrilho 3:2 com borda fina (grades) ou só o logo numa célula (faixas)
  tom?: "claro" | "escuro";
  className?: string;
}

// Base do logo (lado de um quadrado de mesma área), em px: faixa no celular e no desktop.
const BASE = { fita: [40, 50], ladrilho: [44, 56] } as const;

const raiz = (marca: Marca) => {
  const info = IMAGENS[marca.imagem];
  return Math.sqrt(info.w / info.h);
};

/** Proporção do arquivo → largura/altura relativas à base (CSS var --lb). */
function medidas(marca: Marca): CSSProperties {
  const r = raiz(marca);
  return { width: `calc(var(--lb) * ${r.toFixed(3)})`, height: `calc(var(--lb) / ${r.toFixed(3)})` };
}

/** `sizes` pela largura exibida do logo (o Img já reforça a densidade nas telas de DPR baixo). */
function sizesDe(marca: Marca, base: readonly [number, number]): string {
  const r = raiz(marca);
  return `(min-width: 1024px) ${Math.ceil(base[1] * r)}px, ${Math.ceil(base[0] * r)}px`;
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
        imgClassName="h-full w-full object-contain opacity-75 grayscale transition-[filter,opacity] duration-300 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-focus-within:opacity-100 group-focus-within:grayscale-0"
      />
    </span>
  );
}

export function LogoTile({ marca = AUTORIZADAS[0], variante = "ladrilho", tom = "claro", className }: LogoTileProps) {
  const claro = tom === "claro";

  if (variante === "fita") {
    return (
      <span
        data-marca={marca.grupo}
        className={`group flex h-14 items-center justify-center px-1.5 [--lb:clamp(26px,8vw,34px)] sm:h-[72px] sm:px-3 sm:[--lb:40px] lg:h-[96px] lg:[--lb:50px] ${className ?? ""}`}
      >
        <Logo marca={marca} tom={tom} sizes={sizesDe(marca, BASE.fita)} />
      </span>
    );
  }

  return (
    <div
      data-marca={marca.grupo}
      className={`group grid aspect-[3/2] place-items-center rounded-xl border transition-colors duration-300 [--lb:44px] lg:[--lb:56px] ${
        claro ? "border-noite-950/10 bg-papel-50 hover:border-noite-950/25" : "border-papel-50/10 bg-noite-900 hover:border-papel-50/25"
      } ${className ?? ""}`}
    >
      <Logo marca={marca} tom={tom} sizes={sizesDe(marca, BASE.ladrilho)} />
    </div>
  );
}

export interface FaixaMarcasProps {
  grupo: "autorizada" | "marca" | "filiacao";
  itens: Marca[];
  tom?: "claro" | "escuro";
  titulo?: "h3" | "p";
}

/**
 * Uma linha da tabela de marcas: o nome do grupo à esquerda (no celular, em cima) e os logos em 4 células iguais
 * (também no celular, com o logo menor: uma linha por grupo). As linhas se empilham separadas por régua fina; quem usa fecha a última com border-b.
 * Parada: sem letreiro correndo, sem rótulo entre os logos (o nome do grupo já diz o que são).
 */
export function FaixaMarcas({ grupo, itens, tom = "claro", titulo: Titulo = "h3" }: FaixaMarcasProps) {
  const id = useId();
  const claro = tom === "claro";
  return (
    <div
      role="group"
      aria-labelledby={id}
      className={`grid grid-cols-1 border-t py-4 sm:py-5 lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:py-0 ${claro ? "border-noite-950/10" : "border-papel-50/10"}`}
    >
      <Reveal y={16} className="lg:col-span-3">
        <Titulo id={id} className={`text-[16px] font-semibold leading-snug ${claro ? "text-noite-950" : "text-papel-50"}`}>
          {GRUPOS_MARCAS[grupo].titulo}
        </Titulo>
      </Reveal>
      <RevealGroup as="ul" stagger={0.05} className="mt-1 grid grid-cols-4 lg:col-span-9 lg:mt-0">
        {itens.map((m, i) => (
          <RevealItem key={m.id} as="li" index={i}>
            <LogoTile marca={m} variante="fita" tom={tom} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

/** Uso isolado no sandbox (shared/marcas/LogoTile). As seções importam o LogoTile e a FaixaMarcas nomeados. */
export default LogoTile;
