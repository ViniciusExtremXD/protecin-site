# Direção 3: "Legado e confiança" (Edição comemorativa dos 50 anos)

Direção de arte e de motion para a demo do site novo da Protecin (proposta de redesign), escrita em 28/10/2026.

**Fontes** (tudo o que aparece no site sai delas, nada foi inventado):
- `referencia/conteudo-estruturado.md`: textos literais, citados como §;
- `pesquisa-mercado.md`;
- `padroes-codigo.md`: stack e padrões do Extin Seven e da Indafire;
- `videos.md`;
- `qa/REGUA-SITE-NOVO.md`: critério de aceite;
- as imagens de `referencia/imagens-site-atual/`.

Quando um pedido do briefing não tem fato que o sustente, o documento diz o que fica no lugar. Ver a seção 2.

Sumário:
- 0. A ideia em 6 linhas
- 1. Conceito e por que vende
- 2. Regras de honestidade desta direção
- 3. Sistema visual
- 4. Sistema de motion
- 5. Mapa do site
- 6. Home
- 7. Institucional
- 8. Serviços
- 9. Nossos Clientes
- 10. Nosso App
- 11. Catálogo Digital
- 12. Contato, 404 e Créditos
- 13. Elementos globais
- 14. Imagens e vídeos
- 15. CTAs e eventos de lead
- 16. `prefers-reduced-motion`
- 17. Orçamento de desempenho
- 18. Arquivos e componentes a criar
- 19. Pendências
- 20. Aceite específico desta direção

---

## 0. A ideia em 6 linhas

1. O site é a **edição comemorativa dos 50 anos da Protecin (1976–2026)**, com cara de revista institucional impressa: capa, sumário, fólios, legendas e citações.
2. A peça central é a **linha do tempo de 1976 a 2026**. É uma faixa horizontal fixada na tela: a rolagem vira as páginas, o ano ativo gira como um odômetro e um fio vermelho atravessa a história.
3. A fotografia aparece em molduras com parallax. Toda foto tem legenda com crédito: "Acervo Protecin" ou "Imagem ilustrativa". O crédito vira ferramenta de credibilidade.
4. O ritmo é de revista: alterna páginas claras (papel) e escuras (marinho), títulos em serifa revelados linha a linha, números grandes, fios que se desenham e marcas em fita.
5. Tudo entra animado:
   - acima da dobra, em CSS puro, que roda antes do JavaScript e não atrasa o LCP;
   - abaixo da dobra, em framer-motion com Lenis.
6. Os CTAs de orçamento ficam acima da dobra no celular e no desktop e se repetem no fim de cada página. Seguem o padrão `lead_click` do Seven.

---

## 1. Conceito e por que vende

### 1.1 Conceito: "a revista dos 50 anos"
Empresa com 50 anos não precisa parecer startup. Precisa parecer **instituição**: alguém que guarda arquivo, assina embaixo e cuida das pessoas. A linguagem editorial passa isso de imediato:
- **serifa de alto contraste** nos títulos (Fraunces), sans geométrica parente do logotipo no texto (Manrope);
- **papel quente** (`#F5F0E8`) no lugar do branco de template, com o azul-marinho e o vermelho do logo como tinta;
- **sistema de legendas**: cada imagem diz o que é e de onde vem;
- **numerais gigantes**: 1976, 20.000+ e 50 tratados como manchete.

O motion é o "virar de página". Nada pisca, nada pega fogo. O movimento revela hierarquia: a linha que se desenha, o ano que gira, a foto que se abre como página dobrada.

### 1.2 Por que vende (para a Protecin e para quem compra da Protecin)
1. **O momento é único e tem data.** 1976 + 50 = 2026. Entre os prestadores de serviço analisados, o mais antigo é de 2009 (Smart Fire). A proposta se vende sozinha: "o site dos 50 anos", para lançar no aniversário.
2. **Números de outra ordem de grandeza, tratados como manchete.** O site mostra 20.000+ clientes atendidos; os concorrentes mostram 500+ clientes ou 1.000+ projetos (`pesquisa-mercado.md` §3). Na revista, o número é o título ("Mais de 20.000 clientes atendidos."), no formato Verkada, e não um contador perdido numa faixa.
3. **Credibilidade por transparência.** Os concorrentes usam foto de banco como se fosse obra. Aqui, a legenda "Imagem ilustrativa" e o crédito "Acervo Protecin" mostram ao comprador B2B (síndico, facilities, engenheiro) que a empresa não maquia. A mesma linha editorial cabe para as fotos reais que a Protecin mandar depois.
4. **Corrige os buracos medidos no site atual** (`qa/RELATORIO-SITE-ATUAL.md`):
   - chamada para orçamento acima da dobra;
   - `tel:` e `mailto:` clicáveis;
   - meta description e Open Graph;
   - `alt` em todas as imagens;
   - um H1 por página;
   - parágrafos legíveis (fim do Oswald condensado).
5. **Nenhum concorrente tem motion de verdade.** O máximo é um marquee em CSS (`pesquisa-mercado.md` §1.5). Uma linha do tempo fixada com odômetro coloca a Protecin num patamar visual que o ABC não tem.
6. **Humano sem inventar gente.** O "depoimento visual" vem da própria voz da empresa: missão, "Cuidar também é prevenir." e "Cuidar de vidas também é transformar futuros." O Kids ONG aparece com fotos do acervo. A estrutura já fica pronta para depoimentos reais quando forem gravados.

### 1.3 O que esta direção não faz (de propósito)
- **Sem fogo, brasas, sirene ou bombeiros em ação.** A Protecin é engenharia, inspeção e manutenção, não brigada, e as fotos de bombeiros são sobra de template (§3.4). O vídeo de chamas da Mixkit fica fora desta direção.
- **Sem preloader de tela cheia.** O contador "1976 → 2026" vira o número da edição dentro da capa. A régua não deixa conteúdo principal escondido por mais de 1 s, e o LCP tem de acontecer no primeiro paint.
- **Sem cursor customizado e sem glassmorphism.** Fica só uma prévia de imagem que segue o ponteiro no índice de serviços.
- **Sem dado de mentira dentro dos mockups.** As telas do app usam os rótulos reais e barras neutras no lugar de nomes de clientes.

---

## 2. Regras de honestidade desta direção

| Pedido do briefing | O que existe de fato | Como fica na demo |
|---|---|---|
| Parede de clientes em marquee | Nenhum cliente citado por nome (§1.9). Os logos de "Nossos Clientes" são de fabricantes e entidades | **Parede de setores**: marquee tipográfico com Financeiro, Tecnologia, Saúde, Industrial, Agronegócio, Energia e Transporte. Mais o **marquee de marcas**, rotulado "Marcas com que trabalhamos", nunca "clientes". O componente `ClientWall` fica pronto com `CLIENTS = []` e só aparece no modo proposta (abaixo) |
| Depoimento visual da equipe | Nenhuma foto da equipe e nenhum depoimento. `Team-*` e `Testi-*` são template | **"A voz da Protecin"**: 3 painéis empilhados com as frases da própria empresa (missão e visão, sustentabilidade, Kids ONG). O slot `TeamVoices` (vídeo vertical da equipe) fica pronto com `TEAM_VOICES = []` e só aparece no modo proposta |
| Fotografia em parallax | 2 fotos reais de obra (`4.jpg`, `Bradesco-024.jpg`), telas reais do app, colagem do Kids ONG e fotos de banco | Todas as fotos em `CaptionedFigure`, com `credit: "acervo" \| "ilustrativa"` obrigatório no tipo. O TypeScript não compila uma figura sem crédito. Foto de banco nunca recebe legenda de "nossa equipe" ou "nossa obra" |
| Linha do tempo de 50 anos | 9 marcos reais (1976 a 2024), sem nenhuma foto histórica | Numerais gigantes como protagonistas, com foto ilustrativa legendada por marco. O cartão 2026 é derivado ("50 anos" = 1976 + 50) e usa o símbolo da marca, não foto |
| Autorizações de fabricantes | Kidde Brasil, Everlux, Notifier e Simplex (texto da home) | "Autorizada" só nessas 4. VESDA, Bosch, Firebee e Germek ficam como "Marcas com que trabalhamos". ABSpk e NFPA como "Filiações técnicas" (§1.4) |

**Modo proposta** (`?proposta=1`, guardado em `sessionStorage` com try/catch): mostra os espaços reservados, cada um com borda tracejada `papel-500`, ícone `ImagePlus` e o texto "Espaço reservado: conteúdo a enviar pela Protecin". Os espaços são:
- parede de clientes;
- depoimentos da equipe;
- portfólio de obras;
- selo de preço único.

Uma etiqueta fixa "Modo proposta", no canto inferior esquerdo, avisa que a página está nesse modo. Sem o parâmetro, a régua vale: "se o fato não existe, a seção não existe".

**Roteiro sugerido para quando a Protecin autorizar** (vai na proposta, não no site): 3 depoimentos verticais de 20 a 30 s, gravados na sede da Rua Lacônia:
- um técnico de campo usando o App de Coleta;
- um engenheiro (ART e AVCB);
- o atendimento.

Planos de apoio: teste hidrostático, frota e oficina. Esses vídeos substituem os de banco da seção 14.

---

## 3. Sistema visual

### 3.1 Paleta (tokens)
As cores da marca foram amostradas do logo (`Ativo-1.png`, `SIMBOLO.png`). Os contrastes foram calculados pela fórmula WCAG.

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `marinho-950` | `#071A2B` | Texto principal em papel; fundo das páginas escuras | 15,5:1 sobre `papel-100` |
| `marinho-900` | `#0A2438` | Fundo escuro alternativo (Em campo, rodapé) | |
| `marinho-800` | `#0E3452` | **Azul da marca**: logo, numerais ativos, botão secundário | 11,3:1 com `papel-100` |
| `marinho-700` | `#1A4569` | Bordas e hover em fundo escuro | |
| `marinho-300` | `#8FA9C0` | Texto secundário em fundo escuro | 7,2:1 sobre `marinho-950` |
| `marinho-100` | `#DCE5EE` | Fundo de chip e de tela de app recriada | |
| `vermelho-700` | `#9C1922` | Hover do CTA (varredura) | |
| `vermelho-600` | `#BE1E29` | **Vermelho da marca**: CTA primário, palavra destacada, fio de progresso, ponto da linha do tempo | Branco sobre ele 6,2:1; ele sobre `papel-100` 5,4:1 (AA) |
| `laranja-500` | `#E8442E` | Vermelho-alaranjado do símbolo. **Só em fundo escuro e em tamanho ≥ 24 px**: palavra destacada e gota | 4,4:1 sobre `marinho-950` (texto grande) |
| `papel-50` | `#FBF8F3` | Fundo de cartão e de seção clara alternada | |
| `papel-100` | `#F5F0E8` | **Fundo padrão** das páginas claras | |
| `papel-200` | `#EAE2D5` | Fundo da "Voz", varredura de hover nas linhas, cortina de transição | |
| `papel-300` | `#D8CDBB` | Fios, numeral inativo da linha do tempo | Decorativo |
| `papel-500` | `#9C907E` | Borda tracejada do modo proposta | Decorativo |
| `grafite-600` | `#4B5866` | Texto secundário e legendas em papel | 6,4:1 sobre `papel-100` |
| `grafite-400` | `#7D8894` | **Só decorativo** (3,2:1, reprova para texto) | |

Regras:
- Vermelho sobre marinho só como fio, ponto ou fundo de botão, nunca como texto (2,1:1).
- No escuro, o destaque em texto usa `laranja-500` grande ou `papel-50`.
- Nada de gradiente decorativo. O único gradiente é o véu sobre foto (`marinho-950` de 60 % a 92 %) para garantir contraste.
- Papel com grão **estático**: o SVG `feTurbulence` do Seven com opacidade 0,035, **sem a animação `grain`**, aplicado só nas seções claras.

```js
// tailwind.config.js (theme.extend)
colors: {
  marinho: { 950: "#071A2B", 900: "#0A2438", 800: "#0E3452", 700: "#1A4569", 300: "#8FA9C0", 100: "#DCE5EE" },
  vermelho: { 700: "#9C1922", 600: "#BE1E29" },
  laranja: { 500: "#E8442E" },
  papel: { 50: "#FBF8F3", 100: "#F5F0E8", 200: "#EAE2D5", 300: "#D8CDBB", 500: "#9C907E" },
  grafite: { 600: "#4B5866", 400: "#7D8894" },
},
screens: { pin: { raw: "(min-width: 1024px) and (min-height: 640px)" } }, // seções fixadas só aqui
```

### 3.2 Tipografia (2 famílias, Fontsource)
- **Display: Fraunces Variable** (`@fontsource-variable/fraunces`), eixos `wght` + `opsz`, com itálico.
  - Importar `@fontsource-variable/fraunces/opsz.css` e `@fontsource-variable/fraunces/opsz-italic.css`. Se os nomes de arquivo forem outros na versão instalada, usar os dois arquivos de `node_modules/@fontsource-variable/fraunces/` que contenham o eixo `opsz`.
  - `font-optical-sizing: auto`: em 120 px o opsz vai a 144 e fica fino e elegante; em 24 px fica robusto.
- **Texto e interface: Manrope Variable** (`@fontsource-variable/manrope`), `wght` de 200 a 800. É geométrica como o wordmark PROTECIN e não condensada, como pede a régua.
- Sai do Seven: Archivo, Inter e JetBrains Mono. A régua permite no máximo 2 famílias.

| Estilo | Família / peso | Tamanho | Entrelinha / tracking |
|---|---|---|---|
| `display-xl` (H1 da capa) | Fraunces 300 | `clamp(44px, 6.4vw, 112px)` | 0,98 / -0,02em |
| `display-l` (H1 interno, manchete de número) | Fraunces 300 | `clamp(40px, 4.6vw, 80px)` | 1,02 / -0,015em |
| `display-m` (H2) | Fraunces 350 | `clamp(32px, 3.4vw, 56px)` | 1,06 / -0,01em |
| `display-s` (H3) | Fraunces 400 | `clamp(24px, 2vw, 32px)` | 1,15 |
| `numeral` (anos, contadores) | Fraunces 200 | `clamp(96px, 16vw, 260px)` | 0,8 / -0,03em |
| `citacao` | Fraunces 300 itálico | `clamp(28px, 3.2vw, 52px)` | 1,15 |
| `lead` | Manrope 400 | 19 px desktop / 17 px celular | 1,6 |
| `corpo` | Manrope 400 | **17 px desktop / 16 px celular** (mínimo da régua) | 1,65; medida máxima 62ch |
| `legenda` | Manrope 500 | 14 px | 1,45, cor `grafite-600` |
| `credito` / `folio` | Manrope 600, caixa-alta | 11 a 12 px | tracking 0,18em |
| `botao` | Manrope 600 | 15 px (16 px no celular) | tracking 0,01em |

- Destaque em título: a palavra-chave em **Fraunces itálico** + `vermelho-600` (ou `laranja-500` no escuro). Exemplo: "há *50 anos.*"
- Números de contador e de ano: cada dígito numa coluna de largura fixa (`w-[0.62em] text-center`), sem depender de `tnum`, para o odômetro não fazer o layout dançar.
- Fallback sem CLS: `@font-face` "Fraunces Fallback" (local Georgia) e "Manrope Fallback" (local Arial), com `size-adjust` e `ascent-override` medidos (fontaine ou capsize). Conferir CLS < 0,1 no verify.

### 3.3 Grade e espaçamento
- **Desktop:** 12 colunas, `max-w-[1360px]`, calha de 24 px, margem lateral `clamp(16px, 4vw, 56px)`.
- **Celular:** 4 colunas, margem de 16 px e nenhuma rolagem horizontal (`body { overflow-x: clip }`, nunca `hidden`, para não quebrar `sticky`).
- **Ritmo:** múltiplos de 8 px. Seção: `py-[clamp(96px,12vw,176px)]`. Entre título e texto: 32 px. Entre blocos: 64 px.
- **Pontos de quebra:** Tailwind padrão (sm 640, md 768, lg 1024, xl 1280). As seções fixadas usam a variante `pin:`: ≥ 1024 px de largura **e** ≥ 640 px de altura. Numa tela deitada de 844 × 390 não fixa nada.

### 3.4 O kit revista (elementos que se repetem)
- **Fólio:** `02 · Em números`. Número em Manrope 600 12 px, fio de 32 px e rótulo em caixa-alta. Abre toda seção.
- **Fio:** linha de 1 px `marinho-950/15` (em papel) ou `papel-50/15` (no escuro). Separa linhas de listas, colunas de números e legendas. Sempre se desenha ao entrar.
- **Legenda (`CaptionedFigure`):** `figcaption` abaixo da imagem, com fio de 24 px, texto descritivo (`legenda`) e crédito (`credito`): "ACERVO PROTECIN" ou "IMAGEM ILUSTRATIVA". Numeração "Fig. 01" por página.
- **Capitular:** primeira letra do primeiro parágrafo de "Quem somos", da Kids ONG e do Compromisso. Fraunces 300, 3 linhas de altura, `vermelho-600`.
- **Citação:** Fraunces itálico com aspas penduradas (`“` fora da medida, `-0.45em`).
- **Selo dos 50:** círculo SVG com o texto em anel "PROTEGEMOS SEU MAIOR PATRIMÔNIO: A VIDA ·" (`textPath`) e "50" ao centro.
- **Símbolo vetorial (`SymbolMark`):** vetorização aproximada do `SIMBOLO.png` para animar. Pedir o arquivo oficial antes de produção (§4, Lacunas).

```svg
<!-- viewBox 0 0 100 100. Cantoneira-base (superior esquerda) e espelhos. -->
<svg viewBox="0 0 100 100" aria-hidden="true">
  <path id="c" d="M0 44.2V8.5A8.5 8.5 0 0 1 8.5 0H44.3V13.2H13.2V44.2Z" fill="#0E3452"/>            <!-- sup. esq. -->
  <use href="#c" transform="matrix(-1 0 0 1 100 0)" fill="#BE1E29"/>                               <!-- sup. dir. (vermelha) -->
  <use href="#c" transform="matrix(1 0 0 -1 0 100)" fill="#0E3452"/>                               <!-- inf. esq. -->
  <use href="#c" transform="matrix(-1 0 0 -1 100 100)" fill="#0E3452"/>                            <!-- inf. dir. -->
  <path d="M49.6 26H74.6V51A25 25 0 1 1 49.6 26Z" fill="#BE1E29"/>                                <!-- gota -->
</svg>
```

O `fill` do `<use>` só vale porque o `path#c` não tem `fill` próprio. Na implementação, tirar o `fill` do `#c` e aplicar em cada cópia. No escuro, as 3 cantoneiras ficam `papel-50` e a superior direita e a gota ficam vermelhas, igual ao splash do app (`App_1.png`).

- **Wordmark:** `Ativo-1.png`, convertido para WebP com 320 px e 640 px de largura. No escuro, `filter: brightness(0) invert(1)` (o acento do "O" fica branco; é aceitável).

### 3.5 Ícones
Um único conjunto: **lucide-react** (fixar a versão instalada no lockfile), `strokeWidth={1.5}`, 24 px, `currentColor`. A escolha é pelo traço: dá para "desenhar" cada ícone ao entrar (seção 4.4, `DrawIcon`).

Mapa de ícones:
- **Serviços:**
  - 1 Instalação `Wrench`;
  - 2 Projetos `DraftingCompass`;
  - 3 Documentação `FileCheck2`;
  - 4 Inspeções `ClipboardCheck`;
  - 5 Gestão e manutenção `Gauge`;
  - 6 Riscos `ShieldAlert`;
  - 7 Venda `FireExtinguisher`;
  - 8 Sinalização `DoorOpen`.
- **Contato e ações:** `Phone`, `Mail`, `MapPin`, `Clock`, `ArrowUpRight` (link), `ArrowDown` (download, nunca seta para cima), `Check`, `Plus`, `X`, `Menu`, `ImagePlus` (reservado).
- **Selos:** `UserCheck`, `ThumbsUp`, `MapPinned`.
- **App:** `Smartphone`, `MonitorDot`, `Cpu`, `BadgeCheck`, `WifiOff`, `FileText`, `MessagesSquare`, `Activity`, `ShieldCheck`, `LayoutDashboard`, `ScanLine`.
- **WhatsApp, Instagram e LinkedIn:** glifos próprios desenhados em traço 1,5 no mesmo grid de 24 (`src/components/icons.tsx`). Nada de emoji.

---

## 4. Sistema de motion

### 4.1 Tokens

| Token | Valor | Uso |
|---|---|---|
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` (o `EASE_OUT` do Seven) | Toda entrada |
| `ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | Máscaras, fios, cortinas |
| `ease-page` | `cubic-bezier(0.76, 0, 0.24, 1)` | Transição de página, menu |
| `ease-back` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Selo, carimbo NBR, chips |
| `linear` + mola | `useSpring(p, { stiffness: 120, damping: 30, mass: 0.4 })` | Tudo que é ligado à rolagem |
| mola magnética | `{ stiffness: 220, damping: 16, mass: 0.4 }`, força 0,25 | CTAs primários (só `pointer: fine`) |
| mola de prévia | `{ stiffness: 300, damping: 30 }` | Imagem que segue o cursor |
| `d-xs` / `d-s` / `d-m` / `d-l` | 200 / 400 / 700 / 900 ms | Hover de cor / legendas e botões / blocos / títulos e imagens |
| stagger | linhas 80 ms · palavras 40 ms · itens de lista 70 ms · números 120 ms | |
| gatilho | `whileInView`, `once: true`, `margin: "0px 0px -12% 0px"` | Elemento já entrou cerca de 12 % na tela |

**Limites da régua:**
- Toda entrada dura de 200 a 900 ms. O `ClipReveal` do Seven (1,2 s) e o `SplitWords` (1 s) **descem para 900 ms**.
- O primeiro movimento de qualquer bloco começa em até 120 ms depois do gatilho, então nenhum conteúdo fica mais de 1 s escondido.
- Nos efeitos de rolagem só se anima `transform` e `opacity`. A exceção é `stroke-dashoffset` em SVG.
- Mudança de cor ligada à rolagem é feita com duas camadas sobrepostas cruzando opacidade.

### 4.2 Notação usada nas tabelas das seções
- **R**: `Reveal`. `opacity 0→1` e `y 24px→0`, 700 ms, `ease-out`.
- **L**: `LineReveal`. Cada linha numa máscara `overflow:hidden`, `y 105%→0`, 900 ms, `ease-out`, stagger de 80 ms.
- **P**: `ParagraphLines`. Linhas medidas do parágrafo, `opacity 0→1` e `y 12px→0`, 600 ms, stagger de 60 ms.
- **C↑, C→, C←, C↔**: `ClipReveal`, 900 ms, `ease-inout`.
  - C↑: `inset(100% 0 0 0) → inset(0)`.
  - C→: `inset(0 100% 0 0) → inset(0)`.
  - C←: `inset(0 0 0 100%) → inset(0)`.
  - C↔: do centro, `inset(0 50% 0 50%) → inset(0)`.
  - Raio sempre de 2 px: editorial, quase reto.
- **F**: `Rule`. Fio com `scaleX 0→1`, `origin-left`, 900 ms, `ease-inout`. **F↕** é a versão vertical, com `scaleY` e `origin-top`.
- **D**: `DrawIcon`. Traço com `stroke-dashoffset 100→0`, 900 ms, `ease-out`.
- **O**: `Odometer`. Os dígitos giram uma volta completa e param no valor final, 900 ms, `ease-out`, 60 ms de atraso por dígito.
- **Px(n)**: `ParallaxFrame`. Imagem interna com `y -n% → +n%` ao atravessar a tela e `scale 1 + n/50`.
- **+N ms**: atraso relativo ao gatilho da seção.

### 4.3 Regra de ouro: acima da dobra em CSS, abaixo da dobra em framer-motion
O HTML é pré-renderizado. Se a capa dependesse do framer-motion, o H1 ficaria escondido até a hidratação, que leva de 1 a 2 s no 4G, e isso reprovaria a régua e o LCP. Por isso:
- **Capa, nav e abertura de cada página interna:** animações em **CSS keyframes** com `animation-fill-mode: both`. Elas rodam no primeiro paint, sem esperar o JS, e só disparam sob `html[data-motion="full"]`. Sem JS, o atributo não existe e tudo aparece parado.
- **Abaixo da dobra:** framer-motion. É o padrão do Seven, com o **seguro do item 21** de `padroes-codigo.md`: `<noscript>` mais `motion-failed` após 4 s, removendo `opacity:0` e `clip-path` inline.
- **Script síncrono no `<head>`**, antes de qualquer CSS que dependa dele. Ele define o modo de motion e arma o seguro:

```html
<script>
(function () {
  var h = document.documentElement, s = null, pref = null;
  try { s = window.sessionStorage; } catch (e) {}
  var q = location.search;
  try {
    if (/[?&]motion=1/.test(q)) s && s.setItem("pt-motion", "1");
    if (/[?&]motion=0/.test(q)) s && s.setItem("pt-motion", "0");
    if (/[?&]proposta=1/.test(q)) s && s.setItem("pt-proposta", "1");
    pref = s && s.getItem("pt-motion");
  } catch (e) {}
  var reduce = pref === "1" ? false : pref === "0" ? true
    : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  h.setAttribute("data-motion", reduce ? "reduced" : "full");
  h.classList.add("motion-ready");
  setTimeout(function () { if (!h.classList.contains("motion-up")) h.classList.add("motion-failed"); }, 4000);
})();
</script>
```

```css
/* styles.css: entradas da capa e das aberturas (CSS puro) */
@keyframes pt-line  { from { transform: translate3d(0, 105%, 0); } }
@keyframes pt-up    { from { opacity: 0; transform: translate3d(0, 16px, 0); } }
@keyframes pt-fade  { from { opacity: 0; } }
@keyframes pt-ruleX { from { transform: scaleX(0); } }
@keyframes pt-lift  { to   { transform: scaleY(0); } }       /* cortina sobre a moldura */
@keyframes pt-kb    { from { transform: scale(1.12); } }     /* Ken Burns */
@keyframes pt-seal  { from { opacity: 0; transform: scale(.6) rotate(-40deg); } }
@keyframes pt-nav   { from { transform: translate3d(0, -100%, 0); } }

html[data-motion="full"] .pt-line > span { display:inline-block; animation: pt-line 900ms cubic-bezier(.16,1,.3,1) both; animation-delay: calc(120ms + var(--i, 0) * 80ms); }
html[data-motion="full"] .pt-up   { animation: pt-up 700ms cubic-bezier(.16,1,.3,1) both; animation-delay: var(--d, 0ms); }
html[data-motion="full"] .pt-rule { transform-origin: var(--o, left); animation: pt-ruleX 900ms cubic-bezier(.65,0,.35,1) both; animation-delay: var(--d, 0ms); }
html[data-motion="full"] .pt-curtain { transform-origin: top; animation: pt-lift 900ms cubic-bezier(.65,0,.35,1) 150ms both; }
html[data-motion="full"] .pt-kb { animation: pt-kb 1600ms cubic-bezier(.16,1,.3,1) both; }   /* não esconde conteúdo */
html[data-motion="full"] .pt-seal { animation: pt-seal 700ms cubic-bezier(.34,1.56,.64,1) 700ms both; }
html[data-motion="full"] .pt-nav { animation: pt-nav 600ms cubic-bezier(.16,1,.3,1) both; }
```

- **No `App.tsx`:**
  - `useEffect(() => document.documentElement.classList.add("motion-up"), [])`;
  - `<MotionConfig reducedMotion={modo === "reduced" ? "always" : "never"}>`, lendo `data-motion` depois de montar;
  - Lenis só é criado com `data-motion="full"`.
- **Primitivas de framer-motion abaixo da dobra:** só se "armam" quando o elemento está abaixo da tela no momento da montagem. Se ele já está visível (por exemplo, numa âncora aberta direto), aparece sem animar e sem piscar.

### 4.4 Primitivas (em `src/components/motion/`)
Todas recebem `data-motion="<tipo>"` no wrapper, para o verify medir a cobertura de animação (`padroes-codigo.md` §11).

| Componente | Base | Especificação |
|---|---|---|
| `Reveal` | Seven | **R**. Props `as`, `delay`, `y` |
| `LineReveal` | novo | Recebe `lines: string[]` (quebras escritas no `site.ts`). Cada linha é um `span.block.overflow-hidden.pb-[0.08em]` com `motion.span` `y 105%→0`. Props `highlight` (palavras em itálico vermelho), `delay`. Se a linha quebrar no celular, ela ainda sobe como um bloco único. `aria-label` com o texto inteiro |
| `ParagraphLines` | novo | Depois de `document.fonts.ready`, mede o `offsetTop` de cada palavra para agrupar as linhas e anima **P**. No SSR é texto puro. Só arma se estiver abaixo da tela na montagem. Remede no resize (debounce de 150 ms) sem reanimar |
| `ScrollLitText` | Seven | Palavras com `opacity 0.14→1` ligada à rolagem, `offset ["start 85%", "end 45%"]`. `*palavra*` acende em `vermelho-600` com duas camadas cruzando opacidade |
| `ClipReveal` | Seven (ajustado) | **C↑ / C→ / C← / C↔**, 900 ms, raio de 2 px |
| `ParallaxFrame` | Seven + Indafire | Moldura `overflow: clip` com `<picture>` interno. Onde `CSS.supports("animation-timeline: view()")`, usa CSS (`@keyframes paralaxe`, `animation-timeline: view()`); senão, `useScroll` + `useTransform`. Prop `amount` (padrão 8) e `axis` (`y`, ou `x` dentro da faixa fixada) |
| `Odometer` | novo | Valor final no HTML (SEO e sem JS). Cada dígito é uma coluna com `0–9` repetido 2 vezes (20 itens). No SSR fica em `translateY(-(10+d)×5%)`. Ao armar, salta sem animação para `-(d×5%)`, que mostra o mesmo dígito, então não pisca. No gatilho anima até `-(10+d)×5%`, uma volta completa. Separador "." e sufixo "+"/"M+" fixos. Para mudar de valor (ano ativo), anima da posição atual para a nova pelo caminho mais curto para a frente |
| `Rule` | novo | **F / F↕**. Prop `delay`, `origin` |
| `DrawIcon` | novo | Envolve um ícone lucide. CSS `.icon-draw :is(path,line,polyline,circle,rect,ellipse){stroke-dasharray:100;stroke-dashoffset:100;transition:stroke-dashoffset 900ms cubic-bezier(.16,1,.3,1)}`; com `.is-in`, `stroke-dashoffset:0`. Prop `redrawOnHover` (redesenha em 600 ms) |
| `VelocityMarquee` | Seven | Fita com 4 cópias, velocidade somada à da rolagem. Acrescentar: `paused` (prop) e multiplicador `hoverFactor` (0,3 no hover); pausa fora da tela (`useInView`, sem `once`); no modo reduzido vira `flex-wrap` estático |
| `Magnetic` | Seven | Só `pointerType === "mouse"`, força 0,25 |
| `RollText` | novo | Texto de botão duplicado em `overflow:hidden`. No hover a cópia de cima sobe `-100%` e a de baixo entra, 400 ms, `ease-out` |
| `CursorPreview` | Seven (Services) | Imagem 320 × 240 que segue o cursor com mola. Aparece com `scale .8→1`, `rotate -3→0` e `opacity 0→1` em 250 ms; troca de imagem com crossfade de 200 ms. Só `pointer: fine` |
| `TiltCard` | Seven (Products) | `perspective 1000`, `rotateX/Y ±8°` por mola 220/18. Brilho (`linear-gradient`) acompanha o ponteiro |
| `PinnedTrack` | Seven (Works) | Faixa horizontal fixada (linha do tempo). Mede com ResizeObserver e `document.fonts.ready`: `distance = track.scrollWidth - innerWidth`, altura da seção `100vh + distance`. Só em `pin:` |
| `StackPanels` | Indafire (painéis) | Painéis `sticky top: calc(84px + i*16px)`. O painel coberto faz `scale 1→0.94` e o véu vai de `opacity 0→0.4`, guiados pelo progresso do painel seguinte (`["start end", "start start"]`). Se um painel for mais alto que `innerHeight - 120`, perde o sticky (ResizeObserver) |
| `CaptionedFigure` | novo | `figure` + `picture` (AVIF/WebP, `srcset`, `width/height`) + `figcaption`. Props obrigatórias `alt`, `caption`, `credit: "acervo" \| "ilustrativa"`. A legenda entra com **R** +300 ms e o fio com **F** +240 ms |
| `LazyVideo` | Indafire | `muted loop playsinline preload="none" poster`. O `src` entra quando falta 1 tela para aparecer. Pausa fora da tela (`threshold 0`). Mostra botão de play se o autoplay for bloqueado. No modo reduzido fica só o poster, com o botão. Prop `idleLoad` (capa: só depois de `load` + `requestIdleCallback`, timeout de 2 s, e só se `!navigator.connection?.saveData` e `effectiveType` não for `2g`/`slow-2g`) |
| `SymbolMark` | novo | SVG da seção 3.4. Prop `assemble`: cantoneiras `translate(±24px)→0` + `opacity`, 700 ms, stagger de 80 ms; a gota faz `scale 0→1` com mola 260/18 em +320 ms. Prop `draw`: contorno com `pathLength=1` e `stroke-dashoffset 1→0` em 900 ms, depois preenchimento com `opacity 0→1` em 300 ms |
| `Seal` | novo | Selo dos 50. `rotate` ligado ao `scrollY` (`v * 0.08` graus, com mola). Sem rotação infinita |
| `Folio` | novo | Número **R**, fio **F** +80 ms, rótulo **R** +120 ms |

### 4.5 Comportamento de hover e toque (regra geral)
- Hover só sob `@media (hover: hover) and (pointer: fine)`. No toque, o equivalente é `whileTap={{ scale: 0.97 }}` em botões, cartões e linhas, mais estado `:active` com fundo `papel-200` por 150 ms.
- Nenhum hover muda o layout (sem `flex-grow`, sem `height`). Só `transform`, `opacity` e cor.
- Foco visível: `outline 2px vermelho-600`, `offset 3px` em papel; `papel-50` no escuro. A ordem de foco segue a leitura.

---

## 5. Mapa do site

Rotas com barra no fim, para o GitHub Pages servir a pasta sem redirecionar.
- **Roteamento:** `react-router-dom` 6 com `BrowserRouter basename={import.meta.env.BASE_URL}`; no SSR, `StaticRouter`.
- **Prerender:** `scripts/prerender.mjs`, adaptado do Seven, percorre `ROUTES` e grava `dist/<rota>/index.html`, cada um com `<title>`, description, canonical, OG e JSON-LD próprios.
- **Cabeçalho:** o template tem o marcador `<!--head-->`. No cliente, `useHead()` atualiza título e description a cada troca de rota.

| Rota | `<title>` | `meta description` | Seções na ordem |
|---|---|---|---|
| `/` | Protecin \| Proteção técnica contra incêndio desde 1976 | Engenharia, inspeção e manutenção de sistemas contra incêndio em Santo André (SP). 50 anos, 20.000+ clientes atendidos, projetos com ART e suporte para AVCB. | H01 Capa · H02 Em números · H03 Compromisso · H04 Linha do tempo · H05 Serviços (índice) · H06 Em campo · H07 Autorizações e marcas · H08 Protecin App · H09 Setores · H10 A voz da Protecin · H11 Catálogo · H12 Orçamento · Rodapé |
| `/institucional/` | Institucional \| Protecin, 50 anos de história | Desde 1976 em Santo André (SP): nossa história, missão, visão e valores, política ambiental e o Kids ONG, projeto social financiado pela Protecin. | I01 Abertura (Quem somos) · I02 Cronologia · I03 Missão, visão e valores · I04 Diferenciais · I05 Sustentabilidade · I06 Kids ONG · CTA final |
| `/servicos/` | Serviços \| Instalação, projetos, AVCB e manutenção | Instalação de sistemas, projetos técnicos com ART, regularização e AVCB, inspeções, manutenção, gestão de riscos, venda de equipamentos e sinalização. | S01 Abertura + subnavegação · S02 8 serviços (um por bloco, `id` = slug atual) · S03 Faixa AVCB · CTA final |
| `/nossos-clientes/` | Nossos clientes \| Setores atendidos pela Protecin | Financeiro, tecnologia, saúde, indústria, agronegócio, energia e transporte. Autorizada Kidde Brasil, Everlux, Notifier e Simplex. | C01 Abertura · C02 Setores · C03 Marcas e filiações · (C04 Parede de clientes, só no modo proposta) · CTA final |
| `/nosso-app/` | Protecin App \| Gestão inteligente de inspeções | App de coleta que funciona offline, painel Web Master em tempo real e relatórios automáticos. Inspeções 100% conforme a NBR 12962 e a NBR 12779. | A01 Abertura · A02 Como funciona (3 módulos) · A03 Recursos (8) · A04 Conformidade e benefícios + vídeo · CTA final |
| `/catalogo-digital/` | Catálogo digital \| Protecin | Baixe o catálogo da Protecin: serviços, produtos, tecnologias e diferenciais reunidos em um PDF. | K01 Abertura com capa · K02 O que tem no catálogo · CTA final |
| `/contato/` | Contato \| Protecin, Santo André (SP) | Telefone (11) 4977-8720, WhatsApp (11) 94565-1751 e comercial@protecin.com.br. Rua Lacônia, 600, Santo André (SP). Segunda a sexta, 8h às 17h30. | T01 Abertura · T02 Formulário e canais · T03 Mapa · T04 Redes |
| `/creditos/` | Créditos de imagem \| Protecin | Fontes das fotos e vídeos ilustrativos usados no site. | Lista de créditos (`noindex`) |
| `404.html` | Página não encontrada \| Protecin | (sem) | Mensagem + links (`noindex`) |

**Outras regras do mapa:**
- **Âncoras da home** (para o sumário da capa e o menu): `#numeros`, `#compromisso`, `#historia`, `#servicos`, `#em-campo`, `#marcas`, `#plataforma`, `#setores`, `#voz`, `#catalogo`, `#orcamento`.
- **Redirecionamentos para produção** (`.htaccess` da Locaweb, 301):
  - os slugs antigos de serviço vão para `/servicos/#<slug>`; por exemplo, `/instalacao-de-sistemas-e-equipamentos` vai para `/servicos/#instalacao-de-sistemas-e-equipamentos`;
  - `/nosso-app` (sem barra) vai para `/nosso-app/`, e o mesmo para as outras páginas.
- **Prévia:** com `VITE_BASE ≠ "/"`, o build inclui `<meta name="robots" content="noindex, nofollow">`.
- **JSON-LD:** `ProfessionalService` com nome, `foundingDate: "1976"`, telefone, e-mail, endereço da Rua Lacônia 600, horário `Mo-Fr 08:00-17:30`, `sameAs` (Instagram e LinkedIn) e `hasOfferCatalog` (8 serviços), mais `WebSite`. Sem FAQ, porque não há perguntas e respostas reais.

---

## 6. Home

### H01 · Capa (`#topo`)
**Fundo:** `papel-100` com grão estático. Altura `min(100svh, 980px)`, mínimo de 720 px no desktop.

**Desktop:**
- Faixa de expediente (topo, logo abaixo da nav), na largura toda: "Edição comemorativa" à esquerda; "Nº 50 · 1976–2026" ao centro, com fios dos dois lados; "Santo André · SP" à direita.
- Colunas 1 a 7: rótulo, H1, texto, CTAs e o horário.
- Colunas 8 a 12: moldura 4:5 (altura máxima de 72svh) com vídeo e legenda abaixo. O **selo dos 50** (168 px) sobrepõe o canto inferior esquerdo da moldura (-48 px, -48 px).
- Base: faixa "Nesta edição" com 3 chamadas em 3 colunas (1–4, 5–8, 9–12) e fio por cima.

**Celular:**
- O expediente vira uma linha só, "Nº 50 · 1976–2026", centralizada entre fios.
- Abaixo, na ordem: rótulo; H1 (44 px); texto (16 px); CTAs empilhados em largura total (52 px de altura); horário.
- Moldura 4:5 em largura total, com o selo de 112 px no canto inferior direito; legenda.
- "Nesta edição" vira lista de 3 linhas de 64 px, com fio e `ArrowUpRight`.
- Conta conferida em 390 × 844: o segundo CTA termina por volta de 600 px, ou seja, acima da dobra.

**Conteúdo:**
- **Rótulo:** "Engenharia e proteção técnica contra incêndio" (descritor oficial do catálogo, §1.1).
- **H1:** linhas `["Protegendo vidas", "e patrimônios", "há 50 anos."]`, com "50 anos." em itálico `vermelho-600`. Fonte: headline atual, §2.1.
- **Texto:** "Referência em engenharia e proteção técnica contra incêndio, a Protecin oferece soluções em inspeção e manutenção de equipamentos com foco em segurança, conformidade e atendimento sob medida."
- **CTA 1:** `WhatsAppLink` "Solicitar orçamento". Mensagem: "Olá! Vim pelo site da Protecin e gostaria de solicitar um orçamento." `location="hero"`.
- **CTA 2:** `PhoneLink` "Ligar (11) 4977-8720", `location="hero"`.
- **Linha abaixo:** "Segunda a sexta, 8h às 17h30".
- **Moldura:** `LazyVideo` V1 (seção 14) com poster. Legenda: "Sistema fixo de supressão por gás." Crédito: "Imagem ilustrativa".
- **Selo:** texto em anel "PROTEGEMOS SEU MAIOR PATRIMÔNIO: A VIDA ·" e "50 / anos" ao centro. O "50" conta de 0 a 50 em 800 ms com `@property --n` + `counter()`; o valor real fica num `sr-only`.
- **"Nesta edição":**
  - 01 "1976 → 2026": "Nove marcos, da fundação pela Extimbrás ao software próprio." Leva a `#historia`.
  - 02 "8 serviços": "Do projeto com ART à manutenção certificada pelo INMETRO." Leva a `#servicos`.
  - 03 "Protecin App": "Inspeções 100% conforme a NBR 12962 e a NBR 12779." Leva a `#plataforma`.

**Motion (todo em CSS; o comportamento na rolagem vem do framer depois de hidratar):**

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Nav | `pt-nav` 600 ms | Seção 13 | Seção 13 |
| Expediente | Fios `pt-rule` a partir do centro (`--o:right` à esquerda, `left` à direita), 900 ms, +200 ms; textos `pt-up` +260 ms | `opacity 1→0` nos primeiros 30 % da saída | — |
| Rótulo | `pt-up` +60 ms | Com o bloco de texto | — |
| H1 | `pt-line` por linha, +120, +200 e +280 ms; "50 anos." ganha sublinhado vermelho `pt-rule` +900 ms | Bloco de texto: `y 0→-8%`, `opacity 1→0.35`, `offset ["start start","end start"]`, com mola | — |
| Texto | `pt-up` +420 ms | Com o bloco | — |
| CTA 1 | `pt-up` +520 ms | — | `RollText`; fundo varre `vermelho-700` (`scaleX 0→1`, origem à esquerda, 450 ms); seta `ArrowUpRight` sai na diagonal e outra entra (300 ms); `Magnetic` 0,25. Toque: `scale .97` |
| CTA 2 | `pt-up` +580 ms | — | Sublinhado `scaleX 0→1` 300 ms; ícone `Phone` `rotate -12°` 200 ms |
| Horário | `pt-up` +640 ms | — | — |
| Moldura | Imagem visível desde o 1º paint (**é o LCP**). Cortina `papel-100` por cima: `pt-curtain` (`scaleY 1→0`, a partir do topo, 900 ms, +150 ms); poster com `pt-kb` (`scale 1.12→1`, 1600 ms). O vídeo começa no `idleLoad` com crossfade de 400 ms sobre o poster | `y 0→10%` (parallax de saída) | Imagem `scale 1.03` em 700 ms |
| Legenda | `pt-up` +700 ms | — | — |
| Selo | `pt-seal` +700 ms; "50" conta em 800 ms | `rotate` ligado ao `scrollY` (0,08°/px) | — |
| "Nesta edição" | Fio `pt-rule` +600 ms; itens `pt-up` +650/+730/+810 ms | — | Número `x +4px`, título sublinha (`scaleX`), seta `x +6px`, 300 ms. Toque: fundo `papel-200` por 150 ms |

### H02 · Em números (`#numeros`)
**Fundo:** `marinho-950`. Foto `Home_BG_1-1.jpg` em sangria com opacidade 0,22, `grayscale(.3)` estático e véu `marinho-950` de 70 % a 95 %.

**Desktop:**
- Fólio "02 · Em números".
- H2 manchete em 10 colunas.
- Abaixo, 4 colunas separadas por fios verticais, cada uma com número (`numeral` limitado a 96 px) e rótulo (Manrope 15 px, `marinho-300`).

**Celular:** H2 em 3 linhas ("Mais de / 20.000 / clientes atendidos."); números em grade 2 × 2 com fios horizontais e verticais.

**Conteúdo** (§1.2):
- H2: "Mais de **20.000** clientes atendidos." O número é um `Odometer` em `laranja-500`.
- **50**: "anos de experiência, desde 1976".
- **3M+**: "equipamentos manutenidos".
- **5M+**: "inspeções realizadas".
- **250+**: "obras de médio e grande porte realizadas".

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Seção | — | Wrapper `scale .96→1`, `["start end","start 40%"]` (a "página que se abre") | — |
| Foto de fundo | Visível | **Px(10)** | — |
| Fólio | `Folio` | — | — |
| H2 | **L** por linha; o `Odometer` (20.000) gira em +300 ms | — | — |
| 4 números | **O**, stagger de 120 ms entre os números; sufixos fixos | — | Número `y -4px` e rótulo `marinho-300→papel-50` (camadas), 300 ms |
| Rótulos | **R**, +200 ms depois do número | — | — |
| Fios verticais | **F↕**, stagger de 80 ms | — | — |

### H03 · Compromisso (`#compromisso`)
**Fundo:** `papel-50`.

**Desktop:**
- Topo: manifesto em sangria de texto (colunas 1 a 11), `citacao` ampliada para `clamp(44px, 6vw, 104px)`.
- Abaixo, duas colunas:
  - colunas 1 a 6: sobretítulo, H2 e parágrafo com capitular;
  - colunas 8 a 12: lista de 3 selos (linhas com fio e ícone) e, embaixo, o bloco "Filiações técnicas" com as placas ABSpk e NFPA.

**Celular:** manifesto em 36 a 44 px; o resto empilhado.

**Conteúdo** (§2.1):
- Manifesto: "Protegemos seu maior patrimônio: *a vida.*" Slogan; "a vida." acende em vermelho.
- Sobretítulo: "Compromisso com a Segurança e a Excelência".
- H2: "Décadas de experiência na prevenção e combate a incêndios".
- Texto: "Desde 1976, a Protecin oferece soluções técnicas em prevenção e combate a incêndios, protegendo vidas e patrimônios com tecnologia, equipe especializada e estrutura sólida. Atuamos com responsabilidade e precisão na redução de riscos, e somos filiados às principais entidades do setor, reforçando nossa credibilidade e conformidade técnica."
- Selos (só texto, sem percentual):
  - `UserCheck`: "Equipe Técnica Qualificada";
  - `ThumbsUp`: "Alto Índice de Satisfação dos Clientes";
  - `MapPinned`: "Cobertura Técnica em Território Nacional".
- "Filiações técnicas": `ABSPK.png` e `NFPA.png`, em placas de 3:2.

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Manifesto | Visível em `opacity .14` | `ScrollLitText`, palavra a palavra | — |
| Sobretítulo | **R** | — | — |
| H2 | **L** | — | — |
| Capitular "D" | **C↑** 700 ms | — | — |
| Parágrafo | **P** | — | — |
| Selos | Por linha: fio **F**, ícone **D**, texto **R**; stagger de 120 ms | — | Ícone redesenha (600 ms); texto `x +4px` |
| Placas de filiação | **R** com `scale .96→1`, stagger de 100 ms | — | Logo `grayscale(1)→0`, `opacity .7→1`, 300 ms |

### H04 · Linha do tempo 1976–2026 (`#historia`) · peça central
Antes da seção vai um link "Pular a linha do tempo", visível só com foco, que leva a `#servicos`. Marcação: `<ol>` com cada marco num `<li>` e o ano como `<h3>`.

**Desktop (`pin:`), `PinnedTrack`:**
- Altura da seção `100vh + distance`. Palco `sticky top-0 h-screen`, fundo `papel-100`.
- **Cabeçalho do palco** (no topo, 96 px):
  - colunas 1 a 6: fólio "04 · Nossa história" e H2 "Tradição e inovação que evoluem juntos";
  - colunas 9 a 12: **ano ativo** num `Odometer` em `numeral` limitado a 128 px, `vermelho-600`, com "de 2026" ao lado (Manrope 12 px).
- **Faixa** (no meio, cerca de 60vh):
  - `flex`, espaço de 6vw entre os itens, 6vw de recuo à esquerda e 20vw de folga à direita.
  - São 10 itens, cada um com `w-[min(58vw,860px)]` e grade de 2 colunas.
  - Coluna 1: moldura 4:5 com 52vh de altura, imagem e legenda.
  - Coluna 2: numeral do ano (Fraunces 200, 14vw, máximo de 220 px), H3, texto literal (17 px, até 38ch) e crédito.
- **Trilho** (na base, a 48 px):
  - fio `papel-300` na largura toda, com 10 marcas e o ano de cada uma embaixo (12 px);
  - por cima, fio `vermelho-600` com `scaleX = p`;
  - um ponto de 12 px com `translateX(p × largura do trilho)`;
  - o rótulo do ano ativo em 600.

**Matemática:**
- `p` = progresso da seção com mola, de 0 a 1; `n` = 10.
- `x` da faixa = `-p × distance`.
- `ativo = round(p × (n-1))`, via `useMotionValueEvent`. Ele alimenta o odômetro do cabeçalho e dispara `timeline_complete` (uma vez) quando chega a 9.
- Para o item `i`: `d = p × (n-1) - i`.
- Numeral: duas camadas, `papel-300` e `marinho-800`. A camada escura recebe `opacity = 1 - min(|d|, 1)`.
- Imagem interna: `x = d × -10%` (parallax horizontal).
- A primeira vez que `d > -0.6`, a moldura abre com **C←** (900 ms, disparada uma vez, não ligada à rolagem), H3 com **L** e texto com **R** +150 ms.

**Os 10 itens** (texto literal de §2.2):

| # | Ano | H3 (rótulo editorial) | Texto | Imagem | Crédito |
|---|---|---|---|---|---|
| 1 | 1976 | Fundação | "Fundação da Protecin pela Extimbrás, uma das pioneiras na fabricação de extintores no Brasil, com o objetivo de atender à crescente demanda por serviços de manutenção em equipamentos de combate a incêndio." | `Institucional_2.png` (mão com extintor) | Ilustrativa |
| 2 | 1986 | Nova fase | "Início de uma nova fase com a entrada dos atuais sócios e reposicionamento estratégico. A empresa passa a focar em grandes contratos, cria o conceito de preço único para inspeção e manutenção de extintores e oferece soluções personalizadas para gestão técnica de equipamentos." | `Inspecao_2.jpg` (manômetro conferido) | Ilustrativa |
| 3 | 2004 | Nova sede | "Aquisição de nova sede, mais ampla e moderna, elevando a produtividade e o conforto para clientes e colaboradores. Marca também o início da Política de Preservação Ambiental da empresa." | `Institucional_7.png` (muda nas mãos, recorte sobre `papel-200`) | Ilustrativa |
| 4 | 2006 | Talentos | "Criação do Programa de Desenvolvimento de Talentos, incentivando o crescimento pessoal e profissional da equipe. Ampliação do portfólio com produtos e sistemas especiais de combate a incêndio." | `Riscos_2.jpg` (briefing de equipe) | Ilustrativa |
| 5 | 2009 | Expansão | "Expansão da frota e presença consolidada em 10 estados brasileiros. Implantação do Programa Qualidade Total, voltado à excelência nos processos internos e no atendimento." | `Manutencao_1.jpg` (técnicos com tablet) | Ilustrativa |
| 6 | 2012 | Crescimento | "Crescimento nacional com a ampliação das instalações físicas, renovação de maquinários e veículos, e fortalecimento da estrutura operacional." | `Instalacao_1.jpg` (válvulas) | Ilustrativa |
| 7 | 2015 | Protecin Engenharia | "Lançamento da Protecin Engenharia, ampliando os serviços com foco em engenharia de combate a incêndio e soluções técnicas completas." | `Servicos_2.jpg` (planta técnica) | Ilustrativa |
| 8 | 2021 | Software próprio | "Inovação na gestão com o desenvolvimento e implantação de software próprio para combate e rastreabilidade dos equipamentos de combate a incêndio." Texto literal; a frase truncada do site fica marcada como pendência (seção 19) | `App_3.png` (login do app) | Acervo Protecin |
| 9 | 2024 | Tecnologia | "Novos investimentos em tecnologia, modernização dos métodos produtivos e aprimoramento do atendimento a clientes estratégicos, reafirmando o compromisso com a excelência, a inovação e a segurança." | `Inspecao_1.jpg` (painel de alarme) | Ilustrativa |
| 10 | 2026 | 50 anos | "Protegendo vidas e patrimônios há 50 anos." + "Protegemos seu maior patrimônio: a vida." + CTA `WhatsAppLink` "Solicitar orçamento" (`location="linha_do_tempo"`) | `SymbolMark assemble` (240 px) no lugar da foto | — |

No item 10, quando `d > -0.6`, o `SymbolMark` se monta, as duas frases entram com **L** e o CTA com **R** +400 ms.

**Celular, tablet e modo reduzido** (mesma lista, outra composição):
- Cronologia vertical com trilho de 2 px a 24 px da margem. O preenchimento vermelho usa **F↕** ligado à rolagem: `scaleY = progresso`, `["start 70%","end 70%"]`.
- Cada item tem: ano em Fraunces 72 px, `sticky top-[80px]` dentro do próprio item; foto 4:3 com **C↑** + **Px(6)**; H3 **L**; texto **R**; legenda.
- O ponto do trilho acende quando o item cruza o centro (`useInView`, margem `-45% 0px -45% 0px`): `scale .6→1` e camada vermelha com `opacity 0→1`, 300 ms.

**Hover (desktop):** imagem `scale 1.04` em 700 ms; sublinhado do crédito. As marcas do trilho são botões que rolam até o ano com `lenis.scrollTo(posição, { duration: 1.2 })`. Toque: nada além da rolagem.

**As duas versões vão no DOM e alternam por CSS** (`hidden pin:block` e `pin:hidden`). Assim não há troca de layout depois de hidratar, nem CLS, e o HTML pré-renderizado já serve as duas.

### H05 · Serviços: índice (`#servicos`)
**Fundo:** `papel-50`.

**Desktop:**
- Fólio "05 · Serviços". H2 nas colunas 1 a 8; texto de apoio nas colunas 1 a 6.
- Lista de 8 linhas em largura total, com 112 px de altura e fio entre elas:
  - coluna 1: número "01";
  - colunas 2 a 8: título em Fraunces 300, `clamp(28px, 3vw, 48px)`;
  - colunas 9 a 11: resumo (15 px, `grafite-600`, `line-clamp-2`);
  - coluna 12: `ArrowUpRight`.
- O `CursorPreview` mostra a imagem do serviço.
- No fim: link "Ver todos os serviços" (`/servicos/`) e `WhatsAppLink` "Falar sobre um serviço" (`location="servicos"`).

**Celular:**
- Linhas com no mínimo 72 px: número, título (24 px) e `Plus`.
- Tocar abre um acordeão (`height auto`, 450 ms, `ease-inout`; o `Plus` gira 45°) com: miniatura 16:9 (**C↑**; a imagem só carrega ao abrir), resumo, botão "Pedir orçamento deste serviço" e link "Detalhes" (`/servicos/#slug`).
- Só um acordeão aberto por vez. O conteúdo fica sempre no DOM (`aria-hidden` quando fechado), para o SEO.

**Conteúdo** (§1.6):
- H2: "Engenharia, Inspeção e Manutenção em Sistemas de Prevenção e Combate a Incêndios".
- Apoio: "Da elaboração de projetos à gestão contínua dos equipamentos, oferecemos soluções completas para proteger pessoas, patrimônios e garantir a conformidade com normas técnicas e legais."
- As 8 linhas usam o "nome sugerido" de §1.6. O resumo é a versão **mais curta** do texto literal: para 1, 2, 4, 5 e 6, a de /servicos; para 3, 7 e 8, a única que existe.

**Prévias** (`CursorPreview`, 640 px, carregadas no primeiro hover da lista):

| Serviço | Imagem |
|---|---|
| 1 | `Instalacao_1.jpg` |
| 2 | `Servicos_2.jpg` |
| 3 | `architect-project-engineer-...-1-1.jpg` |
| 4 | `Inspecao_2.jpg` |
| 5 | `Manutencao_1.jpg` |
| 6 | `Riscos_2.jpg` |
| 7 | `Venda_2.jpg` |
| 8 | `Riscos_1.jpg` |

Mensagem do WhatsApp por serviço: "Olá! Vim pelo site da Protecin e gostaria de um orçamento de {nome do serviço}." Com `location="servicos"` e `detail="{slug}"`.

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Fólio, H2, apoio | `Folio`, **L**, **P** | — | — |
| Fios das linhas | **F**, stagger de 70 ms | — | — |
| Número | **R** | — | Vira `vermelho-600` |
| Título | Máscara de 1 linha (**L**), stagger de 70 ms | — | `x 0→16px`, 400 ms; cor por camada; as outras linhas vão a `opacity .45` |
| Resumo | **R** +150 ms | — | — |
| Seta | **R** +200 ms | — | `rotate -45°→0`, 300 ms |
| Fundo da linha | — | — | Varredura `papel-200`, `scaleX 0→1` a partir da esquerda, 500 ms. Toque: `scale .99` + fundo |
| Prévia | — | Segue o cursor | Seção 4.4. Clique na linha: `service_open` e transição para `/servicos/#slug` |

### H06 · Em campo (`#em-campo`) · só acervo real
**Fundo:** `marinho-900`.

**Desktop:**
- Fólio "06 · Em campo", H2 e texto nas colunas 1 a 5.
- Figura A: `Bradesco-024.jpg`, 16:9, colunas 4 a 12, no topo.
- Figura B: `4.jpg`, 4:3, colunas 1 a 5, 120 px abaixo do topo de A.
- O resultado é uma composição em escada.

**Celular:** texto, depois A em largura total, depois B a 80 % da largura, alinhada à direita.

**Conteúdo:**
- H2: "250+ obras de médio e grande porte." (contador real, §1.2).
- Texto (§1.6, item 1, home): "Implantação de sistemas fixos e equipamentos contra incêndio com tecnologia atualizada, equipe especializada e componentes certificados para diferentes tipos de edificações e necessidades operacionais."
- Legenda A: "Bateria de cilindros de um sistema de supressão por gás, com manifold e válvulas." Crédito: "Acervo Protecin". **O nome do cliente nunca aparece** (§1.9).
- Legenda B: "Subsolo com rede de hidrantes, painel de alarme, extintor com etiqueta Protecin e sinalização de saída." Crédito: "Acervo Protecin".
- Tratamento no build (`sharp`): `modulate({ saturation: 0.92 })`, `gamma(1.05)` e leve `sharpen` em A e B, que são fotos de celular e de flash.
- No modo proposta, um terceiro bloco reservado: "Portfólio de obras: fotos a enviar pela Protecin".

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Fólio, H2, texto | `Folio`, **L**, **P** | — | — |
| Figura A | **C↑** | **Px(8)** | `scale 1.03`, 700 ms |
| Figura B | **C↑** +150 ms | **Px(-6)** (sentido contrário ao de A) e moldura `y 40px→-40px` (deriva) | `scale 1.03` |
| Legendas | Fio **F** +240 ms, texto **R** +300 ms | — | Crédito sublinha |

### H07 · Autorizações e marcas (`#marcas`)
**Fundo:** `papel-100`.

**Desktop:**
- Colunas 1 a 5: fólio "07 · Autorizações", H2 e texto.
- Colunas 7 a 12: 4 placas em 2 × 2 (3:2, borda de 1 px `marinho-950/12`, logo com até 56 px de altura, rótulo "AUTORIZADA" no canto superior esquerdo).
- Abaixo, em largura total: rótulo "Marcas com que trabalhamos" e `VelocityMarquee` com os 8 logos (40 px de altura, 96 px de espaço).

**Celular:** placas em 2 × 2 (cada uma com cerca de 160 px) e marquee com logos de 32 px.

**Conteúdo:**
- H2: "Autorizações oficiais: Kidde Brasil, Everlux, Notifier e Simplex." (§2.1, diferencial "Tradição e Credibilidade").
- Texto (§2.4): "A Protecin atua lado a lado com marcas reconhecidas globalmente, garantindo inovação, desempenho e qualidade em cada solução entregue."
- Placas: Kidde `4.png`, Everlux `3.png`, Notifier `5.png`, Simplex `Simplex.png`.
- Marquee, nesta ordem: Everlux `3.png`, Kidde `4.png`, Notifier `5.png`, VESDA `6.png`, Simplex `Simplex.png`, Bosch `BOSCH.png`, Firebee `FIREBEE.png`, Germek `LOGO-GRMK-AZUL-GERMEK.png`.
- Todos os logos passam por `sharp().trim()` no build e viram WebP com no máximo 12 KB.

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Fólio, H2, texto | `Folio`, **L**, **P** | — | Cada marca no H2 tem sublinhado **F** em sequência (+600 ms, stagger de 120 ms) |
| Placas | **C↑**, stagger de 100 ms; logo `opacity 0→.85` + `scale .92→1`, +200 ms | — | Placa `y -4px` e sombra `0 12px 32px marinho-950/8`; logo `grayscale→cor`; "AUTORIZADA" fica vermelho. Toque: `scale .98` |
| Marquee | **R** | `baseVelocity -2` + velocidade da rolagem | Fita a 30 % no hover; o logo sob o cursor ganha cor |

### H08 · Protecin App (`#plataforma`)
**Fundo:** `marinho-950`.

**Desktop (`pin:`):**
- Seção com 400vh e palco fixado.
- Colunas 1 a 5:
  - sobretítulo, H2 (`display-m`);
  - lista de passos 01 a 04 (botões, 15 px, ativo em `papel-50` e os outros em `marinho-300`, cada um com uma barrinha que enche com o progresso do passo);
  - texto do passo ativo.
- Colunas 6 a 12: palco dos aparelhos.
- Base do palco: link "Conhecer o Protecin App" (`/nosso-app/`) e `WhatsAppLink` "Falar sobre o Protecin App" (`location="plataforma"`).

**Celular, tablet e modo reduzido:** 4 blocos em sequência, cada um com número, título **L**, texto **P** e imagem do aparelho com **R** (`rotate -4°→0`, `y 40→0`).

**Conteúdo** (§2.1, "Plataforma"):
- Sobretítulo: "Tecnologia a favor da segurança e da gestão".
- H2: "Plataforma exclusiva Protecin: monitoramento inteligente e gestão eficiente onde você estiver".
- Passos, com o texto literal de cada pilar:
  - 01 Aplicativo para Técnicos;
  - 02 Painel Web para Gestores;
  - 03 Recursos Inteligentes;
  - 04 Benefícios para o Cliente.
- Mensagem do WhatsApp: "Olá! Vim pelo site da Protecin e quero conhecer o Protecin App."

**Palco por passo** (`p` de 0 a 1 dividido em 4; cada transição usa `useTransform` em `[início, início + 0.08]`):
- **01:** celular `App_3.png` no centro, com 70vh de altura. Em `p = 0.12`, a tela recriada "Ordens" (`OrdersScreen`) sobe por cima da tela de login (`y 100%→0`), recortada na área da tela do aparelho.
  - Rótulos da `OrdersScreen`, todos reais (§1.7): "Nº da Ordem"; "Nome do Cliente" (o nome é substituído por barra neutra `marinho-100`, nunca um nome); "Localização / Ver no mapa"; "Quantidades de Equipamentos: Total 3 (1 extintor e 2 hidrantes)"; "Andamento da vistoria: 1 de 3".
  - Ícones `Search`, `ScanLine` e `Bell`.
  - A barra de andamento faz `scaleX 0→0.33`.
- **02:** o notebook `App_2.png` entra pela direita (`x 30%→0`, `opacity 0→1`), enquanto o celular vai para a esquerda e diminui (`x 0→-28%`, `scale 1→0.78`). Uma linha tracejada em SVG do celular ao notebook se desenha (`stroke-dashoffset`), com o rótulo "ordens de serviço".
- **03:** 5 chips aparecem em volta dos aparelhos (`scale .8→1`, `ease-back`, stagger de 80 ms): "Coleta automatizada", "Análises estatísticas", "Com ou sem internet" (com `WifiOff`), "NBR 12962", "NBR 12779".
- **04:** lista de 4 benefícios com ícone `Check` desenhado (**D**, stagger de 120 ms): "Redução de erros e retrabalho", "Relatórios rápidos", "Transparência total", "Rastreabilidade de ponta a ponta".

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Sobretítulo, H2 | **R**, **L** | — | — |
| Texto do passo | `AnimatePresence mode="wait"`: sai `y 0→-24` + `opacity→0` (250 ms), entra `y 24→0` (500 ms, `ease-out`) | Troca pelo passo ativo | — |
| Lista de passos | **R**, stagger de 70 ms | Barrinha `scaleX` = progresso do passo | Clique leva até o passo com `lenis.scrollTo`. Hover: `x +4px` |
| Aparelhos | Celular **R** com `y 60→0` | Ver acima | Inclinação de ±4° pelo ponteiro (mola 220/18) |
| CTAs | **R** | — | Padrão da seção 13 |

### H09 · Setores atendidos (`#setores`)
**Fundo:** `papel-50`.

**Desktop:**
- Colunas 1 a 7: fólio "09 · Setores", sobretítulo, H2 e texto.
- Em largura total, duas fitas tipográficas em sentidos opostos:
  - fita 1: Fraunces 300, `clamp(56px, 8vw, 136px)`, `marinho-950`;
  - fita 2: Fraunces 300 itálico, só contorno (`-webkit-text-stroke: 1px marinho-950`, preenchimento transparente).
  - Separador: gota do `SymbolMark` com 0,4em, em `vermelho-600`.
- Abaixo, 3 colunas com fio no topo, numeral 01 a 03 (Fraunces 48 px), H3 e texto.

**Celular:** fitas com 44 px; colunas empilhadas.

**Conteúdo** (§2.4):
- Sobretítulo: "Presença sólida e confiável em empresas de alto padrão".
- H2: "Atendemos líderes de mercado em diferentes setores".
- Texto: "Com atuação nacional e décadas de experiência, a Protecin atende clientes que são referência em seus segmentos. A confiança dos nossos parceiros é reflexo do nosso compromisso com a excelência."
- Fita 1: "Financeiro · Tecnologia · Saúde · Industrial ·".
- Fita 2: "Agronegócio · Energia · Transporte ·".
- Colunas, com os 3 textos literais de §2.4:
  - 01 "Financeiro, Tecnologia e Saúde";
  - 02 "Industrial e Agronegócio";
  - 03 "Energia e Transporte".
- `ClientWall` vem logo abaixo, só no modo proposta: 12 espaços reservados em grade 6 × 2.

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Fólio, H2, texto | `Folio`, **L**, **P** | — | — |
| Fitas | **R** | `VelocityMarquee`: fita 1 `baseVelocity -1.2`, fita 2 `+1.2` | A palavra sob o cursor fica vermelha (camada); a fita cai a 30 % |
| Colunas | Fio **F**, numeral **O**, H3 **L**, texto **R**; stagger de 120 ms | — | Numeral fica vermelho |

### H10 · A voz da Protecin (`#voz`) · o "depoimento visual"
**Fundo:** `papel-200`.

**Desktop:**
- Cabeçalho: fólio "10 · A voz da Protecin" e H2.
- `StackPanels` com 3 cartões de 78vh, fundo `papel-50` e borda de 1 px:
  - colunas 1 a 7: rótulo, citação (`citacao`) e texto de apoio (17 px);
  - colunas 8 a 12: foto 4:5 com legenda;
  - rodapé do cartão: link com `ArrowUpRight`.

**Celular e modo reduzido:** cartões em sequência, sem empilhar.

**Conteúdo:**
- H2 (§2.2): "O que nos move, inspira e sustenta nosso compromisso com a segurança".
- **Cartão A**:
  - rótulo "Nossa missão";
  - citação: "Proporcionar aos clientes o gerenciamento completo de equipamentos de combate a incêndio, por meio de soluções personalizadas, tecnologia de ponta e serviços adequados às suas necessidades.";
  - apoio: "Nossa visão: ser reconhecida nacionalmente como referência em tecnologia, qualidade e responsabilidade no setor de engenharia e proteção contra incêndios.";
  - foto `Manutencao_1.jpg` (ilustrativa);
  - link "Missão, visão e valores", para `/institucional/#valores`.
- **Cartão B**:
  - rótulo "Responsabilidade e sustentabilidade";
  - citação: "Cuidar também é prevenir.";
  - apoio: "Também contamos com um programa específico para armazenamento e descarte responsável dos resíduos gerados, seguindo todas as exigências estabelecidas pela legislação ambiental.";
  - foto `Institucional_8.jpg` (ilustrativa), com `Institucional_7.png` (muda recortada) flutuando por cima;
  - link para `/institucional/#sustentabilidade`.
- **Cartão C**:
  - rótulo "Kids ONG";
  - citação: "Cuidar de vidas também é transformar futuros.";
  - apoio: "A Protecin financia o Kids ONG, projeto social com sete anos de atuação em Santo André – SP." (manter "sete" até confirmar, §1.12);
  - foto `Institucional_4.png` (**acervo; os rostos já vêm borrados e ficam assim**), com `logo_kids_ong.png` de 72 px no canto;
  - link para `/institucional/#kids-ong`.
- No modo proposta, depois do cartão C: `TeamVoices` com 3 espaços verticais 9:16 e o texto "Depoimentos da equipe em vídeo, gravados na sede (a produzir)".

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Fólio, H2 | `Folio`, **L** | — | — |
| Cartão | Primeiro cartão **R** | `StackPanels`: o coberto faz `scale 1→.94` e o véu vai de `opacity 0→.4` | — |
| Citação | **L** (linhas escritas à mão para B e C; **P** para a missão, que é longa) quando o cartão chega ao topo | — | — |
| Apoio | **R** +200 ms | — | — |
| Foto | **C↑** | **Px(6)**. A muda (B) deriva `y 48px→-48px` | `scale 1.03` |
| Link | **R** +300 ms | — | Seta `x +6px`, sublinhado **F** |

### H11 · Catálogo digital (`#catalogo`)
**Fundo:** `papel-100`.

**Desktop:**
- Colunas 2 a 5: capa `Screenshot-2025-07-30-143726.png` em `TiltCard`, com no máximo 360 px de largura (a imagem é de baixa resolução, 554 × 787) e sombra `0 40px 80px marinho-950/18`.
- Colunas 7 a 11: sobretítulo, H2, texto, chips e botão.

**Celular:** capa com 70 % da largura, centralizada, e depois o texto.

**Conteúdo** (§2.5 e §1.6):
- Sobretítulo: "Material completo e sempre atualizado".
- H2: "Catálogo Digital Protecin".
- Texto: "Conheça em detalhes nossos serviços, produtos, tecnologias e diferenciais. Tudo reunido em um catálogo pensado para facilitar sua consulta e apoiar suas decisões com segurança e confiança."
- Chips (itens de catálogo de §1.6): extintores · mangueiras · hidrantes · portas corta-fogo · sistemas de alarme · sistemas de supressão · sinalização fotoluminescente.
- Botão "Baixar catálogo (PDF)" com `ArrowDown`. Link: `https://protecin.com.br/wp-content/uploads/2025/07/Catalogo-Digital-Protecin.pdf`, `target="_blank"`, `rel="noopener"`. Dispara `pushEvent("catalog_download", { lead_location: "catalogo" })`.

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Capa | `perspective 1200`: `rotateY -18°→0`, `rotateX 8°→0`, `y 60→0`, `opacity 0→1`, 900 ms. Brilho passa uma vez (`translateX -120%→120%`, 900 ms, +400 ms) | `rotate 0→-2°` e `y` com **Px(4)** | `TiltCard` ±8° com brilho seguindo o ponteiro. Toque: volta a 0° |
| Sobretítulo, H2, texto | **R**, **L**, **P** | — | — |
| Chips | **R** com `scale .9→1` (`ease-back`), stagger de 50 ms | — | `y -2px`, borda vermelha |
| Botão | **R** +300 ms | — | `RollText`; a seta desce e sai (`y 0→100%`) enquanto outra entra (`y -100%→0`), 300 ms |

### H12 · Orçamento (`#orcamento`)
**Fundo:** `marinho-950`.

**Desktop:**
- Colunas 1 a 5:
  - fólio "12 · Orçamento", H2 e texto;
  - lista de canais: linhas de 72 px com fio, ícone, rótulo (11 px, caixa-alta, `marinho-300`) e valor (Fraunces 28 px, `papel-50`).
- Colunas 7 a 12: cartão `papel-50` com o formulário.

**Celular:** texto, depois os canais (WhatsApp e Telefone primeiro), depois o formulário em largura total.

**Conteúdo** (§2.7 e §1.11):
- H2: "Precisa de uma proposta, agendar uma visita ou tirar dúvidas?"
- Texto: "Nossa equipe está pronta para atender com agilidade e atenção técnica. Preencha o formulário ou utilize os canais abaixo para falar com a gente."
- Canais:
  - WhatsApp "(11) 94565-1751" (`WhatsAppLink`, `location="orcamento"`);
  - Telefone "(11) 4977-8720" (`PhoneLink`);
  - E-mail "comercial@protecin.com.br" (`EmailLink`, `mailto:`);
  - Endereço "Rua Lacônia, 600 · Parque Capuava · CEP 09271-010 · Santo André (SP)";
  - Horário "Segunda a sexta, 8h às 17h30".
- **Formulário** (adaptado do `ContactForm` do Seven):
  - "Serviço de interesse": chips de múltipla escolha com os 8 nomes de §1.6 e "Outro";
  - "Nome *";
  - "Empresa (opcional)";
  - "E-mail *" (sem placeholder: a régua proíbe e-mail fictício, então fica só o rótulo);
  - "Telefone *" com máscara "(11) 9 9999-9999", aplicada enquanto digita, mínimo de 10 dígitos;
  - "Mensagem".
  - Botões: "Enviar pedido" (primário) e "Enviar pelo WhatsApp" (secundário). O secundário monta o texto com os campos (`buildWhatsAppUrl`), com `location="formulario"`.
  - Mensagens de erro em português, embaixo de cada campo: "Informe seu nome.", "Informe um e-mail válido.", "Informe um telefone com DDD.".
- **Envio:**
  - **Na prévia** (`VITE_BASE ≠ "/"`): valida, mostra "Enviando…" por 600 ms e depois o bloco de sucesso "Prévia de demonstração: nada foi enviado. No site oficial, este pedido chega ao comercial da Protecin." Não manda e-mail ao cliente a partir da demo.
  - **Em produção:** FormSubmit para o e-mail definido pela Protecin (seção 19), com `_honey`, tempo mínimo de 1,5 s e timeout de 15 s (Seven).
  - Sucesso: bloco `msg-sucesso` **sem animação de opacidade**, mais `form_lead` e `trackLead("email","formulario", ...)`.
  - Erro: mensagem, mais as saídas `mailto:` e WhatsApp.

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Seção | — | `scale .96→1`, igual a H02 | — |
| Fólio, H2, texto | `Folio`, **L**, **P** | — | — |
| Canais | Fio **F** + **R**, stagger de 80 ms | — | Ícone redesenha; valor `x +6px`. Toque: `scale .98` |
| Cartão do formulário | **C↑**; campos **R**, stagger de 60 ms | — | — |
| Chips | **R** | — | Borda vermelha e varredura de fundo. Selecionado: ícone `Check` desenha e o fundo fica `marinho-800` (`layout`). `whileTap .96` |
| Campos | — | — | No foco, o rótulo sobe (`y -18`, `scale .85`, 200 ms) e o fio vermelho embaixo faz `scaleX 0→1` (300 ms) |
| Enviar | **R** | — | `RollText`. Enviando: anel girando (800 ms, linear, só enquanto envia). Erro: `x [0,-6,6,-4,4,0]` em 400 ms |
| Sucesso | `y 16→0`, `scale .98→1`, 500 ms; `Check` com **D** | — | — |

### Rodapé (global)
**Fundo:** `marinho-950`, com fio no topo.

**Desktop:**
- Faixa superior: numeral "1976 — 2026" em Fraunces 200, 18vw, `papel-50` a 6 %.
- Grade de 4 colunas ("expediente"):
  1. Wordmark branco, `SymbolMark draw` com 56 px e o texto literal do rodapé (§2.1: "Com 50 anos de atuação, a Protecin é reconhecida...");
  2. Seções: Home, Institucional, Serviços, Nossos Clientes, Nosso App, Catálogo Digital, Contato;
  3. Contato: telefone, WhatsApp, comercial@protecin.com.br, falecom@protecin.com.br;
  4. Endereço, "Horário de atendimento: segunda a sexta, 8h às 17h30", Instagram `@protecin_ltda` (`https://www.instagram.com/protecin_ltda`) e LinkedIn.
- Linha final: "© {ano atual} Protecin. Todos os direitos reservados." · "Créditos de imagem" (`/creditos/`) · alternador "Animações: ligadas / reduzidas".

**Celular:** colunas empilhadas. Links com no mínimo 44 px de altura (`py-3`).

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Numeral 1976–2026 | **R** | `x 8%→-4%` | — |
| Símbolo | `SymbolMark draw` (contorno 900 ms, depois preenchimento 300 ms) | — | Gota `scale 1→1.08→1` em 400 ms |
| Colunas | **R**, stagger de 80 ms | — | Links: sublinhado **F**, 300 ms |
| Alternador de animação | **R** | — | Pílula desliza (`layoutId`, mola 380/30). Grava `pt-motion` e recarrega a página |

---

## 7. Institucional (`/institucional/`)

### I01 · Abertura: Quem somos
**Fundo:** `papel-100`. Entrada em CSS, igual à capa.

**Desktop:**
- Colunas 1 a 6: rótulo "Quem somos", H1, dois parágrafos (o primeiro com capitular) e CTA.
- Colunas 7 a 12: `Institucional_3.png` (pilar simétrico com hidrante), 5:4, crédito ilustrativa.

**Celular:** texto, depois a imagem.

**Conteúdo** (§2.2):
- H1: `["Desde 1976,", "proteção técnica", "contra incêndio."]`, com "1976," em itálico vermelho.
- Parágrafos: "Desde 1976, a Protecin atua com soluções completas em prevenção e engenharia de combate a incêndios. Com sede em Santo André (SP), oferecemos projetos, instalação de sistemas, manutenção e uma plataforma digital exclusiva para gestão técnica de extintores e hidrantes." e "Compromisso com Segurança, Excelência e Confiança é o nosso objetivo."
- CTA: `WhatsAppLink` "Solicitar orçamento" (`location="abertura"`, `lead_page="institucional"`).

| Elemento | Entrada (CSS) | Rolagem | Hover / toque |
|---|---|---|---|
| Rótulo, H1, texto, CTA | `pt-up` / `pt-line` / `pt-up` +420 ms / `pt-up` +520 ms | Saída: bloco `y 0→-8%` | CTA padrão |
| Imagem | Visível desde o 1º paint (pode ser o LCP no desktop). Por cima, duas meias-cortinas `papel-100` se abrem do centro (`scaleX 1→0`, origens `left` e `right`), 900 ms, +150 ms; Ken Burns `pt-kb` | **Px(8)** | — |

### I02 · Cronologia (`#historia`)
**Fundo:** `papel-50`. Mesmos 9 marcos de H04 (sem o item 2026), em outra composição.

**Desktop:**
- Colunas 1 a 4: ano ativo grande (`numeral`, 220 px), `sticky top-[120px]`, num `Odometer` que gira para o ano do marco no centro da tela (`useInView`, margem -45 %).
- Colunas 6 a 12: lista dos 9 marcos. Cada um tem: rótulo do ano (12 px), H3, texto literal, foto 3:2 nos marcos de número ímpar, legenda e fio entre marcos.

**Celular:** igual à cronologia vertical de H04.

- **Entrada:** H3 **L**, texto **P**, foto **C↑** + **Px(6)**, fio **F**.
- **Hover:** foto `scale 1.03`.
- **Rolagem:** o odômetro troca o ano.

### I03 · Missão, visão e valores (`#valores`)
**Fundo:** `papel-100`.

**Desktop:**
- H2 e texto nas colunas 1 a 8.
- Duas citações lado a lado (colunas 1 a 6 e 7 a 12), com aspas penduradas: Missão e Visão.
- Abaixo: "Nossos valores" como lista de 6 linhas com numeral romano pequeno (I a VI), Fraunces 32 px e fio. À direita, `compromisso.png` (mãos empilhadas, ilustrativa), 4:5, com **Px(8)**.

**Conteúdo** (§2.2): H2 "O que nos move, inspira e sustenta nosso compromisso com a segurança"; texto literal; Missão; Visão; os 6 valores literais.

- **Entrada:** citações com **L** (aspas com `opacity 0→1` e `x -12→0`, +100 ms); valores com fio **F** + **L**, stagger de 90 ms.
- **Hover:** cada valor faz `RollText` (a linha sobe e volta em itálico vermelho), 400 ms.

### I04 · Diferenciais (`#diferenciais`)
**Fundo:** `papel-50`.

**Desktop:** 4 blocos em escada (colunas 1–5, 7–11, 2–6 e 8–12, cada um 80 px mais baixo que o anterior), sem caixas. Cada bloco: numeral 01 a 04 em contorno (Fraunces 120 px, `text-stroke` 1 px `marinho-800`), ícone com **D**, H3 e texto literal.

**Celular:** blocos empilhados, numeral de 72 px.

**Conteúdo** (§2.1), os 4 diferenciais com texto integral:
- Atendimento Personalizado (`Headset`);
- Tecnologia da Informação Aplicada (`Cpu`);
- Tradição e Credibilidade (`Handshake`);
- Estrutura Completa e Qualificada (`BadgeCheck`).

- **Entrada:** numeral **R** com `y 60→0`; ícone **D** +150 ms; H3 **L**; texto **P**.
- **Rolagem:** cada bloco deriva `y 32px→-32px` com velocidades alternadas (deriva em CSS).
- **Hover:** o contorno do numeral ganha preenchimento `vermelho-600` (camada, `opacity 0→1`, 300 ms) e o ícone redesenha.

### I05 · Responsabilidade e sustentabilidade (`#sustentabilidade`)
**Fundo:** foto `Institucional_8.jpg` em sangria com **Px(12)** e véu `marinho-950` a 55 %. Altura de 110vh.

**Desktop:**
- Colunas 1 a 7: citação "Cuidar também é prevenir." em Fraunces itálico 96 px `papel-50`.
- Colunas 8 a 12: cartão `papel-50` com o texto literal (§2.2) e a linha "Política de Preservação Ambiental desde 2004" (fato da linha do tempo).
- `Institucional_7.png` (muda) flutua no canto inferior direito, com deriva `y 64→-64`. Crédito da foto de fundo: ilustrativa.

**Celular:** 90vh, com citação e cartão empilhados.

- **Entrada:** citação **L**; cartão **C↑**; texto **P**.
- **Rolagem:** Px e deriva.
- **Hover:** nenhum.

### I06 · Kids ONG (`#kids-ong`)
**Fundo:** `papel-100`.

**Desktop:**
- Colunas 1 a 5: sobretítulo, H2, texto em 2 colunas de CSS (`columns-2`, só a partir de 1280 px) com capitular, e o logo `logo_kids_ong.png` com 96 px.
- Colunas 6 a 12: colagem `Institucional_4.png`. Crédito: "Acervo Protecin · rostos borrados para preservar as crianças".
- Fecho: "Protegemos seu maior patrimônio: A vida." em `citacao`.

**Conteúdo** (§2.2): sobretítulo "Nosso compromisso vai além da segurança técnica"; H2 "Cuidar de vidas também é transformar futuros"; texto literal, com Cláudio Szulcsewski e Juliana Szulcsewski Ardengue citados como no site.

- **Entrada:** colagem **C↑** + **Px(6)**; logo **R** com `scale .8→1` (`ease-back`); fecho com `ScrollLitText`.

### CTA final (componente `CtaFinal`, em todas as páginas internas)
**Fundo:** `marinho-950`, 64vh.

**Conteúdo:**
- H2 "Precisa de uma proposta, agendar uma visita ou tirar dúvidas?" (literal de §2.7);
- `WhatsAppLink` "Solicitar orçamento";
- `PhoneLink` "Ligar (11) 4977-8720";
- link "Formulário de contato", para `/contato/`.

Props `lead_page` e `waMessage`. `location="cta_final"`.

- **Entrada:** **L** e CTAs **R** com stagger de 80 ms.
- **Rolagem:** `scale .96→1`.

---

## 8. Serviços (`/servicos/`)

### S01 · Abertura
**Fundo:** `papel-100`. Entrada em CSS.

**Conteúdo** (§2.3):
- H1 `["Soluções completas em", "combate e prevenção", "a incêndios"]`.
- Texto: "Conheça os serviços técnicos, operacionais e de suporte técnico e estratégico oferecidos pela Protecin."
- Subnavegação com 8 chips (nomes curtos: Instalação, Projetos, AVCB, Inspeções, Manutenção, Riscos, Venda, Sinalização).
  - Desktop: fica `sticky` logo abaixo da nav.
  - Celular: rolagem horizontal com `snap-x`, `data-lenis-prevent` e `touch-pan-x`.
  - A pílula ativa desliza (`layoutId="svc-pill"`, mola 380/30). O chip ativo vem do bloco no centro da tela (IntersectionObserver `-45% 0px -45% 0px`).

### S02 · Os 8 serviços (`<section id="{slug}">`)
**Desktop (`pin:`):** `StackPanels` com blocos de no mínimo 80vh e fundo alternado entre `papel-50` e `papel-100`. Layout alternado:
- serviços ímpares: mídia nas colunas 1 a 6 e texto nas colunas 7 a 12;
- serviços pares: o contrário.

**Texto de cada bloco:**
- número "01/08";
- ícone com **D**;
- H2 com o nome;
- `lead`: a versão de /servicos;
- corpo: a versão da home, quando existir;
- lista de itens (chips);
- CTA `WhatsAppLink` "Pedir orçamento de {nome curto}" (`location="servico"`, `detail=slug`);
- link "Falar por telefone".

**Celular:** blocos em sequência, mídia antes do texto.

| # | Slug (`id`) | Itens (extraídos do texto literal) | Mídia principal | Mídia secundária |
|---|---|---|---|---|
| 1 | `instalacao-de-sistemas-e-equipamentos` | Sistemas fixos · Equipamentos contra incêndio · Componentes certificados · Rastreabilidade | `Instalacao_1.jpg` | `Design_sem_nome.png` (válvulas recortadas) flutuando com deriva |
| 2 | `projetos-tecnicos` | Projetos legais e executivos · Emissão de ART · Obtenção e renovação do AVCB | `Servicos_2.jpg` | — |
| 3 | `documentacao-e-regularizacao` | Laudos · Licenças · Renovação de AVCB | `architect-...-1-1.jpg` | — |
| 4 | `inspecoes-e-manutencoes-preventivas` | Inspeções periódicas · Testes hidrostáticos · Manutenção em campo · Repintura · Limpeza · Adequação técnica · Controle informatizado | Vídeo V4 (`LazyVideo`) | `Inspecao_2.jpg` encaixada a 40 % |
| 5 | `manutencao-de-equipamentos` | Extintores · Mangueiras · Hidrantes · Portas corta-fogo · Sistemas de alarme e supressão · Rastreamento individual dos itens · INMETRO | Vídeo V2 | `Manutencao_2.jpg` encaixada |
| 6 | `gestao-de-riscos-e-consultoria` | Engenharia Civil · Elétrica · Mecânica · de Segurança · Laudos e programas | `Riscos_2.jpg` | — |
| 7 | `venda-de-equipamentos` | Extintores · Mangueiras · Sinalizações · Sistemas fixos | `Venda_2.jpg` | `Institucional_2.png` |
| 8 | `sinalizacao-de-seguranca` | Fotoluminescente · Orientativa · Emergência e salvamento · Auditorias · Treinamentos personalizados | `4.jpg` (enquadrado nas placas SAÍDA, EXTINTOR e HIDRANTE; **acervo**) | `Riscos_1.jpg` |

- Todas as mídias de banco levam o crédito "Imagem ilustrativa"; a `4.jpg` leva "Acervo Protecin".
- No serviço 5, o modo proposta mostra o espaço reservado "Preço único para inspeção e manutenção de extintores (conceito de 1986): confirmar se a condição continua valendo".

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Número, ícone | **R**, **D** | — | — |
| H2 | **L** | — | — |
| Lead, corpo | **P** | — | — |
| Chips | **R** com `scale .9→1`, stagger de 50 ms | — | `y -2px` |
| Mídia principal | **C←** (ímpar) ou **C→** (par) | **Px(8)**; o bloco coberto encolhe (`StackPanels`) | `scale 1.03` |
| Mídia secundária | **C↑** +200 ms | **Px(-6)** ou deriva | — |
| CTAs | **R** +300 ms | — | Padrão da seção 13 |

### S03 · Faixa AVCB
**Fundo:** `vermelho-600`, texto `papel-50`.

**Conteúdo:** "Documentação e regularização: obtenção e renovação do AVCB" + o texto literal de §1.6, item 3, + `WhatsAppLink` em `papel-50` "Falar sobre AVCB". Mensagem: "Olá! Vim pelo site da Protecin e preciso de assessoria para obter ou renovar o AVCB." (`location="avcb"`). **Sem prazo, multa ou "gratuito"** (`pesquisa-mercado.md` §1.4).

- **Entrada:** faixa com `scaleX .9→1` (origem no centro, 700 ms); texto **L**.
- **Hover:** o botão inverte a cor por varredura.

Depois: `CtaFinal` com `lead_page="servicos"`.

---

## 9. Nossos Clientes (`/nossos-clientes/`)

- **C01 · Abertura** (CSS):
  - H1 "Nossos clientes";
  - subtítulo literal (§2.4): "Parcerias de confiança que impulsionam nosso compromisso com a segurança, a prevenção e a continuidade das operações dos nossos clientes.";
  - fundo com vídeo V5 (galpão visto de drone), véu `marinho-950` a 70 %, `idleLoad` e crédito ilustrativa no canto. No celular, só o poster.
- **C02 · Setores:** 3 blocos editoriais com foto em **Px(10)** e texto literal:
  - "Financeiro, Tecnologia e Saúde": `Clientes_1.jpg`;
  - "Industrial e Agronegócio": `Servicos_1.jpg`;
  - "Energia e Transporte": `Home_Image_1-e1754481613736.png` (esfera de gás, RGBA, sobre `papel-200`).
  - Todas ilustrativas.
  - Layout alternado: foto nas colunas 1 a 7 e texto nas colunas 9 a 12, e o inverso.
  - Motion: foto **C↔**, H3 **L**, texto **P**.
- **C03 · Marcas e filiações:** o componente de H07 inteiro, mais as placas ABSpk e NFPA de H03 com o rótulo "Filiações técnicas". Texto literal de §2.4: "Além disso, somos filiados a instituições técnicas respeitadas, reforçando nosso compromisso com as melhores práticas do setor de segurança contra incêndio."
- **C04 · Parede de clientes:** só no modo proposta. São 12 espaços com o texto "Logo de cliente: enviar com autorização". Com logos reais, vira duas fitas `VelocityMarquee` em sentidos opostos (logos em cinza que ganham cor no hover).
- **CtaFinal**, com `lead_page="nossos-clientes"`.

---

## 10. Nosso App (`/nosso-app/`)

### A01 · Abertura
**Fundo:** `marinho-950`. Entrada em CSS.

**Desktop:**
- Colunas 1 a 6: H1 `["Protecin App:", "gestão inteligente", "de inspeções"]`, texto literal (§2.6: "Uma plataforma completa, com versão web e aplicativo próprio, que otimiza o controle de extintores e hidrantes com agilidade, segurança e conformidade técnica.") e CTA.
- Colunas 7 a 12: o "app abrindo".
  - O celular `App_1.png` (splash azul com logo branco) sobe: `y 80→0`, `rotate 6°→0`, 800 ms.
  - Em +700 ms, `App_3.png` (login) entra por cima em crossfade de 300 ms. Os dois arquivos têm o mesmo aparelho e o mesmo tamanho (1080 × 1920), por isso o encaixe é exato.
  - `App_2.png` (notebook) fica atrás, deslocado à direita, com **Px(6)** de profundidade.

**Celular:** só o celular, com 60 % da largura.

Não usar a frase "...que está transformando o setor..." (a régua veta "transforme").

### A02 · Como o Protecin App funciona (`#como-funciona`)
**Desktop:** `pin:` com 300vh e 3 passos. O texto à esquerda troca como em H08. O palco à direita:
- **App de Coleta (uso em campo):** celular com a `OrdersScreen` e os 5 itens literais desenhando um `Check` cada (**D**, stagger de 100 ms).
- **Web Master (gestão centralizada):** `App_2.png` com os 4 itens literais.
- **Processador de Coleta Online:** diagrama SVG em que o celular, um nó "Processador" e o notebook se ligam por linhas que se desenham.
  - Enquanto o passo está ativo, um traço tracejado corre pela linha: `stroke-dashoffset` em loop de 1,2 s, só nesse passo e só na tela.
  - Item literal: "Recepção automática dos dados de campo."

**Celular:** 3 blocos em sequência.

**Texto:** H2 "Como o Protecin App funciona". É a única correção de gramática no título do site atual ("Como nosso Protecin funciona?"); não muda nenhum fato.

### A03 · Recursos que fazem a diferença (`#recursos`)
**Fundo:** `marinho-900`.

**Layout:** ficha técnica em 2 colunas de 4 linhas. Cada linha tem índice "R-01" a "R-08" (11 px, `marinho-300`), ícone, nome literal (Fraunces 24 px) e fio.

**Os 8 recursos** (§1.7), com ícone:

| Índice | Recurso | Ícone |
|---|---|---|
| R-01 | Gestão central via plataforma web | `LayoutDashboard` |
| R-02 | Aplicativo prático e intuitivo | `Smartphone` |
| R-03 | Suporte offline nas inspeções | `WifiOff` |
| R-04 | Relatórios automáticos para o cliente | `FileText` |
| R-05 | Comunicação direta entre gestor e técnico | `MessagesSquare` |
| R-06 | Indicadores de desempenho em tempo real | `Activity` |
| R-07 | Conformidade com as NBRs e ABNT | `ShieldCheck` |
| R-08 | Redução de erros e aumento da eficiência | `CircleCheck` |

- **Entrada:** fio **F**, ícone **D** e nome **L** em cascata, com 90 ms de stagger e ordem de leitura em Z.
- **Hover:** linha com fundo `marinho-800` por varredura e ícone redesenhando.

### A04 · Conformidade e benefícios
**Fundo:** `papel-100`.

**Desktop:**
- Colunas 1 a 5: carimbo SVG circular "100% CONFORME · NBR 12962 · NBR 12779 ·".
- Colunas 7 a 12: "Benefícios para o Cliente", com o texto literal do pilar 04.
- Abaixo, em largura total: faixa 21:9 com o vídeo V3 (`LazyVideo`), legenda "Inspeção digital em campo." e crédito "Imagem ilustrativa".

**Motion:**
- O carimbo bate: `scale 1.6→1`, `rotate -16°→-6°`, `opacity 0→1`, 500 ms, `ease-back`. Em seguida, uma "tinta" (anel de `opacity .3→0`, `scale 1→1.15`) em 400 ms.
- O vídeo abre com **C↑** e **Px(6)**.

Depois: `CtaFinal` com a mensagem "Olá! Vim pelo site da Protecin e quero conhecer o Protecin App." e `lead_page="nosso-app"`.

---

## 11. Catálogo Digital (`/catalogo-digital/`)

- **K01 · Abertura:** a mesma composição de H11, só que acima da dobra e com entrada em CSS.
  - H1 "Catálogo Digital Protecin";
  - subtítulo "Material completo e sempre atualizado";
  - texto literal;
  - botão de download (`catalog_download`, `lead_location="catalogo_abertura"`).
  - A capa entra com `@keyframes` (`rotateY -18°→0`, 900 ms). O `TiltCard` liga depois de hidratar.
- **K02 · O que tem no catálogo:** fita `VelocityMarquee` de chips grandes (Fraunces 40 px) com os itens de catálogo e os serviços de campo de §1.6: inspeções periódicas, testes hidrostáticos, manutenção em campo, repintura, limpeza, adequação técnica, auditorias e treinamentos.
- **CtaFinal.**

---

## 12. Contato (`/contato/`), 404 e Créditos

- **T01 · Abertura** (CSS):
  - sobretítulo "Entre em contato";
  - H1 "Contate a Protecin";
  - texto literal (§2.7).
- **T02 · Formulário e canais:** o componente de H12 em variante clara (fundo `papel-50`, canais em `marinho-950`). Mostra também falecom@protecin.com.br como segundo e-mail (§1.11). Usa `lead_page="contato"` e `location="contato_canais"` / `"formulario"`.
- **T03 · Mapa:**
  - iframe do Google Maps em `ClipReveal` C↑, `loading="lazy"`, com `src` só quando estiver a uma tela de distância: `https://www.google.com/maps?q=Rua+Lac%C3%B4nia,+600,+Santo+Andr%C3%A9+-+SP,+09271-010&output=embed`.
  - Botão "Como chegar": `https://www.google.com/maps/dir/?api=1&destination=Rua+Lac%C3%B4nia,+600,+Santo+Andr%C3%A9+-+SP`. Dispara `map_directions_click`.
- **T04 · Redes:** Instagram e LinkedIn como duas linhas grandes (Fraunces 40 px) com `ArrowUpRight`. Hover: `RollText`.
- **404:**
  - "404" em `Odometer` (gira ao carregar);
  - texto "Esta página não existe ou mudou de endereço.";
  - links Home, Serviços e Contato;
  - `WhatsAppLink` (`location="pagina_404"`).
- **Créditos (`/creditos/`):** lista de cada foto e vídeo de banco com fonte e autor, tirados de `videos.md` (Pexels: Val А., Mikael Blomkvist, Gustavo Fring; Mixkit 23378 e 15596) e dos bancos das fotos (Envato Elements, nos arquivos "utc", e outros: **[confirmar a licença das fotos herdadas do site atual]**).

---

## 13. Elementos globais

- **Nav:**
  - Altura de 72 px; fundo `papel-50` com fio embaixo depois de 40 px de rolagem (antes, transparente sobre `papel-100`). Sem blur.
  - Logo: `SymbolMark` (28 px) com wordmark PNG; no hover, a gota pulsa.
  - Links (≥ 1280 px): Institucional · Serviços · Nossos Clientes · Nosso App · Catálogo Digital · Contato. Cada link usa `RollText` e o link ativo tem um fio vermelho embaixo (`layoutId="nav-ativo"`).
  - CTA "Solicitar orçamento" (`WhatsAppLink`, `location="nav"`).
  - Abaixo de 1280 px: CTA compacto "Orçamento" (pílula de 44 px) e botão `Menu`.
  - Some ao descer depois de 420 px e volta ao subir (`y 0→-120%`, 500 ms, `ease-out`), como no Seven.
  - Fio de leitura de 2 px `vermelho-600` com `scaleX` = progresso da página, com mola.
- **Menu (sumário):**
  - Painel `papel-100` em tela cheia: `clip-path inset(0 0 100% 0) → inset(0)`, 600 ms, `ease-page`.
  - Itens numerados 01 a 07 em Fraunces 36 px com **L** (stagger de 50 ms, +200 ms).
  - Embaixo: WhatsApp, telefone e e-mail (`location="menu_mobile"`) e o horário.
  - `lockScroll(true)` e `data-lenis-prevent`.
  - Fecha com Esc, com toque fora (no fundo) e no X. Foco preso dentro do menu e devolvido ao botão.
  - Fechar: 400 ms, ao contrário.
- **Transição de página ("virar a página"):**
  - Em cada troca de rota, uma cortina `papel-200` cobre da direita para a esquerda (`x 100%→0`, 420 ms, `ease-page`). Ela leva o fólio da página de destino em Fraunces itálico ("Nº 02 · Institucional").
  - A rolagem vai ao topo, ou à âncora, por baixo da cortina.
  - A nova página monta, a cortina sai para a esquerda (`x 0→-100%`, 420 ms) e as entradas CSS da abertura rodam.
  - Total de cerca de 840 ms. No modo reduzido, crossfade de 150 ms.
  - `AnimatePresence mode="wait"` com chave no `pathname`.
- **Contato flutuante:**
  - Celular: barra inferior com WhatsApp e Ligar (`location="barra_mobile"`), com `pb-[max(0.75rem,env(safe-area-inset-bottom))]`.
  - Desktop: botão redondo de WhatsApp (`location="botao_flutuante"`), em `vermelho-600` com o glifo branco, entrando com mola (`scale 0→1`, `rotate -90→0`). O rótulo "Falar agora" abre no hover.
  - Aparece depois de 640 px. Some quando o formulário ou o rodapé estão na tela, ou quando um campo tem foco (regra da Indafire).
  - Sem botão de voltar ao topo, para não colidir.
- **Aviso de cookies:** **não aparece na prévia**, porque o GTM não carrega e nenhum cookie de medição é gravado. Em produção, usar o `CookieNotice` do Seven só depois de existir uma política de privacidade aprovada pela Protecin (seção 19).
- **Etiqueta do modo proposta:** canto inferior esquerdo, 12 px, "Modo proposta · sair", que limpa `pt-proposta`.

---

## 14. Imagens e vídeos

### 14.1 Imagens
Pipeline: `scripts/imagens.mjs` com `sharp`.
- Lê os originais de `referencia/imagens-site-atual/` (os sem sufixo `-scaled` e `-e1754…`, exceto `Home_Image_1-e1754481613736.png`, que é RGBA).
- Grava em `public/images/<nome>-<largura>.avif` e `.webp`, nas larguras 640, 1024, 1600 e 2400 (só as menores ou iguais ao original).
- AVIF com `quality: 50`, WebP com `quality: 72`.
- Ao converter, aplica o `object-position` (foco) da tabela.
- Toda `<img>` leva `width`/`height`, `sizes`, `decoding="async"` e `loading="lazy"` fora da dobra.

| Arquivo | Onde | Foco / recorte | Crédito |
|---|---|---|---|
| `Home_BG_1-1.jpg` | H02 (fundo) | `50% 60%` | Ilustrativa |
| `Bradesco-024.jpg` | H06 A | `40% 50%`, 16:9 | **Acervo** (sem nome de cliente) |
| `4.jpg` | H06 B; S02-8 | B: `55% 45%`, 4:3; S02-8: `60% 35%` | **Acervo** |
| `App_1.png`, `App_3.png`, `App_2.png` | H04-8, H08, A01, A02 | Recorte transparente | **Acervo** (telas reais) |
| `Institucional_4.png` | H10 C, I06 | Inteira | **Acervo**, rostos borrados |
| `logo_kids_ong.png`, `Ativo-1.png`, `SIMBOLO.png` | Kids ONG, nav e rodapé, referência do SVG | — | Marca |
| `Institucional_2.png` | H04-1, S02-7 | `50% 40%` | Ilustrativa |
| `Inspecao_2.jpg` | H04-2, H05 prévia, S02-4 | `45% 50%` | Ilustrativa |
| `Institucional_7.png` | H04-3, H10 B, I05 | Recorte | Ilustrativa |
| `Riscos_2.jpg` | H04-4, H05, S02-6 | `50% 40%` | Ilustrativa |
| `Manutencao_1.jpg` | H04-5, H05, H10 A | `50% 35%` | Ilustrativa |
| `Instalacao_1.jpg` | H04-6, H05, S02-1 | `50% 50%` | Ilustrativa |
| `Servicos_2.jpg` | H04-7, H05, S02-2 | `50% 50%` | Ilustrativa |
| `Inspecao_1.jpg` | H04-9 | `55% 50%` | Ilustrativa |
| `architect-...-1-1.jpg` | H05, S02-3 | `60% 40%` | Ilustrativa |
| `Venda_2.jpg` | H05, S02-7 | `50% 50%` | Ilustrativa |
| `Riscos_1.jpg` | H05, S02-8 | `50% 30%` | Ilustrativa |
| `Manutencao_2.jpg` | S02-5 | `45% 40%` | Ilustrativa |
| `Design_sem_nome.png` | S02-1 (flutuante) | Recorte; conferir banding (PNG paletizado) | Ilustrativa |
| `Institucional_3.png` | I01 | Simétrica, `50% 50%` | Ilustrativa |
| `compromisso.png` | I03 | `50% 50%` | Ilustrativa |
| `Institucional_8.jpg` | H10 B, I05 | `50% 70%` | Ilustrativa |
| `Clientes_1.jpg`, `Servicos_1.jpg`, `Home_Image_1-e1754481613736.png` | C02 | — | Ilustrativa |
| `Screenshot-2025-07-30-143726.png` | H11, K01 | Inteira, no máximo 360 px | Marca (capa do catálogo) |
| Logos `2.png`–`6.png`, `Simplex.png`, `BOSCH.png`, `FIREBEE.png`, `LOGO-GRMK-AZUL-GERMEK.png`, `ABSPK.png`, `NFPA.png` | H03, H07, C03 | `trim()` | Marcas |

**Não usar** (§3.4 a §3.6): `Team-*`, `Testi-*`, `Icon-*`, `Logo-1..4`, `Logo-Fire-01`, as fotos de bombeiros, `teste-1*` (possível imagem gerada por IA), `placeholder*`, os ícones PNG (troca por lucide) e o selo `ecofriendly_logo.png`, que não é certificação e pareceria uma.

### 14.2 Vídeos
Vêm de `videos.md`. Todos ficam em `public/videos/` (sem hotlink), mudos, em loop, com poster AVIF e crédito "Imagem ilustrativa".

**Antes de publicar**, assistir cada clipe inteiro. Se aparecer marca de terceiro ("GASBASE.RU" na série do V1), trocar pelo reserva.

| ID | Clipe (fonte) | Onde | Tratamento | Teto |
|---|---|---|---|---|
| V1 | Pexels 34775810, sistema de supressão, 8 s (1080p de origem) | H01, moldura da capa | Recorte 4:5 `crop=864:1080:(in_w-864)/2:0,scale=720:900`, 30 fps, sem áudio, CRF 27, `+faststart` (o arquivo é fMP4) | 2,5 MB |
| V2 | Pexels 8965440, extintor em sala com fumaça, 6,4 s | S02-5 | 1280 × 720, CRF 27 | 1,8 MB |
| V3 | Pexels 7100844, profissional com tablet, 21,3 s | A04 | Cortar para 12 s (`-t 12`), 1280 × 720, CRF 28 | 2,5 MB |
| V4 | Mixkit 23378, técnico em corredor industrial, 14,1 s | S02-4 | 1280 × 720, CRF 28 | 2,5 MB |
| V5 | Mixkit 15596, galpão de drone, 17 s | C01 (só desktop) | 1280 × 720, CRF 28, `-t 10` | 2,5 MB |
| Reserva V1 | Pexels 34775772 (módulos, 5 s) ou Ken Burns de `Home_BG_1-1.jpg` | — | Idem | — |

Comandos, com `ffmpeg-static` como dependência de desenvolvimento, porque o ffmpeg não está instalado na máquina. Ficam num `scripts/videos.mjs` que chama o binário de `require("ffmpeg-static")`:

```sh
ffmpeg -i v1-src.mp4 -an -vf "crop=864:1080:(in_w-864)/2:0,scale=720:900,fps=30" -c:v libx264 -profile:v high -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart public/videos/capa-supressao-720x900.mp4
ffmpeg -ss 0.4 -i public/videos/capa-supressao-720x900.mp4 -frames:v 1 -q:v 3 tmp/capa-poster.jpg   # depois sharp -> AVIF q50
```

O vídeo é ilustrativo. Nunca usar como equipe ou obra da Protecin (V3 mostra pessoa identificável: não sugerir endosso).

---

## 15. CTAs e eventos de lead (padrão Seven)

Todo contato é um `<a>` de verdade (`https://wa.me/5511945651751?text=…`, `tel:+551149778720`, `mailto:comercial@protecin.com.br`), criado pelos componentes `WhatsAppLink`, `PhoneLink` e `EmailLink` de `src/components/cta.tsx`. Cada link leva:
- `data-lead-channel` (`whatsapp|phone|email`);
- `data-lead-location`;
- `data-lead-detail`, quando houver;
- e dispara `trackLead()`, que faz `dataLayer.push({ event: "lead_click", lead_channel, lead_location, lead_detail, lead_page })`.

```tsx
<WhatsAppLink location="servicos" detail="projetos-tecnicos"
  message="Olá! Vim pelo site da Protecin e gostaria de um orçamento de Projetos Técnicos.">
  Pedir orçamento deste serviço
</WhatsAppLink>
```

**Mensagens de WhatsApp** (em `site.ts`):
- padrão: "Olá! Vim pelo site da Protecin e gostaria de solicitar um orçamento.";
- por serviço: "…gostaria de um orçamento de {serviço}.";
- AVCB: "…preciso de assessoria para obter ou renovar o AVCB.";
- App: "…quero conhecer o Protecin App.";
- formulário: resumo dos campos.

**Nunca** usar "gratuito" em mensagem ou botão (`pesquisa-mercado.md` §3).

**`lead_location`** (documentar no `TRACKING.md`):

| Local | Valores |
|---|---|
| Home | `nav`, `menu_mobile`, `hero`, `linha_do_tempo`, `servicos`, `plataforma`, `orcamento`, `formulario` |
| Páginas internas | `abertura`, `servico`, `avcb`, `cta_final`, `contato_canais`, `catalogo_abertura` |
| Globais | `barra_mobile`, `botao_flutuante`, `rodape`, `pagina_404` |

`lead_page` vale `home`, `institucional`, `servicos`, `nossos-clientes`, `nosso-app`, `catalogo-digital`, `contato` ou `404`.

**Outros eventos** (`pushEvent`):

| Evento | Quando |
|---|---|
| `form_open` | Primeiro foco no formulário |
| `form_lead` | Sucesso |
| `form_error` | Falha |
| `service_open` | Linha do índice ou acordeão |
| `catalog_download` | Download do catálogo |
| `timeline_complete` | Chegou a 2026, uma vez por sessão |
| `map_directions_click` | Botão "Como chegar" |
| `menu_open` | Menu aberto |
| `motion_toggle` | Alternador de animação |
| `video_play` | Só no play manual |

**GTM:**
- Script do `index.html` do Seven com a regex `/(^|\.)protecin\.com\.br$/` e o ID numa constante.
- **ID vazio até o Gabriel criar o container**: se estiver vazio, o script não carrega. O `dataLayer` existe mesmo assim.
- Para testar na prévia: `?gtm_debug=x` ou `?track=1`.
- As conversões do Ads ficam no acionador de **clique em link** (Click URL contém `wa.me` / começa com `tel:` / `mailto:`). `lead_click` é só para o GA4, para não contar duas vezes.

---

## 16. `prefers-reduced-motion`

A régua manda respeitar a preferência ("tudo visível e legível, sem movimento"), então **esta direção não copia o `reducedMotion="never"` do Seven**. O motivo daquela escolha continua valendo: muitos Windows ligam a preferência só porque "efeitos de animação" está desligado. Por isso:
- o rodapé tem o alternador "Animações: ligadas / reduzidas";
- na apresentação ao cliente, abrir a demo com `?motion=1`, que fica gravado na sessão.

Detecção: script do `<head>` (seção 4.3), que define `data-motion`.

| Recurso | Com `data-motion="reduced"` |
|---|---|
| Entradas CSS da capa e das aberturas | Sem animação: tudo no estado final no primeiro paint |
| **R**, **L**, **P**, cartões | Só `opacity 0→1` em 200 ms, sem deslocamento (`MotionConfig reducedMotion="always"` + variantes sem `y`) |
| **C** (máscaras), **F** (fios), **D** (ícones) | Já no estado final |
| `ScrollLitText` | Texto inteiro aceso |
| `ParallaxFrame`, derivas, selo girando, numeral do rodapé | Parados (CSS sob `html[data-motion="full"]`; JS não liga) |
| `Odometer` | Valor final, sem girar |
| `VelocityMarquee` | Vira linha `flex-wrap` centralizada, sem movimento |
| `PinnedTrack` (linha do tempo), `StackPanels`, palco do App | Usam a versão vertical (a mesma do celular), sem fixar. O ponto do trilho acende sem escala |
| Transição de página | Crossfade de 150 ms |
| Menu | Abre sem `clip-path` (fade de 150 ms) |
| Vídeos | Sem autoplay: poster com botão de play acessível (`aria-label="Reproduzir vídeo ilustrativo"`) |
| Lenis | Não é criado (rolagem nativa) |
| Hover | Muda só a cor; sem tilt, magnético, `RollText` ou prévia que segue o cursor (a prévia aparece fixa) |
| Carimbo, selo, chips | Estado final |

---

## 17. Orçamento de desempenho

| Item | Meta | Como garantir |
|---|---|---|
| LCP (celular, 4G simulado) | < 2,5 s | O LCP é o poster da capa: AVIF 720 × 900 com no máximo 90 KB, `<link rel="preload" as="image" imagesrcset … fetchpriority="high">`, sem `opacity` nem `clip-path` sobre ele (a cortina é outro elemento). H1 em CSS. HTML pré-renderizado |
| CLS | < 0,1 | `width`/`height` em toda mídia; fallback de fonte com métricas; nenhuma animação de layout; versões desktop e celular alternadas por CSS; odômetro com colunas de largura fixa; nav `position: fixed` com espaço reservado |
| INP | < 200 ms | Handlers leves; nenhum cálculo de layout em laço; marquee e mola num rAF só (Lenis + framer) |
| Fontes | ≤ 260 KB | 3 woff2 latinos (Fraunces normal e itálica com opsz, Manrope), todos com `preload` |
| JS inicial | ≤ 180 KB gzip | React 18, framer-motion (importar só o que usa), Lenis, react-router; um bundle só (o prerender por rota não combina com `lazy()` no React 18). `vite-bundle-visualizer` no CI local |
| CSS | ≤ 30 KB gzip | Tailwind com purge |
| Imagens da home | ≤ 1,3 MB somadas, todas carregadas | 1600w AVIF ≤ 110 KB; prévias 640w ≤ 35 KB (só no primeiro hover); logos WebP ≤ 12 KB; miniaturas do acordeão só ao abrir |
| **Peso da home sem vídeo** | **< 2 MB** (régua) | Soma conferida pelo verify com a página rolada inteira |
| Vídeo da home | 1 clipe, ≤ 2,5 MB | V1 com `idleLoad` (depois de `load` + idle, nunca antes do LCP); não carrega com `saveData` ou 2g; pausa fora da tela |
| Vídeos internos | ≤ 2,5 MB cada, no máximo 2 por página | `LazyVideo` com `preload="none"`; `src` só a uma tela de distância |
| Requisições iniciais (home) | ≤ 35 | Ícones dentro do bundle; logos fora da dobra são lazy |
| FPS rolando | ≥ 55 no desktop; ≥ 40 no celular com CPU 4x | Só `transform` e `opacity`; `will-change: transform` apenas nos elementos fixados enquanto fixados; nada de `overflow: hidden` em ancestral de `sticky` ou de `view()` (usar `clip`); `content-visibility` **não** em seções fixadas. Medir com o `medir-desempenho.mjs` da Indafire |

---

## 18. Arquivos e componentes a criar

Base: os arquivos copiados do Seven (checklist de `padroes-codigo.md` §14). Ajustes desta direção:
- **Paleta e fontes:** seção 3.
- **`motion.tsx`:** durações ≤ 900 ms.
- **Prerender:** por rota.
- **Formulário:** modo prévia.
- **`reducedMotion`:** seção 16.

```
src/
  data/site.ts            COMPANY, NAV, ROUTES(meta), HERO, NUMBERS, COMPROMISSO, TIMELINE[10], SERVICES[8],
                          AUTHORIZED[4], BRANDS[8], AFFILIATIONS[2], PLATFORM{pilares[4], modulos[3], recursos[8]},
                          SECTORS[3], VOICES[3], VALUES, DIFERENCIAIS[4], ESG, KIDS, CATALOG, CREDITS,
                          CLIENTS = [], TEAM_VOICES = [], OBRAS = []   // vazios: só o modo proposta mostra os espaços
  lib/smooth-scroll.ts    (Seven) + só cria Lenis com data-motion="full"
  lib/motion-mode.ts      lê data-motion / pt-proposta; hooks useMotionMode(), useProposalMode()
  lib/head.ts             useHead(route)
  components/motion/      Reveal, LineReveal, ParagraphLines, ScrollLitText, ClipReveal, ParallaxFrame, Odometer,
                          Rule, DrawIcon, VelocityMarquee, Magnetic, RollText, CursorPreview, TiltCard, PinnedTrack,
                          StackPanels, SymbolMark, Seal, Folio
  components/             CaptionedFigure, LazyVideo, OrdersScreen, cta.tsx (WhatsAppLink/PhoneLink/EmailLink/PrimaryCta),
                          ContactForm, CtaFinal, ClientWall, TeamVoices, ReservedSlot, icons.tsx, chrome.tsx
                          (Nav, Menu, PageTransition, ReadingProgress, FloatingContact, ProposalBadge, MotionToggle)
  sections/home/          Capa, Numeros, Compromisso, LinhaDoTempo, ServicosIndice, EmCampo, Marcas, Plataforma,
                          Setores, Voz, Catalogo, Orcamento
  sections/institucional/ Abertura, Cronologia, Valores, Diferenciais, Sustentabilidade, KidsOng
  sections/servicos/      Abertura, ServicoBloco, FaixaAvcb
  sections/clientes/, sections/app/, sections/catalogo/, sections/contato/
  pages/                  Home, Institucional, Servicos, Clientes, App, Catalogo, Contato, Creditos, NotFound
  entry-server.tsx        render(url) com StaticRouter + head(url) + structuredData(url)
scripts/
  prerender.mjs           percorre ROUTES -> dist/<rota>/index.html e dist/404.html
  imagens.mjs             sharp: AVIF/WebP, trim de logos, focos
  videos.mjs              ffmpeg-static: recorte, compressão, faststart, poster
  verify.mjs              puppeteer-core (Indafire), com data-motion para a cobertura
```

**Dependências novas** em relação ao Seven:
- `@fontsource-variable/fraunces`, `@fontsource-variable/manrope`, `lucide-react` e `react-router-dom@6`;
- de desenvolvimento: `sharp`, `ffmpeg-static` e `puppeteer-core`.

**Sai do Seven:** `@phosphor-icons/react` (um conjunto só de ícones), `@fontsource-variable/inter`, `/archivo` e `/jetbrains-mono`, e o `Embers` (sem fogo nesta direção).

**Projeto:** a porta e o `VITE_BASE` dependem do nome do repositório. Sugestão: `protecin-demo`, `VITE_BASE=/protecin-demo/`, dev na 5185 e `vite preview` na 4185 (livres: o Seven usa 5175/4180 e a Indafire 4351/4361).

---

## 19. Pendências [confirmar com a Protecin]

1. **Fotos de obra:** confirmar que `4.jpg` e `Bradesco-024.jpg` são obras da Protecin e podem ser publicadas como "Acervo Protecin", sem nome de cliente.
2. **Clientes:** logos com autorização (liga a `ClientWall`).
3. **Equipe:** depoimentos e vídeos (liga `TeamVoices`); fotos reais de sede, frota, oficina e obras (substituem as ilustrativas da linha do tempo, uma a uma).
4. **Filiações:** se é formal a filiação à ABSpk e à NFPA (o site só mostra os logos).
5. **Marcas:** qual é a relação com VESDA, Bosch, Firebee e Germek.
6. **Preço único:** se a condição de 1986 para inspeção e manutenção de extintores continua valendo.
7. **Kids ONG:** ano de início, para trocar "sete anos" por "desde {ano}".
8. **Fundação:** "fundação pela Extimbrás" (1976) contra "Cláudio Szulcsewski, fundador da Protecin". A demo usa as duas frases literais.
9. **Marco de 2021:** a frase "software próprio para combate e rastreabilidade" está truncada no site. Pedir o texto certo.
10. **Logo:** arquivo vetorial oficial (SVG ou AI), que substitui a vetorização da seção 3.4.
11. **Catálogo:** conteúdo do PDF; e se ele passa a ser hospedado no site novo.
12. **Formulário:** endereço de destino em produção (comercial@ ou falecom@) e ativação do FormSubmit.
13. **Privacidade:** política de privacidade, necessária para o aviso de cookies em produção.
14. **GTM e Ads:** ID do container e conversões. Pendências com o Gabriel, fora desta demo.
15. **Licenças:** das fotos de banco herdadas do site atual (para a página de créditos).

---

## 20. Aceite específico desta direção

Soma-se à `qa/REGUA-SITE-NOVO.md`.

- **Legendas e créditos:**
  - toda `<figure>` tem `figcaption` com crédito, e o verify conta zero figuras sem crédito;
  - nenhuma foto de banco tem legenda de equipe ou de obra.
- **Linha do tempo:**
  - no desktop (≥ 1024 × 640), fixa, percorre os 10 itens e termina no 2026;
  - o odômetro do ano bate com o item no centro;
  - em 844 × 390 e no modo reduzido, vira a cronologia vertical, sem nada fixado.
- **Capa e LCP:**
  - H1 e CTAs visíveis em ≤ 1 s com o JS bloqueado (teste sem JS da Indafire) e com `animation: none`;
  - o LCP é o poster.
- **Modo proposta:**
  - `?proposta=1` mostra os 4 espaços reservados;
  - sem o parâmetro, nenhum espaço reservado e nenhum texto "a enviar" aparece.
- **Motion:**
  - `?motion=1` liga tudo mesmo com a preferência do sistema em "reduzir";
  - `?motion=0` desliga.
- **Leads:** todos os links `wa.me` casam com `^https://wa.me/5511945651751\?text=`, e todos os CTAs têm `data-lead-location` da lista da seção 15.
- **Peso:** home com menos de 2 MB sem vídeo, medida com a página rolada inteira.
