import { Container } from "../components/layout/Container";
import { ReservedSlot } from "../components/ui/ReservedSlot";
import { useProposalMode } from "../lib/motion-pref";
import Mapa from "../sections/contato/Mapa";
import Abertura from "../sections/home/Abertura";
import ComoFunciona from "../sections/home/ComoFunciona";
import Credibilidade from "../sections/home/Credibilidade";
import Escala from "../sections/home/Escala";
import Servicos from "../sections/home/Servicos";
import Orcamento from "../sections/shared/Orcamento";

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

/**
 * Home `/` na rodada de conversão (qa/AJUSTES-CONVERSAO.md, por cima de design-final §8 e §9): o que a Protecin faz
 * logo depois da Abertura, a prova (autorizações e números), como funciona, o orçamento e o mapa. História, Kids ONG,
 * Plataforma e Setores ficam nas páginas Institucional, Nosso App e Nossos Clientes.
 */
export default function Home() {
  return (
    <>
      <Abertura />
      <Servicos />
      <Credibilidade />
      <ReservadoClientes />
      <Escala />
      <ComoFunciona />
      <Orcamento variant="home" />
      <Mapa variant="home" />
    </>
  );
}
