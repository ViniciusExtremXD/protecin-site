import { Reveal, VelocityMarquee } from "../../components/motion";
import { Symbol } from "../../components/ui/Symbol";
import { FITAS } from "../../data/site";
import { useMotionPref } from "../../lib/motion-pref";

function Itens({ itens, contorno, parado }: { itens: readonly string[]; contorno: boolean; parado: boolean }) {
  // parada, a fita em contorno vira leitura: traço mais forte que o .text-outline (35%) para não sumir no fundo
  const traco = parado ? "![-webkit-text-stroke:1px_rgba(243,239,233,0.62)]" : "";
  return (
    <>
      {itens.map((t) => (
        <span key={t} className="flex shrink-0 items-center">
          <span className={`whitespace-nowrap px-[0.45em] ${contorno ? `text-outline ${traco}` : "text-papel-50"}`}>{t}</span>
          <Symbol size={20} className="mx-[0.2em]" />
        </span>
      ))}
    </>
  );
}

export interface FitasProps {
  id?: string;
}

/**
 * Fitas de /servicos/ (§10.2): duas faixas tipográficas em sentidos opostos com os equipamentos (preenchida em
 * papel-50) e os serviços de campo (em contorno), separadas pelo símbolo de 20 px. Inclinação estática de -2° e +2°;
 * no hover a fita para (mola). Entrada: fade com y 40 → 0. Reduzido: as duas listas paradas, quebrando linha.
 */
export default function Fitas({ id = "fitas" }: FitasProps = {}) {
  // parada (reduzido) a lista quebra linha: a faixa fica na largura da tela, sem sangrar, e o corpo diminui no celular
  const parado = useMotionPref() === "reduced";
  const largura = parado ? "w-full px-5 md:px-8" : "-mx-[4vw] w-[108vw]";
  const corpo = `display-l stretch-66 uppercase ${parado ? "text-[1.375rem] leading-[1.3] md:text-[2rem] lg:text-[clamp(2rem,3.6vw,3.5rem)]" : "leading-[1.1]"}`;
  return (
    <section id={id} data-section="servicos-fitas" className="grain relative overflow-clip bg-noite-950 py-14 lg:py-24">
      <Reveal y={40} className="relative z-[1]">
        <div className={`${largura} -rotate-2 border-y border-noite-700 bg-noite-900 py-3 lg:py-5`}>
          <VelocityMarquee
            baseVelocity={-1}
            ariaLabel={FITAS.equipamentos.join(", ")}
            className={corpo}
            trackClassName="justify-center gap-y-3"
          >
            <Itens itens={FITAS.equipamentos} contorno={false} parado={parado} />
          </VelocityMarquee>
        </div>
      </Reveal>
      <Reveal y={40} delay={0.1} className="relative mt-3 lg:mt-5">
        <div className={`${largura} rotate-2 py-3 lg:py-5`}>
          <VelocityMarquee
            baseVelocity={1}
            ariaLabel={FITAS.servicosCampo.join(", ")}
            className={corpo}
            trackClassName="justify-center gap-y-3"
          >
            <Itens itens={FITAS.servicosCampo} contorno parado={parado} />
          </VelocityMarquee>
        </div>
      </Reveal>
    </section>
  );
}
