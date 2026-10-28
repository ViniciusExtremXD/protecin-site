import { FaixaCta } from "../components/layout/FaixaCta";
import AppFecho from "../sections/app/AppFecho";
import AppHero from "../sections/app/AppHero";
import ComoFunciona from "../sections/app/ComoFunciona";
import Recursos from "../sections/app/Recursos";
import TelasReais from "../sections/app/TelasReais";
import Plataforma from "../sections/shared/Plataforma";

/** `/nosso-app/` (design-final §10.5). */
export default function NossoApp() {
  return (
    <>
      <AppHero />
      <ComoFunciona />
      <Plataforma variant="app" />
      <Recursos />
      <TelasReais />
      <AppFecho />
      <FaixaCta page="app" />
    </>
  );
}
