import { FaixaCta } from "../components/layout/FaixaCta";
import { PageHero } from "../components/layout/PageHero";
import ClientesEscala from "../sections/clientes/ClientesEscala";
import Parceiros from "../sections/clientes/Parceiros";
import SetoresEmpilhados from "../sections/clientes/SetoresEmpilhados";

/** `/nossos-clientes/` (design-final §10.3). Parceiros já traz o espaço reservado de clientes. */
export default function Clientes() {
  return (
    <>
      <PageHero page="clientes" />
      <ClientesEscala />
      <SetoresEmpilhados />
      <Parceiros />
      <FaixaCta page="clientes" />
    </>
  );
}
