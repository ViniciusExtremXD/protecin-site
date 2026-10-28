import type { ReactNode, SVGProps } from "react";

/*
 * Glifos de marcas sociais desenhados em traço de 1,5 no grid de 24, para combinar com a lucide
 * (que não tem mais ícones de marca). currentColor, sem preenchimento.
 */
type GlifoProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number; strokeWidth?: number };

function Base({ size = 24, strokeWidth = 1.5, ...rest }: GlifoProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...rest}
    />
  );
}

export function GlifoWhatsApp(p: GlifoProps) {
  return (
    <Base {...p}>
      <path d="M20.5 11.75a8.5 8.5 0 0 1-12.64 7.43L3.5 20.5l1.36-4.25A8.5 8.5 0 1 1 20.5 11.75Z" />
      <path d="M9.05 8.25c.18-.4.47-.55.8-.55h.47c.2 0 .38.12.46.31l.66 1.6c.08.2.04.43-.1.6l-.53.62a.4.4 0 0 0-.05.45 6.1 6.1 0 0 0 2.6 2.6.4.4 0 0 0 .45-.05l.62-.53c.17-.14.4-.18.6-.1l1.6.66c.19.08.31.26.31.46v.47c0 .33-.15.62-.55.8-.66.3-1.4.38-2.12.2a7.4 7.4 0 0 1-5.32-5.32c-.18-.72-.1-1.46.2-2.12Z" />
    </Base>
  );
}

export function GlifoInstagram(p: GlifoProps) {
  return (
    <Base {...p}>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.25 6.75h.01" />
    </Base>
  );
}

export function GlifoLinkedIn(p: GlifoProps) {
  return (
    <Base {...p}>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="3" />
      <path d="M8 10.5V16.5" />
      <path d="M8 7.5h.01" />
      <path d="M11.5 16.5v-6" />
      <path d="M11.5 13.25a2.75 2.75 0 0 1 5.5 0v3.25" />
    </Base>
  );
}
