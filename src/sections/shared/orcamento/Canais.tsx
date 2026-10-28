import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { COMPANY, CONTATO, type IconeId, type LeadLocation } from "../../../data/site";
import { DrawIcon } from "../../../components/motion/DrawIcon";
import { RevealGroup, RevealItem } from "../../../components/motion/Reveal";
import { Rule } from "../../../components/motion/Rule";
import { EmailLink, PhoneLink, WhatsAppLink } from "../../../components/ui/cta";
import { GlifoWhatsApp } from "../../../components/ui/glifos";
import type { LucideIcon } from "../../../components/ui/icones";
import { pushEvent } from "../../../lib/track";

/*
 * Canais de contato do Orçamento (design-final §9 H10): cada canal é uma linha clicável com ícone que se desenha,
 * rótulo mono e valor. WhatsApp, telefone e e-mail são links de lead (data-lead-*, lead_click); o endereço leva o
 * "Como chegar" (map_directions_click) e o horário é só informação.
 */

export interface CanaisProps {
  /** lead_location dos links: "orcamento" (home) ou "pagina_contato". */
  location?: Extract<LeadLocation, "orcamento" | "pagina_contato">;
  /** Inclui falecom@protecin.com.br (página Contato). */
  email2?: boolean;
  /** "vermelho": sobre o mundo vermelho da home; "escuro": sobre noite-900. Padrão pelo location. */
  tone?: "vermelho" | "escuro";
  className?: string;
}

type Tom = "vermelho" | "escuro";
const CORES: Record<Tom, { regua: string; rotulo: string; icone: string; seta: string }> = {
  vermelho: { regua: "bg-papel-50/20", rotulo: "text-papel-50/80", icone: "border-papel-50/30", seta: "text-papel-50/70" },
  escuro: { regua: "bg-noite-700", rotulo: "text-papel-500", icone: "border-noite-600", seta: "text-papel-500" },
};

// o glifo do WhatsApp segue o contrato de traço da lucide (size, strokeWidth, currentColor), então o DrawIcon o desenha
const IconeWhatsApp = GlifoWhatsApp as unknown as LucideIcon;

const sublinhado =
  "pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 ease-out group-hover:scale-x-100 [html.motion-reduced_&]:transition-none";

function Linha({ tom, icone, rotulo, children, link = true, delay = 0 }: { tom: Tom; icone: IconeId | LucideIcon; rotulo: string; children: ReactNode; link?: boolean; delay?: number }) {
  const c = CORES[tom];
  return (
    <span className="flex min-h-[76px] items-center gap-4 py-4 lg:gap-5">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border text-papel-50 transition-colors duration-200 ${c.icone} ${link ? "group-hover:border-brasa-400 group-hover:bg-brasa-400/10" : ""}`}
      >
        <DrawIcon icon={icone} size={20} delay={delay} redrawOnHover={link} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`rotulo block ${c.rotulo}`}>{rotulo}</span>
        <span className="relative mt-1 inline-block text-[17px] font-medium leading-snug text-papel-50 lg:text-[19px]">
          {children}
          {link && <span aria-hidden className={sublinhado} />}
        </span>
      </span>
      {link && (
        <ArrowUpRight
          aria-hidden
          size={20}
          strokeWidth={1.5}
          className={`hidden shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1.5 lg:block [html.motion-reduced_&]:!translate-x-0 ${c.seta}`}
        />
      )}
    </span>
  );
}

const linkCls = "group block rounded-[6px]";

export default function Canais({ location = "orcamento", email2 = false, tone, className }: CanaisProps) {
  const tom: Tom = tone ?? (location === "pagina_contato" ? "escuro" : "vermelho");
  const regua = CORES[tom].regua;

  return (
    <RevealGroup as="ul" stagger={0.06} className={`flex flex-col ${className ?? ""}`}>
      <RevealItem as="li">
        <Rule className={regua} />
        <WhatsAppLink location={location} className={linkCls}>
          <Linha tom={tom} icone={IconeWhatsApp} rotulo={CONTATO.canais.whatsapp}>
            <span className="tnum">{COMPANY.whatsappDisplay}</span>
          </Linha>
        </WhatsAppLink>
      </RevealItem>
      <RevealItem as="li">
        <Rule className={regua} />
        <PhoneLink location={location} className={linkCls}>
          <Linha tom={tom} icone="phone" rotulo={CONTATO.canais.telefone} delay={0.06}>
            <span className="tnum">{COMPANY.phoneDisplay}</span>
          </Linha>
        </PhoneLink>
      </RevealItem>
      <RevealItem as="li">
        <Rule className={regua} />
        <EmailLink location={location} className={linkCls}>
          <Linha tom={tom} icone="mail" rotulo={CONTATO.canais.email} delay={0.12}>
            {COMPANY.email}
          </Linha>
        </EmailLink>
      </RevealItem>
      {email2 && (
        <RevealItem as="li">
          <Rule className={regua} />
          <EmailLink location={location} email={COMPANY.email2} className={linkCls}>
            <Linha tom={tom} icone="mail" rotulo={CONTATO.canais.email} delay={0.18}>
              {COMPANY.email2}
            </Linha>
          </EmailLink>
        </RevealItem>
      )}
      <RevealItem as="li">
        <Rule className={regua} />
        <Linha tom={tom} icone="map-pin" rotulo={CONTATO.canais.endereco} link={false} delay={0.18}>
          <span className="block text-[16px] font-normal lg:text-[17px]">{COMPANY.enderecoLinha}</span>
        </Linha>
        <a
          href={COMPANY.mapsDirections}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => pushEvent("map_directions_click")}
          className="group -mt-3 mb-3 ml-[60px] inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-papel-50 lg:ml-[64px]"
        >
          <span className="relative">
            {CONTATO.comoChegar}
            <span aria-hidden className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full bg-current opacity-50 transition-opacity duration-200 group-hover:opacity-100" />
          </span>
          <ArrowUpRight
            aria-hidden
            size={16}
            strokeWidth={1.75}
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 [html.motion-reduced_&]:!translate-x-0 [html.motion-reduced_&]:!translate-y-0"
          />
        </a>
      </RevealItem>
      <RevealItem as="li">
        <Rule className={regua} />
        <Linha tom={tom} icone="clock" rotulo={CONTATO.canais.horario} link={false} delay={0.24}>
          {COMPANY.horario}
        </Linha>
        <Rule className={regua} delay={0.1} />
      </RevealItem>
    </RevealGroup>
  );
}
