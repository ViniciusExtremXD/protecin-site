import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight, Download, Phone } from "lucide-react";
import { COMPANY, UI, type LeadLocation, type ServicoSlug } from "../../data/site";
import { Link, usePath } from "../../lib/router";
import { pushEvent, trackLead } from "../../lib/track";
import { buildWhatsAppUrl, mailtoUrl } from "../../lib/urls";
import { Magnetic } from "../motion/Magnetic";
import { TextRoll } from "../motion/TextRoll";

/*
 * CTAs e links de lead (padrão Extin Seven, design-final §13). Todo contato é um <a> de verdade
 * (wa.me, tel:, mailto:), com data-lead-channel / data-lead-location e lead_click no dataLayer.
 */
type TrackProps = { location: LeadLocation; detail?: string; extra?: Record<string, string> };
type Anchor = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function WhatsAppLink({ message, location, detail, extra, children, onClick, ...rest }: Anchor & TrackProps & { message?: string }) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-lead-channel="whatsapp"
      data-lead-location={location}
      data-lead-detail={detail}
      onClick={(e) => {
        trackLead("whatsapp", location, detail, extra);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function PhoneLink({ location, detail, extra, children, onClick, ...rest }: Anchor & TrackProps) {
  return (
    <a
      href={COMPANY.phoneTel}
      data-lead-channel="phone"
      data-lead-location={location}
      data-lead-detail={detail}
      onClick={(e) => {
        trackLead("phone", location, detail, extra);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function EmailLink({ location, detail, extra, email = COMPANY.email, subject, body, children, onClick, ...rest }: Anchor & TrackProps & { email?: string; subject?: string; body?: string }) {
  return (
    <a
      href={mailtoUrl(email, subject, body)}
      data-lead-channel="email"
      data-lead-location={location}
      data-lead-detail={detail}
      onClick={(e) => {
        trackLead("email", location, detail, extra);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------- botões (§5.4)
// Rodada de sobriedade: sem sombra colorida (glow vermelho) nos botões, ímã com teto de 0,08 (Magnetic) e
// clique que afunda só 2%.
type Visual = { size?: "md" | "sm"; full?: boolean; tone?: "escuro" | "claro"; className?: string };

const ALTURA = { md: "h-12 lg:h-[52px] px-6 text-botao", sm: "h-11 px-5 text-[15px] font-semibold" } as const;
const BASE =
  "group relative inline-flex select-none items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full transition-[transform,border-color,color] duration-[350ms] ease-out active:scale-[0.98]";

function Seta() {
  return (
    <span aria-hidden className="cta-seta relative -mr-1 block h-[18px] w-[18px] overflow-hidden">
      <ArrowUpRight size={18} strokeWidth={1.75} className="absolute inset-0 transition-transform duration-[350ms] ease-out group-hover:translate-x-[14px] group-hover:-translate-y-[14px]" />
      <ArrowUpRight size={18} strokeWidth={1.75} className="absolute inset-0 -translate-x-[14px] translate-y-[14px] transition-transform duration-[350ms] ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
    </span>
  );
}

function Varredura({ cor }: { cor: string }) {
  return <span aria-hidden className={`cta-varredura absolute inset-0 origin-left scale-x-0 transition-transform duration-[350ms] ease-out group-hover:scale-x-100 ${cor}`} />;
}

/** Envolve com Magnetic e escolhe o elemento: Link interno (to), <a> (href) ou <button>. */
function Casca({
  to,
  href,
  external,
  onClick,
  className,
  full,
  magnet = 0.08,
  children,
  extra,
}: {
  to?: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className: string;
  full?: boolean;
  magnet?: number;
  children: ReactNode;
  extra?: Record<string, string | undefined>;
}) {
  const el = to ? (
    <Link to={to} className={className} onClick={onClick} {...extra}>
      {children}
    </Link>
  ) : href ? (
    <a href={href} className={className} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...extra}>
      {children}
    </a>
  ) : (
    <button type="button" className={className} onClick={onClick} {...extra}>
      {children}
    </button>
  );
  return (
    <Magnetic strength={magnet} className={full ? "block w-full" : ""}>
      {el}
    </Magnetic>
  );
}

const focoClaro = "[--foco:#BE1E29]";

export function PrimaryCta({
  children,
  to,
  href,
  icon = "arrow",
  onClick,
  external,
  size = "md",
  full,
  tone = "escuro",
  className,
}: Visual & { children: string; to?: string; href?: string; icon?: "arrow" | "download" | "none"; onClick?: () => void; external?: boolean }) {
  return (
    <Casca
      to={to}
      href={href}
      external={external}
      onClick={onClick}
      full={full}
      className={`${BASE} ${ALTURA[size]} bg-brasa-500 text-white ${full ? "w-full" : ""} ${tone === "claro" ? focoClaro : ""} ${className ?? ""}`}
    >
      <Varredura cor="bg-brasa-600" />
      <TextRoll text={children} className="relative" />
      {icon === "arrow" && (
        <span className="relative block">
          <Seta />
        </span>
      )}
      {icon === "download" && <Download aria-hidden size={18} strokeWidth={1.75} className="relative transition-transform duration-[350ms] ease-out group-hover:translate-y-0.5" />}
    </Casca>
  );
}

const fantasma = (tone: "escuro" | "claro") =>
  tone === "claro"
    ? `border border-noite-950/30 text-noite-950 hover:border-noite-950/90 ${focoClaro}`
    : "border border-papel-50/30 text-papel-50 hover:border-papel-50/90";
const varreduraFantasma = (tone: "escuro" | "claro") => (tone === "claro" ? "bg-noite-950/[0.06]" : "bg-papel-50/[0.06]");

export function GhostCta({ children, to, href, icon = "arrow", size = "md", full, tone = "escuro", className }: Visual & { children: string; to?: string; href?: string; icon?: "arrow" | "none" }) {
  return (
    <Casca to={to} href={href} full={full} magnet={0.06} className={`${BASE} ${ALTURA[size]} ${fantasma(tone)} ${full ? "w-full" : ""} ${className ?? ""}`}>
      <Varredura cor={varreduraFantasma(tone)} />
      <TextRoll text={children} className="relative" />
      {icon === "arrow" && (
        <span className="relative block">
          <Seta />
        </span>
      )}
    </Casca>
  );
}

export function WhatsAppCta({ location, detail, extra, message, children = UI.falarWhatsapp, size = "md", full, tone = "escuro", className }: Visual & TrackProps & { message?: string; children?: string }) {
  return (
    <Magnetic strength={0.06} className={full ? "block w-full" : ""}>
      <WhatsAppLink
        location={location}
        detail={detail}
        extra={extra}
        message={message}
        className={`${BASE} ${ALTURA[size]} ${fantasma(tone)} ${full ? "w-full" : ""} ${className ?? ""}`}
      >
        <Varredura cor={varreduraFantasma(tone)} />
        <span aria-hidden className="ponto-wa relative h-2 w-2 rounded-full bg-whatsapp" />
        <TextRoll text={children} className="relative" />
      </WhatsAppLink>
    </Magnetic>
  );
}

export function PhoneCta({ location, detail, extra, children = COMPANY.phoneDisplay, size = "md", full, tone = "escuro", className }: Visual & TrackProps & { children?: string }) {
  return (
    <Magnetic strength={0.06} className={full ? "block w-full" : ""}>
      <PhoneLink location={location} detail={detail} extra={extra} className={`${BASE} ${ALTURA[size]} ${fantasma(tone)} ${full ? "w-full" : ""} ${className ?? ""}`}>
        <Varredura cor={varreduraFantasma(tone)} />
        <Phone aria-hidden size={17} strokeWidth={1.75} className="relative" />
        <TextRoll text={children} className="relative tnum" />
      </PhoneLink>
    </Magnetic>
  );
}

/** Evento que pré-marca o chip do serviço no formulário (#orcamento). */
export const EVENTO_SERVICO = "pt:servico";

/**
 * Leva ao orçamento. Na home: âncora #orcamento (e o serviço vai pelo evento "pt:servico");
 * fora dela: /contato/?servico=<slug>. Sempre form_open com o local do clique.
 */
export function OrcamentoCta({
  formLocation,
  servico,
  children = UI.solicitarOrcamento,
  icon = "arrow",
  size = "md",
  full,
  tone = "escuro",
  className,
}: Visual & { formLocation: string; servico?: ServicoSlug; children?: string; icon?: "arrow" | "none" }) {
  const naHome = usePath() === "/";
  const abrir = () => {
    pushEvent("form_open", { form_location: formLocation });
    if (naHome && servico) window.dispatchEvent(new CustomEvent(EVENTO_SERVICO, { detail: servico }));
  };
  const destino = naHome ? { href: "#orcamento" } : { to: `/contato/${servico ? `?servico=${servico}` : ""}` };
  return (
    <Casca
      {...destino}
      onClick={abrir}
      full={full}
      extra={{ "data-form-location": formLocation }}
      className={`${BASE} ${ALTURA[size]} bg-brasa-500 text-white ${full ? "w-full" : ""} ${tone === "claro" ? focoClaro : ""} ${className ?? ""}`}
    >
      <Varredura cor="bg-brasa-600" />
      <TextRoll text={children} className="relative" />
      {icon === "arrow" && (
        <span className="relative block">
          <Seta />
        </span>
      )}
    </Casca>
  );
}
