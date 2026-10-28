import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IMAGENS } from "../../data/imagens.gen";
import { APP_HERO, PLATAFORMA, UI, WA, linhasTexto } from "../../data/site";
import { SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { OrcamentoCta, WhatsAppCta } from "../../components/ui/cta";
import { Img } from "../../components/ui/Img";
import { Link } from "../../lib/router";

/*
 * Abertura de /nosso-app/ (§10.5): acima da dobra, então a entrada é CSS (sob html.motion-full, que o <head>
 * sempre põe; sem JS tudo aparece parado). Rodada de sobriedade: o notebook do Web Master e o celular só sobem
 * 24 px com fade (sem rotateX nem giro na entrada; o celular fica levemente inclinado, parado); depois a tela do
 * celular troca do splash para o login (mesmo aparelho, mesmo tamanho). Na rolagem, parallax leve.
 */
const ENTRADA = `
@keyframes app-note { from { opacity: 0; transform: translate3d(0, 24px, 0); } }
@keyframes app-cel { from { opacity: 0; transform: translate3d(0, 24px, 0) rotate(-4deg); } }
@keyframes app-splash { from { opacity: 1; } to { opacity: 0; } }
.app-cel { transform: rotate(-4deg); }
.app-splash { opacity: 0; }
html.motion-full .app-note { animation: app-note 800ms cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(var(--t0) + 60ms); }
html.motion-full .app-cel { animation: app-cel 800ms cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(var(--t0) + 180ms); }
html.motion-full .app-splash { animation: app-splash 300ms cubic-bezier(0.65, 0, 0.35, 1) both; animation-delay: calc(var(--t0) + 900ms); }
`;

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function AppHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yCel = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const yNote = useTransform(scrollYProgress, [0, 1], ["0%", "-3%"]);
  const titulo = linhasTexto(APP_HERO.h1);

  return (
    <section ref={ref} id="topo" data-section="APP-HERO" className="relative isolate overflow-clip bg-marinho-900">
      <style dangerouslySetInnerHTML={{ __html: ENTRADA }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-mundo-azul" />
      <div aria-hidden data-motion="css" className="e-fade absolute inset-0 -z-10" style={d(100)}>
        <div className="bg-blueprint h-full w-full" />
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-marinho-900" />

      <Container className="grid min-h-[100svh] grid-cols-1 content-center items-center gap-y-12 pb-16 pt-28 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-32">
        <div className="lg:col-span-6">
          <p data-motion="css" className="rotulo e-fade text-marinho-300" style={d(0)}>
            <Link to="/" className="inline-flex min-h-11 items-center text-papel-300 transition-colors duration-200 hover:text-papel-50">
              {UI.inicio.toUpperCase()}
            </Link>
            <span aria-hidden className="px-2 text-papel-50/30">
              /
            </span>
            <span>{APP_HERO.trilha}</span>
          </p>
          <SplitLines
            as="h1"
            css
            lines={APP_HERO.h1}
            text={titulo}
            delay={0.08}
            className="stretch-66 mt-3 text-[clamp(2.6rem,min(5.2vw,10.5svh),6.25rem)] font-extrabold uppercase leading-[0.9] text-papel-50"
          />
          <p data-motion="css" className="corpo-l e-sobe mt-6 max-w-[50ch] text-papel-300 lg:mt-8" style={d(300)}>
            {APP_HERO.texto}
          </p>
          <div data-motion="css" className="e-sobe mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-10" style={d(400)}>
            <OrcamentoCta formLocation="pagina_app" />
            <WhatsAppCta location="pagina_app" message={WA.plataforma}>
              {PLATAFORMA.ctas.conhecerPlataforma}
            </WhatsAppCta>
          </div>
        </div>

        {/* notebook (Web Master) e celular (login) à frente, à direita */}
        <div className="relative mx-auto w-[80%] max-w-[420px] lg:col-span-6 lg:w-full lg:max-w-none">
          <div className="relative aspect-[640/560]">
            <motion.div className="absolute left-0 top-[4%] w-[84%]" style={{ y: yNote }}>
              <div data-motion="css" className="app-note">
                <Img
                  id="app-webmaster-notebook"
                  alt={IMAGENS["app-webmaster-notebook"].alt}
                  eager
                  sizes="(min-width: 1024px) 820px, 70vw"
                  className="block w-full"
                  imgClassName="h-auto w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.5)]"
                />
              </div>
            </motion.div>
            <motion.div className="absolute bottom-0 right-[2%] w-[36%]" style={{ y: yCel }}>
              <div data-motion="css" className="app-cel relative">
                <Img
                  id="app-login-celular"
                  alt={IMAGENS["app-login-celular"].alt}
                  eager
                  sizes="(min-width: 1024px) 400px, 30vw"
                  className="block w-full"
                  imgClassName="h-auto w-full drop-shadow-[0_40px_40px_rgba(0,0,0,0.55)]"
                />
                <div aria-hidden className="app-splash absolute inset-0">
                  <Img id="app-splash" alt="" eager sizes="(min-width: 1024px) 400px, 30vw" className="block w-full" imgClassName="h-auto w-full" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
