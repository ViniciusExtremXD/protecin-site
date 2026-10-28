// Gerado por scripts/imagens.mjs. Não editar à mão.
export type CreditoImagem = "acervo" | "ilustrativa" | "marca";

export interface ImagemInfo {
  /** largura e altura da imagem-mestre (proporção usada em width/height) */
  w: number;
  h: number;
  /** larguras geradas em public/img/<id>-<largura>.<ext> */
  larguras: readonly number[];
  alpha: boolean;
  /** false = só WebP (logos) */
  avif: boolean;
  credito: CreditoImagem;
  alt: string;
}

export const IMAGENS = {
  "hero-poster": {"w":1280,"h":720,"larguras":[828,1280],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Módulos vermelhos de sistema fixo de supressão de incêndio, com válvulas e tubulação"},
  "hero-poster-v": {"w":540,"h":960,"larguras":[540],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Módulos vermelhos de sistema fixo de supressão de incêndio, com válvulas e tubulação"},
  "poster-tablet": {"w":1280,"h":720,"larguras":[640,1280],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Profissional consultando um tablet em campo"},
  "poster-extintor": {"w":1280,"h":720,"larguras":[640,1280],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Pessoa entrando com um extintor em uma sala tomada por fumaça"},
  "poster-fogo": {"w":1280,"h":720,"larguras":[640,1280],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Chamas em close sobre fundo preto"},
  "obra-parede-sistemas": {"w":2592,"h":1944,"larguras":[828,1440,2200],"alpha":false,"avif":true,"credito":"acervo","alt":"Parede com tubulação vermelha, painel de alarme, extintor com etiqueta PROTECIN, abrigo de mangueira e placa de saída"},
  "obra-cilindros-supressao": {"w":3264,"h":1836,"larguras":[828,1440,2200],"alpha":false,"avif":true,"credito":"acervo","alt":"Bateria de cilindros vermelhos numerados de sistema fixo de supressão, com coletor, válvulas e mangueiras"},
  "app-splash": {"w":1080,"h":1920,"larguras":[360,720],"alpha":true,"avif":true,"credito":"acervo","alt":"Tela de abertura do aplicativo Protecin, com o logo branco sobre azul-marinho"},
  "app-webmaster-notebook": {"w":2048,"h":1578,"larguras":[760,1520],"alpha":true,"avif":true,"credito":"acervo","alt":"Notebook com a tela de login do Web Master da Protecin"},
  "app-login-celular": {"w":1080,"h":1920,"larguras":[360,720],"alpha":true,"avif":true,"credito":"acervo","alt":"Celular com a tela de login do aplicativo Protecin"},
  "kids-ong-colagem": {"w":1080,"h":845,"larguras":[640,1080],"alpha":true,"avif":true,"credito":"acervo","alt":"Colagem de fotos de ações do Kids ONG, com os rostos das crianças borrados"},
  "kids-ong-logo": {"w":479,"h":636,"larguras":[240,479],"alpha":true,"avif":true,"credito":"marca","alt":"Kids ONG, Trabalho Voluntário"},
  "catalogo-capa": {"w":554,"h":787,"larguras":[360,554],"alpha":false,"avif":true,"credito":"marca","alt":"Capa do Catálogo Digital Protecin"},
  "co2-cilindros": {"w":5760,"h":3840,"larguras":[828,1440,2200],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Bateria de cilindros vermelhos de CO2 com mangueiras e válvulas"},
  "valvulas-sprinkler": {"w":2048,"h":1578,"larguras":[640,1200],"alpha":true,"avif":true,"credito":"ilustrativa","alt":"Estação de válvulas vermelhas de sprinkler com manômetros e volantes"},
  "servico-instalacao": {"w":4000,"h":2200,"larguras":[640,1000,1600],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Linha de válvulas de sprinkler vermelhas e amarelas"},
  "servico-instalacao-2": {"w":4183,"h":2789,"larguras":[640,1000],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Painel de alarme de incêndio aberto, com a placa eletrônica, detectores e acionadores manuais"},
  "servico-projetos": {"w":3500,"h":2334,"larguras":[640,1000,1600],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Planta técnica sobre a mesa, com óculos, capacete e trena"},
  "servico-documentacao": {"w":7711,"h":4337,"larguras":[640,1000,1600],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Profissional preenchendo um checklist em prancheta"},
  "servico-inspecoes": {"w":5760,"h":3840,"larguras":[640,1000,1600],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Mão com caneta conferindo o manômetro de um extintor, ao lado de um tablet"},
  "servico-inspecoes-2": {"w":5760,"h":3840,"larguras":[640,1000],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Técnico de capacete e colete anotando ao lado de um abrigo de hidrante"},
  "servico-gestao": {"w":5963,"h":3975,"larguras":[640,1000,1600],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Dois técnicos de capacete conferindo extintores com um tablet"},
  "servico-riscos": {"w":4344,"h":2896,"larguras":[640,1000,1600],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Equipe de capacete reunida diante de um quadro, em orientação de segurança"},
  "servico-venda": {"w":2296,"h":1528,"larguras":[640,1000,1600],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Mangueiras de incêndio vermelhas enroladas, com conexões"},
  "servico-sinalizacao": {"w":5695,"h":3802,"larguras":[640,1000,1600],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Placa verde de saída de emergência no teto"},
  "setor-financeiro-tecnologia-saude": {"w":4183,"h":2353,"larguras":[640,1280,1920],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Painel de alarme de incêndio aberto, com a placa eletrônica e acionadores manuais"},
  "setor-industrial-agronegocio": {"w":5616,"h":3744,"larguras":[640,1280,1920],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Dois engenheiros de capacete com um tablet em uma planta industrial"},
  "setor-energia-transporte": {"w":1635,"h":1450,"larguras":[640,1280],"alpha":true,"avif":true,"credito":"ilustrativa","alt":"Esfera de armazenamento de gás em uma planta industrial"},
  "institucional-pilar": {"w":2048,"h":1578,"larguras":[828,1440],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Pilar de concreto com tubulação vermelha, abrigo de hidrante, extintor, acionador manual e sirene"},
  "institucional-maos": {"w":1200,"h":1200,"larguras":[480,960],"alpha":true,"avif":true,"credito":"ilustrativa","alt":"Mãos segurando uma muda de planta"},
  "institucional-paisagem": {"w":3680,"h":2456,"larguras":[828,1440,2200],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Paisagem verde com uma árvore ao nascer do sol"},
  "institucional-extintor": {"w":2048,"h":1578,"larguras":[640,1200],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Mão com luva segurando um extintor vermelho"},
  "institucional-compromisso": {"w":2048,"h":1578,"larguras":[640,1200],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Mãos empilhadas de uma equipe"},
  "clientes-aperto": {"w":1784,"h":1190,"larguras":[828,1440],"alpha":false,"avif":true,"credito":"ilustrativa","alt":"Aperto de mão entre dois executivos"},
  "logo-kidde": {"w":1080,"h":406,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"Kidde"},
  "logo-everlux": {"w":1006,"h":179,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"Everlux"},
  "logo-everlux-branco": {"w":810,"h":152,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"Everlux"},
  "logo-notifier": {"w":1080,"h":294,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"Notifier by Honeywell"},
  "logo-vesda": {"w":818,"h":272,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"VESDA by Xtralis"},
  "logo-simplex": {"w":979,"h":211,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"Simplex"},
  "logo-bosch": {"w":1062,"h":236,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"Bosch"},
  "logo-firebee": {"w":926,"h":233,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"Firebee"},
  "logo-germek": {"w":1080,"h":246,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"Germek Equipamentos"},
  "entidade-abspk": {"w":834,"h":287,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"ABSpk, Associação Brasileira de Sprinklers"},
  "entidade-nfpa": {"w":943,"h":1072,"larguras":[240,480],"alpha":true,"avif":false,"credito":"marca","alt":"NFPA"},
  "protecin-wordmark": {"w":1723,"h":285,"larguras":[400,800],"alpha":true,"avif":true,"credito":"marca","alt":"Protecin"},
  "protecin-wordmark-negativo": {"w":1723,"h":285,"larguras":[400,800],"alpha":true,"avif":true,"credito":"marca","alt":"Protecin"},
} as const satisfies Record<string, ImagemInfo>;

export type ImagemId = keyof typeof IMAGENS;
