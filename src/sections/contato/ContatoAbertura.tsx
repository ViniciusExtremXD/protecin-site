import type { CSSProperties } from "react";
import { CONTATO, UI } from "../../data/site";
import { Container } from "../../components/layout/Container";
import { Link } from "../../lib/router";
import { H1_PAGINA } from "../shared/historia/estilo";

/*
 * Abertura de /contato/ (design-final §10.6, com qa/AJUSTES-SOBRIEDADE.md por cima): trilha, H1 e o texto literal
 * (§2.7). Tudo acima da dobra entra por CSS (e-fade / e-sobe, sob html.motion-full; sem JS fica parado).
 * Fora da rodada 1: símbolo gigante em traço com a gota enchendo, sobretítulo "Entre em contato" (o H1 já diz),
 * luz vermelha de fundo e os 60svh de altura mínima.
 */

const atraso = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function ContatoAbertura() {
  const { trilha, h1, texto } = CONTATO.pagina;
  return (
    <section id="topo" data-section="contato-abertura" className="grain relative bg-noite-950 text-papel-50">
      <Container className="pb-12 pt-28 md:pt-32 lg:pb-16 lg:pt-40">
        <p className="rotulo e-fade text-papel-500" data-motion="css" style={atraso(0)}>
          <Link to="/" className="inline-flex min-h-11 items-center text-papel-300 transition-colors duration-200 hover:text-papel-50">
            {UI.inicio.toUpperCase()}
          </Link>
          <span aria-hidden className="px-2 text-papel-50/30">
            /
          </span>
          <span>{trilha}</span>
        </p>
        <h1 className={`${H1_PAGINA} e-sobe mt-3 text-papel-50 lg:mt-4`} data-motion="css" style={atraso(60)}>
          {h1}
        </h1>
        <p className="e-sobe mt-5 max-w-[56ch] text-pretty text-[17px] leading-[1.6] text-papel-300 lg:mt-6 lg:text-[19px]" data-motion="css" style={atraso(160)}>
          {texto}
        </p>
      </Container>
    </section>
  );
}
