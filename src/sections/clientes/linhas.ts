/**
 * Quebra um título em n linhas de comprimento parecido (minimiza a linha mais longa, em caracteres).
 * Usado quando o texto de site.ts não traz as linhas prontas. Nada de texto literal no componente.
 */
export function quebrar(texto: string, n: number): string[] {
  const palavras = texto.split(" ");
  if (n <= 1 || palavras.length <= 1) return [texto];
  const k = Math.min(n, palavras.length);
  const comp = (i: number, j: number) => palavras.slice(i, j).join(" ").length;
  // melhor[i][l] = menor "linha mais longa" para as palavras i.. em l linhas
  const memo = new Map<string, { custo: number; corte: number }>();
  const resolver = (i: number, l: number): { custo: number; corte: number } => {
    const chave = `${i}:${l}`;
    const salvo = memo.get(chave);
    if (salvo) return salvo;
    let r = { custo: comp(i, palavras.length), corte: palavras.length };
    if (l > 1) {
      for (let j = i + 1; j <= palavras.length - (l - 1); j++) {
        const custo = Math.max(comp(i, j), resolver(j, l - 1).custo);
        if (custo < r.custo) r = { custo, corte: j };
      }
    }
    memo.set(chave, r);
    return r;
  };
  const linhas: string[] = [];
  let i = 0;
  for (let l = k; l >= 1 && i < palavras.length; l--) {
    const j = l === 1 ? palavras.length : resolver(i, l).corte;
    linhas.push(palavras.slice(i, j).join(" "));
    i = j;
  }
  return linhas;
}
