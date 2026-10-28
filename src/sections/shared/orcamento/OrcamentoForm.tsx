import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useAnimationControls, useInView, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleAlert } from "lucide-react";
import { COMPANY, FORM, SERVICOS, SETORES_FORM } from "../../../data/site";
import { DUR, EASE_IN, EASE_OUT, SPRING, VIEWPORT, ease } from "../../../components/motion/tokens";
import { FocusBrackets } from "../../../components/motion/FocusBrackets";
import { TextRoll } from "../../../components/motion/TextRoll";
import { ChipToggle } from "../../../components/ui/Chip";
import { EVENTO_SERVICO, EmailLink, WhatsAppCta, WhatsAppLink } from "../../../components/ui/cta";
import { useMotionPref } from "../../../lib/motion-pref";
import { pushEvent, trackLead } from "../../../lib/track";
import { enviarSolicitacao, resumoCompleto, type Solicitacao } from "./envio";
import { emailValido, mascararTelefone, nomeValido, telefoneValido } from "./mascara";

/*
 * "Monte sua solicitação" (design-final §9 H10.1): três etapas no mesmo cartão.
 *   1. O que você precisa?  chips multisseleção com os 8 serviços + "Ainda não sei"
 *   2. Sobre o local        chip de setor (seleção única) + Cidade / UF
 *   3. Seus dados           nome*, empresa, e-mail*, telefone* (máscara), mensagem; enviar ou mandar pelo WhatsApp
 * Pré-seleção: ?servico=<slug> na URL ou o evento "pt:servico" (OrcamentoCta na home).
 * Envio: demo, nada sai do navegador (ver ./envio.ts). Validação ao sair do campo e ao enviar, erros em aria-live.
 */

type Etapa = 1 | 2 | 3;
type Status = "editando" | "enviando" | "sucesso" | "erro";
type CampoId = "nome" | "email" | "telefone";

const NAO_SEI = "ainda-nao-sei";
const OBRIGATORIOS: CampoId[] = ["nome", "email", "telefone"];

export interface OrcamentoFormProps {
  /** form_location do evento form_open (foco no 1º campo). */
  formLocation?: string;
  /** Fundo do cartão: "escuro" (noite-900, padrão) ou "fundo" (noite-950, para seções noite-900). */
  card?: "escuro" | "fundo";
  className?: string;
}

// ---------------------------------------------------------------- variantes (§9 H10.1)
const out = ease(EASE_OUT);
const ETAPA_FULL: Variants = {
  oculto: { opacity: 1, x: 0 },
  entra: (d: number) => ({ opacity: 0, x: 40 * d }),
  centro: { opacity: 1, x: 0, transition: { duration: DUR.curta, ease: out, staggerChildren: 0.05, delayChildren: 0.04 } },
  sai: (d: number) => ({ opacity: 0, x: -40 * d, transition: { duration: 0.25, ease: ease(EASE_IN) } }),
};
const ETAPA_REDUZIDA: Variants = {
  oculto: { opacity: 1 },
  entra: { opacity: 0 },
  centro: { opacity: 1, x: 0, transition: { duration: DUR.micro } },
  sai: { opacity: 0, transition: { duration: 0.15 } },
};
const ITEM_FULL: Variants = {
  oculto: { opacity: 0, y: 16 },
  entra: { opacity: 0, y: 10 },
  centro: { opacity: 1, y: 0, transition: { duration: DUR.curta, ease: out } },
  sai: {},
};
const ITEM_REDUZIDO: Variants = {
  oculto: { opacity: 0 },
  entra: { opacity: 1 },
  centro: { opacity: 1, y: 0, transition: { duration: DUR.micro } },
  sai: {},
};

// ---------------------------------------------------------------- botões do cartão (visual do PrimaryCta, com type/disabled)
const BTN =
  "group relative inline-flex h-11 select-none items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full px-5 text-[15px] font-semibold leading-none transition-[transform,opacity] duration-[350ms] ease-out active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 lg:h-12 lg:px-6 lg:text-botao";

function BotaoPrimario({ children, type = "button", disabled, onClick, carregando = false, seta = true }: { children: string; type?: "button" | "submit"; disabled?: boolean; onClick?: () => void; carregando?: boolean; seta?: boolean }) {
  return (
    <button type={type} disabled={disabled || carregando} onClick={onClick} className={`${BTN} bg-brasa-500 text-white shadow-[0_18px_40px_-18px_rgba(190,30,41,0.8)] ${carregando ? "!opacity-100" : ""}`}>
      <span aria-hidden className="cta-varredura absolute inset-0 origin-left scale-x-0 bg-brasa-600 transition-transform duration-[350ms] ease-out group-hover:scale-x-100 group-disabled:!scale-x-0" />
      {carregando ? (
        <>
          <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="relative [html.motion-full_&]:animate-spin">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="relative">{children}</span>
        </>
      ) : (
        <>
          <TextRoll text={children} className="relative" />
          {seta && <ArrowRight aria-hidden size={18} strokeWidth={1.75} className="relative -mr-1 transition-transform duration-[350ms] ease-out group-hover:translate-x-1 group-disabled:!translate-x-0" />}
        </>
      )}
    </button>
  );
}

function BotaoVoltar({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group -ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-[15px] font-medium text-papel-300 transition-colors duration-200 hover:text-papel-50"
    >
      <ArrowLeft aria-hidden size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover:-translate-x-1" />
      {children}
    </button>
  );
}

// ---------------------------------------------------------------- campo com rótulo flutuante (§5.4 "Campo")
interface CampoProps {
  id: string;
  name: string;
  rotulo: string;
  placeholder: string;
  valor: string;
  onValor: (v: string, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSair?: () => void;
  obrigatorio?: boolean;
  erro?: string | null;
  tremor?: number;
  multilinha?: boolean;
  tipo?: string;
  inputMode?: "text" | "email" | "tel";
  autoComplete?: string;
  maxLength?: number;
  campoRef?: React.Ref<HTMLInputElement>;
  className?: string;
  item: Variants;
}

function Campo({ id, name, rotulo, placeholder, valor, onValor, onSair, obrigatorio, erro, tremor = 0, multilinha, tipo = "text", inputMode, autoComplete, maxLength, campoRef, className, item }: CampoProps) {
  const reduced = useMotionPref() === "reduced";
  const tremer = useAnimationControls();
  const [foco, setFoco] = useState(false);
  const erroId = `${id}-erro`;

  useEffect(() => {
    if (!tremor || !erro || reduced) return;
    void tremer.start({ x: [0, -6, 6, 0], transition: { duration: 0.3, ease: "easeInOut" } });
    // só quando o contador de tremor muda (envio com erro)
  }, [tremor]);

  const base =
    "peer block w-full bg-transparent text-[17px] text-papel-50 caret-brasa-400 outline-none placeholder:text-transparent focus:placeholder:text-papel-500 focus-visible:outline-none autofill:shadow-[inset_0_0_0_1000px_#09111C] autofill:[-webkit-text-fill-color:#F3EFE9]";
  const comum = {
    id,
    name,
    value: valor,
    placeholder,
    autoComplete,
    maxLength,
    "aria-invalid": erro ? true : undefined,
    "aria-describedby": erroId,
    "aria-required": obrigatorio || undefined,
    onFocus: () => setFoco(true),
    onBlur: () => {
      setFoco(false);
      onSair?.();
    },
  };

  return (
    <motion.div variants={item} data-motion="sobe" className={className}>
      <motion.div animate={tremer} className="relative pt-5">
        {multilinha ? (
          <textarea {...comum} rows={3} onChange={(e) => onValor(e.target.value, e)} className={`${base} min-h-[92px] resize-none py-2.5 leading-[1.45]`} />
        ) : (
          <input
            {...comum}
            ref={campoRef}
            type={tipo}
            inputMode={inputMode}
            onChange={(e) => onValor(e.target.value, e)}
            className={`${base} h-11`}
          />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-0 top-5 flex h-11 origin-[0%_50%] -translate-y-[22px] scale-[0.8] items-center whitespace-nowrap text-[17px] text-papel-300 transition-transform duration-200 ease-out peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-[22px] peer-focus:scale-[0.8] peer-focus:text-papel-50 [html.motion-reduced_&]:transition-none"
        >
          {rotulo}
          {obrigatorio && (
            <span aria-hidden className="ml-1 text-brasa-300">
              *
            </span>
          )}
        </label>
        <span aria-hidden className={`absolute inset-x-0 bottom-0 h-px ${erro ? "bg-brasa-300" : "bg-noite-600"}`} />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-brasa-400 transition-transform duration-200 ease-out peer-focus:scale-x-100 [html.motion-reduced_&]:transition-none"
        />
        <span aria-hidden className="pointer-events-none absolute -bottom-1.5 -left-3 -right-3 top-0">
          <FocusBrackets mode="hover" offset={8} size={12} className={foco ? "is-on" : ""} />
        </span>
      </motion.div>
      <div id={erroId} aria-live="polite" className="min-h-[24px] pt-1.5">
        <AnimatePresence initial={false}>
          {erro && (
            <motion.p
              key={erro}
              initial={{ opacity: 0, y: reduced ? 0 : -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: DUR.micro, ease: out }}
              className="flex items-center gap-1.5 text-[14px] leading-snug text-brasa-300"
            >
              <CircleAlert aria-hidden size={15} strokeWidth={1.75} className="shrink-0" />
              {erro}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------- formulário
export default function OrcamentoForm({ formLocation = "orcamento", card = "escuro", className }: OrcamentoFormProps) {
  const reduced = useMotionPref() === "reduced";
  const uid = useId().replace(/:/g, "");
  const raiz = useRef<HTMLFormElement>(null);
  const visto = useInView(raiz, VIEWPORT);
  const [etapa, setEtapa] = useState<Etapa>(1);
  const [direcao, setDirecao] = useState(1);
  const [primeira, setPrimeira] = useState(true);
  const [servicos, setServicos] = useState<string[]>([]);
  const [setor, setSetor] = useState("");
  const [cidade, setCidade] = useState("");
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tocados, setTocados] = useState<Record<CampoId, boolean>>({ nome: false, email: false, telefone: false });
  const [tremor, setTremor] = useState(0);
  const [status, setStatus] = useState<Status>("editando");
  const montadoEm = useRef(0);
  const vivo = useRef(true);
  const abriu = useRef(false);
  const focarTitulo = useRef(false);
  const honey = useRef<HTMLInputElement>(null);
  const blocoFinal = useRef<HTMLDivElement>(null);
  const refs = { nome: useRef<HTMLInputElement>(null), email: useRef<HTMLInputElement>(null), telefone: useRef<HTMLInputElement>(null) };

  useEffect(() => {
    montadoEm.current = Date.now();
    vivo.current = true;
    return () => {
      vivo.current = false;
    };
  }, []);

  // pré-seleção: ?servico=<slug> e o evento "pt:servico"
  useEffect(() => {
    const marcar = (slug: unknown) => {
      if (typeof slug !== "string" || !SERVICOS.some((s) => s.slug === slug)) return;
      setServicos((atual) => (atual.includes(slug) ? atual : [...atual.filter((x) => x !== NAO_SEI), slug]));
    };
    marcar(new URLSearchParams(window.location.search).get("servico"));
    const onEvento = (e: Event) => marcar((e as CustomEvent<unknown>).detail);
    window.addEventListener(EVENTO_SERVICO, onEvento);
    return () => window.removeEventListener(EVENTO_SERVICO, onEvento);
  }, []);

  // foco no bloco de sucesso/erro quando ele aparece
  useEffect(() => {
    if (status === "sucesso" || status === "erro") blocoFinal.current?.focus({ preventScroll: true });
  }, [status]);

  // ------------------------------------------------ dados derivados
  const slugs = [...SERVICOS.filter((s) => servicos.includes(s.slug)).map((s) => s.slug), ...(servicos.includes(NAO_SEI) ? [NAO_SEI] : [])];
  const nomes = slugs.map((s) => (s === NAO_SEI ? FORM.naoSei : SERVICOS.find((x) => x.slug === s)?.nome ?? s));
  const dados: Solicitacao = { servicos: nomes, setor, cidade, nome, empresa, slugs, email, telefone, mensagem };
  const detalhe = slugs.join(",") || undefined;
  const erros: Record<CampoId, string | null> = {
    nome: nomeValido(nome) ? null : FORM.erros.nome,
    email: emailValido(email) ? null : FORM.erros.email,
    telefone: telefoneValido(telefone) ? null : FORM.erros.telefone,
  };
  const erroVisivel = (c: CampoId) => (tocados[c] ? erros[c] : null);
  const tocar = (c: CampoId) => setTocados((t) => (t[c] ? t : { ...t, [c]: true }));

  const alternarServico = (slug: string) =>
    setServicos((atual) => {
      if (atual.includes(slug)) return atual.filter((x) => x !== slug);
      if (slug === NAO_SEI) return [NAO_SEI];
      return [...atual.filter((x) => x !== NAO_SEI), slug];
    });

  const irPara = (n: Etapa) => {
    setDirecao(n > etapa ? 1 : -1);
    setPrimeira(false);
    focarTitulo.current = true;
    setEtapa(n);
    if (n > etapa) pushEvent("form_step", { step: n });
  };

  const onFocusForm = () => {
    if (abriu.current) return;
    abriu.current = true;
    pushEvent("form_open", { form_location: formLocation });
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "enviando") return;
    if (etapa === 1) {
      if (slugs.length) irPara(2);
      return;
    }
    if (etapa === 2) {
      irPara(3);
      return;
    }
    setTocados({ nome: true, email: true, telefone: true });
    const invalidos = OBRIGATORIOS.filter((c) => erros[c]);
    if (invalidos.length) {
      setTremor((t) => t + 1);
      refs[invalidos[0]].current?.focus();
      return;
    }
    // anti-spam (Seven): honeypot preenchido ou envio em menos de 1,5 s → finge sucesso e não registra o lead
    const suspeito = (honey.current?.value ?? "") !== "" || Date.now() - montadoEm.current < 1500;
    setStatus("enviando");
    const r = await enviarSolicitacao(dados);
    if (!vivo.current) return;
    if (r.ok || suspeito) {
      setStatus("sucesso");
      if (!suspeito) {
        pushEvent("form_lead", { servicos: slugs.join(","), setor: setor || undefined, cidade: cidade.trim() || undefined, demo: r.demo });
        trackLead("email", "formulario", "orcamento");
      }
    } else setStatus("erro");
  };

  // ------------------------------------------------ apresentação
  const variantesEtapa = reduced ? ETAPA_REDUZIDA : ETAPA_FULL;
  const item = reduced ? ITEM_REDUZIDO : ITEM_FULL;
  const estado = visto || reduced ? "centro" : "oculto";
  const tituloId = `${uid}-titulo`;
  const etapaTituloId = `${uid}-etapa`;
  const barra = status === "sucesso" ? 3 : etapa;
  const fundo = card === "fundo" ? "bg-noite-950" : "bg-noite-900";

  // o título da etapa nova recebe o foco assim que monta (troca de etapa pelo visitante, não na 1ª carga)
  const focarAoMontar = (el: HTMLHeadingElement | null) => {
    if (!el || !focarTitulo.current) return;
    focarTitulo.current = false;
    el.focus({ preventScroll: true });
  };

  const cabecalhoEtapa = (titulo: string, voltar?: Etapa) => (
    <motion.div variants={item} data-motion="sobe" className="flex min-h-11 items-center justify-between gap-4">
      <h4 id={etapaTituloId} ref={focarAoMontar} tabIndex={-1} className="text-[22px] font-semibold leading-tight text-papel-50 outline-none lg:text-[24px]">
        {titulo}
      </h4>
      {voltar && <BotaoVoltar onClick={() => irPara(voltar)}>{FORM.botoes.voltar}</BotaoVoltar>}
    </motion.div>
  );

  let corpo: ReactNode;
  if (status === "sucesso") {
    corpo = (
      <motion.div
        key="sucesso"
        ref={blocoFinal}
        tabIndex={-1}
        role="status"
        // sem animação de opacidade neste wrapper: o acionador de visibilidade do GTM mede .msg-sucesso
        className="msg-sucesso flex flex-1 flex-col justify-center outline-none"
        data-motion="sobe"
        initial={reduced ? false : { y: 16, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: DUR.curta, ease: out }}
      >
        <motion.span
          aria-hidden
          data-motion="carimbo"
          className="grid h-16 w-16 place-items-center rounded-full bg-marinho-700 text-papel-50"
          initial={reduced ? false : { opacity: 0, scale: 1.35, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", ...SPRING.encaixe, delay: 0.12 }}
        >
          <Check size={28} strokeWidth={1.75} />
        </motion.span>
        <p className="mt-8 max-w-[38ch] text-[20px] font-medium leading-snug text-papel-50 lg:text-[22px]">{FORM.sucesso}</p>
        <p className="mt-5 max-w-[46ch] border-l-2 border-brasa-400 pl-4 text-[15px] leading-relaxed text-papel-300">{FORM.sucessoDemo}</p>
      </motion.div>
    );
  } else if (status === "erro") {
    corpo = (
      <motion.div
        key="erro"
        ref={blocoFinal}
        tabIndex={-1}
        role="alert"
        className="flex flex-1 flex-col justify-center outline-none"
        data-motion="sobe"
        initial={reduced ? false : { y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DUR.curta, ease: out }}
      >
        <span aria-hidden className="grid h-16 w-16 place-items-center rounded-full border border-brasa-300/60 text-brasa-300">
          <CircleAlert size={28} strokeWidth={1.5} />
        </span>
        <p className="mt-8 text-[20px] font-medium leading-snug text-papel-50 lg:text-[22px]">{FORM.erro}</p>
        <p className="mt-3 text-[15px] text-papel-300">{FORM.erroAlternativas}</p>
        <div className="mt-6 flex flex-col gap-2">
          <EmailLink
            location="formulario"
            detail={detalhe}
            subject={FORM.assunto}
            body={resumoCompleto(dados)}
            className="group inline-flex min-h-11 w-fit items-center gap-2 text-[17px] text-papel-50 underline decoration-papel-50/30 underline-offset-4 transition-colors duration-200 hover:decoration-papel-50"
          >
            {FORM.campos.email.label}: {COMPANY.email}
          </EmailLink>
          <WhatsAppLink
            location="formulario"
            detail={detalhe}
            message={FORM.waResumo(dados)}
            className="group inline-flex min-h-11 w-fit items-center gap-2.5 text-[17px] text-papel-50 underline decoration-papel-50/30 underline-offset-4 transition-colors duration-200 hover:decoration-papel-50"
          >
            <span aria-hidden className="h-2 w-2 rounded-full bg-whatsapp" />
            {FORM.botoes.whatsapp}
          </WhatsAppLink>
        </div>
      </motion.div>
    );
  } else {
    corpo = (
      <motion.div
        key={`etapa-${etapa}`}
        custom={direcao}
        variants={variantesEtapa}
        initial={primeira ? "oculto" : "entra"}
        animate={estado}
        exit="sai"
        className="flex flex-1 flex-col"
        role="group"
        aria-labelledby={etapaTituloId}
      >
        {etapa === 1 && (
          <>
            {cabecalhoEtapa(FORM.etapas[0].titulo)}
            <div className="mt-5 flex flex-wrap gap-2 [&_button]:text-left">
              {SERVICOS.map((s) => (
                <motion.div key={s.slug} variants={item} data-motion="sobe" className="max-w-full">
                  <ChipToggle selected={servicos.includes(s.slug)} onToggle={() => alternarServico(s.slug)}>
                    {s.nome}
                  </ChipToggle>
                </motion.div>
              ))}
              <motion.div variants={item} data-motion="sobe" className="max-w-full">
                <ChipToggle selected={servicos.includes(NAO_SEI)} onToggle={() => alternarServico(NAO_SEI)}>
                  {FORM.naoSei}
                </ChipToggle>
              </motion.div>
            </div>
            <motion.div variants={item} data-motion="sobe" className="mt-auto flex justify-end pt-8">
              <BotaoPrimario type="submit" disabled={!slugs.length}>
                {FORM.botoes.continuar}
              </BotaoPrimario>
            </motion.div>
          </>
        )}

        {etapa === 2 && (
          <>
            {cabecalhoEtapa(FORM.etapas[1].titulo, 1)}
            <div className="mt-5 flex flex-wrap gap-2">
              {SETORES_FORM.map((s) => (
                <motion.div key={s} variants={item} data-motion="sobe">
                  <ChipToggle selected={setor === s} onToggle={() => setSetor((atual) => (atual === s ? "" : s))}>
                    {s}
                  </ChipToggle>
                </motion.div>
              ))}
            </div>
            <Campo
              item={item}
              className="mt-6"
              id={`${uid}-cidade`}
              name="cidade"
              rotulo={FORM.campos.cidade.label}
              placeholder={FORM.campos.cidade.placeholder}
              valor={cidade}
              onValor={setCidade}
              autoComplete="address-level2"
              maxLength={80}
            />
            <motion.div variants={item} data-motion="sobe" className="mt-auto flex justify-end pt-6">
              <BotaoPrimario type="submit">{FORM.botoes.continuar}</BotaoPrimario>
            </motion.div>
          </>
        )}

        {etapa === 3 && (
          <>
            {cabecalhoEtapa(FORM.etapas[2].titulo, 2)}
            <div className="mt-3 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              <Campo
                item={item}
                id={`${uid}-nome`}
                name="nome"
                rotulo={FORM.campos.nome.label}
                placeholder={FORM.campos.nome.placeholder}
                valor={nome}
                onValor={setNome}
                onSair={() => tocar("nome")}
                obrigatorio
                erro={erroVisivel("nome")}
                tremor={tremor}
                autoComplete="name"
                maxLength={120}
                campoRef={refs.nome}
              />
              <Campo
                item={item}
                id={`${uid}-empresa`}
                name="empresa"
                rotulo={FORM.campos.empresa.label}
                placeholder={FORM.campos.empresa.placeholder}
                valor={empresa}
                onValor={setEmpresa}
                autoComplete="organization"
                maxLength={120}
              />
              <Campo
                item={item}
                id={`${uid}-email`}
                name="email"
                rotulo={FORM.campos.email.label}
                placeholder={FORM.campos.email.placeholder}
                valor={email}
                onValor={setEmail}
                onSair={() => tocar("email")}
                obrigatorio
                erro={erroVisivel("email")}
                tremor={tremor}
                tipo="email"
                inputMode="email"
                autoComplete="email"
                maxLength={160}
                campoRef={refs.email}
              />
              <Campo
                item={item}
                id={`${uid}-telefone`}
                name="telefone"
                rotulo={FORM.campos.telefone.label}
                placeholder={FORM.campos.telefone.placeholder}
                valor={telefone}
                onValor={(v) => setTelefone((anterior) => mascararTelefone(v, anterior))}
                onSair={() => tocar("telefone")}
                obrigatorio
                erro={erroVisivel("telefone")}
                tremor={tremor}
                tipo="tel"
                inputMode="tel"
                autoComplete="tel-national"
                maxLength={16}
                campoRef={refs.telefone}
              />
              <Campo
                item={item}
                className="sm:col-span-2"
                id={`${uid}-mensagem`}
                name="mensagem"
                rotulo={FORM.campos.mensagem.label}
                placeholder={FORM.campos.mensagem.placeholder}
                valor={mensagem}
                onValor={setMensagem}
                multilinha
                maxLength={1200}
              />
            </div>
            <motion.div variants={item} data-motion="sobe" className="mt-auto flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <WhatsAppCta location="formulario" detail={detalhe} message={FORM.waResumo(dados)} size="sm" className="w-full sm:w-auto">
                {FORM.botoes.whatsapp}
              </WhatsAppCta>
              <BotaoPrimario type="submit" carregando={status === "enviando"}>
                {status === "enviando" ? FORM.botoes.enviando : FORM.botoes.enviar}
              </BotaoPrimario>
            </motion.div>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <form
      ref={raiz}
      noValidate
      onSubmit={enviar}
      onFocus={onFocusForm}
      aria-labelledby={tituloId}
      aria-busy={status === "enviando" || undefined}
      className={`relative flex flex-col overflow-clip rounded-r-lg border border-noite-700 ${fundo} p-6 sm:p-8 lg:min-h-[640px] lg:p-10 ${className ?? ""}`}
    >
      <div className="flex flex-col-reverse items-start gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 id={tituloId} className="text-[24px] font-bold leading-tight text-papel-50 [font-stretch:75%] lg:text-[30px]">
          {FORM.titulo}
        </h3>
        <p className="rotulo shrink-0 text-papel-500 tnum" aria-live="polite">
          {FORM.etapa(barra)}
        </p>
      </div>
      <div aria-hidden className="mt-4 flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <span key={i} className="relative h-[3px] flex-1 overflow-clip rounded-full bg-noite-700">
            <motion.span
              className="absolute inset-0 origin-left bg-brasa-400"
              initial={false}
              animate={{ scaleX: i <= barra ? 1 : 0 }}
              transition={reduced ? { duration: 0 } : { duration: DUR.curta, ease: out }}
            />
          </span>
        ))}
      </div>

      <div className="mt-7 flex flex-1 flex-col lg:mt-8">
        <AnimatePresence mode="wait" custom={direcao}>
          {corpo}
        </AnimatePresence>
      </div>

      {/* anti-spam (Seven): campo-isca fora da vista; pessoas não preenchem */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0">
        <label htmlFor={`${uid}-honey`}>_honey</label>
        <input ref={honey} id={`${uid}-honey`} name="_honey" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <p className="sr-only" role="status">
        {status === "enviando" ? FORM.botoes.enviando : ""}
      </p>
    </form>
  );
}
