import { FloatingContact } from "./components/chrome/FloatingContact";
import { MotionRoot } from "./components/chrome/MotionRoot";
import { MotionToast } from "./components/chrome/MotionToast";
import { Nav } from "./components/chrome/Nav";
import { PageCurtain } from "./components/chrome/PageCurtain";
import { Preloader } from "./components/chrome/Preloader";
import { ProposalBadge } from "./components/chrome/ProposalBadge";
import { ScrollFuse } from "./components/chrome/ScrollFuse";
import { SkipLink } from "./components/chrome/SkipLink";
import { Footer } from "./components/layout/Footer";
import { matchRoute, RouterProvider, usePath } from "./lib/router";
import { PAGINAS } from "./pages";

/** Conteúdo da rota atual. A `key` do <main> é o path: a entrada CSS do hero reinicia a cada troca (§7.5). */
function Pagina() {
  const path = usePath();
  const Corpo = PAGINAS[matchRoute(path)?.page ?? "404"];
  return (
    <main id="conteudo" key={path} tabIndex={-1} className="outline-none">
      <Corpo />
    </main>
  );
}

/** Aplicação inteira (design-final §17.8): roteador, motor de movimento e o chrome em volta da página. */
export default function App({ path }: { path: string }) {
  return (
    <RouterProvider initialPath={path}>
      <MotionRoot>
        <Preloader />
        <SkipLink />
        <ScrollFuse />
        <Nav />
        <Pagina />
        <Footer />
        <FloatingContact />
        <PageCurtain />
        <MotionToast />
        <ProposalBadge />
      </MotionRoot>
    </RouterProvider>
  );
}
