/*
 * Sandbox de desenvolvimento (design-final §7.11). Não vai para o build.
 *   dev.html?s=home/Abertura,home/Escala&rota=/   → seções isoladas com o chrome real
 *   dev.html?todas=1                               → lista as seções encontradas
 *   dev.html?s=__primitivas                        → página de teste de cada primitiva e peça de chrome
 * Acrescente &proposta=1 para o modo proposta. O movimento fica sempre ligado (não há modo reduzido).
 */
import { StrictMode, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import "../styles.css";
import {
  AUTORIZADAS,
  FITAS,
  FOOTER,
  GRUPOS_MARCAS,
  HERO,
  MARCAS,
  NUMEROS,
  PLATAFORMA,
  SERVICOS,
  SETORES,
  TIMELINE,
  type IconeId,
} from "../data/site";
import { ICONES } from "../components/ui/icones";
import {
  ClipReveal,
  CursorPreview,
  DrawIcon,
  DrawPath,
  DropWindow,
  FocusBrackets,
  Magnetic,
  Odometer,
  ParallaxMedia,
  PinStage,
  Reel,
  Reveal,
  RevealGroup,
  RevealItem,
  Rule,
  ScrollLitText,
  SectionRise,
  SplitLines,
  SplitWords,
  StampBadge,
  TextRoll,
  TiltCard,
  VelocityMarquee,
  WipeText,
  usePin,
} from "../components/motion";
import { CaptionedFigure } from "../components/ui/CaptionedFigure";
import { Chip, ChipToggle } from "../components/ui/Chip";
import { GhostCta, OrcamentoCta, PhoneCta, PrimaryCta, WhatsAppCta } from "../components/ui/cta";
import { GlifoInstagram, GlifoLinkedIn, GlifoWhatsApp } from "../components/ui/glifos";
import { Img } from "../components/ui/Img";
import { LazyVideo } from "../components/ui/LazyVideo";
import { Logo } from "../components/ui/Logo";
import { ReservedSlot } from "../components/ui/ReservedSlot";
import { SectionLabel } from "../components/ui/SectionLabel";
import { Symbol } from "../components/ui/Symbol";
import { FloatingContact } from "../components/chrome/FloatingContact";
import { MotionRoot } from "../components/chrome/MotionRoot";
import { Nav } from "../components/chrome/Nav";
import { PageCurtain } from "../components/chrome/PageCurtain";
import { Preloader } from "../components/chrome/Preloader";
import { ProposalBadge } from "../components/chrome/ProposalBadge";
import { ScrollFuse } from "../components/chrome/ScrollFuse";
import { SkipLink } from "../components/chrome/SkipLink";
import { Container } from "../components/layout/Container";
import { FaixaCta } from "../components/layout/FaixaCta";
import { Footer } from "../components/layout/Footer";
import { PageHero } from "../components/layout/PageHero";
import { RouterProvider, usePath } from "../lib/router";
import type { ImagemId } from "../data/imagens.gen";

// ---------------------------------------------------------------- carregamento das seções
const SECOES = import.meta.glob<{ default: ComponentType }>("../sections/**/*.tsx");
const nomeDe = (caminho: string) => caminho.replace("../sections/", "").replace(/\.tsx$/, "");
const params = new URLSearchParams(window.location.search);
const pedidas = (params.get("s") ?? "").split(",").map((x) => x.trim()).filter(Boolean);
const rota = params.get("rota") ?? "/";
const todas = params.get("todas") === "1";

function Secoes({ nomes }: { nomes: string[] }) {
  const [comps, setComps] = useState<{ nome: string; C: ComponentType | null }[]>([]);
  useEffect(() => {
    let vivo = true;
    Promise.all(
      nomes.map(async (n) => {
        const carregar = SECOES[`../sections/${n}.tsx`];
        return { nome: n, C: carregar ? (await carregar()).default : null };
      }),
    ).then((r) => vivo && setComps(r));
    return () => {
      vivo = false;
    };
  }, [nomes]);
  return (
    <>
      {comps.map(({ nome, C }) =>
        C ? (
          <C key={nome} />
        ) : (
          <Container key={nome} className="py-32">
            <p className="rotulo text-brasa-300">Seção não encontrada: {nome}</p>
          </Container>
        ),
      )}
    </>
  );
}

function Indice() {
  const lista = Object.keys(SECOES).map(nomeDe).sort();
  return (
    <Container className="min-h-[100svh] py-32">
      <p className="rotulo text-papel-500">Sandbox · Protecin</p>
      <h1 className="display-xl mt-4">Seções</h1>
      <ul className="mt-10 flex flex-col gap-2">
        <li>
          <a className="text-brasa-300 underline-offset-4 hover:underline" href="?s=__primitivas">
            __primitivas (página de teste)
          </a>
        </li>
        {lista.map((n) => (
          <li key={n}>
            <a className="text-papel-300 underline-offset-4 hover:text-papel-50 hover:underline" href={`?s=${n}`}>
              {n}
            </a>
          </li>
        ))}
        {lista.length === 0 && <li className="text-papel-500">Nenhuma seção em src/sections/ ainda.</li>}
      </ul>
    </Container>
  );
}

// ---------------------------------------------------------------- página de teste das primitivas
function Bloco({ id, titulo, nota, claro = false, children, className }: { id: string; titulo: string; nota?: string; claro?: boolean; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`${claro ? "tom-claro bg-papel-50 text-noite-950" : "grain bg-noite-950"} py-24 lg:py-32 ${className ?? ""}`}>
      <Container>
        <div className="mb-12 flex flex-col gap-3 border-b pb-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between" style={{ borderColor: claro ? "rgba(5,10,18,.12)" : "#182536" }}>
          <h2 className={`display-l ${claro ? "text-noite-950" : "text-papel-50"}`}>{titulo}</h2>
          {nota && <p className={`rotulo ${claro ? "text-grafite-600" : "text-papel-500"}`}>{nota}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
}

function Rotulo({ children, claro = false }: { children: string; claro?: boolean }) {
  return <p className={`rotulo mb-4 ${claro ? "text-grafite-600" : "text-papel-500"}`}>{children}</p>;
}

const CORES: { nome: string; hex: string; claro?: boolean }[] = [
  { nome: "noite-950", hex: "#050A12" },
  { nome: "noite-900", hex: "#09111C" },
  { nome: "noite-800", hex: "#0F1A28" },
  { nome: "noite-700", hex: "#182536" },
  { nome: "noite-600", hex: "#253447" },
  { nome: "marinho-700", hex: "#0E3452" },
  { nome: "marinho-500", hex: "#3A77A8" },
  { nome: "marinho-300", hex: "#9DB8D0", claro: true },
  { nome: "brasa-600", hex: "#8F141B" },
  { nome: "brasa-500", hex: "#BE1E29" },
  { nome: "brasa-400", hex: "#E8442E" },
  { nome: "brasa-300", hex: "#FF6A4D", claro: true },
  { nome: "papel-50", hex: "#F3EFE9", claro: true },
  { nome: "papel-300", hex: "#B8BFC9", claro: true },
  { nome: "grafite-600", hex: "#4B5866" },
  { nome: "fotolum", hex: "#D8F36A", claro: true },
];

/** Mini-cena fixada: DropWindow fechando sobre o poster, Reel e ScrollLitText ligados ao progresso. */
function CenaTeste() {
  const { progress, active } = usePin();
  const [indice, setIndice] = useState(0);
  useEffect(() => progress.on("change", (v) => setIndice(Math.min(3, Math.floor(v * 4)))), [progress]);
  return (
    <div className="relative flex h-[100svh] items-center justify-center overflow-clip bg-noite-950">
      <DropWindow progress={progress} range={[0.05, 0.5]} mode="fechar" className="[--gota:min(34vh,40vw)] lg:[--gota:min(34vh,26vw)]">
        <Img id="hero-poster" mobile="hero-poster-v" alt="" sizes="100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-veu-hero" />
      </DropWindow>
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-[2]">
        <Container className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <ScrollLitText as="h2" text={HERO.manifesto} progress={progress} range={[0.5, 0.9]} className="display-xl max-w-[12ch] text-papel-50" />
          <div className="w-full max-w-[420px]">
            <p className="rotulo mb-3 text-papel-500">
              <Odometer value={`0${indice + 1}`} trigger="value" /> / 04 · {active ? "cena fixada" : "fluxo normal"}
            </p>
            <Reel count={4} index={indice} className="h-[7.5em] text-[16px] leading-[1.5em] text-papel-300" label="Pilares da plataforma">
              {PLATAFORMA.pilares.map((p) => (
                <p key={p.numero} className="h-full">
                  <span className="font-semibold text-papel-50">{p.titulo}. </span>
                  {p.texto}
                </p>
              ))}
            </Reel>
          </div>
        </Container>
      </div>
    </div>
  );
}

function Primitivas() {
  const [palavra, setPalavra] = useState(0);
  const [ano, setAno] = useState(0);
  const [aba, setAba] = useState(0);
  const [selecionados, setSelecionados] = useState<string[]>(["Projetos Técnicos"]);
  const [previa, setPrevia] = useState<ImagemId | null>(null);
  const listaSetores = useRef<HTMLUListElement>(null);
  const marcos = TIMELINE.marcos;

  return (
    <>
      <PageHero page="servicos" />

      <Bloco id="sistema" titulo="Sistema visual" nota="Paleta · tipografia · símbolo">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {CORES.map((c) => (
            <div key={c.nome} className="overflow-clip rounded-r-sm border border-noite-700">
              <div className="h-16" style={{ background: c.hex }} />
              <div className="bg-noite-900 px-3 py-2">
                <p className="text-[14px] font-medium text-papel-50">{c.nome}</p>
                <p className="font-mono text-[13px] text-papel-500">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Rotulo>display-xxl · display-xl · display-l</Rotulo>
            <p className="display-xxl text-papel-50">
              <Odometer value="20.000" />
              <span className="text-brasa-400">+</span>
            </p>
            <p className="display-xl mt-4 text-papel-50">
              Há <span className="text-brasa-400">50</span> anos
            </p>
            <p className="display-l mt-4 text-papel-300">Engenharia, inspeção e manutenção</p>
          </div>
          <div className="lg:col-span-5">
            <Rotulo>titulo · corpo-l · corpo · rotulo</Rotulo>
            <p className="titulo text-papel-50">{SERVICOS[0].nome}</p>
            <p className="corpo-l mt-4 text-papel-300">{HERO.paragrafo}</p>
            <p className="corpo mt-4 text-papel-300">{SERVICOS[3].descricao}</p>
            <p className="rotulo mt-6 text-papel-500">{HERO.rotulo}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-5 rounded-r-lg border border-noite-700 bg-noite-900 p-8">
            <Symbol size={112} tone="escuro" mode="montar" title="Símbolo Protecin" />
            <p className="rotulo text-papel-500">escuro · montar</p>
          </div>
          <div className="flex flex-col items-center gap-5 rounded-r-lg bg-papel-50 p-8">
            <Symbol size={112} tone="claro" mode="desenhar" />
            <p className="rotulo text-grafite-600">claro · desenhar</p>
          </div>
          <div className="flex flex-col items-center gap-5 rounded-r-lg bg-brasa-500 p-8">
            <Symbol size={112} tone="mono" mode="css-montar" />
            <p className="rotulo text-white">mono · css-montar</p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-center rounded-r-lg border border-noite-700 bg-noite-900 p-10">
            <Logo tone="escuro" animate />
          </div>
          <div className="flex items-center justify-center rounded-r-lg bg-papel-50 p-10">
            <Logo tone="claro" />
          </div>
        </div>
      </Bloco>

      <Bloco id="texto" titulo="Texto em movimento" nota="SectionLabel · SplitLines · SplitWords · ScrollLitText · WipeText">
        <SectionLabel index="01" label="Escala" />
        <SplitLines lines={HERO.h1.linhas} highlight={HERO.h1.destaque} className="display-xl mt-6 text-papel-50" />
        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <Rotulo>SplitWords com replayKey</Rotulo>
            <SplitWords as="h3" text={PLATAFORMA.pilares[palavra].titulo} replayKey={palavra} className="display-l text-papel-50" />
            <div className="mt-6">
              <button type="button" className="min-h-11 rounded-full border border-papel-50/30 px-5 text-[15px] font-semibold" onClick={() => setPalavra((p) => (p + 1) % 4)}>
                Próximo pilar
              </button>
            </div>
          </div>
          <div>
            <Rotulo>ScrollLitText (acende pela rolagem)</Rotulo>
            <ScrollLitText as="p" text={HERO.manifesto} className="display-l text-papel-50" />
            <p className="corpo mt-6 text-papel-300">{HERO.apoio}</p>
          </div>
        </div>
        <div className="mt-20">
          <Rotulo>WipeText (limpa pela rolagem)</Rotulo>
          <WipeText lines={FOOTER.slogan} highlight={FOOTER.sloganDestaque} offset={["start 90%", "end 40%"]} className="display-xl" />
        </div>
      </Bloco>

      <Bloco id="entradas" titulo="Entradas" nota="Reveal: sobe · fade · virada · monta · carimbo">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {(["sobe", "fade", "virada", "monta", "carimbo"] as const).map((p, i) => (
            <Reveal key={p} preset={p} index={i} className="grid aspect-[4/3] place-items-center rounded-r-md border border-noite-700 bg-noite-800">
              <span className="rotulo text-papel-300">{p}</span>
            </Reveal>
          ))}
        </div>
        <div className="mt-14" />
        <Rotulo>RevealGroup monta (cartões)</Rotulo>
        <RevealGroup preset="monta" stagger={0.06} className="grid gap-4 md:grid-cols-3">
          {SERVICOS.slice(0, 3).map((s, i) => (
            <RevealItem key={s.slug} index={i} className="group relative rounded-r-md border border-noite-700 bg-noite-800 p-6 transition-colors duration-[350ms] hover:border-brasa-400/60">
              <DrawIcon icon={s.icone} size={40} redrawOnHover className="text-brasa-400" />
              <p className="titulo mt-5 text-papel-50">{s.nome}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-papel-300">{s.resumo}</p>
              <FocusBrackets mode="hover" />
            </RevealItem>
          ))}
        </RevealGroup>
      </Bloco>

      <Bloco id="midia" titulo="Mídia" nota="ClipReveal · ParallaxMedia · CaptionedFigure · LazyVideo · TiltCard">
        <div className="grid gap-10 lg:grid-cols-12">
          <CaptionedFigure
            className="lg:col-span-7"
            img={{ id: "obra-parede-sistemas", alt: "Parede com sistemas de proteção contra incêndio e extintor com etiqueta PROTECIN", sizes: "(min-width: 1024px) 58vw, 100vw" }}
            credit="acervo"
            caption="Extintor com etiqueta PROTECIN."
            parallax={6}
            aspect="4/3"
            brackets
          />
          <div className="flex flex-col gap-10 lg:col-span-5">
            <CaptionedFigure
              img={{ id: "servico-instalacao", alt: "Linha de válvulas de sprinkler", sizes: "(min-width: 1024px) 40vw, 100vw" }}
              credit="ilustrativa"
              creditPosition="sobre"
              parallax={8}
              brackets
            />
            <ClipReveal from="left" className="relative aspect-[16/10] overflow-clip">
              <LazyVideo id="hero" label="Vídeo ilustrativo: módulos de sistema fixo de supressão" when="near" className="h-full w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
              <span className="rotulo absolute bottom-3 left-3 rounded-[6px] bg-noite-950/70 px-2.5 py-1.5 text-papel-50">IMAGEM ILUSTRATIVA</span>
            </ClipReveal>
          </div>
        </div>
        <div className="mt-16 grid items-center gap-10 md:grid-cols-2">
          <div className="flex justify-center">
            <TiltCard glare className="w-[240px] rounded-r-sm shadow-[0_40px_80px_-30px_rgba(143,20,27,0.7)] md:w-[300px]">
              <Img id="catalogo-capa" alt="Capa do Catálogo Digital Protecin" sizes="300px" className="block overflow-clip rounded-r-sm" imgClassName="h-auto w-full" />
            </TiltCard>
          </div>
          <div className="h-[320px] overflow-clip rounded-r-lg">
            <ParallaxMedia amount={12}>
              <Img id="co2-cilindros" alt="" sizes="(min-width: 768px) 50vw, 100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
            </ParallaxMedia>
          </div>
        </div>
      </Bloco>

      <Bloco id="icones" titulo="Ícones e traços" nota="DrawIcon · DrawPath · Rule">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-12">
          {(Object.keys(ICONES) as IconeId[]).map((id, i) => (
            <div key={id} className="group grid aspect-square place-items-center rounded-r-sm border border-noite-700 bg-noite-900 text-papel-300 transition-colors hover:text-brasa-400" title={id}>
              <DrawIcon icon={id} size={28} delay={(i % 12) * 0.03} redrawOnHover />
            </div>
          ))}
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <svg viewBox="0 0 600 180" className="h-auto w-full text-brasa-400" role="img" aria-label="Traços de teste">
            <DrawPath d="M10 150 C 120 20, 240 20, 300 90 S 480 170, 590 30" strokeWidth={2} />
            <g className="text-marinho-300">
              <DrawPath d="M10 170 L 590 170" dashed delay={0.3} />
            </g>
          </svg>
          <div className="flex flex-col justify-center gap-6">
            <Rule />
            <Rule origin="center" delay={0.12} className="bg-brasa-400" />
            <Rule origin="end" delay={0.24} />
            <div className="flex h-24 gap-8">
              <Rule axis="y" />
              <Rule axis="y" delay={0.12} className="bg-brasa-400" />
              <Rule axis="y" origin="end" delay={0.24} />
            </div>
          </div>
        </div>
      </Bloco>

      <Bloco id="numeros" titulo="Números" nota="Odometer · Reel · StampBadge">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {NUMEROS.slice(1).map((n) => (
            <div key={n.valor} className="border-t border-noite-600 pt-5">
              <p className="display-l text-papel-50">
                <Odometer value={n.valor} ariaLabel={n.ariaLabel} />
              </p>
              <p className="mt-3 text-[16px] text-papel-300">{n.rotulo}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Rotulo>Odometer trigger="value"</Rotulo>
            <p className="font-mono text-[28px] font-medium text-brasa-300">
              <Odometer value={String(marcos[ano].ano)} trigger="value" />
            </p>
            <p className="mt-3 max-w-[48ch] text-[15px] text-papel-300">{marcos[ano].texto}</p>
            <button type="button" className="mt-6 min-h-11 rounded-full border border-papel-50/30 px-5 text-[15px] font-semibold hover:border-papel-50/90" onClick={() => setAno((a) => (a + 1) % marcos.length)}>
              Próximo marco
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <StampBadge text="100% conforme NBR 12962 · NBR 12779" />
            <StampBadge text="Projeto com ART · Assessoria AVCB" className="text-papel-50" />
          </div>
        </div>
      </Bloco>

      <Bloco id="interacao" titulo="Interação" nota="CTAs · Magnetic · TextRoll · FocusBrackets · Chips · CursorPreview">
        <div className="flex flex-wrap gap-3">
          <OrcamentoCta formLocation="sandbox" />
          <WhatsAppCta location="hero" />
          <PhoneCta location="hero" />
          <PrimaryCta href="#interacao" icon="download">
            Baixar catálogo (PDF)
          </PrimaryCta>
          <GhostCta to="/servicos/">Ver serviços</GhostCta>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-6 text-papel-50">
          <Magnetic strength={0.4}>
            <span className="grid h-14 w-14 place-items-center rounded-full border border-papel-50/25">
              <GlifoWhatsApp size={22} className="text-whatsapp" />
            </span>
          </Magnetic>
          <GlifoInstagram size={24} />
          <GlifoLinkedIn size={24} />
          <a href="#interacao" className="group text-[17px] font-medium">
            <TextRoll text="Link com TextRoll" />
          </a>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {(["hover", "locked", "enter"] as const).map((m) => (
            <div key={m} tabIndex={0} className="group relative grid aspect-[16/10] place-items-center rounded-r-md bg-noite-800">
              <span className="rotulo text-papel-300">FocusBrackets · {m}</span>
              <FocusBrackets mode={m} />
            </div>
          ))}
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <Rotulo>Chip · ChipToggle</Rotulo>
            <div className="flex flex-wrap gap-2">
              {SERVICOS[3].chips.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
              <Chip tone="azul">NBR 12962</Chip>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {SERVICOS.slice(0, 5).map((s) => (
                <ChipToggle
                  key={s.slug}
                  selected={selecionados.includes(s.nome)}
                  onToggle={() => setSelecionados((x) => (x.includes(s.nome) ? x.filter((y) => y !== s.nome) : [...x, s.nome]))}
                >
                  {s.nome}
                </ChipToggle>
              ))}
            </div>
            <div className="mt-8 flex gap-2">
              {PLATAFORMA.pilares.map((p, i) => (
                <button key={p.numero} type="button" onClick={() => setAba(i)} className={`min-h-11 rounded-full px-4 text-[14px] font-medium ${aba === i ? "bg-papel-50 text-noite-950" : "border border-noite-600 text-papel-300"}`}>
                  {p.numero}
                </button>
              ))}
            </div>
            <Reel count={4} index={aba} className="mt-4 h-14" itemClassName="flex items-center">
              {PLATAFORMA.pilares.map((p) => (
                <p key={p.numero} className="titulo text-papel-50">
                  {p.titulo}
                </p>
              ))}
            </Reel>
          </div>
          <div>
            <Rotulo>CursorPreview (desktop)</Rotulo>
            <ul ref={listaSetores} className="border-t border-noite-600">
              {SETORES.itens.map((s) => (
                <li key={s.id} className="border-b border-noite-600" onPointerEnter={() => setPrevia(s.imagem)}>
                  <span className="display-l block py-5 text-papel-50 transition-colors duration-200 hover:text-brasa-400">{s.nome}</span>
                </li>
              ))}
            </ul>
            <CursorPreview image={previa} containerRef={listaSetores} />
          </div>
        </div>
      </Bloco>

      <section id="fitas" className="tom-claro bg-papel-50 py-24 text-noite-950 lg:py-32">
        <Container>
          <SectionLabel index="02" label="Credibilidade" tone="claro" />
          <h2 className="display-xl mt-6">{GRUPOS_MARCAS.autorizada.titulo}</h2>
        </Container>
        <div className="mt-12 flex flex-col gap-4">
          <VelocityMarquee ariaLabel={GRUPOS_MARCAS.autorizada.aria} className="border-y border-noite-950/10 py-5" trackClassName="gap-0">
            {AUTORIZADAS.map((m) => (
              <span key={m.id} className="flex items-center" data-marca={m.grupo}>
                <span className="group relative mx-8 grid h-14 w-40 place-items-center">
                  <Img id={m.imagem} alt={m.nome} sizes="160px" className="block" imgClassName="h-auto max-h-12 w-auto max-w-[150px] opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0" />
                  <FocusBrackets tone="claro" offset={6} />
                </span>
                <span className="rotulo text-grafite-600">{GRUPOS_MARCAS.autorizada.rotulo}</span>
              </span>
            ))}
          </VelocityMarquee>
          <VelocityMarquee baseVelocity={1.2} ariaLabel={GRUPOS_MARCAS.marca.aria} className="border-b border-noite-950/10 py-5">
            {MARCAS.map((m) => (
              <span key={m.id} className="flex items-center" data-marca={m.grupo}>
                <span className="mx-8 grid h-14 w-40 place-items-center">
                  <Img id={m.imagem} alt={m.nome} sizes="160px" className="block" imgClassName="h-auto max-h-12 w-auto max-w-[150px] opacity-70 grayscale" />
                </span>
                <span className="rotulo text-grafite-600">{GRUPOS_MARCAS.marca.rotulo}</span>
              </span>
            ))}
          </VelocityMarquee>
          <VelocityMarquee baseVelocity={-1} className="mt-6" trackClassName="display-l stretch-66 uppercase">
            {FITAS.equipamentos.map((f) => (
              <span key={f} className="flex items-center">
                <span className="px-6">{f}</span>
                <Symbol size={20} tone="claro" />
              </span>
            ))}
          </VelocityMarquee>
        </div>
      </section>

      <PinStage mode="sempre" heightClassName="h-[200vh] lg:h-[240vh]" label="Cena fixada de teste" id="cena">
        <CenaTeste />
      </PinStage>

      <SectionRise id="rise" className="bg-mundo-vermelho">
        <div className="relative isolate overflow-clip py-28 lg:py-40">
          <Container className="relative text-center">
            <SectionLabel index="10" label="Orçamento" />
            <SplitWords as="h2" text="Precisa de uma proposta, agendar uma visita ou tirar dúvidas?" className="display-xl mx-auto mt-6 block max-w-[16ch] text-papel-50" />
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <OrcamentoCta formLocation="sandbox" />
              <WhatsAppCta location="orcamento" />
            </div>
          </Container>
        </div>
      </SectionRise>

      <Bloco id="proposta" titulo="Modo proposta" nota="ReservedSlot só aparece com ?proposta=1">
        <div className="grid gap-4 md:grid-cols-2">
          <ReservedSlot id="clientes" />
          <ReservedSlot id="obras" />
          <ReservedSlot id="depoimentos" />
          <ReservedSlot id="preco-unico" />
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a className="rotulo text-papel-300 underline-offset-4 hover:underline" href="?s=__primitivas&proposta=1">
            ativar proposta
          </a>
          <a className="rotulo text-papel-300 underline-offset-4 hover:underline" href="?s=__primitivas&proposta=0">
            desativar proposta
          </a>
        </div>
      </Bloco>

      <FaixaCta page="servicos" />
    </>
  );
}

// ---------------------------------------------------------------- aplicação do sandbox
function Conteudo() {
  const path = usePath();
  let corpo: ReactNode;
  if (todas || pedidas.length === 0) corpo = <Indice />;
  else if (pedidas.includes("__primitivas")) corpo = <Primitivas />;
  else corpo = <Secoes nomes={pedidas} />;
  return (
    <main id="conteudo" key={path}>
      {corpo}
    </main>
  );
}

function Sandbox() {
  return (
    <RouterProvider initialPath={rota} memory>
      <MotionRoot>
        <Preloader />
        <SkipLink />
        <ScrollFuse />
        <Nav />
        <Conteudo />
        <Footer />
        <FloatingContact />
        <PageCurtain />
        <ProposalBadge />
      </MotionRoot>
    </RouterProvider>
  );
}

// HMR: reaproveita a raiz (recriar com createRoot no mesmo contêiner gera aviso e monta tudo duas vezes)
const raiz: Root = (import.meta.hot?.data.raiz as Root | undefined) ?? createRoot(document.getElementById("root")!);
if (import.meta.hot) import.meta.hot.data.raiz = raiz;
(window as Window & { __ptBoot?: number }).__ptBoot = Date.now(); // seguro anti-invisível do <head> (dev.html)
raiz.render(
  <StrictMode>
    <Sandbox />
  </StrictMode>,
);
