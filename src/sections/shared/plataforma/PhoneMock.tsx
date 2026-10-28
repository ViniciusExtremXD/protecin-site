import type { ReactNode } from "react";

/** Medidas de projeto do aparelho (px). Quem usa escala o conjunto inteiro (CaixaEscalada), nunca o texto. */
export const PHONE = { w: 300, h: 620, borda: 10, tela: { w: 280, h: 600 } } as const;

const MOLDURA = "#0B0F15"; // §9 H5: borda de 10 px #0B0F15

/**
 * Celular em CSS (§9 H5): 300 × 620, raio de 44 px, borda de 10 px e ilha de 90 × 26. A tela recorta o conteúdo
 * (Reel das telas); `overlay` fica fora do recorte, para peças que saem do aparelho (o cartão do relatório).
 * É ilustração: vai com aria-hidden e o conteúdo real fica no texto dos pilares.
 */
export function PhoneMock({ children, overlay, className }: { children: ReactNode; overlay?: ReactNode; className?: string }) {
  return (
    <div aria-hidden className={`relative ${className ?? ""}`} style={{ width: PHONE.w, height: PHONE.h }}>
      {/* botões laterais */}
      <span className="absolute -left-[3px] top-[118px] h-[30px] w-[3px] rounded-l-[2px]" style={{ background: MOLDURA }} />
      <span className="absolute -left-[3px] top-[166px] h-[54px] w-[3px] rounded-l-[2px]" style={{ background: MOLDURA }} />
      <span className="absolute -left-[3px] top-[230px] h-[54px] w-[3px] rounded-l-[2px]" style={{ background: MOLDURA }} />
      <span className="absolute -right-[3px] top-[190px] h-[86px] w-[3px] rounded-r-[2px]" style={{ background: MOLDURA }} />
      <div
        className="absolute inset-0 rounded-[44px] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.85),0_0_0_1px_rgba(157,184,208,0.22)]"
        style={{ background: MOLDURA, padding: PHONE.borda }}
      >
        <div className="relative h-full w-full overflow-clip rounded-[34px] bg-papel-100">
          {children}
          <span className="absolute left-1/2 top-[10px] z-20 h-[26px] w-[90px] -translate-x-1/2 rounded-full" style={{ background: MOLDURA }} />
        </div>
      </div>
      {overlay && (
        <div className="pointer-events-none absolute z-30" style={{ left: PHONE.borda, top: PHONE.borda, width: PHONE.tela.w, height: PHONE.tela.h }}>
          {overlay}
        </div>
      )}
    </div>
  );
}
