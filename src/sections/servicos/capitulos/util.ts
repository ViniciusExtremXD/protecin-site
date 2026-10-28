/*
 * Utilitários da unidade "servicos" (H3 da home e capítulos de /servicos/). Sem React.
 */
import { IMAGENS, type ImagemId } from "../../../data/imagens.gen";
import { SERVICOS } from "../../../data/site";

/** "08": total de serviços com 2 dígitos (o "0i / 08" dos cartões e capítulos). */
export const TOTAL_SERVICOS = String(SERVICOS.length).padStart(2, "0");

/**
 * Divide um título em `n` linhas com comprimentos parecidos (sem palavra órfã na última linha).
 * Busca exaustiva pequena: os títulos têm no máximo ~8 palavras.
 */
export function linhasEquilibradas(texto: string, n: number): string[] {
  const palavras = texto.split(/\s+/).filter(Boolean);
  if (n <= 1 || palavras.length <= 1) return [palavras.join(" ")];
  const k = Math.min(n, palavras.length);
  let melhor: string[] = [palavras.join(" ")];
  let pior = Infinity;
  const cortes = (inicio: number, resto: number, acc: string[]) => {
    if (resto === 1) {
      const linhas = [...acc, palavras.slice(inicio).join(" ")];
      const maior = Math.max(...linhas.map((l) => l.length));
      if (maior < pior) {
        pior = maior;
        melhor = linhas;
      }
      return;
    }
    for (let fim = inicio + 1; fim <= palavras.length - (resto - 1); fim++) cortes(fim, resto - 1, [...acc, palavras.slice(inicio, fim).join(" ")]);
  };
  cortes(0, k, []);
  return melhor;
}

/** Quantas linhas um título pede para caber em ~`max` caracteres por linha. */
export function linhasPara(texto: string, max: number): string[] {
  return linhasEquilibradas(texto, Math.max(1, Math.ceil(texto.length / max)));
}

/** Crédito da imagem pelo registro gerado (acervo = foto real; o resto é banco = ilustrativa). */
export function creditoDe(id: ImagemId): "acervo" | "ilustrativa" {
  return IMAGENS[id].credito === "acervo" ? "acervo" : "ilustrativa";
}

export function altDe(id: ImagemId): string {
  return IMAGENS[id].alt;
}

/**
 * Redesenha um DrawIcon (mesma sequência de classes que a primitiva usa no próprio hover), para disparar o traço
 * a partir do hover de um ancestral que não pode ser `.group` (o `.group` faria os TextRoll dos botões rolarem).
 */
export function redesenhar(raiz: HTMLElement | null): void {
  const el = raiz?.querySelector<HTMLElement>(".draw.is-drawn");
  if (!el) return;
  el.classList.add("draw-reset");
  el.classList.remove("is-drawn");
  void el.getBoundingClientRect();
  el.classList.remove("draw-reset");
  el.classList.add("is-drawn");
}
