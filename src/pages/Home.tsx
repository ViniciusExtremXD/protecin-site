import { Container } from "../components/layout/Container";
import { ReservedSlot } from "../components/ui/ReservedSlot";
import { useProposalMode } from "../lib/motion-pref";
import Abertura from "../sections/home/Abertura";
import Credibilidade from "../sections/home/Credibilidade";
import Diferenciais from "../sections/home/Diferenciais";
import Escala from "../sections/home/Escala";
import Servicos from "../sections/home/Servicos";
import Setores from "../sections/home/Setores";
import Compromisso from "../sections/shared/Compromisso";
import Historia from "../sections/shared/Historia";
import NaPratica from "../sections/shared/NaPratica";
import Orcamento from "../sections/shared/Orcamento";
import Plataforma from "../sections/shared/Plataforma";

/** Espaço reservado de logos de clientes (só no modo proposta), numa faixa escura entre H2 e H3. */
function ReservadoClientes() {
  const proposta = useProposalMode();
  if (!proposta) return null;
  return (
    <div className="bg-noite-950 pt-20 lg:pt-28">
      <Container>
        <ReservedSlot id="clientes" />
      </Container>
    </div>
  );
}

/** Home `/` (design-final §8 e §9): H0 a H10, com o espaço reservado de clientes depois da Credibilidade. */
export default function Home() {
  return (
    <>
      <Abertura />
      <Escala />
      <Credibilidade />
      <ReservadoClientes />
      <Servicos />
      <NaPratica />
      <Plataforma variant="home" />
      <Diferenciais />
      <Historia variant="home" />
      <Setores />
      <Compromisso variant="home" />
      <Orcamento variant="home" />
    </>
  );
}
