import { ClipReveal, FocusBrackets, ParallaxMedia } from "../../../components/motion";
import { Img } from "../../../components/ui/Img";
import { LazyVideo } from "../../../components/ui/LazyVideo";
import { UI, type Servico } from "../../../data/site";
import { useMotionPref } from "../../../lib/motion-pref";
import { altDe, creditoDe } from "../../servicos/capitulos/util";

/**
 * Mídia do cartão de serviço (H3): no celular 16:10 em cima do texto; no desktop ocupa a altura do cartão.
 * Cortina na entrada (900 ms), parallax interno de 8%, hover com scale 1,04 → 1,08 e as cantoneiras de foco.
 * Crédito obrigatório "sobre" a mídia (todas as mídias dos cartões são de banco: "Imagem ilustrativa").
 * O cartão 07 troca a foto pelo vídeo do extintor, que só toca enquanto o cartão está em cima da pilha.
 */
export function MidiaCartao({ servico, videoAtivo = false, prioridade = false }: { servico: Servico; videoAtivo?: boolean; prioridade?: boolean }) {
  const reduced = useMotionPref() === "reduced";
  const comVideo = Boolean(servico.video);
  const credito = comVideo ? "ilustrativa" : creditoDe(servico.imagem);
  const textoCredito = (credito === "acervo" ? UI.fotoAcervo : UI.imagemIlustrativa).toUpperCase();
  const zoom = reduced ? "" : "scale-[1.04] group-hover:scale-[1.08]";

  const conteudo =
    comVideo && servico.video ? (
      <LazyVideo id={servico.video} label={`${UI.imagemIlustrativa}: ${servico.nome}`} when="active" active={videoAtivo} sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full" />
    ) : (
      <Img
        id={servico.imagem}
        alt={altDe(servico.imagem)}
        eager={prioridade}
        sizes="(min-width: 1024px) 50vw, 92vw"
        className="block h-full w-full"
        imgClassName="h-full w-full object-cover"
      />
    );

  return (
    <figure className="group relative h-full">
      <div className="relative aspect-[16/10] w-full md:aspect-[2/1] lg:aspect-auto lg:h-full">
        <div className="absolute inset-0 overflow-clip rounded-[20px]">
          <ClipReveal radius={20} className="relative h-full w-full overflow-clip">
            <div className={`h-full w-full transition-transform duration-[800ms] ease-out ${zoom}`}>
              <ParallaxMedia amount={8}>{conteudo}</ParallaxMedia>
            </div>
          </ClipReveal>
        </div>
        <FocusBrackets mode="hover" />
        <figcaption className="rotulo absolute bottom-3 left-3 z-[1] rounded-[6px] bg-noite-950/70 px-2.5 py-1.5 text-papel-50">{textoCredito}</figcaption>
      </div>
    </figure>
  );
}
