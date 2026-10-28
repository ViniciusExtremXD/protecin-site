import type { ImagemId } from "../../../data/imagens.gen";
import { UI } from "../../../data/site";
import { Img } from "../../../components/ui/Img";
import { altDe } from "./util";

export interface FotoProps {
  id: ImagemId;
  /** proporção do quadro, próxima da original (sobriedade §4): "3/2" ou "16/10" */
  aspect: string;
  /** largura EXIBIDA do quadro, como no CSS: o Img soma o recorte do object-cover, o zoom e a densidade mínima */
  sizes: string;
  credito: "acervo" | "ilustrativa";
  /** false: o crédito fica só para leitor de tela (quem chama mostra uma linha de crédito do conjunto) */
  creditoVisivel?: boolean;
  posicao?: string;
  /** classes do quadro (largura, raio) */
  className?: string;
  /** zoom do hover, ligado ao grupo nomeado de quem chama (ex.: "group-hover/card:scale-[1.03]") */
  zoom?: string;
}

/**
 * Foto de serviço: quadro em paisagem com object-cover, zoom curto (1,03) no hover do grupo e o crédito discreto no
 * canto, em texto pequeno e sem caixa alta ("Imagem ilustrativa" nas fotos de banco, "Foto do acervo Protecin" nas
 * reais), ou só para leitor de tela.
 */
export function Foto({ id, aspect, sizes, credito, creditoVisivel = true, posicao, className, zoom }: FotoProps) {
  const texto = credito === "acervo" ? UI.fotoAcervo : UI.imagemIlustrativa;
  const [w, h] = aspect.split("/").map(Number);
  return (
    <figure className={`relative overflow-hidden bg-noite-800 ${className ?? ""}`} style={{ aspectRatio: aspect }}>
      <Img
        id={id}
        alt={altDe(id)}
        sizes={sizes}
        position={posicao}
        frame={w / h}
        zoom={zoom ? 1.03 : 1}
        className="absolute inset-0 h-full w-full"
        imgClassName={`h-full w-full object-cover transition-transform duration-700 ease-out ${zoom ?? ""}`}
      />
      {creditoVisivel ? (
        <figcaption className="absolute bottom-2.5 left-2.5 rounded-[4px] bg-noite-950/55 px-2 py-1 text-[13px] leading-none text-papel-100/85">
          {texto}
        </figcaption>
      ) : (
        <figcaption className="sr-only">{texto}</figcaption>
      )}
    </figure>
  );
}
