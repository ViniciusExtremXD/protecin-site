import type { MouseEvent } from "react";
import { RevealGroup, RevealItem } from "../../../components/motion";
import { SERVICOS, SERVICOS_HEADER } from "../../../data/site";
import { scrollToHash } from "../../../lib/smooth-scroll";

/** Rola até o capítulo (Lenis quando existe) e deixa a âncora na URL sem empilhar histórico. */
export function irPara(e: MouseEvent<HTMLAnchorElement>, slug: string) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  scrollToHash(`#${slug}`);
  try {
    history.replaceState(history.state, "", `#${slug}`);
  } catch {
    /* sandbox ou ambiente sem history: só rola */
  }
}

/**
 * Sumário dos 8 serviços no topo dos capítulos: links de texto com o nome curto, que quebram linha no celular.
 * Sem fixar na tela (a rodada de sobriedade tirou o índice fixo do desktop e a barra de chips do celular).
 */
export function Sumario({ className }: { className?: string }) {
  return (
    <nav aria-label={SERVICOS_HEADER.label} className={className}>
      <RevealGroup as="ul" stagger={0.04} y={16} className="-ml-2 flex flex-wrap items-center gap-x-3 lg:ml-0 lg:gap-x-7">
        {SERVICOS.map((s) => (
          <RevealItem as="li" key={s.slug}>
            <a
              href={`#${s.slug}`}
              onClick={(e) => irPara(e, s.slug)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-[15px] font-medium text-papel-300 underline-offset-[6px] transition-colors duration-200 hover:text-papel-50 hover:underline lg:px-0"
            >
              {s.nomeCurto}
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </nav>
  );
}
