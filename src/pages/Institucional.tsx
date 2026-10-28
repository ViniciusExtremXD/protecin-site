import { FaixaCta } from "../components/layout/FaixaCta";
import { PageHero } from "../components/layout/PageHero";
import MissaoVisaoValores from "../sections/institucional/MissaoVisaoValores";
import Sustentabilidade from "../sections/institucional/Sustentabilidade";
import Compromisso from "../sections/shared/Compromisso";
import Historia from "../sections/shared/Historia";

/** `/institucional/` (design-final §10.1). */
export default function Institucional() {
  return (
    <>
      <PageHero page="institucional" />
      <Historia variant="completa" />
      <MissaoVisaoValores />
      <Sustentabilidade />
      <Compromisso variant="kids" />
      <FaixaCta page="institucional" />
    </>
  );
}
