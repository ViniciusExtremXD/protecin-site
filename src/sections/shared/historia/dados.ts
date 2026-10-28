import { TIMELINE, type Marco } from "../../../data/site";

/*
 * Dados da linha do tempo (H7) com a correção de texto que o site.ts ainda não tem.
 *
 * Marco de 2021: no site atual a frase está truncada ("software próprio para combate e rastreabilidade dos
 * equipamentos de combate a incêndio"; qa/RELATORIO-SITE-ATUAL.md, item 14). A correção troca só a palavra
 * repetida por "controle", que é o que o software faz (conteudo-estruturado §3: controle de extintores e
 * hidrantes). Nenhum fato novo. [confirmar com a Protecin]
 * Se o site.ts for corrigido, o texto de lá passa a valer (a troca só acontece com a frase antiga).
 */
const TRUNCADO_2021 = "para combate e rastreabilidade";
export const TEXTO_2021 =
  "Inovação na gestão com o desenvolvimento e implantação de software próprio para controle e rastreabilidade dos equipamentos de combate a incêndio.";

export const MARCOS: Marco[] = TIMELINE.marcos.map((m) =>
  m.ano === 2021 && m.texto.includes(TRUNCADO_2021) ? { ...m, texto: TEXTO_2021 } : { ...m },
);

/**
 * Título curto de cada marco, em caixa baixa (os rótulos editoriais do site.ts, que estão em caixa alta para o
 * mono; a rodada de sobriedade deixa um só rótulo mono por seção). Sem fato novo: é o mesmo rótulo.
 */
const PROPRIOS = ["Protecin", "Engenharia"];
export function tituloMarco(m: Marco): string {
  return m.rotulo
    .toLowerCase()
    .split(" ")
    .map((p, i) => {
      const proprio = PROPRIOS.find((x) => x.toLowerCase() === p);
      if (proprio) return proprio;
      return i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p;
    })
    .join(" ");
}

/** Texto de interface dos nós da linha do tempo (botões que rolam até o ano). */
export const irParaAno = (ano: number) => `Ir para ${ano}`;
