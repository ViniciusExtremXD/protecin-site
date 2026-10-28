import type { ReactNode } from "react";

/** Container do site: até 1440 px, margem lateral 20 / 32 (≥ 768) / 48 (≥ 1024) / 64 px (≥ 1280). */
export function Container({ as: Tag = "div", className, children, id }: { as?: "div" | "section" | "header" | "footer" | "nav"; className?: string; children: ReactNode; id?: string }) {
  return (
    <Tag id={id} className={`mx-auto w-full max-w-container px-5 md:px-8 lg:px-12 xl:px-16 ${className ?? ""}`}>
      {children}
    </Tag>
  );
}

/** Grade de 4 / 8 / 12 colunas (gutter 16 / 24 px). */
export const GRADE = "grid grid-cols-4 gap-x-4 md:grid-cols-8 md:gap-x-6 lg:grid-cols-12";
