/*
 * Tipografia sóbria das seções da unidade FIM (rodada 2, qa/AJUSTES-SOBRIEDADE.md §3).
 * Local de propósito: as classes display-* da base ainda chegam a 128 px; aqui o H2 para em ~64 px no desktop e
 * fica em 34 px no celular, e o H1 das aberturas internas para em 72 px. Arquivo .ts: o sandbox não lista.
 */

/** H2 em caixa alta condensada (títulos curtos, até 3 linhas). */
export const H2 = "stretch-66 text-[clamp(2.125rem,4.2vw,4rem)] font-[800] uppercase leading-[0.95] text-balance";

/** H2 em caixa baixa, para títulos longos (frases) que passariam de 3 linhas em caixa alta. */
export const H2_FRASE = "stretch-75 text-[clamp(1.875rem,3.3vw,3.25rem)] font-[750] leading-[1.04] text-balance";

/** H1 das aberturas de Contato, Catálogo, Créditos e 404. */
export const H1_PAGINA = "stretch-66 text-[clamp(2.5rem,5vw,4.5rem)] font-[800] uppercase leading-[0.92] text-balance";

/** Título de bloco (H3) dentro das seções. */
export const H3 = "text-[20px] font-semibold leading-snug lg:text-[22px]";
