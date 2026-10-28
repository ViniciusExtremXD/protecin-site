/*
 * Geometria do diagrama isométrico "Camada por camada" (design-final §10.2.1), gerada em código.
 * Planta x 0–12, y 0–7; 4 níveis de pé-direito 3 (subsolo 0–3, térreo 3–6, 1º 6–9, 2º 9–12).
 * Projeção de 30° com unidade de 34 px: P(x,y,z) = [OX + (x − y)·34·0,866, OY + (x + y)·34·0,5 − z·34].
 * A spec usa a origem (520, 60), que joga o prédio para fora do viewBox (o topo cairia em y = −348): a origem
 * aqui é (560, 455), que centra o desenho em 1200×820 com folga embaixo à direita para o carimbo.
 */
export type V3 = readonly [number, number, number];

export const UNID = 34;
const COS30 = 0.866;
export const ORIGEM = { x: 560, y: 455 } as const;
/** A spec pede 0 0 1200 820; o prédio ocupa só 47% dessa largura, então a cena recorta as laterais vazias
 * (mesma altura) para o desenho ficar 18% maior na coluna de 8. */
export const VIEWBOX_CENA = { x: 214, y: 0, w: 880, h: 820 } as const;
/** Recorte justo no prédio (fluxo normal: celular, tablet, reduzido, sem JS). */
export const VIEWBOX_COMPACTO = { x: 326, y: 22, w: 612, h: 782 } as const;
export const vb = (v: { x: number; y: number; w: number; h: number }) => `${v.x} ${v.y} ${v.w} ${v.h}`;

export const NIVEIS = [0, 3, 6, 9] as const;
export const ALTURA = 12;
export const PLANTA = { x: 12, y: 7 } as const;

const r1 = (n: number) => Math.round(n * 10) / 10;

export function P([x, y, z]: V3): [number, number] {
  return [r1(ORIGEM.x + (x - y) * UNID * COS30), r1(ORIGEM.y + (x + y) * UNID * 0.5 - z * UNID)];
}

/** Polilinha aberta em coordenadas da planta. */
export function linha(...pts: V3[]): string {
  return pts.map((p, i) => `${i ? "L" : "M"} ${P(p).join(" ")}`).join(" ");
}

/** Polígono fechado. */
export function poligono(...pts: V3[]): string {
  return `${linha(...pts)} Z`;
}

/** Arco no plano do piso (z fixo) em volta de (cx, cy), de a0 a a1 graus (0° = +y, 90° = +x). */
export function arcoPiso(cx: number, cy: number, z: number, r: number, a0: number, a1: number, passos = 10): string {
  const pts: V3[] = [];
  for (let i = 0; i <= passos; i++) {
    const a = ((a0 + ((a1 - a0) * i) / passos) * Math.PI) / 180;
    pts.push([cx + r * Math.sin(a), cy + r * Math.cos(a), z]);
  }
  return linha(...pts);
}

// ---------------------------------------------------------------- camadas
/** Índice das camadas desenhadas: 0 = estrutura; 1..6 = C-01..C-06 (a fase "Engenharia" acende todas). */
export type CamadaIso = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CorTraco = "linha" | "brasa" | "fio" | "papel" | "rota";

export interface Traco {
  d: string;
  camada: CamadaIso;
  cor: CorTraco;
  largura: number;
  tracejado?: boolean;
  /** detalhe menor: some no recorte compacto (celular) */
  detalhe?: boolean;
}

export type TipoPicto = "extintor" | "abrigo" | "detector" | "acionador" | "painel" | "cilindro" | "porta" | "placa";

export interface Picto {
  id: string;
  camada: Exclude<CamadaIso, 0>;
  tipo: TipoPicto;
  /** índice em DIAGRAMA.camadas[camada-1].itens (nome do tooltip) */
  item: number;
  /** ponto de ancoragem já projetado */
  x: number;
  y: number;
  /** contorno projetado para os pictogramas que vivem num plano (abrigo, painel, porta, placa) */
  d?: string;
  extra?: string;
}

const tracos: Traco[] = [];
const pictos: Picto[] = [];
const t = (camada: CamadaIso, cor: CorTraco, largura: number, d: string, op: Partial<Traco> = {}) =>
  tracos.push({ camada, cor, largura, d, ...op });
const pic = (p: Omit<Picto, "x" | "y"> & { em: V3 }) => {
  const [x, y] = P(p.em);
  const { em: _em, ...resto } = p;
  pictos.push({ ...resto, x, y });
};

// ---- estrutura: lajes (preenchidas, ficam em LAJES), arestas verticais do corte e cobertura
export const LAJES: string[] = NIVEIS.map((z) => poligono([0, 0, z], [12, 0, z], [12, 7, z], [0, 7, z]));
export const PAREDES = {
  fundoX: poligono([0, 0, 0], [12, 0, 0], [12, 0, ALTURA], [0, 0, ALTURA]),
  fundoY: poligono([0, 0, 0], [0, 7, 0], [0, 7, ALTURA], [0, 0, ALTURA]),
};
NIVEIS.forEach((z) => t(0, "linha", 1, poligono([0, 0, z], [12, 0, z], [12, 7, z], [0, 7, z])));
t(0, "linha", 1, poligono([0, 0, ALTURA], [12, 0, ALTURA], [12, 7, ALTURA], [0, 7, ALTURA]));
t(0, "linha", 1, linha([0, 0, 0], [0, 0, ALTURA]));
t(0, "linha", 1, linha([12, 0, 0], [12, 0, ALTURA]));
t(0, "linha", 1, linha([0, 7, 0], [0, 7, ALTURA]));
// arestas da frente do corte, tracejadas (o prédio continua além do corte)
t(0, "linha", 1, linha([12, 7, 0], [12, 7, ALTURA]), { tracejado: true, detalhe: true });

// ---- C-01 extintores: (2,0,z+1,2) e (8,0,z+1,2) em cada nível
NIVEIS.forEach((z, n) => {
  pic({ id: `ext-a-${n}`, camada: 1, tipo: "extintor", item: 0, em: [2, 0, z + 1.2] });
  pic({ id: `ext-b-${n}`, camada: 1, tipo: "extintor", item: 0, em: [8, 0, z + 1.2] });
});

// ---- C-02 hidrantes: prumada de baixo para cima, ramal no teto do subsolo, abrigos e reservatório
t(2, "brasa", 2.5, linha([11, 0, 0], [11, 0, ALTURA]));
t(2, "brasa", 2, linha([11, 0, 2.8], [0, 0, 2.8]));
NIVEIS.forEach((z, n) => {
  // ramal curto da prumada até o abrigo
  t(2, "brasa", 1.5, linha([11, 0, z + 2.4], [10.7, 0, z + 2.4], [10.7, 0, z + 2.2]), { detalhe: true });
  pic({
    id: `abrigo-${n}`,
    camada: 2,
    tipo: "abrigo",
    item: 0,
    em: [10.7, 0, z + 1.5],
    d: poligono([10.2, 0, z + 0.8], [11.2, 0, z + 0.8], [11.2, 0, z + 2.2], [10.2, 0, z + 2.2]),
  });
});
// reservatório (cilindro vertical em (11,5; 0,5; 0), raio 0,4 e altura 1,6) desenhado como traço
{
  const [cx, cy] = P([11.5, 0.5, 0]);
  const [, topo] = P([11.5, 0.5, 1.6]);
  const rx = 0.4 * UNID * 1.22;
  const ry = 0.4 * UNID * 0.71;
  t(
    2,
    "brasa",
    1.5,
    `M ${r1(cx - rx)} ${topo} L ${r1(cx - rx)} ${cy} A ${r1(rx)} ${r1(ry)} 0 0 0 ${r1(cx + rx)} ${cy} L ${r1(cx + rx)} ${topo} ` +
      `A ${r1(rx)} ${r1(ry)} 0 0 0 ${r1(cx - rx)} ${topo} A ${r1(rx)} ${r1(ry)} 0 0 0 ${r1(cx + rx)} ${topo}`,
  );
  t(2, "brasa", 1.5, linha([11.5, 0.5, 1.6], [11.5, 0.5, 2.1], [11, 0, 2.1]), { detalhe: true });
}

// ---- C-03 alarme: detectores no teto de cada nível, fios até (0,5; 0; teto), tronco e painel central
const DETECTORES: [number, number][] = [
  [3, 3],
  [7, 3],
  [10, 5],
];
NIVEIS.forEach((z, n) => {
  const h = z + 2.9;
  DETECTORES.forEach(([x, y], i) => {
    t(3, "fio", 1.25, linha([x, y, h], [x, 0, h], [0.5, 0, h]), { tracejado: true });
    pic({ id: `det-${n}-${i}`, camada: 3, tipo: "detector", item: 0, em: [x, y, h] });
  });
  pic({ id: `acion-${n}`, camada: 3, tipo: "acionador", item: 1, em: [5, 0, z + 1.3] });
  t(3, "fio", 1, linha([5, 0, z + 1.5], [5, 0, h]), { tracejado: true, detalhe: true });
});
t(3, "fio", 1.25, linha([0.5, 0, 11.9], [0.5, 0, 2.9]), { tracejado: true });
t(3, "fio", 1.25, linha([0.5, 0, 4.2], [0.75, 0, 4.2]));
pic({
  id: "painel",
  camada: 3,
  tipo: "painel",
  item: 2,
  em: [1.15, 0, 4.2],
  d: poligono([0.75, 0, 3.75], [1.55, 0, 3.75], [1.55, 0, 4.65], [0.75, 0, 4.65]),
});

// ---- C-04 supressão: sala técnica no subsolo (x 0–4, y 4–7), 6 cilindros, coletor e rede no teto do subsolo
t(4, "brasa", 1, poligono([4, 4, 0], [4, 7, 0], [4, 7, 3], [4, 4, 3]), { detalhe: true });
t(4, "brasa", 1, poligono([0, 4, 0], [4, 4, 0], [4, 4, 3], [0, 4, 3]), { detalhe: true });
const CILINDROS = [0.6, 1.2, 1.8, 2.4, 3.0, 3.6];
CILINDROS.forEach((x, i) => {
  pic({ id: `cil-${i}`, camada: 4, tipo: "cilindro", item: 0, em: [x, 6.4, 0], extra: linha([x, 6.4, 0.15], [x, 6.4, 1.45]) });
  t(4, "brasa", 1.25, linha([x, 6.4, 1.6], [x, 6.4, 1.8]), { detalhe: true });
});
t(4, "brasa", 2.5, linha([0.6, 6.4, 1.8], [3.6, 6.4, 1.8], [4.2, 6.4, 1.8], [4.2, 6.4, 2.9], [4.2, 6, 2.9]));
const REDE_Y = [1, 2.25, 3.5, 4.75, 6];
t(4, "brasa", 2, linha([4.2, 6, 2.9], [4.2, 1, 2.9]));
REDE_Y.forEach((y) => t(4, "brasa", 1.5, linha([4.2, y, 2.9], [12, y, 2.9])));
/** bicos de sprinkler: ticks de 4 px para baixo nas interseções */
export const BICOS: [number, number][] = REDE_Y.flatMap((y) => [6, 8, 10].map((x) => P([x, y, 2.9])));

// ---- C-05 portas corta-fogo: núcleo de escada em x 0, y 5–7; porta 0,9×2,1 em (0; 5,5; z) com o arco de abertura
t(5, "papel", 1, poligono([0, 5, 0], [0, 7, 0], [0, 7, ALTURA], [0, 5, ALTURA]), { tracejado: true, detalhe: true });
NIVEIS.forEach((z, n) => {
  // lances da escada no plano da parede (zigue-zague por nível)
  t(5, "papel", 1, linha([0, 5.1, z], [0, 6.9, z + 1.5], [0, 5.1, z + 3]), { detalhe: true });
  pic({
    id: `porta-${n}`,
    camada: 5,
    tipo: "porta",
    item: 0,
    em: [0, 5.95, z + 1.05],
    d: poligono([0, 5.5, z], [0, 6.4, z], [0, 6.4, z + 2.1], [0, 5.5, z + 2.1]),
    extra: arcoPiso(0, 5.5, z, 0.9, 0, 90),
  });
});

// ---- C-06 sinalização: placa acima de cada porta e rota de fuga tracejada no piso, com setas a cada 1,5
const ROTA_DE: [number, number] = [10, 4];
const ROTA_ATE: [number, number] = [1, 5.5];
NIVEIS.forEach((z, n) => {
  t(6, "rota", 1.5, linha([ROTA_DE[0], ROTA_DE[1], z], [ROTA_ATE[0], ROTA_ATE[1], z], [0.15, 5.95, z]), { tracejado: true });
  const dx = ROTA_ATE[0] - ROTA_DE[0];
  const dy = ROTA_ATE[1] - ROTA_DE[1];
  const comp = Math.hypot(dx, dy);
  const ux = dx / comp;
  const uy = dy / comp;
  for (let s = 1.5; s < comp - 0.4; s += 1.5) {
    const cx = ROTA_DE[0] + ux * s;
    const cy = ROTA_DE[1] + uy * s;
    // chevron apontando para a saída, no plano do piso
    const a = 0.32;
    t(
      6,
      "rota",
      1.5,
      linha([cx - ux * a - uy * a, cy - uy * a + ux * a, z], [cx, cy, z], [cx - ux * a + uy * a, cy - uy * a - ux * a, z]),
      { detalhe: true },
    );
  }
  pic({
    id: `placa-${n}`,
    camada: 6,
    tipo: "placa",
    item: 0,
    em: [0, 5.95, z + 2.55],
    d: poligono([0, 5.45, z + 2.35], [0, 6.45, z + 2.35], [0, 6.45, z + 2.78], [0, 5.45, z + 2.78]),
  });
});

export const TRACOS: readonly Traco[] = tracos;
export const PICTOS: readonly Picto[] = pictos;

// ---------------------------------------------------------------- câmera
/** Pontos focais de cada camada (C-01..C-06), já projetados. */
export const FOCOS: readonly [number, number][] = (
  [
    [6, 0, 6],
    [11, 0, 6],
    [6, 3, 8],
    [2, 6, 1],
    [0, 6, 6],
    [5, 4, 4],
  ] as V3[]
).map(P);

export const CENTRO: [number, number] = [VIEWBOX_CENA.x + VIEWBOX_CENA.w / 2, VIEWBOX_CENA.y + VIEWBOX_CENA.h / 2];

/** Caixa do prédio projetado (para a câmera não empurrar o desenho para fora do quadro). */
export const LIMITES = (() => {
  const cantos = [0, 12].flatMap((x) => [0, 7].flatMap((y) => [0, ALTURA].map((z) => P([x, y, z]))));
  return {
    x0: Math.min(...cantos.map((c) => c[0])),
    x1: Math.max(...cantos.map((c) => c[0])),
    y0: Math.min(...cantos.map((c) => c[1])),
    y1: Math.max(...cantos.map((c) => c[1])),
  };
})();
/** Quanto o desenho pode passar da borda do viewBox na cena (o SVG tem overflow visível e folga embaixo). */
const FOLGA = 36;

/**
 * Atributo transform do grupo câmera: escala s em volta do foco, que anda uma fração do caminho até o centro.
 * A translação é limitada para o prédio não sair do quadro mais que FOLGA (ele tem 731 de altura: a 1,12× já
 * ocupa a altura toda do viewBox, então o movimento vertical é pequeno e o horizontal faz o resto).
 */
export function transformCamera(s: number, foco: [number, number], puxa = 0.35): string {
  const k = Math.max(0, (s - 1) / 0.12);
  const dx = (CENTRO[0] - foco[0]) * puxa * k;
  const dy = (CENTRO[1] - foco[1]) * puxa * k;
  const lim = (v: number, a: number, b: number) => (a > b ? (a + b) / 2 : Math.min(b, Math.max(a, v)));
  const v = VIEWBOX_CENA;
  const tx = lim(foco[0] * (1 - s) + dx, v.x - FOLGA - s * LIMITES.x0, v.x + v.w + FOLGA - s * LIMITES.x1);
  const ty = lim(foco[1] * (1 - s) + dy, v.y - FOLGA - s * LIMITES.y0, v.y + v.h + FOLGA - s * LIMITES.y1);
  return `translate(${r1(tx)} ${r1(ty)}) scale(${Math.round(s * 1000) / 1000})`;
}
