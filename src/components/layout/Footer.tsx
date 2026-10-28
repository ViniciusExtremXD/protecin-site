import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { COMPANY, FOOTER, UI } from "../../data/site";
import { Link, useRoute } from "../../lib/router";
import { scrollToY } from "../../lib/smooth-scroll";
import { Reveal, RevealGroup, RevealItem } from "../motion/Reveal";
import { SplitLines } from "../motion/SplitLines";
import { EmailLink, OrcamentoCta, PhoneLink, WhatsAppCta, WhatsAppLink } from "../ui/cta";
import { GlifoInstagram, GlifoLinkedIn, GlifoWhatsApp } from "../ui/glifos";
import { Logo } from "../ui/Logo";
import { Container } from "./Container";

// links com alvo de 44 × 44 px no toque (min-w-11: "Início" é mais curto que isso) e sublinhado de texto, que fica
// só sob as letras; no desktop a linha é baixa (py-1) e o sublinhado é o traço que corre no hover
const sublinhadoToque = "underline decoration-papel-300/40 underline-offset-[6px] lg:no-underline";
const linkCls = `group/l relative inline-flex min-h-11 min-w-11 items-center gap-2 text-[15px] text-papel-300 transition-colors duration-200 hover:text-papel-50 lg:min-h-0 lg:min-w-0 lg:py-1 ${sublinhadoToque}`;
const sublinhado =
  "pointer-events-none absolute bottom-0.5 left-0 hidden h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 group-hover/l:scale-x-100 lg:block";

/** Título de coluna em texto (não mono: um rótulo mono por bloco, AJUSTES-SOBRIEDADE §3). */
function Titulo({ children }: { children: string }) {
  return <p className="mb-1 text-[13px] font-semibold uppercase tracking-[0.04em] text-papel-500 lg:mb-2">{children}</p>;
}

/**
 * Rodapé (§7.8, rodada de sobriedade, compacto: cerca de 560 px no desktop e 1.050 px no celular). Quatro colunas:
 * logo e slogan em caixa normal (como o manifesto do hero); seções em duas colunas; contato; endereço, horário e
 * redes. A linha de CTA só aparece onde a página não termina com a FaixaCta ou o Orçamento (créditos e 404). Linha
 * final com direitos, créditos e voltar ao topo. Sem letreiro que "limpa", sem botão de animações e sem ímã.
 */
export function Footer() {
  const [ano, setAno] = useState(__ANO_BUILD__);
  useEffect(() => setAno(new Date().getFullYear()), []);
  // nas outras páginas o mesmo par de botões ficava repetido logo acima (FaixaCta ou Orçamento)
  const rota = useRoute();
  const comCta = !rota || rota.path === "/creditos/";

  return (
    <footer id="rodape" className="grain relative border-t border-noite-700 bg-noite-950 pb-[calc(56px+env(safe-area-inset-bottom))] text-papel-50 lg:pb-0">
      <Container className="pt-10 lg:pt-14">
        {comCta && (
          <RevealGroup stagger={0.06} className="mb-10 flex flex-col gap-3 border-b border-noite-700 pb-10 sm:flex-row lg:mb-12 lg:pb-12">
            <RevealItem>
              <OrcamentoCta formLocation="rodape" />
            </RevealItem>
            <RevealItem>
              <WhatsAppCta location="rodape" />
            </RevealItem>
          </RevealGroup>
        )}

        <RevealGroup stagger={0.06} className="grid grid-cols-1 gap-8 pb-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:pb-12">
          <RevealItem className="lg:col-span-4">
            <Logo tone="escuro" />
            <SplitLines
              as="p"
              lines={FOOTER.slogan}
              highlight={FOOTER.sloganDestaque}
              className="mt-5 text-[clamp(1.375rem,1.9vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.01em] text-papel-50"
            />
          </RevealItem>

          <RevealItem className="lg:col-span-3">
            <Titulo>{FOOTER.colunas.secoes}</Titulo>
            <ul className="grid grid-cols-2 gap-x-6">
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

          <RevealItem className="lg:col-span-2">
            <Titulo>{FOOTER.colunas.endereco}</Titulo>
            <address className="text-[14px] not-italic leading-relaxed text-papel-300">{COMPANY.enderecoCompleto}</address>
            <p className="mt-2 text-[14px] leading-relaxed text-papel-300">{COMPANY.horario}</p>
            <div className="-ml-3 mt-1 flex" role="group" aria-label={FOOTER.colunas.redes}>
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${COMPANY.instagramHandle}`}
                className="grid h-11 w-11 place-items-center rounded-full text-papel-300 transition-colors duration-200 hover:text-papel-50"
              >
                <GlifoInstagram size={18} />
              </a>
              <a
                href={COMPANY.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={FOOTER.linkedinRotulo}
                className="grid h-11 w-11 place-items-center rounded-full text-papel-300 transition-colors duration-200 hover:text-papel-50"
              >
                <GlifoLinkedIn size={18} />
              </a>
            </div>
          </RevealItem>
        </RevealGroup>

        {/* última faixa da página: margem 0 (a faixa de -12% do fim da página nunca entra na tela) */}
        <Reveal
          preset="fade"
          viewport={{ once: true, margin: "0px" }}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-noite-700 py-4 text-[14px] text-papel-500 lg:py-5"
        >
          <p className="w-full sm:w-auto">{FOOTER.direitos(ano)}</p>
          <Link to="/creditos/" className={`group/l relative inline-flex min-h-11 w-fit items-center text-papel-300 hover:text-papel-50 sm:ml-auto ${sublinhadoToque}`}>
            {FOOTER.creditos}
            <span aria-hidden className={sublinhado} />
          </Link>
          <button
            type="button"
            onClick={() => scrollToY(0, { duration: 1.4 })}
            aria-label={UI.voltarTopo}
            className="group grid h-11 w-11 place-items-center rounded-full border border-papel-50/25 text-papel-50 transition-colors duration-200 hover:border-papel-50/80"
          >
            <ArrowUp size={18} strokeWidth={1.5} className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
          </button>
        </Reveal>
      </Container>
    </footer>
  );
}
