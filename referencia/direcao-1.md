# Direção 1: Cinematográfico industrial

Direção de arte e de motion da demo de redesign da Protecin (React 18 + Vite + TypeScript + Tailwind 3 + framer-motion + Lenis, publicada no GitHub Pages).
Base factual: `conteudo-estruturado.md` e `conteudo-site-atual.md`. Base técnica: `padroes-codigo.md`. Vídeos: `videos.md`. Critério de aceite: `qa/REGUA-SITE-NOVO.md`.

Regras desta direção:
- Todo texto de conteúdo deste documento é literal do site atual ou é composto só com fatos de lá. Onde há dúvida, está marcado **[confirmar com a Protecin]**.
- Toda duração de entrada fica entre 200 e 900 ms (régua). Efeitos ligados à rolagem usam só `transform` e `opacity`.
- Prioridade de implementação: **P0** (a demo não sai sem isso), **P1** (entra na primeira versão publicada), **P2** (acabamento, só se sobrar tempo).

---

## 1. Conceito

### 1.1 A ideia em uma frase
O símbolo da Protecin (a gota protegida por quatro cantoneiras) vira a janela por onde o visitante vê a empresa. A página começa no escuro, o vermelho da marca funciona como luz (de emergência, de brasa) e cada capítulo se abre dentro da gota.

### 1.2 Roteiro da home
1. **Abertura no escuro.** Vídeo de sistema de supressão em tela cheia e o título "Protegendo vidas e patrimônios há 50 anos".
2. **O símbolo se forma.** Ao rolar, a tela inteira encolhe até virar a gota do logo. As quatro cantoneiras chegam dos cantos e fecham o símbolo, e o slogan "Protegemos seu maior patrimônio: a vida." acende palavra por palavra.
3. **Prova.** 20.000+ clientes, 3M+ equipamentos, 5M+ inspeções, 250+ obras, autorizações Kidde Brasil, Everlux, Notifier e Simplex, e filiações ABSpk e NFPA.
4. **O que fazemos.** Os 8 serviços aparecem como cartões que se empilham.
5. **Prova real.** A foto do acervo (extintor com etiqueta PROTECIN) vira um passeio de câmera guiado pela rolagem, com cinco pontos marcados.
6. **Tecnologia.** A plataforma própria se monta na tela, num mundo azul-marinho que se abre dentro da gota.
7. **Tradição.** A linha do tempo de 1976 a 2026 corre na horizontal.
8. **Ação.** O orçamento abre dentro da gota vermelha, com brasas subindo.

### 1.3 Por que vende
- **"O site dos 50 anos".** A Protecin completa 50 anos em 2026 (1976 + 50). O preloader conta de 1976 a 2026 e a linha do tempo termina em 2026. A proposta chega com um gancho de data.
- **O mercado não tem motion.** Nenhum concorrente analisado (Smart Fire, SWB, Global Incêndio, Firemaster, Zoli Fire, Resil e Bucka) passa de um marquee de logos. Esta direção usa as técnicas das referências premiadas (Terminal Industries, ON.energy, Breakthrough Energy e Composites.archi): cena fixada com rolagem longa, texto revelado por palavra, vídeo que toca ao entrar na tela e SVG que se desenha.
- **Prova antes de adjetivo.** Os números da Protecin são uma ordem de grandeza maiores que os dos concorrentes vistos (500+ clientes, 1.000+ projetos) e aparecem como título, não como rodapé.
- **A foto real vira a cena principal.** É a única do acervo com a marca visível (etiqueta PROTECIN no extintor), e passa a valer mais que todas as fotos de banco.
- **Software que ninguém mais mostra.** A plataforma (App de Coleta, Web Master e Processador de Coleta Online) é demonstrada em movimento, não só descrita.
- **Conversão que o site atual não tem.** A home de hoje não tem botão de orçamento. Na demo, "Solicitar orçamento" fica acima da dobra no desktop e no celular, há WhatsApp com mensagem pronta por serviço e todo clique alimenta o `dataLayer` no padrão do Extin Seven. O GTM e as conversões do Ads (pendências com o Gabriel) entram sem mexer no código: basta o ID do contêiner.
- **Coerência de marca.** Um único motivo visual (gota + cantoneiras) se repete no preloader, no hero, nas transições de seção e de página e no rodapé. Isso é o que faz o site parecer feito para a Protecin, e não um template.

### 1.4 O que esta direção não faz
- Não usa foto de bombeiro como equipe, nem `Team-*`, `Testi-*`, `Icon-*`, logoipsum ou `teste-1.png`.
- Não cita cliente nenhum. O arquivo `024-original.jpg` é renomeado e publicado sem nome nem local.
- Não inventa telas de dashboard com números. As telas do app são recriadas só com os rótulos das capturas reais, e os dados ficam borrados como no original.
- Não usa "orçamento gratuito", "diagnóstico gratuito" nem mapa com estados marcados.
- Nada pisca. A única animação infinita é a dos marquees, que pausam fora da tela e no hover.
- Não usa glassmorphism, gradiente roxo nem neon. O verde só aparece no ícone do WhatsApp.

---

## 2. Mapa do site

Rotas iguais às do site atual (os mesmos caminhos que `qa/capturar.mjs` já percorre). Isso facilita o redirecionamento e o SEO na troca de produção.

| Rota | Título da página (`<title>`) | Seções, na ordem |
|---|---|---|
| `/` | Protecin: engenharia e proteção técnica contra incêndio desde 1976 | H0 Abertura + Símbolo · H1 Escala · H2 Credibilidade · H3 Serviços · H4 Na prática · H5 Plataforma · H6 Diferenciais · H7 50 anos · H8 Setores · H9 Compromisso · H10 Orçamento · Rodapé |
| `/institucional/` | Institucional: Protecin desde 1976 | I0 PageHero · I1 Linha do tempo (completa) · I2 Missão, Visão e Valores · I3 Sustentabilidade · I4 Kids ONG · Faixa CTA · Rodapé |
| `/servicos/` | Serviços de engenharia, inspeção e manutenção contra incêndio: Protecin | S0 PageHero · S1 Índice + 8 capítulos · S2 Fitas de equipamentos e serviços de campo · S3 Na prática (reuso de H4) · Faixa CTA · Rodapé |
| `/nossos-clientes/` | Nossos clientes e parcerias: Protecin | C0 PageHero · C1 Escala · C2 Setores empilhados · C3 Parcerias e filiações · Faixa CTA · Rodapé |
| `/catalogo-digital/` | Catálogo Digital Protecin | K0 Capa 3D + Download · K1 Linha de equipamentos · Faixa CTA · Rodapé |
| `/nosso-app/` | Protecin App: gestão inteligente de inspeções | A0 Hero de dispositivos · A1 Como funciona (fluxo dos 3 módulos) · A2 Quatro pilares (reuso de H5) · A3 Recursos que fazem a diferença · A4 Fecho + CTA · Rodapé |
| `/contato/` | Contate a Protecin | T0 PageHero compacto · T1 Formulário + canais · T2 Mapa · Rodapé |
| `/404.html` | Página não encontrada: Protecin | Símbolo que se abre, link para a home |

**Serviços:** cada serviço é um capítulo em `/servicos/` com `id` igual ao slug atual. Exemplos: `/servicos/#instalacao-de-sistemas-e-equipamentos`, `#projetos-tecnicos`, `#documentacao-e-regularizacao`, `#inspecoes-e-manutencoes-preventivas`, `#manutencao-de-equipamentos`, `#gestao-de-riscos-e-consultoria`, `#venda-de-equipamentos` e `#sinalizacao-de-seguranca`. O último é novo, porque não existe slug atual.
- **Na produção**, o `.htaccess` faz 301 de cada slug antigo para a âncora correspondente.
- **Quando as subpáginas forem raspadas**, cada slug pode virar página própria sem mudar o resto.

**Meta descriptions** (todas compostas com texto real):
- `/`: "Desde 1976 em Santo André (SP): projetos com ART, AVCB, instalação, inspeção e manutenção de sistemas contra incêndio. 20.000+ clientes atendidos."
- `/institucional/`: "A história da Protecin de 1976 a 2024, missão, visão, valores, política ambiental e o Kids ONG."
- `/servicos/`: "Instalação de sistemas, projetos técnicos com ART, regularização de AVCB, inspeções, manutenção, gestão de riscos, venda de equipamentos e sinalização."
- `/nossos-clientes/`: "Setores atendidos, autorizações Kidde Brasil, Everlux, Notifier e Simplex, e filiações técnicas."
- `/catalogo-digital/`: "Baixe o Catálogo Digital Protecin com serviços, produtos, tecnologias e diferenciais."
- `/nosso-app/`: "App de Coleta, Web Master e Processador de Coleta Online: inspeções de extintores e hidrantes conforme NBR 12962 e NBR 12779."
- `/contato/`: "Telefone +55 11 4977-8720, WhatsApp, comercial@protecin.com.br. Rua Lacônia, 600, Santo André - SP. Segunda a sexta, 8h às 17h30."

**Roteamento (P0).** É um roteador próprio em `src/lib/router.tsx`, sem dependência nova.
- **Prerender:** `scripts/prerender.mjs` percorre `ROUTES`, chama `render(url)` e grava `dist/<rota>/index.html`, além de `dist/404.html`. Troca também `<!--head-->` pelo `title`, pela description, pelo canonical e pelo OG de cada rota.
- **No cliente:** `usePath()` lê `location.pathname` sem `import.meta.env.BASE_URL`. `<Link to>` intercepta o clique, roda a cortina (seção 6.4) e chama `history.pushState`. O `popstate` também passa pela cortina.
- **Base:** todo `href` interno passa por `routeUrl(path)`, que prefixa a base, igual a `assetUrl`.
- **GitHub Pages:** serve `/protecin-demo/institucional/` direto da pasta, sem hash.

---

## 3. Sistema visual

### 3.1 Paleta (tokens do `tailwind.config.js`)

Origem: azul `#0E3452`, vermelho `#BE1E29` e vermelho-alaranjado `#E8442E` foram amostrados do logo. Os demais tons são neutros derivados. Os contrastes foram calculados pela fórmula WCAG 2.x.

| Token | Hex | Papel | Contraste medido |
|---|---|---|---|
| `noite-950` | `#05070A` | Fundo da página | papel-50 sobre ele: 17,61 |
| `noite-900` | `#0B0F15` | Faixas alternadas, menu | papel-50: 16,77 |
| `noite-800` | `#121925` | Cartões, formulário | papel-50: 15,39 |
| `noite-700` | `#1C2533` | Campos, bordas fortes | (só fundo de campo) |
| `noite-600` | `#2A3445` | Linhas finas, réguas | (decorativo) |
| `noite-500` | `#5E6878` | Traço de contorno, trilhos | 3,58 sobre 950: **nunca texto** |
| `marinho-700` | `#0E3452` | Azul da marca: mundo da Plataforma | papel-50 sobre ele: 11,24 |
| `marinho-900` | `#081A2B` | Fim do gradiente azul | papel-50: 15,37 |
| `brasa-500` | `#BE1E29` | Vermelho da marca: preenchimento de botão, gota, letreiro gigante | branco sobre ele: 6,16 (AA); ele sobre 950: 3,27 (só texto ≥ 24 px) |
| `brasa-600` | `#8F141B` | Varredura de hover do botão, brilho profundo | branco sobre ele: 9,20 |
| `brasa-400` | `#E8442E` | Laranja da marca: luz, cantoneira e gota do símbolo, destaque de título | sobre 950: 5,09 (AA); sobre 800: 4,45 (**só texto grande**); branco sobre ele: 3,96 (**nunca botão com texto branco**) |
| `brasa-300` | `#FF6A4D` | Texto pequeno vermelho sobre cartão e sobre azul, miolo da brasa | sobre 950: 7,13; sobre marinho-700: 4,55 |
| `brasa-200` | `#FFB199` | Núcleo das partículas | (decorativo) |
| `papel-50` | `#F3EFE9` | Texto principal | ver acima |
| `papel-300` | `#B8BFC9` | Texto secundário | sobre 950: 10,89; sobre 800: 9,51; sobre marinho-700: 6,95 |
| `papel-500` | `#8C95A3` | Legenda, rótulo mono | sobre 950: 6,67; sobre 800: 5,83 |
| `whatsapp` | `#25D366` | Só o ícone e o ponto do WhatsApp | sobre 950: 10,17 |

Gradientes e luzes (todos estáticos, quem anima é `opacity` ou `transform` da camada):
- `luz-brasa`: `radial-gradient(60% 50% at 50% 100%, rgba(190,30,41,.55), rgba(190,30,41,0) 70%)`.
- `luz-ponteiro`: `radial-gradient(600px circle at var(--x) var(--y), rgba(232,68,46,.18), transparent 60%)`, montado por `useMotionTemplate`, como no Seven.
- `veu-hero`: `linear-gradient(180deg, rgba(5,7,10,.60) 0%, rgba(5,7,10,.20) 38%, rgba(5,7,10,.88) 100%)` + `linear-gradient(90deg, rgba(5,7,10,.75) 0%, rgba(5,7,10,0) 60%)`.
- `mundo-azul`: `radial-gradient(80% 70% at 70% 40%, #164A73 0%, #0E3452 45%, #081A2B 100%)`.
- `mundo-vermelho`: `radial-gradient(70% 60% at 50% 110%, #BE1E29 0%, #5A0B10 45%, #05070A 100%)`.
- Grão: o `.grain::after` do Seven, **sem animação** (opacidade 0.045). Animação infinita só nos marquees.

Raios: `r-sm 10px`, `r-md 18px`, `r-lg 28px`, `r-janela 40px` (topo das seções que sobem). O formato da gota é `border-radius: 50% 0 50% 50%`: canto superior direito reto, como no símbolo.

### 3.2 Tipografia (Fontsource, 2 famílias)

| Família | Pacote | Uso |
|---|---|---|
| **Archivo Variable** (wght 100–900, **wdth 62–125**) | `@fontsource-variable/archivo` (o woff2 latino `wdth` é copiado para `public/fonts/` e declarado à mão, ver abaixo; não importar também o `wdth.css`) | Títulos condensados enormes (wdth 62–75) e também o texto corrido (wdth 100). É uma família só |
| **JetBrains Mono Variable** (wght 100–800) | `@fontsource-variable/jetbrains-mono` | Rótulos técnicos: "03 — SERVIÇOS", "NBR 12962", anos, "Nº da Ordem", contadores de etapa |

Nada de Inter nesta direção, porque a régua permite no máximo 2 famílias. O parágrafo é Archivo com wdth 100, que não é condensada.

Escala (Tailwind `fontSize` com `clamp`):

| Token | Tamanho | Largura / peso / entrelinha | Uso |
|---|---|---|---|
| `display-xxl` | `clamp(3.25rem, 10.5vw, 10.5rem)` | wdth 62 · wght 850 · lh 0.86 · tracking -0.01em · CAIXA ALTA | H1 da home, anos da linha do tempo, número-título |
| `display-xl` | `clamp(2.75rem, 7vw, 8rem)` | wdth 66 · wght 800 · lh 0.9 · CAIXA ALTA | H2 de seção, letreiros |
| `display-l` | `clamp(2rem, 3.6vw, 3.5rem)` | wdth 75 · wght 750 · lh 0.95 | H3 de cartão, números secundários |
| `titulo` | `clamp(1.375rem, 1.8vw, 1.75rem)` | wdth 100 · wght 600 · lh 1.2 | Títulos de item |
| `corpo-l` | `clamp(1.125rem, 1.3vw, 1.3125rem)` | wdth 100 · wght 400 · lh 1.55 | Subtítulos, lead |
| `corpo` | `1rem` no celular / `1.0625rem` (17 px) a partir de 1024 px | wdth 100 · wght 400 · lh 1.65 | Todo parágrafo (régua: 16 px e 17 px no mínimo) |
| `rotulo` | `0.8125rem` (13 px) | JetBrains Mono · wght 500 · tracking 0.16em · CAIXA ALTA | Rótulos. Nunca menos de 13 px, porque o QA marca texto com mais de 20 caracteres abaixo disso |

Utilitários herdados do Seven: `.stretch-cond` (font-stretch 78%) e novos `.stretch-62` e `.stretch-66`, além de `.tnum`, `.text-outline` (`-webkit-text-stroke: 1px rgba(243,239,233,.35); color: transparent`), `.text-balance` e `.text-pretty`.

**Fontes (P0):**
- **Arquivo e preload:** copiar o woff2 latino de largura variável (`node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2`, conferir o nome exato em `files/`) para `public/fonts/`. Declarar o `@font-face` manualmente e fazer `<link rel="preload" as="font" type="font/woff2" crossorigin href="%BASE_URL%fonts/...">`.
- **Português:** o subset latino cobre ã, ç, é e ô.
- **Mono:** carrega pelo import normal, sem preload.

### 3.3 Grade e espaço
- **Desktop (a partir de 1024 px):** 12 colunas, gutter de 24 px e margem lateral de 48 px (64 px a partir de 1280). Conteúdo com no máximo 1440 px, letreiros sangrando.
- **Tablet (768 a 1023 px):** 8 colunas e margem de 32 px.
- **Celular (abaixo de 768 px):** 4 colunas, margem de 20 px e gutter de 16 px.
- **Ritmo vertical das seções:** 160 px no desktop e 96 px no celular. Entre rótulo e título 20 px; entre título e texto 32 px.
- **Camadas (z-index):** preloader 90, cortina 80, menu 70, grão 60, cookies 55, nav 50, contato flutuante 45.

### 3.4 Ícones
Um conjunto só: **Lucide** (`lucide-react@^0.460.0`), com traço de 1.5 (1.25 nos ícones gigantes). A Lucide foi escolhida por ser de traço puro, o que permite desenhar cada ícone ao entrar (seção 5, `DrawIcon`). Os PNGs do site atual servem só de referência de metáfora (`conteudo-estruturado.md` 3.6). Os nomes abaixo podem variar entre versões da Lucide; conferir no pacote instalado.

| Item | Ícone Lucide |
|---|---|
| Instalação de Sistemas e Equipamentos | `Wrench` |
| Projetos Técnicos | `DraftingCompass` |
| Documentação e Regularização | `ClipboardCheck` |
| Inspeções e Manutenções Preventivas | `ListChecks` |
| Gestão e Manutenção de Equipamentos | `Settings2` |
| Gestão de Riscos e Consultoria | `ShieldAlert` |
| Venda de Equipamentos | `FireExtinguisher` |
| Sinalização de Segurança | `Signpost` |
| Atendimento Personalizado | `Headset` |
| Tecnologia da Informação Aplicada | `MonitorCog` |
| Tradição e Credibilidade | `ShieldCheck` |
| Estrutura Completa e Qualificada | `HardHat` |
| Pilares do app (01 a 04) | `Smartphone`, `LayoutDashboard`, `WifiOff`, `FileCheck2` |
| Recursos do app (8) | `LayoutDashboard`, `Smartphone`, `WifiOff`, `MailCheck`, `MessagesSquare`, `Activity`, `BadgeCheck`, `CircleCheckBig` |
| Canais | `Phone`, `Mail`, `MapPin`, `Clock`, e o WhatsApp em SVG próprio (glifo oficial), `Instagram`, `Linkedin` |
| Interface | `ArrowUpRight`, `ArrowRight`, `ArrowUp`, `Menu`, `X`, `Download`, `Play`, `Check` |

### 3.5 Logo
- **Símbolo:** vetorizar à mão em `src/components/Symbol.tsx`. São 4 paths de cantoneira e 1 de gota, com `viewBox="0 0 706 712"` medido em `SIMBOLO.png`. A gota ocupa x 173–527 e y 172–537, com o canto superior direito reto.
  - Sobre fundo escuro, as cantoneiras ficam assim: superior esquerda, inferior esquerda e inferior direita em `papel-50`, superior direita em `brasa-400`, e a gota em `brasa-400`.
  - É a adaptação negativa do símbolo, coerente com o logo branco da splash do app (`App_1.png`).
  - Cada parte é um `motion.path` separado, para animar.
- **Wordmark "PROTECIN":** `Ativo-1.png` usado como `mask-image` num `div` com `background: #F3EFE9`, o que dá o wordmark branco e nítido sem vetorizar a letra. Exportar uma versão com 1200 px de largura para a máscara (cerca de 12 KB).
- **[confirmar com a Protecin]:** pedir os arquivos oficiais (SVG e versão negativa) antes da produção.

---

## 4. Motion: vocabulário global

### 4.1 Easings, molas e tempos (`src/components/motion.tsx`)

```ts
export const EASE_OUT    = [0.16, 1, 0.3, 1] as const;   // entradas (herdado do Seven)
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;  // cortinas, máscaras, traços
export const EASE_IN     = [0.7, 0, 0.84, 0] as const;   // saídas
export const EASE_BACK   = [0.34, 1.56, 0.64, 1] as const; // carimbo, pop
export const MOLA_ROLAGEM = { stiffness: 140, damping: 30, mass: 0.35 }; // trilhos horizontais
export const MOLA_IMA     = { stiffness: 220, damping: 16, mass: 0.4 };  // Magnetic (Seven)
export const MOLA_PILULA  = { stiffness: 380, damping: 30 };             // layoutId, reels por estado
export const MOLA_MIRA    = { stiffness: 300, damping: 28, mass: 0.5 };  // cursor "mira" (P2)
export const T = { micro: 0.2, curta: 0.35, base: 0.6, longa: 0.8, max: 0.9 }; // segundos
export const STAGGER = { linha: 0.08, palavra: 0.04, item: 0.06, grade: 0.05 };
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
```

Em CSS, os mesmos valores viram `--ease-out`, `--ease-in-out`, `--ease-in` e `--ease-back`, e `--t-micro`/`--t-curta`/`--t-base`/`--t-longa`.

### 4.2 Presets de entrada (nomes usados nas tabelas das seções)

| Preset | O que faz | Duração / easing | Implementação |
|---|---|---|---|
| `sobe` | opacidade 0 → 1, y 28 px → 0 | 600 ms, EASE_OUT | `Reveal` do Seven (y 28) |
| `linha` | cada linha numa máscara, y 110% → 0 e rotate 3° → 0 | 800 ms, EASE_OUT, stagger 80 ms | `SplitLines` (novo): quebra por `\n` explícito do `site.ts` |
| `palavra` | por palavra, y 110% → 0 e rotate 4° → 0 | 700 ms, EASE_OUT, stagger 40 ms | `SplitWords` do Seven |
| `acende` | palavras com opacidade 0.18 → 1 conforme a rolagem | ligado à rolagem | `ScrollLitText` do Seven (início em 0.18, não 0.14) |
| `cortina` | imagem abre de baixo, `clip-path: inset(100% 0 0 0 round 28px)` → `inset(0 round 28px)`, com a `img` de dentro em scale 1.25 → 1 | 900 ms, EASE_IN_OUT (a máscara) e EASE_OUT (a escala) | `ClipReveal` do Seven. É uma vez só, nunca ligado à rolagem |
| `traco` | traço SVG com `stroke-dashoffset` 1 → 0 (`pathLength=1`) | 700 ms, EASE_IN_OUT, stagger 80 ms por path | `DrawIcon` / `DrawPath` |
| `regua` | linha fina com scaleX 0 → 1 a partir da esquerda | 900 ms, EASE_OUT | `Rule` |
| `virada` | rotateX 70° → 0 + opacidade, perspective 900 | 600 ms, EASE_OUT, stagger 50 ms | logos e cartões de grade |
| `monta` | sai de uma posição espalhada (x ±60 px, y +80 px, rotate ±6°, determinístico por índice) até o lugar, com opacidade | 650 ms, EASE_OUT, stagger 50 ms | chips e ladrilhos |
| `carimbo` | scale 1.35 → 1, rotate -8° → 0, opacidade 0 → 1 | spring 420/22 (cerca de 350 ms) | selo NBR, "ok" do formulário |
| `odometro` | cada dígito rola numa coluna de 0 a 9 até o valor | 800 ms, EASE_OUT, stagger 40 ms da direita para a esquerda | `Odometer` (seção 5) |
| `fade` | só opacidade 0 → 1 | 400 ms (200 ms no modo reduzido) | fallback geral |

Regras que valem para todos os presets:
- O gatilho é `VIEWPORT`: uma vez, quando o elemento entra 12% na tela.
- Numa cascata, o primeiro item começa em até 100 ms e o último em até 600 ms depois do gatilho. Nada principal fica mais de 1 s escondido.
- Todo wrapper de motion recebe `data-motion="<preset>"`. A meta de cobertura no verify é de pelo menos 95% dos elementos com texto ou mídia sob um `data-motion`.
- Parallax de imagem e reveal nunca ficam no mesmo elemento (armadilha 14). O reveal vai no wrapper e o parallax no `img` ou `picture` interno.
- Contêiner de animação ligada à rolagem usa `overflow: clip`, nunca `hidden` (armadilha 12).

### 4.3 Microinterações globais

| Elemento | Hover (mouse) | Toque / foco | Tempo |
|---|---|---|---|
| **Botão primário** (pílula `brasa-500`, texto branco 16 px wght 600, altura 52 px; no celular 48 px) | `Magnetic` com força 0.25 (MOLA_IMA). Fundo `brasa-600` varre da esquerda (scaleX 0 → 1). O rótulo rola: a cópia de cima sobe y 0 → -100% e a de baixo vem de 100% → 0, com stagger de 12 ms por letra. O `ArrowUpRight` sai pela diagonal (x 0 → 14, y 0 → -14) e outro entra (-14, 14 → 0) | `whileTap` scale 0.96. Foco: anel de 2 px `brasa-300` com offset de 3 px | 350 ms, EASE_OUT |
| **Botão fantasma** (borda 1 px papel-50/30, texto papel-50) | A borda vai a papel-50/90 e o fundo papel-50/6 varre da esquerda. O rótulo rola como no primário | Igual ao primário | 350 ms |
| **Botão WhatsApp** (fantasma com ponto `whatsapp` de 8 px antes do rótulo) | Igual ao fantasma, e o ponto pulsa uma vez (scale 1 → 1.6 → 1) | Igual | 350 ms |
| **Link de texto** | Sublinhado de 1 px com scaleX 0 → 1 a partir da esquerda e o ícone x 0 → 4 | Sublinhado sempre visível no celular | 200 ms |
| **Cartão** | y 0 → -4 e borda `noite-600` → `brasa-400`/60. O ícone de dentro se redesenha (`traco`) | Sem hover no toque; `whileTap` scale 0.98 | 350 ms |
| **Imagem dentro de cartão** | scale 1.04 → 1.08 | — | 800 ms, EASE_OUT |
| **Campo de formulário** | — | No foco, a linha inferior `brasa-400` faz scaleX 0 → 1 e o rótulo flutuante sobe (y 0 → -22 px, scale 1 → 0.8) | 200 ms |
| **Chip selecionável** | Borda clareia | `whileTap` scale 0.94. Selecionado: fundo `brasa-500` com `layout` e ícone `Check` que se desenha | 200–350 ms |

---

## 5. Componentes e primitivas

Arquivos (P0, exceto onde indicado):

```
src/lib/smooth-scroll.ts      Lenis do Seven + não inicia no modo reduzido + scrollTo(0,{immediate}) na troca de rota
src/lib/router.tsx            RouterProvider, usePath, Link, navigate (com cortina), routeUrl
src/lib/motion-pref.ts        useMotionPref(): "full" | "reduced"; setMotionPref(); lê a classe que o <head> já pôs
src/lib/media.ts              useIsDesktop (Seven), useCanPlayVideo (saveData / 2g / 3g), useInViewport
src/components/motion.tsx     Seven inteiro + SplitLines, DrawIcon, DrawPath, Rule, DropWindow, SectionRise,
                              PinStage, Reel, Odometer, TiltCard, CursorPreview, TextRoll, WipeText
src/components/Embers.tsx     Seven + repulsão pelo ponteiro (P1) + pausa fora da tela + desligado no reduzido
src/components/Symbol.tsx     símbolo vetorizado com 5 partes animáveis
src/components/Logo.tsx       Symbol + wordmark por máscara
src/components/chrome.tsx     Preloader, ScrollFuse, Nav, Menu, PageCurtain, FloatingContact, CookieNotice,
                              MotionToggle, MotionToast, CursorMira (P2)
src/components/cta.tsx        WhatsAppLink, PhoneLink, EmailLink, PrimaryCta, GhostCta, WhatsAppCta, Link interno
src/components/LazyVideo.tsx  vídeo com src só perto da tela, pausa fora, poster, fallback
src/components/PhoneMock.tsx  moldura de celular em HTML/CSS + telas recriadas (splash, ordens, offline, relatório)
src/components/OrcamentoForm.tsx  formulário de 3 etapas (seção 7.2)
src/sections/home/*.tsx       H0..H10
src/sections/shared/*.tsx     PageHero, Timeline, Platform, NaPratica, Setores, Parceiros, KidsOng, CtaFaixa, Footer
src/pages/*.tsx               Home, Institucional, Servicos, Clientes, Catalogo, App, Contato, NotFound
src/data/site.ts              TODO o conteúdo (seção 9)
```

### 5.1 `DropWindow`: a janela em forma de gota (assinatura, P0)
Faz a tela inteira encolher até virar a gota (modo `fechar`) ou a gota crescer até cobrir a tela (modo `abrir`), **só com `transform`**.
- **Fechar:** a gota tem tamanho final `D` e começa com scale `S0`, que a faz cobrir a tela. A mídia de dentro tem `scale = 1/s`, então o enquadramento do vídeo fica parado enquanto a janela encolhe.
- **Abrir:** é o mesmo componente com o intervalo invertido (`[S0, 1]` vira `[1, S0]`) ou com `from` pequeno.

```tsx
// D = lado da gota em px; S0 cobre a tela quando o círculo inscrito (raio s·D/2) passa a diagonal.
export function DropWindow({ progress, range = [0.08, 0.55], mode = "fechar", from = 0.45, className, children }: {...}) {
  const ref = useRef<HTMLDivElement>(null);
  const [s0, setS0] = useState(8);                       // SSR: 8 cobre telas de 320 a 2560 px
  useEffect(() => {
    const medir = () => { const d = ref.current?.offsetWidth ?? 1; setS0((Math.hypot(innerWidth, innerHeight) / d) * 1.04); };
    medir(); addEventListener("resize", medir); return () => removeEventListener("resize", medir);
  }, []);
  const out = mode === "fechar" ? [s0, 1] : [from, s0];  // abrir: começa como gota de from·D (PageHero usa from=1)
  const s = useTransform(progress, range, out, { ease: cubicBezier(0.65, 0, 0.35, 1) });
  const inv = useTransform(s, (v) => 1 / v);
  // Centralizar com x/y do próprio framer: as classes -translate-* do Tailwind 3 escrevem `transform`
  // e seriam sobrescritas pelo transform inline do framer.
  return (
    <motion.div ref={ref} data-motion="gota" style={{ scale: s, x: "-50%", y: "-50%" }}
      className={`absolute left-1/2 top-1/2 aspect-square overflow-clip rounded-[50%_0_50%_50%] will-change-transform ${className}`}>
      <motion.div style={{ scale: inv, x: "-50%", y: "-50%" }} className="absolute left-1/2 top-1/2 h-[100svh] w-[100vw]">
        {children}
      </motion.div>
    </motion.div>
  );
}
```

Regra geral: em todo elemento com `style` de transform do framer, centralizar ou deslocar com `x`/`y` do framer ou com a propriedade CSS `translate` (individual), nunca com as classes `translate-*` do Tailwind 3.

Tamanhos de `D`: no desktop `min(34vh, 26vw)` (306 px em 1440x900, com S0 de cerca de 5,8), no tablet `36vw` e no celular `40vw` (156 px em 390x844, com S0 de cerca de 6,2). O símbolo inteiro, com as cantoneiras, mede `2D`.

### 5.2 `SectionRise`: a seção seguinte sobe por cima (P0)
Wrapper da seção com `useScroll({ target, offset: ["start end", "start start"] })`.
- **A seção:** `scale 0.9 → 1`, `y 12vh → 0`, `transformOrigin: 50% 0%`, `border-radius` fixo de 40 px no topo.
- **Cantos arredondados:** o contêiner é 64 px mais largo que a tela (`w-[calc(100%+64px)] -mx-8`), então em scale 1 os cantos ficam fora da tela, recortados pelo `overflow-x: clip` do `body`. Isso dá o efeito de máscara sem animar `clip-path` nem `border-radius`.
- **Borda de luz:** no topo, uma linha de 1 px `linear-gradient(90deg, transparent, #E8442E, transparent)` que entra com o preset `regua`.

### 5.3 `PinStage`: cena fixada (P0)
`<section style={{height: H}}>` com um filho `sticky top-0 h-[100svh] overflow-clip`, que expõe `progress` (0 a 1, `offset ["start start","end end"]`).
- **Modo reduzido:** a classe `.pin--estatico`, sob `html.reduced`, aplica `height:auto` na seção, `position:relative` e `height:auto` no palco, e `transform:none!important` nas camadas marcadas com `data-pin-layer`. Cada seção fixada define o próprio layout estático (seção 8).
- **Visibilidade dentro da cena:** um elemento pode entrar e sair por opacidade (o H1 do hero, por exemplo), mas cada elemento com texto ou mídia tem que ficar totalmente visível em algum trecho da cena.
- **Etapas de conteúdo:** pilares, pontos e painéis nunca vão a opacidade 0. Saem por translação dentro do recorte (com `Reel`) ou ficam com opacidade mínima de 0.4. Quem volta a rolagem, ou o verify, sempre encontra o texto. O palco leva `data-pin-stage` para o verify (14.2).

### 5.4 `Reel`: trilho de estados
Coluna (ou linha) de N itens de tamanho fixo, dentro de uma janela `overflow-clip`.
- **Por estado:** `y = -index * (100/N)%` com a MOLA_PILULA.
- **Contínuo:** `useTransform(progress, [0,1], ["0%", `-${(N-1)*100/N}%`])`.
- **Uso:** parágrafos dos pilares, número ativo, telas do celular e anos.

### 5.5 `Odometer`: número que rola (P0)
- **Dígitos:** cada dígito é uma coluna `inline-block w-[0.62em] text-center overflow-clip h-[1em]` com os 10 algarismos empilhados e `y = -d * 10%`. A largura fixa independe de `tnum`.
- **Fixos:** separadores ("."), sufixos ("+", "M+") e prefixos são estáticos. O sufixo fica em `brasa-400`.
- **Prerender:** o HTML sai com o valor final, como o `Counter` do Seven.
- **Hidratação:** no `useEffect`, se o elemento ainda não está na tela, as colunas vão para 0 sem animação. Ao entrar na tela, rolam até o valor (preset `odometro`). Se já estava visível na hidratação, não anima, para evitar o pulo de valor final para 0.

### 5.6 `DrawIcon` / `DrawPath`
- **`DrawIcon`:** envolve um ícone Lucide. No `useLayoutEffect`, põe `pathLength="1"` em todo `path`, `line`, `circle`, `rect`, `polyline`, `polygon` e `ellipse`, e então marca `data-ready`.
- **CSS:** `.draw[data-ready] :is(path,line,circle,rect,polyline,polygon,ellipse){stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 700ms var(--ease-in-out) calc(var(--i,0)*80ms)}` e `.draw[data-ready].drawn :is(...){stroke-dashoffset:0}`.
- **Sem JS:** sem `data-ready` o ícone aparece inteiro.
- **`DrawPath`:** é o mesmo com `motion.path` e `pathLength` ligado a um `MotionValue` (traço guiado pela rolagem).

### 5.7 Outras
- **`SplitLines`:** recebe as linhas prontas (arrays no `site.ts`, por breakpoint: `linhas.desktop`, `linhas.celular`) e renderiza `<span class="block overflow-clip pb-[0.06em]"><span style="--i:n">…</span></span>`. Tem `aria-label` com o texto completo. Com a prop `css`, usa a animação CSS do hero (seção 6.1) em vez de framer.
- **`TextRoll`:** rótulo duplicado para o hover dos botões e links do menu.
- **`WipeText`:** texto em contorno com uma cópia preenchida num contêiner `overflow-clip`, onde o contêiner vai de x -100% → 0 e o texto de dentro de x 100% → 0. É uma limpeza da esquerda para a direita só com `transform`, ligada à rolagem.
- **`TiltCard`:** do Seven, `perspective 900`, rotateX e rotateY de ±8° por spring a partir do ponteiro. Só no mouse.
- **`CursorPreview`:** do Seven, imagem que segue o cursor sobre uma lista (318x220, spring 160/22), entrando com scale 0.6 → 1 e rotate -4° → 0 em 350 ms.
- **`VelocityMarquee`:** do Seven, com pausa no hover (`baseVelocity` vai a 0 por spring) e fora da tela (IntersectionObserver).
- **`Embers`:** do Seven.
  - **Repulsão (P1):** só com `pointer: fine`, a partícula a menos de 120 px do ponteiro ganha `v += normalizar(e - p) * 0.6 * (1 - d/120)`.
  - **Uma cena por vez:** no máximo um canvas anima por vez, porque os outros pausam pelo IntersectionObserver.

---

## 6. Elementos globais

### 6.1 Seguro no `<head>` e preferência de movimento (P0)
Script síncrono, antes de qualquer CSS:

```html
<script>
(function () {
  var h = document.documentElement, pref = null;
  try { pref = localStorage.getItem("pt-motion"); } catch (e) {}
  var m = /[?&]motion=(full|reduced)/.exec(location.search); if (m) pref = m[1];
  var sys = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var reduced = pref ? pref === "reduced" : sys;
  h.classList.add(reduced ? "reduced" : "motion");
  if (sys && !pref) h.classList.add("reduced-sys");
  var intro = false;
  try { intro = !sessionStorage.getItem("pt-intro"); sessionStorage.setItem("pt-intro", "1"); } catch (e) {}
  if (intro && !reduced) h.classList.add("intro");
  setTimeout(function () { if (!h.classList.contains("motion-up")) h.classList.add("motion-failed"); }, 4000);
})();
</script>
```

- O `noscript` e o CSS `motion-failed` saem do item 21 de `padroes-codigo.md`: `[style*="opacity:0"]`, `[style*="clip-path"]` e o preloader ficam visíveis.
- O `App.tsx` adiciona `motion-up` depois de hidratar.
- O `MotionConfig` recebe `reducedMotion={pref === "reduced" ? "always" : "never"}`.

### 6.2 Preloader (P1, só na primeira entrada da sessão, 900 ms no total)
Renderizado sempre pelo SSR, mas só aparece sob `html.intro`. A animação é **100% CSS**, para não depender do JS: se o bundle demorar no 4G, o preloader sai mesmo assim.

| Elemento | Coreografia | Tempo |
|---|---|---|
| Fundo `noite-950` em tela cheia | Fixo até 600 ms, depois `translateY 0 → -100%` | Saída em 300 ms, EASE_IN_OUT, de 600 a 900 ms |
| Cantoneiras do símbolo (120 px) | Partem 28 px para fora de cada canto, com opacidade 0, e fecham até o lugar | 0–350 ms, EASE_OUT |
| Gota | scale 0 → 1, a partir do centro | 200–550 ms, EASE_BACK |
| Contador mono "1976" → "2026" (rotulo, 15 px, papel-300) | `@property --ano { syntax: '<integer>' }`, `animation: ano 600ms steps(50) forwards` e `content: counter(ano)` | 0–600 ms. Sem suporte a `@property`, mostra "1976 · 2026" fixo |
| Linha fina sob o contador | scaleX 0 → 1 | 0–600 ms, linear |

O JS só remove o nó depois de `animationend` e chama `lockScroll(false)`. A rolagem só fica travada se o JS já estiver ativo antes dos 900 ms. Com `html.reduced` ou sem `intro`, nada aparece.

### 6.3 Nav (P0)
- **Desktop (76 px):** à esquerda o `Logo` (símbolo de 32 px + wordmark de 132 px). No centro, os links Institucional · Serviços · Nossos Clientes · Nosso App · Catálogo · Contato (corpo 15 px wght 500). À direita, o `PrimaryCta` "Solicitar orçamento" (altura 44) e um botão redondo de 44 px com o WhatsApp.
- **Celular (64 px):** logo à esquerda; à direita, a pílula "Orçamento" (altura 44) e o botão Menu (44x44).
- **Estados:** transparente no topo; acima de 40 px, fundo `noite-950/92` com linha inferior de 1 px `noite-700` (sem blur). Esconde ao descer depois de 420 px (`y 0 → -120%`, 500 ms, EASE_OUT) e volta ao subir (padrão do Seven).
- **Entrada:** `y -100% → 0`, 500 ms, a partir de `--t0 + 200 ms`. Os links entram com `sobe` e stagger de 40 ms.
- **Hover dos links:** `TextRoll`. Na rota ativa, um ponto `brasa-400` de 6 px sob o link, com `layoutId="nav-ativo"` (MOLA_PILULA).
- **CTA:** na home, "Solicitar orçamento" aponta para `#orcamento`; nas outras rotas, para `/contato/`. Os dois disparam `form_open {form_location:"nav"}`. O WhatsApp é `WhatsAppLink location="nav"`.
- **`ScrollFuse` (P1):** a barra de progresso é um "pavio" de 2 px `brasa-500` no topo (`scaleX = progress`, spring 120/24/0.3). Na ponta, uma brasa: círculo de 6 px `brasa-200` com `box-shadow: 0 0 12px 4px rgba(232,68,46,.7)`, posicionado com `x`.

### 6.4 Cortina de troca de página (P0)
Clique num `Link` interno:
1. Painel `brasa-500` em tela cheia, `translateY 100% → 0` (450 ms, EASE_IN_OUT). Em cima dele, o `Symbol` de 96 px em `papel-50` fecha as cantoneiras (200 ms, de 250 a 450 ms).
2. Em 450 ms troca a rota, chama `lenis.scrollTo(0,{immediate:true})` e `lenis.resize()` e dispara `virtual_page_view`.
3. O painel sai em `translateY 0 → -100%` (550 ms, EASE_OUT) e o hero da nova página começa a entrar em 250 ms.
4. Se a URL tem hash, o `scrollToHash` roda depois da saída.

Total de cerca de 1 s, com conteúdo coberto por menos de 600 ms. No modo reduzido, vira um fade de `noite-950` em 200 ms. O Esc e o botão voltar do navegador funcionam igual.

### 6.5 Menu em tela cheia (P0)
- **Abrir:** `clipPath: circle(0% at calc(100% - 44px) 32px) → circle(150% …)`, 600 ms, EASE_IN_OUT, com `lockScroll(true)` e `data-lenis-prevent`.
- **Itens:** 01 a 07 (Início, Institucional, Serviços, Nossos Clientes, Nosso App, Catálogo Digital, Contato) em `display-xl` (wdth 66). Entram com `linha` e stagger de 60 ms a partir de 200 ms. O número em mono fica à esquerda.
- **Fundo que troca (desktop):** à direita, uma imagem em forma de gota (D = 32vw) troca com crossfade de 400 ms no hover de cada item:
  - Início: `hero-poster`
  - Institucional: `institucional-pilar`
  - Serviços: `servico-instalacao`
  - Nossos Clientes: `clientes-aperto`
  - Nosso App: `app-webmaster-notebook`
  - Catálogo: `catalogo-capa`
  - Contato: `obra-parede-sistemas`

  Nenhuma dessas imagens fica com opacidade 0: as inativas ficam empilhadas atrás e só a de cima muda.
- **Rodapé do menu:** `WhatsAppLink location="menu"`, `PhoneLink location="menu"`, e-mail e o `MotionToggle`.
- **Fechar:** botão X (44 px, gira 90° no hover), Esc, toque na área vazia ou clique num link. O foco fica preso no menu e volta ao botão ao fechar.

### 6.6 Contato flutuante (P0)
- **Celular:** barra inferior com 3 botões iguais (altura 56 + `env(safe-area-inset-bottom)`):
  - WhatsApp, com o ponto verde (`location="barra_mobile"`)
  - Ligar (`PhoneLink`)
  - Orçamento (`brasa-500`, leva a `#orcamento` ou `/contato/`)

  Entra depois de 640 px de rolagem (`y 100% → 0`, 350 ms). Some quando o formulário ou o rodapé estão na tela e quando um campo tem foco.
- **Desktop:** botão redondo de 56 px com o glifo do WhatsApp. Entra com spring (scale 0 → 1, rotate -90° → 0) e um anel pulsa **3 vezes** antes de parar. No hover abre o rótulo "Falar no WhatsApp" (`max-w-0 → 180px`, 350 ms). Usa `location="botao_flutuante"`.

### 6.7 Avisos
- **`CookieNotice` (P1):** só no cliente, depois de 2,5 s; cartão no canto inferior esquerdo (no celular, acima da barra), `sobe` em 350 ms. Texto: "Usamos cookies de medição para melhorar o site. Saiba mais na Política de Privacidade." Botão "Entendi" grava `pt-cookies-ok`. **[confirmar com a Protecin]:** o texto de `public/politica-de-privacidade.html`.
- **`MotionToast` (P1):** só com `html.reduced-sys`, depois de 1,5 s, uma vez por sessão. Texto: "Seu sistema pediu menos animação. Este site foi feito para ser visto em movimento." Botão "Ativar movimento" grava `pt-motion=full` e recarrega. Botão secundário "Manter reduzido".
  - **Por que existe:** muitos PCs com Windows vêm com "efeitos de animação" desligado (armadilha 1 do Seven), e a proposta não pode chegar estática ao cliente.
  - **Para a apresentação:** usar o link com `?motion=full`.
- **`CursorMira` (P2, só com `pointer: fine` e sem reduzido):** quatro mini cantoneiras de 6 px (o símbolo) num quadrado de 28 px seguem o ponteiro com a MOLA_MIRA e opacidade 0.7. Sobre `[data-cursor="cta"]`, abrem até envolver o botão (o retângulo é lido uma vez, no `pointerenter`, 250 ms). O cursor nativo continua visível.

---

## 7. Home `/`: seção por seção

Convenções das tabelas:
- **Entrada:** o que acontece quando o elemento entra na tela.
- **Rolagem:** o que fica ligado à rolagem (`p` é o progresso da cena, de 0 a 1).
- **Hover/toque:** a interação.

Se o tempo não está escrito, vale o do preset.

### H0. Abertura + Símbolo (`#topo`, P0)

**Estrutura:** `PinStage` com altura de **260vh** no desktop e **220vh** no celular. O palco tem três camadas: (1) vídeo e poster dentro do `DropWindow` no modo `fechar`, (2) `Embers` e véu, (3) textos. Ainda dentro do palco, ficam o grupo do símbolo (cantoneiras) e o manifesto.

**Layout desktop (1440x900):**
- **Começo:** vídeo em tela cheia. O texto fica alinhado à esquerda na coluna 1–8, com o topo a 18vh (assim o bloco termina em cerca de 840 px numa tela de 900).
  - Rótulo mono: "ENGENHARIA E PROTEÇÃO TÉCNICA CONTRA INCÊNDIO · DESDE 1976"
  - H1 `display-xxl` em 3 linhas: "PROTEGENDO VIDAS / E PATRIMÔNIOS / HÁ **50** ANOS", com "50" em `brasa-400`
  - Parágrafo `corpo-l`, com no máximo 46ch
  - CTAs em linha
- **Canto inferior esquerdo:** indicador de rolagem, uma linha vertical de 48 px com um ponto que desce (3 ciclos de 1,8 s e para) e o rótulo "ROLE".
- **Canto inferior direito:** selo circular de 120 px com o texto "50 ANOS · 1976–2026 ·" em volta e o símbolo no centro. O texto gira com a rolagem (`rotate = scrollY * 0.08`), sem animação infinita.
- **Fim da cena:** o símbolo (2D = 612 px) fica centrado em x 30%, e o manifesto fica nas colunas 7–12, centrado na vertical.

**Layout celular (390x844):** o texto começa a 12svh. Vêm o rótulo, o H1 em 4 linhas ("PROTEGENDO / VIDAS E / PATRIMÔNIOS / HÁ **50** ANOS", cerca de 52 px), o parágrafo em `corpo` (16 px) e os dois CTAs em coluna, de largura total. A soma dá cerca de 760 px, então o primeiro CTA fica acima da dobra. O selo circular fica fora no celular. No fim da cena, o símbolo (2D = 312 px) fica no topo, a 14svh, e o manifesto embaixo.

**Conteúdo exato:**
- Rótulo: `ENGENHARIA E PROTEÇÃO TÉCNICA CONTRA INCÊNDIO · DESDE 1976`
- H1: `Protegendo vidas e patrimônios há 50 anos`
- Parágrafo: "Referência em engenharia e proteção técnica contra incêndio, a Protecin oferece soluções em inspeção e manutenção de equipamentos com foco em segurança, conformidade e atendimento sob medida."
- CTA 1: `PrimaryCta` "Solicitar orçamento" → `#orcamento` (`form_open {form_location:"hero"}`)
- CTA 2: `WhatsAppCta` "Falar no WhatsApp" (`location="hero"`, mensagem padrão)
- Link 3 (só desktop): `PhoneLink` "+55 11 4977-8720" (`location="hero"`)
- Manifesto (fim da cena), H2 com `acende`: "Protegemos seu maior patrimônio: a vida." ("a vida." em `brasa-400`)
- Texto de apoio: "Desde 1976, a Protecin oferece soluções técnicas em prevenção e combate a incêndios, protegendo vidas e patrimônios com tecnologia, equipe especializada e estrutura sólida."
- Rótulo final: `SANTO ANDRÉ/SP · DESDE 1976`

**Mídia:**
- **Poster:** `hero-poster.avif`/`.webp`, o poster do Pexels 34775810 baixado em w=1920 (desktop) e w=828 (celular). É o **elemento de LCP** (`<img fetchpriority="high">` + `<link rel="preload" as="image" imagesrcset>`).
- **Vídeo:** `hero-supressao-720.mp4`, entra por cima do poster com opacidade 0 → 1 (600 ms) no `canplay`.
- **Fallback:** se não houver vídeo (`saveData`, 2g/3g ou modo reduzido), o poster faz um zoom único de scale 1.08 → 1 em 900 ms e fica parado.

**Entrada** (CSS no primeiro quadro; `--t0` vale 600 ms com `html.intro` e 80 ms sem):

| Elemento | Entrada | Tempo |
|---|---|---|
| Poster | scale 1.08 → 1 | 900 ms, EASE_OUT, em `--t0` |
| Véu + luz do ponteiro | opacidade 0 → 1 | 600 ms em `--t0` |
| Rótulo mono | `sobe` com y 12 px | 400 ms em `--t0` |
| H1, linhas 1 a 3 | `linha` (CSS keyframe `from{transform:translate3d(0,110%,0) rotate(3deg)}`, `fill-mode: backwards`) | 800 ms, EASE_OUT, em `--t0 + 80/160/240 ms` |
| "50" | depois da linha, scale 0.9 → 1 e cor papel-50 → `brasa-400` | 350 ms em `--t0 + 700 ms` |
| Parágrafo | `sobe` | 600 ms em `--t0 + 300 ms` |
| CTA 1 e CTA 2 | `sobe` | 500 ms em `--t0 + 380/440 ms` |
| Indicador de rolagem e selo | `fade`; o selo também com rotate -30° → 0 | 400 ms em `--t0 + 600 ms` |
| Embers (densidade 60, ou 27 no celular) | canvas com opacidade 0 → 1 | 800 ms depois de montar (efeito de fundo, não é conteúdo) |
| Vídeo | opacidade 0 → 1 no `canplay` | 600 ms |

**Rolagem (p do PinStage):**

| Elemento | Comportamento |
|---|---|
| Rótulo, parágrafo e CTAs | opacidade 1 → 0 e y 0 → -6vh em p 0 → 0.15 |
| H1, linha i | y 0 → -14vh e opacidade 1 → 0 em p (0.02 + 0.02i) → (0.22 + 0.02i) |
| Indicador e selo | opacidade 1 → 0 em p 0 → 0.08 |
| `DropWindow` | scale S0 → 1 em p 0.08 → 0.55, EASE_IN_OUT: a tela encolhe até a gota. A mídia de dentro tem `1/s` e mais y 0 → -4% |
| Véu | opacidade 1 → 0.35 em p 0.1 → 0.5 |
| Cantoneiras (4) | partem de (±42vw, ±40vh) com rotate ±12° e chegam a (0,0) com rotate 0 em p 0.42 → 0.66, EASE_OUT. Opacidade 0 → 1 em p 0.42 → 0.5 |
| Grupo do símbolo (gota + cantoneiras) | desktop: x 0 → -20vw em p 0.6 → 0.8; celular: y 0 → -22svh |
| Manifesto H2 | `acende` em p 0.64 → 0.9 |
| Texto de apoio e rótulo final | opacidade 0 → 1 e y 20 → 0 em p 0.84 → 0.95 |
| Embers | `translateY` do canvas 0 → -8vh (parallax leve) |
| Luz do ponteiro (desktop) | segue o mouse (spring 60), só enquanto p < 0.5 |

**Hover/toque:** botões conforme 4.3. O selo circular, no hover, faz o símbolo do centro fechar as cantoneiras (200 ms).

**Vídeo:** toca enquanto o palco está na tela. Só pausa quando a seção sai (o que inclui a gota já formada).

### H1. Escala (`#numeros`, rótulo "01 — Escala", P0)

**Estrutura:** entra com `SectionRise` sobre o fim de H0. Fundo `noite-950` com `luz-brasa` no canto inferior esquerdo e `Embers` com densidade 40. Sem foto, para segurar o peso da página.

**Layout desktop:** à esquerda (colunas 1–7), o número-título "20.000+" em `display-xxl` a 18vw, com wdth 62. Abaixo dele, o rótulo `corpo-l` "clientes atendidos". À direita (colunas 8–12), 4 linhas separadas por régua, cada uma com o número (`display-l`) e o rótulo (corpo, papel-300).

**Layout celular:** "20.000+" a 30vw e, abaixo, as 4 linhas numa grade 2x2.

**Conteúdo exato:**
- H2 (é o próprio número, `aria-label="Mais de 20.000 clientes atendidos"`): "20.000+" e "clientes atendidos"
- "50": "anos de experiência (desde 1976)"
- "3M+": "equipamentos manutenidos"
- "5M+": "inspeções realizadas"
- "250+": "obras de médio e grande porte realizadas"

**Coreografia:**

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Rótulo "01 — Escala" | `sobe`; o ponto pulsa 3 vezes | — | — |
| "20.000+" | `odometro` (5 colunas; o "." e o "+" entram com `fade`) | y 6% → -6% (parallax pela seção) | — |
| "clientes atendidos" | `sobe` com atraso de 300 ms | — | — |
| Réguas entre as linhas | `regua`, stagger de 120 ms | — | — |
| Números 50, 3M+, 5M+ e 250+ | `odometro`, stagger de 120 ms entre linhas | — | Desktop: no hover da linha, o número vai a `brasa-400` e a linha desliza x 0 → 8 (200 ms) |
| Rótulos | `sobe`, stagger de 120 ms | — | — |
| `luz-brasa` | opacidade 0 → 1 (600 ms) | opacidade 0.4 → 0.9 e scale 0.8 → 1.1 pela seção | — |
| Embers | — | pausa fora da tela | — |

### H2. Credibilidade (`#autorizacoes`, rótulo "02 — Credibilidade", P0)

**Layout desktop:**
- **Topo:** à esquerda (colunas 1–6), o H2 `display-xl` em 3 linhas; à direita (colunas 8–12), o texto e os 3 selos empilhados.
- **Duas fitas de logos**, sangrando a largura toda:
  - Fita 1, "Autorizações oficiais" (Kidde, Everlux, Notifier e Simplex), corre para a esquerda.
  - Fita 2, "Marcas com que trabalhamos" (VESDA, Bosch, Firebee e Germek), corre para a direita.
  - Entre os logos, o rótulo mono "AUTORIZADA" ou "MARCA" em papel-500.
- **Fim:** o bloco "Filiações técnicas" tem 2 ladrilhos grandes (ABSpk e NFPA) lado a lado, com a legenda "Entidades do setor".

**Layout celular:** H2, texto e selos em coluna. As fitas continuam (altura 72 px). Os ladrilhos de filiação ficam 2 por linha.

**Conteúdo exato:**
- Sobretítulo: "Compromisso com a Segurança e a Excelência"
- H2: "Décadas de experiência / na prevenção e / combate a incêndios"
- Texto: "Desde 1976, a Protecin oferece soluções técnicas em prevenção e combate a incêndios, protegendo vidas e patrimônios com tecnologia, equipe especializada e estrutura sólida. Atuamos com responsabilidade e precisão na redução de riscos, e somos filiados às principais entidades do setor, reforçando nossa credibilidade e conformidade técnica."
- Selos (texto, sem número): "Equipe Técnica Qualificada" · "Alto Índice de Satisfação dos Clientes" · "Cobertura Técnica em Território Nacional"
- Rótulos das fitas: "Autorizações oficiais: Kidde Brasil, Everlux, Notifier e Simplex" (é o `aria-label` da fita, que fica `role="list"`) e "Marcas com que trabalhamos"

**Coreografia:**

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Sobretítulo | `sobe` | — | — |
| H2 | `linha` | — | — |
| Texto | `sobe`, 150 ms depois do H2 | — | — |
| Selos (3) | `monta`, stagger de 60 ms; o ícone `Check` de cada um faz `traco` | — | Ícone se redesenha |
| Fita 1 (`VelocityMarquee`, baseVelocity -1.2) | o conjunto entra com `fade`, cada logo com `virada` e stagger de 50 ms (só a primeira cópia) | a velocidade acelera e inverte com a rolagem (Seven) | Desktop: a fita para (spring); o logo sai do branco monocromático (`filter: brightness(0) invert(1)`, opacidade 0.72) e ganha cor original sobre um chip `papel-50` que cresce de baixo (scaleY 0 → 1, 350 ms) |
| Fita 2 (baseVelocity +1.2) | igual | igual | igual |
| Ladrilhos ABSpk e NFPA | `virada`, stagger de 100 ms | logo com parallax y 4% → -4% | Chip `papel-50` cresce e o logo fica colorido (350 ms) |
| Borda de luz no topo | `regua` | — | — |

Logos: `logo-*.webp` aparados (`sharp().trim()`), com 360 px de largura e 64 px de altura renderizada (56 px no celular). Para o Everlux sobre fundo escuro, usar `2.png` (versão branca).

### H3. Serviços (`#servicos`, rótulo "03 — Serviços", P0)

**Estrutura:**
- **Cabeçalho:** "rio" de texto, não fixado.
- **Cartões:** 8 cartões `position: sticky` que se empilham.
- **Final:** linha de CTA no fim da pilha.

**Layout desktop:**
- **Cabeçalho:** rótulo, H2 `display-xl` e, à direita, o subtítulo.
- **Cada cartão:** `sticky top: calc(96px + i * 14px)`, altura 78vh, fundo `noite-800`, raio de 28 px e borda de 1 px `noite-700`.
  - **Esquerda (colunas 1–5):**
    - Número mono "01 / 08"
    - Ícone de 40 px
    - H3 `display-l`
    - Resumo (corpo-l)
    - Descrição longa (corpo, papel-300)
    - Chips de itens (rotulo)
    - Dois CTAs
  - **Direita (colunas 6–12):** imagem com raio de 20 px.

**Layout celular:** os cartões continuam `sticky`, com `top: 72px + i * 8px` e altura mínima de 72svh. Imagem no topo (16:10), depois número, H3, resumo e os CTAs. A descrição longa e os chips ficam só no desktop; no celular, o link "Ver detalhes" leva a `/servicos/#slug`.

**Conteúdo exato:**
- Rótulo: "03 — Serviços"
- H2: "Engenharia, inspeção / e manutenção"
- Subtítulo: "em Sistemas de Prevenção e Combate a Incêndios. Da elaboração de projetos à gestão contínua dos equipamentos, oferecemos soluções completas para proteger pessoas, patrimônios e garantir a conformidade com normas técnicas e legais."

Os 8 cartões (resumo = versão de /servicos; descrição = versão da home; quando só existe um texto, ele é o resumo):

| # | H3 | Resumo | Descrição longa | Chips (texto real) | Mídia |
|---|---|---|---|---|---|
| 01 | Instalação de Sistemas e Equipamentos | "Soluções completas e personalizadas para implantação de sistemas fixos e equipamentos de combate a incêndio, com segurança, rastreabilidade e foco em alta performance." | "Implantação de sistemas fixos e equipamentos contra incêndio com tecnologia atualizada, equipe especializada e componentes certificados para diferentes tipos de edificações e necessidades operacionais." | Sistemas fixos · Componentes certificados · Rastreabilidade | `servico-instalacao` |
| 02 | Projetos Técnicos | "Elaboração de projetos legais e executivos com emissão de ART, seguindo rigorosamente os requisitos técnicos, normativos e legais." | "Desenvolvimento de projetos personalizados com ART, assessoria completa para obtenção e renovação do AVCB e suporte durante todo o processo de aprovação junto aos órgãos competentes." | ART · AVCB · Projetos legais e executivos | `servico-projetos` |
| 03 | Documentação e Regularização | "Assessoria técnica para emissão de laudos, licenças e renovação de AVCB, com total alinhamento às exigências legais e operacionais de cada cliente." | — | Laudos · Licenças · Renovação de AVCB | `servico-documentacao` |
| 04 | Inspeções e Manutenções Preventivas | "Serviços especializados e periódicos que garantem a eficiência, durabilidade e segurança dos sistemas, com controle informatizado e equipe técnica qualificada." | "Gerenciamento completo de equipamentos com inspeções periódicas, testes hidrostáticos, manutenção em campo, repintura, limpeza e adequação técnica conforme exigências da NBRs e legislação vigente." | Inspeções periódicas · Testes hidrostáticos · Manutenção em campo · Controle informatizado | `servico-inspecoes` |
| 05 | Gestão e Manutenção de Equipamentos | "Gerenciamento e manutenção de sistemas de combate a incêndio com tecnologia própria, processos certificados e rastreamento individual dos itens." | "Linha completa de extintores, mangueiras, hidrantes, portas corta-fogo, sistemas de alarme e supressão. Equipamentos homologados e manutenção certificada pelo INMETRO, com rastreabilidade e garantia." | Tecnologia própria · INMETRO · Rastreamento individual | `servico-gestao` |
| 06 | Gestão de Riscos e Consultoria | "Suporte técnico e estratégico para ambientes críticos, com foco na prevenção, planejamento e redução de riscos operacionais." | "Elaboração de laudos e programas por engenheiros das áreas Civil, Elétrica, Mecânica e de Segurança com intuito de identificar e minimizar os riscos de incêndio em edificações e instalações." | Engenharia Civil · Elétrica · Mecânica · de Segurança | `servico-riscos` |
| 07 | Venda de Equipamentos | "Comercialização de extintores, mangueiras, sinalizações, sistemas fixos de alta qualidade e demais equipamentos de combate a incêndio." | — | Extintores · Mangueiras · Sinalizações · Sistemas fixos | `servico-venda` (poster) + `extintor-fumaca-720.mp4` |
| 08 | Sinalização de Segurança | "Implementação de sinalizações fotoluminescentes, orientativas, de emergência e salvamento conforme normas." | "Integração com planos de gerenciamento de risco, auditorias e treinamentos personalizados." | Fotoluminescentes · Orientativas · Emergência e salvamento · Treinamentos | `servico-sinalizacao` |

CTAs de cada cartão:
- `WhatsAppCta` "Orçamento deste serviço" (`location="servicos"`, `detail=<slug>`, mensagem "Olá! Vim pelo site da Protecin e gostaria de um orçamento de {H3}.")
- Link "Detalhes" → `/servicos/#<slug>`

Linha final: "Precisa de mais de um serviço? Monte sua solicitação." + `PrimaryCta` "Solicitar orçamento" → `#orcamento`.

**Coreografia:**

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Rótulo, H2 e subtítulo | `sobe`, `linha` e `sobe` (+150 ms) | — | — |
| Cartão i (ao chegar ao topo) | y 80 → 0 e opacidade 0.6 → 1 ao entrar | Quando o cartão i+1 sobe por cima, o cartão i vai de scale 1 → 0.94 e o véu interno (`noite-950`) de opacidade 0 → 0.55, pelo progresso do cartão seguinte (`offset ["start end","start start"]`). O texto do cartão nunca fica com opacidade 0 | Cartão: borda `brasa-400`/60 (desktop) |
| Número "0i / 08" | `Odometer` de 2 dígitos quando o cartão fixa | — | — |
| Ícone | `traco` quando o cartão fixa | — | Redesenha no hover do cartão |
| H3 | `palavra` | — | — |
| Resumo e descrição | `sobe`, +100 e +200 ms | — | — |
| Chips | `monta`, stagger de 50 ms | — | — |
| Imagem | `cortina` (900 ms) | `img` interna com y -8% → 8% (CSS `animation-timeline: view()` dentro de `@supports`; sem suporte, fica parada) | scale 1.04 → 1.08 |
| Vídeo do cartão 07 | — | Toca só enquanto o cartão 07 é o de cima e está na tela; pausa nos outros casos | — |
| CTAs | `sobe`, stagger de 60 ms | — | 4.3 |

### H4. Na prática (`#na-pratica`, rótulo "04 — Na prática", P0)

**A cena:** a foto real `obra-parede-sistemas` (a partir de `4.jpg`) em tela cheia, e uma "câmera" que viaja por cinco pontos dela.

**Estrutura:** `PinStage` com **320vh** no desktop e **260vh** no celular.

**Layout desktop:**
- **Imagem:** cobre o palco, com o grade estático `filter: contrast(1.08) saturate(0.92)` e o véu `radial-gradient(transparent 40%, rgba(5,7,10,.85))`.
- **Canto superior esquerdo:** rótulo e H2.
- **Por ponto:** um marcador (anel de 44 px com o centro `brasa-400`), uma linha-guia SVG e um cartão de legenda (360 px, `noite-900/92`, borda `noite-700`) ancorado do lado oposto ao ponto.
- **Canto inferior direito:** um contador mono "01 / 05" (`Reel`).
- **Canto inferior esquerdo:** a legenda de origem.

**Layout celular:** a imagem cobre o palco (`object-position` ajustado por ponto) e o cartão de legenda vira uma folha inferior fixa no palco, com altura de cerca de 34svh e `Reel` dos 5 textos. Os marcadores continuam sobre a foto.

**Conteúdo exato:**
- Rótulo: "04 — Na prática"
- H2: "Uma parede. / Cinco frentes de serviço."
- Legenda de origem: "Foto do acervo Protecin. Extintor com etiqueta PROTECIN."
- Pontos (coordenadas em % da imagem de 2592x1944, medidas na foto):

| # | Ponto (x%, y%) | Título do cartão | Texto do cartão (real) |
|---|---|---|---|
| 1 | Placa SAÍDA (56,8; 41,3) | Sinalização de Segurança | "Implementação de sinalizações fotoluminescentes, orientativas, de emergência e salvamento conforme normas." |
| 2 | Extintor etiquetado (58,0; 59,3) | Inspeções e Manutenções Preventivas | "Inspeções periódicas, testes hidrostáticos, manutenção em campo, repintura, limpeza e adequação técnica conforme exigências da NBRs e legislação vigente." |
| 3 | Painel de alarme (30,3; 55,2) | Sistemas de alarme | "Implantação de sistemas fixos e equipamentos contra incêndio com tecnologia atualizada, equipe especializada e componentes certificados." |
| 4 | Abrigo de mangueira e hidrante (75,9; 74,0) | Hidrantes e mangueiras | "Equipamentos homologados e manutenção certificada pelo INMETRO, com rastreabilidade e garantia." |
| 5 | Tubulação vermelha (50,0; 30,3) | Sistemas fixos | "Soluções completas e personalizadas para implantação de sistemas fixos e equipamentos de combate a incêndio, com segurança e rastreabilidade." |

Depois da cena fixada (sem pin), vem um bloco com `obra-cilindros-supressao` (a partir de `024-original.jpg`, renomeado) em largura total, 16:7, raio de 28 px. Sobre ele:
- "250+" (`Odometer`, `display-xl`) e "obras de médio e grande porte realizadas"
- Legenda: "Bateria de cilindros de sistema fixo de supressão. Foto do acervo Protecin."

**Coreografia (cena fixada):**

| Elemento | Entrada / Rolagem | Hover/toque |
|---|---|---|
| Imagem (camada "câmera") | A entrada é do `SectionRise`. Na rolagem, cada ponto k tem uma janela p [k/5, (k+1)/5]. A câmera vai de `scale 1.0` (visão geral em p 0 a 0.08) para `scale 1.9` centrada no ponto, com `x = (50 - px) * 1.9 %` e `y = (50 - py) * 1.9 %`, interpolada com EASE_IN_OUT entre os pontos. No fim (p 0.92 a 1) volta a `scale 1.0`. Tudo por `useTransform` sobre `progress` suavizado por spring (MOLA_ROLAGEM) | — |
| Marcador do ponto k | Quando o ponto fica ativo: o anel faz `traco` (300 ms), o miolo `carimbo` e o anel pulsa 2 vezes (scale 1 → 1.8, opacidade 0.6 → 0). Inativo: opacidade 0.5, anel desenhado | Desktop: o hover no marcador ativa o ponto (rola até ele com `lenis.scrollTo`). Toque: idem |
| Linha-guia | `DrawPath` com pathLength 0 → 1 ligado à parte inicial da janela do ponto | — |
| Cartão de legenda | Desktop: um único cartão com `Reel` vertical dos 5 textos (MOLA_PILULA), que muda de lado (x por spring) conforme o ponto | — |
| Título do cartão | `palavra` a cada troca (re-dispara pelo índice) | — |
| Contador "0k / 05" | `Reel` | — |
| Rótulo e H2 | `sobe` e `linha` ao entrar. Em p 0.1 → 0.2 vão para opacidade 0.4 (não 0) | — |

**Bloco dos cilindros:** imagem com `cortina` e parallax interno de y -6% → 6%; "250+" com `odometro`; legenda com `sobe`.

### H5. Plataforma (`#plataforma`, rótulo "05 — Plataforma", P0)

**Estrutura:**
- **Abertura:** `DropWindow` no modo `abrir` como transição. Uma gota de `mundo-azul` cresce do centro até cobrir a tela enquanto a seção sobe (`offset ["start end","start start"]`, `range [0,1]`).
- **Pilares:** `PinStage` com **360vh** (desktop) e **300vh** (celular), dividido em 4 pilares de p 0,25 cada.

**Layout desktop:**
- **Esquerda (colunas 1–5):**
  - Rótulo e H2
  - Lista dos 4 títulos de pilar (`titulo`), cada um com número mono
  - Janela de detalhe com 7 linhas de altura e `Reel` dos 4 parágrafos
  - Trilho de progresso em 4 segmentos
  - CTAs
- **Direita (colunas 6–12):** palco dos dispositivos:
  - `PhoneMock`: 300x620, com a moldura em CSS (raio 44 px, borda de 10 px `#0B0F15`, ilha de 90x26)
  - Notebook com `app-webmaster-notebook` (WebP com alfa, 760 px)
  - Cartão de vídeo `app-tablet-720.mp4` (320x200, raio 20 px, inclinado -4°), com a legenda "Imagem ilustrativa"

**Layout celular:**
- **Metade de cima do palco:** o celular escalado para 46svh de altura; no pilar 02, o notebook aparece atrás, menor (60% da largura).
- **Metade de baixo:** o título do pilar ativo (`Reel`), o parágrafo (`Reel`), os segmentos de progresso e os CTAs.
- **Lista dos 4 títulos:** substituída pelo número "01/04".

**Conteúdo exato:**
- Rótulo: "05 — Plataforma" · sobretítulo: "Tecnologia a favor da segurança e da gestão"
- H2: "Plataforma / exclusiva Protecin" · linha de apoio: "monitoramento inteligente e gestão eficiente onde você estiver"
- Pilares:
  - **01 Aplicativo para Técnicos:** "Inspeções ágeis online e offline, com cadastro de equipamentos, questionários personalizados e envio automático de ordens de serviço ao cliente."
  - **02 Painel Web para Gestores:** "Gestão centralizada e em tempo real: acompanhe inspeções, controle usuários e envie comandos diretamente ao app da equipe técnica."
  - **03 Recursos Inteligentes:** "Coleta automatizada de dados, análises estatísticas e geração de insights. Operação segura, com ou sem internet, e 100% conforme a NBR 12962 e NBR 12779."
  - **04 Benefícios para o Cliente:** "Redução de erros e retrabalho, relatórios rápidos, transparência total e rastreabilidade de ponta a ponta nas inspeções realizadas."
- Selo (pilar 03): "100% conforme NBR 12962 · NBR 12779"
- Chips (pilar 04): "Menos erros e retrabalho" · "Relatórios rápidos" · "Transparência total" · "Rastreabilidade de ponta a ponta"
- CTAs:
  - Link interno "Conhecer o Protecin App" → `/nosso-app/`
  - `WhatsAppCta` "Quero ver a plataforma" (`location="plataforma"`, mensagem "Olá! Vim pelo site da Protecin e quero conhecer a plataforma Protecin App.")

**Telas do `PhoneMock`:** `Reel` horizontal de 4 telas, que imita a navegação do app.
1. **Splash:** imagem `app-splash` (a partir de `App_1.png`, real).
2. **Ordens (HTML recriado):** cabeçalho azul-marinho com o logo branco e os ícones de busca, scanner e sino. Três cartões, cada um com:
   - "Nº da Ordem" com uma barra borrada no lugar do número
   - "Nome do Cliente" com barra borrada
   - "Localização · Ver no mapa"
   - "Quantidades de Equipamentos: Total 3 (1 extintor e 2 hidrantes)"
   - "Andamento da vistoria: 1 de 3" com barra de progresso
3. **Offline (HTML):** o ícone `WifiOff` e o rótulo "Sem internet". A lista de itens do questionário segue sendo marcada (os `Check` se desenham). Depois, `RefreshCw` e "Sincronizado".
4. **Relatório (HTML):** um cartão "Relatório de inspeção" com o ícone `FileCheck2` e o rótulo "Envio automático por e-mail".

Nenhuma tela mostra número, nome de cliente ou indicador inventado. As barras borradas imitam o borrado das capturas reais.

**Coreografia:**

| Elemento | Entrada | Rolagem (p da cena; `l` = progresso local do pilar) | Hover/toque |
|---|---|---|---|
| Gota azul (`DropWindow` abrir) | — | Cresce de 0.45·D até cobrir a tela conforme a seção sobe | — |
| Rótulo, sobretítulo e H2 | `sobe`, `sobe` e `linha` quando a gota passa de 60% | — | — |
| Lista de pilares | `sobe`, stagger de 60 ms | Ativo = `floor(p*4)`. O título ativo tem opacidade 1 e x 0, com uma barra `brasa-400` de 3 px (scaleY 0 → 1, 350 ms). Os inativos ficam com opacidade 0.4 | Desktop: clicar num título rola até o pilar (`lenis.scrollTo`) |
| Parágrafo | — | `Reel` por estado (MOLA_PILULA) | — |
| Trilho (4 segmentos) | `regua` | O segmento ativo enche com scaleX = l; os anteriores ficam cheios | — |
| PhoneMock | y 120 → 0 e rotate 6° → 0 (800 ms) | `Reel` das telas: splash em p < 0.06, depois ordens (pilares 01 e 02), offline (03) e relatório (04) | `TiltCard` (desktop) |
| Pilar 01 | Os 3 cartões de ordem entram com `monta` quando a tela de ordens chega | A barra de "Andamento da vistoria" do primeiro cartão enche com scaleX 1/3 → 3/3 por `l`. O texto troca "1 de 3" → "2 de 3" → "3 de 3" em l 0.33 e 0.66 | — |
| Cartão de vídeo | `cortina` | Toca só durante o pilar 01; fica parado (sem sumir) nos outros | — |
| Pilar 02: notebook | — | x 40% → 0, rotateY -14° → 0 (perspective 1600) e opacidade 0.3 → 1 em l 0 → 0.35. O celular vai de x 0 → 18% e scale 1 → 0.82 | — |
| Pilar 02: ordem de serviço | — | A linha tracejada do notebook ao celular desenha (`DrawPath`) em l 0.3 → 0.6. O chip "Ordem de serviço" anda pela linha em l 0.5 → 0.9 (x e y lidos de 100 pontos pré-calculados com `getPointAtLength` na montagem). No celular, desce um banner "Nova ordem de serviço" (y -100% → 0, 350 ms) em l 0.9 | — |
| Pilar 03 | — | O notebook recua (scale 0.9, opacidade 0.5). A tela offline entra, os `Check` desenham em sequência por `l` e o `RefreshCw` gira 360° uma vez (600 ms) em l 0.7. O selo NBR faz `carimbo` em l 0.5 | — |
| Pilar 04 | — | A tela de relatório entra. O cartão "Relatório de inspeção" sai do celular (y 0 → -40 px, x 0 → 120 px, rotate 6°) em l 0.2 → 0.5. Os 4 chips entram com `monta` em l 0.5, stagger de 60 ms | — |
| CTAs | `sobe` | Ficam sempre visíveis no palco | 4.3 |

### H6. Diferenciais (`#diferenciais`, rótulo "06 — Por que a Protecin", P1)

**Layout desktop:**
- **Coluna esquerda (colunas 1–5), `sticky top-24`:**
  - Número gigante "01" → "04" (`Reel`, `display-xxl`, contorno `.text-outline` com uma cópia preenchida `brasa-500` por baixo)
  - Ícone de 160 px (traço 1.25) que troca e se desenha
- **Coluna direita (colunas 7–12):** 4 blocos de altura mínima 70vh, cada um com H3 `display-l` e texto (corpo-l).

**Layout celular:** sem sticky. Cada bloco tem o ícone de 56 px, o número mono, o H3 e o texto.

**Conteúdo exato:**
- H2: "Por que a Protecin"
- **01 Atendimento Personalizado:** "Equipe técnica e comercial especializada, com soluções sob medida e foco consultivo para as reais necessidades da sua empresa."
- **02 Tecnologia da Informação Aplicada:** "Operação integrada com geração de dados rastreáveis, controle preciso e apoio à tomada de decisão em tempo real."
- **03 Tradição e Credibilidade:** "Desde 1976 no mercado, com autorizações oficiais (Kidde Brasil, Everlux, Notifier e Simplex) e histórico de confiança no segmento de segurança contra incêndios."
- **04 Estrutura Completa e Qualificada:** "Profissionais treinados, equipamentos modernos, cobertura de seguros e setores integrados por sistemas atualizados."

**Coreografia:**

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| H2 | `palavra` | — | — |
| Bloco i | `sobe` | Ativo por `useInView(margin "-45% 0px -45% 0px")`: o H3 vai a opacidade 1 e o texto a 1. Inativos: H3 em 0.4 e texto em 0.55 (o contraste continua acima de 4,5:1). Transição de 400 ms | — |
| Número gigante | `fade` | `Reel` pelo bloco ativo (MOLA_PILULA) | — |
| Ícone gigante | `traco` | `Reel` vertical junto com o número (os 4 ícones numa coluna recortada, sem opacidade 0). Ao chegar, o novo ícone refaz o `traco` (600 ms) | — |
| Régua entre blocos | `regua` | — | — |

### H7. 50 anos / Linha do tempo (`#historia`, rótulo "07 — 50 anos", P0)

**Estrutura desktop:** trilho horizontal fixado, como no `Works` do Seven. A seção tem altura `100vh + distância`; o palco é `sticky` e o trilho tem `x = useTransform(spring(progress), [0,1], [0, -distância])`.

**Layout desktop:**
- **Canto superior esquerdo:** rótulo e H2.
- **Canto superior direito:** o ano ativo em `Odometer` mono de 28 px.
- **Trilho:** 10 painéis de `38vw` (mínimo de 520 px), começando com 8vw de recuo. Cada painel tem:
  - Ano gigante (`display-xxl` a 14vw, `.text-outline`) com a cópia preenchida `brasa-400` por cima
  - Abaixo do ano, o texto (corpo, no máximo 34ch)
- **Faixa inferior (a 82% da altura):** um trilho de 2 px `noite-600` em todo o comprimento, preenchido por uma linha `brasa-500` (scaleX = progresso), com um nó de 12 px na borda de cada painel.

**Layout celular:** vertical. O trilho fica à esquerda (x = 24 px) e enche com scaleY pelo progresso da seção. Cada item tem o ano em `display-l` (64 px) e o texto. Sem fixação.

**Conteúdo exato:**
- H2: "Tradição e inovação / que evoluem juntos" · sobretítulo: "Nossa História"
- Painéis (texto integral de `conteudo-estruturado.md` 2.2):
  - 1976: "Fundação da Protecin pela Extimbrás, uma das pioneiras na fabricação de extintores no Brasil, com o objetivo de atender à crescente demanda por serviços de manutenção em equipamentos de combate a incêndio."
  - 1986, 2004, 2006, 2009, 2012, 2015, 2021 e 2024: os textos integrais.
  - Painel final, 2026: "50 anos protegendo vidas e patrimônios." com `PrimaryCta` "Solicitar orçamento" (`#orcamento`) e `WhatsAppCta` (`location="historia"`).
- Imagens: no painel 2021, `app-login-celular` (a partir de `App_3.png`, real) com 180 px flutuando; no painel 1976, o `Symbol` de 72 px. Os outros painéis são só tipografia (não há foto real da sede nem da frota).

**Coreografia:**

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Rótulo e H2 | `sobe` e `linha` | Fixos no palco | — |
| Trilho de painéis | — | x por spring (MOLA_ROLAGEM) | — |
| Ano (contorno) | — | Parallax em relação ao painel: o ano anda a 0.85× da velocidade do trilho (`x` próprio de +0% → -15% do painel) | — |
| Ano (cópia preenchida) | — | Opacidade 0 → 1 (300 ms) quando o centro do painel passa de 55% da tela e **fica preenchido** (uma vez). No fim da rolagem, todos estão preenchidos | — |
| Texto do painel | `sobe` ao ativar (uma vez) | — | — |
| Linha de progresso | — | scaleX = progresso | — |
| Nó do painel | — | Ao ser alcançado: scale 0 → 1 (`carimbo`) e `box-shadow` de brasa (camada de brilho com opacidade 0 → 1) | — |
| Ano ativo (canto) | — | `Odometer` de 4 dígitos com o ano do painel ativo | — |
| Celular do 2021 | `sobe` | y 0 → -10% (parallax) | — |
| Celular: rail e itens | `sobe` por item; o nó acende com `useInView(margin "-45%")` | rail com scaleY = progresso | — |

### H8. Setores (`#setores`, rótulo "08 — Setores", P1)

**Layout desktop:** H2 e texto no topo. Abaixo, 3 linhas tipográficas gigantes (`display-xl`, largura total), separadas por réguas. Cada linha é um botão de acordeão (`aria-expanded`); ao abrir, mostra o texto do setor em 2 colunas.

**Layout celular:** cada linha tem uma miniatura 16:9 sempre visível acima do nome (sem hover), o nome em `display-l` e um toque para abrir o texto.

**Conteúdo exato:**
- Sobretítulo: "Presença sólida e confiável em empresas de alto padrão"
- H2: "Atendemos líderes de mercado / em diferentes setores"
- Texto: "Com atuação nacional e décadas de experiência, a Protecin atende clientes que são referência em seus segmentos. A confiança dos nossos parceiros é reflexo do nosso compromisso com a excelência."
- Linha 1: "Financeiro, Tecnologia e Saúde". Texto: "Atendemos as principais empresas desses setores, que demandam atendimento personalizado, proteção contra incêndio atualizada e inovações constantes." Imagem: `setor-financeiro-tecnologia-saude`.
- Linha 2: "Industrial e Agronegócio". Texto: "Nossos clientes nestes setores são os principais players de mercado e demandam serviços diferenciados de acordo com suas peculiaridades." Imagem: `setor-industrial-agronegocio`.
- Linha 3: "Energia e Transporte". Texto integral de `conteudo-estruturado.md` 2.4. Imagem: `setor-energia-transporte`.
- Link: "Ver clientes e parcerias" → `/nossos-clientes/`

**Coreografia:**

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Sobretítulo, H2 e texto | `sobe`, `linha` e `sobe` | — | — |
| Réguas | `regua`, stagger de 120 ms | — | — |
| Nome do setor | `linha` | x 4% → -4% (cada linha em sentido alternado, ligado à seção) | Desktop: x +24 px, cor papel-50 → `brasa-400` (200 ms) e `CursorPreview` com a imagem do setor |
| Ícone + / × | `fade` | — | Gira 135° ao abrir (350 ms) |
| Texto aberto | Altura 0 → auto (400 ms, EASE_OUT; é ação do usuário, não da rolagem) e itens com `sobe`, stagger de 60 ms. O conteúdo fica sempre no DOM (SEO) | — | Dispara `pushEvent("sector_open",{setor})` |
| Miniatura (celular) | `cortina` | parallax interno | — |

### H9. Compromisso (`#social`, rótulo "09 — Compromisso", P1)

**Layout desktop:**
- **Topo:** um letreiro de 4 linhas em `display-xl` (largura total) com `acende` por palavra.
- **Abaixo, 2 colunas:**
  - **Esquerda (colunas 1–6), Kids ONG:** logo de 120 px, a colagem `kids-ong-colagem` (rostos já borrados; nunca desfocar menos) e o texto.
  - **Direita (colunas 7–12), Sustentabilidade:** `institucional-maos` (recorte transparente) flutuando e o texto.

**Layout celular:** letreiro (cerca de 44 px), depois Kids ONG e Sustentabilidade em coluna.

**Conteúdo exato:**
- Sobretítulo: "Nosso compromisso vai além da segurança técnica"
- Letreiro (H2): "Cuidar de vidas / também é / transformar / futuros"
- Kids ONG: "A Protecin financia o Kids ONG, projeto social com sete anos de atuação em Santo André – SP. Criado pelo fundador da Protecin, Cláudio Szulcsewski, e atualmente conduzido por Juliana Szulcsewski Ardengue, a iniciativa acolhe crianças em situação de vulnerabilidade por meio de ações de educação e desenvolvimento humano." **[confirmar com a Protecin]:** "sete anos" (texto de 2025) e "fundador" (a linha do tempo diz "fundação pela Extimbrás").
- Sustentabilidade: título "Cuidar também é prevenir." e o texto integral de `conteudo-estruturado.md` 2.2 (Responsabilidade e Sustentabilidade).
- Link: "Conheça nossa história" → `/institucional/`

**Coreografia:**

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Sobretítulo | `sobe` | — | — |
| Letreiro | — | `acende` por palavra, `offset ["start 80%","end 45%"]`. "vidas" e "futuros" acendem em `brasa-400` | — |
| Logo Kids ONG | `carimbo` | — | — |
| Colagem | `cortina` | parallax interno de y -6% → 6% | — |
| Mãos com muda | `sobe` | y 8% → -8% (camada mais rápida que o texto) e rotate -2° → 2° | — |
| Textos | `sobe`, stagger de 80 ms por parágrafo | — | — |

### H10. Orçamento (`#orcamento`, rótulo "10 — Orçamento", P0)

**Estrutura:** abre com o `DropWindow` no modo `abrir` em `mundo-vermelho` (a gota vermelha cresce até cobrir a tela). Por cima: `Embers` com densidade 90 e `luz-brasa` grande vinda de baixo.

**Layout desktop:**
- **Topo:** letreiro gigante "SOLICITAR ORÇAMENTO" (`display-xxl` a 16vw, `brasa-500` com 85% de opacidade e `mix-blend-mode: screen`), sangrando, numa linha só, decorativo (`aria-hidden`).
- **Abaixo:**
  - Colunas 1–5: rótulo, H2, texto e lista de canais
  - Colunas 7–12: cartão do formulário (`noite-900`, borda `noite-700`, raio 28 px, padding de 40 px)

**Layout celular:** o letreiro fica em 2 linhas, a 22vw. Depois vêm o H2, o formulário e os canais.

**Conteúdo exato:**
- H2: "Precisa de uma proposta, agendar uma visita ou tirar dúvidas?"
- Texto: "Nossa equipe está pronta para atender com agilidade e atenção técnica. Preencha o formulário ou utilize os canais abaixo para falar com a gente."
- Canais (cada um é uma linha clicável com ícone, rótulo mono e valor):
  - WhatsApp "+55 11 94565-1751" (`location="orcamento"`)
  - Telefone "+55 11 4977-8720" (`location="orcamento"`)
  - E-mail "comercial@protecin.com.br" (`EmailLink location="orcamento"`)
  - Endereço "Rua Lacônia, 600, Parque Capuava, CEP 09271-010, Santo André - SP" (link "Como chegar" no Google Maps, `map_directions_click`)
  - Horário "Segunda a sexta, 8h às 17h30"
- Formulário: seção 7.2.

**Coreografia:**

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Gota vermelha | — | Cresce até cobrir a tela conforme a seção sobe | — |
| Letreiro | — | x 10% → -10% pela seção | — |
| `luz-brasa` | — | scale 0.6 → 1.1 e opacidade 0.4 → 0.9 | — |
| Embers | opacidade 0 → 1 | pausa fora da tela; repulsão pelo ponteiro (P1) | — |
| Rótulo, H2 e texto | `sobe`, `palavra` e `sobe` | — | — |
| Canais | `sobe`, stagger de 60 ms; ícone com `traco` | — | Desktop: a seta desliza x 0 → 6 e o sublinhado faz scaleX (200 ms) |
| Cartão do formulário | `cortina` vindo de baixo (900 ms) | — | — |
| Campos | `sobe`, stagger de 50 ms | — | 4.3 |

### 7.2 `OrcamentoForm`: "Monte sua solicitação" (P0)

**Três etapas no mesmo cartão:**
- **Barra de etapas:** 3 segmentos que enchem com scaleX (350 ms), mais o rótulo mono "ETAPA 1 DE 3".
- **Troca de etapa:** a etapa atual sai com x 0 → -40 px e opacidade 1 → 0 (250 ms, EASE_IN), e a nova entra com x 40 → 0 e opacidade 0 → 1 (350 ms, EASE_OUT). A altura do cartão é fixa no desktop (640 px, que cabe a etapa 3 com as mensagens de erro), para não pular.

**Etapa 1, "O que você precisa?":** chips multisseleção com os 8 serviços (os H3 de H3) e "Ainda não sei". Botão "Continuar".

**Etapa 2, "Sobre o local":** chips de seleção única com os setores reais (Financeiro · Tecnologia · Saúde · Industrial · Agronegócio · Energia · Transporte · Outro) e o campo "Cidade / UF". Botões "Voltar" e "Continuar".

**Etapa 3, "Seus dados":**
- Campos:
  - Nome* (`autocomplete="name"`)
  - Empresa (opcional)
  - E-mail* (`type="email"`)
  - Telefone* com máscara "(11) 99999-9999" enquanto digita e pelo menos 10 dígitos
  - Mensagem (opcional, 3 linhas)
- Placeholders, sem e-mail fictício: "Seu nome", "Nome da empresa", "Seu e-mail", "(DDD) número" e "Conte o que precisa".
- Anti-spam (`_honey` e 1,5 s mínimo) igual ao do Seven.
- Botão primário "Enviar solicitação".
- Botão alternativo `WhatsAppLink` "Enviar pelo WhatsApp" (`location="formulario"`), com a mensagem montada ao vivo no `href`: "Olá! Vim pelo site da Protecin. Serviços: {lista}. Setor: {setor}. Cidade: {cidade}. Nome: {nome}. Empresa: {empresa}."

**Validação:** em português, ao sair do campo e ao enviar. Mensagens:
- "Informe seu nome."
- "Informe um e-mail válido."
- "Informe um telefone com DDD."

O erro aparece com y -4 → 0 e opacidade 0 → 1 (200 ms), em `brasa-300` com o ícone `AlertCircle`. O campo inválido treme uma vez (x 0 → -6 → 6 → 0, 300 ms).

**Estados:**
- **Enviando:** o rótulo do botão vira "Enviando…" com um anel girando (só enquanto envia) e o botão fica desabilitado.
- **Sucesso:** bloco `.msg-sucesso` **sem animação de opacidade** (o GTM mede a visibilidade dele). Entra com y 16 → 0 e scale 0.98 → 1 (350 ms). O `Check` faz `carimbo` dentro de um círculo `marinho-700`. Texto: "Recebemos sua solicitação. Nossa equipe comercial retorna em horário de atendimento (segunda a sexta, 8h às 17h30)."
- **Erro:** "Não conseguimos enviar agora." e links de reserva para e-mail (`mailto:` com o resumo no corpo) e WhatsApp.

**Envio:**
- **Na demo** (`import.meta.env.BASE_URL !== "/"`), **não envia nada**. Simula 1,2 s de envio e mostra o sucesso com a linha extra "Demonstração: na versão publicada, este envio chega a comercial@protecin.com.br." Assim a Protecin não recebe o e-mail de ativação do FormSubmit antes de aprovar a proposta.
- **Em produção:** usa o FormSubmit do Seven (`https://formsubmit.co/ajax/comercial@protecin.com.br`).

**Eventos:**
- `form_open` (ao focar o primeiro campo ou ao chegar por CTA)
- `form_step {step}`
- `form_lead {servicos, setor, cidade, demo}` no sucesso, mais `trackLead("email","formulario","orcamento")`

**Pré-seleção:** `/contato/?servico=<slug>` e os CTAs "Orçamento deste serviço" de `/servicos/` marcam o chip do serviço.

### Rodapé (todas as páginas, P0)

**Layout desktop:**
- **Topo:** o slogan gigante "PROTEGEMOS SEU MAIOR PATRIMÔNIO: A VIDA." (`display-xl`, 2 linhas, `WipeText`).
- **Abaixo, 4 colunas:**
  - (1) Logo + texto institucional
  - (2) Seções
  - (3) Contato
  - (4) Endereço e horário + redes
- **Linha final:**
  - "© {ano} Protecin. Todos os direitos reservados."
  - Os créditos de vídeo: "Vídeos ilustrativos: Pexels (Val A., Gustavo Fring, Mikael Blomkvist)"
  - O `MotionToggle`
  - O botão "Voltar ao topo"

**Layout celular:** slogan em 3 linhas e colunas empilhadas. A barra flutuante some quando o rodapé aparece.

**Conteúdo exato:**
- Texto institucional: "Com 50 anos de atuação, a Protecin é reconhecida pela confiabilidade e excelência em soluções de prevenção e combate a incêndio. Oferecemos projetos, instalações, manutenções e uma plataforma tecnológica completa, garantindo segurança, conformidade e tranquilidade para empresas em todo o país."
- Seções: Início, Institucional, Catálogo Digital, Serviços, Nossos Clientes, Nosso App, Contato
- Contato:
  - +55 11 4977-8720 (`PhoneLink location="rodape"`)
  - WhatsApp +55 11 94565-1751 (`location="rodape"`)
  - comercial@protecin.com.br e falecom@protecin.com.br (`EmailLink`)
- Endereço: Rua Lacônia, 600, Parque Capuava, CEP 09271-010, Santo André - SP, Brasil
- Horário de atendimento: Segunda a sexta, 8h às 17h30
- Redes: Instagram @protecin_ltda (`https://www.instagram.com/protecin_ltda`) e LinkedIn (`https://www.linkedin.com/company/protecin/`)
- Ano: dinâmico. O SSR grava o ano do build e o cliente atualiza no `useEffect`.

**Coreografia:**

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Slogan | o contorno entra com `fade` | `WipeText`: o preenchimento papel-50 limpa da esquerda para a direita pelo progresso do rodapé (`offset ["start end","end end"]`); "A VIDA." limpa em `brasa-400` | — |
| Símbolo do logo | as cantoneiras fecham (`traco` das 4 partes, 600 ms) | — | — |
| Colunas | `sobe`, stagger de 60 ms; títulos mono com `fade` | — | Links: sublinhado (4.3) |
| Linha final | `fade` | — | — |
| Voltar ao topo (48 px) | `carimbo` | — | `Magnetic` 0.3; a seta sobe y 0 → -4. O clique faz `lenis.scrollTo(0,{duration:1.4})` |
| Embers (densidade 30, só desktop) | — | pausa fora da tela | — |

---

## 8. Páginas internas

### 8.1 `PageHero` compartilhado (P0)
**Estrutura:** `PinStage` com **170vh** no desktop e **150svh** no celular.

**Layout desktop:**
- **Esquerda (colunas 1–7):**
  - Trilha mono "INÍCIO / <PÁGINA>" (o "Início" é link)
  - H1 `display-xl` com `SplitLines` em modo CSS
  - Subtítulo `corpo-l`
  - CTAs: `PrimaryCta` "Solicitar orçamento" → `/contato/` e o `WhatsAppCta` contextual
- **Direita (colunas 8–12):** o símbolo com a imagem dentro da gota (D = `min(36vh, 30vw)`).

**Layout celular:** texto em cima e o símbolo abaixo (D = 58vw). O primeiro CTA tem que ficar acima da dobra.

**Coreografia:**
- **Entrada (CSS, `--t0` como no hero):**
  - Trilha com `fade`
  - H1 com `linha`, stagger de 80 ms
  - Subtítulo e CTAs com `sobe`
  - Cantoneiras fechando de 24 px para fora até o lugar (600 ms, a partir de `--t0 + 200`)
  - Imagem da gota com scale 1.2 → 1 (900 ms)
- **Rolagem:**
  - O texto vai a opacidade 0.3 com y -8vh em p 0 → 0.3.
  - A gota cresce (`DropWindow abrir`, de 1 até cobrir) em p 0.1 → 0.6, com o grupo indo para o centro (x por `useTransform`).
  - As cantoneiras se afastam até sair da tela (±50vw, ±50vh) em p 0.1 → 0.4.
  - De p 0.6 a 1, a imagem fica em tela cheia com scale 1.06 → 1.
  - A seção seguinte sobe por cima com `SectionRise`.
- **Modo reduzido:** H1 e imagem estáticos, sem fixação.

### 8.2 `/institucional/`

| Seção | Conteúdo exato | Composição e motion |
|---|---|---|
| **I0 PageHero** | Trilha "INSTITUCIONAL". H1: "Desde 1976, / prevenção e engenharia / de combate a incêndios". Subtítulo: "Com sede em Santo André (SP), oferecemos projetos, instalação de sistemas, manutenção e uma plataforma digital exclusiva para gestão técnica de extintores e hidrantes." Imagem: `institucional-pilar`. WhatsApp `location="pagina_institucional"` | 8.1 |
| **I1 Linha do tempo** | O componente de H7 completo, com H2 "Nossa História: tradição e inovação que evoluem juntos" | H7 |
| **I2 Missão, Visão e Valores** | Título: "O que nos move, inspira e sustenta nosso compromisso com a segurança". Texto de introdução integral. Missão e Visão literais. Valores (6): "Ética e integridade em todas as relações" · "Iniciativa e foco na excelência" · "Entusiasmo por inovação e melhoria contínua" · "Determinação para alcançar resultados com responsabilidade" · "Espírito de equipe e valorização das pessoas" · "Transparência em processos, decisões e atendimentos" | **Desktop:** Missão e Visão como duas declarações grandes (`display-l`, colunas 1–6 e 7–12) com rótulo mono "NOSSA MISSÃO" e "NOSSA VISÃO", reveladas por `linha` com 200 ms entre as duas, e uma régua vertical entre elas (scaleY 0 → 1). Valores numa lista numerada 01–06 em `titulo`; cada linha acende ao cruzar o meio da tela (opacidade 0.45 → 1, número mono `brasa-400`, régua `regua`). **Celular:** tudo em coluna, com o mesmo motion |
| **I3 Sustentabilidade** | "Cuidar também é prevenir." + texto integral | Fundo `institucional-paisagem` (textura, opacidade 0.35, parallax y -10% → 10%, véu `noite-950/70`). Frase em `display-xl` com `palavra`. `institucional-maos` flutua (y 8% → -8%) |
| **I4 Kids ONG** | O bloco de H9 completo (letreiro + Kids ONG) | H9 |
| **Faixa CTA** | seção 8.8 | 8.8 |

### 8.3 `/servicos/`

| Seção | Conteúdo exato | Composição e motion |
|---|---|---|
| **S0 PageHero** | Trilha "SERVIÇOS". H1: "Engenharia, inspeção / e manutenção / contra incêndio". Subtítulo: "Conheça os serviços técnicos, operacionais e de suporte técnico e estratégico oferecidos pela Protecin." Imagem: `co2-cilindros` (de `Home_BG_1-1.jpg`). WhatsApp `location="pagina_servicos"` | 8.1. Extra: `valvulas-sprinkler` (recorte transparente) flutua na frente da gota com parallax y 0 → -18% e rotate 0 → -3° (camada mais rápida) |
| **S1 Índice + 8 capítulos** | Os 8 serviços da tabela de H3. Cada capítulo traz: número, H2 (o nome), resumo, descrição longa, chips, ícone, imagem principal e, no 01, a segunda imagem `servico-instalacao-2` (de `Inspecao_1.jpg`). CTAs: `WhatsAppCta` "Orçamento deste serviço" (`location="pagina_servicos"`, `detail=slug`) e o link "Monte sua solicitação" → `/contato/?servico=<slug>` | **Desktop:** índice `sticky` à esquerda (colunas 1–3) com os 8 nomes numerados; o ativo (`useInView`, margin -45%) fica com opacidade 1, barra `brasa-400` (scaleY, 350 ms) e `layoutId="svc-ativo"`; os outros em 0.45; clicar rola até o capítulo. Capítulos (colunas 5–12) com altura mínima de 90vh: número `Odometer`, H2 `linha`, imagem `cortina` + parallax, textos `sobe`, chips `monta`, ícone `traco`. **Celular:** sem índice fixo; uma barra horizontal de chips no topo (`data-lenis-prevent`, `snap-x`) leva aos capítulos. Cada capítulo com `id=<slug>` e `pushEvent("service_open",{servico})` ao ativar pela primeira vez |
| **S2 Fitas** | Fita A: "Extintores · Mangueiras · Hidrantes · Portas corta-fogo · Sistemas de alarme · Sistemas de supressão · Sistemas fixos · Sinalizações". Fita B: "Inspeções periódicas · Testes hidrostáticos · Manutenção em campo · Repintura · Limpeza · Adequação técnica · Auditorias · Treinamentos" | Duas `VelocityMarquee` em sentidos opostos, em `display-l` com wdth 66; os separadores são o símbolo de 20 px. A fita A é preenchida em papel-50 e a fita B em `.text-outline`. A fita ganha rotate -2° (A) e +2° (B), estáticos. No hover a fita para |
| **S3 Na prática** | Reuso de H4 | H4 |
| **Faixa CTA** | 8.8 | 8.8 |

### 8.4 `/nossos-clientes/`

| Seção | Conteúdo exato | Composição e motion |
|---|---|---|
| **C0 PageHero** | Trilha "NOSSOS CLIENTES". H1: "Nossos Clientes". Subtítulo: "Parcerias de confiança que impulsionam nosso compromisso com a segurança, a prevenção e a continuidade das operações dos nossos clientes." Imagem: `clientes-aperto`. WhatsApp `location="pagina_clientes"` | 8.1 |
| **C1 Escala** | Sobretítulo "Presença sólida e confiável em empresas de alto padrão", H2 "Atendemos líderes de mercado em diferentes setores", o texto de H8 e o número "20.000+ / clientes atendidos" | Número com `odometro`, H2 com `linha` e texto com `sobe` |
| **C2 Setores empilhados** | Os 3 setores com o texto integral | 3 painéis em tela cheia (`sticky top-0`, 100svh), um sobre o outro. Cada painel tem a imagem do setor em largura total (véu `noite-950/65`, parallax interno), o nome em `display-xl` (`linha`) e o texto em `corpo-l` (`sobe`). Quando o painel seguinte cobre, o de baixo vai de scale 1 → 0.92 e o véu de 0 → 0.6. Celular: igual, com altura mínima de 90svh |
| **C3 Parcerias e filiações** | Título "Parcerias estratégicas e filiações técnicas" + texto integral. Três grupos: "Autorizações oficiais" (Kidde Brasil, Everlux, Notifier by Honeywell, Simplex), "Marcas com que trabalhamos" (VESDA by Xtralis, Bosch, Firebee, Germek Equipamentos) e "Filiações técnicas" (ABSpk, NFPA) | Grade de ladrilhos 3:2 (4 colunas no desktop, 2 no celular), um rótulo mono por grupo e réguas. Ladrilhos com `virada`, stagger de 50 ms; cada logo monocromático branco. Hover ou foco: chip `papel-50` cresce de baixo (scaleY, 350 ms), o logo fica colorido e aparece o nome em mono sob o ladrilho. **Sem clientes:** os logos ficam rotulados como parceiros e entidades |
| **Faixa CTA** | 8.8 | 8.8 |

### 8.5 `/catalogo-digital/`

| Seção | Conteúdo exato | Composição e motion |
|---|---|---|
| **K0 Capa 3D + Download** | Trilha "CATÁLOGO DIGITAL". H1: "Catálogo Digital Protecin". Subtítulo: "Material completo e sempre atualizado". Texto: "Conheça em detalhes nossos serviços, produtos, tecnologias e diferenciais. Tudo reunido em um catálogo pensado para facilitar sua consulta e apoiar suas decisões com segurança e confiança." Botão `PrimaryCta` "Baixar catálogo (PDF)" com o ícone `Download` → `https://protecin.com.br/wp-content/uploads/2025/07/Catalogo-Digital-Protecin.pdf` (`target="_blank"`, `pushEvent("catalog_download",{location:"pagina_catalogo"})`). `WhatsAppCta` "Falar com o comercial" (`location="pagina_catalogo"`) | Sem gota. **Desktop:** texto nas colunas 1–6 e capa nas 8–11. A capa (`catalogo-capa`, 360 px de largura, por ser de baixa resolução) é um `TiltCard` com lombada falsa (um `::before` de 14 px de espessura em `marinho-900`, `rotateY(90deg)`). Entrada: rotateY -35° → -12° e y 60 → 0 (900 ms, EASE_OUT); depois a capa segue o ponteiro (±8°). Rolagem: rotateY -12° → 0 e scale 1 → 1.06. Sombra `brasa-600` sob a capa (camada com opacidade). **Celular:** capa acima do texto (240 px), sem tilt |
| **K1 Linha de equipamentos** | Título "Equipamentos que comercializamos". Texto: "Linha completa de extintores, mangueiras, hidrantes, portas corta-fogo, sistemas de alarme e supressão. Equipamentos homologados e manutenção certificada pelo INMETRO, com rastreabilidade e garantia." | `institucional-extintor` (de `Institucional_2.png`) com `cortina` e parallax. Ao lado, os 6 itens como chips grandes (`monta`); a fita A de S2 fica embaixo |
| **Faixa CTA** | 8.8 | 8.8 |

O conteúdo do PDF não foi lido. Esta página não lista o que está dentro dele.

### 8.6 `/nosso-app/`

| Seção | Conteúdo exato | Composição e motion |
|---|---|---|
| **A0 Hero de dispositivos** | Trilha "NOSSO APP". H1: "Protecin App: / gestão inteligente / de inspeções". Texto: "Uma plataforma completa, com versão web e aplicativo próprio, que otimiza o controle de extintores e hidrantes com agilidade, segurança e conformidade técnica." (A frase do site atual "…que está transformando o setor…" fica fora, por esbarrar na copy proibida da régua.) CTAs: `WhatsAppCta` "Quero conhecer a plataforma" (`location="pagina_app"`) + `PrimaryCta` "Solicitar orçamento" | Fundo `mundo-azul`. **Desktop:** texto nas colunas 1–6; à direita, o notebook `app-webmaster-notebook` e o celular `app-login-celular` à frente, à direita. Entrada (CSS): o notebook vai de y 60 → 0 e rotateX 18° → 0 (perspective 1600, 900 ms); o celular de y 120 → 0 e rotate 8° → -4° (900 ms, +120 ms). Rolagem: celular y 0 → -12%, notebook 0 → -4%. Celular: dispositivos abaixo do texto, com 80% da largura |
| **A1 Como funciona** | Título: "Como nosso Protecin funciona?". Módulos com as listas reais: **App de Coleta (uso em campo):** inspeções rápidas e padronizadas; cadastro de equipamentos; aplicação de questionários técnicos; funciona offline; envio automático de relatórios por e-mail. **Processador de Coleta Online:** recepção automática dos dados de campo. **Web Master (gestão centralizada):** acesso por perfil de usuário; visualização em tempo real das inspeções; envio de ordens de serviço ao app; gestão completa do sistema. Frase: "Conheça as funcionalidades do nosso software e veja como ele pode tornar sua rotina mais eficiente, segura e integrada." | `PinStage` de 300vh. **Desktop:** três nós em linha (celular → `Server` → notebook) ligados por um path SVG. `DrawPath` desenha o primeiro trecho em p 0.1 → 0.4 e o segundo em p 0.45 → 0.75. Três "pacotes" (retângulos de 64x24 com o rótulo mono "COLETA") andam pelo path com x e y de pontos pré-calculados, defasados em 0.06. Quando o traço chega a um nó, o nó faz `carimbo` e a lista dele entra com `sobe`, stagger de 60 ms. Fica uma vez só: as listas não somem. **Celular:** fluxo vertical, sem fixação, com o path vertical guiado pela rolagem da seção |
| **A2 Quatro pilares** | Reuso de H5 (sem a gota de abertura, já que o fundo é azul) | H5 |
| **A3 Recursos que fazem a diferença** | Título: "Recursos que fazem a diferença". Subtítulo (composto com fatos): "Conformidade com a NBR 12962 e a NBR 12779, com ou sem internet." O subtítulo atual ("…para elevar o padrão das suas inspeções") fica fora pelo mesmo motivo. Os 8 recursos literais | Quadro 4x2 (desktop) ou 2x4 (celular) de ladrilhos `noite-800`/`marinho-700` com ícone e nome. Entrada: `monta`, em que os ladrilhos se montam a partir de posições espalhadas (stagger de 50 ms) quando o quadro entra 20%; depois, cada ícone faz `traco`. Hover: y -4, borda `brasa-400` e o ícone se redesenha |
| **A4 Fecho** | "Tecnologia acessível que entrega resultado, simplifica processos e fortalece sua gestão." + CTAs (WhatsApp `pagina_app` e `PrimaryCta`) | Frase em `display-xl` com `acende`; CTAs com `sobe` |

### 8.7 `/contato/`

| Seção | Conteúdo exato | Composição e motion |
|---|---|---|
| **T0 PageHero compacto** | Trilha "CONTATO". Sobretítulo "Entre em contato". H1 "Contate a Protecin". Texto: "Precisa de uma proposta, agendar uma visita ou tirar dúvidas? Nossa equipe está pronta para atender com agilidade e atenção técnica. Preencha o formulário ou utilize os canais abaixo para falar com a gente." | 60svh, sem fixação. À direita, o `Symbol` gigante (40vw) só em traço (`noite-600`), que se desenha com `traco` (900 ms); a gota enche com scale 0 → 1 (`EASE_BACK`). H1 com `linha` |
| **T1 Formulário + canais** | `OrcamentoForm` (com `?servico=` pré-selecionado) + a lista de canais de H10 com `location="pagina_contato"` | H10 sem o letreiro e sem a gota vermelha |
| **T2 Mapa** | Endereço completo. Botão "Carregar mapa" (fachada) e link "Como chegar" | Fachada `noite-800` com raio de 28 px, o símbolo como pino (`carimbo`) e o endereço. O clique troca pelo `iframe` `https://www.google.com/maps?q=Rua+Lac%C3%B4nia,+600,+Santo+Andr%C3%A9+-+SP&output=embed` (`loading="lazy"`), dentro de um `ClipReveal`. Dispara `pushEvent("map_load")`; o "Como chegar" dispara `map_directions_click` |

### 8.8 Faixa CTA (fim de toda página interna, P0)
- **Fundo e letreiro:** `mundo-vermelho` atenuado, com o letreiro `VelocityMarquee` "SOLICITAR ORÇAMENTO ·" em `display-xxl` (baseVelocity -0.8).
- **Conteúdo:** sobre o letreiro, centralizados, a frase "Fale com a Protecin: segunda a sexta, 8h às 17h30." e 3 botões:
  - `PrimaryCta` "Solicitar orçamento" → `/contato/`
  - `WhatsAppCta` (`location="faixa_cta"`, `detail=<rota>`)
  - `PhoneLink` (`location="faixa_cta"`)
- **Motion:** a faixa entra com `SectionRise`, os botões com `sobe` (stagger de 60 ms) e `Embers` com densidade 40.

### 8.9 `404.html`
O símbolo centralizado com as cantoneiras **abertas** (deslocadas 40 px para fora), que fecham em 600 ms. Depois vêm o H1 "Página não encontrada" (`linha`) e o link "Voltar para o início" (`PrimaryCta`). Tem `noindex`.

---

## 9. Dados (`src/data/site.ts`)

Tudo literal, sem nenhum número que não esteja em `conteudo-estruturado.md`. Os campos que dependem da Protecin ficam `null` e não renderizam.

```ts
export const COMPANY = {
  nome: "Protecin", razaoSocial: "Protecin Proteção Técnica Contra Incêndio Ltda.", fundacao: 1976,
  descritor: "Engenharia e Proteção Técnica Contra Incêndio", slogan: "Protegemos seu maior patrimônio: a vida.",
  phoneDisplay: "+55 11 4977-8720", phoneTel: "tel:+551149778720",
  whatsappDisplay: "+55 11 94565-1751", whatsappNumber: "5511945651751",
  email: "comercial@protecin.com.br", email2: "falecom@protecin.com.br",
  endereco: { rua: "Rua Lacônia, 600", bairro: "Parque Capuava", cep: "09271-010", cidade: "Santo André", uf: "SP" },
  horario: "Segunda a sexta, 8h às 17h30",
  instagram: "https://www.instagram.com/protecin_ltda", linkedin: "https://www.linkedin.com/company/protecin/",
  catalogoPdf: "https://protecin.com.br/wp-content/uploads/2025/07/Catalogo-Digital-Protecin.pdf",
  cnpj: null, gtmId: null,            // [confirmar com a Protecin] / pendência com o Gabriel
};
export const DEFAULT_WA_MESSAGE = "Olá! Vim pelo site da Protecin e gostaria de um orçamento.";
// NUMEROS, SELOS, AUTORIZADAS, MARCAS, FILIACOES, SERVICOS (slug, nome, resumo, descricao, chips, icone, imagem, video, wa),
// PILARES, MODULOS, RECURSOS, TIMELINE, SETORES, DIFERENCIAIS, MISSAO, VISAO, VALORES, KIDS, SUSTENTABILIDADE,
// HOTSPOTS (x,y,titulo,texto), ROUTES (path, title, description, ogImage), VIDEOS, CREDITOS, MENU_IMAGENS.
// Títulos com quebra controlada: { texto, linhas: { desktop: string[], celular: string[] } }.
```

`structuredData()` gera:
- **`ProfessionalService`:** nome, url, logo, telefone, e-mail, endereço, `foundingDate: "1976"`, `areaServed: "BR"`, `sameAs` com as redes e `hasOfferCatalog` a partir de `SERVICOS`.
- **`WebSite`**.
- Sem `FAQPage`, porque não há FAQ real.

---

## 10. Vídeos e imagens reais

### 10.1 Vídeos (`public/videos/`, sem hotlink)

| Arquivo | Origem (`videos.md`) | Onde | Peso | Regras |
|---|---|---|---|---|
| `hero-supressao-720.mp4` | Pexels 34775810, 720p (8 s) | H0, dentro da `DropWindow` | 5,91 MB sem reencode. Meta: cerca de 3 MB com `ffmpeg -i in.mp4 -an -c:v libx264 -crf 26 -preset slow -vf scale=1280:-2 -movflags +faststart` | **Antes de usar, ver o clipe inteiro** e descartar se aparecer "GASBASE.RU" ou marca legível. Remux `+faststart` (MP4 fragmentado). Poster: `hero-poster` |
| `app-tablet-720.mp4` | Pexels 7100844, 720p (21,3 s) | H5 e A2, pilar 01, cartão de vídeo | 2,40 MB | Legenda "Imagem ilustrativa". Não sugerir que a pessoa é da equipe |
| `extintor-fumaca-720.mp4` | Pexels 8965440, 720p (6,4 s) | H3, cartão 07 (Venda de Equipamentos) | 1,91 MB | Loop simples. Ilustrativo: a pessoa não é da equipe |
| `fogo-final-720.mp4` (opcional, P2) | Mixkit 52312 cortado em 9 s | H10, `mix-blend-mode: screen` com opacidade 0.5 | Só entra se ficar **com no máximo 4 MB** (`-t 9 -crf 28`). Sem isso, H10 usa só `Embers` | O original tem 7,11 MB e passa do limite da régua |

Regras do `LazyVideo`:
- **Só no cliente:** o `<video>` é montado só depois da hidratação. O poster é um `<img>` irmão, que vem no HTML do prerender. Sem JS existe só o poster, e nenhum vídeo fica no DOM com opacidade 0.
- **Atributos:** `muted playsinline loop preload="none" poster`.
- **Carregamento:** o `src` só entra quando o vídeo chega a 1 tela de distância (`rootMargin: "100% 0px"`). O hero só carrega depois do `load` da página e de `requestIdleCallback` (com 1.200 ms de fallback), para não competir com o LCP.
- **Pausa:** com menos de 15% visível.
- **Simultaneidade:** no máximo 1 vídeo tocando além do hero.
- **Sem vídeo:** com `saveData`, `effectiveType` slow-2g/2g/3g ou modo reduzido, nunca carrega o vídeo e fica o poster. No reduzido aparece um botão "Reproduzir vídeo" (Play, 44 px), que dispara `pushEvent("video_play",{video})`.
- **Autoplay bloqueado:** aparece o mesmo botão.

### 10.2 Imagens (`public/images/`, geradas por `scripts/otimizar-imagens.mjs` com `sharp`)
Cada origem gera AVIF e WebP em 3 larguras (828, 1440, 2200; os cartões em 640 e 1000), com `width`/`height` no `<img>`, `loading="lazy"` abaixo da dobra e `decoding="async"`. Os nomes publicados não carregam nome de cliente.

| Publicado | Origem (`referencia/imagens-site-atual/`) | Tipo | Uso |
|---|---|---|---|
| `hero-poster` | poster do Pexels 34775810 (w=1920 e w=828) | banco | H0 (LCP) e menu |
| `obra-parede-sistemas` | `4.jpg` | **real** | H4, menu (Contato) |
| `obra-cilindros-supressao` | `024-original.jpg` | **real** | H4, bloco dos cilindros |
| `app-splash` | `App_1.png` | **real** | tela 1 do `PhoneMock` |
| `app-webmaster-notebook` | `App_2.png` (WebP com alfa) | **real** | H5, A0, menu |
| `app-login-celular` | `App_3.png` (WebP com alfa) | **real** | A0, H7 (2021) |
| `kids-ong-colagem` | `Institucional_4.png` | **real** (rostos já borrados) | H9, I4 |
| `kids-ong-logo` | `logo_kids_ong.png` | **real** | H9, I4 |
| `catalogo-capa` | `Screenshot-2025-07-30-143726.png` | **real** | K0, menu |
| `servico-instalacao` | `Instalacao_1.jpg` | banco | H3/S1 01, menu |
| `servico-instalacao-2` | `Inspecao_1.jpg` | banco | S1 01 |
| `servico-projetos` | `Servicos_2.jpg` | banco | 02 |
| `servico-documentacao` | `architect-project-engineer-is-checking-house-building-quality-checklist-inspecting-1-1.jpg` | banco | 03 |
| `servico-inspecoes` | `Inspecao_2.jpg` | banco | 04 |
| `servico-gestao` | `Manutencao_1.jpg` | banco | 05 |
| `servico-riscos` | `Riscos_2.jpg` | banco | 06 |
| `servico-venda` | `Venda_2.jpg` | banco | 07 (poster do vídeo) |
| `servico-sinalizacao` | `Riscos_1.jpg` | banco | 08 |
| `setor-financeiro-tecnologia-saude` | `Inspecao_1.jpg` (recorte diferente do 01) | banco | H8, C2 |
| `setor-industrial-agronegocio` | `Servicos_1.jpg` | banco | H8, C2 |
| `setor-energia-transporte` | `Home_Image_1-e1754481613736.png` (RGBA) | banco | H8, C2 |
| `co2-cilindros` | `Home_BG_1-1.jpg` | banco | S0 |
| `valvulas-sprinkler` | `Design_sem_nome.png` (recorte; conferir banding e gerar WebP com alfa) | banco | S0 |
| `institucional-pilar` | `Institucional_3.png` | banco | I0, menu |
| `institucional-maos` | `Institucional_7.png` | banco | H9, I3 |
| `institucional-paisagem` | `Institucional_8.jpg` | banco | I3 (textura) |
| `institucional-extintor` | `Institucional_2.png` | banco | K1 |
| `clientes-aperto` | `Clientes_1.jpg` | banco | C0, menu |
| `logo-kidde`, `logo-everlux` (+ `logo-everlux-branco` de `2.png`), `logo-notifier`, `logo-vesda`, `logo-simplex`, `logo-bosch`, `logo-firebee`, `logo-germek`, `logo-abspk`, `logo-nfpa` | `4.png`, `3.png`, `2.png`, `5.png`, `6.png`, `Simplex.png`, `BOSCH.png`, `FIREBEE.png`, `LOGO-GRMK-AZUL-GERMEK.png`, `ABSPK.png`, `NFPA.png` | logos | H2, C3 (aparados com `trim()`, WebP 360 px) |
| `protecin-wordmark` | `Ativo-1.png` (1200 px, PNG com alfa, para máscara) | marca | Logo |
| `favicon.svg` + `apple-touch-icon.png` | `Symbol` + `cropped-SIMBOLO.png` | marca | `<head>` |
| `og-protecin.jpg` (1200x630) | `hero-poster` + símbolo + H1 (gerado no `sharp`) | composição | OG de todas as rotas |

Nenhuma foto de banco recebe legenda de "equipe", "obra" ou "cliente". Só as fotos reais levam "Foto do acervo Protecin".

**Não usar:** `Team-*`, `Testi-*`, `Icon-*`, `Image-1.jpg`, `Image-2.jpg`, `Logo-1..4.png`, `Logo-Fire-01.png`, `teste-1*.png`, `placeholder*.png`, todas as fotos de bombeiro (`*firefighter*`, `with-notepad-*`), `ecofriendly_logo.png` (não é certificação) e `Design_sem_nome_16.png` (a tela é recriada em HTML).

---

## 11. CTAs e eventos de lead

Padrão do Extin Seven sem mudança:
- **Links reais:** todo CTA de contato é um `<a>` real (`https://wa.me/5511945651751?text=…`, `tel:+551149778720` ou `mailto:comercial@protecin.com.br?subject=…`).
- **Atributos:** cada um tem `data-lead-channel` (`whatsapp`, `phone` ou `email`) e `data-lead-location`.
- **Evento:** cada um dispara `trackLead(channel, location, detail)`, que gera `lead_click` no `dataLayer`.
- **Ads:** as conversões do Ads ficam no acionador de clique em link do GTM. O `lead_click` serve só para o GA4.

Valores de `lead_location`:

| Valor | Onde | `lead_detail` |
|---|---|---|
| `nav` | Botão WhatsApp da nav | — |
| `menu` | Rodapé do menu em tela cheia | — |
| `hero` | H0 (WhatsApp e telefone) | — |
| `servicos` | Cartões de H3 | slug do serviço |
| `plataforma` | H5 | — |
| `historia` | Painel 2026 de H7 | — |
| `orcamento` | Canais de H10 | — |
| `formulario` | "Enviar pelo WhatsApp" do formulário e o envio por e-mail | serviços escolhidos |
| `rodape` | Rodapé | — |
| `botao_flutuante` | Botão flutuante (desktop) | — |
| `barra_mobile` | Barra inferior (celular) | — |
| `pagina_institucional`, `pagina_servicos`, `pagina_clientes`, `pagina_catalogo`, `pagina_app`, `pagina_contato` | PageHero e corpo de cada página | slug, quando houver |
| `faixa_cta` | Faixa do fim das páginas internas | rota |

Outros eventos, todos por `pushEvent`, seguros no SSR:

| Evento | Parâmetros | Disparo |
|---|---|---|
| `form_open` | `form_location` | CTA "Solicitar orçamento" ou foco no primeiro campo |
| `form_step` | `step` (1, 2 ou 3) | Ao avançar de etapa |
| `form_lead` | `servicos`, `setor`, `cidade`, `demo` | Sucesso (junto do bloco `.msg-sucesso`) |
| `catalog_download` | `location` | Download do PDF |
| `service_open` | `servico` | Capítulo de `/servicos/` ativado pela primeira vez; "Detalhes" num cartão |
| `sector_open` | `setor` | Acordeão de H8 |
| `map_load` / `map_directions_click` | — | Mapa |
| `video_play` | `video` | Play manual (modo reduzido ou autoplay bloqueado) |
| `motion_toggle` | `mode` | `MotionToggle` e `MotionToast` |
| `virtual_page_view` | `page_path`, `page_title` | Toda troca de rota (no GTM, o acionador da tag de page_view do GA4) |

GTM no `index.html`:
- **Domínio:** o snippet do Seven, com regex `/(^|\.)protecin\.com\.br$/` e debug por `?gtm_debug=x` ou `?track=1`.
- **ID:** enquanto `COMPANY.gtmId` for `null`, o snippet não é emitido. Não inventar ID: é a pendência de GTM e Ads com o Gabriel.
- **Prévia:** `<meta name="robots" content="noindex, nofollow">` quando `VITE_BASE !== "/"`.
- **Documentação:** criar `TRACKING.md` com esta tabela.

---

## 12. `prefers-reduced-motion` e o modo reduzido

**Decisão:**
- **Preferência do sistema:** o site **respeita** `prefers-reduced-motion` (régua: "tudo visível e legível, sem movimento").
- **Escape:** o `MotionToast` e o `MotionToggle` permitem ligar o movimento, e a URL aceita `?motion=full` ou `?motion=reduced`.
- **Antes do primeiro quadro:** a classe `html.reduced` ou `html.motion` é aplicada no `<head>` (6.1).

| Peça | Modo completo | Modo reduzido |
|---|---|---|
| Lenis | Ligado (lerp 0.11) | Desligado (rolagem nativa; âncoras com `scrollIntoView` instantâneo) |
| `MotionConfig` | `reducedMotion="never"` | `reducedMotion="always"`: o framer zera transform e mantém opacidade |
| Presets de entrada | Como na tabela 4.2 | Só `fade` de 200 ms. `linha`, `palavra`, `cortina`, `monta`, `virada` e `carimbo` aparecem prontos |
| `acende` | Opacidade 0.18 → 1 pela rolagem | Texto inteiro em opacidade 1 |
| `PinStage` (H0, H4, H5, A1 e PageHero) | Cena fixada | `.pin--estatico`, conforme abaixo |
| H0 | Vídeo encolhe até a gota | Hero de 100svh com poster e H1 parados; abaixo, o símbolo montado (gota com o poster dentro e cantoneiras no lugar) e o manifesto aceso. Vídeo só pelo botão Play |
| H3 cartões | Pilha `sticky` com recuo | Cartões em fluxo normal, sem `sticky`, sem scale e sem véu |
| H4 | Câmera passeia pelos 5 pontos | Foto inteira com os 5 marcadores numerados fixos e os 5 cartões em lista abaixo |
| H5 | 4 pilares com dispositivos animados | Dispositivos parados (celular na tela de ordens e notebook) e os 4 pilares em lista, com o selo NBR e os chips visíveis |
| H7 | Trilho horizontal | Lista vertical (o layout do celular em todas as larguras), anos preenchidos e rail cheio |
| Marquees | Correm | Viram grade estática de logos (H2) ou linha de texto quebrada (S2, faixa CTA) |
| `Embers` | Canvas animado | Não monta. Fica a `luz-brasa` estática |
| `Odometer` | Rola | Valor final |
| Vídeos | Autoplay quando visíveis | Poster e botão Play |
| Parallax e `SectionRise` | Ligados | Desligados (`transform: none`) |
| Preloader | 900 ms na primeira entrada | Não aparece |
| Cortina de rota | Painel vermelho de cerca de 1 s | Fade de 200 ms |
| Hover | Rolagem de texto, ímã e tilt | Só mudança de cor e borda (200 ms) |
| `CursorMira` | Ligado (P2) | Desligado |

O verify roda os dois modos: emulando `prefers-reduced-motion: reduce` (deve mostrar o layout estático sem nada invisível) e com `?motion=full` (deve disparar todas as revelações).

---

## 13. Orçamento de desempenho

| Métrica | Meta | Como garantir |
|---|---|---|
| LCP (Lighthouse mobile, 4G simulado) | < 2,5 s | O LCP é o `<img>` do `hero-poster` (AVIF de 828 px com até 70 KB no celular e de 1920 px com até 160 KB no desktop), com `fetchpriority="high"` e preload `imagesrcset`. O vídeo entra depois do `load`. A animação do hero é CSS (não espera o JS). O preloader tem no máximo 900 ms, só na primeira visita, e é só CSS |
| CLS | < 0,1 | `width`/`height` em toda mídia. Fonte de títulos com preload. Altura fixa no cartão do formulário (desktop). Acordeões só por clique. Nada de animação de layout ligada à rolagem |
| INP | < 200 ms | Sem trabalho pesado no `pointermove` (só `MotionValue.set`). `getBoundingClientRect` só no `pointerenter` ou no resize |
| JS inicial (gzip) | ≤ 200 KB | React + ReactDOM (cerca de 45 KB) + framer-motion (cerca de 60 KB) + Lenis (cerca de 5 KB) + app. Sem Three.js nem GSAP. Ícones Lucide importados um a um |
| CSS (gzip) | ≤ 25 KB | Tailwind com `content` correto |
| Fontes | ≤ 130 KB | Archivo latino wdth (preload) + JetBrains Mono latino |
| Peso da home sem vídeo, rolada até o fim | ≤ 1,8 MB (régua: < 2 MB) | Tetos de imagem: poster 150 KB; `obra-parede-sistemas` 170 KB; `obra-cilindros-supressao` 130 KB; 8 cartões de serviço a 60 KB (480 KB); 3 setores a 40 KB (120 KB); App_2 + splash 140 KB; App_3 40 KB; poster do vídeo do tablet 35 KB; Kids ONG 110 KB; 10 logos a 8 KB (80 KB); wordmark 12 KB. Isso soma cerca de 1,47 MB em imagens; com JS, CSS e fontes (até 355 KB), o total fica em cerca de 1,8 MB |
| Peso na primeira carga (sem rolar) | ≤ 700 KB | Tudo abaixo da dobra com `loading="lazy"` |
| Vídeo | ≤ 6 MB por clipe (régua) | Hero com no máximo 5,9 MB (cerca de 3 MB com reencode), os outros com até 2,4 MB. `preload="none"`, `src` perto da tela, pausa fora |
| Quadros por segundo | Desktop ≥ 60; celular com CPU 4x ≥ 40 | Só `transform` e `opacity` na rolagem. `will-change` só nas camadas da cena ativa. 1 canvas por vez. Medir com `Indafire/site-novo/scripts/medir-desempenho.mjs` |

Outras regras de desempenho:
- `overflow: clip` em todo palco.
- `content-visibility: auto` com `contain-intrinsic-size` em H8, H9 e no rodapé. Nunca nas cenas fixadas.
- Embers com no máximo 90 partículas no desktop e 40 no celular, e `dpr` limitado a 2.
- Imagens de cena fixada com `decoding="async"` e `loading="eager"` só quando estão a 1 tela de distância (troca por `IntersectionObserver` com `rootMargin: "100% 0px"`).

---

## 14. QA: ajustes para esta direção

1. **`qa/capturar.mjs`:** o teste de "vazando" tem que considerar o recorte dos ancestrais. Cenas como `DropWindow` em scale 6, trilhos e marquees ficam fora da tela por design, mas recortadas. Proposta: para cada elemento, intersectar o `getBoundingClientRect()` com o retângulo de cada ancestral cujo `overflow-x` não seja `visible` (`clip`, `hidden`, `auto` ou `scroll`). Só marcar se a área visível resultante passar de `vw + 2` ou for menor que -2. A `rolagemHorizontal` continua como está.
2. **Verify** (adaptado de `Indafire/site-novo/scripts/verify.mjs`):
   - **Opacidade efetiva nas cenas fixadas:** dentro de `[data-pin-stage]`, o verify amostra a cena em p = 0, 0.25, 0.5, 0.75 e 1 (rola até o ponto e espera 600 ms). Cada elemento com texto ou mídia precisa ter opacidade efetiva de pelo menos 0.9 em alguma amostra (5.3). Fora das cenas, vale a checagem normal da Indafire.
   - **Cobertura:** cobertura por `data-motion` de pelo menos 95%.
   - **Modos:** os testes "sem JS" e "`animation:none`" (nada invisível), e os dois modos de movimento (seção 12).
   - **Links:** todos os `wa.me` no formato `^https://wa.me/5511945651751(\?text=|$)`.
3. **Rotas da captura:** são as mesmas do script atual, mais `/404.html`.
4. **Régua, conferências específicas desta direção:**
   - Parágrafos com pelo menos 16 px no celular e 17 px no desktop.
   - Alvos de toque de pelo menos 44 px.
   - Rótulos mono com pelo menos 13 px.
   - Nenhum CTA com texto branco sobre `#E8442E`.
   - "Solicitar orçamento" visível acima da dobra em 1440x900 e em 390x844.

---

## 15. Ordem de construção sugerida

1. **P0, esqueleto:** configs do Seven, tokens, fontes, `router.tsx` + prerender multirrotas, `motion-pref`, seguro do `<head>`, Nav, Menu, Cortina, Rodapé, `cta.tsx` e `site.ts` completo.
2. **P0, home:** H0 (`DropWindow` + símbolo), H1, H2, H3, H4, H5, H7 e H10 com o formulário.
3. **P0, internas:** `PageHero`, as 6 páginas com os componentes reaproveitados, a Faixa CTA e a 404.
4. **P1:** H6, H8, H9, Preloader, `ScrollFuse`, `CookieNotice`, `MotionToast`, a repulsão das Embers, as fitas de S2 e a capa 3D.
5. **P2:** `CursorMira`, `fogo-final` e a imagem OG composta.
6. **QA:** ajuste do `capturar.mjs`, verify nos dois modos, Lighthouse mobile, medição de quadros e revisão das capturas faixa a faixa.
7. **Publicação:**
   - **Repositório:** sugestão `protecin-demo`, com `VITE_BASE=/protecin-demo/`.
   - **Portas:** 5185 para o dev e 4185 para o preview (o Seven usa 5175/4180 e a Indafire 4351/4361).
   - **Deploy:** `gh-pages -d dist --nojekyll` (ou o `deploy-gh.mjs` com trava de remoto), com `noindex`.

---

## 16. Pendências [confirmar com a Protecin]

- Arquivos oficiais do logo (SVG e versão negativa).
- Kids ONG: "sete anos" (texto de 2025) e "fundador da Protecin" contra "fundação pela Extimbrás".
- Natureza da relação com Bosch, VESDA, Firebee e Germek (a demo usa "Marcas com que trabalhamos").
- Autorização para exibir `4.jpg` e a foto dos cilindros como "acervo", sem nome nem local.
- Vídeos e fotos reais da operação (sede da Rua Lacônia, frota, recarga, teste hidrostático, técnico usando o app). Eles substituem os vídeos de banco.
- Logos de clientes e depoimentos: a demo não tem essas seções. Se vierem, entram como uma seção nova entre H2 e H3.
- Texto da política de privacidade.
- ID do GTM e conversões do Ads (pendência com o Gabriel).
