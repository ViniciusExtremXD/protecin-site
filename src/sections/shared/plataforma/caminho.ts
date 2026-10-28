/*
 * Caminhos da plataforma: curvas cúbicas descritas uma vez só, das quais saem o atributo `d` do SVG e os
 * pontos pré-calculados (espaçados por comprimento de arco) por onde andam o chip e os pacotes de dados.
 * Matemática pura: segura no SSR, sem getPointAtLength e sem DOM.
 */
export type Ponto = readonly [number, number];
/** Segmento cúbico: início, controle 1, controle 2, fim. Uma reta é um cúbico com controles nas pontas. */
export type Segmento = readonly [Ponto, Ponto, Ponto, Ponto];

const fmt = (n: number) => Math.round(n * 10) / 10;

/** Atributo `d` contínuo (os segmentos precisam se encostar). */
export function dDe(segs: readonly Segmento[]): string {
  if (!segs.length) return "";
  const [p0] = segs[0];
  return segs.reduce(
    (acc, [, c1, c2, p1]) => `${acc} C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(p1[0])} ${fmt(p1[1])}`,
    `M${fmt(p0[0])} ${fmt(p0[1])}`,
  );
}

function bezier([p0, c1, c2, p1]: Segmento, t: number): [number, number] {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * p0[0] + b * c1[0] + c * c2[0] + d * p1[0], a * p0[1] + b * c1[1] + c * c2[1] + d * p1[1]];
}

/** `n` pontos igualmente espaçados ao longo do caminho inteiro (amostragem densa + reparametrização). */
export function amostrar(segs: readonly Segmento[], n = 100): [number, number][] {
  const denso: [number, number][] = [];
  const passos = 48;
  segs.forEach((s, i) => {
    for (let k = i === 0 ? 0 : 1; k <= passos; k++) denso.push(bezier(s, k / passos));
  });
  const acumulado = [0];
  for (let i = 1; i < denso.length; i++) {
    const dx = denso[i][0] - denso[i - 1][0];
    const dy = denso[i][1] - denso[i - 1][1];
    acumulado.push(acumulado[i - 1] + Math.hypot(dx, dy));
  }
  const total = acumulado[acumulado.length - 1] || 1;
  const saida: [number, number][] = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const alvo = (k / (n - 1)) * total;
    while (j < acumulado.length - 1 && acumulado[j] < alvo) j++;
    const a = acumulado[j - 1];
    const b = acumulado[j];
    const f = b > a ? (alvo - a) / (b - a) : 0;
    saida.push([denso[j - 1][0] + (denso[j][0] - denso[j - 1][0]) * f, denso[j - 1][1] + (denso[j][1] - denso[j - 1][1]) * f]);
  }
  return saida;
}

/** O mesmo caminho percorrido ao contrário. */
export function inverter(segs: readonly Segmento[]): Segmento[] {
  return [...segs].reverse().map(([p0, c1, c2, p1]) => [p1, c2, c1, p0] as const);
}

/** Reta como segmento cúbico. */
export function reta(a: Ponto, b: Ponto): Segmento {
  return [a, a, b, b];
}
