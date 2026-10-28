# Direção 2: "Engenharia de precisão"

Direção de arte e de motion do site novo da Protecin (demo de redesign no GitHub Pages).
Data: 28/10/2026. Fontes: `conteudo-estruturado.md`, `pesquisa-mercado.md`, `padroes-codigo.md`, `videos.md` e as imagens de `imagens-site-atual/` (logo, `4.jpg`, `024-original.jpg`, `Home_BG_1-1.jpg`, `Design_sem_nome.png`, `App_2.png` e `Design_sem_nome_16.png` foram abertos para tirar paleta, coordenadas e rótulos).

Regras que valem para o documento inteiro:
- **Conteúdo:** todo texto entre aspas é literal do site atual. Onde houve ajuste, ele está marcado como **[ajuste]**. Nada de número, cliente, certificação, depoimento ou estado inventado.
- **Mockups:** as telas da plataforma reproduzem só rótulos que existem nas telas reais (`App_2.png`, `App_3.png`, `Design_sem_nome_16.png`). Dados de cliente aparecem como barras-esqueleto, como nas imagens originais. Gráficos não têm eixo nem número.
- **Regra zero do motion:** nenhum elemento visível fica sem coreografia. Isso inclui texto legal do rodapé, divisórias, ícones, inputs e logos. A verificação automática exige cobertura de animação de pelo menos 98% (seção 12).
- **Atalhos de motion:** `Reveal`, `SplitWords`, `ClipReveal`, `Magnetic`, `VelocityMarquee` e `ParallaxImage` são os do Seven (`padroes-codigo.md` §4). As primitivas novas estão na seção 8.

---

## 1. Conceito e por que vende

**O site como prancha técnica sendo executada.** A Protecin vende engenharia, inspeção, manutenção e rastreabilidade. O site se comporta como um desenho técnico ganhando forma diante do visitante:
- a grade de prancheta aparece primeiro;
- as linhas se desenham, as cotas medem e os números são aferidos;
- os sistemas de incêndio acendem camada por camada;
- a plataforma se monta peça por peça.

O fundo é claro ("papel técnico"), com momentos em azul-marinho que funcionam como cianotipia, o blueprint clássico de traço claro sobre azul. O azul da marca, `#0E3452`, já é esse azul.

**Motivo de marca: as cantoneiras.** O símbolo da Protecin é um quadrado formado por quatro cantoneiras (a superior direita é vermelha) com uma gota no centro. Elas lembram marcas de registro de prancha e o quadro de foco de uma câmera. Viram a primitiva `FocusBrackets`:
- as quatro cantoneiras "travam" em volta de tudo que recebe foco: imagens, cards, botões e campos;
- no preloader, elas se fecham para formar o logo;
- no CTA final, elas prendem o fogo dentro da gota.
É um motivo de motion que nenhum concorrente pode copiar, porque é a própria marca.

**Por que vende:**
1. **Posicionamento de engenharia com prova.** Os líderes do setor (Smart Fire, SWB) se vendem como "engenharia" (pesquisa §1.2). A direção mostra engenharia em vez de só afirmar: diagrama, cotas, normas citadas pelo número (NBR 12962, NBR 12779), ART e AVCB.
2. **Escopo inteiro em um minuto.** O diagrama do sistema (seção S3) mostra os seis sistemas que a Protecin instala, inspeciona e mantém. Hoje o site espalha isso por 6 cards e 7 subpáginas com nomes diferentes.
3. **O diferencial que ninguém tem.** A plataforma própria (desde 2021) aparece funcionando: app em campo, painel do gestor, coleta online e relatório chegando ao cliente. Nenhum dos 7 concorrentes analisados mostra software próprio.
4. **Escala aferida.** 20.000+ clientes, 3M+ equipamentos, 5M+ inspeções e 250+ obras aparecem em odômetro sobre régua. Os concorrentes mostram 500+ e 1.000+.
5. **O site dos 50 anos.** Um mostrador de 50 traços (um por ano, de 1976 a 2026) e uma linha do tempo em escala real com quebra de escala.
6. **Credibilidade B2B.** O visual claro, preciso e sem foto de bombeiro conversa com síndico, facilities, engenheiro e comprador industrial. Ele se separa do vermelho escuro genérico do setor.
7. **Conversão medida.** Há "Solicitar orçamento" em toda dobra, WhatsApp com mensagem por serviço, telefone clicável e um configurador de solicitação. Todos os eventos já estão no padrão `lead_click` do Seven, prontos para o GTM e o Ads do Gabriel.

---

## 2. Paleta (tokens)

Base amostrada do logo `Ativo-1.png`: azul `#0E3452` e vermelho `#BE1E29`. Variante `SIMBOLO.png`: laranja `#E8442E`. As escalas derivam dessas três cores.

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `papel-50` | `#FAFBFC` | cards, campos, superfícies elevadas | |
| `papel-100` | `#F3F6F9` | **fundo da página** | |
| `papel-200` | `#E6ECF2` | linhas menores da grade, faixas | |
| `papel-300` | `#D3DCE5` | linhas maiores da grade, bordas, divisórias | |
| `grafite-400` | `#8796A5` | traços de régua, ícones inativos | 2,8:1, **nunca em texto** |
| `grafite-500` | `#5D6D7E` | texto secundário, legendas | 4,9:1 sobre `papel-100` (AA) |
| `tinta` | `#0B1D2E` | texto principal | 15:1 |
| `marinho-950` | `#071A2C` | fundo da cianotipia (seções escuras) | |
| `marinho-900` | `#0A2741` | cianotipia, gradiente | |
| `marinho-800` | `#0E3452` | **marca**: títulos, bordas ativas, header do app | 11,9:1 sobre papel |
| `marinho-700` | `#17466B` | hover de botões secundários | |
| `marinho-600` | `#235A86` | linhas de diagrama ativas sobre papel | |
| `marinho-500` | `#3A77A8` | fios de alarme no diagrama | |
| `marinho-300` | `#9DB8D0` | traço de blueprint sobre marinho | 7,4:1 sobre `marinho-900` |
| `marinho-100` | `#E3ECF4` | realce de item de legenda, chips selecionados claros | |
| `vermelho-700` | `#971820` | varredura de hover do botão primário | |
| `vermelho-600` | `#BE1E29` | **marca**: botão primário, destaques, cantoneira superior direita | 5,7:1 sobre papel; branco sobre ele 6,2:1 |
| `vermelho-500` | `#D3323A` | hover de links vermelhos | |
| `vermelho-100` | `#FBE6E7` | fundo de chip de norma | |
| `sinal-500` | `#E8442E` | **marca alternativa**: ponto "ativo", ponta da caneta que desenha, pacotes de dados, números de passo ativos | 3,7:1: só elemento gráfico ou texto ≥ 24 px |
| `conforme-600` | `#1E8A5A` | "check" de conformidade e status ok nos mockups | só ícone ou UI |
| `fotolum-300` | `#D8F36A` | brilho das placas fotoluminescentes (camada Sinalização) | só gráfico |
| `whatsapp` | `#25D366` | só no botão flutuante de WhatsApp | |

Grade de prancheta: no papel, a linha menor é `papel-200` e a maior é `papel-300`. Na cianotipia, as duas usam `marinho-300`, com 7% e 16% de opacidade.

Tailwind (`tailwind.config.js`, mesma estrutura do Seven):

```js
colors: {
  papel:   { 50: "#FAFBFC", 100: "#F3F6F9", 200: "#E6ECF2", 300: "#D3DCE5" },
  grafite: { 400: "#8796A5", 500: "#5D6D7E" },
  tinta: "#0B1D2E",
  marinho: { 950: "#071A2C", 900: "#0A2741", 800: "#0E3452", 700: "#17466B", 600: "#235A86", 500: "#3A77A8", 300: "#9DB8D0", 100: "#E3ECF4" },
  vermelho:{ 700: "#971820", 600: "#BE1E29", 500: "#D3323A", 100: "#FBE6E7" },
  sinal: "#E8442E", conforme: "#1E8A5A", fotolum: "#D8F36A", whatsapp: "#25D366",
},
borderRadius: { prancha: "4px" },   // precisão = cantos quase retos; o máximo é 4 px (o Seven usa 28 px)
```

---

## 3. Tipografia (Fontsource)

São as mesmas três famílias do Seven, que já estão no lockfile e não acrescentam dependência nova. O desenho tipográfico muda: títulos leves e largos, que ecoam o wordmark fino e geométrico da Protecin.

| Papel | Pacote (versão em 28/10/2026) | Import | Configuração |
|---|---|---|---|
| Títulos e números | `@fontsource-variable/archivo` 5.3.0 | `import "@fontsource-variable/archivo/wdth.css"` | eixos `wght` 100–900 e `wdth` 62–125 |
| Texto | `@fontsource-variable/inter` 5.3.0 | `import "@fontsource-variable/inter"` | `font-feature-settings: "cv11","ss01"` |
| Técnico (rótulos, cotas, normas) | `@fontsource-variable/jetbrains-mono` 5.3.0 | `import "@fontsource-variable/jetbrains-mono"` | `tabular-nums` |

Escala:

| Estilo | Família | Tamanho | Peso / largura | Entrelinha / espaçamento |
|---|---|---|---|---|
| `display-1` (H1) | Archivo | `clamp(2.6rem, 6.2vw, 6.25rem)` | 300 / `wdth 112` | 0,98 / -0,035em |
| `display-2` (H2) | Archivo | `clamp(2rem, 4.2vw, 3.75rem)` | 350 / `wdth 110` | 1,04 / -0,03em |
| `numero` (contadores, anos) | Archivo | `clamp(3.5rem, 8vw, 8.5rem)` | 200 / `wdth 125`; hover vai para `wdth 112` peso 300 | 1 / -0,04em, `tnum` |
| `h3` | Archivo | `1.375rem` | 500 / `wdth 100` | 1,2 / -0,01em |
| `corpo` | Inter | `1.0625rem` (17 px) | 400 | 1,6 |
| `corpo-p` | Inter | `0.9375rem` | 400 | 1,55 |
| `rotulo` | JetBrains Mono | `0.75rem` | 500, maiúsculas | 1,3 / +0,14em |
| `cota` | JetBrains Mono | `0.6875rem` | 500 | 1 / +0,08em, `tnum` |
| `botao` | Inter | `0.9375rem` | 600 | 1 / +0,01em |

Fonte de fallback com `size-adjust` medido, para manter o CLS em até 0,05. Só os arquivos `latin` são carregados (os pacotes do Fontsource já separam por subset).

---

## 4. Tokens de motion

```ts
// src/lib/motion-tokens.ts
export const EASE = {
  saida:   [0.16, 1, 0.3, 1],      // entradas (EASE_OUT do Seven)
  trilho:  [0.65, 0, 0.35, 1],     // varreduras, linhas, cortinas (EASE_IN_OUT do Seven)
  encaixe: [0.34, 1.56, 0.64, 1],  // peças que "encaixam" com leve passada (mockups, carimbos)
} as const;
export const DUR = { micro: 0.16, curto: 0.32, medio: 0.6, longo: 0.9, desenho: 1.2 } as const;
export const STAGGER = { palavra: 0.06, linha: 0.08, card: 0.08, celula: 0.04, tick: 0.012, char: 0.018 } as const;
export const SPRING = {
  encaixe: { type: "spring", stiffness: 420, damping: 32, mass: 0.6 },  // cantoneiras, componentes de UI
  ima:     { type: "spring", stiffness: 220, damping: 16, mass: 0.4 },  // Magnetic (Seven)
  trilho:  { stiffness: 120, damping: 30, mass: 0.4 },                  // suavizar scrollYProgress (Seven Works)
  mira:    { stiffness: 300, damping: 30, mass: 0.3 },                  // cursor de coordenadas
} as const;
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const; // revela com ~12% dentro da tela
```

Padrões globais, que valem salvo indicação contrária na seção:

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| H1 e H2 | `SplitWords` com `rotate: 0` (precisão: sem giro), `y 110% → 0`, `DUR.longo`, `EASE.saida`, `STAGGER.palavra` | H2 com `y 0 → -16px` ao sair (ParallaxText leve) | – |
| Rótulo de seção ("02 — Sistema") | linha de 32 px desenha (`scaleX 0→1`, 400 ms, trilho) e, em seguida, `TextScramble` (≤ 600 ms) | – | – |
| Parágrafo | `Reveal` com `y 12` (não 28), `opacity 0→1`, 700 ms, saída, atraso de +150 ms depois do título | – | – |
| Divisória ou borda de seção | `DrawLine` `scaleX 0→1` a partir da esquerda, 1000 ms, trilho | – | – |
| Marcas de registro "+" nos 4 cantos de cada seção | cada traço desenha (`pathLength`, 300 ms), stagger de 60 ms | – | – |
| Ícone | `DrawIcon` com traço `pathLength 0→1`, 900 ms, trilho | – | redesenha (0→1 em 400 ms) |
| Imagem | `ClipReveal` com cantos de 4 px (`inset(100% 0 0 0) → inset(0)`, 1100 ms, trilho) e imagem interna `scale 1.12 → 1` em 1600 ms; as `FocusBrackets` travam ao terminar | `ParallaxImage` com `amount 6` | cantoneiras travam e a imagem vai a `scale 1.04` em 600 ms |
| Card | borda desenhada (SVG `rect`, `pathLength 0→1`, 900 ms) seguida do conteúdo em `Reveal`; stagger de 80 ms entre cards | – | `y -4` (encaixe), cantoneiras travam, ícone redesenha, título vai de `marinho-800` a `vermelho-600` |
| Número | `Odometer` (seção 8.2) | – | `wdth 125 → 112` em 400 ms |
| Chip ou tag | `opacity` + `x -8 → 0`, 400 ms, stagger de 40 ms, texto com `TextScramble` | – | fundo `marinho-100` em 160 ms |
| Link de texto | `Reveal` | – | sublinhado desenha da esquerda (`scaleX`, 300 ms) |
| Input | `Reveal`, depois a linha inferior desenha | – | `focus-within`: as cantoneiras travam (encaixe), o rótulo sobe e diminui (`y -18`, `scale .86`, 240 ms) |

Botões (componentes `PrimaryCta`, `SecondaryCta` e `WhatsAppCta`):
- **Visual:**
  - altura de 52 px (48 no celular), padding `0 22px`, `rounded-prancha`;
  - primário: fundo `vermelho-600`, texto branco;
  - secundário: borda de 1 px `marinho-800`, texto `marinho-800`.
- **Entrada:** `opacity` + `y 12 → 0`, 600 ms, saída, com stagger de 80 ms entre botões vizinhos.
- **Hover (ponteiro fino):**
  - o fundo varre da esquerda (primário: `vermelho-700`, `scaleX 0→1`, `origin-left`, 420 ms, trilho; secundário: `marinho-800` subindo de baixo, `scaleY`);
  - o texto rola: duas cópias em `overflow:hidden` sobem 100% em 320 ms, saída;
  - a seta sai pela direita e reentra pela esquerda em 280 ms;
  - as `FocusBrackets` aparecem a 6 px do botão (encaixe);
  - `Magnetic` com força 0,2.
- **Clique:** `scale .97` em 120 ms.
- **Foco por teclado:** contorno de 2 px `sinal-500` com offset de 3 px, mais as cantoneiras.
- **Toque:** sem hover; no `pointerdown`, `scale .97` e a varredura completa em 200 ms.

---

## 5. Mapa do site

As rotas **mantêm os slugs atuais** do WordPress. Assim o lançamento não precisa de 301 nas páginas principais. Todas terminam em `/`, porque o GitHub Pages serve `pasta/index.html`.

| Rota | Página | Prioridade |
|---|---|---|
| `/` | Home (a peça de venda, 14 seções) | P0 |
| `/nosso-app/` | Plataforma Protecin App | P1 |
| `/servicos/` | Índice dos 8 serviços | P1 |
| `/instalacao-de-sistemas-e-equipamentos/` | Serviço 1 | P1 (template) |
| `/projetos-tecnicos/` | Serviço 2 | P1 |
| `/documentacao-e-regularizacao/` | Serviço 3 | P1 |
| `/inspecoes-e-manutencoes-preventivas/` | Serviço 4 | P1 |
| `/manutencao-de-equipamentos/` | Serviço 5 | P1 |
| `/gestao-de-riscos-e-consultoria/` | Serviço 6 | P1 |
| `/venda-de-equipamentos/` | Serviço 7 | P1 |
| `/sinalizacao-de-seguranca/` | Serviço 8 (slug novo; não existe hoje) | P1 |
| `/institucional/` | Quem somos, história, MVV, ESG | P1 |
| `/nossos-clientes/` | Setores e parcerias | P2 |
| `/catalogo-digital/` | Catálogo | P2 |
| `/contato/` | Contato e configurador | P1 |

**Roteamento (sem dependência nova):**
- `usePath()` lê `location.pathname` sem o `import.meta.env.BASE_URL`.
- `RouterLink` intercepta cliques internos sem tecla modificadora e chama `history.pushState`, com transição de página (seção 6.18).
- O evento `popstate` também troca a rota.
- Links para âncoras de outra página (`/contato/#orcamento`) trocam a rota e depois chamam `scrollToHash`.

**Prerender:** o `scripts/prerender.mjs` do Seven passa a percorrer `ROUTES` de `site.ts`:
- chama `render(url)` e grava `dist/<rota>/index.html`, com `title`, `description`, `canonical` e `og:*` de cada rota trocados num marcador `<!--head-->`;
- copia o `index.html` da raiz para `dist/404.html`;
- gera o JSON-LD só com dados reais: `ProfessionalService` (nome, telefone, e-mail, endereço, `sameAs` Instagram/LinkedIn, `hasOfferCatalog` dos 8 serviços) e `WebSite`;
- **não gera `FAQPage`**, porque não existe FAQ real.

**Ordem da Home (âncoras):**
`#topo` Hero → `#numeros` → `#sistema` (fixada) → `#servicos` → `#na-pratica` → `#plataforma` (fixada, cianotipia) → `#credibilidade` → `#historia` (fixada, horizontal) → `#setores` → `#responsabilidade` → `#catalogo` → `#manifesto` (cianotipia) → `#orcamento` → `#contato` → rodapé.

Cada seção tem uma "folha" no rótulo mono, do tipo `FOLHA 03/14`. É ornamento de prancha e não representa nenhum dado.

**Breakpoints:**
- Tailwind padrão: `sm 640`, `md 768`, `lg 1024`, `xl 1280`.
- **Seções fixadas (pin)** só quando `(min-width: 1024px) and (min-height: 640px)`, com `useIsDesktop` começando em `false` (padrão do Seven para a hidratação). Celular deitado (844×390) cai no layout de celular.
- **Container:** `max-w-[1360px] mx-auto px-4 md:px-8 lg:px-12`. Celular com 16 px de gutter e sem rolagem horizontal (`overflow-x: clip` no body).
- **Grid:** 12 colunas com gap de 24 px. Os espaçamentos verticais são múltiplos de 24 px (a grade da prancheta), para a composição cair na grade.

---

## 6. Home, seção por seção

Convenção dos tempos: **t = 0** é o momento em que o elemento cruza `VIEWPORT` (ou o fim do preloader, no hero). "Scrub" significa ligado diretamente ao `scrollYProgress` da seção, suavizado com `SPRING.trilho`.

### 6.0 Preloader "Calibração"

- **Layout:** tela cheia `papel-100` com a grade de prancheta. Ao centro fica o símbolo SVG com 96 px (72 px no celular). Abaixo dele, em mono, aparecem o odômetro de ano e o rótulo.
- **Conteúdo:** símbolo vetorizado (seção 8.3), odômetro "1976 → 2026" e rótulo "50 ANOS".
- **Coreografia na primeira visita da sessão** (`sessionStorage "pt-intro"`, em try/catch):

| t | Elemento | Movimento |
|---|---|---|
| 0 | grade | `opacity 0→1`, 200 ms |
| 100 ms | 4 cantoneiras | voam dos 4 cantos da tela até o centro: `x/y` dos cantos `→ 0`, `SPRING.encaixe`, stagger de 50 ms (sup. esq. marinho, sup. dir. vermelha, inf. esq., inf. dir.) |
| 450 ms | gota | contorno desenha (`pathLength 0→1`, 350 ms, trilho) e depois preenche (`fill-opacity 0→1`, 200 ms) |
| 450 ms | odômetro | 1976 → 2026 (700 ms, saída); "50 ANOS" faz `TextScramble` ao terminar |
| 1150 ms | saída | o símbolo faz morph até o símbolo do logo na nav (`layoutId="simbolo"`, 500 ms, trilho); o painel sobe com `clipPath inset(0 0 0 0) → inset(0 0 100% 0)` em 450 ms, trilho; `onExitComplete` chama `lockScroll(false)` |

- **Duração:** no máximo 1,6 s na primeira visita. Nas seguintes, só o morph do símbolo, em 350 ms.
- **Estados:** com motion suave não há preloader, só um fade da página em 200 ms. Com `<noscript>`, fica escondido (`.pt-preloader{display:none!important}`).
- **Rolagem:** travada durante o preloader (padrão do Seven: `lockScroll` antes do Lenis nascer).

### 6.1 Nav (global)

**Layout desktop:**
- altura de 72 px, fundo `papel-50` com 85% de opacidade e `backdrop-blur-md`, borda inferior de 1 px `papel-300`;
- à esquerda, o logo: símbolo SVG mais o wordmark de `Ativo-1.png` recortado, com 28 px de altura;
- no centro, os links "Institucional · Serviços · Nosso App · Clientes · Catálogo · Contato";
- à direita, um ícone de telefone (`PhoneLink`) e "Solicitar orçamento" (`PrimaryCta` pequeno, 40 px).

**Layout celular:** 64 px, com o logo e dois botões: WhatsApp (ícone) e menu (ícone de duas linhas).

**Motion:**
- **Entrada (depois do preloader):**
  - a borda inferior desenha da esquerda (900 ms, trilho);
  - o wordmark aparece com `clipPath inset(0 100% 0 0) → inset(0)` em 700 ms, trilho, com atraso de 200 ms;
  - os links fazem `opacity` + `y -8 → 0` em 500 ms, stagger de 50 ms;
  - o CTA entra por último.
- **Rolagem:** padrão do Seven: fundo sólido depois de 40 px e esconde ao descer depois de 420 px (`y -120%`, 500 ms, saída). A seção ativa é marcada por um quadrado vermelho de 6 px sob o link, que desliza com `layoutId="nav-ativo"` (spring 380/30). A seção ativa vem de IntersectionObserver com `-35% 0px -55% 0px`.
- **Hover nos links:** texto que rola, mais um tick de 1 px que nasce embaixo (`scaleX`, 240 ms).

**Menu do celular:**
- abre com um retângulo que cresce a partir do botão: `clipPath inset(0 0 calc(100% - 64px) calc(100% - 64px))` → `inset(0)`, 600 ms, trilho;
- fundo `papel-100` com a grade;
- links grandes em Archivo, numerados `01..07`, entram com `y 24 → 0` e stagger de 60 ms;
- embaixo ficam WhatsApp e "Ligar" (`lead_location: menu_mobile`);
- leva `data-lenis-prevent`, aplica `lockScroll(true)` e fecha com Esc.

**Barra de progresso:** 2 px no topo, `marinho-800`, `scaleX` pelo `scrollYProgress` (spring do Seven), sobre uma régua de ticks `papel-300` a cada 10%.

### 6.2 S1 Hero "Prancha" (`#topo`)

**Layout desktop (1440×900):**
- **Altura:** `min-h-[100svh]`.
- **Fundo:** `papel-100` com `BlueprintGrid`, esmaecido nas bordas com máscara radial.
- **Coluna 1–6:**
  - rótulo mono;
  - H1 em 3 linhas;
  - linha complementar;
  - parágrafo com `max-w-[52ch]`;
  - linha de CTAs;
  - linha mono com o telefone.
- **Coluna 7–12, a "Prancha":**
  - janela 16:11 com o vídeo do hero (poster `Home_BG_1-1.jpg`), contornada pelas `FocusBrackets`;
  - cota horizontal acima da janela ("1976 ———— 2026") e cota vertical à direita ("50 ANOS");
  - no canto superior direito, o **mostrador dos 50 anos**: círculo de 132 px com 50 traços radiais e "50" ao centro, sobreposto à janela em 40%;
  - no canto inferior esquerdo, o recorte `Design_sem_nome.png` (estação de válvulas, fundo transparente) com 46% da largura da coluna, sobrepondo a janela em 18%;
  - 2 chamadas (`Callout`) com fio de chamada até rótulos mono: na janela, "Sistemas fixos e de supressão"; no recorte, "Instalação e manutenção".
- **Faixa inferior, na dobra (largura total):**
  - linha superior;
  - à esquerda, o rótulo "AUTORIZAÇÕES OFICIAIS" e os 4 logos (Kidde, Everlux, Notifier, Simplex) com 28 px de altura, em monocromático `marinho-800` a 70%;
  - à direita, "Filiações" com ABSpk e NFPA.
- **Indicador de rolagem:** "ROLE" em mono com uma linha vertical de 40 px.

**Layout celular (390×844):**
- **Ordem:** rótulo, H1 (`display-1` no menor clamp), linha complementar, parágrafo e CTAs empilhados com largura total. O primário é "Falar no WhatsApp", porque no celular ele converte mais. O secundário é "Solicitar orçamento".
- **Janela:** fica abaixo, em 4:3, com o mostrador de 80 px no canto superior direito. O recorte de válvulas, as chamadas e as cotas verticais são omitidos. A cota horizontal fica.
- **Faixa:** grid 2×2 de logos, com "Filiações" embaixo.

**Conteúdo exato:**
- **Rótulo:** "ENGENHARIA E PROTEÇÃO TÉCNICA CONTRA INCÊNDIO · DESDE 1976". É o descritor da capa do catálogo mais o ano de fundação.
- **H1:** "Protegendo vidas e patrimônios há 50 anos." **[ajuste: caixa normal]**, com "50 anos" em `vermelho-600`.
- **Linha complementar (`p.kicker`, Archivo 300, `1.375rem`, `grafite-500`):** "Inovando com responsabilidade, construindo o amanhã."
- **Parágrafo:** "Referência em engenharia e proteção técnica contra incêndio, a Protecin oferece soluções em inspeção e manutenção de equipamentos com foco em segurança, conformidade e atendimento sob medida."
- **CTAs:** "Solicitar orçamento" (`#orcamento`) e "Falar no WhatsApp" (`wa.me`, mensagem padrão).
- **Linha mono:** "ou ligue +55 11 4977-8720" (`PhoneLink`).
- **Mostrador:** "50" com a legenda circular "1976 · 2026" em mono.
- **Cotas:** "1976", "2026" e "50 ANOS".

**Coreografia (t = 0 no fim do preloader):**

| t | Elemento | Entrada |
|---|---|---|
| 0 | grade | máscara varre do canto superior esquerdo (`--p -20% → 120%`, 1200 ms, trilho) |
| 100 ms | rótulo | `TextScramble`, 500 ms |
| 200 ms | H1 | `SplitWords immediate`, 900 ms, saída, stagger de 60 ms (9 palavras terminam por volta de 1,6 s); "50 anos" pinta de `tinta` a `vermelho-600` aos 1,4 s (300 ms) |
| 300 ms | janela | `clipPath inset(6% round 4px) → inset(0 round 4px)`, 1100 ms, trilho; poster `scale 1.12 → 1`, 1600 ms, saída. O estado inicial em 6% (e não 100%) deixa o poster pintado desde o primeiro quadro, por causa do LCP |
| 600 ms | cantoneiras da janela | `FocusBrackets` de `offset 24 / opacity 0` para `0 / 1`, `SPRING.encaixe`, stagger de 60 ms (sup. esq., sup. dir., inf. dir., inf. esq.) |
| 700 ms | linha complementar | `Reveal y 12`, 700 ms |
| 800 ms | parágrafo | `Reveal y 12`, 700 ms |
| 900 ms | cotas | linha e terminais desenham (`pathLength`, 900 ms, trilho); os rótulos fazem `TextScramble` ao fim |
| 950 ms | CTAs | `opacity` + `y 12`, 600 ms, stagger de 80 ms |
| 1000 ms | mostrador | 50 traços desenham em sequência (stagger de 12 ms, 600 ms no total), com o primeiro e o último em `vermelho-600`; "50" em odômetro 0 → 50 (700 ms); a legenda circular aparece em 300 ms |
| 1100 ms | recorte de válvulas | `opacity 0→1`, `y 40 → 0`, 1000 ms, saída |
| 1300 ms | chamadas | ponto `scale 0→1` (encaixe), um anel pulsa uma vez (`scale 1→2.2`, `opacity .5→0`, 900 ms), o fio desenha em 500 ms (trilho), o rótulo faz scramble; stagger de 180 ms |
| 1500 ms | faixa inferior | linha `scaleX 0→1` (900 ms, trilho); os logos fazem `opacity` + `y 8` com stagger de 70 ms |
| 1800 ms | indicador "ROLE" | fade; a linha faz `scaleY 0→1→0` com `origin top` em loop de 1600 ms, **só até a primeira rolagem** (depois some em 300 ms) |

**Vídeo:**
- o `src` só é atribuído depois de `load` mais `requestIdleCallback` (timeout de 1500 ms);
- no evento `canplay`, faz crossfade sobre o poster (600 ms);
- o loop é nativo;
- pausa fora da tela (IntersectionObserver).

**Rolagem (scrub, `offset ["start start","end start"]`):**
- conteúdo da esquerda: `y 0 → -8%` e `opacity 1 → .2`;
- janela: `y 0 → -14%`;
- recorte de válvulas: `y 0 → -28%` (camadas em velocidades diferentes);
- mostrador: `rotate 0 → 45deg`;
- grade: deriva `translateY 0 → -120px` por CSS scroll-driven (`BlueprintGrid`, seção 8.2).

**Hover e toque:**
- **`CoordCursor`**, só neste hero e no S3, com `pointer: fine`:
  - duas linhas de 1 px `marinho-800` a 18% cruzam o hero no ponteiro (`SPRING.mira`);
  - perto do ponteiro aparece a leitura mono `X 0482 · Y 0261` (pixels relativos à seção, 4 dígitos);
  - sobre a janela, as cantoneiras apertam 4 px e a leitura troca para "SISTEMA FIXO".
- Hover em logo da faixa: cor original (`filter: none`) em 240 ms, com as cantoneiras.
- Toque na janela: as chamadas pulsam uma vez.

**Mídia:**
- vídeo `public/videos/hero-supressao-720.mp4` (Pexels 34775810, 720p);
- poster `hero-poster` derivado de `Home_BG_1-1.jpg`, em AVIF e WebP, 1600w e 1024w;
- recorte `hero-valvulas.webp` (de `Design_sem_nome.png`; conferir o banding ao converter).
- **Antes de publicar, assistir os 8 s inteiros** (risco de marca "GASBASE.RU", `videos.md`). Se aparecer, trocar pelo Pexels 34775769 (720p) ou ficar com o poster e Ken Burns (`scale 1.06 → 1` em 8 s, uma vez).

**CTAs:** os dois botões do hero usam `lead_location: hero`. O telefone usa `PhoneLink location="hero"`.

### 6.3 S2 Números "Escala aferida" (`#numeros`)

**Layout desktop:**
- **Cabeçalho:** na coluna 1–7, o rótulo "01 — Escala" e o H2. Na coluna 8–12, o parágrafo.
- **"Tabela de medição":** abaixo do cabeçalho, 5 colunas iguais separadas por linhas verticais de 1 px `papel-300`. No topo de cada célula fica uma régua de 10 ticks (o 5º e o 10º mais longos). Depois vêm o número em `numero` e o rótulo em `corpo-p` `grafite-500`.

**Layout celular:** "50" ocupa a largura toda e os outros 4 ficam em grid 2×2, com divisórias horizontais e verticais.

**Conteúdo:**
- **H2:** "Mais de 20.000 clientes atendidos em 50 anos." **[ajuste: junta os dois contadores reais]**
- **Parágrafo:** "Desde 1976, a Protecin oferece soluções técnicas em prevenção e combate a incêndios, protegendo vidas e patrimônios com tecnologia, equipe especializada e estrutura sólida."
- **Células:**
  - "50", "anos de experiência (desde 1976)";
  - "20.000+", "clientes atendidos";
  - "3M+", "equipamentos manutenidos";
  - "5M+", "inspeções realizadas";
  - "250+", "obras de médio e grande porte realizadas".

**Coreografia:**
- **0 ms:** as divisórias verticais fazem `scaleY 0→1` a partir do topo, em 800 ms (trilho), com stagger de 80 ms.
- **150 ms:** as réguas desenham da esquerda, um tick por vez (stagger de 20 ms).
- **300 ms:** os `Odometer` rolam em 1400 ms (saída), com stagger de 120 ms por célula. Dentro de cada número, os dígitos têm stagger de 40 ms da direita para a esquerda.
- **Sufixos:** "+", "M+" e o separador "." entram depois do número, com `scale .6 → 1` (encaixe). Aparecem em `sinal-500` e passam para `vermelho-600` em 400 ms.
- **Rótulos:** `Reveal y 8`, com atraso de +200 ms em relação ao número da célula.

**Rolagem:** o H2 sobe 16 px ao sair. Mais nada (precisão = sossego).

**Hover e toque na célula:**
- fundo `papel-50` em 200 ms;
- a régua redesenha em 400 ms;
- o número muda de eixo (`wdth 125 → 112`, peso `200 → 300`) em 400 ms, saída.

**Prerender:** o odômetro renderiza o valor final no HTML (com `aria-label`). Ao montar, se a célula estiver abaixo da dobra, os dígitos vão a 0 sem transição e rolam no inView.

### 6.4 S3 Sistema "Camada por camada" (`#sistema`, **assinatura**)

É uma seção fixada com um diagrama isométrico em corte de uma edificação. Os seis sistemas que a Protecin atende acendem um por um.

**Layout desktop:**
- **Altura e fixação:** contêiner com `h-[600vh]` e filho `sticky top-0 h-screen`.
- **Coluna 1–4, painel lateral:**
  - rótulo "02 — Sistema" e H2 (só na fase de abertura; depois o H2 encolhe para `h3` no topo);
  - trilho vertical com 7 marcas: C-01 a C-06 e "Engenharia";
  - bloco da camada ativa: índice, nome, texto e chips de serviços com link.
- **Coluna 5–12:** o SVG do diagrama (`viewBox 0 0 1200 820`).
- **Rodapé da cena:** chips clicáveis das camadas, centralizados.

**Layout celular:**
- não há fixação por transform;
- o diagrama fica em `sticky top-[64px]` com `h-[56svh]`;
- abaixo dele rolam 7 cards de texto (`min-h-[70svh]` cada);
- a camada ativa é escolhida por `useInView(card, { margin: "-45% 0px -45% 0px" })`;
- os desenhos animam por tempo (800 ms) ao ativar, sem scrub e sem zoom de câmera;
- detalhes menores do SVG ficam ocultos (classe `.so-desktop`).

**Conteúdo:**
- **Abertura:**
  - H2: "Da elaboração de projetos à gestão contínua dos equipamentos." **[ajuste: primeira oração do subtítulo real]**
  - Corpo: "Da elaboração de projetos à gestão contínua dos equipamentos, oferecemos soluções completas para proteger pessoas, patrimônios e garantir a conformidade com normas técnicas e legais."
- **Camadas** (a cor é a do traço aceso):

| # | Camada | Texto do painel | Chips de serviço (link) | Cor |
|---|---|---|---|---|
| C-01 | Extintores | "Inspeções periódicas, testes hidrostáticos, manutenção em campo, repintura, limpeza e adequação técnica conforme exigências das NBRs e legislação vigente." **[ajuste: "da NBRs" → "das NBRs"]** · "Manutenção certificada pelo INMETRO, com rastreabilidade e garantia." | Inspeções e Manutenções Preventivas · Gestão e Manutenção de Equipamentos · Venda de Equipamentos | `vermelho-600` |
| C-02 | Hidrantes e mangueiras | "Linha completa de extintores, mangueiras, hidrantes, portas corta-fogo, sistemas de alarme e supressão." | Instalação de Sistemas e Equipamentos · Inspeções e Manutenções Preventivas | `vermelho-600` |
| C-03 | Sistemas de alarme | "Implantação de sistemas fixos e equipamentos contra incêndio com tecnologia atualizada, equipe especializada e componentes certificados para diferentes tipos de edificações e necessidades operacionais." | Instalação de Sistemas e Equipamentos | `marinho-500` (fios) + `sinal-500` (pulsos) |
| C-04 | Sistemas fixos e de supressão | "Soluções completas e personalizadas para implantação de sistemas fixos e equipamentos de combate a incêndio, com segurança, rastreabilidade e foco em alta performance." | Instalação de Sistemas e Equipamentos · Gestão e Manutenção de Equipamentos | `vermelho-600` |
| C-05 | Portas corta-fogo | "Linha completa de extintores, mangueiras, hidrantes, portas corta-fogo, sistemas de alarme e supressão." (o único texto real que cita portas) | Venda de Equipamentos | `marinho-800` |
| C-06 | Sinalização | "Implementação de sinalizações fotoluminescentes, orientativas, de emergência e salvamento conforme normas." | Sinalização de Segurança | `fotolum-300` (brilho) + `conforme-600` (rota) |
| Final | Engenharia | "Elaboração de projetos legais e executivos com emissão de ART, seguindo rigorosamente os requisitos técnicos, normativos e legais." · "Elaboração de laudos e programas por engenheiros das áreas Civil, Elétrica, Mecânica e de Segurança." | Projetos Técnicos · Documentação e Regularização · Gestão de Riscos e Consultoria | todas acesas |

**Carimbo final** (`StampBadge`, canto inferior direito do SVG): "PROJETO COM ART · ASSESSORIA AVCB". **Não escrever "AVCB aprovado".**

**Geometria do SVG** (gerada em código por `src/lib/iso.ts`, sem arquivo desenhado à mão):
- `P(x,y,z) = [520 + (x − y)·34·0.866, 60 + (x + y)·34·0.5 − z·34]` (unidade de 34 px; isometria de 30°).
- Edificação: planta `x 0–12`, `y 0–7`. Quatro níveis com pé-direito de 3: subsolo `z 0–3`, térreo `3–6`, 1º andar `6–9`, 2º andar `9–12`.
- Corte: desenham-se só as paredes do fundo (`y = 0` e `x = 0`) e as lajes, com traço `marinho-800` de 1 px e laje com preenchimento `papel-50` a 60%.
- Elementos por camada (unidades da planta):
  - **C-01:** pictograma de extintor (quadrado vermelho de 16 px com silhueta branca) em `(2, 0, z+1.2)` e `(8, 0, z+1.2)` em cada nível. São 8 no total.
  - **C-02:** prumada em `(11, 0, 0 → 12)`; ramal no teto do subsolo `(0→11, 0, 2.8)`; abrigo de mangueira `1×1.4` em `(10.2, 0, z+0.8)` por nível; reservatório `(11.5, 0.5, 0)`. A prumada desenha de baixo para cima.
  - **C-03:**
    - detectores (círculo de 6 px) em `(3, 3, z+2.9)`, `(7, 3, z+2.9)` e `(10, 5, z+2.9)` por nível;
    - acionador manual em `(5, 0, z+1.3)`;
    - painel central em `(1, 0, 4.2)`;
    - fios tracejados (`4 3`) de cada detector até `(0.5, 0, z+2.9)` e daí ao painel.
  - **C-04:** sala técnica no subsolo, `x 0–4`, `y 4–7`. Bateria de 6 cilindros em `x 0.6 → 3.6` (passo de 0,6), `y 6.4`, `z 0 → 1.6`, com coletor em `z 1.8`. Rede no teto do subsolo em grade `x 4–12`, `y 1–6`, a `z 2.9`, com bicos em tick de 4 px.
  - **C-05:** núcleo de escada em `x 0`, `y 5–7`. Porta `0.9×2.1` em `(0, 5.5, z)` por nível, com arco de abertura.
  - **C-06:** placa de saída acima de cada porta `(0, 5.5, z+2.4)`. Rota de fuga tracejada no piso de cada nível `(10, 4, z) → (1, 5.5, z)`, com setas a cada 1,5 unidade.
- Pontos focais da câmera (para o zoom): C-01 `(6,0,6)`, C-02 `(11,0,6)`, C-03 `(6,3,8)`, C-04 `(2,6,1)`, C-05 `(0,6,6)`, C-06 `(5,4,4)`. A fase final usa o conjunto inteiro.
- Acessibilidade: `role="img"`, `<title>` com "Diagrama em corte de uma edificação com os sistemas de proteção contra incêndio" e `<desc>` listando as camadas. Todos os textos do painel ficam no DOM (os inativos colapsados visualmente) para o prerender.

**Coreografia (desktop, scrub em `scrollYProgress` da seção):**

| Faixa de progresso | O que acontece |
|---|---|
| 0 → 0,08 | o contorno da edificação desenha (todos os `path` com `pathLength 0→1` scrub); o H2 da abertura entra por `SplitWords` ao cruzar 0,01 |
| 0,08 → 0,20 | C-01 |
| 0,20 → 0,33 | C-02 |
| 0,33 → 0,46 | C-03 |
| 0,46 → 0,60 | C-04 |
| 0,60 → 0,72 | C-05 |
| 0,72 → 0,85 | C-06 |
| 0,85 → 1 | Final: todas as camadas a 100%, carimbo e cantoneiras em volta do diagrama inteiro |

**Dentro de cada faixa de camada:**
1. **Primeiros 60% da faixa:** traços (prumada, fios, rede, rota) com `pathLength` em scrub.
2. **Ao cruzar 20% da faixa:** pictogramas e detectores entram por **estado**, sem scrub: `scale 0 → 1` (encaixe) com stagger de 40 ms. Os detectores do C-03 soltam 1 pulso cada (anel `sinal-500`, `scale 1 → 3`, `opacity .6 → 0`, 900 ms). As placas do C-06 ganham `drop-shadow(0 0 6px #D8F36A)` em 400 ms.
3. **Camadas anteriores:** caem para 35% de opacidade em 400 ms.
4. **Câmera:** o grupo do SVG faz `scale 1 → 1.15` e translada para o ponto focal da camada (scrub com `SPRING.trilho`). Na fase final volta a `scale 1`.
5. **Painel lateral:**
   - o bloco anterior sai (`y -12`, `opacity 0`, 200 ms) e o novo entra (`y 12 → 0`, 400 ms, saída), com `AnimatePresence mode="wait"`;
   - o índice "C-0X" troca por `Odometer`;
   - no trilho, a marca ativa estica de 8 para 24 px (encaixe) e pinta de `sinal-500`;
   - a linha de progresso do trilho faz `scaleY` em scrub.

**Interação:**
- **Chips das camadas:** clicar leva o Lenis até o início da faixa (`lenis.scrollTo(top + faixa × altura)`, 1,2 s) e dispara `pushEvent("diagram_layer", { layer })`.
- **Hover num pictograma** (desktop): tooltip mono com o nome do item ("Extintor", "Abrigo de mangueira", "Detector", "Acionador manual", "Painel de alarme", "Cilindro", "Porta corta-fogo", "Placa de saída"), mais as cantoneiras de 20 px.
- **`CoordCursor`** ativo (seção 6.2), com a leitura trocando para o nome da camada ativa.
- **Chips de serviço:** `RouterLink` para a página do serviço.

### 6.5 S4 Serviços "Fichas técnicas" (`#servicos`)

**Layout desktop:**
- **Coluna 1–5, prévia em `sticky top-[112px]`:**
  - altura `min(720px, calc(100vh - 160px))`;
  - janela 4:5 com `FocusBrackets`;
  - no canto superior esquerdo, o mono "S-0X / 08";
  - abaixo da janela, as tags do serviço e o resumo curto.
- **Coluna 6–12:** lista de 8 linhas (`min-h-[132px]`), cada uma com:
  - "S-0X" em mono;
  - título `h3` com Archivo `wdth 105` em 1,5 rem;
  - resumo em 1 linha (`line-clamp-1`);
  - ícone "+".
- **Clique na linha:** abre um acordeão com:
  - a descrição longa;
  - "Ver página do serviço" (`RouterLink`);
  - "Orçamento deste serviço" (`WhatsAppCta`, mensagem do serviço).

**Layout celular e tablet:**
- **Cards empilhados com sticky nativo:** cada card com `position: sticky; top: calc(72px + i * 10px)`, para que se sobreponham ao rolar (técnica dos painéis da Indafire, sem JS).
- **Card:**
  - imagem 16:10;
  - "S-0X";
  - título;
  - resumo;
  - acordeão "Ver detalhes";
  - WhatsApp.
- **Card que fica para trás:** `scale .94` e véu `papel-100` a 50%, pela timeline do próximo card (CSS `view()` com fallback sem efeito).

**Cabeçalho da seção:**
- Rótulo "03 — Serviços".
- Sobretítulo: "Nossos Serviços".
- H2: "Engenharia, Inspeção e Manutenção em Sistemas de Prevenção e Combate a Incêndios".

**Conteúdo** (curto = card, longo = acordeão e página):

| # | Título | Curto | Longo | Tags | Imagem (prévia) |
|---|---|---|---|---|---|
| S-01 | Instalação de Sistemas e Equipamentos | texto /servicos | texto Home | "SISTEMAS FIXOS" | `Instalacao_1.jpg` |
| S-02 | Projetos Técnicos | texto /servicos | texto Home | "ART" "AVCB" | `Servicos_2.jpg` |
| S-03 | Documentação e Regularização | texto /servicos | (só um texto) | "AVCB" "LAUDOS" | `architect-project-engineer-...-1-1.jpg` |
| S-04 | Inspeções e Manutenções Preventivas | texto /servicos | texto Home **[ajuste NBRs]** | "NBR" "TESTE HIDROSTÁTICO" | `Inspecao_2.jpg` |
| S-05 | Gestão e Manutenção de Equipamentos | texto /servicos | texto Home (Comercialização e Manutenção) | "INMETRO" "RASTREABILIDADE" | `Manutencao_1.jpg` |
| S-06 | Gestão de Riscos e Consultoria | texto /servicos | texto Home | "CIVIL" "ELÉTRICA" "MECÂNICA" "SEGURANÇA" | `Riscos_2.jpg` |
| S-07 | Venda de Equipamentos | texto /servicos | (só um texto) | "EXTINTORES" "MANGUEIRAS" | `Venda_2.jpg`; na prévia ativa toca `venda-extintor-720.mp4` |
| S-08 | Sinalização de Segurança | texto Home | (só um texto) | "FOTOLUMINESCENTE" | `Riscos_1.jpg` |

Os textos literais estão em `conteudo-estruturado.md` §1.6, copiados para `SERVICES` em `site.ts`.

**Coreografia:**
- **Entrada da lista:**
  - a borda superior de cada linha desenha (`scaleX`, 700 ms, trilho);
  - o conteúdo faz `Reveal y 12`, com stagger de 70 ms;
  - o "S-0X" faz `TextScramble`.
- **Entrada da prévia:** `ClipReveal` mais as cantoneiras.
- **Linha ativa** (a que cruza o centro: `useInView` com `-45% 0px -45% 0px`; o hover sobrepõe enquanto o ponteiro está na lista):
  - o "S-0X" pinta de `vermelho-600`;
  - uma barra de 2 px à esquerda faz `scaleY 0→1` em 300 ms;
  - o título anda `x 0 → 8` em 300 ms, saída.
- **Troca da prévia:**
  - a imagem nova sobe por cima com `clipPath inset(100% 0 0 0) → inset(0)` (650 ms, trilho) e `scale 1.08 → 1`;
  - a anterior vai a `scale 1.04` e `opacity .6` por baixo, e é removida ao fim;
  - as cantoneiras se re-travam (`offset 10 → 0`, encaixe);
  - "S-0X / 08" troca por `Odometer`;
  - as tags fazem `TextScramble`.
- **Hover na linha:**
  - fundo `papel-50` varre da esquerda (`scaleX`, 400 ms, trilho);
  - "+" gira 45 graus;
  - o ícone do serviço (Lucide, 20 px, ao lado do número) redesenha.
- **Acordeão:**
  - `height 0 → auto` em 500 ms, saída;
  - o conteúdo fica sempre no DOM (SEO, padrão do Seven);
  - os parágrafos entram com stagger de 60 ms;
  - dispara `pushEvent("service_open", { servico: slug })`.
- **Vídeo do S-07:** recebe `src` só quando a linha fica ativa pela primeira vez. Toca mudo em loop com crossfade de 400 ms sobre a foto e pausa quando outra linha é ativada.

**Ícones Lucide (`lucide-react` 1.62.0):**
- S-01 `Wrench`, S-02 `DraftingCompass`, S-03 `FileCheck2`, S-04 `ClipboardCheck`;
- S-05 `Settings2`, S-06 `ShieldAlert`, S-07 `FireExtinguisher`, S-08 `Signpost`.
- Conferir os nomes no pacote. Se algum não existir, usar o mais próximo, mas sempre ícone de traço, porque o `pathLength` precisa de stroke.

### 6.6 S5 Na prática "Pranchas de campo" (`#na-pratica`)

São fotos reais do acervo da Protecin com chamadas técnicas que se desenham.

**Layout desktop:**
- **Coluna 1–8:** a prancha ativa, uma foto 4:3 ou 16:9 com `FocusBrackets`, as chamadas numeradas e a legenda mono embaixo.
- **Coluna 9–12:**
  - rótulo "04 — Na prática";
  - H2;
  - abas "Prancha A · Parede técnica", "Prancha B · Bateria de cilindros" e, opcionalmente, "Prancha C · Portfólio";
  - legenda numerada da prancha ativa.

**Layout celular:**
- prancha com largura total;
- só os pontos numerados, sem fio de chamada;
- legenda em lista numerada abaixo;
- tocar num número dá zoom na foto (`scale 1.4`, `transform-origin` no ponto, 600 ms, saída); tocar de novo solta.

**Conteúdo:**
- **H2:** "Décadas de experiência na prevenção e combate a incêndios". É o título real do bloco Compromisso.
- **Prancha A** (`4.jpg`, servido como `acervo-parede-tecnica`):
  - Legenda: "Foto do acervo Protecin. Local e cliente não identificados."
  - Chamadas, com posição em % da imagem:
    1. Extintor com etiqueta PROTECIN (58%, 59%)
    2. Abrigo de mangueira (76%, 74%)
    3. Válvula de hidrante (76,5%, 57%)
    4. Painel de alarme (30%, 55%)
    5. Acionador manual (80%, 58%)
    6. Sinalização: SAÍDA, EXTINTOR, HIDRANTE, ALARME DE INCÊNDIO (57%, 41%)
    7. Rede de tubulação (45%, 30%)
- **Prancha B** (`024-original.jpg`, servido como `acervo-supressao-cilindros`; **o nome original nunca vai para a URL, o alt ou o texto**):
  - Legenda: "Sistema fixo de supressão por gás. Foto do acervo Protecin."
  - Chamadas:
    1. Cilindros numerados (72,5%, 80%)
    2. Válvulas com manômetro (51%, 57%)
    3. Coletor e tubulação (45%, 29%)
    4. Mangueiras de conexão (27%, 42%)
- **Prancha C** (só com `DEMO_PLACEHOLDERS = true`): moldura tracejada `papel-300` com o texto "Espaço para o portfólio de obras: fotos a enviar pela Protecin". Na pitch, ela mostra ao cliente o que mandar.
- As chamadas descrevem o que aparece na foto. Não afirmam autoria da obra.

**Coreografia:**
- **Prancha entrando:**
  - `clipPath inset(0 100% 0 0) → inset(0)`, 1100 ms, trilho;
  - "revelação fotográfica": sobreposição duotone (`marinho-800` multiply mais grayscale) de `opacity 1 → 0` em 1400 ms, com atraso de 400 ms;
  - as cantoneiras travam aos 900 ms.
- **Chamadas** (disparam com 40% da prancha visível):
  - ponto `scale 0→1` (encaixe) e um pulso;
  - fio de chamada em polilinha de 2 segmentos, até a margem direita da foto, desenhado em 500 ms (trilho);
  - número com `TextScramble`;
  - stagger de 180 ms;
  - a legenda da coluna direita entra em sincronia com o stagger.
- **Rolagem:** a foto interna faz `y -6% → 6%` (ParallaxImage com `amount 6`).
- **Hover em chamada ou em item da legenda (bidirecional):**
  - o ponto vai a `scale 1.4`;
  - o fio engrossa de 1 para 2 px e pinta de `sinal-500`;
  - o item da legenda ganha fundo `marinho-100`;
  - as outras chamadas caem para 50%;
  - a foto faz `scale 1.06` com origem no ponto, em 600 ms;
  - dispara `pushEvent("plate_callout", { prancha, item })` só no primeiro hover.
- **Troca de aba:**
  - o sublinhado desliza (`layoutId="aba-prancha"`);
  - a prancha que sai faz `clip` para a direita (500 ms);
  - a que entra faz `clip` a partir da esquerda (700 ms);
  - as chamadas da nova prancha re-sequenciam.

### 6.7 S6 Plataforma "Cianotipia" (`#plataforma`, fixada)

**Transição para o marinho:** quando a seção entra, um painel `marinho-950` cresce a partir de um quadrado de 24 px no centro, em scrub nos primeiros 60vh de entrada (`offset ["start end","start start"]`): `clipPath inset(calc(50% - 12px)) → inset(0)`. A grade passa para a versão cianotipia.

**Layout desktop:**
- **Altura e fixação:** `h-[500vh]` com `sticky top-0 h-screen`.
- **Coluna 1–5:**
  - rótulo "05 — Plataforma" em `marinho-300`;
  - sobretítulo e H2 em branco;
  - mono "SOFTWARE PRÓPRIO DESDE 2021";
  - trilho vertical com 4 passos ("01 Aplicativo para Técnicos", "02 Painel Web para Gestores", "03 Recursos Inteligentes", "04 Benefícios para o Cliente"). O passo ativo mostra o corpo; os outros ficam só com o título a 45%.
- **Coluna 6–12, palco:**
  - **notebook** com tela de 720×450, Web Master, centro-direita;
  - **celular** com tela de 300×620, App de Coleta, à frente e à esquerda, sobrepondo o notebook em 20%;
  - entre os dois, o nó "Processador de Coleta Online" (retângulo de 4 px de raio, ícone `Server`, rótulo mono), ligado a ambos por um caminho SVG curvo;
  - janela pequena (240×135) com o vídeo do tablet, no canto inferior esquerdo do palco, só no passo 01, com o rótulo mono "IMAGEM ILUSTRATIVA".

**Layout celular:**
- celular em `sticky top-[64px]` com `h-[52svh]`;
- 4 cards de texto rolando por baixo;
- o notebook aparece como um card sobreposto dentro do palco nos passos 02 e 03 (`y 40 → 0`, 500 ms);
- os passos animam por tempo (1200 ms) ao ativar;
- o vídeo fica fora do celular.

**Conteúdo:**
- **Sobretítulo:** "Tecnologia a favor da segurança e da gestão".
- **H2:** "Plataforma exclusiva Protecin: monitoramento inteligente e gestão eficiente onde você estiver".
- **Passos (texto literal):**
  - **01:** "Inspeções ágeis online e offline, com cadastro de equipamentos, questionários personalizados e envio automático de ordens de serviço ao cliente."
  - **02:** "Gestão centralizada e em tempo real: acompanhe inspeções, controle usuários e envie comandos diretamente ao app da equipe técnica."
  - **03:** "Coleta automatizada de dados, análises estatísticas e geração de insights. Operação segura, com ou sem internet, e 100% conforme a NBR 12962 e NBR 12779."
  - **04:** "Redução de erros e retrabalho, relatórios rápidos, transparência total e rastreabilidade de ponta a ponta nas inspeções realizadas."
- **Telas recriadas em HTML/CSS** (rótulos reais; esqueleto onde a tela original está borrada):
  - **Celular, boot:** splash `marinho-800` com o símbolo branco (de `App_1.png`).
  - **Celular, lista de ordens** (de `Design_sem_nome_16.png`):
    - header `marinho-800` com avatar e os ícones de busca, leitor de código e notificações;
    - 3 cards `#E9EDF2` com borda `papel-300`, cada um com "Nº da Ordem 1|2|3", "Nome do Cliente" (barra-esqueleto abaixo), "Localização" + "Ver no mapa" (barra-esqueleto), "Quantidades de Equipamentos" / "Total: 3 (1 extintor e 2 hidrantes)", "Andamento da vistoria: 1 de 3" e a barra de progresso.
  - **Celular, inspeção:** título "Aplicação de questionários técnicos", 4 linhas-esqueleto com toggle e o chip "Cadastro de equipamentos".
  - **Notebook, login** (de `App_2.png`): onda `marinho-800` à esquerda, card branco com o logo, "Faça login", "Email", "Senha", "Lembrar" e o botão "Entrar".
  - **Notebook, painel:**
    - barra lateral com rótulos derivados dos recursos reais: "Inspeções", "Ordens de serviço", "Perfis de usuário", "Relatórios" e "Indicadores";
    - área principal com as mesmas 3 ordens e barras de andamento;
    - bloco "Indicadores de desempenho em tempo real" com uma linha-esqueleto, sem eixo e sem número.
  - **Selos:** "NBR 12962" e "NBR 12779" (`StampBadge`).
  - **Relatório:** um card-documento com o rótulo "Envio automático de relatórios por e-mail" e o ícone `Mail`.
- **CTA de fechamento** (no fim do passo 04): "Conhecer a plataforma" (`RouterLink` para `/nosso-app/`) e "Quero conhecer a plataforma" (`WhatsAppCta`, mensagem de plataforma, `lead_location: plataforma`).

**Coreografia (scrub da seção, com mudanças de estado em limiares):**

| Progresso | Palco | Painel lateral |
|---|---|---|
| 0 → 0,14 Montagem | contornos de notebook e celular desenham em `marinho-300` com 1,5 px (`pathLength` scrub); aos 0,08 as telas acendem (`opacity 0→1`, 400 ms); o celular mostra o splash (símbolo `scale .8→1`, 500 ms), depois a lista; os componentes encaixam um a um (header `y -100% → 0`; cards `y 24 → 0` + `opacity`, `SPRING.encaixe`, stagger de 90 ms; barra "1 de 3" `scaleX 0 → 0.33`); o notebook mostra o login, com os campos entrando em stagger de 60 ms; o caminho até o processador desenha | H2 `SplitWords`; o rótulo mono faz scramble |
| 0,14 → 0,35 · 01 | celular `scale 1 → 1.08` e para a frente (`z-index`); toque simulado no card 1 (círculo `sinal-500` com `scale 0→1→0`, 400 ms), troca para a tela de inspeção (`x 100% → 0`, 450 ms, trilho); os toggles viram "ok" um por um (`conforme-600`, check desenhando em 250 ms, stagger de 300 ms, por estado); a barra de andamento vai a 2 de 3 e depois a 3 de 3 (texto em `Odometer`); **bloco offline**: aos 0,24 o ícone de wifi da barra de status vira `WifiOff` e aparece o chip mono "FUNCIONA OFFLINE" (`y 8 → 0`); aos 0,31 o wifi volta; o vídeo do tablet entra com `ClipReveal` aos 0,16 e sai aos 0,33 | o passo 01 abre (`height auto`, 400 ms), o número pinta de `sinal-500` e o trilho faz `scaleY` em scrub |
| 0,35 → 0,56 · 02 | notebook `scale 1 → 1.06`, celular recua (`scale .94`, `opacity .7`); login: pontos da senha aparecem um a um (40 ms cada), "Entrar" `scale .96 → 1`; a tela varre para o painel (`clipPath` da esquerda, 500 ms); as linhas das 3 ordens encaixam; as barras de andamento espelham o celular; "Envio de ordens de serviço ao app": um pacote sai do painel e vai ao celular pelo caminho (1000 ms, trilho), e no celular entra o card "Nº da Ordem 4" (`y -24 → 0`, encaixe) | passo 02 |
| 0,56 → 0,78 · 03 | o processador acende (borda `sinal-500`, glow de 300 ms); pacotes em fluxo celular → processador → notebook (3 pontos de 4 px `sinal-500` com `offset-distance 0 → 100%`, 1200 ms linear, stagger de 300 ms, em loop **só enquanto o passo está ativo e na tela**); a linha-esqueleto de "Indicadores" desenha (`pathLength`, 900 ms); aos 0,66 os selos NBR carimbam no palco (`scale 1.4 → 1`, `rotate -8 → -3deg`, `opacity 0→1`, encaixe, stagger de 150 ms) | passo 03 |
| 0,78 → 1 · 04 | o card-documento sai do notebook (`y 0 → -40`, `scale .9 → 1`) e voa até o ícone de e-mail (caminho de 900 ms, trilho); o traço de rastreabilidade desenha de ponta a ponta: pictograma de extintor → celular → processador → painel → relatório (`pathLength` scrub, `sinal-500`); aos 0,92 o CTA de fechamento entra (`Reveal`) | passo 04 |

**Saída:** a cianotipia recolhe ao contrário (`inset(0) → inset(calc(50% - 12px))`) nos últimos 40vh, revelando o papel da seção seguinte.

**Eventos:** `pushEvent("platform_step", { passo })` na primeira vez que cada passo fica ativo.

### 6.8 S7 Credibilidade (`#credibilidade`)

**Layout desktop:**
- **Cabeçalho:** rótulo "06 — Credibilidade", H2 e parágrafo.
- **Linha de 4 cards:** grid de 4 colunas. Cada card tem índice mono "D-01..04", ícone de 32 px, título `h3` e texto.
- **Selos textuais:** uma linha com os 3 selos, cada um com um check.
- **Bloco de marcas:**
  - célula larga "AUTORIZAÇÕES OFICIAIS" com 4 logos em grid de 4;
  - fita "MARCAS COM QUE TRABALHAMOS" em `VelocityMarquee`;
  - célula "ENTIDADES DO SETOR" com ABSpk e NFPA.

**Layout celular:** cards em 1 coluna (2×2 a partir de 640 px); logos autorizados em grid 2×2; filiações em 2 colunas; fita mantida.

**Conteúdo:**
- **H2:** "Tradição e credibilidade desde 1976." **[ajuste: título do 3º card mais o ano de fundação]**
- **Parágrafo:** "Atuamos com responsabilidade e precisão na redução de riscos, e somos filiados às principais entidades do setor, reforçando nossa credibilidade e conformidade técnica."
- **Cards (texto literal da Home):**

| Índice | Título | Ícone |
|---|---|---|
| D-01 | Atendimento Personalizado | `Headset` |
| D-02 | Tecnologia da Informação Aplicada | `MonitorCog` |
| D-03 | Tradição e Credibilidade | `Handshake` |
| D-04 | Estrutura Completa e Qualificada | `BadgeCheck` |

- **Selos:** "Equipe Técnica Qualificada", "Alto Índice de Satisfação dos Clientes" e "Cobertura Técnica em Território Nacional". **Sem percentual.**
- **Logos:**
  - autorizações: `4.png` Kidde, `3.png` Everlux, `5.png` Notifier, `Simplex.png`;
  - fita: as 8 marcas (Kidde, Everlux, Notifier, Simplex, VESDA `6.png`, `BOSCH.png`, `FIREBEE.png`, `LOGO-GRMK-AZUL-GERMEK.png`);
  - entidades: `ABSPK.png` e `NFPA.png`.
- **Não chamar** Bosch, VESDA, Firebee ou Germek de "autorizada".

**Coreografia:**
- **Cards:**
  - a borda SVG desenha (900 ms) e depois o conteúdo entra;
  - stagger de 100 ms entre cards;
  - o ícone desenha com atraso de 300 ms;
  - o índice faz scramble.
- **Selos:** cada check desenha em 300 ms, com stagger de 120 ms, e o texto entra em `Reveal`.
- **Células de logo:**
  - borda desenhada;
  - logos com `opacity` + `scale .96 → 1` e stagger de 60 ms;
  - estado de repouso `grayscale(1)` com `opacity .72`.
- **Fita:** `baseVelocity -2`, reage à velocidade da rolagem e pausa no hover.
- **Hover:**
  - card: cantoneiras e `y -4`;
  - logo: cor e `opacity 1` em 240 ms, com cantoneiras de 12 px.

### 6.9 S8 História "Régua do tempo" (`#historia`, fixada e horizontal)

**Layout desktop:**
- **Fixação:** seção `height: calc(100vh + distância)` com `sticky top-0` (padrão `PinnedWorks` do Seven).
- **Topo:** rótulo "07 — História" e H2.
- **Régua horizontal no meio da tela:**
  - escala de 72 px por ano;
  - **quebra de escala** em lacunas acima de 6 anos (1976–1986 e 1986–2004 viram 6 anos cada, com o símbolo de interrupção "//" sobre a régua, convenção de desenho técnico);
  - ticks anuais de 8 px e ticks de década de 16 px com o rótulo mono "1980", "1990"...
- **Agulha fixa** a 40% da largura da tela: linha vertical `sinal-500` com um odômetro de 4 dígitos que mostra o ano sob a agulha.
- **Cards de marco** (320 px), alternando acima e abaixo da régua para não colidir.
- **Posições** (px a partir de 1976):

| Ano | Posição | Lado |
|---|---|---|
| 1976 | 0 | acima |
| 1986 | 432 | abaixo |
| 2004 | 864 | acima |
| 2006 | 1008 | abaixo |
| 2009 | 1224 | acima |
| 2012 | 1440 | abaixo |
| 2015 | 1656 | acima |
| 2021 | 2088 | abaixo |
| 2024 | 2304 | acima |
| 2026 | 2448 | abaixo |

- **Espaços:** inicial de 40vw e final de 60vw. `distância = largura do trilho − 100vw`, medida no resize (padrão do Seven).

**Layout celular:**
- vertical;
- linha à esquerda com `scaleY` em scrub;
- badge mono "ANO 1976" em `sticky top-[76px]`, cujo odômetro atualiza quando cada card cruza 50% da tela;
- cards com `x 16 → 0` e `opacity` ao entrar.

**Conteúdo:**
- **H2:** "Tradição e inovação que evoluem juntos".
- **Marcos:** os 9 textos literais de `conteudo-estruturado.md` §2.2 (1976 a 2024). O texto de 1976 sai sem conciliar com o bloco da Kids ONG (inconsistência a confirmar).
- **Marcador final:** "2026 · 50 anos", sem evento inventado, só o marco de idade.
- **Ênfases:**
  - 2009 ganha `Odometer` "10 estados" dentro do card;
  - 2015 ganha o chip "PROTECIN ENGENHARIA";
  - 2021 ganha o chip "SOFTWARE PRÓPRIO" e o ícone `Smartphone`.

**Coreografia:**
- o trilho faz `x` em scrub com `SPRING.trilho`;
- a régua à frente da agulha desenha (`pathLength` ligado ao progresso + 10%);
- a agulha lê o ano pelo mapeamento inverso (linear por trechos, respeitando as quebras);
- o odômetro rola a cada troca de ano (dígitos com 180 ms, saída); nas quebras, os anos passam rápido, e essa é a graça.
- **Card que cruza a agulha:**
  - o ponto na régua preenche de `vermelho-600` (encaixe);
  - o conector vertical desenha em 300 ms;
  - o card vai de `opacity .35` e `y ±16` para `1` e `0` (500 ms, saída);
  - o ano do card (`numero`, 4 rem) faz `wdth 125 → 112`.
- **Card que já passou:** fica a 70%.
- **Hover no card:** cantoneiras.

### 6.10 S9 Setores (`#setores`)

**Layout desktop:**
- **Cabeçalho:** rótulo "08 — Setores", sobretítulo, H2 e parágrafo.
- **3 colunas** separadas por linhas verticais. Cada coluna tem um conjunto de ícones (2 ou 3 lado a lado), o título e o texto.
- **Fundo:** o recorte `Home_Image_1-e1754481613736.png` (esfera de gás, RGBA) atrás da 3ª coluna, a 35% de opacidade, com parallax.

**Layout celular:** 1 coluna com régua à esquerda; esfera oculta.

**Conteúdo (literal, `/nossos-clientes`):**
- **Sobretítulo:** "Presença sólida e confiável em empresas de alto padrão".
- **H2:** "Atendemos líderes de mercado em diferentes setores".
- **Parágrafo:** "Com atuação nacional e décadas de experiência, a Protecin atende clientes que são referência em seus segmentos. A confiança dos nossos parceiros é reflexo do nosso compromisso com a excelência."
- **Colunas:**

| Coluna | Ícones | Texto |
|---|---|---|
| "Setores Financeiro, Tecnologia e Saúde" | `Landmark`, `Cpu`, `HeartPulse` | literal |
| "Setores Industrial e Agronegócio" | `Factory`, `Wheat` | literal |
| "Setores de Energia e Transporte" | `Zap`, `Truck` | literal |

- **Sem logos de clientes.**

**Coreografia:**
- as divisórias fazem `scaleY` em 800 ms;
- os ícones desenham em sequência (600 ms cada, stagger de 150 ms dentro da coluna e de 200 ms entre colunas);
- os títulos usam `SplitWords`;
- os textos usam `Reveal`;
- a esfera faz `y 8% → -8%`, em scrub;
- **hover na coluna:** fundo `papel-50` varrendo de baixo, ícones redesenhando.

### 6.11 S10 Responsabilidade (`#responsabilidade`)

**Layout desktop:**
- **Coluna 1–7:**
  - rótulo "09 — Responsabilidade";
  - manifesto gigante em Archivo 300 `wdth 112`, com `clamp(2.5rem, 5.5vw, 5rem)`;
  - parágrafo;
  - o recorte `Institucional_7.png` (mãos com muda, transparente) flutuando à direita do manifesto.
- **Coluna 8–12, card Kids ONG:**
  - logo `logo_kids_ong.png` (120 px);
  - sobretítulo e título;
  - texto;
  - colagem `Institucional_4.png`, mantida como está, com os rostos já borrados;
  - link "Conheça nossa história" (`RouterLink` para `/institucional/`).

**Layout celular:** manifesto, parágrafo, card. O recorte das mãos fica a 60% de largura, centralizado.

**Conteúdo (literal):**
- **Manifesto:** "Cuidar também é prevenir."
- **Parágrafo:** o texto de Responsabilidade e Sustentabilidade (§2.2).
- **Card:**
  - sobretítulo "Nosso compromisso vai além da segurança técnica";
  - título "Cuidar de vidas também é transformar futuros";
  - texto da Kids ONG, com "sete anos" (texto de 2025; confirmar);
  - fecho "Protegemos seu maior patrimônio: A vida."

**Coreografia:**
- o manifesto faz `ScrollLitText` (palavras de `opacity .14 → 1` em scrub, padrão do Seven) e o ponto final aparece em `vermelho-600`;
- o recorte das mãos entra com `y 40 → 0` e `opacity` em 1000 ms, depois faz `y` em scrub de 6% a -6%;
- **card:**
  - borda desenhada;
  - o logo entra com `scale .9 → 1` (encaixe);
  - título em `SplitWords`;
  - colagem em `ClipReveal` a partir da base;
- o selo `ecofriendly_logo.png` entra como ícone decorativo ao lado do parágrafo (fade, 40 px, `opacity .8`). **Nunca chamar de certificação.**

### 6.12 S11 Catálogo (`#catalogo`)

**Layout desktop:**
- **Coluna 1–5:** a capa `Screenshot-2025-07-30-143726.png` (no máximo 340 px de largura; a imagem original é pequena) num `TiltCard` com `perspective 1200`, sombra `0 30px 60px -20px rgba(14,52,82,.35)` e cantoneiras.
- **Coluna 6–12:** título, subtítulo, texto e botão.

**Layout celular:** capa centralizada a 62% de largura, com o texto abaixo.

**Conteúdo (literal):**
- **Título:** "Catálogo Digital Protecin".
- **Subtítulo:** "Material completo e sempre atualizado".
- **Texto:** "Conheça em detalhes nossos serviços, produtos, tecnologias e diferenciais. Tudo reunido em um catálogo pensado para facilitar sua consulta e apoiar suas decisões com segurança e confiança."
- **Botão:** "Baixar catálogo (PDF)", um `<a>` para `https://protecin.com.br/wp-content/uploads/2025/07/Catalogo-Digital-Protecin.pdf` com `target="_blank"` e `rel="noopener"`. Dispara `pushEvent("catalog_download", { lead_location: "catalogo" })`.

**Coreografia:**
- **Capa:** entra com `rotateY -25deg → -8deg`, `x 60 → 0` e `opacity`, em 1200 ms (saída). Na rolagem faz `rotateY -8 → 4deg` em scrub.
- **Hover:** tilt de ±8 graus (springs do `TiltCard` do Seven) e uma faixa de brilho diagonal que varre a capa (gradiente branco a 25%, `x -120% → 120%`, 700 ms).
- **Texto:** padrões globais.

### 6.13 S12 Manifesto "Fogo contido" (`#manifesto`, cianotipia)

**Layout:**
- **Altura e fixação:** `h-[180vh]` com `sticky top-0 h-screen`, fundo `marinho-950` e a grade cianotipia.
- **Centro:** um palco de 360 px com o vídeo de chamas, recortado pela **gota** do símbolo (`clipPath url(#gota)`, `clipPathUnits="objectBoundingBox"`).
- **Em volta do palco:** as 4 cantoneiras do símbolo.
- **Abaixo:** frase e CTAs.
- **Celular:** palco de 220 px.

**Conteúdo:**
- **Frase:** "Protegemos seu maior patrimônio: a vida." **[ajuste: "a vida" em minúscula]**, com "a vida" em `sinal-500`.
- **CTAs:** "Solicitar orçamento" (`#orcamento`) e "Falar no WhatsApp" (`lead_location: cta_final`).

**Coreografia (scrub, `offset ["start start","end end"]`):**

| Progresso | O que acontece |
|---|---|
| 0 → 0,45 | o palco com as chamas vai de `scale 6` (o fogo enche a tela) a `scale 1` (contido na gota). Só usa `transform` no wrapper; a máscara é fixa. O vídeo fica em `mix-blend-mode: screen` |
| 0,40 → 0,60 | as 4 cantoneiras entram dos cantos da tela até o palco (`SPRING.encaixe` disparado por limiar, stagger de 60 ms) e formam o símbolo Protecin com o fogo dentro da gota |
| 0,55 → 0,75 | a frase entra por `SplitWords` (branca), com "a vida" pintando de `sinal-500` ao fim |
| 0,70 → 0,85 | CTAs com `Reveal` |

- **Sem vídeo** (celular abaixo de 768 px sem 4G, modo suave ou `saveData`): a gota mostra `vermelho-600` com um gradiente radial `sinal-500 → vermelho-700`, e a mesma coreografia de escala e cantoneiras.
- **Desempenho:** se o `medir-desempenho.mjs` acusar menos de 40 fps com CPU 4x nesta seção, trocar o vídeo pelo poster (`cta-chamas-poster`) com a mesma máscara.

### 6.14 S13 Orçamento "Monte sua solicitação" (`#orcamento`)

**Layout desktop:**
- **Coluna 1–5:**
  - rótulo "10 — Orçamento";
  - H2;
  - texto;
  - lista de canais: telefone, WhatsApp, `comercial@` e o horário "Segunda a sexta, 8h às 17h30".
- **Coluna 6–12:** card "ficha técnica" (`papel-50`, borda `papel-300`, cantoneiras) com 4 abas de passo e um painel de resumo ao vivo embaixo.

**Layout celular:** card com largura total, com o texto acima. Enquanto o formulário tem foco, a barra inferior fixa some.

**Conteúdo:**
- **H2:** "Precisa de uma proposta, agendar uma visita ou tirar dúvidas?" **[ajuste: primeira frase do texto real de Contato]**
- **Texto:** "Nossa equipe está pronta para atender com agilidade e atenção técnica. Preencha o formulário ou utilize os canais abaixo para falar com a gente."
- **Passos:**
  1. "Serviço": os 8 serviços em chips, com multisseleção.
  2. "Setor": os 7 setores reais (Financeiro, Tecnologia, Saúde, Industrial, Agronegócio, Energia, Transporte) mais "Outro".
  3. "Local": Cidade e UF.
  4. "Contato": Nome*, Empresa (Opcional), E-mail, Telefone e Mensagem. São os campos do formulário atual; o "Assunto" é montado a partir dos serviços.
- **Envio:** abas `layoutId="orc-modo"` com "Enviar pelo WhatsApp" e "Enviar por e-mail".
  - **WhatsApp:** `<a href>` real para `wa.me`, com a mensagem montada e atualizada ao vivo. Exemplo: "Olá! Vim pelo site da Protecin e gostaria de um orçamento. Serviços: Projetos Técnicos, Documentação e Regularização. Setor: Industrial. Local: Santo André/SP. Nome: ..."
  - **E-mail:**
    - na demo (`VITE_BASE !== "/"`), um `mailto:comercial@protecin.com.br` com assunto e corpo;
    - em produção, FormSubmit (padrão do Seven, com anti-spam, ativação e `msg-sucesso`);
    - **na demo, nunca chamar o FormSubmit**: ele mandaria um e-mail de ativação para a Protecin.
- **Pré-seleção:** `?servico=<slug>` na URL marca o serviço (links de "Solicitar orçamento" nas páginas de serviço).
- **Não escrever "gratuito".**

**Coreografia:**
- **Entrada:** o card desenha a borda e depois as cantoneiras travam. As abas de passo entram com stagger de 60 ms e a linha de progresso delas faz `scaleX` a 25% por passo.
- **Troca de passo:** o painel atual sai com `x -24` e `opacity 0` (250 ms); o próximo entra com `x 24 → 0` (400 ms, saída).
- **Chips:**
  - `whileTap scale .94`;
  - selecionado: fundo `marinho-800`, texto branco e check desenhando em 250 ms.
- **Campos:** cantoneiras no foco (padrão global).
- **Resumo:** "digita" a mensagem a 12 ms por caractere, com no máximo 600 ms por atualização.
- **Sucesso (e-mail em produção):** o bloco `msg-sucesso` **não pode ter animação de opacidade** no wrapper (o GTM mede a visibilidade dele). Usa `y 16 → 0` e `scale .98 → 1`, e o check desenha.

**Eventos:**
- `form_open` (primeira interação);
- `form_step { passo }`;
- `lead_click` com `whatsapp`, `orcamento` e os slugs dos serviços em `lead_detail`;
- `form_lead` (sucesso).

### 6.15 S14 Contato e mapa (`#contato`)

**Layout desktop:**
- **Coluna 1–5:** canais em linhas com régua: endereço, horário, telefone, WhatsApp, `comercial@`, `falecom@`, Instagram e LinkedIn.
- **Coluna 6–12:** iframe do Google Maps (embed do endereço) dentro de `ClipReveal` com cantoneiras, e o botão "Como chegar" (link do Google Maps com rota; `map_directions_click`).

**Layout celular:** mapa 4:3 abaixo dos canais.

**Conteúdo (literal):** "Rua Lacônia, 600, Parque Capuava, CEP 09271-010, Santo André - SP, Brasil", "Segunda a sexta, 8h às 17h30", "+55 11 4977-8720", "+55 11 94565-1751", "comercial@protecin.com.br", "falecom@protecin.com.br", "@protecin_ltda" e "LinkedIn".

**Coreografia:**
- cada linha: a régua desenha, depois o ícone desenha, depois o texto entra com `Reveal`, com stagger de 80 ms;
- o mapa faz `ClipReveal` a partir da esquerda (1200 ms) e as cantoneiras travam ao fim;
- **hover nas linhas:** o ícone redesenha e o sublinhado desenha.

**Eventos:** os links usam `PhoneLink`, `WhatsAppLink` e `EmailLink` (`data-lead-channel="email"`), todos com `lead_location: contato`.

### 6.16 Rodapé "Carimbo"

**Layout desktop:**
- **Topo:** o texto institucional (literal: "Com 50 anos de atuação, a Protecin é reconhecida...") na coluna 1–6 e os links das seções na coluna 7–12.
- **"Carimbo"** (tabela de 1 px no estilo do quadro de legenda de uma prancha), com as células:
  - "PROTECIN® · Engenharia e Proteção Técnica Contra Incêndio";
  - "Desde 1976";
  - endereço;
  - "Segunda - Sexta: 8h às 17h30";
  - telefone;
  - e-mail;
  - "© {ano corrente} Protecin. Todos os direitos reservados." **[ajuste: português e ano dinâmico]**
- **Fundo do rodapé:** o símbolo gigante (40vw) em contorno `papel-300`.
- **Interruptor** "Movimento: completo | suave" (seção 11).

**Layout celular:** as células do carimbo empilham em 1 coluna e o símbolo fica com 80vw.

**Coreografia:**
- as células do carimbo desenham as bordas em sequência (stagger de 60 ms), como uma prancha sendo finalizada;
- os textos entram com `Reveal` (stagger de 40 ms);
- o símbolo gigante desenha o contorno (`pathLength`, 1800 ms, trilho) e preenche a gota em `vermelho-600` a 8% ao fim;
- os links fazem `Reveal` com stagger de 30 ms.

### 6.17 Elementos fixos globais

- **Contato flutuante** (padrão do Seven com a regra da Indafire):
  - aparece depois de 640 px;
  - no desktop, um botão `whatsapp` que entra girando (`scale 0`, `rotate -90 → 0`, spring), com anel pulsante e o rótulo "Falar agora" no hover;
  - no celular, uma barra inferior com WhatsApp e "Ligar", com `safe-area`;
  - **some** quando `#orcamento`, `#contato` ou o rodapé estão na tela, ou quando um campo tem foco;
  - `lead_location`: `botao_flutuante` ou `barra_mobile`.
- **Aviso de cookies:** só em produção, onde o GTM carrega (padrão do Seven). Na demo fica oculto.

### 6.18 Transição de página

- **Cobrir:** um painel `marinho-950` com a grade cianotipia varre da esquerda (`clipPath inset(0 100% 0 0) → inset(0)`, 450 ms, trilho).
- **Durante a cobertura (150 ms):** as 4 cantoneiras encaixam no centro, formando o símbolo sem a gota. Nesse intervalo a rota troca e a página vai ao topo (`lenis.scrollTo(0, { immediate: true })`).
- **Descobrir:** o painel sai para a direita (`inset(0) → inset(0 0 0 100%)`, 450 ms, trilho).
- **Depois:** a página nova dispara as entradas do seu hero.
- **Total:** no máximo 1,05 s.
- **Evento:** `pushEvent("virtual_page_view", { page_path, page_title })`.
- **Modo suave:** crossfade de 200 ms.

---

## 7. Páginas internas

Todas reaproveitam as primitivas e as seções da Home. O hero de cada página segue o mesmo esquema:
1. rótulo mono com trilha de navegação ("SERVIÇOS / PROJETOS TÉCNICOS"), com `TextScramble`;
2. H1 com `SplitWords`;
3. lead com `Reveal`;
4. mídia com `ClipReveal` e cantoneiras.

| Rota | Seções, em ordem (conteúdo real) |
|---|---|
| `/servicos/` | **Hero:** H1 "Soluções completas em combate e prevenção a incêndios" e subtítulo literal. Depois a grade de 8 fichas (cards com imagem, número, título, resumo e "Ver serviço"; entrada em grade com stagger por linha e coluna `(row+col) × 60 ms`), a miniatura do diagrama S3 desenhando por tempo (sem fixação) e o CTA |
| `/<slug-do-serviço>/` (template) | **Hero:** número "S-0X", H1 com o nome do serviço, o texto /servicos como lead e o texto Home como corpo (quando existir); CTAs "Orçamento deste serviço" (`WhatsAppCta`, mensagem do serviço, `lead_location: pagina_servico`, `lead_detail: slug`) e "Solicitar orçamento" (para `/contato/?servico=<slug>#orcamento`); mídia: a imagem da tabela 6.5 com cotas (no S-07, o vídeo `venda-extintor-720.mp4`). **"Onde se aplica":** mini-diagrama com só as camadas relacionadas acesas (mapa camada ↔ serviço da tabela 6.4). **"Itens e atividades":** chips com os termos do próprio texto (ex.: S-04 "inspeções periódicas", "testes hidrostáticos", "manutenção em campo", "repintura", "limpeza", "adequação técnica"). **Nota de plataforma** nos S-04 e S-05: "controle informatizado", com link para `/nosso-app/`. **"Outros serviços":** 3 cards. Por fim, o CTA. Imagem secundária: `Inspecao_1.jpg` (S-01), `Servicos_1.jpg` (S-02), `Manutencao_2.jpg` (S-04), `Institucional_2.png` (S-05) |
| `/nosso-app/` | **Hero:** H1 "Protecin App: Gestão inteligente de inspeções", lead "Uma plataforma completa, com versão web e aplicativo próprio, que otimiza o controle de extintores e hidrantes com agilidade, segurança e conformidade técnica.", frase "Conheça a solução da Protecin que está transformando o setor de segurança contra incêndios.". **S6 completa** (fixada). **"Como nosso Protecin funciona?":** diagrama de 3 nós ligados (App de Coleta → Processador de Coleta Online → Web Master) com as listas literais de cada módulo; os nós encaixam e os fios desenham, e os itens das listas entram com check desenhando. **"Telas do sistema":** `App_1.png`, `App_3.png`, `App_2.png` e `Design_sem_nome_16.png` (este último pequeno, porque a resolução interna é baixa) em galeria com `TiltCard` e a legenda "Telas reais do sistema. Dados de clientes ocultos.". **"RECURSOS QUE FAZEM A DIFERENÇA":** subtítulo literal e 8 células com ícone desenhado. **Fecho:** "Tecnologia acessível que entrega resultado, simplifica processos e fortalece sua gestão." e o CTA de plataforma |
| `/institucional/` | **"Quem Somos":** texto literal mais "Compromisso com Segurança, Excelência e Confiança é o nosso objetivo."; imagem `Institucional_3.png` (pilar simétrico) revelada **de dentro para fora pelas cantoneiras**: a máscara é o quadrado do símbolo, que cresce de 20% a 100%. **Números:** S2. **História:** S8. **"O que nos move, inspira e sustenta nosso compromisso com a segurança":** texto e 3 cards (Missão, Visão, Valores), com os 6 valores em lista e check desenhando. **Sustentabilidade:** "Cuidar também é prevenir." com `Institucional_8.jpg` em `ParallaxImage` de fundo (véu `papel-100` a 70%) e o recorte `Institucional_7.png`. **Kids ONG:** card do S10 ampliado. CTA |
| `/nossos-clientes/` | **Hero:** H1 "Nossos Clientes", subtítulo literal e `Clientes_1.jpg`. **S9** completa. **"Parcerias estratégicas e filiações técnicas":** texto literal e os 10 logos em 3 grupos (Autorizações oficiais · Marcas com que trabalhamos · Entidades do setor). Opcional, com `DEMO_PLACEHOLDERS`: a célula tracejada "Espaço para logos de clientes autorizados (a confirmar com a Protecin)". CTA |
| `/catalogo-digital/` | S11 ampliada (capa de até 420 px) e CTA |
| `/contato/` | **Hero:** sobretítulo "Entre em contato", H1 "Contate a Protecin" e texto literal. Depois S13, S14 e o botão de "agendar uma visita" (`WhatsAppCta`, mensagem de visita, `lead_location: contato`) |

---

## 8. Componentes e primitivas

### 8.1 Herdados do Seven (copiar e ajustar)

| Origem | Ajuste |
|---|---|
| `lib/smooth-scroll.ts` | igual (lerp 0,11, offset -84 px passa a -88 px com a nav de 72 px); acrescentar `scrollToProgress(el, p)` para os chips do S3 |
| `components/motion.tsx` | `SplitWords` ganha a prop `rotate` (padrão 0 nesta direção); `ClipReveal` ganha `radius` (padrão 4); `Counter` dá lugar a `Odometer`; **todos** recebem `data-motion="<nome>"` no wrapper (para o verify) |
| `components/cta.tsx` | `WhatsAppLink`, `PhoneLink` e mais `EmailLink` (`data-lead-channel="email"`); estilos da seção 4 |
| `components/chrome.tsx` | o Preloader vira "Calibração"; Nav, ScrollProgress (régua), FloatingContact (com regra de esconder) e CookieNotice (só produção) |
| `components/ContactForm.tsx` | vira o passo 4 do configurador; destino FormSubmit só em produção |
| `sections/Products.tsx` `TiltCard` | catálogo e galeria de telas |
| `sections/Works.tsx` `PinnedWorks` / `useIsDesktop` | base de S8; `useIsDesktop` passa a exigir `min-height: 640px` |
| `scripts/prerender.mjs`, `entry-server.tsx` | multi-rota (seção 5) |

### 8.2 Novos

| Componente | Props | Comportamento |
|---|---|---|
| `BlueprintGrid` | `tone: "papel" \| "ciano"`, `fade?: "radial" \| "b"`, `drawIn?: boolean` | **Grade:** CSS com 4 `linear-gradient` (24 px e 120 px) num `::before`. **Entrada:** máscara diagonal com `@property --p` animada de -20% a 120% (fallback: `opacity`). **Deriva:** `translate3d(0, -120px, 0)` com `animation-timeline: scroll(root)` dentro de `@supports`. **O contêiner usa `overflow: clip`, nunca `hidden`** |
| `DrawPath` | `d`, `mode: "inView" \| "scrub"`, `progress?: MotionValue`, `duration`, `delay` | `motion.path` com `pathLength 0→1`, `vector-effect: non-scaling-stroke` e `strokeLinecap="square"` |
| `DrawIcon` | `icon: LucideIcon`, `size`, `delay`, `redrawOnHover` | percorre os `path`/`circle`/`line` do SVG do Lucide e anima o `pathLength` de cada um, com stagger de 80 ms |
| `DrawLine` | `axis: "x" \| "y"`, `origin`, `delay` | `scaleX`/`scaleY` de 0 a 1 num `div` de 1 px (mais barato que SVG para linhas retas) |
| `DimensionLine` | `from`, `to`, `label`, `orientation` | **Cota técnica:** linha com dois terminais (traço de 45 graus) e um rótulo mono centralizado. Desenha em 900 ms e o rótulo faz `TextScramble` |
| `FocusBrackets` | `state: "idle" \| "hover" \| "locked"`, `offset`, `size`, `tone` | **Geometria:** 4 SVGs em L, com braço `clamp(12px, 8%, 28px)` e traço de 2 px. **Cores:** superior direita `vermelho-600`, demais `marinho-800` (como no logo); na cianotipia, branco e `sinal-500`. **Estados:** `idle` com `opacity 0` e `offset +10`; `hover`/`locked` com `opacity 1` e `offset 0` (`SPRING.encaixe`). Ao travar, dá um pulso de -2 px |
| `TextScramble` | `text`, `delay`, `duration ≤ 600ms` | Os caracteres giram por `0-9 A-Z - / ·` e cada um se fixa em `i × 18 ms + 120 ms`. O SSR renderiza o texto final, com `aria-label` |
| `Odometer` | `value: string` (ex.: `"20.000+"`), `duration`, `stagger` | Uma coluna de 0 a 9 por dígito, com `translateY(-d em)`; separadores e sufixos estáticos com pop. O SSR traz o valor final |
| `Callout` | `x%`, `y%`, `label`, `index`, `anchor: "right" \| "left"`, `active` | Ponto, anel pulsante único, fio em polilinha `DrawPath` e rótulo. Sincroniza com a legenda por contexto |
| `CoordCursor` | `labelFor?: (target) => string` | Só com `pointer: fine`, dentro da seção. Duas linhas de 1 px com `SPRING.mira` e leitura de 4 dígitos. Fora da seção, some em 200 ms |
| `PinnedSteps` | `heightVh`, `steps: [início, fim][]`, `onStep` | Contêiner fixado mais `scrollYProgress` suavizado. Expõe `progress`, `stepIndex` e `stepProgress` por contexto. No celular, vira o padrão sticky com cards e `useInView` |
| `IsoDiagram` | `layers`, `active`, `progress`, `focus`, `compact` | O SVG do S3, gerado a partir de `lib/iso.ts` e de `DIAGRAM_LAYERS` em `site.ts` |
| `DeviceFrame` | `kind: "phone" \| "laptop"`, `draw: MotionValue`, `children` | O contorno desenha e a tela acende. O conteúdo é HTML real (texto selecionável) |
| `UiSkeleton` | `w`, `h`, `shimmer?` | Barra `papel-300` com raio de 2 px e um único brilho (`x -100% → 100%`, 900 ms) ao montar |
| `DataPacket` | `pathId`, `delay`, `loop` | Círculo de 4 px com `offset-path: path(...)` e `offset-distance 0→100%`. Pausa quando `loop` é falso ou fora da tela |
| `StampBadge` | `text` | Retângulo com borda dupla e texto mono. Entra com `scale 1.4 → 1`, `rotate -8 → -3deg` e `opacity` (encaixe) |
| `LazyVideo` | `src`, `poster`, `when: "idle" \| "inView" \| "active"`, `fit` | `muted playsinline loop preload="none"` e poster sempre. O `src` só é atribuído conforme `when` e a política de rede (seção 12). Pausa fora da tela e mostra botão de play se o autoplay for bloqueado. No modo suave, só o poster |
| `PageTransition` | – | Seção 6.18 |
| `RouterLink`, `usePath` | – | Seção 5 |
| `SymbolSvg` | `parts: ("tl"\|"tr"\|"bl"\|"br"\|"drop")[]`, `layoutId` | Seção 8.3 |
| `MotionModeProvider`, `useMotionMode` | – | Seção 11 |

### 8.3 Símbolo vetorizado (de `SIMBOLO.png` e `Ativo-1.png`)

Medidas normalizadas em `viewBox="0 0 100 100"`:
- cada cantoneira ocupa um quadrante de 44×44, com espessura de 13 e vão de 12 entre quadrantes (44 → 56);
- o canto externo é arredondado com raio 9.

```svg
<!-- sup. esq. (marinho) -->  <path d="M44 0 H9 A9 9 0 0 0 0 9 V44 H13 V13 H44 Z"/>
<!-- sup. dir. (vermelho) --> <path d="M56 0 H91 A9 9 0 0 1 100 9 V44 H87 V13 H56 Z"/>
<!-- inf. esq. (marinho) -->  <path d="M0 56 V91 A9 9 0 0 0 9 100 H44 V87 H13 V56 Z"/>
<!-- inf. dir. (marinho) -->  <path d="M100 56 V91 A9 9 0 0 1 91 100 H56 V87 H87 V56 Z"/>
<!-- gota (vermelho), canto sup. dir. vivo -->
<path d="M50 25 H75 V50 A25 25 0 0 1 50 75 A25 25 0 0 1 25 50 A25 25 0 0 1 50 25 Z"/>
```

- Cores: marinho `#0E3452`; vermelho `#BE1E29` (versão `Ativo-1`); na cianotipia, as cantoneiras ficam brancas.
- O wordmark continua em PNG (`Ativo-1.png` recortado; sobre marinho, `filter: brightness(0) invert(1)`).
- **Antes de produção, pedir o vetor oficial à Protecin.**

### 8.4 Dados (`src/data/site.ts`)

Constantes: `COMPANY`, `NUMBERS`, `SERVICES`, `DIFFERENTIALS`, `SEALS`, `BRANDS` (`authorized`, `partners`, `affiliations`), `DIAGRAM_LAYERS`, `PLATES` (callouts em %), `PLATFORM` (`pillars`, `modules`, `resources`), `TIMELINE` (ano, texto, ênfase), `SECTORS`, `ESG`, `CATALOG`, `WA_MESSAGES`, `ROUTES` (path, title, description) e `DEMO_PLACEHOLDERS`.

- O conteúdo sai **só** de `conteudo-estruturado.md`.
- O que depende do cliente fica `null` ou `TODO(cliente)` e não renderiza.

Mensagens de WhatsApp (`WA_MESSAGES`), sempre `https://wa.me/5511945651751?text=...`:

| Chave | Texto |
|---|---|
| `padrao` | "Olá! Vim pelo site da Protecin e gostaria de solicitar um orçamento." |
| `servico(nome)` | "Olá! Vim pelo site da Protecin e gostaria de um orçamento de {nome}." |
| `plataforma` | "Olá! Vim pelo site da Protecin e gostaria de conhecer a plataforma Protecin App." |
| `visita` | "Olá! Vim pelo site da Protecin e gostaria de agendar uma visita técnica." |
| `orcamento(resumo)` | montada pelo configurador (6.14) |

---

## 9. Imagens e vídeos: onde entra cada arquivo

O build (`scripts/imagens.mjs`, com `sharp` 0.35.5) gera AVIF e WebP em 640, 1024, 1600 e 2400w. Logos são aparados (`trim`) e saem em WebP. **Os nomes são trocados**, para não levar nome de cliente nem nome genérico para a URL.

| Original | Publicado como | Onde |
|---|---|---|
| `Home_BG_1-1.jpg` | `hero-poster` | poster do vídeo do S1 (LCP) |
| `Design_sem_nome.png` | `hero-valvulas` (WebP com alfa) | recorte flutuante do S1 |
| `4.jpg` | `acervo-parede-tecnica` | S5, Prancha A |
| `024-original.jpg` | `acervo-supressao-cilindros` | S5, Prancha B (**sem o nome original em URL, alt ou texto**) |
| `Instalacao_1.jpg`, `Servicos_2.jpg`, `architect-...-1-1.jpg`, `Inspecao_2.jpg`, `Manutencao_1.jpg`, `Riscos_2.jpg`, `Venda_2.jpg`, `Riscos_1.jpg` | `servico-01` a `servico-08` | S4 e páginas de serviço |
| `Inspecao_1.jpg`, `Servicos_1.jpg`, `Manutencao_2.jpg`, `Institucional_2.png` | `servico-0X-b` | imagem secundária das páginas de serviço |
| `App_1.png`, `App_2.png`, `App_3.png`, `Design_sem_nome_16.png` | `tela-splash`, `tela-login-web`, `tela-login-app`, `tela-ordens` | galeria de `/nosso-app/` (o S6 recria as telas em HTML) |
| `Home_Image_1-e1754481613736.png` | `setor-energia` | fundo do S9 |
| `Institucional_3.png` | `institucional-pilar` | hero de `/institucional/` |
| `Institucional_7.png`, `Institucional_8.jpg` | `esg-maos`, `esg-paisagem` | S10 e `/institucional/` |
| `Institucional_4.png`, `logo_kids_ong.png` | `kids-ong-colagem`, `kids-ong-logo` | S10 |
| `ecofriendly_logo.png` | `selo-eco` | S10, decorativo |
| `Screenshot-2025-07-30-143726.png` | `catalogo-capa` | S11 |
| `Clientes_1.jpg` | `clientes-hero` | `/nossos-clientes/` |
| `4.png`, `3.png`, `5.png`, `Simplex.png`, `6.png`, `BOSCH.png`, `FIREBEE.png`, `LOGO-GRMK-AZUL-GERMEK.png`, `ABSPK.png`, `NFPA.png` | `marca-kidde`, `marca-everlux`, `marca-notifier`, `marca-simplex`, `marca-vesda`, `marca-bosch`, `marca-firebee`, `marca-germek`, `entidade-abspk`, `entidade-nfpa` | S1 (faixa), S7, `/nossos-clientes/` |
| `Ativo-1.png` | `logo-protecin` | nav e rodapé (wordmark) |

**Nunca usar:**
- `Team-*`, `Testi-*`, `Icon-*`, `Logo-1..4`, `Logo-Fire-01`;
- fotos de bombeiros;
- `teste-1.png`;
- `placeholder*`.

**Vídeos** (hospedar em `public/videos/`, sem hotlink):

| Arquivo publicado | Fonte | Peso original | Onde | Carregamento |
|---|---|---|---|---|
| `hero-supressao-720.mp4` | Pexels 34775810, 720p, 8 s | 5,91 MB | S1, na janela | depois de `load` + idle |
| `plataforma-tablet-720.mp4` | Pexels 7100844, 720p, 21,3 s | 2,40 MB | S6 passo 01 (janela "IMAGEM ILUSTRATIVA"), só no desktop | quando a seção estiver a até 1 tela de distância |
| `cta-chamas-720.mp4` | Mixkit 52312, 720p, 18,7 s | 7,11 MB | S12, dentro da gota | a até 1 tela de distância, nunca no celular sem 4G |
| `venda-extintor-720.mp4` | Pexels 8965440, 720p, 6,4 s | 1,91 MB | prévia do S-07 no S4 e hero de `/venda-de-equipamentos/` | ao ativar a linha ou ao entrar na página |

- **Posters:** derivados dos links de poster de `videos.md`, convertidos para AVIF/WebP.
- **Remux:** os MP4 fragmentados (hero) passam por remux com `+faststart`. Opção sem instalar nada no sistema: `ffmpeg-static` 5.3.0 como devDependency num `scripts/videos.mjs`, que faz o remux e, se possível, recodifica (H.264 CRF 28, 720p, sem áudio) para ficar em até 3 MB por clipe.
- **Licença:** nenhum vídeo tem pessoa apresentada como equipe ou cliente.
- **Créditos:** os autores ficam creditados numa página `/creditos/` simples (opcional, recomendado em `videos.md`).

---

## 10. CTAs e eventos de lead (padrão do Seven)

Regras:
- **Todo CTA é um `<a>` real** (`https://wa.me/...`, `tel:+551149778720`, `mailto:`) com `data-lead-channel` (`whatsapp | phone | email`), `data-lead-location` e `onClick → trackLead(channel, location, detail)` → `dataLayer.push({ event: "lead_click", lead_channel, lead_location, lead_detail })`.
- **Conversões do Ads:** ficam no acionador de clique de link do GTM (`Click URL` contém `wa.me` ou começa com `tel:`). O `lead_click` é só para o GA4, para não duplicar.
- **GTM:** só no domínio de produção (regex `/(^|\.)protecin\.com\.br$/`), ou com `?gtm_debug=x` ou `?track=1` na prévia. O ID vem de `import.meta.env.VITE_GTM_ID`; **vazio = sem GTM**. É pendência do Gabriel e não se inventa ID.
- **Na prévia:** o `dataLayer` existe mesmo sem GTM.

Valores de `lead_location`:

| Valor | Onde |
|---|---|
| `hero` | S1 |
| `nav` | header desktop |
| `menu_mobile` | menu do celular |
| `barra_mobile` | barra inferior do celular |
| `botao_flutuante` | WhatsApp flutuante no desktop |
| `diagrama` | S3 |
| `servicos` | S4 (`lead_detail` = slug) |
| `plataforma` | S6 |
| `credibilidade` | S7 |
| `catalogo` | S11 |
| `cta_final` | S12 |
| `orcamento` | S13 (`lead_detail` = slugs) |
| `contato` | S14 e `/contato/` |
| `rodape` | rodapé |
| `pagina_servico` | páginas de serviço (`lead_detail` = slug) |
| `pagina_app` | `/nosso-app/` |

Outros eventos:

| Evento | Parâmetros |
|---|---|
| `service_open` | `servico` |
| `diagram_layer` | `layer` |
| `platform_step` | `passo` |
| `plate_callout` | `prancha`, `item` |
| `catalog_download` | `lead_location` |
| `form_open` | – |
| `form_step` | `passo` |
| `form_lead` | `servicos`, `setor`, `cidade` |
| `map_directions_click` | – |
| `virtual_page_view` | `page_path`, `page_title` |
| `motion_toggle` | `modo` |

Tudo isso vai documentado num `TRACKING.md`, entregue ao Gabriel junto com as pendências de GTM e Ads.

**Frequência dos CTAs:**
- "Solicitar orçamento" aparece na nav, no hero, no fim do S6, no S12, em toda página de serviço e no menu.
- O WhatsApp aparece em toda dobra, pelo flutuante ou pela barra.
- Nenhum CTA promete "gratuito".

---

## 11. Movimento reduzido (`prefers-reduced-motion`)

**Decisão:** honrar a preferência com um **modo suave**, sem desligar o motion, e dar uma saída explícita para a apresentação. Motivo:
- no Windows, a preferência vem ligada só porque os "efeitos de animação" estão desligados (armadilha 1 do Seven);
- o Seven resolveu com `reducedMotion="never"`;
- aqui o pedido é "tudo animado", mas sem ignorar quem precisa de menos movimento.

Como o modo é escolhido (`MotionModeProvider`, calculado em `useEffect` para não quebrar a hidratação):
1. `?motion=full` força o modo completo (salvo em `sessionStorage`, em try/catch). **Usar este link na apresentação para a Protecin.**
2. `?motion=suave` força o modo suave.
3. O interruptor do rodapé grava `localStorage "pt-motion"` (em try/catch) e dispara `motion_toggle`.
4. Sem nenhuma das opções acima, `matchMedia("(prefers-reduced-motion: reduce)")` define suave; o resto fica no modo completo.

O framer fica com `MotionConfig reducedMotion="never"`. Quem decide é cada primitiva, pelo `useMotionMode()`.

| Recurso | Modo completo | Modo suave |
|---|---|---|
| Entradas (`Reveal`, `SplitWords`, `ClipReveal`, cards) | como especificado | `opacity 0→1` e `y 6 → 0` em 400 ms; sem máscara por palavra (o título entra inteiro) |
| `DrawPath`, `DrawIcon`, cotas, réguas | desenho | desenho mantido, em 400 ms (não é movimento espacial) |
| `Odometer` | dígitos rolando | o valor conta por texto em 800 ms, sem rolar |
| `TextScramble` | embaralha | fade de 200 ms |
| Parallax, deriva da grade, câmera do diagrama | ligados | desligados |
| Seções fixadas S3, S6 e S8 | scrub | layout de celular (sticky com cards), com troca por estado e fade |
| `VelocityMarquee` | fita | grade estática de logos |
| Vídeos | autoplay mudo | só poster; botão "reproduzir" opcional |
| Lenis | ligado (desktop) | desligado (rolagem nativa) |
| `CoordCursor`, `Magnetic`, `TiltCard` | ligados | desligados |
| Preloader | 1,6 s / 350 ms | sem preloader |
| Transição de página | cortina | crossfade de 200 ms |
| Pulsos e anéis | 1 vez | desligados |
| Manifesto S12 | escala do fogo | símbolo estático com fade |

**Seguro contra conteúdo invisível** (armadilha 21 de `padroes-codigo.md`):
- `<noscript>` com o CSS que zera `opacity:0` e `clip-path` dos estilos inline;
- `html.motion-failed` aplicado em 4 s se `motion-up` não for adicionado depois da hidratação.

---

## 12. Orçamento de desempenho e verificação

| Métrica | Meta | Como cumprir |
|---|---|---|
| LCP (Lighthouse mobile, 4G lento, CPU 4x) | ≤ 2,5 s, com o preloader | poster do hero em AVIF ≤ 150 KB (1024w no celular, 1600w no desktop) com `<link rel="preload" as="image" fetchpriority="high" imagesrcset>` via `%BASE_URL%`; janela começa em `inset(6%)` (pintada); preloader ≤ 1,6 s (se o LCP passar de 2,5 s, cortar para 600 ms) |
| CLS | ≤ 0,05 | `aspect-ratio` em toda mídia; fallback de fonte com `size-adjust`; nav com altura fixa |
| INP | ≤ 200 ms | nada pesado em `onClick`; o configurador só faz `setState` |
| JS inicial (gzip) | ≤ 190 KB | React 18 + framer-motion 11 + Lenis + app; ícones Lucide importados um a um; sem React Router |
| CSS (gzip) | ≤ 30 KB | Tailwind com purge |
| Fontes | ≤ 200 KB | 3 variáveis, só `latin`; preload só da Archivo |
| Primeira carga sem vídeo (acima da dobra) | ≤ 900 KB transferidos | imagens abaixo da dobra com `loading="lazy"` e `decoding="async"` |
| Imagens por seção | ≤ 180 KB cada (1600w AVIF) | `srcset` 640, 1024, 1600 e 2400 |
| Vídeo do hero | ≤ 3 MB depois de recodificar (teto de 6 MB com o 720p original) | carrega depois de `load` + idle |
| Vídeos no total, rolando a home inteira | ≤ 14 MB | um vídeo tocando por vez; `preload="none"` |
| Política de rede para vídeo | – | não carrega com `navigator.connection.saveData`, `effectiveType` diferente de `4g`, modo suave ou, no celular abaixo de 768 px, nos vídeos do S6 e S12 |
| FPS | desktop ≥ 60 (CPU normal) e ≥ 30 (CPU 4x) nas seções fixadas; celular ≥ 40 (CPU 4x) | só `transform`, `opacity`, `clip-path` e `pathLength` animam; nada de `getBoundingClientRect` por quadro; só 1 animação infinita ativa (fita ou pacotes) e 1 vídeo; tudo pausa fora da tela (IntersectionObserver) |
| Lazy load | – | vídeos: `when` em `LazyVideo`; iframe do mapa com `loading="lazy"`; S6 e S12 hidratam os efeitos pesados só quando estão a 1 tela de distância |

**Verificação** (`scripts/verify.mjs`, adaptado da Indafire, com `puppeteer-core` e o Chrome instalado):
- 6 tamanhos de tela;
- testes nos dois modos (`?motion=full` e com reduce emulado);
- testes sem JS e com `animation:none`;
- zero elemento invisível (opacidade efetiva);
- cobertura de `data-motion` ≥ 98% dos elementos com texto ou mídia;
- zero overflow horizontal e zero erro de console;
- links `wa.me` no formato `^https://wa.me/55\d{10,11}(\?text=|$)`;
- vídeos e posters respondendo 200;
- `noindex` presente quando `VITE_BASE !== "/"`;
- desempenho com `medir-desempenho.mjs --cpu 4` (com e sem `--mobile`).

---

## 13. O que não fazer

- **Imagens:**
  - nenhuma foto de bombeiro, nem `Team-*` ou `Testi-*`;
  - nenhuma legenda de estoque como "nossa equipe";
  - nenhuma pessoa de vídeo apresentada como funcionária ou cliente.
- **Nomes e marcas:**
  - o nome do banco não aparece em URL, alt ou texto;
  - Bosch, VESDA, Firebee e Germek não são chamadas de "autorizadas";
  - "Eco Friendly" não é certificação.
- **Dados:**
  - nenhum número em gráfico de mockup;
  - nenhum mapa com os 10 estados (a lista não existe);
  - nenhum percentual de satisfação;
  - nenhum depoimento ou logo de cliente.
- **Promessas:** nada de "orçamento gratuito", "visita gratuita" ou "AVCB aprovado".
- **Vídeo:** nenhum vídeo de "sprinkler" de irrigação.
- **Técnica:**
  - nenhuma animação piscando (fogo ou sirene em loop) fora do S12;
  - nenhum `overflow: hidden` em contêiner com animação `view()` (usar `clip`).

---

## 14. Pendências com a Protecin (não bloqueiam a demo)

- **Marca:** vetor oficial do logo e versão branca.
- **Prova social:**
  - logos de clientes autorizados (as células tracejadas mostram o espaço);
  - fotos reais de obras, sede, frota e técnicos usando o app (para substituir o estoque e a Prancha C);
  - vídeo real de inspeção e teste hidrostático.
- **Conteúdo:**
  - texto da fundação (Extimbrás contra "fundador Cláudio Szulcsewski");
  - "sete anos" da Kids ONG;
  - se o preço único ainda vale (hoje fora da demo);
  - lista de estados;
  - registro Inmetro e Cetesb;
  - associação de normas por camada no S3 (contexto técnico público, a validar);
  - conteúdo das 7 subpáginas de serviço e do PDF do catálogo (a raspar antes da versão final).
- **Com o Gabriel:** ID do GTM e conversões do Ads.
- **Projeto:** nome do repositório (que vira o `VITE_BASE`). Sugestão: `protecin-demo` (`VITE_BASE=/protecin-demo/`), portas `5186` (dev) e `4186` (preview).
