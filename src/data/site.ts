/*
 * Todo o conteúdo do site novo da Protecin (design-final §11).
 * Só dados e tipos: nada de React nem lucide (ícones são IconeId, resolvidos em components/ui/icones.ts).
 * Fonte única dos textos: referencia/conteudo-estruturado.md (seção indicada em cada bloco). Nada inventado:
 * o que depende da Protecin fica null ou só aparece no modo proposta (RESERVADOS).
 */
import { IMAGENS, type ImagemId } from "./imagens.gen";
import { VIDEOS, type VideoId } from "./videos.gen";

export type { ImagemId, VideoId };

// ---------------------------------------------------------------- tipos
export type ServicoSlug =
  | "instalacao-de-sistemas-e-equipamentos"
  | "projetos-tecnicos"
  | "documentacao-e-regularizacao"
  | "inspecoes-e-manutencoes-preventivas"
  | "manutencao-de-equipamentos"
  | "gestao-de-riscos-e-consultoria"
  | "venda-de-equipamentos"
  | "sinalizacao-de-seguranca";
export type PageId = "home" | "institucional" | "servicos" | "clientes" | "catalogo" | "app" | "contato" | "creditos" | "404";
export type LeadChannel = "whatsapp" | "phone" | "email";
export type LeadLocation =
  | "nav" | "menu" | "hero" | "servicos" | "plataforma" | "historia" | "orcamento" | "formulario" | "rodape"
  | "botao_flutuante" | "barra_mobile" | "pagina_institucional" | "pagina_servicos" | "pagina_clientes"
  | "pagina_catalogo" | "pagina_app" | "pagina_contato" | "faixa_cta" | "avcb" | "pagina_404";
export type IconeId =
  | "wrench" | "drafting-compass" | "clipboard-check" | "list-checks" | "settings-2" | "shield-alert"
  | "fire-extinguisher" | "signpost" | "headset" | "monitor-cog" | "shield-check" | "hard-hat"
  | "smartphone" | "layout-dashboard" | "wifi-off" | "file-check" | "mail-check" | "messages-square"
  | "activity" | "badge-check" | "circle-check" | "landmark" | "cpu" | "heart-pulse" | "factory" | "wheat"
  | "zap" | "truck" | "user-check" | "thumbs-up" | "map-pinned" | "server" | "phone" | "mail" | "map-pin" | "clock";
export type ReservadoId = "clientes" | "obras" | "depoimentos" | "preco-unico";
export type Linhas = readonly string[] | { readonly desktop: readonly string[]; readonly celular: readonly string[] };
export interface Titulo { texto: string; linhas: Linhas; destaque?: readonly string[] }

export interface Rota { path: string; page: PageId; title: string; description: string; label: string; noindex?: boolean }
export interface Marca { id: string; nome: string; imagem: ImagemId; imagemEscuro?: ImagemId; grupo: "autorizada" | "marca" | "filiacao" }
export interface Servico {
  slug: ServicoSlug; numero: string; nome: string; nomeCurto: string;
  resumo: string; // versão de /servicos (ou a única existente)
  descricao: string | null; // versão da home, quando existe e é diferente
  chips: string[]; icone: IconeId; imagem: ImagemId;
  imagem2?: ImagemId; imagem2Credito?: "acervo" | "ilustrativa"; imagem2Posicao?: string; video?: VideoId;
}
export interface Hotspot { id: number; x: number; y: number; nome: string; titulo: string; texto: string; servico: ServicoSlug }
export interface Chamada { x: number; y: number; rotulo: string }
export interface Pilar { numero: string; titulo: string; texto: string; icone: IconeId }
export interface Modulo { id: "coleta" | "processador" | "webmaster"; nome: string; uso: string | null; itens: string[]; icone: IconeId }
export interface Marco { ano: number; rotulo: string; texto: string; imagem?: ImagemId; simbolo?: boolean; final?: boolean }
export interface Setor { id: "financeiro" | "industrial" | "energia"; nome: string; texto: string; imagem: ImagemId; icones: IconeId[] }
export interface Camada {
  id: string; codigo: string; nome: string; textos: string[]; servicos: ServicoSlug[];
  cor: "brasa" | "alarme" | "papel" | "fotolum" | "todas"; itens: string[];
}
export interface Credito { tipo: "video" | "foto"; titulo: string; fonte: string; autor?: string; url?: string; licenca: string }
export interface LinkInterno { label: string; to: string }

/** Une as linhas de um título (para aria-label e textos corridos). */
export function linhasTexto(l: Linhas): string {
  return ("desktop" in l ? l.desktop : l).join(" ");
}

// ---------------------------------------------------------------- empresa (§1.1, §1.11)
export const COMPANY = {
  nome: "Protecin",
  razaoSocial: "Protecin Proteção Técnica Contra Incêndio Ltda.",
  fundacao: 1976,
  descritor: "Engenharia e Proteção Técnica Contra Incêndio",
  slogan: "Protegemos seu maior patrimônio: a vida.",
  phoneDisplay: "+55 11 4977-8720",
  phoneTel: "tel:+551149778720",
  whatsappDisplay: "+55 11 94565-1751",
  whatsappNumber: "5511945651751",
  email: "comercial@protecin.com.br",
  email2: "falecom@protecin.com.br",
  endereco: { rua: "Rua Lacônia, 600", bairro: "Parque Capuava", cep: "09271-010", cidade: "Santo André", uf: "SP" },
  enderecoCompleto: "Rua Lacônia, 600, Parque Capuava, CEP 09271-010, Santo André - SP, Brasil",
  enderecoLinha: "Rua Lacônia, 600, Parque Capuava, CEP 09271-010, Santo André - SP",
  horario: "Segunda a sexta, 8h às 17h30",
  instagram: "https://www.instagram.com/protecin_ltda",
  instagramHandle: "@protecin_ltda",
  linkedin: "https://www.linkedin.com/company/protecin/",
  catalogoPdf: "https://protecin.com.br/wp-content/uploads/2025/07/Catalogo-Digital-Protecin.pdf",
  mapsEmbed: "https://www.google.com/maps?q=Rua+Lac%C3%B4nia,+600,+Santo+Andr%C3%A9+-+SP,+09271-010&output=embed",
  mapsDirections: "https://www.google.com/maps/dir/?api=1&destination=Rua+Lac%C3%B4nia,+600,+Santo+Andr%C3%A9+-+SP",
  dominio: "https://protecin.com.br",
  cnpj: null as string | null,
} as const;

// ---------------------------------------------------------------- rotas (§8)
export const ROUTES: Rota[] = [
  {
    path: "/", page: "home", label: "Início",
    title: "Protecin: engenharia e proteção técnica contra incêndio desde 1976",
    description: "Desde 1976 em Santo André (SP): projetos com ART, AVCB, instalação, inspeção e manutenção de sistemas contra incêndio. 20.000+ clientes atendidos.",
  },
  {
    path: "/institucional/", page: "institucional", label: "Institucional",
    title: "Institucional: Protecin desde 1976",
    description: "A história da Protecin de 1976 a 2024, missão, visão, valores, política ambiental e o Kids ONG.",
  },
  {
    path: "/servicos/", page: "servicos", label: "Serviços",
    title: "Serviços de engenharia, inspeção e manutenção contra incêndio: Protecin",
    description: "Instalação de sistemas, projetos técnicos com ART, regularização de AVCB, inspeções, manutenção, gestão de riscos, venda de equipamentos e sinalização.",
  },
  {
    path: "/nossos-clientes/", page: "clientes", label: "Nossos Clientes",
    title: "Nossos clientes e parcerias: Protecin",
    description: "Setores atendidos, autorizações Kidde Brasil, Everlux, Notifier e Simplex, e filiações técnicas.",
  },
  {
    path: "/catalogo-digital/", page: "catalogo", label: "Catálogo Digital",
    title: "Catálogo Digital Protecin",
    description: "Baixe o Catálogo Digital Protecin com serviços, produtos, tecnologias e diferenciais.",
  },
  {
    path: "/nosso-app/", page: "app", label: "Nosso App",
    title: "Protecin App: gestão inteligente de inspeções",
    description: "App de Coleta, Web Master e Processador de Coleta Online: inspeções de extintores e hidrantes conforme NBR 12962 e NBR 12779.",
  },
  {
    path: "/contato/", page: "contato", label: "Contato",
    title: "Contate a Protecin",
    description: "Telefone +55 11 4977-8720, WhatsApp, comercial@protecin.com.br. Rua Lacônia, 600, Santo André - SP. Segunda a sexta, 8h às 17h30.",
  },
  {
    path: "/creditos/", page: "creditos", label: "Créditos", noindex: true,
    title: "Créditos de imagens e vídeos: Protecin",
    description: "Fontes e autores das fotos e vídeos ilustrativos usados no site.",
  },
];

export const NOT_FOUND: Rota = {
  path: "/404.html", page: "404", label: "Página não encontrada", noindex: true,
  title: "Página não encontrada: Protecin", description: "",
};

// ---------------------------------------------------------------- navegação (§7.3, §7.4)
export const NAV: LinkInterno[] = [
  { label: "Institucional", to: "/institucional/" },
  { label: "Serviços", to: "/servicos/" },
  { label: "Nossos Clientes", to: "/nossos-clientes/" },
  { label: "Nosso App", to: "/nosso-app/" },
  { label: "Catálogo", to: "/catalogo-digital/" },
  { label: "Contato", to: "/contato/" },
];

export const MENU: { numero: string; label: string; to: string; imagem: ImagemId }[] = [
  { numero: "01", label: "Início", to: "/", imagem: "hero-poster" },
  { numero: "02", label: "Institucional", to: "/institucional/", imagem: "institucional-pilar" },
  { numero: "03", label: "Serviços", to: "/servicos/", imagem: "servico-instalacao" },
  { numero: "04", label: "Nossos Clientes", to: "/nossos-clientes/", imagem: "clientes-aperto" },
  { numero: "05", label: "Nosso App", to: "/nosso-app/", imagem: "app-webmaster-notebook" },
  { numero: "06", label: "Catálogo Digital", to: "/catalogo-digital/", imagem: "catalogo-capa" },
  { numero: "07", label: "Contato", to: "/contato/", imagem: "obra-parede-sistemas" },
];

/** Textos de interface do chrome (nav, menu, barra, toast, toggle, proposta). */
export const UI = {
  pularConteudo: "Pular para o conteúdo",
  menuAbrir: "Abrir menu",
  menuFechar: "Fechar menu",
  menu: "Menu",
  orcamentoCurto: "Orçamento",
  solicitarOrcamento: "Solicitar orçamento",
  falarWhatsapp: "Falar no WhatsApp",
  whatsapp: "WhatsApp",
  ligar: "Ligar",
  inicio: "Início",
  voltarTopo: "Voltar ao topo",
  reproduzirVideo: "Reproduzir vídeo ilustrativo",
  fotoAcervo: "Foto do acervo Protecin",
  imagemIlustrativa: "Imagem ilustrativa",
  rolar: "Role",
  menuRotuloCanais: "Fale com a Protecin",
  menuNavegacao: "Navegação principal",
} as const;

/** Mensagens pré-preenchidas do WhatsApp (§11). */
export const WA = {
  padrao: "Olá! Vim pelo site da Protecin e gostaria de solicitar um orçamento.",
  servico: (nome: string) => `Olá! Vim pelo site da Protecin e gostaria de um orçamento de ${nome}.`,
  plataforma: "Olá! Vim pelo site da Protecin e quero conhecer a plataforma Protecin App.",
  visita: "Olá! Vim pelo site da Protecin e gostaria de agendar uma visita técnica.",
  avcb: "Olá! Vim pelo site da Protecin e preciso de assessoria para obter ou renovar o AVCB.",
} as const;

/** Rótulos numerados das seções da home (as páginas internas recomeçam em "01"). */
export const SECOES = {
  escala: { index: "01", label: "Escala" },
  credibilidade: { index: "02", label: "Credibilidade" },
  servicos: { index: "03", label: "Serviços" },
  naPratica: { index: "04", label: "Na prática" },
  plataforma: { index: "05", label: "Plataforma" },
  diferenciais: { index: "06", label: "Por que a Protecin" },
  historia: { index: "07", label: "50 anos" },
  setores: { index: "08", label: "Setores" },
  compromisso: { index: "09", label: "Compromisso" },
  orcamento: { index: "10", label: "Orçamento" },
} as const;

// ---------------------------------------------------------------- H0 abertura (§9 H0; §2.1 Hero)
export const HERO = {
  rotulo: "ENGENHARIA E PROTEÇÃO TÉCNICA CONTRA INCÊNDIO · DESDE 1976",
  h1: {
    texto: "Protegendo vidas e patrimônios há 50 anos",
    linhas: { desktop: ["Protegendo vidas", "e patrimônios", "há 50 anos"], celular: ["Protegendo", "vidas e", "patrimônios", "há 50 anos"] },
    destaque: ["50"],
  } satisfies Titulo,
  paragrafo:
    "Referência em engenharia e proteção técnica contra incêndio, a Protecin oferece soluções em inspeção e manutenção de equipamentos com foco em segurança, conformidade e atendimento sob medida.",
  manifesto: "Protegemos seu maior patrimônio: *a vida.*",
  apoio:
    "Desde 1976, a Protecin oferece soluções técnicas em prevenção e combate a incêndios, protegendo vidas e patrimônios com tecnologia, equipe especializada e estrutura sólida.",
  cta1: "Solicitar orçamento",
  cta2: "Falar no WhatsApp",
} as const;

// ---------------------------------------------------------------- H1 escala (§1.2)
export const NUMEROS: { valor: string; rotulo: string; ariaLabel: string; titulo?: boolean }[] = [
  { valor: "20.000+", rotulo: "clientes atendidos", ariaLabel: "Mais de 20.000 clientes atendidos", titulo: true },
  { valor: "50", rotulo: "anos de experiência (desde 1976)", ariaLabel: "50 anos de experiência" },
  { valor: "3M+", rotulo: "equipamentos manutenidos", ariaLabel: "Mais de 3 milhões de equipamentos manutenidos" },
  { valor: "5M+", rotulo: "inspeções realizadas", ariaLabel: "Mais de 5 milhões de inspeções realizadas" },
  { valor: "250+", rotulo: "obras de médio e grande porte realizadas", ariaLabel: "Mais de 250 obras de médio e grande porte realizadas" },
];

// ---------------------------------------------------------------- H2 credibilidade (§2.1 Compromisso; §1.4)
export const COMPROMISSO = {
  sobretitulo: "Compromisso com a Segurança e a Excelência",
  h2: {
    texto: "Décadas de experiência na prevenção e combate a incêndios",
    linhas: ["Décadas de experiência", "na prevenção e", "combate a incêndios"],
  } satisfies Titulo,
  texto:
    "Desde 1976, a Protecin oferece soluções técnicas em prevenção e combate a incêndios, protegendo vidas e patrimônios com tecnologia, equipe especializada e estrutura sólida. Atuamos com responsabilidade e precisão na redução de riscos, e somos filiados às principais entidades do setor, reforçando nossa credibilidade e conformidade técnica.",
} as const;

export const SELOS: { texto: string; icone: IconeId }[] = [
  { texto: "Equipe Técnica Qualificada", icone: "user-check" },
  { texto: "Alto Índice de Satisfação dos Clientes", icone: "thumbs-up" },
  { texto: "Cobertura Técnica em Território Nacional", icone: "map-pinned" },
];

export const AUTORIZADAS: Marca[] = [
  { id: "kidde", nome: "Kidde Brasil", imagem: "logo-kidde", grupo: "autorizada" },
  { id: "everlux", nome: "Everlux", imagem: "logo-everlux", imagemEscuro: "logo-everlux-branco", grupo: "autorizada" },
  { id: "notifier", nome: "Notifier by Honeywell", imagem: "logo-notifier", grupo: "autorizada" },
  { id: "simplex", nome: "Simplex", imagem: "logo-simplex", grupo: "autorizada" },
];
export const MARCAS: Marca[] = [
  { id: "vesda", nome: "VESDA by Xtralis", imagem: "logo-vesda", grupo: "marca" },
  { id: "bosch", nome: "Bosch", imagem: "logo-bosch", grupo: "marca" },
  { id: "firebee", nome: "Firebee", imagem: "logo-firebee", grupo: "marca" },
  { id: "germek", nome: "Germek Equipamentos", imagem: "logo-germek", grupo: "marca" },
];
export const FILIACOES: Marca[] = [
  { id: "abspk", nome: "ABSpk (Associação Brasileira de Sprinklers)", imagem: "entidade-abspk", grupo: "filiacao" },
  { id: "nfpa", nome: "NFPA", imagem: "entidade-nfpa", grupo: "filiacao" },
];

/** Rótulos dos grupos de marcas (regra de honestidade §2: "Autorizada" só para as quatro autorizações). */
export const GRUPOS_MARCAS = {
  autorizada: {
    titulo: "Autorizações oficiais",
    rotulo: "AUTORIZADA",
    aria: "Autorizações oficiais: Kidde Brasil, Everlux, Notifier e Simplex",
  },
  marca: {
    titulo: "Marcas com que trabalhamos",
    rotulo: "MARCA",
    aria: "Marcas com que trabalhamos: VESDA by Xtralis, Bosch, Firebee e Germek Equipamentos",
  },
  filiacao: { titulo: "Filiações técnicas", rotulo: "FILIAÇÃO", legenda: "Entidades do setor" },
} as const;

// ---------------------------------------------------------------- H3 serviços (§1.6; §2.1 Serviços)
export const SERVICOS_HEADER = {
  label: "Serviços",
  sobretitulo: "Nossos Serviços",
  h2: { texto: "Engenharia, inspeção e manutenção", linhas: ["Engenharia, inspeção", "e manutenção"] } satisfies Titulo,
  subtitulo:
    "Em sistemas de prevenção e combate a incêndios. Da elaboração de projetos à gestão contínua dos equipamentos, oferecemos soluções completas para proteger pessoas, patrimônios e garantir a conformidade com normas técnicas e legais.",
  linhaFinal: "Precisa de mais de um serviço? Monte sua solicitação.",
  ctaServico: "Orçamento deste serviço",
  ctaMonte: "Monte sua solicitação",
  detalhes: "Detalhes",
  verDetalhes: "Ver detalhes",
} as const;

export const SERVICOS: Servico[] = [
  {
    slug: "instalacao-de-sistemas-e-equipamentos", numero: "01", nome: "Instalação de Sistemas e Equipamentos", nomeCurto: "Instalação",
    resumo: "Soluções completas e personalizadas para implantação de sistemas fixos e equipamentos de combate a incêndio, com segurança, rastreabilidade e foco em alta performance.",
    descricao: "Implantação de sistemas fixos e equipamentos contra incêndio com tecnologia atualizada, equipe especializada e componentes certificados para diferentes tipos de edificações e necessidades operacionais.",
    chips: ["Sistemas fixos", "Componentes certificados", "Rastreabilidade"],
    icone: "wrench", imagem: "servico-instalacao", imagem2: "servico-instalacao-2", imagem2Credito: "ilustrativa",
  },
  {
    slug: "projetos-tecnicos", numero: "02", nome: "Projetos Técnicos", nomeCurto: "Projetos",
    resumo: "Elaboração de projetos legais e executivos com emissão de ART, seguindo rigorosamente os requisitos técnicos, normativos e legais.",
    descricao: "Desenvolvimento de projetos personalizados com ART, assessoria completa para obtenção e renovação do AVCB e suporte durante todo o processo de aprovação junto aos órgãos competentes.",
    chips: ["ART", "AVCB", "Projetos legais e executivos"],
    icone: "drafting-compass", imagem: "servico-projetos",
  },
  {
    slug: "documentacao-e-regularizacao", numero: "03", nome: "Documentação e Regularização", nomeCurto: "AVCB",
    resumo: "Assessoria técnica para emissão de laudos, licenças e renovação de AVCB, com total alinhamento às exigências legais e operacionais de cada cliente.",
    descricao: null,
    chips: ["Laudos", "Licenças", "Renovação de AVCB"],
    icone: "clipboard-check", imagem: "servico-documentacao",
  },
  {
    slug: "inspecoes-e-manutencoes-preventivas", numero: "04", nome: "Inspeções e Manutenções Preventivas", nomeCurto: "Inspeções",
    resumo: "Serviços especializados e periódicos que garantem a eficiência, durabilidade e segurança dos sistemas, com controle informatizado e equipe técnica qualificada.",
    // "da NBRs" do site atual corrigido para "das NBRs" (§11)
    descricao: "Gerenciamento completo de equipamentos com inspeções periódicas, testes hidrostáticos, manutenção em campo, repintura, limpeza e adequação técnica conforme exigências das NBRs e legislação vigente.",
    chips: ["Inspeções periódicas", "Testes hidrostáticos", "Manutenção em campo", "Controle informatizado"],
    icone: "list-checks", imagem: "servico-inspecoes", imagem2: "servico-inspecoes-2", imagem2Credito: "ilustrativa",
  },
  {
    slug: "manutencao-de-equipamentos", numero: "05", nome: "Gestão e Manutenção de Equipamentos", nomeCurto: "Manutenção",
    resumo: "Gerenciamento e manutenção de sistemas de combate a incêndio com tecnologia própria, processos certificados e rastreamento individual dos itens.",
    descricao: "Linha completa de extintores, mangueiras, hidrantes, portas corta-fogo, sistemas de alarme e supressão. Equipamentos homologados e manutenção certificada pelo INMETRO, com rastreabilidade e garantia.",
    chips: ["Tecnologia própria", "INMETRO", "Rastreamento individual"],
    icone: "settings-2", imagem: "servico-gestao", imagem2: "institucional-extintor", imagem2Credito: "ilustrativa",
  },
  {
    slug: "gestao-de-riscos-e-consultoria", numero: "06", nome: "Gestão de Riscos e Consultoria", nomeCurto: "Riscos",
    resumo: "Suporte técnico e estratégico para ambientes críticos, com foco na prevenção, planejamento e redução de riscos operacionais.",
    descricao: "Elaboração de laudos e programas por engenheiros das áreas Civil, Elétrica, Mecânica e de Segurança com intuito de identificar e minimizar os riscos de incêndio em edificações e instalações.",
    chips: ["Engenharia Civil", "Elétrica", "Mecânica", "de Segurança"],
    icone: "shield-alert", imagem: "servico-riscos",
  },
  {
    slug: "venda-de-equipamentos", numero: "07", nome: "Venda de Equipamentos", nomeCurto: "Venda",
    resumo: "Comercialização de extintores, mangueiras, sinalizações, sistemas fixos de alta qualidade e demais equipamentos de combate a incêndio.",
    descricao: null,
    chips: ["Extintores", "Mangueiras", "Sinalizações", "Sistemas fixos"],
    icone: "fire-extinguisher", imagem: "servico-venda",
  },
  {
    slug: "sinalizacao-de-seguranca", numero: "08", nome: "Sinalização de Segurança", nomeCurto: "Sinalização",
    resumo: "Implementação de sinalizações fotoluminescentes, orientativas, de emergência e salvamento conforme normas.",
    descricao: "Integração com planos de gerenciamento de risco, auditorias e treinamentos personalizados.",
    chips: ["Fotoluminescentes", "Orientativas", "Emergência e salvamento", "Treinamentos"],
    icone: "signpost", imagem: "servico-sinalizacao", imagem2: "obra-parede-sistemas", imagem2Credito: "acervo", imagem2Posicao: "57% 40%",
  },
];

export function servicoPorSlug(slug: ServicoSlug): Servico {
  const s = SERVICOS.find((x) => x.slug === slug);
  if (!s) throw new Error(`serviço desconhecido: ${slug}`);
  return s;
}

// ---------------------------------------------------------------- H4 na prática (§9 H4)
export const NA_PRATICA = {
  label: "Na prática",
  h2: { texto: "Uma parede. Cinco frentes de serviço.", linhas: ["Uma parede.", "Cinco frentes de serviço."] } satisfies Titulo,
  legenda: "Foto do acervo Protecin. Extintor com etiqueta PROTECIN.",
  imagem: "obra-parede-sistemas" as ImagemId,
  pontos: [
    {
      id: 1, x: 56.8, y: 41.3, nome: "Placa SAÍDA", titulo: "Sinalização de Segurança",
      texto: "Implementação de sinalizações fotoluminescentes, orientativas, de emergência e salvamento conforme normas.",
      servico: "sinalizacao-de-seguranca",
    },
    {
      id: 2, x: 58.0, y: 59.3, nome: "Extintor etiquetado", titulo: "Inspeções e Manutenções Preventivas",
      texto: "Inspeções periódicas, testes hidrostáticos, manutenção em campo, repintura, limpeza e adequação técnica conforme exigências das NBRs e legislação vigente.",
      servico: "inspecoes-e-manutencoes-preventivas",
    },
    {
      id: 3, x: 30.3, y: 55.2, nome: "Painel de alarme", titulo: "Sistemas de alarme",
      texto: "Implantação de sistemas fixos e equipamentos contra incêndio com tecnologia atualizada, equipe especializada e componentes certificados.",
      servico: "instalacao-de-sistemas-e-equipamentos",
    },
    {
      id: 4, x: 75.9, y: 74.0, nome: "Abrigo de mangueira e hidrante", titulo: "Hidrantes e mangueiras",
      texto: "Equipamentos homologados e manutenção certificada pelo INMETRO, com rastreabilidade e garantia.",
      servico: "manutencao-de-equipamentos",
    },
    {
      id: 5, x: 50.0, y: 30.3, nome: "Tubulação vermelha", titulo: "Sistemas fixos",
      texto: "Soluções completas e personalizadas para implantação de sistemas fixos e equipamentos de combate a incêndio, com segurança e rastreabilidade.",
      servico: "instalacao-de-sistemas-e-equipamentos",
    },
  ] satisfies Hotspot[],
  cilindros: {
    imagem: "obra-cilindros-supressao" as ImagemId,
    numero: "250+",
    rotulo: "obras de médio e grande porte realizadas",
    legenda: "Bateria de cilindros de sistema fixo de supressão.",
    chamadas: [
      { x: 72.5, y: 80, rotulo: "Cilindros numerados" },
      { x: 51, y: 57, rotulo: "Válvulas com manômetro" },
      { x: 45, y: 29, rotulo: "Coletor e tubulação" },
      { x: 27, y: 42, rotulo: "Mangueiras de conexão" },
    ] satisfies Chamada[],
  },
} as const;

// ---------------------------------------------------------------- H5 plataforma e /nosso-app/ (§1.7; §2.1; §2.6)
export const PLATAFORMA = {
  label: "Plataforma",
  sobretitulo: "Tecnologia a favor da segurança e da gestão",
  h2: { texto: "Plataforma exclusiva Protecin", linhas: ["Plataforma", "exclusiva Protecin"] } satisfies Titulo,
  apoio: "Monitoramento inteligente e gestão eficiente onde você estiver.",
  software: "SOFTWARE PRÓPRIO DESDE 2021",
  pilares: [
    {
      numero: "01", titulo: "Aplicativo para Técnicos", icone: "smartphone",
      texto: "Inspeções ágeis online e offline, com cadastro de equipamentos, questionários personalizados e envio automático de ordens de serviço ao cliente.",
    },
    {
      numero: "02", titulo: "Painel Web para Gestores", icone: "layout-dashboard",
      texto: "Gestão centralizada e em tempo real: acompanhe inspeções, controle usuários e envie comandos diretamente ao app da equipe técnica.",
    },
    {
      numero: "03", titulo: "Recursos Inteligentes", icone: "wifi-off",
      texto: "Coleta automatizada de dados, análises estatísticas e geração de insights. Operação segura, com ou sem internet, e 100% conforme a NBR 12962 e NBR 12779.",
    },
    {
      numero: "04", titulo: "Benefícios para o Cliente", icone: "file-check",
      texto: "Redução de erros e retrabalho, relatórios rápidos, transparência total e rastreabilidade de ponta a ponta nas inspeções realizadas.",
    },
  ] satisfies Pilar[],
  /** Rótulos que existem nas telas reais (§1.7). Dados de cliente viram barras borradas. */
  telas: {
    rotulosOrdem: {
      numero: "Nº da Ordem",
      cliente: "Nome do Cliente",
      localizacao: "Localização",
      verMapa: "Ver no mapa",
      quantidades: "Quantidades de Equipamentos: Total 3 (1 extintor e 2 hidrantes)",
      andamento: "Andamento da vistoria",
    },
    andamento: ["1 de 3", "2 de 3", "3 de 3"],
    ordens: 3,
    offline: {
      titulo: "Sem internet",
      lista: "Aplicação de questionários técnicos",
      // itens reais do App de Coleta (§2.6)
      itens: ["Inspeções rápidas e padronizadas", "Cadastro de equipamentos", "Funciona offline", "Envio automático de relatórios por e-mail"],
      sincronizado: "Sincronizado",
    },
    relatorio: { titulo: "Relatório de inspeção", texto: "Envio automático de relatórios por e-mail" },
    banner: "Nova ordem de serviço",
    chipOrdem: "Ordem de serviço",
    processador: "Processador de Coleta Online",
  },
  modulos: [
    {
      id: "coleta", nome: "App de Coleta", uso: "Uso em campo", icone: "smartphone",
      itens: ["Inspeções rápidas e padronizadas", "Cadastro de equipamentos", "Aplicação de questionários técnicos", "Funciona offline", "Envio automático de relatórios por e-mail"],
    },
    { id: "processador", nome: "Processador de Coleta Online", uso: null, icone: "server", itens: ["Recepção automática dos dados de campo"] },
    {
      id: "webmaster", nome: "Web Master", uso: "Gestão centralizada", icone: "layout-dashboard",
      itens: ["Acesso por perfil de usuário", "Visualização em tempo real das inspeções", "Envio de ordens de serviço ao app", "Gestão completa do sistema"],
    },
  ] satisfies Modulo[],
  comoFunciona: {
    titulo: "Como funciona o Protecin App",
    frase: "Conheça as funcionalidades do nosso software e veja como ele pode tornar sua rotina mais eficiente, segura e integrada.",
    pacote: "COLETA",
  },
  recursos: {
    titulo: "Recursos que fazem a diferença",
    subtitulo: "Conformidade com a NBR 12962 e a NBR 12779, com ou sem internet.",
    itens: [
      { nome: "Gestão central via plataforma web", icone: "layout-dashboard" },
      { nome: "Aplicativo prático e intuitivo", icone: "smartphone" },
      { nome: "Suporte offline nas inspeções", icone: "wifi-off" },
      { nome: "Relatórios automáticos para o cliente", icone: "mail-check" },
      { nome: "Comunicação direta entre gestor e técnico", icone: "messages-square" },
      { nome: "Indicadores de desempenho em tempo real", icone: "activity" },
      { nome: "Conformidade com as NBRs e ABNT", icone: "badge-check" },
      { nome: "Redução de erros e aumento da eficiência", icone: "circle-check" },
    ] satisfies { nome: string; icone: IconeId }[],
  },
  telasReais: { titulo: "Telas reais do sistema", legenda: "Telas reais do sistema. Dados de clientes ocultos." },
  fecho: "Tecnologia acessível que entrega resultado, simplifica processos e fortalece sua gestão.",
  ctas: { conhecer: "Conhecer o Protecin App", ver: "Quero ver a plataforma", conhecerPlataforma: "Quero conhecer a plataforma" },
} as const;

// ---------------------------------------------------------------- H6 diferenciais (§2.1)
export const DIFERENCIAIS_HEADER = { label: "Por que a Protecin", h2: "Por que a Protecin" } as const;
export const DIFERENCIAIS: { numero: string; titulo: string; texto: string; icone: IconeId }[] = [
  {
    numero: "01", titulo: "Atendimento Personalizado", icone: "headset",
    texto: "Equipe técnica e comercial especializada, com soluções sob medida e foco consultivo para as reais necessidades da sua empresa.",
  },
  {
    numero: "02", titulo: "Tecnologia da Informação Aplicada", icone: "monitor-cog",
    texto: "Operação integrada com geração de dados rastreáveis, controle preciso e apoio à tomada de decisão em tempo real.",
  },
  {
    numero: "03", titulo: "Tradição e Credibilidade", icone: "shield-check",
    texto: "Desde 1976 no mercado, com autorizações oficiais (Kidde Brasil, Everlux, Notifier e Simplex) e histórico de confiança no segmento de segurança contra incêndios.",
  },
  {
    numero: "04", titulo: "Estrutura Completa e Qualificada", icone: "hard-hat",
    texto: "Profissionais treinados, equipamentos modernos, cobertura de seguros e setores integrados por sistemas atualizados.",
  },
];

// ---------------------------------------------------------------- H7 linha do tempo (§2.2)
export const TIMELINE = {
  label: "50 anos",
  sobretitulo: "Nossa História",
  h2: { texto: "Tradição e inovação que evoluem juntos", linhas: ["Tradição e inovação", "que evoluem juntos"] } satisfies Titulo,
  h2Completa: {
    texto: "Nossa História: tradição e inovação que evoluem juntos",
    linhas: ["Nossa História:", "tradição e inovação", "que evoluem juntos"],
  } satisfies Titulo,
  pular: "Pular a linha do tempo",
  trilho: "Linha do tempo de 1976 a 2026: deslize para o lado",
  anterior: "Marco anterior",
  proximo: "Próximo marco",
  marcos: [
    {
      ano: 1976, rotulo: "FUNDAÇÃO", simbolo: true,
      texto: "Fundação da Protecin pela Extimbrás, uma das pioneiras na fabricação de extintores no Brasil, com o objetivo de atender à crescente demanda por serviços de manutenção em equipamentos de combate a incêndio.",
    },
    {
      ano: 1986, rotulo: "NOVA FASE",
      texto: "Início de uma nova fase com a entrada dos atuais sócios e reposicionamento estratégico. A empresa passa a focar em grandes contratos, cria o conceito de preço único para inspeção e manutenção de extintores e oferece soluções personalizadas para gestão técnica de equipamentos.",
    },
    {
      ano: 2004, rotulo: "NOVA SEDE",
      texto: "Aquisição de nova sede, mais ampla e moderna, elevando a produtividade e o conforto para clientes e colaboradores. Marca também o início da Política de Preservação Ambiental da empresa.",
    },
    {
      ano: 2006, rotulo: "TALENTOS",
      texto: "Criação do Programa de Desenvolvimento de Talentos, incentivando o crescimento pessoal e profissional da equipe. Ampliação do portfólio com produtos e sistemas especiais de combate a incêndio.",
    },
    {
      ano: 2009, rotulo: "10 ESTADOS",
      texto: "Expansão da frota e presença consolidada em 10 estados brasileiros. Implantação do Programa Qualidade Total, voltado à excelência nos processos internos e no atendimento.",
    },
    {
      ano: 2012, rotulo: "CRESCIMENTO",
      texto: "Crescimento nacional com a ampliação das instalações físicas, renovação de maquinários e veículos, e fortalecimento da estrutura operacional.",
    },
    {
      ano: 2015, rotulo: "PROTECIN ENGENHARIA",
      texto: "Lançamento da Protecin Engenharia, ampliando os serviços com foco em engenharia de combate a incêndio e soluções técnicas completas.",
    },
    {
      ano: 2021, rotulo: "SOFTWARE PRÓPRIO", imagem: "app-login-celular",
      texto: "Inovação na gestão com o desenvolvimento e implantação de software próprio para combate e rastreabilidade dos equipamentos de combate a incêndio.",
    },
    {
      ano: 2024, rotulo: "TECNOLOGIA",
      texto: "Novos investimentos em tecnologia, modernização dos métodos produtivos e aprimoramento do atendimento a clientes estratégicos, reafirmando o compromisso com a excelência, a inovação e a segurança.",
    },
    { ano: 2026, rotulo: "50 ANOS", final: true, texto: "50 anos protegendo vidas e patrimônios." },
  ] satisfies Marco[],
} as const;

// ---------------------------------------------------------------- H8 setores (§2.4)
export const SETORES = {
  label: "Setores",
  sobretitulo: "Presença sólida e confiável em empresas de alto padrão",
  h2: {
    texto: "Atendemos líderes de mercado em diferentes setores",
    linhas: ["Atendemos líderes de mercado", "em diferentes setores"],
  } satisfies Titulo,
  texto:
    "Com atuação nacional e décadas de experiência, a Protecin atende clientes que são referência em seus segmentos. A confiança dos nossos parceiros é reflexo do nosso compromisso com a excelência.",
  itens: [
    {
      id: "financeiro", nome: "Financeiro, Tecnologia e Saúde", imagem: "setor-financeiro-tecnologia-saude", icones: ["landmark", "cpu", "heart-pulse"],
      texto: "Atendemos as principais empresas desses setores, que demandam atendimento personalizado, proteção contra incêndio atualizada e inovações constantes.",
    },
    {
      id: "industrial", nome: "Industrial e Agronegócio", imagem: "setor-industrial-agronegocio", icones: ["factory", "wheat"],
      texto: "Nossos clientes nestes setores são os principais players de mercado e demandam serviços diferenciados de acordo com suas peculiaridades.",
    },
    {
      id: "energia", nome: "Energia e Transporte", imagem: "setor-energia-transporte", icones: ["zap", "truck"],
      texto: "Os clientes que atendemos desses setores são os mais importantes de suas respectivas categorias, sendo assim, precisam de serviços de combate a incêndio que proporcionem confiabilidade e segurança de alta performance para que as suas operações ocorram dentro da mais alta tranquilidade.",
    },
  ] satisfies Setor[],
  link: { label: "Ver clientes e parcerias", to: "/nossos-clientes/" } satisfies LinkInterno,
} as const;

export const SETORES_FORM = ["Financeiro", "Tecnologia", "Saúde", "Industrial", "Agronegócio", "Energia", "Transporte", "Outro"] as const;

// ---------------------------------------------------------------- /nossos-clientes/ (§2.4)
export const CLIENTES = {
  escala: { numero: "20.000+", rotulo: "clientes atendidos", ariaLabel: "Mais de 20.000 clientes atendidos" },
  parceiros: {
    titulo: "Parcerias estratégicas e filiações técnicas",
    texto:
      "A Protecin atua lado a lado com marcas reconhecidas globalmente, garantindo inovação, desempenho e qualidade em cada solução entregue. Além disso, somos filiados a instituições técnicas respeitadas, reforçando nosso compromisso com as melhores práticas do setor de segurança contra incêndio.",
  },
} as const;

// ---------------------------------------------------------------- H9 compromisso social (§2.2)
export const SOCIAL = {
  label: "Compromisso",
  sobretitulo: "Nosso compromisso vai além da segurança técnica",
  letreiro: {
    desktop: ["Cuidar de *vidas*", "também é", "transformar", "*futuros*"],
    celular: ["Cuidar de", "*vidas* também é", "transformar", "*futuros*"],
  },
  letreiroTexto: "Cuidar de vidas também é transformar futuros",
  kids: {
    titulo: "Cuidar de vidas também é transformar futuros",
    texto:
      "A Protecin financia o Kids ONG, projeto social com sete anos de atuação em Santo André – SP. Criado pelo fundador da Protecin, Cláudio Szulcsewski, e atualmente conduzido por Juliana Szulcsewski Ardengue, a iniciativa acolhe crianças em situação de vulnerabilidade por meio de ações de educação e desenvolvimento humano.",
    fecho: "Protegemos seu maior patrimônio: A vida.",
    legendaColagem: "Ações do Kids ONG. Rostos borrados para preservar as crianças.",
    logo: "kids-ong-logo" as ImagemId,
    colagem: "kids-ong-colagem" as ImagemId,
  },
  sustentabilidade: {
    titulo: "Cuidar também é prevenir.",
    texto:
      "A Protecin valoriza cada etapa do seu trabalho, inclusive os cuidados que muitas vezes passam despercebidos no manuseio de equipamentos e no descarte de resíduos. Adotamos procedimentos rigorosos para garantir um ambiente mais consciente, seguro e saudável, tanto para nossa equipe quanto para nossos clientes. Também contamos com um programa específico para armazenamento e descarte responsável dos resíduos gerados, seguindo todas as exigências estabelecidas pela legislação ambiental.",
    imagem: "institucional-maos" as ImagemId,
  },
  link: { label: "Conheça nossa história", to: "/institucional/" } satisfies LinkInterno,
} as const;

// ---------------------------------------------------------------- /institucional/ (§2.2)
export const INSTITUCIONAL = {
  quemSomos: {
    texto:
      "Desde 1976, a Protecin atua com soluções completas em prevenção e engenharia de combate a incêndios. Com sede em Santo André (SP), oferecemos projetos, instalação de sistemas, manutenção e uma plataforma digital exclusiva para gestão técnica de extintores e hidrantes.",
    objetivo: "Compromisso com Segurança, Excelência e Confiança é o nosso objetivo.",
  },
  mvv: {
    titulo: "O que nos move, inspira e sustenta nosso compromisso com a segurança",
    intro:
      "Na Protecin, cada decisão, processo e relacionamento é guiado por uma cultura sólida de excelência, ética e inovação. Nossa missão é mais do que um propósito, é um compromisso diário com a qualidade, a segurança e a confiança de quem nos escolhe. A visão projeta nosso futuro, enquanto os valores moldam o presente e direcionam nossas ações com responsabilidade e integridade.",
    missao:
      "Proporcionar aos clientes o gerenciamento completo de equipamentos de combate a incêndio, por meio de soluções personalizadas, tecnologia de ponta e serviços adequados às suas necessidades.",
    visao:
      "Ser reconhecida nacionalmente como referência em tecnologia, qualidade e responsabilidade no setor de engenharia e proteção contra incêndios.",
    valores: [
      "Ética e integridade em todas as relações",
      "Iniciativa e foco na excelência",
      "Entusiasmo por inovação e melhoria contínua",
      "Determinação para alcançar resultados com responsabilidade",
      "Espírito de equipe e valorização das pessoas",
      "Transparência em processos, decisões e atendimentos",
    ],
    rotulos: { missao: "NOSSA MISSÃO", visao: "NOSSA VISÃO", valores: "NOSSOS VALORES" },
    imagem: "institucional-compromisso" as ImagemId,
  },
  sustentabilidade: {
    titulo: "Cuidar também é prevenir.",
    texto: SOCIAL.sustentabilidade.texto,
    linha2004: "Política de Preservação Ambiental desde 2004",
    fundo: "institucional-paisagem" as ImagemId,
    imagem: "institucional-maos" as ImagemId,
  },
} as const;

// ---------------------------------------------------------------- PageHero das páginas internas (§10)
export const PAGE_HEROES: Record<
  "institucional" | "servicos" | "clientes",
  { trilha: string; h1: Linhas; subtitulo: string; imagem: ImagemId; extra?: ImagemId; waLocation: LeadLocation }
> = {
  institucional: {
    trilha: "INSTITUCIONAL",
    h1: ["Desde 1976,", "prevenção e engenharia", "de combate a incêndios"],
    subtitulo:
      "Com sede em Santo André (SP), oferecemos projetos, instalação de sistemas, manutenção e uma plataforma digital exclusiva para gestão técnica de extintores e hidrantes.",
    imagem: "institucional-pilar",
    waLocation: "pagina_institucional",
  },
  servicos: {
    trilha: "SERVIÇOS",
    h1: ["Soluções completas", "em combate e prevenção", "a incêndios"],
    subtitulo: "Conheça os serviços técnicos, operacionais e de suporte técnico e estratégico oferecidos pela Protecin.",
    imagem: "co2-cilindros",
    extra: "valvulas-sprinkler",
    waLocation: "pagina_servicos",
  },
  clientes: {
    trilha: "NOSSOS CLIENTES",
    h1: ["Nossos", "Clientes"],
    subtitulo:
      "Parcerias de confiança que impulsionam nosso compromisso com a segurança, a prevenção e a continuidade das operações dos nossos clientes.",
    imagem: "clientes-aperto",
    waLocation: "pagina_clientes",
  },
};

// ---------------------------------------------------------------- /servicos/: diagrama, fitas e AVCB (§10.2)
export const DIAGRAMA = {
  label: "Sistema",
  h2: {
    texto: "Da elaboração de projetos à gestão contínua dos equipamentos.",
    linhas: ["Da elaboração de projetos", "à gestão contínua", "dos equipamentos."],
  } satisfies Titulo,
  corpo:
    "Da elaboração de projetos à gestão contínua dos equipamentos, oferecemos soluções completas para proteger pessoas, patrimônios e garantir a conformidade com normas técnicas e legais.",
  svgTitulo: "Diagrama em corte de uma edificação com os sistemas de proteção contra incêndio",
  camadas: [
    {
      id: "c01", codigo: "C-01", nome: "Extintores", cor: "brasa", itens: ["Extintor"],
      textos: [
        "Inspeções periódicas, testes hidrostáticos, manutenção em campo, repintura, limpeza e adequação técnica conforme exigências das NBRs e legislação vigente.",
        "Equipamentos homologados e manutenção certificada pelo INMETRO, com rastreabilidade e garantia.",
      ],
      servicos: ["inspecoes-e-manutencoes-preventivas", "manutencao-de-equipamentos", "venda-de-equipamentos"],
    },
    {
      id: "c02", codigo: "C-02", nome: "Hidrantes e mangueiras", cor: "brasa", itens: ["Abrigo de mangueira"],
      textos: ["Linha completa de extintores, mangueiras, hidrantes, portas corta-fogo, sistemas de alarme e supressão."],
      servicos: ["instalacao-de-sistemas-e-equipamentos", "inspecoes-e-manutencoes-preventivas"],
    },
    {
      id: "c03", codigo: "C-03", nome: "Sistemas de alarme", cor: "alarme", itens: ["Detector", "Acionador manual", "Painel de alarme"],
      textos: [
        "Implantação de sistemas fixos e equipamentos contra incêndio com tecnologia atualizada, equipe especializada e componentes certificados para diferentes tipos de edificações e necessidades operacionais.",
      ],
      servicos: ["instalacao-de-sistemas-e-equipamentos"],
    },
    {
      id: "c04", codigo: "C-04", nome: "Sistemas fixos e de supressão", cor: "brasa", itens: ["Cilindro"],
      textos: [
        "Soluções completas e personalizadas para implantação de sistemas fixos e equipamentos de combate a incêndio, com segurança, rastreabilidade e foco em alta performance.",
      ],
      servicos: ["instalacao-de-sistemas-e-equipamentos", "manutencao-de-equipamentos"],
    },
    {
      id: "c05", codigo: "C-05", nome: "Portas corta-fogo", cor: "papel", itens: ["Porta corta-fogo"],
      textos: ["Linha completa de extintores, mangueiras, hidrantes, portas corta-fogo, sistemas de alarme e supressão."],
      servicos: ["venda-de-equipamentos"],
    },
    {
      id: "c06", codigo: "C-06", nome: "Sinalização", cor: "fotolum", itens: ["Placa de saída"],
      textos: ["Implementação de sinalizações fotoluminescentes, orientativas, de emergência e salvamento conforme normas."],
      servicos: ["sinalizacao-de-seguranca"],
    },
    {
      id: "engenharia", codigo: "Final", nome: "Engenharia", cor: "todas", itens: [],
      textos: [
        "Elaboração de projetos legais e executivos com emissão de ART, seguindo rigorosamente os requisitos técnicos, normativos e legais.",
        "Elaboração de laudos e programas por engenheiros das áreas Civil, Elétrica, Mecânica e de Segurança.",
      ],
      servicos: ["projetos-tecnicos", "documentacao-e-regularizacao", "gestao-de-riscos-e-consultoria"],
    },
  ] satisfies Camada[],
} as const;

export const FITAS = {
  equipamentos: ["Extintores", "Mangueiras", "Hidrantes", "Portas corta-fogo", "Sistemas de alarme", "Sistemas de supressão", "Sistemas fixos", "Sinalizações"],
  servicosCampo: ["Inspeções periódicas", "Testes hidrostáticos", "Manutenção em campo", "Repintura", "Limpeza", "Adequação técnica", "Auditorias", "Treinamentos"],
} as const;

export const FAIXA_AVCB = {
  titulo: "Documentação e regularização: obtenção e renovação do AVCB",
  texto: "Assessoria técnica para emissão de laudos, licenças e renovação de AVCB, com total alinhamento às exigências legais e operacionais de cada cliente.",
  cta: "Falar sobre AVCB",
} as const;

// ---------------------------------------------------------------- /catalogo-digital/ (§2.5)
export const CATALOGO = {
  trilha: "CATÁLOGO DIGITAL",
  titulo: "Catálogo Digital Protecin",
  subtitulo: "Material completo e sempre atualizado",
  texto:
    "Conheça em detalhes nossos serviços, produtos, tecnologias e diferenciais. Tudo reunido em um catálogo pensado para facilitar sua consulta e apoiar suas decisões com segurança e confiança.",
  cta: "Baixar catálogo (PDF)",
  ctaComercial: "Falar com o comercial",
  capa: "catalogo-capa" as ImagemId,
  linha: {
    titulo: "Equipamentos que comercializamos",
    texto:
      "Linha completa de extintores, mangueiras, hidrantes, portas corta-fogo, sistemas de alarme e supressão. Equipamentos homologados e manutenção certificada pelo INMETRO, com rastreabilidade e garantia.",
    chips: ["Extintores", "Mangueiras", "Hidrantes", "Portas corta-fogo", "Sistemas de alarme", "Sistemas de supressão"],
    imagem: "institucional-extintor" as ImagemId,
  },
} as const;

// ---------------------------------------------------------------- /nosso-app/ (§2.6)
export const APP_HERO = {
  trilha: "NOSSO APP",
  h1: ["Protecin App:", "gestão inteligente", "de inspeções"] as Linhas,
  texto:
    "Uma plataforma completa, com versão web e aplicativo próprio, que otimiza o controle de extintores e hidrantes com agilidade, segurança e conformidade técnica.",
} as const;

// ---------------------------------------------------------------- H10 orçamento e /contato/ (§2.7)
export const CONTATO = {
  label: "Orçamento",
  letreiro: "SOLICITAR ORÇAMENTO",
  h2: "Precisa de uma proposta, agendar uma visita ou tirar dúvidas?",
  texto:
    "Nossa equipe está pronta para atender com agilidade e atenção técnica. Preencha o formulário ou utilize os canais abaixo para falar com a gente.",
  pagina: {
    trilha: "CONTATO",
    sobretitulo: "Entre em contato",
    h1: "Contate a Protecin",
    texto:
      "Precisa de uma proposta, agendar uma visita ou tirar dúvidas? Nossa equipe está pronta para atender com agilidade e atenção técnica. Preencha o formulário ou utilize os canais abaixo para falar com a gente.",
  },
  canais: { whatsapp: "WHATSAPP", telefone: "TELEFONE", email: "E-MAIL", endereco: "ENDEREÇO", horario: "HORÁRIO" },
  comoChegar: "Como chegar",
  mapa: { carregar: "Carregar mapa", titulo: "Mapa da sede da Protecin na Rua Lacônia, 600, Santo André - SP" },
} as const;

export interface DadosFormulario { servicos: string[]; setor?: string; cidade?: string; nome?: string; empresa?: string }

export const FORM = {
  titulo: "Monte sua solicitação",
  etapa: (n: number) => `ETAPA ${n} DE 3`,
  etapas: [{ titulo: "O que você precisa?" }, { titulo: "Sobre o local" }, { titulo: "Seus dados" }],
  naoSei: "Ainda não sei",
  botoes: {
    continuar: "Continuar",
    voltar: "Voltar",
    enviar: "Enviar solicitação",
    enviando: "Enviando…",
    whatsapp: "Enviar pelo WhatsApp",
  },
  campos: {
    cidade: { label: "Cidade / UF", placeholder: "Cidade / UF" },
    nome: { label: "Nome", placeholder: "Seu nome" },
    empresa: { label: "Empresa (opcional)", placeholder: "Nome da empresa" },
    email: { label: "E-mail", placeholder: "Seu e-mail" },
    telefone: { label: "Telefone", placeholder: "(DDD) número" },
    mensagem: { label: "Mensagem (opcional)", placeholder: "Conte o que precisa" },
  },
  erros: {
    nome: "Informe seu nome.",
    email: "Informe um e-mail válido.",
    telefone: "Informe um telefone com DDD.",
  },
  sucesso: "Recebemos sua solicitação. Nossa equipe comercial retorna em horário de atendimento (segunda a sexta, 8h às 17h30).",
  sucessoDemo: "Demonstração: na versão publicada, este envio chega a comercial@protecin.com.br.",
  erro: "Não conseguimos enviar agora.",
  erroAlternativas: "Envie por e-mail ou pelo WhatsApp:",
  assunto: "Solicitação de orçamento pelo site",
  endpoint: "https://formsubmit.co/ajax/comercial@protecin.com.br",
  /** "Olá! Vim pelo site da Protecin. Serviços: … Setor: … Cidade: … Nome: … Empresa: …" (campos vazios saem). */
  waResumo(d: DadosFormulario): string {
    const partes = ["Olá! Vim pelo site da Protecin."];
    if (d.servicos.length) partes.push(`Serviços: ${d.servicos.join(", ")}.`);
    if (d.setor) partes.push(`Setor: ${d.setor}.`);
    if (d.cidade?.trim()) partes.push(`Cidade: ${d.cidade.trim()}.`);
    if (d.nome?.trim()) partes.push(`Nome: ${d.nome.trim()}.`);
    if (d.empresa?.trim()) partes.push(`Empresa: ${d.empresa.trim()}.`);
    return partes.join(" ");
  },
} as const;

// ---------------------------------------------------------------- faixa de CTA e rodapé (§7.8, §7.10; §2.1 Rodapé)
export const FAIXA_CTA = {
  titulo: "Precisa de uma proposta, agendar uma visita ou tirar dúvidas?",
  frase: "Fale com a Protecin: segunda a sexta, 8h às 17h30.",
} as const;

export const FOOTER = {
  // caixa normal, como o manifesto do hero (rodada de sobriedade)
  slogan: ["Protegemos seu maior", "patrimônio: a vida."],
  sloganDestaque: ["a", "vida."],
  secoes: [
    { label: "Início", to: "/" },
    { label: "Institucional", to: "/institucional/" },
    { label: "Catálogo Digital", to: "/catalogo-digital/" },
    { label: "Serviços", to: "/servicos/" },
    { label: "Nossos Clientes", to: "/nossos-clientes/" },
    { label: "Nosso App", to: "/nosso-app/" },
    { label: "Contato", to: "/contato/" },
  ] satisfies LinkInterno[],
  colunas: { secoes: "SEÇÕES", contato: "CONTATO", endereco: "ENDEREÇO", horario: "HORÁRIO", redes: "REDES" },
  whatsappRotulo: "WhatsApp +55 11 94565-1751",
  linkedinRotulo: "LinkedIn",
  direitos: (ano: number) => `© ${ano} Protecin. Todos os direitos reservados.`,
  creditos: "Vídeos e fotos ilustrativos: créditos",
} as const;

// ---------------------------------------------------------------- modo proposta (§7.10)
export const RESERVADOS: Record<ReservadoId, { titulo: string; texto: string }> = {
  clientes: { titulo: "Logos de clientes", texto: "Espaço reservado: logos de clientes a enviar com autorização da Protecin." },
  obras: { titulo: "Portfólio de obras", texto: "Espaço reservado: fotos de obras a enviar pela Protecin." },
  depoimentos: {
    titulo: "Depoimentos da equipe",
    texto: "Espaço reservado: depoimentos em vídeo gravados na sede da Rua Lacônia (a produzir).",
  },
  "preco-unico": {
    titulo: "Preço único",
    texto: "Espaço reservado: preço único para inspeção e manutenção de extintores (conceito de 1986). Confirmar se a condição continua valendo.",
  },
};

// ---------------------------------------------------------------- créditos (§10.7, §12.2)
const TITULO_VIDEO: Record<VideoId, string> = {
  hero: "Módulos de sistema fixo de supressão (abertura da página inicial)",
};

const NOTA_FOTOS = "Banco de imagens usado no site atual; licença a confirmar com a Protecin.";

export const CREDITOS_PAGINA = {
  h1: "Créditos de imagens e vídeos",
  intro: "Fontes e autores das fotos e vídeos ilustrativos usados no site.",
  videos: "Vídeos ilustrativos",
  fotos: "Fotos ilustrativas",
  notaFotos: NOTA_FOTOS,
} as const;

export const CREDITOS: Credito[] = [
  ...(Object.keys(VIDEOS) as VideoId[]).map((id) => ({
    tipo: "video" as const,
    titulo: TITULO_VIDEO[id],
    fonte: VIDEOS[id].fonte,
    autor: VIDEOS[id].autor,
    url: VIDEOS[id].url,
    licenca: VIDEOS[id].licenca,
  })),
  ...(Object.keys(IMAGENS) as ImagemId[])
    .filter((id) => IMAGENS[id].credito === "ilustrativa" && !id.startsWith("hero-poster") && !id.startsWith("poster-"))
    .map((id) => ({ tipo: "foto" as const, titulo: IMAGENS[id].alt, fonte: "Banco de imagens", licenca: NOTA_FOTOS })),
];

// ---------------------------------------------------------------- modo proposta e 404 (§7.7, §10.7)
// (sem aviso nem botão de movimento: o site anima sempre, AJUSTES-SOBRIEDADE §1)
export const PROPOSTA = { badge: "Modo proposta · sair" } as const;

export const NOTFOUND = {
  numero: "404",
  h1: "Página não encontrada",
  texto: "Esta página não existe ou mudou de endereço.",
  links: [
    { label: "Início", to: "/" },
    { label: "Serviços", to: "/servicos/" },
    { label: "Contato", to: "/contato/" },
  ] satisfies LinkInterno[],
} as const;
