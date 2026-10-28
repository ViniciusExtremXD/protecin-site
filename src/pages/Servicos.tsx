import { FaixaCta } from "../components/layout/FaixaCta";
import { PageHero } from "../components/layout/PageHero";
import Capitulos from "../sections/servicos/Capitulos";
import Diagrama from "../sections/servicos/Diagrama";
import FaixaAvcb from "../sections/servicos/FaixaAvcb";
import Fitas from "../sections/servicos/Fitas";

/** `/servicos/` (design-final §10.2): diagrama "01 Sistema", capítulos "02", fitas, faixa AVCB e faixa de CTA. */
export default function Servicos() {
  return (
    <>
      <PageHero page="servicos" />
      <Diagrama id="sistema" index="01" />
      <Capitulos />
      <Fitas />
      <FaixaAvcb />
      <FaixaCta page="servicos" />
    </>
  );
}
