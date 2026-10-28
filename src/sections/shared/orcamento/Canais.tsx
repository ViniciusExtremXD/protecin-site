import type { ReactNode } from "react";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, CONTATO, type LeadLocation } from "../../../data/site";
import { RevealGroup, RevealItem } from "../../../components/motion/Reveal";
import { EmailLink, PhoneLink, WhatsAppLink } from "../../../components/ui/cta";
import { GlifoWhatsApp } from "../../../components/ui/glifos";
import type { LucideIcon } from "../../../components/ui/icones";
import { pushEvent } from "../../../lib/track";

/*
 * Canais de contato do Orçamento (design-final §9 H10): cada canal é uma linha clicável com ícone de traço,
 * rótulo e valor, separadas por réguas finas. WhatsApp, telefone e e-mail são links de lead (data-lead-*,
 * lead_click); o endereço leva o "Como chegar" (map_directions_click) e o horário é só informação.
 * Rodada 2: ícones e réguas parados (sem traço nem régua desenhando), as linhas só sobem em cascata.
 */

export interface CanaisProps {
  /** lead_location dos links: "orcamento" (home) ou "pagina_contato". */
  location?: Extract<LeadLocation, "orcamento" | "pagina_contato">;
  /** Inclui falecom@protecin.com.br (página Contato). */
  email2?: boolean;
  /** "vermelho": sobre o fecho da home; "escuro": sobre noite-900. Padrão pelo location. */
  tone?: "vermelho" | "escuro";
  className?: string;
}

type Tom = "vermelho" | "escuro";
const CORES: Record<Tom, { regua: string; rotulo: string; icone: string; seta: string }> = {
  vermelho: { regua: "border-papel-50/15", rotulo: "text-papel-300", icone: "border-papel-50/25", seta: "text-papel-300" },
  escuro: { regua: "border-noite-700", rotulo: "text-papel-500", icone: "border-noite-600", seta: "text-papel-500" },
};

// o glifo do WhatsApp segue o contrato de traço da lucide (size, strokeWidth, currentColor)
const IconeWhatsApp = GlifoWhatsApp as unknown as LucideIcon;

const sublinhado =
  "pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 ease-out group-hover:scale-x-100";

function Linha({ tom, Icone, rotulo, children, link = true }: { tom: Tom; Icone: LucideIcon; rotulo: string; children: ReactNode; link?: boolean }) {
  const c = CORES[tom];
  return (
    <span className="flex min-h-[72px] items-center gap-4 py-3.5 lg:gap-5">
      <span
        aria-hidden
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border text-papel-50 transition-colors duration-200 ${c.icone} ${link ? "group-hover:border-brasa-400" : ""}`}
      >
        <Icone size={19} strokeWidth={1.5} />
      </span>
      <span className="min-w-0 flex-1">
        {/* rótulo em texto comum: o rótulo mono da seção já é o SectionLabel */}
        <span className={`block text-[14px] font-medium leading-snug ${c.rotulo}`}>{rotulo}</span>
        <span className="relative mt-0.5 inline-block text-[17px] font-medium leading-snug text-papel-50 lg:text-[18px]">
          {children}
          {link && <span aria-hidden className={sublinhado} />}
        </span>
      </span>
      {link && (
        <ArrowUpRight aria-hidden size={18} strokeWidth={1.5} className={`hidden shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 lg:block ${c.seta}`} />
      )}
    </span>
  );
}

const linkCls = "group block rounded-[6px]";
/** "WHATSAPP" → "WhatsApp", "E-MAIL" → "E-mail" (os rótulos do site.ts estão em caixa alta para o mono). */
const ROTULOS = { whatsapp: "WhatsApp", telefone: "Telefone", email: "E-mail", endereco: "Endereço", horario: "Horário" } as const;
const rotulo = (k: keyof typeof ROTULOS) => (CONTATO.canais[k].toLowerCase() === ROTULOS[k].toLowerCase() ? ROTULOS[k] : CONTATO.canais[k]);

export default function Canais({ location = "orcamento", email2 = false, tone, className }: CanaisProps) {
  const tom: Tom = tone ?? (location === "pagina_contato" ? "escuro" : "vermelho");
  const regua = `border-t ${CORES[tom].regua}`;

  return (
    <RevealGroup as="ul" y={20} stagger={0.06} className={`flex flex-col border-b ${CORES[tom].regua} ${className ?? ""}`}>
      <RevealItem as="li" className={regua}>
        <WhatsAppLink location={location} className={linkCls}>
          <Linha tom={tom} Icone={IconeWhatsApp} rotulo={rotulo("whatsapp")}>
            <span className="tnum">{COMPANY.whatsappDisplay}</span>
          </Linha>
        </WhatsAppLink>
      </RevealItem>
      <RevealItem as="li" className={regua}>
        <PhoneLink location={location} className={linkCls}>
          <Linha tom={tom} Icone={Phone} rotulo={rotulo("telefone")}>
            <span className="tnum">{COMPANY.phoneDisplay}</span>
          </Linha>
        </PhoneLink>
      </RevealItem>
      <RevealItem as="li" className={regua}>
        <EmailLink location={location} className={linkCls}>
          <Linha tom={tom} Icone={Mail} rotulo={rotulo("email")}>
            {COMPANY.email}
          </Linha>
        </EmailLink>
      </RevealItem>
      {email2 && (
        <RevealItem as="li" className={regua}>
          <EmailLink location={location} email={COMPANY.email2} className={linkCls}>
            <Linha tom={tom} Icone={Mail} rotulo={rotulo("email")}>
              {COMPANY.email2}
            </Linha>
          </EmailLink>
        </RevealItem>
      )}
      <RevealItem as="li" className={regua}>
        <Linha tom={tom} Icone={MapPin} rotulo={rotulo("endereco")} link={false}>
          <span className="block text-[16px] font-normal lg:text-[17px]">{COMPANY.enderecoLinha}</span>
        </Linha>
        <a
          href={COMPANY.mapsDirections}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => pushEvent("map_directions_click")}
          className="group -mt-2.5 mb-2.5 ml-[60px] inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-papel-50 lg:ml-[64px]"
        >
          <span className="relative">
            {CONTATO.comoChegar}
            <span aria-hidden className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full bg-current opacity-50 transition-opacity duration-200 group-hover:opacity-100" />
          </span>
          <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </RevealItem>
      <RevealItem as="li" className={regua}>
        <Linha tom={tom} Icone={Clock} rotulo={rotulo("horario")} link={false}>
          {COMPANY.horario}
        </Linha>
      </RevealItem>
    </RevealGroup>
  );
}
