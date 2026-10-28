import ContatoAbertura from "../sections/contato/ContatoAbertura";
import Mapa from "../sections/contato/Mapa";
import Orcamento from "../sections/shared/Orcamento";

/** `/contato/` (design-final §10.6): sem FaixaCta (o orçamento já é o corpo da página). */
export default function Contato() {
  return (
    <>
      <ContatoAbertura />
      <Orcamento variant="contato" />
      <Mapa />
    </>
  );
}
