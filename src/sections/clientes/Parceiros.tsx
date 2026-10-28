import { AUTORIZADAS, CLIENTES, FILIACOES, GRUPOS_MARCAS, MARCAS, type Marca } from "../../data/site";
import { Reveal, RevealGroup, RevealItem, Rule, SplitLines } from "../../components/motion";
import { Container } from "../../components/layout/Container";
import { ReservedSlot } from "../../components/ui/ReservedSlot";
import { LogoTile } from "../shared/marcas/LogoTile";
import { quebrar } from "./linhas";

/*
 * /nossos-clientes/: parcerias e filiações (design-final §10.3), tom claro. Três grupos de ladrilhos 3:2 com rótulo
 * mono e régua. Regra de honestidade §2: autorizações, marcas e filiações separadas; nenhum logo de cliente.
 * No fim, o espaço reservado de logos de clientes (só aparece com ?proposta=1).
 */

const GRUPOS: { chave: "autorizada" | "marca" | "filiacao"; itens: Marca[]; ponto: string }[] = [
  { chave: "autorizada", itens: AUTORIZADAS, ponto: "bg-brasa-500" },
  { chave: "marca", itens: MARCAS, ponto: "bg-marinho-700" },
  { chave: "filiacao", itens: FILIACOES, ponto: "bg-marinho-700" },
];

/** Parceiros (`#parceiros` em /nossos-clientes/). Sem props. */
export default function Parceiros() {
  const { titulo, texto } = CLIENTES.parceiros;
  return (
    <section id="parceiros" data-section="parceiros" className="tom-claro relative bg-papel-50 py-24 text-noite-950 lg:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-6">
          <SplitLines as="h2" lines={{ desktop: quebrar(titulo, 2), celular: quebrar(titulo, 3) }} text={titulo} className="display-xl text-noite-950 lg:col-span-7 lg:text-[clamp(2.75rem,4.6vw,5rem)]" />
          <Reveal as="p" delay={0.15} className="corpo text-grafite-600 lg:col-span-4 lg:col-start-9 lg:self-end">
            {texto}
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-16 lg:mt-24 lg:gap-24">
          {GRUPOS.map((g) => (
            <div key={g.chave}>
              <div className="flex items-center gap-3">
                <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${g.ponto}`} />
                <Reveal as="span" y={12}>
                  <h3 className="rotulo text-grafite-600">{GRUPOS_MARCAS[g.chave].titulo}</h3>
                </Reveal>
              </div>
              <Rule className="mt-4 bg-noite-950/15" />
              <RevealGroup as="ul" preset="virada" stagger={0.05} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8">
                {g.itens.map((m, i) => (
                  <RevealItem key={m.id} as="li" index={i}>
                    <LogoTile marca={m} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ))}
        </div>

        <ReservedSlot id="clientes" className="mt-16 lg:mt-24" />
      </Container>
    </section>
  );
}
