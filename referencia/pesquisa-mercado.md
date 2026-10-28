# Pesquisa de mercado e referências de motion: Protecin

Data da pesquisa: 28/10/2026. Base factual da Protecin: `referencia/conteudo-site-atual.md` (extraído de protecin.com.br).
Regra seguida aqui: nada sobre a Protecin foi inventado. Onde falta dado, está marcado como **[confirmar com a Protecin]**.

Método:
- Sites de concorrentes lidos página a página (texto, CTAs, provas).
- Sites de referência de motion inspecionados ao vivo no navegador (1280x800, home), com script que conta elementos sticky (pin), máscaras `clip-path`, spans de texto quebrado (split text), vídeos, canvas/WebGL, SVG com `stroke-dasharray`, animações CSS e bibliotecas expostas (Lenis, Three.js, GSAP etc.).
- Limitação: bibliotecas empacotadas no bundle nem sempre aparecem no `window` (ex.: GSAP). Por isso a ausência de uma lib na tabela não prova que ela não é usada. Os prêmios e os créditos vêm das páginas do Awwwards.

---

## 0. Resumo executivo

1. O mercado brasileiro de proteção contra incêndio é pulverizado. No ABC há muitas empresas pequenas (Santo André, São Bernardo, Mauá, Diadema) com sites simples ou páginas de SEO. Mesmo os melhores sites do setor (Smart Fire, SWB) têm pouco motion: no máximo um marquee de logos em CSS e um vídeo.
2. As provas que o setor usa são sempre as mesmas: anos de mercado, número de projetos ou clientes, parede de logos de clientes, fabricantes homologados, normas (ABNT/NBR, NFPA, IT do Corpo de Bombeiros) e certificações (Inmetro, ISO 9001).
3. Os CTAs dominantes são "Solicitar orçamento" (repetido no topo, em cada serviço e no rodapé), WhatsApp com mensagem pré-preenchida, "Fale com um especialista" e conteúdo de AVCB (FAQ de prazo e custo, alerta de multa).
4. A Protecin tem números uma ordem de grandeza acima dos concorrentes analisados: 20.000+ clientes contra 500+ (Zoli Fire) e 1.000+ projetos (Smart Fire). Tem também a única plataforma própria (app + painel) entre os sites vistos, e completa **50 anos em 2026** (1976 + 50). O redesign pode ser vendido como "o site dos 50 anos".
5. O site atual (Elementor) tem 35 animações de entrada padrão e 5 contadores, mas nenhum vídeo. A home não tem nenhum botão de orçamento, só "Saiba Mais" e o WhatsApp flutuante. As fotos são de banco de imagens.
6. Nas 10 referências mundiais, o padrão comum é scroll suave (Lenis em 7 das 10), seções fixadas com scroll longo (sticky de 3 a 27 alturas de tela), texto revelado por linha ou palavra, máscaras `clip-path` e vídeo curto em loop que toca ao entrar na tela. Cursor customizado não apareceu em nenhuma delas: no B2B ele é opcional.

---

## 1. Mercado brasileiro

### 1.1 Empresas analisadas

| Empresa | Onde | Posicionamento (headline) | Provas de credibilidade | CTAs | Motion / vídeo |
|---|---|---|---|---|---|
| **Smart Fire** (smartfire.com.br) | São Paulo, atuação nacional | "Engenharia Avançada em Proteção Contra Incêndios" | Desde 2009, +15 anos, +1.000 projetos, 27 estados, 20 setores; normas ABNT, NFPA, FM Global, EN54, NBR, INMETRO; fabricantes homologados (Notifier, Simplex, Kidde, Firebee, Honeywell, VESDA etc.); logos de clientes (CSN, Petrobras, Vale, Amazon, Heineken) | "Solicitar Orçamento" (topo, meio, rodapé); "Solicitar projeto" em cada um dos 4 serviços; "Falar via WhatsApp"; seção "Como Trabalhamos" em 4 etapas; fechamento "Sua operação não pode parar por riscos imprevistos." | Só marquee de logos em CSS (`scroll-logos`) e 1 vídeo |
| **SWB Engenharia** (swbeng.com.br) | Atuação nacional (WhatsApp com DDD 41) | "Líderes de mercado escolhem líderes em segurança" | +15 anos; NRs, ABNT, NFPA; equipes próprias; logos Volvo, Heineken, Renault, Madero, portos de Paranaguá e Antonina | "Fale com um especialista"; "Solicitar Atendimento" por serviço; orçamento "rápido e gratuito"; diagnóstico gratuito; FAQ sobre prazo do AVCB e custo; alerta de multa sem AVCB | Nenhum vídeo. Restos de template em inglês ("Send Message", placeholders), que tiram credibilidade |
| **Global Incêndio** (globalincendio.com.br) | Salto/SP, atuação nacional | "Somos líderes em soluções de Sistemas de Supressão por Gases" | Faixa de 12 logos de clientes; menções a normas sem número | "Chamar no WhatsApp" (mensagem pronta); sem formulário nem botão de orçamento | Sem vídeo |
| **Firemaster** (firemaster.eng.br) | Salto/SP, SP e estados vizinhos | Hero de produto ("Sistema de sprinkler") | Desde 2018; ~20 logos de clientes (IBM, Walmart, Magalu, John Deere, Votorantim); 6 selos de certificação sem texto | WhatsApp com mensagem pronta; "Saiba mais"; nenhum CTA de orçamento; muitos artigos de SEO ("Projeto AVCB Preço") | Sem vídeo |
| **Zoli Fire** (zolifire.com.br) | São Bernardo do Campo, Grande ABC | "Instalação e Manutenção de Alarmes de Incêndio" | Desde 2014; 500+ clientes; Google 5.0 com 17 avaliações; NBR 17240, IT-16 e IT-18 do CBPMESP, Decreto 63.911/2018; peças Ascael | "Ligue agora"; "Faça seu Orçamento" e "Solicite um Orçamento Gratuito" (WhatsApp e formulário); FAQ com as cidades do ABC | Sem vídeo |
| **Resil** (resil.com.br) | Grande SP, fabricante | "Qualidade, segurança e confiança no combate a incêndios" e "Há 71 anos protegendo os brasileiros" | Desde 1955; Inmetro; ISO 9001 (TÜV NORD); rede de assistência nacional; governança (código de conduta, ouvidoria, LGPD) | "Solicitar Orçamento" (várias vezes); "Onde comprar"; "Quero ser distribuidor" | Sem vídeo. Números inconsistentes no site (36 contra 71 anos; 15+ contra 30+ tipos de extintor) |
| **Bucka** (bucka.com.br) | São Paulo (Freguesia do Ó), fabricante | Slogan "Qualidade que faz a diferença" | Nenhum número, nenhum cliente; catálogos para download | "Faça uma cotação"; "Fale conosco"; widget de WhatsApp | Sem vídeo |
| **Protecin hoje** (protecin.com.br) | Santo André/SP, atuação nacional | "Protegendo vidas e patrimônios há 50 anos" | 50 anos, 20.000+ clientes, 3M+ equipamentos, 5M+ inspeções, 250+ obras; autorizações Kidde Brasil, Everlux, Notifier, Simplex; logos ABSpk e NFPA | Home: só "Saiba Mais" e WhatsApp flutuante; formulário só na página Contato | Elementor: 35 animações de entrada padrão e 5 contadores (jQuery Numerator); 0 vídeos; fotos de banco de imagens |

Concorrência local do ABC encontrada em diretórios (todas com presença digital fraca): Hero Engenharia (SBC, hidrantes e sprinklers), Sanches Regularizações e Engenharia (Mauá), Safety2u (Diadema, projetos e vistorias), Matrix Extintores e CSS Equipamentos (Santo André).

### 1.2 Padrões de posicionamento

- **"Engenharia" como palavra-chave de status.** Smart Fire, SWB e Firemaster se vendem como empresas de engenharia, não como "recarga de extintor". Isso separa projeto, sistema e gestão do serviço de commodity.
- **"Líder" sem prova.** SWB e Global usam "líderes" sem um número que sustente. A Protecin pode usar números reais no lugar do adjetivo.
- **Tradição.** A Resil abre com "Há 71 anos". É a mesma alavanca dos 50 anos da Protecin.
- **Operação que não pode parar.** O fechamento da Smart Fire fala com quem compra B2B (indústria, data center, hospital): risco operacional, não só multa.
- **SEO local.** Zoli Fire e Firemaster listam cidades e bairros e publicam artigos de AVCB. É o jogo de quem disputa busca orgânica no ABC.

### 1.3 Provas de credibilidade, por frequência nos sites analisados

1. Parede de logos de clientes, em quase todos os prestadores de serviço (Smart Fire, SWB, Global, Firemaster).
2. Anos de mercado (todos).
3. Normas citadas pelo número (NBR 17240, IT-16/IT-18, NFPA, FM Global).
4. Fabricantes homologados ou autorizados (Smart Fire tem a lista mais longa).
5. Número de projetos, clientes ou estados (Smart Fire, Zoli Fire).
6. Certificações (Inmetro, ISO 9001: Resil).
7. Avaliações do Google e depoimentos (Zoli Fire).
8. Processo em etapas ("Como Trabalhamos", Smart Fire) e FAQ (SWB, Zoli Fire).

O que o comprador checa (guia do SindicoNet para síndicos): empresa certificada pelo Inmetro, cadastro na Cetesb no estado de SP, engenheiro no quadro, selo Inmetro com a próxima data de vencimento, ordem de serviço assinada pelo técnico e orçamento detalhado. O site da Protecin já cita "manutenção certificada pelo INMETRO" e engenheiros. Cetesb e número de registro no Inmetro **[confirmar com a Protecin]** antes de exibir.

### 1.4 CTAs recorrentes no setor

Os sites não mostram dados de conversão. O que segue é o padrão que o mercado adotou e deve ser medido no GTM depois.

- **"Solicitar orçamento"** repetido no topo, em cada serviço e no fim da página. Variações: "Faça uma cotação", "Solicite um orçamento gratuito".
- **WhatsApp com mensagem pré-preenchida.** Está em quase todos os sites. Ideal: uma mensagem por serviço.
- **"Fale com um especialista"** (SWB) e **"Solicitar projeto"** por serviço (Smart Fire): CTA consultivo para engenharia.
- **AVCB** como gancho de urgência: FAQ de prazo, alerta de multa e interdição, artigos "Projeto AVCB preço".
- **Diagnóstico ou visita técnica gratuita** (SWB). A página de Contato da Protecin já fala em "agendar uma visita". Se é gratuita, **[confirmar com a Protecin]**.
- **Telefone clicável** ("Ligue agora", Zoli Fire).
- **Download de catálogo** (Bucka). A Protecin já tem o Catálogo Digital em PDF.

### 1.5 Lacunas dos concorrentes, que viram oportunidade para a Protecin

- Nenhum site analisado usa motion de verdade: zero scroll storytelling, zero vídeo de operação real, zero demonstração de produto digital.
- Nenhum mostra plataforma própria de inspeção. No mercado existem ferramentas genéricas de checklist com QR code (ex.: Produttivo), mas não integradas ao serviço do prestador.
- Os números dos concorrentes são pequenos (500+ clientes, 1.000+ projetos) ou inconsistentes (Resil).
- Há falhas de acabamento (template em inglês na SWB, hero duplicado na Resil, Firemaster sem CTA de orçamento).

---

## 2. Referências mundiais de motion (B2B, indústria, engenharia)

Os dados "inspecionados" foram medidos ao vivo na home em 28/10/2026. "Sticky N×" significa que o container da seção fixada tem N alturas de tela, ou seja, o usuário rola N telas enquanto a cena fica presa.

### 2.1 Terminal Industries: https://terminal-industries.com
- **Prêmio:** Awwwards Site of the Day em 03/09/2025 e Site of the Month em setembro de 2025. Feito pela Rejouice e pela Propagande. Nota de Animações/Transições no Dev Award: 8,8.
- **Inspecionado:** Nuxt (Vue) + Lenis; 5 seções sticky de 2,7 a 3,6×; cerca de 1.050 spans de texto quebrado; 14 máscaras `clip-path`; 10 paths SVG com `stroke-dasharray` (traço que se desenha); 4 vídeos mudos em loop, pré-renderizados, que não tocam sozinhos (o JS dá play quando entram na tela); 1 canvas; cerca de 200 transforms inline (parallax via JS).
- **Técnicas:** scroll pin com troca de cena, text reveal por palavra e linha, SVG que se desenha, vídeo de produto pré-renderizado, calculadora interativa "What's your yard costing you?" que vira lead.
- **Para a Protecin:** é a referência principal. Mesmo tipo de negócio (operação física + software). Aplicar à seção da plataforma (App, Painel Web, Recursos, Benefícios) e a uma ferramenta "Monte sua solicitação".

### 2.2 ON.energy: https://www.on.energy
- **Prêmio:** Awwwards SOTD em 09/03/2026, Studio 28K. Tags 3D e WebGL; destaques "Hero" (vídeo) e "Energy Stream Interaction" (interação com o mouse).
- **Inspecionado:** Nuxt + Lenis; um bloco sticky de 8× (história longa presa na tela); 2 vídeos em autoplay; 2 canvas WebGL; rótulos com letras espaçadas ("O U R  E X P E R T I S E").
- **Técnicas:** hero em vídeo, partículas ou fluxo que reage ao cursor, storytelling longo fixado, headline técnica com especificação real.
- **Para a Protecin:** hero com vídeo e uma camada de partículas ou brasas que reagem ao mouse (desktop). Rótulos espaçados para "DESDE 1976" e "ENGENHARIA".

### 2.3 Vast: https://vastspace.com
- **Prêmio:** Awwwards SOTD em 01/04/2026, Antinomy Studio. Tags Transitions, Storytelling, Photo & Video, Three.js e Webflow.
- **Inspecionado:** Webflow + Three.js r172 + Lenis + Barba.js (transição entre páginas); cerca de 120 spans de texto quebrado; vídeo em autoplay; animação CSS de chevron (indicador de scroll).
- **Técnicas:** transição de página sem recarregar, modelo 3D interativo (interior e exterior da estação), tipografia grande revelada por linha.
- **Para a Protecin:** transição de página (cortina vermelha) entre Home, Institucional, Serviços, App e Contato. 3D é opcional: um extintor ou um sprinkler girando com o scroll, só se houver modelo pronto.

### 2.4 Breakthrough Energy: https://www.breakthroughenergy.org
- **Prêmio:** Awwwards SOTD em 15/01/2026, Resn. Awwwards lista GSAP, Vue e Locomotive Scroll. Dev Award: Animações 8,8, Responsivo 8,2.
- **Inspecionado:** Lenis; container sticky de cerca de 27× (a home inteira é uma narrativa empilhada), com subseções de 3 a 5×; 20 máscaras `clip-path`; fundo animado em CSS; 2 vídeos, sendo um sem loop e sem autoplay (candidato a vídeo controlado pelo scroll).
- **Técnicas:** cards empilhados que se sobrepõem no scroll, revelação de imagem por máscara, vídeo controlado, modal de conteúdo.
- **Para a Protecin:** serviços como cards empilhados (6 serviços reais) que se sobrepõem conforme o scroll, cada um com a foto revelada por máscara.

### 2.5 Serve Robotics: https://www.serverobotics.com
- **Prêmio:** Awwwards SOTD em 11/06/2026, WILD e Mach Studio. Stack React + Tailwind + Sanity (próxima da nossa). Tags Storytelling, Microinteractions.
- **Inspecionado:** Lenis; seções sticky de 3, 6 e 8×; cerca de 570 spans de texto quebrado; títulos duplicados no DOM (técnica de máscara e troca de texto no hover e na entrada); 2 canvas 3D; 5 vídeos que tocam ao entrar na tela; 18 máscaras `clip-path`.
- **Técnicas:** headline com efeito de "rolagem" de texto (duas cópias sobrepostas em máscara), microinterações em botões, vídeos de produto em loop.
- **Para a Protecin:** botões com texto que rola no hover (cópia duplicada em `overflow:hidden`), títulos revelados por máscara. É fácil de fazer em framer-motion.

### 2.6 Path Robotics: https://www.path-robotics.com
- **Prêmio:** Awwwards SOTD em 23/09/2021, Studio Freight (Next.js e Locomotive Scroll na época). O site atual é outra versão.
- **Inspecionado (versão atual):** Next.js + Three.js r182 + Lenis; 6 vídeos (1 em autoplay); narrativa "The Welder Shortage Crisis" seguida de "Physical AI for Welding".
- **Técnicas:** estrutura problema e depois solução, vídeo industrial real (robô soldando), 3D pontual.
- **Para a Protecin:** abrir uma seção com o problema ("equipamento vencido, AVCB parado, operação em risco") e responder com a solução Protecin. Gravar vídeo real de inspeção e teste hidrostático na sede de Santo André.

### 2.7 Edifis: https://edifis.ca/en/
- **Prêmio:** Awwwards SOTD em 01/05/2023, Tux Creative House (desenvolvimento imobiliário industrial). Destaques: Fullscreen Page Transition, Project Page Transition, WebGL Interactive Header, Button Micro-interaction, 3D Interactive Fullscreen Menu.
- **Inspecionado:** Nuxt + Three.js r146; `pin-spacer` do GSAP ScrollTrigger presente (pin); 6 vídeos acionados por interação; 12 máscaras `clip-path`; carrossel Swiper.
- **Técnicas:** menu em tela cheia animado, transição de página em tela cheia, header WebGL, botões magnéticos.
- **Para a Protecin:** menu fullscreen com os itens entrando em sequência e uma foto de fundo trocando no hover de cada item.

### 2.8 Composites.archi: https://www.composites.archi
- **Prêmio:** Awwwards SOTD em 08/04/2025, Sparkk (para a JEC, materiais de construção B2B). Tags Scrolling, Storytelling, 3D. Dev Award: Animações 8,2.
- **Inspecionado:** Nuxt + Three.js r171; cerca de 330 spans de texto quebrado; 10 blocos sticky (de 3× a 23×); animações CSS `reveal_bottom` e `slide_left`; 6 elementos com `mix-blend-mode`.
- **Técnicas:** tipografia gigante revelada palavra a palavra, scrollytelling longo fixado, blend mode no texto sobre imagem.
- **Para a Protecin:** frases-manifesto do conteúdo real ("Protegemos seu maior patrimônio: a vida.", "Cuidar de vidas também é transformar futuros") em tipografia gigante revelada palavra a palavra.

### 2.9 Verkada: https://www.verkada.com (segurança física B2B, sem prêmio verificado)
- **Inspecionado:** Next.js; 8 vídeos acionados por scroll ou interação; 10 canvas; marquee de logos em CSS (`logo-carousel`); 28 máscaras; prova numérica no título ("More than 30,000 organizations worldwide trust Verkada"); CTA "Try Verkada for free".
- **Técnicas:** vídeo de produto por funcionalidade, marquee de logos, número grande como título de seção.
- **Para a Protecin:** é o análogo mais próximo do ponto de vista de vendas. Um título como "Mais de 20.000 clientes atendidos" seguido do marquee de fabricantes e filiações.

### 2.10 Hadrian: https://www.hadrian.co (manufatura avançada, sem prêmio verificado)
- **Inspecionado:** Next.js + Lenis; 3 vídeos em autoplay em tela cheia; pouquíssimo texto ("The Future of American Production", "Production On-Demand").
- **Técnicas:** vídeo industrial em tela cheia como protagonista, tipografia curta e forte.
- **Para a Protecin:** prova de que vídeo de chão de fábrica bem filmado vende mais que foto de banco de imagens.

Observação: o site da Prometheus Fuels (Active Theory, Site of the Year 2021 no Awwwards) foi a referência histórica de storytelling em WebGL industrial, mas hoje redireciona para prometheusfuels.ai, que foi redesenhado sem aquele motion. Fica só como registro.

### 2.11 Catálogo de técnicas aplicado à Protecin (stack React + framer-motion + Lenis)

| Técnica | Visto em | Onde usar na Protecin (conteúdo real) | Implementação |
|---|---|---|---|
| Scroll pin | Terminal, ON, Breakthrough, Serve, Composites | Plataforma (01 App, 02 Painel Web, 03 Recursos, 04 Benefícios); linha do tempo 1976 a 2024 | Container `h-[400vh]` + filho `sticky top-0`; `useScroll({target})` e `useTransform` trocam as telas do mockup |
| Text reveal por linha ou palavra | Terminal, Serve, Composites, Vast | Todos os H1 e H2; frases-manifesto | Quebrar em linhas ou palavras; cada uma em `overflow-hidden` com `y: 110% → 0` e stagger de 0,06 a 0,08 s em `whileInView` |
| Máscaras (`clip-path`) | Terminal, Breakthrough, Serve, Edifis | Fotos dos serviços; transição do hero para a seção seguinte | `clipPath: inset(100% 0 0 0) → inset(0)` ou `circle(0% → 150%)` ligado ao scroll |
| Parallax | Terminal (transforms inline), Breakthrough | Fotos da sede, da equipe e das obras; camadas do hero | `useTransform(scrollYProgress, [0,1], ['-10%','10%'])` em imagem com escala de 1,15 |
| Contadores | Protecin atual (jQuery), padrão do setor | 50 anos, 20.000+ clientes, 3M+ equipamentos, 5M+ inspeções, 250+ obras | `animate(motionValue, alvo)` ao entrar na tela, `tabular-nums`, efeito odômetro por dígito |
| Marquee | Smart Fire, Verkada | Fabricantes e filiações (Kidde, Everlux, Notifier, Simplex, Bosch, Firebee, Germek, ABSpk, NFPA); faixa de serviços | Trilha duplicada com `x: 0 → -50%` infinito; velocidade varia com a velocidade do scroll (`useVelocity`); pausa no hover |
| Cursor | Nenhuma das 10 (opcional) | Só desktop: halo sutil e botões magnéticos nos CTAs | `pointer: fine` + `useSpring` seguindo o mouse; desligado no toque |
| Transições de página | Vast (Barba), Edifis | Navegação entre as páginas | `AnimatePresence` + cortina vermelha que cobre e descobre a tela; HashRouter no GitHub Pages |
| Vídeo com scrub | Breakthrough (vídeo controlado); referência técnica: Awwwards "Scroll-based Video Scrubbing" | Sequência de inspeção de um extintor ou de um prédio sendo "protegido" | `video.currentTime = progress × duration` via `useMotionValueEvent`; MP4 codificado com keyframe em todo quadro (`ffmpeg -g 1`), com poster de fallback |
| SVG que se desenha | Terminal (10 paths) | Planta de edificação com rede de hidrantes, sprinklers, alarme e sinalização acendendo por camada; linha da timeline; mapa de cobertura | `motion.path` com `pathLength: 0 → 1` ligado ao scroll |
| Ferramenta interativa que gera lead | Terminal (calculadora) | "Monte sua solicitação": tipo de edificação, serviço, cidade, gerando lead | Formulário multi-etapas animado + `dataLayer.push({event:'lead_form_submit', servico, etapa})` |
| Microinterações | Serve, Edifis | Todos os botões e cards | Texto que rola no hover, preenchimento que varre o botão, leve tilt nos cards |
| Preloader | Padrão Awwwards | Contador "1976 → 2026" com o símbolo da Protecin | Menos de 1,5 s, só na primeira visita (sessionStorage) |

Obrigatório em todas as técnicas: `prefers-reduced-motion` desliga scrub, parallax e marquee (fica só o fade). Vídeos com `muted playsinline preload="metadata"` + poster, `lazy` fora da primeira dobra e WebM/MP4 abaixo de cerca de 3 MB por clipe. Lenis desligado em dispositivos de toque, se travar.

---

## 3. Diferenciais que a Protecin pode explorar (só com fatos reais)

| # | Diferencial (fonte: site atual) | Por que diferencia (comparado à pesquisa) | Como mostrar com motion |
|---|---|---|---|
| 1 | **50 anos em 2026.** Fundada em 1976 pela Extimbrás, "uma das pioneiras na fabricação de extintores no Brasil" | Só a Resil, que é fabricante, usa tradição maior. Entre os prestadores de serviço analisados, o mais antigo é de 2009 | Selo "50 anos" no hero; preloader 1976 → 2026; timeline horizontal fixada (1976, 1986, 2004, 2006, 2009, 2012, 2015, 2021, 2024) com linha SVG se desenhando |
| 2 | **Escala:** 20.000+ clientes, 3M+ equipamentos manutenidos, 5M+ inspeções, 250+ obras de médio e grande porte | Concorrentes exibem 500+ clientes (Zoli Fire) ou 1.000+ projetos (Smart Fire) | Título-número como o da Verkada ("Mais de 20.000 clientes atendidos"); contadores em odômetro |
| 3 | **Plataforma própria (desde 2021):** App de Coleta (offline, questionários, relatório automático por e-mail), Web Master (perfis, tempo real, ordens de serviço ao app), Processador de Coleta Online; conformidade com NBR 12962 e NBR 12779 | Nenhum concorrente analisado mostra software próprio. Ferramentas genéricas de checklist existem, mas não vêm junto com o serviço | Seção fixada com mockup de celular e painel; as telas trocam no scroll (técnico em campo, painel do gestor, relatório chegando ao cliente). Usar as imagens reais App_1, App_2 e App_3 |
| 4 | **Autorizações oficiais de fabricantes:** Kidde Brasil, Everlux, Notifier, Simplex. Logos de parceiros: Bosch, Firebee, Germek. Filiações exibidas: ABSpk e NFPA | A Smart Fire usa lista de homologações como prova central, e a Protecin tem marcas de mesmo peso | Marquee duplo (autorizações e filiações) com logo colorindo no hover. A natureza exata da relação com Bosch, Firebee e Germek **[confirmar com a Protecin]** |
| 5 | **Engenharia multidisciplinar:** engenheiros Civil, Elétrica, Mecânica e de Segurança; Protecin Engenharia desde 2015; projetos com ART; assessoria completa de AVCB | Responde ao que o comprador checa (engenheiro no quadro, ART) e ao posicionamento "engenharia" dos líderes | Planta isométrica SVG de um prédio: cada sistema acende por camada (hidrantes, sprinklers, alarme, sinalização, extintores) conforme o scroll |
| 6 | **Cobertura nacional:** "Cobertura técnica em território nacional"; presença consolidada em 10 estados desde 2009 | Smart Fire e SWB vendem "atuação nacional"; a Protecin tem histórico datado | Mapa do Brasil em SVG com estados acendendo. A lista dos estados **[confirmar com a Protecin]**: não desenhar sem ela |
| 7 | **Preço único para inspeção e manutenção de extintores** (conceito criado pela Protecin em 1986) e foco em grandes contratos | Previsibilidade de custo é argumento B2B que nenhum concorrente usa | Card destacado na seção de gestão de equipamentos. Se a oferta continua vigente **[confirmar com a Protecin]** |
| 8 | **Gestão completa e rastreável:** rastreamento individual dos itens, manutenção certificada pelo INMETRO, testes hidrostáticos, cobertura de seguros | Atende ponto a ponto o checklist do comprador (Inmetro, selo, OS) | Linha "do equipamento ao relatório" com ícones se desenhando em sequência |
| 9 | **ESG real:** Política de Preservação Ambiental (desde 2004), descarte responsável de resíduos, Kids ONG (7 anos, Santo André, fundada por Cláudio Szulcsewski) | Nenhum concorrente analisado tem frente social ou ambiental | Bloco "Cuidar de vidas também é transformar futuros" com tipografia gigante revelada palavra a palavra e fotos reais da ONG |
| 10 | **Gente e processo:** Programa de Desenvolvimento de Talentos (2006), Programa Qualidade Total (2009), setores integrados por sistemas | Sustenta "equipe técnica qualificada" com fatos datados | Itens da timeline e uma seção de equipe com fotos reais em parallax |

### CTAs recomendados para a demo

1. **"Solicitar orçamento"** fixo no header e no fim de cada seção, abrindo um formulário multi-etapas (tipo de edificação, serviço, cidade e UF, contato). Evento `lead_form_submit`.
2. **WhatsApp por serviço** (número real 55 11 94565-1751), com mensagem pré-preenchida citando o serviço. Evento `whatsapp_click` com o parâmetro `servico`.
3. **"AVCB: obter ou renovar"** como entrada própria (o serviço já existe: Projetos Técnicos e Suporte para AVCB), com FAQ. Prazos ou multas só com fonte oficial citada.
4. **"Agendar visita técnica"**, usando o texto já existente na página Contato.
5. **"Conhecer a plataforma"**, rolando até a demo animada do app.
6. **"Baixar catálogo digital"** (o PDF já existe). Evento `catalog_download`.
7. **Telefone clicável** (+55 11 4977-8720). Evento `phone_click`.

Não usar "orçamento gratuito" nem "diagnóstico gratuito" sem confirmação da Protecin.

### Pendências de conteúdo para a proposta [confirmar com a Protecin]

- Logos de clientes autorizados para exibição: é a prova mais forte do setor e hoje não aparece no site (a página Nossos Clientes mostra só setores e logos de fabricantes).
- Depoimentos reais e avaliações do Google.
- Lista dos estados atendidos, para o mapa.
- Registro no Inmetro e cadastro na Cetesb (número ou selo), além de ISO, se houver.
- Vídeos e fotos reais: sede da Rua Lacônia, frota, oficina de recarga, teste hidrostático, técnicos usando o app. Se não houver, usar vídeo de banco livre (ex.: Pexels, conferindo a licença) só como placeholder da demo.

---

## Fontes

Concorrentes e mercado brasileiro
- Smart Fire: https://www.smartfire.com.br/
- SWB Engenharia Contra Incêndios: https://swbeng.com.br/
- Global Incêndio: https://www.globalincendio.com.br/
- Firemaster: https://firemaster.eng.br/
- Zoli Fire (SBC/ABC): https://www.zolifire.com.br/ e https://www.zolifire.com.br/manutencao-em-rede-de-hidrantes-em-sao-bernardo-do-campo
- Resil: https://www.resil.com.br/ (fundação de 1955 também citada em https://leadiq.com/c/resil-extintores/5a1d96962300005a008535f3/employee-directory)
- Bucka: https://www.bucka.com.br/
- Diretórios do ABC: https://coteibem.sindiconet.com.br/fornecedores/extintores-equipamentos/sp/sao-bernardo-campo, https://coteibem.sindiconet.com.br/fornecedores/extintores-equipamentos/sp/maua, https://coteibem.sindiconet.com.br/fornecedores/projetos-contra-incendio/sp/diadema, https://www.ohub.com.br/empresa/css-equipamentos-e-treinamento-de-brigada-e-segureanca-santo-andre-sp-200100
- O que o contratante deve checar (SindicoNet): https://www.sindiconet.com.br/informese/extintores-manutencao
- Ferramenta genérica de checklist com QR code (Produttivo): https://www.produttivo.com.br/modelo/checklist-extintores/
- Protecin, site atual: https://protecin.com.br/ (conteúdo em `referencia/conteudo-site-atual.md`)

Referências de motion (páginas de prêmio e sites)
- Terminal Industries: https://www.awwwards.com/sites/terminal-industries e https://terminal-industries.com
- ON.energy: https://www.awwwards.com/sites/on-energy e https://www.on.energy/
- Vast: https://www.awwwards.com/sites/vast e https://vastspace.com
- Breakthrough Energy: https://www.awwwards.com/sites/breakthrough-energy e https://www.breakthroughenergy.org/
- Serve Robotics: https://www.awwwards.com/sites/serve-robotics e https://www.serverobotics.com/
- Path Robotics: https://www.awwwards.com/sites/path-robotics e https://www.path-robotics.com/
- Edifis: https://www.awwwards.com/sites/edifis e https://edifis.ca/en/
- Composites.archi: https://www.awwwards.com/sites/composites-archi e https://www.composites.archi
- Verkada: https://www.verkada.com/
- Hadrian: https://www.hadrian.co/
- Prometheus Fuels (histórico): https://www.awwwards.com/sites/prometheus-fuels e https://www.awwwards.com/prometheus-by-active-theory-wins-site-of-the-month-may-2021.html
- Técnica de vídeo com scrub: https://www.awwwards.com/inspiration/scroll-based-video-scrubbing-maker
- Coleção de storytelling no Awwwards: https://www.awwwards.com/awwwards/collections/storytelling/
