/*
 * Utilitários da unidade "servicos" (H3 da home e capítulos de /servicos/). Sem React.
 */
import { IMAGENS, type ImagemId } from "../../../data/imagens.gen";
import type { Servico } from "../../../data/site";

/** Crédito da imagem pelo registro gerado (acervo = foto real; o resto é banco = ilustrativa). */
export function creditoDe(id: ImagemId): "acervo" | "ilustrativa" {
  return IMAGENS[id].credito === "acervo" ? "acervo" : "ilustrativa";
}

export function altDe(id: ImagemId): string {
  return IMAGENS[id].alt;
}

export interface FotoServico {
  id: ImagemId;
  credito: "acervo" | "ilustrativa";
  posicao?: string;
}

/**
 * Foto principal do capítulo em /servicos/: a foto real do acervo quando o serviço tem uma (a régua pede as fotos
 * reais primeiro; hoje só o 08, com a parede de sistemas enquadrada nas placas), senão a foto do serviço.
 */
export function fotoDoCapitulo(s: Servico): FotoServico {
  if (s.imagem2 && (s.imagem2Credito ?? creditoDe(s.imagem2)) === "acervo") return { id: s.imagem2, credito: "acervo", posicao: s.imagem2Posicao };
  return { id: s.imagem, credito: creditoDe(s.imagem) };
}
