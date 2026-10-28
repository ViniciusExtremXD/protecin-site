import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { COMPANY, FOOTER, UI } from "../../data/site";
import { Link } from "../../lib/router";
import { scrollToY } from "../../lib/smooth-scroll";
import { Magnetic } from "../motion/Magnetic";
import { Reveal, RevealGroup, RevealItem } from "../motion/Reveal";
import { WipeText } from "../motion/WipeText";
import { MotionToggle } from "../chrome/MotionToggle";
import { EmailLink, OrcamentoCta, PhoneLink, WhatsAppCta, WhatsAppLink } from "../ui/cta";
import { GlifoInstagram, GlifoLinkedIn, GlifoWhatsApp } from "../ui/glifos";
import { Logo } from "../ui/Logo";
import { Symbol } from "../ui/Symbol";
import { Container } from "./Container";

const linkCls =
  "group/l relative inline-flex min-h-11 items-center gap-2 py-3 text-[15px] text-papel-300 transition-colors duration-200 hover:text-papel-50 lg:min-h-0 lg:py-1.5";
const sublinhado =
  "pointer-events-none absolute bottom-2 left-0 h-px w-full origin-left scale-x-100 bg-current opacity-40 transition-transform duration-200 lg:bottom-0.5 lg:scale-x-0 lg:opacity-100 lg:group-hover/l:scale-x-100";

function Titulo({ children }: { children: string }) {
  return <p className="rotulo mb-3 text-papel-500 lg:mb-5">{children}</p>;
}

/** Rodapé (§7.8): slogan que "limpa" com a rolagem, linha de CTA, 4 colunas e linha final. */
export function Footer() {
  const [ano, setAno] = useState(__ANO_BUILD__);
  useEffect(() => setAno(new Date().getFullYear()), []);

  return (
    <footer id="rodape" className="grain relative bg-noite-950 pb-[calc(56px+env(safe-area-inset-bottom))] text-papel-50 lg:pb-0">
      <Container className="pt-24 lg:pt-36">
        <Reveal preset="fade">
          <WipeText lines={FOOTER.slogan} highlight={FOOTER.sloganDestaque} className="display-xl hidden md:block" />
          <WipeText lines={FOOTER.sloganCelular} highlight={FOOTER.sloganDestaque} className="display-xl md:hidden" />
        </Reveal>

        <div className="mt-12 flex flex-col gap-8 lg:mt-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="simbolo-hover w-fit">
            <Symbol size={64} tone="escuro" mode="desenhar" />
          </div>
          <RevealGroup stagger={0.06} className="flex flex-col gap-3 sm:flex-row">
            <RevealItem>
              <OrcamentoCta formLocation="rodape" />
            </RevealItem>
            <RevealItem>
              <WhatsAppCta location="rodape" />
            </RevealItem>
          </RevealGroup>
        </div>

        <div className="mt-16 h-px w-full bg-noite-700 lg:mt-20" />

        <RevealGroup stagger={0.06} className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <RevealItem className="lg:col-span-4">
            <Logo tone="escuro" />
            <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-papel-300">{FOOTER.texto}</p>
          </RevealItem>

          <RevealItem className="lg:col-span-2 lg:col-start-6">
            <Titulo>{FOOTER.colunas.secoes}</Titulo>
            <ul className="flex flex-col">
              {FOOTER.secoes.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className={linkCls}>
                    {s.label}
                    <span aria-hidden className={sublinhado} />
                  </Link>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem className="lg:col-span-3">
            <Titulo>{FOOTER.colunas.contato}</Titulo>
            <ul className="flex flex-col">
              <li>
                <PhoneLink location="rodape" className={`${linkCls} tnum`}>
                  {COMPANY.phoneDisplay}
                  <span aria-hidden className={sublinhado} />
                </PhoneLink>
              </li>
              <li>
                <WhatsAppLink location="rodape" className={linkCls}>
                  <GlifoWhatsApp size={16} className="text-whatsapp" />
                  {FOOTER.whatsappRotulo}
                  <span aria-hidden className={sublinhado} />
                </WhatsAppLink>
              </li>
              <li>
                <EmailLink location="rodape" className={linkCls}>
                  {COMPANY.email}
                  <span aria-hidden className={sublinhado} />
                </EmailLink>
              </li>
              <li>
                <EmailLink location="rodape" email={COMPANY.email2} className={linkCls}>
                  {COMPANY.email2}
                  <span aria-hidden className={sublinhado} />
                </EmailLink>
              </li>
            </ul>
          </RevealItem>

          <RevealItem className="lg:col-span-3">
            <Titulo>{FOOTER.colunas.endereco}</Titulo>
            <address className="max-w-[30ch] text-[15px] not-italic leading-relaxed text-papel-300">{COMPANY.enderecoCompleto}</address>
            <div className="mt-6">
              <Titulo>{FOOTER.colunas.horario}</Titulo>
              <p className="text-[15px] text-papel-300">{COMPANY.horario}</p>
            </div>
            <div className="mt-6">
              <Titulo>{FOOTER.colunas.redes}</Titulo>
              <div className="flex flex-col lg:flex-row lg:gap-5">
                <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <GlifoInstagram size={18} />
                  {COMPANY.instagramHandle}
                  <span aria-hidden className={sublinhado} />
                </a>
                <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <GlifoLinkedIn size={18} />
                  {FOOTER.linkedinRotulo}
                  <span aria-hidden className={sublinhado} />
                </a>
              </div>
            </div>
          </RevealItem>
        </RevealGroup>

        <Reveal preset="fade" className="flex flex-col gap-5 border-t border-noite-700 py-8 text-[14px] text-papel-500 lg:flex-row lg:items-center lg:justify-between">
          <p>{FOOTER.direitos(ano)}</p>
          <Link to="/creditos/" className="group/l relative inline-flex min-h-11 w-fit items-center text-papel-300 hover:text-papel-50 lg:min-h-0">
            {FOOTER.creditos}
            <span aria-hidden className={sublinhado} />
          </Link>
          <MotionToggle />
          <Reveal preset="carimbo" className="w-fit">
            <Magnetic strength={0.3}>
              <button
                type="button"
                onClick={() => scrollToY(0, { duration: 1.4 })}
                aria-label={UI.voltarTopo}
                className="group grid h-12 w-12 place-items-center rounded-full border border-papel-50/25 text-papel-50 transition-colors duration-200 hover:border-papel-50/80"
              >
                <ArrowUp size={20} strokeWidth={1.5} className="transition-transform duration-200 ease-out group-hover:-translate-y-1" />
              </button>
            </Magnetic>
          </Reveal>
        </Reveal>
      </Container>
    </footer>
  );
}
