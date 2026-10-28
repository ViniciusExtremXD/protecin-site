# Protecin: especificação final do site novo (demo de redesign)

Documento definitivo para a construção. Data: 28/10/2026.
Substitui `direcao-1.md`, `direcao-2.md` e `direcao-3.md` como fonte de decisão. Onde este documento diz "literal de §X", o texto vem **palavra por palavra** de `referencia/conteudo-estruturado.md` §X. Critério de aceite geral: `qa/REGUA-SITE-NOVO.md` (este documento só acrescenta).

Regras que valem para tudo:
- **Nada inventado.** Nenhum número, cliente, depoimento, prêmio, certificação, estado ou prazo fora de `conteudo-estruturado.md`. O que depende da Protecin fica `null`, não renderiza, ou aparece só no modo proposta (§7.10).
- **Tudo em português do Brasil.** Código pode ter nomes em português ou inglês, mas todo texto visível é pt-BR.
- **Todo elemento visível é animado** (entrada, rolagem ou hover), com propósito. Meta medida: cobertura de animação ≥ 98% (§16).
- **Entradas de 200 a 900 ms.** Na rolagem, só `transform` e `opacity` (exceção: `stroke-dashoffset` de SVG e `clip-path` disparado uma vez, nunca ligado à rolagem).
- Prioridade: **P0** a demo não sai sem isso; **P1** entra na primeira publicação. Não há P2: o que não está aqui não se faz.

Sumário: 0 Decisão · 1 Conceito · 2 Honestidade · 3 Projeto · 4 Sistema visual · 5 Motion · 6 Primitivas (API) · 7 Chrome e layout · 8 Rotas · 9 Home · 10 Páginas internas · 11 Dados (`site.ts`) · 12 Imagens e vídeos · 13 Leads · 14 Movimento reduzido · 15 Desempenho · 16 Aceite · 17 Unidades de build · 18 Pendências.

---

## 0. Decisão do juiz

| Critério (0 a 10) | D1 Cinematográfico industrial | D2 Engenharia de precisão | D3 Legado e confiança |
|---|---|---|---|
| Poder de venda | 9,5 | 8,5 | 7 |
| Credibilidade | 8 | 9,5 | 9,5 |
| Riqueza de motion | 9,5 | 9 | 7 |
| Viabilidade na stack | 8 | 6,5 | 8,5 |
| Desempenho | 7 | 8 | 9 |
| Celular | 7,5 | 8,5 | 9 |
| **Nota (venda e motion com peso 2)** | **8,6** | **8,4** | **8,0** |

**Vencedora: Direção 1, "Cinematográfico industrial".** O pedido é "usar e abusar do motion" num site "extremamente dinâmico e vendável". A D1 tem o momento de venda mais forte (o vídeo encolhe até virar a gota do logo e as cantoneiras fecham o símbolo), transforma a única foto real com etiqueta PROTECIN numa cena de câmera guiada pela rolagem e reaproveita quase todo o código do Extin Seven.

**Enxertos da D2 (Engenharia de precisão):**
- `FocusBrackets`: as cantoneiras do logo viram a moldura de foco no hover de mídia, cartões e campos.
- O diagrama isométrico "Camada por camada" vira a peça-assinatura de `/servicos/` (§10.2).
- Nó "Processador de Coleta Online" com pacotes de dados e carimbos NBR na plataforma.
- Grade de prancheta (`bg-blueprint`) no mundo azul.
- `TextScramble` nos rótulos mono, régua de ticks nos números e chamadas desenhadas sobre a foto dos cilindros.
- Seções claras ("papel") intercaladas, para dar ritmo ao site escuro.

**Enxertos da D3 (Legado e confiança):**
- Entrada acima da dobra em CSS puro, antes da hidratação.
- `CaptionedFigure` com crédito obrigatório no tipo ("Foto do acervo Protecin" ou "Imagem ilustrativa").
- `Odometer` que gira uma volta inteira sem piscar.
- `ffmpeg-static` para recortar e comprimir os vídeos (resolve a falta de ffmpeg na máquina).
- Página `/creditos/`, modo proposta (`?proposta=1`) com espaços reservados e faixa AVCB em `/servicos/`.
- `lead_page` em todo evento.

**Descartados de propósito:**
- Três famílias tipográficas (D2): a régua permite duas.
- 15 rotas com página por serviço (D2): os serviços viram capítulos de `/servicos/`.
- Cursor customizado e `CoordCursor`: não aparecem em nenhuma das 10 referências B2B.
- `react-router-dom` (D3): o roteador próprio custa zero dependência.
- GSAP: framer-motion com `useScroll` e `sticky` cobre todas as cenas fixadas.

---

## 1. Conceito

### 1.1 A ideia
O símbolo da Protecin (a gota protegida por quatro cantoneiras) é a janela por onde o visitante vê a empresa. A página abre no escuro e o vermelho da marca funciona como luz. Cada capítulo se abre dentro da gota: azul para a tecnologia, vermelho para o orçamento. As cantoneiras reaparecem como moldura de foco em tudo que o visitante toca.

### 1.2 Roteiro da home
1. **Abertura.** Vídeo de sistema de supressão em tela cheia com "Protegendo vidas e patrimônios há 50 anos".
2. **Símbolo.** Ao rolar, a tela encolhe até virar a gota; as cantoneiras fecham o logo e o slogan acende palavra por palavra.
3. **Escala.** 20.000+ clientes como título, depois 50, 3M+, 5M+ e 250+ em odômetro.
4. **Credibilidade** (seção clara). Autorizações oficiais, marcas com que trabalha e filiações.
5. **Serviços.** 8 cartões que se empilham.
6. **Na prática.** A câmera passeia por 5 pontos da foto real `4.jpg`; depois vem a bateria de cilindros com chamadas.
7. **Plataforma.** A gota azul se abre e o celular e o notebook se montam em 4 passos.
8. **Por que a Protecin** (seção clara). Os 4 diferenciais.
9. **50 anos.** A linha do tempo de 1976 a 2026 corre na horizontal.
10. **Setores.** Linhas tipográficas gigantes.
11. **Compromisso** (seção clara). Kids ONG e sustentabilidade.
12. **Orçamento.** A gota vermelha se abre, com brasas e o formulário de 3 etapas.

### 1.3 Por que vende
- **"O site dos 50 anos".** 1976 + 50 = 2026. O preloader conta de 1976 a 2026 e a linha do tempo termina em 2026.
- **O mercado não tem motion.** Nenhum dos 7 concorrentes analisados passa de um marquee. Aqui entram cena fixada, texto revelado, vídeo, SVG que se desenha e transição de página (técnicas de Terminal Industries, Breakthrough Energy e Composites.archi).
- **Prova antes de adjetivo.** Os números da Protecin são uma ordem de grandeza maiores que os dos concorrentes (500+ e 1.000+) e aparecem como título.
- **A foto real é a cena principal.** A única do acervo com a marca visível (etiqueta PROTECIN) vale mais que todas as fotos de banco.
- **Software que ninguém mais mostra.** App de Coleta, Web Master e Processador de Coleta Online aparecem em movimento.
- **Engenharia demonstrada.** Em `/servicos/`, o diagrama em corte acende os seis sistemas que a Protecin instala e mantém.
- **Conversão que o site atual não tem.** "Solicitar orçamento" acima da dobra no desktop e no celular, WhatsApp com mensagem por serviço e todo clique no `dataLayer`, pronto para o GTM e o Ads do Gabriel.
- **Coerência de marca.** Um motivo só (gota + cantoneiras) no preloader, no hero, nas transições, no foco, no orçamento e no rodapé.

---

## 2. Regras de honestidade

| Tema | Regra |
|---|---|
| Clientes | Nenhum cliente é citado. Os logos são de **fabricantes e entidades**. "Autorizada" só para Kidde Brasil, Everlux, Notifier e Simplex. VESDA, Bosch, Firebee e Germek são "Marcas com que trabalhamos". ABSpk e NFPA são "Filiações técnicas" |
| `024-original.jpg` | Vira `obra-cilindros-supressao`. O nome original nunca aparece em URL, `alt`, texto ou código publicado |
| Fotos | Reais (`4.jpg`, `024-original.jpg`, telas do app, colagem da Kids ONG): crédito "Foto do acervo Protecin". Banco: crédito "Imagem ilustrativa", nunca legendada como equipe, obra ou cliente |
| Proibidas | `Team-*`, `Testi-*`, `Icon-*`, `Image-1.jpg`, `Image-2.jpg`, `Logo-1..4.png`, `Logo-Fire-01.png`, `teste-1*.png`, `placeholder*.png`, todas as fotos de bombeiro (`*firefighter*`, `with-notepad-*`), `ecofriendly_logo.png` (não é certificação) e `Design_sem_nome_16.png` (a tela é recriada em HTML) |
| Vídeos | Todos de banco, com crédito "Imagem ilustrativa". Ninguém dos vídeos é apresentado como equipe ou cliente |
| Mockups | Só rótulos que existem nas telas reais. Dados de cliente viram barras borradas. Gráfico sem eixo e sem número |
| Copy proibida (régua) | Ficam fora as frases reais "está transformando o setor" e "elevar o padrão das suas inspeções". Nada de "gratuito", "AVCB aprovado", percentual de satisfação ou mapa de estados |
| Inconsistências | "Fundação pela Extimbrás" e "Cláudio Szulcsewski, fundador da Protecin" aparecem literais, sem conciliar. "Sete anos" da Kids ONG fica como está |

---

## 3. Projeto

### 3.1 Stack e versões
- **Base:** React 18.3.1, react-dom 18.3.1, framer-motion ^11.18.2, lenis ^1.1.20 e lucide-react (versão atual do npm, fixada no lockfile).
- **Build:** Vite ^5.4.11, @vitejs/plugin-react ^4.3.4, TypeScript ~5.6.3, Tailwind ^3.4.17, PostCSS e autoprefixer, cross-env ^7.0.3.
- **Desenvolvimento:**
  - `sharp` (atual): pipeline de imagens.
  - `ffmpeg-static` (atual): vídeos.
  - `puppeteer-core` ^24.1.1 e `axe-core` (atual): verificação. A base já instala os dois, para a integração não precisar mexer no `package.json`.
  - `@fontsource-variable/archivo` e `@fontsource-variable/jetbrains-mono` (^5.1.1): só para copiar os woff2.
- **Sem** GSAP, react-router, Three.js, Phosphor ou Inter.
- **Máquina:** Node 22.16.0, npm 10.9.2, gh 2.87.3 (logado como `ViniciusExtremXD`, sem escopo `workflow`) e Chrome em `C:\Program Files\Google\Chrome\Application\chrome.exe`.

### 3.2 Repositório, base e portas
- **Remoto:** `origin = https://github.com/ViniciusExtremXD/protecin-site.git`, que já existe.
- **Demo:** `VITE_BASE=/protecin-site/`, publicada em `https://viniciusextremxd.github.io/protecin-site/` (branch `gh-pages`).
- **Produção futura:** base `/`, domínio `protecin.com.br`.
- **Portas:**
  - dev: `5185` (`--strictPort`);
  - `vite preview`: `4185`;
  - servidor estático do verify: `4195` em `127.0.0.1`.
  - O Seven usa 5175/4180 e a Indafire 4351/4361.
- **OneDrive:** `node_modules` e `dist` ficam fora da pasta sincronizada, por junction para `C:\DevCache\protecin\` (`scripts/junctions.ps1`, adaptado da Indafire).
  - O `npm install` troca a junction do `node_modules` por pasta real, então rode o script depois de cada install.
  - O `vite.config.ts` libera `realpathSync("node_modules")` em `server.fs.allow`.

### 3.3 Árvore de pastas
```
index.html            template: <!--head-->, <div id="root"></div>, <!--structured-data-->, script do head (§7.1)
dev.html              entrada do sandbox de desenvolvimento (não vai para o build)
public/               fonts/, img/ (gerado), videos/ (gerado), favicon.svg, apple-touch-icon.png, og-protecin.jpg, robots.txt
scripts/              junctions.ps1, imagens.mjs, videos.mjs, prerender.mjs, verify.mjs, servir-estatico.mjs,
                      medir-desempenho.mjs, deploy-gh.mjs  (os .py existentes ficam como estão)
src/main.tsx          hydrateRoot se houver prerender; senão createRoot
src/App.tsx           RouterProvider + MotionRoot + chrome + troca de página
src/entry-server.tsx  render(url), head(url), structuredData()
src/styles.css        Tailwind, tokens CSS, entradas CSS, utilitários, modo reduzido
src/data/             site.ts (conteúdo), imagens.gen.ts e videos.gen.ts (gerados pelos scripts)
src/lib/              urls.ts, track.ts, smooth-scroll.ts, router.tsx, motion-pref.ts, media.ts
src/components/motion/  primitivas de animação (§6)
src/components/ui/      cta, Img, CaptionedFigure, LazyVideo, Symbol, Logo, ícones, rótulos, chips, ReservedSlot
src/components/chrome/  MotionRoot, Preloader, Nav, Menu, PageCurtain, ScrollFuse, FloatingContact, MotionToggle,
                        MotionToast, ProposalBadge, SkipLink
src/components/layout/  Container, Footer, PageHero, FaixaCta
src/sections/           home/, shared/, servicos/, clientes/, institucional/, app/, contato/, catalogo/, creditos/, notfound/
src/pages/              composição fina de cada rota (só monta seções)
src/dev/sandbox.tsx     renderiza qualquer seção isolada com o chrome real
```

### 3.4 `package.json` (scripts exatos)
```json
{
  "name": "protecin-site", "private": true, "version": "0.1.0", "type": "module",
  "scripts": {
    "dev": "vite --port 5185 --strictPort",
    "sandbox": "vite --port 5185 --strictPort --open /dev.html",
    "imagens": "node scripts/imagens.mjs",
    "videos": "node scripts/videos.mjs",
    "typecheck": "tsc --noEmit",
    "build": "tsc --noEmit && vite build && vite build --ssr src/entry-server.tsx --outDir dist-server && node scripts/prerender.mjs",
    "build:gh": "cross-env VITE_BASE=/protecin-site/ npm run build",
    "preview": "vite preview --port 4185 --strictPort",
    "verify": "node scripts/verify.mjs",
    "verify:gh": "npm run build:gh && node scripts/verify.mjs --estatico",
    "deploy:gh": "npm run build:gh && node scripts/deploy-gh.mjs"
  }
}
```
Enquanto a integração não existe, `build`, `dev` (index) e `verify` falham. As unidades paralelas usam `npm run typecheck` e `npm run sandbox`.

### 3.5 Configs
- **`vite.config.ts`:**
  - `base: process.env.VITE_BASE ?? "/"` e `plugins: [react(), gtm(), previa()]`.
  - `server.fs.allow`: a raiz do projeto mais o caminho real do `node_modules`.
  - `gtm()` (`transformIndexHtml`): se `process.env.VITE_GTM_ID` existir, injeta no `<head>` o snippet do Seven (`padroes-codigo.md` §8) com a regex `/(^|\.)protecin\.com\.br$/` e o debug por `?gtm_debug=` ou `?track=`. Sem ID, não injeta nada. O ID é a pendência do Gabriel e não se inventa.
  - `previa()`: se a base não for `/`, injeta `<meta name="robots" content="noindex, nofollow">`.
- **`tsconfig.json`:** ES2020, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `strict`, `noEmit`, `types: ["vite/client"]`, `include: ["src"]`.
- **`postcss.config.js`:** `{ plugins: { tailwindcss: {}, autoprefixer: {} } }`.
- **`.gitignore`:** os itens atuais mais `dist-server/`, `verificacao/` e `.claude/settings.local.json`. `public/img/` e `public/videos/` **são versionados**, porque o `imagens-site-atual/` é ignorado e o build precisa deles.
- **`.claude/launch.json`:**
  - `protecin-dev`: `npm run dev`, porta 5185;
  - `protecin-prod`: `npx vite preview --port 4185 --strictPort`, porta 4185.

---

## 4. Sistema visual

### 4.1 Paleta (tokens do `tailwind.config.js`)
Base escura **puxada para o azul da marca**: é a D1 com o preto levemente azulado. Contrastes calculados pela fórmula WCAG 2.x.

| Token | Hex | Papel | Contraste |
|---|---|---|---|
| `noite-950` | `#050A12` | fundo da página; texto das seções claras | `papel-50` sobre ele: 17,32 |
| `noite-900` | `#09111C` | faixas alternadas, menu, cartão do formulário | `papel-50`: 16,54 |
| `noite-800` | `#0F1A28` | cartões | `papel-50`: 15,29 |
| `noite-700` | `#182536` | campos, bordas fortes | `papel-50`: 13,51 |
| `noite-600` | `#253447` | linhas finas, réguas, trilhos | decorativo |
| `noite-500` | `#5A6779` | traço de contorno | 3,45: **nunca texto** |
| `marinho-900` | `#071A2B` | fim do mundo azul | `papel-50`: 15,39 |
| `marinho-800` | `#0A2741` | mundo azul | |
| `marinho-700` | `#0E3452` | **azul da marca** | `papel-50`: 11,24; branco: 12,87 |
| `marinho-600` | `#164A73` | miolo do mundo azul | |
| `marinho-500` | `#3A77A8` | linhas ativas do diagrama | gráfico |
| `marinho-300` | `#9DB8D0` | traço de prancheta, texto secundário sobre azul | sobre `marinho-700`: 6,25 |
| `brasa-600` | `#8F141B` | varredura de hover do botão | branco: 9,20 |
| `brasa-500` | `#BE1E29` | **vermelho da marca**: fundo de botão, gota, destaques em seção clara | branco: 6,16; sobre `papel-50`: 5,38; sobre `noite-950`: 3,22 (só ≥ 24 px) |
| `brasa-400` | `#E8442E` | laranja do símbolo: gota, cantoneira, destaque de título no escuro | sobre `noite-950`: 5,00; sobre `noite-800`: 4,42 (só texto grande); **nunca com texto branco por cima** (3,96) |
| `brasa-300` | `#FF6A4D` | texto pequeno vermelho no escuro e no azul, mensagens de erro | sobre `noite-950`: 7,01; sobre `marinho-700`: 4,55 |
| `brasa-200` | `#FFB199` | núcleo das brasas | decorativo |
| `papel-50` | `#F3EFE9` | texto principal no escuro; **fundo das seções claras** | |
| `papel-100` | `#E9E3DA` | fundo alternativo claro, chips claros | `noite-950` sobre ele: 15,55 |
| `papel-300` | `#B8BFC9` | texto secundário no escuro | sobre `noite-950`: 10,71; sobre `noite-800`: 9,45; sobre `marinho-700`: 6,95 |
| `papel-500` | `#8C95A3` | legenda e rótulo mono no escuro | sobre `noite-950`: 6,56; sobre `noite-800`: 5,79; **não usar sobre azul** (4,26) |
| `grafite-600` | `#4B5866` | texto secundário nas seções claras | sobre `papel-50`: 6,35; sobre `papel-100`: 5,70 |
| `fotolum` | `#D8F36A` | brilho das placas de saída no diagrama | só gráfico |
| `whatsapp` | `#25D366` | ícone e ponto do WhatsApp | sobre `noite-950`: 10,00 |

**Regras de cor:**
- Botão primário: fundo `brasa-500` com texto `#FFFFFF`.
- Nas seções claras, o texto é `noite-950`, o secundário `grafite-600` e o destaque `brasa-500`.
- Nada de glassmorphism, gradiente roxo ou neon.

**Gradientes** (estáticos; quem anima é `opacity`/`transform` da camada):
- `luz-brasa`: `radial-gradient(60% 50% at 50% 100%, rgba(190,30,41,.55), rgba(190,30,41,0) 70%)`.
- `luz-ponteiro`: `radial-gradient(600px circle at var(--x) var(--y), rgba(232,68,46,.18), transparent 60%)`, via `useMotionTemplate`.
- `veu-hero`: `linear-gradient(180deg, rgba(5,10,18,.60) 0%, rgba(5,10,18,.20) 38%, rgba(5,10,18,.88) 100%), linear-gradient(90deg, rgba(5,10,18,.75) 0%, rgba(5,10,18,0) 60%)`.
- `mundo-azul`: `radial-gradient(80% 70% at 70% 40%, #164A73 0%, #0E3452 45%, #071A2B 100%)`.
- `mundo-vermelho`: `radial-gradient(70% 60% at 50% 110%, #BE1E29 0%, #5A0B10 45%, #050A12 100%)`.

**Texturas** (CSS em `styles.css`):
- **Grão:** `.grain::after` do Seven com opacidade 0,045 e **sem animação**, só nas seções escuras.
- **Prancheta:** `.bg-blueprint` com 4 `linear-gradient` (linha menor a cada 24 px e maior a cada 120 px, `marinho-300` a 7% e 16%) num `::before`, e `.bg-blueprint-claro` (linhas `noite-950` a 5% e 9%).

### 4.2 Tipografia (2 famílias)
| Família | Arquivo | Uso |
|---|---|---|
| **Archivo** variável (wght 100–900, wdth 62–125) | `public/fonts/archivo-latin-wdth-normal.woff2`, copiado de `node_modules/@fontsource-variable/archivo/files/` (conferir o nome exato do arquivo latino com eixo wdth) | títulos condensados e **todo o texto corrido** (wdth 100, não condensado) |
| **JetBrains Mono** variável (wght 100–800) | `public/fonts/jetbrains-mono-latin-wght-normal.woff2` | rótulos técnicos, anos, contadores de etapa, normas |

**Carregamento:**
- `@font-face` declarado no `index.html` (dentro de `<style>`, com `%BASE_URL%fonts/...`, `font-display: swap`, `font-weight: 100 900` e `font-stretch: 62% 125%`).
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` só da Archivo.
- Fallback sem salto de layout: `@font-face "Archivo Fallback"` (`local("Arial")`) com `size-adjust`, `ascent-override` e `descent-override` calculados a partir das métricas do woff2 (por exemplo com `@capsizecss/unpack` numa execução avulsa). O CLS da home fica abaixo de 0,05.

Escala (`fontSize` do Tailwind; largura via `font-stretch`):

| Token | Tamanho | Largura / peso / entrelinha / tracking | Uso |
|---|---|---|---|
| `display-xxl` | `clamp(3.25rem, min(10.5vw, 17svh), 10.5rem)` | 62% · 850 · 0,86 · -0,01em · caixa alta | H1 da home, ano da linha do tempo, número-título |
| `display-xl` | `clamp(2.75rem, min(7vw, 12svh), 8rem)` | 66% · 800 · 0,9 · caixa alta | H2 de seção, letreiros |
| `display-l` | `clamp(2rem, 3.6vw, 3.5rem)` | 75% · 750 · 0,95 | H3 de cartão, números secundários |
| `titulo` | `clamp(1.375rem, 1.8vw, 1.75rem)` | 100% · 600 · 1,2 | títulos de item |
| `corpo-l` | `clamp(1.125rem, 1.3vw, 1.3125rem)` | 100% · 400 · 1,55 | subtítulos e lead |
| `corpo` | 16 px no celular, 17 px a partir de 1024 px | 100% · 400 · 1,65 · máximo de 62ch | todo parágrafo |
| `rotulo` | 13 px | JetBrains Mono · 500 · +0,16em · caixa alta | rótulos e créditos. **Nada com mais de 20 caracteres abaixo de 13 px** (o QA marca) |
| `botao` | 16 px | 100% · 600 · +0,01em | botões |

Utilitários: `.stretch-62`, `.stretch-66`, `.stretch-75`, `.stretch-100`, `.tnum`, `.text-outline`, `.text-outline-claro`, `.text-balance` e `.text-pretty`.
- `.text-outline`: `-webkit-text-stroke: 1px rgba(243,239,233,.35); color: transparent`.
- `.text-outline-claro`: o mesmo traço com `rgba(5,10,18,.35)`.

### 4.3 Grade, espaço, raios e camadas
- **Container (`Container`):** `max-width: 1440px`, margem lateral de 20 px (celular), 32 px (≥ 768), 48 px (≥ 1024) e 64 px (≥ 1280). Letreiros e mídia sangram.
- **Grade:** 12 colunas com gutter de 24 px (≥ 1024), 8 colunas (768 a 1023) e 4 colunas com gutter de 16 px (< 768).
- **Ritmo:** seção com `py-24 lg:py-40` (96/160 px). Entre rótulo e título 20 px; entre título e texto 32 px; entre blocos 64 px.
- **Breakpoints extras do Tailwind:**
  - `pin: { raw: "(min-width: 1024px) and (min-height: 640px)" }`;
  - `curto: { raw: "(max-height: 560px)" }`.
- **Raios:** `r-sm 10px`, `r-md 18px`, `r-lg 28px` e `r-janela 40px` (topo das seções que sobem). Gota: `border-radius: 50% 0 50% 50%` (canto superior direito reto, como no símbolo).
- **z-index:** preloader 90 · cortina 80 · menu 70 · grão 60 · toast 55 · nav 50 · contato flutuante 45 · etiqueta do modo proposta 44.
- **Toque:** todo alvo tem pelo menos 44×44 px no celular.

### 4.4 Ícones
Um conjunto só: **lucide-react**, com `strokeWidth={1.5}` (1.25 nos ícones acima de 96 px) e `currentColor`. O mapa fica em `src/components/ui/icones.ts` (`IconeId → LucideIcon`).
- **Nome que não existir na versão instalada:** usar o alternativo da tabela, sempre de traço.
- **Marcas sociais:** WhatsApp, Instagram e LinkedIn são glifos próprios em traço de 1,5 no grid de 24, em `glifos.tsx`. A Lucide não tem mais ícones de marca.

| Item | Ícone (alternativo) |
|---|---|
| 01 Instalação | `Wrench` |
| 02 Projetos | `DraftingCompass` (`Ruler`) |
| 03 Documentação | `ClipboardCheck` |
| 04 Inspeções | `ListChecks` |
| 05 Gestão e manutenção | `Settings2` (`Cog`) |
| 06 Riscos | `ShieldAlert` |
| 07 Venda | `FireExtinguisher` (`Flame`) |
| 08 Sinalização | `Signpost` (`DoorOpen`) |
| Diferenciais | `Headset`, `MonitorCog` (`Monitor`), `ShieldCheck`, `HardHat` |
| Pilares | `Smartphone`, `LayoutDashboard`, `WifiOff`, `FileCheck2` (`FileCheck`) |
| Recursos (8) | `LayoutDashboard`, `Smartphone`, `WifiOff`, `MailCheck`, `MessagesSquare`, `Activity`, `BadgeCheck`, `CircleCheckBig` (`CheckCircle2`) |
| Setores | `Landmark`, `Cpu`, `HeartPulse`, `Factory`, `Wheat`, `Zap`, `Truck` |
| Selos | `UserCheck`, `ThumbsUp`, `MapPinned` |
| Canais | `Phone`, `Mail`, `MapPin`, `Clock` |
| Interface | `ArrowUpRight`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Menu`, `X`, `Download`, `Play`, `Check`, `Plus`, `Server`, `RefreshCw`, `CircleAlert` (`AlertCircle`), `ImagePlus` |

### 4.5 Logo
**Símbolo vetorizado** (`src/components/ui/Symbol.tsx`), `viewBox="0 0 100 100"`. As medidas foram tiradas de `SIMBOLO.png` (706×712): cantoneira de 44,3 com espessura de 13,2, vão de 11,4, raio externo de 9 e gota de raio 25 centrada em (50, 50).

```svg
<path data-parte="tl" d="M44 0 H9 A9 9 0 0 0 0 9 V44 H13 V13 H44 Z"/>
<path data-parte="tr" d="M56 0 H91 A9 9 0 0 1 100 9 V44 H87 V13 H56 Z"/>
<path data-parte="bl" d="M0 56 V91 A9 9 0 0 0 9 100 H44 V87 H13 V56 Z"/>
<path data-parte="br" d="M100 56 V91 A9 9 0 0 1 91 100 H56 V87 H87 V56 Z"/>
<path data-parte="gota" d="M50 25 H75 V50 A25 25 0 0 1 50 75 A25 25 0 0 1 25 50 A25 25 0 0 1 50 25 Z"/>
```

| Tom | tl, bl, br | tr | gota |
|---|---|---|---|
| `escuro` (sobre fundo escuro) | `papel-50` | `brasa-400` | `brasa-400` |
| `claro` (sobre fundo claro) | `marinho-700` | `brasa-500` | `brasa-500` |
| `mono` (sobre vermelho) | `papel-50` | `papel-50` | `papel-50` |

**Wordmark:** PNG recortado de `Ativo-1.png` pelo `scripts/imagens.mjs`. O script varre o alfa por colunas: o primeiro bloco opaco é o símbolo e o wordmark começa depois do primeiro vão de pelo menos 20 px de colunas transparentes. Saem duas versões:
- `protecin-wordmark` (cores originais, para seção clara);
- `protecin-wordmark-negativo` (pixels azul-marinho viram `#F3EFE9` e os vermelhos viram `#E8442E`, mantendo o acento do "O").

O `Logo` usa `<Img>` com `width`/`height`. **[confirmar com a Protecin]**: arquivos oficiais em SVG.

---

## 5. Motion: vocabulário

### 5.1 Tokens (`src/components/motion/tokens.ts`)
```ts
export const EASE_OUT    = [0.16, 1, 0.3, 1] as const;    // entradas (Seven)
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;   // máscaras, traços, cortinas
export const EASE_IN     = [0.7, 0, 0.84, 0] as const;    // saídas
export const EASE_BACK   = [0.34, 1.56, 0.64, 1] as const; // carimbo, encaixe
export const SPRING = {
  rolagem: { stiffness: 140, damping: 30, mass: 0.35 },   // suaviza progress de cena fixada
  ima:     { stiffness: 220, damping: 16, mass: 0.4 },    // Magnetic
  pilula:  { stiffness: 380, damping: 30 },               // layoutId, Reel por estado
  encaixe: { stiffness: 420, damping: 32, mass: 0.6 },    // cantoneiras, carimbos
  tilt:    { stiffness: 220, damping: 18 },               // TiltCard
  previa:  { stiffness: 160, damping: 22 },               // CursorPreview
} as const;
export const DUR = { micro: 0.2, curta: 0.35, base: 0.6, longa: 0.8, max: 0.9 } as const; // segundos
export const STAGGER = { linha: 0.08, palavra: 0.04, item: 0.06, grade: 0.05, digito: 0.04 } as const;
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
export type Preset = "sobe" | "fade" | "virada" | "monta" | "carimbo";
```
CSS espelha esses valores em `:root`: `--ease-out`, `--ease-in-out`, `--ease-in`, `--ease-back`, `--t-micro` (200 ms), `--t-curta` (350), `--t-base` (600), `--t-longa` (800) e `--t-max` (900).

### 5.2 Presets (nomes usados nas tabelas)
| Preset | Efeito | Tempo / easing | Primitiva |
|---|---|---|---|
| `sobe` | opacidade 0→1, y 28→0 | 600 ms, EASE_OUT | `Reveal` |
| `linha` | cada linha numa máscara, y 110%→0 e rotate 3°→0 | 800 ms, EASE_OUT, stagger 80 ms | `SplitLines` |
| `palavra` | por palavra, y 110%→0 e rotate 4°→0 | 700 ms, EASE_OUT, stagger 40 ms | `SplitWords` |
| `acende` | palavras com opacidade 0,18→1 pela rolagem | ligado à rolagem | `ScrollLitText` |
| `cortina` | `clip-path: inset(100% 0 0 0 round R) → inset(0 round R)` e mídia interna scale 1.25→1 | 900 ms; máscara EASE_IN_OUT e escala EASE_OUT | `ClipReveal` |
| `traco` | SVG com `stroke-dashoffset` 1→0 (`pathLength=1`) | 700 ms, EASE_IN_OUT, stagger 80 ms por path | `DrawIcon`, `DrawPath` |
| `regua` | linha com scaleX 0→1 a partir da esquerda | 900 ms, EASE_OUT | `Rule` |
| `virada` | rotateX 70°→0 + opacidade, `perspective 900` | 600 ms, EASE_OUT, stagger 50 ms | `Reveal preset="virada"` |
| `monta` | de posição espalhada determinística (x ±60, y +80, rotate ±6°, pelo índice) até o lugar, com opacidade | 650 ms, EASE_OUT, stagger 50 ms | `Reveal preset="monta" index` |
| `carimbo` | scale 1.35→1, rotate -8°→0, opacidade 0→1 | `SPRING.encaixe` (cerca de 350 ms) | `Reveal preset="carimbo"`, `StampBadge` |
| `odometro` | cada dígito gira uma volta e para no valor | 800 ms, EASE_OUT, stagger 40 ms da direita para a esquerda | `Odometer` |
| `scramble` | caracteres embaralham e fixam | ≤ 600 ms | `TextScramble` |
| `cantoneiras` | 4 cantoneiras fecham do offset ao lugar | `SPRING.encaixe` | `FocusBrackets` |
| `fade` | só opacidade | 400 ms (200 ms no reduzido) | `Reveal preset="fade"` |

**Regras gerais:**
- **Gatilho:** `VIEWPORT`, uma vez, com o elemento 12% dentro da tela. Numa cascata, o primeiro item começa em até 100 ms e o último em até 600 ms depois do gatilho.
- **Marcação:** todo wrapper de motion leva `data-motion="<preset>"`, e as entradas CSS levam `data-motion="css"`. É o que o verify conta.
- **Parallax e reveal nunca no mesmo elemento.** O reveal vai no wrapper e o parallax no filho.
- **Recorte:** contêiner de cena fixada ou de animação por rolagem usa `overflow: clip`, nunca `hidden`.
- **Transform do framer:** em elemento com `style` de transform do framer, centralizar com `x`/`y` do próprio framer ou com a propriedade CSS `translate`, nunca com as classes `-translate-*` do Tailwind 3.
- **Animação infinita:** só as fitas (marquees) e, enquanto o passo está ativo na tela, os pacotes de dados da plataforma. Tudo pausa fora da tela. Pulsos e anéis tocam no máximo 3 vezes.

### 5.3 Entrada acima da dobra em CSS (enxerto D3)
O HTML é pré-renderizado. Hero, PageHero, nav e preloader animam por **CSS keyframes** (`animation-fill-mode: both`) e só disparam sob `html.motion-full`, então nada espera o JS.
- **Sem JS:** a classe não existe e tudo aparece parado.
- **Classes em `styles.css`:** `.e-sobe`, `.e-fade`, `.e-zoom`, `.e-linha > span > span`, `.e-gota`, `.e-cantoneira` e `.e-nav`.
- **Atraso:** `animation-delay: calc(var(--t0) + var(--d, 0ms))`, com `html.intro { --t0: 600ms }` e `html:not(.intro) { --t0: 80ms }`.
- **Keyframes com valores literais**, nunca `var()` dentro do keyframe:

```css
@keyframes e-sobe  { from { opacity: 0; transform: translate3d(0, 28px, 0); } }
@keyframes e-linha { from { transform: translate3d(0, 110%, 0) rotate(3deg); } }
@keyframes e-fade  { from { opacity: 0; } }
@keyframes e-zoom  { from { transform: scale(1.08); } }
@keyframes e-nav   { from { transform: translate3d(0, -100%, 0); } }
html.motion-full .e-sobe { animation: e-sobe 600ms cubic-bezier(.16,1,.3,1) both; animation-delay: calc(var(--t0) + var(--d,0ms)); }
/* idem para as demais */
```

Abaixo da dobra, a entrada é framer-motion (`whileInView`), com o seguro de §7.1.

### 5.4 Microinterações globais
| Elemento | Hover (só `@media (hover: hover) and (pointer: fine)`) | Toque / foco | Tempo |
|---|---|---|---|
| **Botão primário** (pílula `brasa-500`, texto branco, 52 px; 48 no celular) | `Magnetic` 0,25; fundo `brasa-600` varre da esquerda (scaleX 0→1, `origin-left`); `TextRoll`; `ArrowUpRight` sai pela diagonal (14, -14) e outro entra | `whileTap` scale 0,96; foco com anel de 2 px `brasa-300` e offset de 3 px | 350 ms, EASE_OUT |
| **Botão fantasma** (borda 1 px `papel-50/30`) | borda vai a `papel-50/90`, fundo `papel-50/6` varre, `TextRoll` | igual | 350 ms |
| **Botão WhatsApp** (fantasma com ponto `whatsapp` de 8 px) | como o fantasma, e o ponto pulsa uma vez (scale 1→1,6→1) | igual | 350 ms |
| **Botões em seção clara** | primário igual; fantasma com borda `noite-950/30` e varredura `noite-950/6` | foco com anel `brasa-500` | 350 ms |
| **Link de texto** | sublinhado de 1 px com scaleX 0→1 e ícone x 0→4 | sublinhado sempre visível no celular | 200 ms |
| **Cartão** | y 0→-4, borda vai a `brasa-400/60`, ícone se redesenha, `FocusBrackets` na mídia | `whileTap` scale 0,98 | 350 ms |
| **Mídia em cartão** | scale 1,04→1,08 | — | 800 ms, EASE_OUT |
| **Campo** | — | no foco, a linha inferior `brasa-400` faz scaleX 0→1, o rótulo sobe (y -22, scale 0,8) e as `FocusBrackets` travam | 200 ms |
| **Chip selecionável** | borda clareia | `whileTap` 0,94; selecionado: fundo `brasa-500` com `layout` e `Check` desenhado | 200–350 ms |

---

## 6. Primitivas e hooks: API exata

Ficam em `src/components/motion/` e são exportadas por `index.ts`.
- **Prerender:** todas são seguras no SSR, sem `window` no render.
- **Modo reduzido:** todas leem `useMotionPref()` e entregam o estado final.
- **Marcação:** toda primitiva põe `data-motion` no elemento raiz.

```ts
// ---------- src/components/motion/Reveal.tsx ----------
type RevealTag = "div" | "li" | "p" | "span" | "section" | "article" | "figure" | "header" | "ul" | "ol";
export interface RevealProps {
  as?: RevealTag; preset?: Preset; delay?: number; y?: number; index?: number; // index: posição para "monta"
  className?: string; id?: string; children: React.ReactNode;
}
export function Reveal(p: RevealProps): JSX.Element;
export interface RevealGroupProps { as?: RevealTag; preset?: Preset; stagger?: number; delay?: number; className?: string; children: React.ReactNode }
export function RevealGroup(p: RevealGroupProps): JSX.Element;        // dispara os RevealItem filhos em cascata
export function RevealItem(p: { as?: RevealTag; className?: string; index?: number; children: React.ReactNode }): JSX.Element;

// ---------- SplitLines.tsx ----------
export type Linhas = string[] | { desktop: string[]; celular: string[] };
export interface SplitLinesProps {
  lines: Linhas; as?: "h1" | "h2" | "h3" | "p" | "span"; className?: string; lineClassName?: string;
  highlight?: string[]; highlightClassName?: string;  // palavras inteiras destacadas (padrão "text-brasa-400")
  delay?: number; stagger?: number; css?: boolean;     // css=true: entrada .e-linha (acima da dobra)
  text?: string;                                       // aria-label; padrão = linhas unidas por espaço
}
export function SplitLines(p: SplitLinesProps): JSX.Element;   // { desktop, celular }: dois conjuntos, alternados por CSS (md:)

// ---------- SplitWords.tsx (Seven) ----------
export interface SplitWordsProps { text: string; as?: "h2" | "h3" | "p" | "span"; className?: string; wordClassName?: string;
  highlight?: string[]; highlightClassName?: string; delay?: number; stagger?: number; immediate?: boolean; rotate?: number; replayKey?: string | number }
export function SplitWords(p: SplitWordsProps): JSX.Element;   // replayKey: re-dispara a entrada quando muda (troca de ponto/etapa)

// ---------- ScrollLitText.tsx (Seven) ----------
export interface ScrollLitTextProps { text: string;   // "*palavra*" = destaque
  as?: "h2" | "p" | "span"; className?: string; highlightClassName?: string; from?: number /* 0.18 */;
  offset?: [string, string] /* ["start 80%","end 45%"] */; progress?: MotionValue<number>; range?: [number, number] }
export function ScrollLitText(p: ScrollLitTextProps): JSX.Element; // progress+range: usa o progress de uma cena fixada

// ---------- ClipReveal.tsx ----------
export interface ClipRevealProps { from?: "bottom" | "left" | "right" | "center"; radius?: number /* 28 */; delay?: number;
  scaleFrom?: number /* 1.25 */; className?: string; innerClassName?: string; children: React.ReactNode }
export function ClipReveal(p: ClipRevealProps): JSX.Element;    // anima clip-path uma vez + scale do wrapper interno

// ---------- ParallaxMedia.tsx ----------
export interface ParallaxMediaProps { amount?: 6 | 8 | 12; axis?: "y" | "x"; className?: string; children: React.ReactNode }
export function ParallaxMedia(p: ParallaxMediaProps): JSX.Element;
// CSS scroll-driven (`animation-timeline: view()`, classes .px-y-6/.px-y-8/.px-y-12/.px-x-8 com keyframes literais,
// translate ±amount% + scale 1+amount/50) dentro de @supports; sem suporte, useScroll+useTransform.

// ---------- DrawIcon.tsx / DrawPath.tsx ----------
export interface DrawIconProps { icon: IconeId | LucideIcon; size?: number; strokeWidth?: number; className?: string;
  delay?: number; redrawOnHover?: boolean; drawn?: boolean /* controle externo; omitido = inView */ }
export function DrawIcon(p: DrawIconProps): JSX.Element;
// useLayoutEffect põe pathLength="1" em path/line/circle/rect/polyline/polygon/ellipse e marca data-ready;
// CSS .draw[data-ready] :is(...) { stroke-dasharray:1; stroke-dashoffset:1; transition: stroke-dashoffset 700ms var(--ease-in-out) calc(var(--i,0)*80ms) }
// .draw.is-drawn → stroke-dashoffset:0. Sem JS (sem data-ready) o ícone aparece inteiro.
export interface DrawPathProps { d: string; progress?: MotionValue<number>; range?: [number, number]; className?: string;
  strokeWidth?: number; duration?: number; delay?: number; dashed?: boolean }
export function DrawPath(p: DrawPathProps): JSX.Element;         // <motion.path>; sem progress = inView

// ---------- Rule.tsx ----------
export function Rule(p: { axis?: "x" | "y"; origin?: "start" | "end" | "center"; delay?: number; className?: string }): JSX.Element;

// ---------- Odometer.tsx (enxerto D3) ----------
export interface OdometerProps { value: string;      // "20.000+", "3M+", "250+", "1976", "01"
  className?: string; digitClassName?: string; affixClassName?: string; duration?: number; stagger?: number;
  trigger?: "inView" | "value";                       // "value": anima a cada mudança de value (ano ativo)
  ariaLabel?: string }
export function Odometer(p: OdometerProps): JSX.Element;
// Cada dígito: coluna inline-block w-[0.62em] h-[1em] overflow-clip text-center com 0–9 repetido 2 vezes (20 itens).
// SSR: translateY(-(10+d)*5%) (valor final no HTML). Ao montar fora da tela: salta sem transição para -(d*5%)
// (mesmo dígito, sem piscar); no inView anima até -(10+d)*5% (uma volta). Se já estava na tela ao montar, não anima.
// trigger "value": anima para frente até o novo dígito e normaliza a posição em silêncio. Separador e sufixo estáticos.

// ---------- TextScramble.tsx (enxerto D2) ----------
export function TextScramble(p: { text: string; as?: "span" | "p"; className?: string; delay?: number; duration?: number /* ≤0.6 */ }): JSX.Element;
// Caracteres giram por "0-9 A-Z - / ·" e o i-ésimo fixa em i*18ms+120ms. SSR = texto final; aria-label = text.

// ---------- TextRoll.tsx ----------
export function TextRoll(p: { text: string; className?: string }): JSX.Element;   // 2 cópias em overflow-clip; group-hover sobe

// ---------- WipeText.tsx ----------
export function WipeText(p: { lines: string[]; highlight?: string[]; className?: string; offset?: [string, string] }): JSX.Element;
// Contorno (.text-outline) + cópia preenchida em contêiner overflow-clip: contêiner x -100%→0 e texto interno 100%→0,
// ligado à rolagem. Palavras de highlight preenchem em brasa-400.

// ---------- Magnetic.tsx / TiltCard.tsx ----------
export function Magnetic(p: { strength?: number /* 0.35 */; className?: string; children: React.ReactNode }): JSX.Element; // só pointerType mouse
export function TiltCard(p: { max?: number /* 8 */; perspective?: number /* 900 */; glare?: boolean; className?: string; children: React.ReactNode }): JSX.Element;

// ---------- VelocityMarquee.tsx (Seven + pausa) ----------
export interface VelocityMarqueeProps { baseVelocity?: number /* -1.2 */; pauseOnHover?: boolean /* true */;
  className?: string; trackClassName?: string; ariaLabel?: string; children: React.ReactNode }
export function VelocityMarquee(p: VelocityMarqueeProps): JSX.Element;
// 4 cópias (aria-hidden nas 3 últimas), wrap -25%..0%, acelera e inverte com a velocidade da rolagem,
// hover leva a velocidade a 0 por mola, IntersectionObserver pausa fora da tela. Reduzido: vira flex-wrap estático, 1 cópia.

// ---------- CursorPreview.tsx ----------
export function CursorPreview(p: { image: ImagemId | null; containerRef: React.RefObject<HTMLElement>; width?: number /* 318 */; height?: number /* 220 */ }): JSX.Element | null;
// position: fixed, segue o ponteiro com SPRING.previa; entra com scale .6→1, rotate -4°→0 (350 ms); troca com crossfade 200 ms;
// só pointer: fine e motion full; no toque não renderiza.

// ---------- PinStage.tsx ----------
export interface PinStageProps {
  id?: string; className?: string; stageClassName?: string;
  heightClassName: string;     // altura por CSS, ex.: "h-[220vh] lg:h-[260vh]"
  mode?: "sempre" | "pin";     // "sempre": fixa em qualquer largura (exceto curto/reduzido); "pin": só no breakpoint pin:
  smooth?: boolean;            // suaviza com SPRING.rolagem (padrão true)
  label?: string;              // aria-label da cena
  children: React.ReactNode;
}
export function PinStage(p: PinStageProps): JSX.Element;
export function usePin(): { progress: MotionValue<number>; raw: MotionValue<number>; active: boolean };
// <section data-pin-stage data-pin="on|off" class={heightClassName}> <div class="pin-palco sticky top-0 h-[100svh] overflow-clip">.
// active = depois de montar && motion full && (mode "sempre" ? !curto : matchMedia(pin)). SSR e inativo: data-pin="off".
// CSS: [data-pin="off"] e html.motion-reduced e @media curto → seção height:auto, palco position:relative/height:auto,
// [data-pin-layer]{transform:none!important}. Cada seção define seu layout estático por esse seletor.

// ---------- SectionRise.tsx ----------
export function SectionRise(p: { as?: "section" | "footer" | "div"; id?: string; className?: string; radius?: number /* 40 */; children: React.ReactNode }): JSX.Element;
// -mt-[40px] relative z-[1], cantos superiores com raio fixo, useScroll(["start end","start start"]):
// scale .9→1, y 12vh→0, transformOrigin 50% 0%. Linha de luz no topo (1 px, gradiente transparente→brasa-400→transparente) com Rule.

// ---------- DropWindow.tsx ----------
export interface DropWindowProps { progress: MotionValue<number>; range?: [number, number] /* [0.08, 0.55] */;
  mode: "fechar" | "abrir"; from?: number /* 0.45; escala inicial do modo abrir */; className?: string; children: React.ReactNode }
export function DropWindow(p: DropWindowProps): JSX.Element;
// Tamanho D por CSS (variável --gota no className). S0 = hypot(innerWidth, innerHeight)/D * 1.04, medido no mount e no resize
// (SSR: 8). fechar: scale S0→1; abrir: from→S0. Mídia interna 100vw × 100svh com scale 1/s (o enquadramento fica parado).
// Só transform; overflow-clip + rounded-[50%_0_50%_50%]; will-change só enquanto a cena está ativa.

// ---------- Reel.tsx ----------
export interface ReelProps { count: number; index?: number; progress?: MotionValue<number>; axis?: "y" | "x";
  className?: string; itemClassName?: string; children: React.ReactNode[]; label?: string }
export function Reel(p: ReelProps): JSX.Element;  // index: y=-index*(100/count)% com SPRING.pilula; progress: contínuo

// ---------- FocusBrackets.tsx (enxerto D2) ----------
export interface FocusBracketsProps { mode?: "hover" | "locked" | "enter"; offset?: number /* 10 */; size?: number | string /* "clamp(12px,8%,28px)" */;
  tone?: "escuro" | "claro"; className?: string }
export function FocusBrackets(p: FocusBracketsProps): JSX.Element;
// 4 Ls de 2 px (tr em brasa-400/brasa-500; demais papel-50/marinho-700), absolutos no pai (relative).
// hover: aparecem no group-hover/focus-within do pai (offset→0, opacity 0→1, SPRING.encaixe); locked: sempre; enter: travam no inView.

// ---------- StampBadge.tsx ----------
export function StampBadge(p: { text: string; className?: string; trigger?: "inView" | "manual"; show?: boolean }): JSX.Element;

// ---------- Embers.tsx (Seven) ----------
export function Embers(p: { density?: number /* 70 */; className?: string; repel?: boolean }): JSX.Element | null;
// dpr ≤ 2, densidade x0,45 abaixo de 768 px, pausa fora da tela, não monta no reduzido nem no SSR.
// repel (P1): só pointer fine; partícula a menos de 120 px do ponteiro ganha v += normalizar(e-p)*0.6*(1-d/120).
```

**Hooks e libs:**

```ts
// src/lib/motion-pref.ts
export type MotionPref = "full" | "reduced";
export function useMotionPref(): MotionPref;          // "full" no 1º render (casa com o SSR), depois lê html.motion-reduced
export function setMotionPref(p: MotionPref): void;   // localStorage "pt-motion" (try/catch), pushEvent("motion_toggle",{mode:p}), location.reload()
export function useReducedBySystem(): boolean;        // html.motion-reduced-sys (sistema pediu e não há preferência salva)
export function useProposalMode(): boolean;           // html.proposta; false no 1º render

// src/lib/media.ts
export function useMediaQuery(q: string, ssr?: boolean): boolean;  // false no SSR e no 1º render
export function useIsDesktop(): boolean;                           // (min-width: 1024px)
export function useFinePointer(): boolean;                         // (hover: hover) and (pointer: fine)
export function useCanPlayVideo(): boolean;                        // !saveData && effectiveType não 2g/3g && motion full
export function useInViewport(ref: React.RefObject<Element>, opts?: { rootMargin?: string; threshold?: number }): boolean; // sem once

// src/lib/smooth-scroll.ts  (Seven, copiado; offset -84)
export function initSmoothScroll(): () => void;      // não cria Lenis com motion reduced
export function scrollToHash(hash: string): void;
export function scrollToY(y: number, opts?: { immediate?: boolean; duration?: number }): void;
export function scrollToProgress(el: HTMLElement, p: number): void; // para ir a um ponto/pilar/camada de cena fixada
export function lockScroll(locked: boolean): void;
export function bindAnchorLinks(): () => void;
export function resizeSmoothScroll(): void;

// src/lib/router.tsx  (sem dependência)
export function RouterProvider(p: { initialPath: string; children: React.ReactNode }): JSX.Element;
export function usePath(): string;                   // pathname sem a base, sempre com "/" no fim
export function useRoute(): Rota | null;             // null = 404
export function useRouteTransition(): { phase: "idle" | "cobrindo" | "saindo"; destino: string | null };
export function navigate(to: string, opts?: { replace?: boolean }): void;
// motion full: phase "cobrindo" (450 ms), troca a rota, scrollToY(0,{immediate}), resizeSmoothScroll(), applyHead(rota),
// pushEvent("virtual_page_view",{page_path,page_title}), phase "saindo" (550 ms), depois scrollToHash se houver hash.
// Reduzido: troca direta com fade de 200 ms. popstate passa pelo mesmo fluxo.
export function Link(p: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }): JSX.Element;
// href = routeUrl(to); intercepta clique esquerdo sem modificadores; "/#orcamento" na própria home só rola.
export function matchRoute(path: string): Rota | undefined;
export function applyHead(rota: Rota | null): void;  // document.title + meta description + canonical

// src/lib/urls.ts
export const IS_DEMO: boolean;                       // import.meta.env.BASE_URL !== "/"
export function assetUrl(path: string): string;     // prefixa a base
export function routeUrl(path: string): string;     // idem para rotas internas
export function imgUrl(id: ImagemId, w: number, ext: "avif" | "webp"): string; // assetUrl(`img/${id}-${w}.${ext}`)
export function videoUrl(arquivo: string): string;  // assetUrl(`videos/${arquivo}`)
export function buildWhatsAppUrl(message?: string): string; // https://wa.me/5511945651751?text=encodeURIComponent(msg)
export function mailtoUrl(email: string, subject?: string, body?: string): string;

// src/lib/track.ts  (seguro no SSR)
export function pushEvent(event: string, params?: Record<string, string | number | boolean | undefined>): void;
export function trackLead(channel: LeadChannel, location: LeadLocation, detail?: string, extra?: Record<string, string>): void;
// dataLayer.push({ event:"lead_click", lead_channel, lead_location, lead_detail, lead_page, ...extra })
export function currentPageId(): PageId;
```

**Componentes de UI** (`src/components/ui/`):

```ts
// Img.tsx — <picture> com AVIF e WebP, srcset das larguras de IMAGENS[id], width/height do original
export interface ImgProps { id: ImagemId; alt: string; sizes?: string; className?: string; imgClassName?: string;
  priority?: boolean;        // eager + fetchpriority="high" (só o LCP)
  eager?: boolean; mobile?: ImagemId /* <source media="(max-width: 767px)"> */; fit?: "cover" | "contain"; position?: string }
export function Img(p: ImgProps): JSX.Element;   // decoding="async"; loading="lazy" salvo eager/priority

// CaptionedFigure.tsx (enxerto D3): crédito obrigatório no tipo
export interface CaptionedFigureProps { img: ImgProps; credit: "acervo" | "ilustrativa"; caption?: string;
  reveal?: "cortina" | "fade" | "none"; parallax?: 0 | 6 | 8 | 12; aspect?: string /* "16/10" */; brackets?: boolean;
  creditPosition?: "abaixo" | "sobre"; className?: string }
export function CaptionedFigure(p: CaptionedFigureProps): JSX.Element;
// crédito em rotulo 13 px: "FOTO DO ACERVO PROTECIN" ou "IMAGEM ILUSTRATIVA"; "sobre" = canto inferior esquerdo com fundo noite-950/70

// LazyVideo.tsx
export interface LazyVideoProps { id: VideoId; label: string; className?: string; fit?: "cover" | "contain";
  when?: "idle" | "near" | "active"; active?: boolean; posterPriority?: boolean; sizes?: string; onPlayingChange?: (p: boolean) => void }
export function LazyVideo(p: LazyVideoProps): JSX.Element;
// Poster <Img> sempre (SSR). <video muted playsinline loop preload="none" data-lazy-video> só no cliente, opacity 0 até
// "playing" (classe is-playing, crossfade 600 ms). when "idle": depois de load + requestIdleCallback (fallback 1200 ms);
// "near": IntersectionObserver rootMargin "100% 0px"; "active": só com active=true. Pausa com < 15% visível.
// arquivoMobile abaixo de 768 px. Sem useCanPlayVideo ou com autoplay bloqueado: desmonta o vídeo e mostra o botão Play
// (44 px, aria-label "Reproduzir vídeo ilustrativo", pushEvent("video_play",{video:id})).
// Registro global: no máximo 1 vídeo tocando além do hero.

// Symbol.tsx / Logo.tsx
export type ParteSimbolo = "tl" | "tr" | "bl" | "br" | "gota";
export interface SymbolProps { size?: number | string; tone?: "escuro" | "claro" | "mono"; title?: string; className?: string;
  partStyle?: Partial<Record<ParteSimbolo, MotionStyle>>;   // transforms vindos de cena
  mode?: "estatico" | "montar" | "desenhar" | "css-montar"; delay?: number }
export function Symbol(p: SymbolProps): JSX.Element;
// montar: cantoneiras de ±24 px até o lugar (700 ms, stagger 80 ms) e gota scale 0→1 (EASE_BACK, +320 ms);
// desenhar: contorno pathLength 1→0 (900 ms) e depois preenchimento (300 ms); css-montar: o mesmo em CSS (preloader, 404).
export function Logo(p: { tone: "escuro" | "claro"; className?: string; animate?: boolean; asLink?: boolean }): JSX.Element;

// cta.tsx
type TrackProps = { location: LeadLocation; detail?: string; extra?: Record<string, string> };
type Anchor = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
export function WhatsAppLink(p: Anchor & TrackProps & { message?: string }): JSX.Element;    // target _blank, rel noopener
export function PhoneLink(p: Anchor & TrackProps): JSX.Element;                               // tel:+551149778720
export function EmailLink(p: Anchor & TrackProps & { email?: string; subject?: string; body?: string }): JSX.Element;
type Visual = { size?: "md" | "sm"; full?: boolean; tone?: "escuro" | "claro"; className?: string };
export function PrimaryCta(p: Visual & { children: string; to?: string; href?: string; icon?: "arrow" | "download" | "none";
  onClick?: () => void; external?: boolean }): JSX.Element;
export function GhostCta(p: Visual & { children: string; to?: string; href?: string; icon?: "arrow" | "none" }): JSX.Element;
export function WhatsAppCta(p: Visual & TrackProps & { message?: string; children?: string /* "Falar no WhatsApp" */ }): JSX.Element;
export function PhoneCta(p: Visual & TrackProps & { children?: string }): JSX.Element;
export function OrcamentoCta(p: Visual & { formLocation: string; servico?: ServicoSlug; children?: string /* "Solicitar orçamento" */ }): JSX.Element;
// Na home: href "#orcamento" (+ ?servico vira evento CustomEvent "pt:servico" que pré-marca o chip). Fora: Link para
// /contato/?servico=<slug>. Sempre pushEvent("form_open",{form_location}).

// SectionLabel.tsx
export function SectionLabel(p: { index: string; label: string; tone?: "escuro" | "claro"; className?: string }): JSX.Element;
// "01 — Escala": ponto de 6 px (brasa-400/brasa-500) que pulsa 3 vezes + TextScramble

// Chip.tsx
export function Chip(p: { children: string; tone?: "escuro" | "claro" | "azul"; className?: string }): JSX.Element;
export function ChipToggle(p: { children: string; selected: boolean; onToggle: () => void; tone?: "escuro" | "claro" }): JSX.Element;

// ReservedSlot.tsx (modo proposta)
export function ReservedSlot(p: { id: ReservadoId; className?: string; aspect?: string }): JSX.Element | null;
// só renderiza no cliente com useProposalMode(); borda tracejada papel-500, ImagePlus, título e texto de RESERVADOS[id]
```

**Contrato de seção.** Todo arquivo de `src/sections/**` faz `export default function X(props?)`, com todas as props opcionais (as padrões renderizam a versão da home). Regras:
- A raiz é `<section id="..." data-section="H3">` ou um `SectionRise`/`PinStage` com `id`.
- Todo texto vem de `src/data/site.ts`. Nenhum texto de conteúdo fica literal no componente; ficam só textos de interface, como "Continuar" e "Voltar".
- Imagem só por `Img`/`CaptionedFigure`; vídeo só por `LazyVideo`; contato só por `cta.tsx`.

---

## 7. Chrome e layout global

### 7.1 Script do `<head>` e seguro anti-invisível
É síncrono, o primeiro do `<head>`, antes de qualquer CSS:

```html
<script>
(function () {
  var h = document.documentElement, pref = null, s = location.search;
  try { pref = localStorage.getItem("pt-motion"); } catch (e) {}
  var m = /[?&]motion=(full|reduced|1|0)\b/.exec(s);
  if (m) { pref = (m[1] === "full" || m[1] === "1") ? "full" : "reduced"; try { localStorage.setItem("pt-motion", pref); } catch (e) {} }
  var sys = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var reduced = pref ? pref === "reduced" : sys;
  h.classList.add(reduced ? "motion-reduced" : "motion-full");
  if (sys && !pref) h.classList.add("motion-reduced-sys");
  try {
    if (/[?&]proposta=1\b/.test(s)) sessionStorage.setItem("pt-proposta", "1");
    if (/[?&]proposta=0\b/.test(s)) sessionStorage.removeItem("pt-proposta");
    if (sessionStorage.getItem("pt-proposta") === "1") h.classList.add("proposta");
  } catch (e) {}
  var intro = false;
  try { intro = !sessionStorage.getItem("pt-intro"); sessionStorage.setItem("pt-intro", "1"); } catch (e) {}
  if (intro && !reduced) h.classList.add("intro");
  setTimeout(function () { if (!h.classList.contains("motion-up")) h.classList.add("motion-failed"); }, 4000);
})();
</script>
<noscript><style>
  .pt-preloader{display:none!important}
  [style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}
  [style*="clip-path"]{clip-path:none!important}
</style></noscript>
```

- O mesmo CSS, sob `html.motion-failed`, fica em `styles.css`.
- `MotionRoot` adiciona `motion-up` depois de hidratar, aplica `<MotionConfig reducedMotion={pref==="reduced" ? "always" : "never"}>`, inicia o Lenis (só no full) e chama `bindAnchorLinks()`.

### 7.2 Preloader (P1, só na primeira entrada da sessão, 900 ms)
- **Quando aparece:** sempre vem no SSR (`.pt-preloader`), mas só é visível sob `html.intro`. A animação é **100% CSS**, para sair mesmo com JS lento.
- **Fundo `noite-950`:** fixo até 600 ms, depois `translateY 0→-100%` (300 ms, EASE_IN_OUT).
- **`Symbol mode="css-montar"`** de 120 px: as cantoneiras partem 28 px para fora com opacidade 0 e fecham em 0–350 ms (EASE_OUT); a gota faz scale 0→1 em 200–550 ms (EASE_BACK).
- **Contador mono "1976 → 2026"** (15 px, `papel-300`): `@property --ano { syntax: '<integer>'; initial-value: 1976; inherits: false }`, `animation: ano 600ms steps(50) forwards`, `counter-reset: ano var(--ano)` e `content: counter(ano)`. Sem suporte a `@property`, mostra "1976 · 2026" fixo.
- **Linha fina** sob o contador: scaleX 0→1, linear, 0–600 ms.
- **Saída:** o JS remove o nó no `animationend` e chama `lockScroll(false)`. Com `html.motion-reduced` ou sem `intro`, não aparece.

### 7.3 Nav (P0)
**Desktop (76 px):**
- `Logo tone="escuro"`: símbolo de 32 px e wordmark de 132 px.
- Centro: Institucional · Serviços · Nossos Clientes · Nosso App · Catálogo · Contato (15 px, peso 500).
- Direita: `OrcamentoCta size="sm" formLocation="nav"` (44 px) e um botão redondo de 44 px com o glifo do WhatsApp (`WhatsAppLink location="nav"`).

**Celular (64 px):** logo à esquerda; à direita, a pílula "Orçamento" (44 px) e o botão Menu (44×44).

**Estados:**
- Transparente no topo.
- Acima de 40 px: fundo `noite-950/92` e linha inferior de 1 px `noite-700`, sem blur.
- Esconde ao descer depois de 420 px (`y 0→-120%`, 500 ms, EASE_OUT) e volta ao subir (padrão do Seven).

**Motion:**
- Entrada: `.e-nav` em 500 ms a partir de `--t0 + 200 ms`; os links com `.e-sobe` e stagger de 40 ms.
- Hover nos links: `TextRoll`.
- Rota ativa: ponto `brasa-400` de 6 px sob o link (`layoutId="nav-ativo"`, `SPRING.pilula`).

**`ScrollFuse` (P1):** "pavio" de 2 px `brasa-500` no topo (`scaleX = scrollYProgress`, mola 120/24/0,3). Na ponta fica uma brasa de 6 px `brasa-200` com `box-shadow: 0 0 12px 4px rgba(232,68,46,.7)`, posicionada por `x`.

### 7.4 Menu em tela cheia (P0)
- **Abrir:** `clipPath circle(0% at calc(100% - 44px) 32px) → circle(150% ...)` em 600 ms (EASE_IN_OUT), com `lockScroll(true)`, `data-lenis-prevent` e `pushEvent("menu_open")`.
- **Itens 01–07** (Início, Institucional, Serviços, Nossos Clientes, Nosso App, Catálogo Digital, Contato) em `display-xl`, entrando com `linha` (stagger de 60 ms a partir de 200 ms). O número mono fica à esquerda.
- **Imagem à direita (desktop):** uma gota com D = 32vw troca por crossfade de 400 ms no hover. As imagens ficam empilhadas e nenhuma vai a opacidade 0; só a de cima muda.

  | Item | Imagem |
  |---|---|
  | Início | `hero-poster` |
  | Institucional | `institucional-pilar` |
  | Serviços | `servico-instalacao` |
  | Nossos Clientes | `clientes-aperto` |
  | Nosso App | `app-webmaster-notebook` |
  | Catálogo | `catalogo-capa` |
  | Contato | `obra-parede-sistemas` |

- **Rodapé do menu:** `WhatsAppLink location="menu"`, `PhoneLink location="menu"`, e-mail (`EmailLink location="menu"`), o horário e o `MotionToggle`.
- **Fechar:** X de 44 px (gira 90° no hover), Esc, toque na área vazia ou clique num link. O foco fica preso no menu e volta ao botão ao fechar.

### 7.5 Cortina de troca de página (P0)
1. Painel `brasa-500` em tela cheia, `translateY 100%→0` (450 ms, EASE_IN_OUT). Em cima dele, `Symbol tone="mono"` de 96 px fecha as cantoneiras entre 250 e 450 ms.
2. A rota troca por baixo (§6, `navigate`).
3. O painel sai em `translateY 0→-100%` (550 ms, EASE_OUT). A entrada CSS do hero da nova página reinicia, porque a `key` do `<main>` é o path.

São cerca de 1 s no total, com o conteúdo coberto por menos de 600 ms. No modo reduzido, vira fade de `noite-950` em 200 ms.

### 7.6 Contato flutuante (P0)
- **Celular:** barra inferior com 3 botões de 56 px de altura mais `env(safe-area-inset-bottom)`:
  - WhatsApp com o ponto verde (`location="barra_mobile"`);
  - Ligar (`PhoneLink location="barra_mobile"`);
  - Orçamento (`brasa-500`, `OrcamentoCta formLocation="barra_mobile"`).
  - Entra depois de 640 px de rolagem (`y 100%→0`, 350 ms).
- **Desktop:** botão redondo de 56 px com o glifo do WhatsApp (`location="botao_flutuante"`). Entra com mola (scale 0→1, rotate -90°→0) e um anel pulsa 3 vezes. No hover abre o rótulo "Falar no WhatsApp" (`max-w-0 → 180px`, 350 ms).
- **Some quando** `#orcamento`, o formulário ou o rodapé estão na tela, ou quando um campo tem foco.

### 7.7 MotionToast, MotionToggle e etiqueta de proposta (P1)
- **`MotionToast`:**
  - Aparece só com `html.motion-reduced-sys`, depois de 1,5 s, uma vez por sessão (`sessionStorage "pt-toast"`).
  - Fica no canto inferior esquerdo (no celular, acima da barra) e entra com `sobe` (350 ms).
  - Texto: "Seu sistema pediu menos animação. Este site foi feito para ser visto em movimento."
  - Botões: "Ativar movimento" (`setMotionPref("full")`) e "Manter reduzido".
- **`MotionToggle`:** no rodapé e no menu, o rótulo "Animações:" com uma pílula de 2 estados, "ligadas" e "reduzidas" (`layoutId`, `SPRING.pilula`).
- **`ProposalBadge`:** etiqueta de 13 px no canto inferior esquerdo, só com `html.proposta`. Texto "Modo proposta · sair": limpa `pt-proposta` e recarrega.
- **Cookies:** a demo não grava nenhum cookie de medição (o GTM não carrega), então **não há aviso de cookies na prévia**. Em produção, o `CookieNotice` do Seven só entra junto com a política de privacidade aprovada (pendência).
- **Para a apresentação:** usar `https://viniciusextremxd.github.io/protecin-site/?motion=full`, e acrescentar `&proposta=1` para mostrar os espaços reservados.

### 7.8 Rodapé (P0, todas as páginas, `Footer`)
**Desktop (fundo `noite-950` com grão):**
- **Topo:**
  - slogan gigante "PROTEGEMOS SEU MAIOR PATRIMÔNIO: A VIDA." em `WipeText` (`display-xl`, 2 linhas; "A VIDA." limpa em `brasa-400`);
  - logo abaixo, uma linha de CTA (`OrcamentoCta formLocation="rodape"` + `WhatsAppCta location="rodape"`). É a chamada repetida no fim de toda página.
- **4 colunas:**
  1. `Logo` + texto institucional;
  2. Seções;
  3. Contato;
  4. Endereço, horário e redes.
- **Linha final:**
  - "© {ano} Protecin. Todos os direitos reservados.";
  - "Vídeos e fotos ilustrativos: créditos" (`Link` para `/creditos/`);
  - `MotionToggle`;
  - botão "Voltar ao topo" de 48 px.

**Celular:** slogan em 3 linhas e colunas empilhadas. Os links têm `py-3` (44 px) e o rodapé tem `pb-[calc(56px+env(safe-area-inset-bottom))]` por causa da barra.

**Conteúdo:**
- Texto institucional literal de §2.1 (rodapé).
- Seções: Início, Institucional, Catálogo Digital, Serviços, Nossos Clientes, Nosso App, Contato.
- Contato:
  - `PhoneLink` "+55 11 4977-8720";
  - `WhatsAppLink` "WhatsApp +55 11 94565-1751";
  - `EmailLink` "comercial@protecin.com.br" e "falecom@protecin.com.br" (todos com `location="rodape"`).
- Endereço: "Rua Lacônia, 600, Parque Capuava, CEP 09271-010, Santo André - SP, Brasil".
- Horário: "Segunda a sexta, 8h às 17h30".
- Redes: Instagram @protecin_ltda e LinkedIn.
- O ano sai do build no SSR e o cliente atualiza no `useEffect`.

| Elemento | Entrada | Rolagem | Hover / toque |
|---|---|---|---|
| Slogan | contorno com `fade` | `WipeText` pelo progresso do rodapé (`["start end","end end"]`) | — |
| Linha de CTA | `sobe`, stagger 60 ms | — | §5.4 |
| Símbolo do logo | `Symbol mode="desenhar"` | — | a gota faz scale 1→1,08→1 (400 ms) |
| Colunas | `RevealGroup` `sobe`, stagger 60 ms; títulos mono com `TextScramble` | — | links com sublinhado (§5.4) |
| Linha final | `fade` | — | — |
| Voltar ao topo | `carimbo` | — | `Magnetic` 0,3; a seta sobe y 0→-4; o clique faz `scrollToY(0,{duration:1.4})` |

### 7.9 `PageHero` (base, para Institucional, Serviços e Nossos Clientes)
- **Estrutura:** `PinStage mode="sempre" heightClassName="h-[150svh] lg:h-[170vh]"`.
- **Desktop:**
  - colunas 1–7: trilha mono "INÍCIO / <PÁGINA>" (o Início é `Link`), H1 `display-xl` com `SplitLines css`, subtítulo `corpo-l` e CTAs (`OrcamentoCta` + `WhatsAppCta` contextual);
  - colunas 8–12: o símbolo com a imagem dentro da gota (D = `min(36vh, 30vw)`).
- **Celular:** texto em cima e símbolo embaixo (D = 58vw). O primeiro CTA fica acima da dobra.
- **Entrada (CSS):**
  - trilha com `e-fade`;
  - H1 com `e-linha` (stagger 80 ms);
  - subtítulo e CTAs com `e-sobe`;
  - cantoneiras fecham de 24 px para fora até o lugar (600 ms a partir de `--t0 + 200`);
  - imagem da gota com `e-zoom` (900 ms).
- **Rolagem:**
  - texto: opacidade 1→0,3 e y 0→-8vh em p 0→0,3;
  - gota: `DropWindow mode="abrir" from={1}` em p 0,1→0,6, com o grupo indo ao centro por `x`;
  - cantoneiras: afastam-se até ±50vw/±50vh em p 0,1→0,4;
  - de p 0,6 a 1: imagem em tela cheia com scale 1,06→1.
- **Estático** (reduzido ou curto): H1 e imagem parados, imagem na gota, sem fixação.
- **Props:** `{ page: "institucional" | "servicos" | "clientes" }`; os dados vêm de `PAGE_HEROES[page]`. Extra de `servicos`: o recorte `valvulas-sprinkler` flutua na frente da gota (parallax y 0→-18% e rotate 0→-3°, camada mais rápida).

### 7.10 `FaixaCta` (base, fim de toda página interna) e modo proposta
**`FaixaCta`:**
- **Fundo:** `mundo-vermelho` atenuado, com `Embers density={40}` e o letreiro `VelocityMarquee` "SOLICITAR ORÇAMENTO ·" em `display-xxl` (baseVelocity -0,8, `aria-hidden`).
- **Centro:** a frase "Fale com a Protecin: segunda a sexta, 8h às 17h30." e 3 botões:
  - `OrcamentoCta formLocation="faixa_cta"`;
  - `WhatsAppCta location="faixa_cta" detail={pageId}`;
  - `PhoneCta location="faixa_cta"`.
- **Motion:** `SectionRise`; botões com `sobe` (stagger 60 ms).
- **Props:** `{ page: PageId }`.

**Modo proposta** (`html.proposta`): mostra os espaços de `RESERVADOS` (§11), cada um no lugar indicado nas seções. Sem o parâmetro, nada aparece. Regra da régua: "se o fato não existe, a seção não existe".

### 7.11 Sandbox (`dev.html` + `src/dev/sandbox.tsx`)
- **URL:** `http://127.0.0.1:5185/dev.html?s=home/Abertura,home/Escala&rota=/`.
- **O que faz:** monta `RouterProvider initialPath={rota}`, `MotionRoot`, `Nav`, as seções pedidas (carregadas por `import.meta.glob("../sections/**/*.tsx")`, export default), `Footer`, `FloatingContact` e `PageCurtain`.
- **`?todas=1`:** lista os links de todas as seções encontradas.
- **Para que serve:** as unidades paralelas conferem o próprio trabalho por aqui. Não vai para o build.

---

## 8. Rotas

São 8 rotas pré-renderizadas mais a 404, todas com barra no fim. Os slugs de serviço viram âncoras de `/servicos/`. Em produção, o `.htaccess` da Locaweb faz 301 de cada slug antigo para a âncora (está em `DEPLOY.md`).

| Rota | PageId | `<title>` | `meta description` | Composição (ordem) |
|---|---|---|---|---|
| `/` | `home` | Protecin: engenharia e proteção técnica contra incêndio desde 1976 | Desde 1976 em Santo André (SP): projetos com ART, AVCB, instalação, inspeção e manutenção de sistemas contra incêndio. 20.000+ clientes atendidos. | H0 Abertura · H1 Escala · H2 Credibilidade · [reservado `clientes`] · H3 Serviços · H4 Na prática · H5 Plataforma · H6 Diferenciais · H7 50 anos · H8 Setores · H9 Compromisso · H10 Orçamento · Rodapé |
| `/institucional/` | `institucional` | Institucional: Protecin desde 1976 | A história da Protecin de 1976 a 2024, missão, visão, valores, política ambiental e o Kids ONG. | PageHero · Historia `completa` · MissaoVisaoValores · Sustentabilidade · Compromisso `kids` · FaixaCta |
| `/servicos/` | `servicos` | Serviços de engenharia, inspeção e manutenção contra incêndio: Protecin | Instalação de sistemas, projetos técnicos com ART, regularização de AVCB, inspeções, manutenção, gestão de riscos, venda de equipamentos e sinalização. | PageHero · Diagrama · Capitulos · Fitas · FaixaAvcb · FaixaCta |
| `/nossos-clientes/` | `clientes` | Nossos clientes e parcerias: Protecin | Setores atendidos, autorizações Kidde Brasil, Everlux, Notifier e Simplex, e filiações técnicas. | PageHero · ClientesEscala · SetoresEmpilhados · Parceiros (com reservado `clientes`) · FaixaCta |
| `/catalogo-digital/` | `catalogo` | Catálogo Digital Protecin | Baixe o Catálogo Digital Protecin com serviços, produtos, tecnologias e diferenciais. | CatalogoCapa · LinhaEquipamentos · FaixaCta |
| `/nosso-app/` | `app` | Protecin App: gestão inteligente de inspeções | App de Coleta, Web Master e Processador de Coleta Online: inspeções de extintores e hidrantes conforme NBR 12962 e NBR 12779. | AppHero · ComoFunciona · Plataforma `app` · Recursos · TelasReais · AppFecho · FaixaCta |
| `/contato/` | `contato` | Contate a Protecin | Telefone +55 11 4977-8720, WhatsApp, comercial@protecin.com.br. Rua Lacônia, 600, Santo André - SP. Segunda a sexta, 8h às 17h30. | ContatoAbertura · Orcamento `contato` · Mapa |
| `/creditos/` | `creditos` | Créditos de imagens e vídeos: Protecin | Fontes e autores das fotos e vídeos ilustrativos usados no site. (`noindex`) | Creditos |
| `404.html` | `404` | Página não encontrada: Protecin | (sem; `noindex`) | NotFound |

**Head por rota** (`head(url)` no `entry-server`):
- `title`, `description` e `canonical` (`https://protecin.com.br<rota>`, o domínio de produção);
- `og:title`, `og:description`, `og:image` (`assetUrl("og-protecin.jpg")`, absoluto), `og:type=website`, `og:locale=pt_BR` e `twitter:card=summary_large_image`;
- `theme-color` `#050A12`, `format-detection telephone=no`, `geo.region` `BR-SP`, `geo.placename` "Santo André".
- O `<html lang="pt-BR">` vem do template.

**JSON-LD** (`structuredData()`):
- `ProfessionalService` com:
  - `name: "Protecin"`, `legalName: "Protecin Proteção Técnica Contra Incêndio Ltda."`, `foundingDate: "1976"`;
  - telefone, e-mail e endereço (`PostalAddress` com a Rua Lacônia, 600);
  - `openingHours: "Mo-Fr 08:00-17:30"`, `areaServed: "BR"` e `sameAs` (Instagram e LinkedIn);
  - `hasOfferCatalog` com os 8 serviços.
- `WebSite`.
- Sem `FAQPage` (não há FAQ real).

---

## 9. Home `/`, seção por seção

Convenções das tabelas:
- **Entrada:** o que acontece quando o elemento entra na tela.
- **Rolagem:** o que fica ligado ao progresso; `p` é o progresso da cena (0 a 1, já suavizado).
- **Hover/toque:** a interação.

Tempo não escrito = o do preset (§5.2). "Tom" diz se a seção é escura, clara (papel), azul ou vermelha.

### H0. Abertura e símbolo (`#topo`, `sections/home/Abertura.tsx`, P0, tom escuro)

**Estrutura:**
- `PinStage mode="sempre" heightClassName="h-[220vh] lg:h-[260vh]"`.
- Camadas do palco:
  1. `DropWindow mode="fechar" range=[0.08,0.55]` com `LazyVideo id="hero"` (poster `hero-poster`, no celular `hero-poster-v`), D = `min(34vh,26vw)` no desktop, `36vw` no tablet e `40vw` no celular;
  2. `Embers density={60}` (27 no celular) e `veu-hero`;
  3. textos;
  4. grupo do símbolo (4 cantoneiras + manifesto).
- **Estático** (reduzido ou curto): hero de 100svh com o poster e o H1 parados. Abaixo, o símbolo montado (gota com o poster dentro, cantoneiras no lugar) e o manifesto aceso. O vídeo toca só pelo Play.

**Desktop (1440×900):**
- Bloco de texto alinhado à esquerda nas colunas 1–8, com o topo a 18vh.
- Canto inferior esquerdo: indicador "ROLE", uma linha de 48 px com um ponto que desce (3 ciclos de 1,8 s, depois para).
- Canto inferior direito: selo circular de 120 px com o texto em anel "50 ANOS · 1976–2026 ·" e o símbolo no centro.
- Fim da cena: o símbolo (2D) centrado em x 30% e o manifesto nas colunas 7–12.

**Celular (390×844):**
- Texto a 12svh: rótulo, H1 em 4 linhas (cerca de 52 px), parágrafo de 16 px e CTAs em coluna, com largura total. O primeiro CTA termina acima de 760 px.
- Sem selo.
- Fim da cena: símbolo a 14svh e manifesto embaixo.

**Conteúdo (`HERO`):**
- Rótulo: "ENGENHARIA E PROTEÇÃO TÉCNICA CONTRA INCÊNDIO · DESDE 1976".
- H1 "Protegendo vidas e patrimônios há 50 anos", em caixa alta, com "50" em `brasa-400`.
  - Linhas no desktop: `["Protegendo vidas","e patrimônios","há 50 anos"]`.
  - Linhas no celular: `["Protegendo","vidas e","patrimônios","há 50 anos"]`.
- Parágrafo literal de §2.1 (Hero, Texto), com ponto final.
- CTA 1: `OrcamentoCta formLocation="hero"` "Solicitar orçamento".
- CTA 2: `WhatsAppCta location="hero"` "Falar no WhatsApp".
- Link 3 (só desktop): `PhoneLink location="hero"` "+55 11 4977-8720".
- Manifesto (H2 da cena, `ScrollLitText` com o progress da cena): "Protegemos seu maior patrimônio: *a vida.*".
- Apoio: "Desde 1976, a Protecin oferece soluções técnicas em prevenção e combate a incêndios, protegendo vidas e patrimônios com tecnologia, equipe especializada e estrutura sólida."
- Rótulo final: "SANTO ANDRÉ/SP · DESDE 1976".

**Entrada (CSS, primeiro paint):**

| Elemento | Entrada | Tempo |
|---|---|---|
| Poster (LCP, `priority`) | `e-zoom` 1,08→1 | 900 ms em `--t0` |
| Véu e luz do ponteiro | `e-fade` | 600 ms em `--t0` |
| Rótulo mono | `e-sobe` (y 12) | 400 ms em `--t0` |
| H1, linhas | `e-linha` | 800 ms em `--t0 + 80/160/240(/320) ms` |
| "50" | scale 0,9→1 + cor `papel-50`→`brasa-400` (duas camadas cruzando opacidade) | 350 ms em `--t0 + 700 ms` |
| Parágrafo | `e-sobe` | 600 ms em `--t0 + 300 ms` |
| CTAs | `e-sobe` | 500 ms em `--t0 + 380/440 ms` |
| Indicador e selo | `e-fade`; o selo também com rotate -30°→0 | 400 ms em `--t0 + 600 ms` |
| Embers | canvas com opacidade 0→1 | 800 ms depois de montar |
| Vídeo | `LazyVideo when="idle"`, crossfade no `playing` | 600 ms |

**Rolagem (p do PinStage):**

| Elemento | Comportamento |
|---|---|
| Rótulo, parágrafo e CTAs | opacidade 1→0 e y 0→-6vh em p 0→0,15 |
| Linha i do H1 | y 0→-14vh e opacidade 1→0 em p (0,02+0,02i)→(0,22+0,02i) |
| Indicador e selo | opacidade 1→0 em p 0→0,08; o texto do selo gira com `rotate = scrollY*0.08` (sem rotação infinita) |
| `DropWindow` | scale S0→1 em p 0,08→0,55 (EASE_IN_OUT); a mídia interna faz 1/s e y 0→-4% |
| Véu | opacidade 1→0,35 em p 0,1→0,5 |
| Cantoneiras | de (±42vw, ±40vh) com rotate ±12° até (0,0) e rotate 0 em p 0,42→0,66; opacidade 0→1 em p 0,42→0,5 |
| Grupo do símbolo | desktop: x 0→-20vw em p 0,6→0,8; celular: y 0→-22svh |
| Manifesto | `acende` em p 0,64→0,9 |
| Apoio e rótulo final | opacidade 0→1 e y 20→0 em p 0,84→0,95 |
| Embers | translateY do canvas 0→-8vh |
| Luz do ponteiro (desktop) | segue o mouse (mola 60), só com p < 0,5 |

**Hover:** botões conforme §5.4. No selo, as cantoneiras do símbolo central fecham (200 ms).

**Vídeo:** toca enquanto o palco está na tela.

**Regra do H1 visível:** cada elemento de texto fica com opacidade 1 no começo da cena. O verify amostra a cena (§16) e cada texto precisa aparecer em alguma amostra.

### H1. Escala (`#numeros`, `sections/home/Escala.tsx`, P0, tom escuro)

**Estrutura:** `SectionRise`, com fundo `noite-950` e a `luz-brasa` no canto inferior esquerdo. Sem foto.

**Desktop:**
- Colunas 1–7: o número-título "20.000+" em `display-xxl` a 18vw (`stretch-62`) e, abaixo, "clientes atendidos" (`corpo-l`).
- Colunas 8–12: 4 linhas separadas por régua. Cada linha tem, no topo, uma **régua de 10 ticks** (o 5º e o 10º mais longos; enxerto D2), o número (`display-l`) e o rótulo (corpo, `papel-300`).

**Celular:** "20.000+" a 30vw e as 4 linhas em grade 2×2.

**Conteúdo (`NUMEROS`):**
- H2 (é o próprio número, `aria-label="Mais de 20.000 clientes atendidos"`): "20.000+" e "clientes atendidos".
- As outras 4 linhas:
  - "50": "anos de experiência (desde 1976)";
  - "3M+": "equipamentos manutenidos";
  - "5M+": "inspeções realizadas";
  - "250+": "obras de médio e grande porte realizadas".
- `SectionLabel index="01" label="Escala"`.

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Rótulo | `SectionLabel` | — | — |
| "20.000+" | `Odometer` (o "." e o "+" entram com `fade` depois dos dígitos) | y 6%→-6% (parallax pela seção) | — |
| "clientes atendidos" | `sobe` +300 ms | — | — |
| Réguas entre as linhas | `regua`, stagger 120 ms | — | — |
| Ticks | cada tick com scaleY 0→1, stagger 20 ms | — | a régua redesenha (400 ms) |
| Números 50, 3M+, 5M+ e 250+ | `Odometer`, stagger 120 ms entre linhas; sufixo em `brasa-400` com `carimbo` | — | desktop: o número vai a `brasa-400` e a linha desliza x 0→8 (200 ms) |
| Rótulos | `sobe`, stagger 120 ms | — | — |
| `luz-brasa` | opacidade 0→1 (600 ms) | opacidade 0,4→0,9 e scale 0,8→1,1 pela seção | — |

### H2. Credibilidade (`#autorizacoes`, `sections/home/Credibilidade.tsx`, P0, **tom claro**)

**Estrutura:** `SectionRise` com fundo `papel-50` e `.bg-blueprint-claro` esmaecido nas bordas.

**Desktop:**
- Topo: H2 `display-xl` em 3 linhas nas colunas 1–6; texto e 3 selos empilhados nas colunas 8–12.
- Duas fitas de logos sangrando a largura:
  - fita 1, "Autorizações oficiais": Kidde, Everlux, Notifier e Simplex, com o rótulo mono "AUTORIZADA" entre os logos, correndo para a esquerda;
  - fita 2, "Marcas com que trabalhamos": VESDA, Bosch, Firebee e Germek, com o rótulo "MARCA", correndo para a direita.
- Fim: bloco "Filiações técnicas" com 2 ladrilhos grandes (ABSpk e NFPA) e a legenda "Entidades do setor".

**Celular:** coluna única; fitas com 72 px de altura; ladrilhos 2 por linha.

**Conteúdo (`COMPROMISSO`, `SELOS`, `AUTORIZADAS`, `MARCAS`, `FILIACOES`):**
- `SectionLabel index="02" label="Credibilidade"`.
- Sobretítulo: "Compromisso com a Segurança e a Excelência".
- H2: "Décadas de experiência / na prevenção e / combate a incêndios".
- Texto: literal de §2.1 (Compromisso).
- Selos, só texto: "Equipe Técnica Qualificada" (`UserCheck`), "Alto Índice de Satisfação dos Clientes" (`ThumbsUp`) e "Cobertura Técnica em Território Nacional" (`MapPinned`).
- `aria-label` das fitas: "Autorizações oficiais: Kidde Brasil, Everlux, Notifier e Simplex" e "Marcas com que trabalhamos: VESDA by Xtralis, Bosch, Firebee e Germek Equipamentos".
- Logos em seção clara: as versões coloridas (Everlux em `logo-everlux`, a vermelha).

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Sobretítulo e H2 | `sobe`, `linha` | — | — |
| Texto | `sobe` +150 ms | — | — |
| Selos (3) | `monta`, stagger 60 ms; o ícone faz `traco` | — | o ícone redesenha |
| Fita 1 (`baseVelocity -1.2`) e fita 2 (`+1.2`) | a fita com `fade` e cada logo da primeira cópia com `virada`, stagger 50 ms | velocidade acelera e inverte com a rolagem | desktop: a fita para; o logo sai de `grayscale(1) opacity .72` para a cor original e ganha `FocusBrackets tone="claro"` (300 ms) |
| Ladrilhos ABSpk e NFPA | `virada`, stagger 100 ms | logo com parallax y 4%→-4% | cor e `FocusBrackets` |
| Linha de luz no topo | `regua` | — | — |

**Proposta:** logo depois desta seção, a página Home insere `<ReservedSlot id="clientes" />`.

### H3. Serviços (`#servicos`, `sections/home/Servicos.tsx`, P0, tom escuro)

**Estrutura:** cabeçalho em fluxo normal, depois 8 cartões `position: sticky` que se empilham, depois uma linha de CTA.

**Desktop:**
- Cabeçalho: rótulo e H2 `display-xl` à esquerda; subtítulo à direita.
- Cartão i: `sticky top: calc(96px + i*14px)`, altura 78vh, fundo `noite-800`, raio de 28 px, borda de 1 px `noite-700`.
  - Esquerda (colunas 1–5): número mono "01 / 08", ícone de 40 px, H3 `display-l`, resumo (`corpo-l`), descrição longa (corpo, `papel-300`), chips e 2 CTAs.
  - Direita (colunas 6–12): `CaptionedFigure credit="ilustrativa" creditPosition="sobre"` com raio de 20 px. O cartão 07 usa `LazyVideo id="extintor" when="active"`.

**Celular:**
- `sticky top: calc(72px + i*8px)`, altura mínima de 72svh.
- Ordem: imagem 16:10, número, H3, resumo e CTAs.
- A descrição longa e os chips ficam só no desktop; no celular, o link "Ver detalhes" leva a `/servicos/#<slug>`.

**Conteúdo:**
- `SectionLabel index="03" label="Serviços"`.
- H2: "Engenharia, inspeção / e manutenção".
- Subtítulo: "Em sistemas de prevenção e combate a incêndios. Da elaboração de projetos à gestão contínua dos equipamentos, oferecemos soluções completas para proteger pessoas, patrimônios e garantir a conformidade com normas técnicas e legais."
- Cartões: `SERVICOS` (§11), com o nome, o `resumo` (versão de /servicos), a `descricao` (versão da home, `null` quando não existe), os `chips` e a `imagem`.
- CTAs por cartão:
  - `WhatsAppCta location="servicos" detail={slug} message={WA.servico(nome)}` "Orçamento deste serviço";
  - `Link` "Detalhes" para `/servicos/#<slug>` (`pushEvent("service_open",{servico:slug, origem:"home"})`).
- Linha final: "Precisa de mais de um serviço? Monte sua solicitação." + `OrcamentoCta formLocation="servicos"`.

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Rótulo, H2 e subtítulo | `SectionLabel`, `linha`, `sobe` +150 ms | — | — |
| Cartão i | y 80→0 e opacidade 0,6→1 ao entrar | quando o cartão i+1 sobe por cima, o cartão i faz scale 1→0,94 e o véu interno `noite-950` vai de 0→0,55, pelo progresso do cartão seguinte (`["start end","start start"]`). O texto nunca vai a opacidade 0 | desktop: borda `brasa-400/60` |
| "0i / 08" | `Odometer` de 2 dígitos quando o cartão fixa | — | — |
| Ícone | `traco` quando o cartão fixa | — | redesenha no hover do cartão |
| H3 | `palavra` | — | — |
| Resumo e descrição | `sobe` +100 e +200 ms | — | — |
| Chips | `monta`, stagger 50 ms | — | — |
| Mídia | `cortina` (900 ms) | `ParallaxMedia amount={8}` interno | scale 1,04→1,08 e `FocusBrackets mode="hover"` |
| Vídeo do 07 | — | `active` só enquanto o cartão 07 é o de cima e está na tela | — |
| CTAs | `sobe`, stagger 60 ms | — | §5.4 |

**Estático:** cartões em fluxo, sem sticky, sem scale e sem véu.

### H4. Na prática (`#na-pratica`, `sections/shared/NaPratica.tsx`, P0, tom escuro)

**A cena:** a foto real `obra-parede-sistemas` (de `4.jpg`, 2592×1944, 4:3) cobre o palco, e uma "câmera" viaja por 5 pontos dela.

**Estrutura:** `PinStage mode="sempre" heightClassName="h-[260vh] lg:h-[320vh]"`.
- **Camada câmera** (`data-pin-layer`): um `div` com a proporção da foto (4:3), dimensionado para cobrir o palco. Largura = `max(100vw, 100svh*4/3)` e altura = largura·3/4, centrado. Os pontos ficam em % desse `div`, então a posição bate com a foto em qualquer tela.
- **Tratamento estático:** `filter: contrast(1.08) saturate(0.92)` e véu `radial-gradient(transparent 40%, rgba(5,10,18,.85))`.

**Desktop:**
- Canto superior esquerdo: rótulo e H2.
- Por ponto: um marcador (anel de 44 px com o miolo `brasa-400`), uma linha-guia SVG e um cartão de legenda de 360 px (`noite-900/92`, borda `noite-700`) ancorado do lado oposto ao ponto.
- Canto inferior direito: o contador mono "01 / 05" (`Reel`).
- Canto inferior esquerdo: o crédito "FOTO DO ACERVO PROTECIN".

**Celular:** a foto cobre o palco (o `object-position` acompanha o ponto ativo) e o cartão de legenda vira uma folha inferior fixa no palco, com cerca de 34svh de altura e `Reel` dos 5 textos. Os marcadores ficam sobre a foto.

**Conteúdo (`NA_PRATICA`):**
- `SectionLabel index="04" label="Na prática"`.
- H2: "Uma parede. / Cinco frentes de serviço."
- Legenda: "Foto do acervo Protecin. Extintor com etiqueta PROTECIN."
- Pontos (% da foto):

| # | Ponto (x; y) | Título | Texto | Serviço ligado |
|---|---|---|---|---|
| 1 | Placa SAÍDA (56,8; 41,3) | Sinalização de Segurança | "Implementação de sinalizações fotoluminescentes, orientativas, de emergência e salvamento conforme normas." | `sinalizacao-de-seguranca` |
| 2 | Extintor etiquetado (58,0; 59,3) | Inspeções e Manutenções Preventivas | "Inspeções periódicas, testes hidrostáticos, manutenção em campo, repintura, limpeza e adequação técnica conforme exigências das NBRs e legislação vigente." | `inspecoes-e-manutencoes-preventivas` |
| 3 | Painel de alarme (30,3; 55,2) | Sistemas de alarme | "Implantação de sistemas fixos e equipamentos contra incêndio com tecnologia atualizada, equipe especializada e componentes certificados." | `instalacao-de-sistemas-e-equipamentos` |
| 4 | Abrigo de mangueira e hidrante (75,9; 74,0) | Hidrantes e mangueiras | "Equipamentos homologados e manutenção certificada pelo INMETRO, com rastreabilidade e garantia." | `manutencao-de-equipamentos` |
| 5 | Tubulação vermelha (50,0; 30,3) | Sistemas fixos | "Soluções completas e personalizadas para implantação de sistemas fixos e equipamentos de combate a incêndio, com segurança e rastreabilidade." | `instalacao-de-sistemas-e-equipamentos` |

(No ponto 2, o "da NBRs" do site vira "das NBRs", correção de concordância.)

**Bloco dos cilindros** (depois da cena, sem fixação):
- `CaptionedFigure` de `obra-cilindros-supressao` na proporção nativa 16:9 (para as chamadas baterem), com largura total e raio de 28 px. Legenda "Bateria de cilindros de sistema fixo de supressão." e crédito acervo.
- Por cima: "250+" (`Odometer`, `display-xl`) e "obras de médio e grande porte realizadas".
- **Chamadas desenhadas** (enxerto D2, % da foto): "Cilindros numerados" (72,5; 80), "Válvulas com manômetro" (51; 57), "Coletor e tubulação" (45; 29) e "Mangueiras de conexão" (27; 42).
- Depois: `<ReservedSlot id="obras" />`.

**Coreografia da cena:**

| Elemento | Entrada / rolagem | Hover/toque |
|---|---|---|
| Câmera | Cada ponto k tem a janela p [k/5, (k+1)/5]. Vai de scale 1,0 (visão geral em p 0 a 0,08) para scale 1,9 centrada no ponto, com `x = (50-px)*1.9%` e `y = (50-py)*1.9%`, interpolada por EASE_IN_OUT entre os pontos. Volta a 1,0 em p 0,92→1 | — |
| Marcador do ponto ativo | anel com `traco` (300 ms), miolo com `carimbo` e o anel pulsa 2 vezes (scale 1→1,8, opacidade 0,6→0). Inativo: opacidade 0,5 e anel desenhado | clique ou toque leva até o ponto (`scrollToProgress`) e dispara `pushEvent("hotspot_open",{ponto})` |
| Linha-guia | `DrawPath` com `progress`, no começo da janela do ponto | — |
| Cartão de legenda | desktop: um cartão só, com `Reel` vertical dos 5 textos (`SPRING.pilula`), que troca de lado por mola | — |
| Título do cartão | `SplitWords replayKey={ponto}` | — |
| Contador | `Reel` | — |
| Rótulo e H2 | `sobe` e `linha`; em p 0,1→0,2 vão a opacidade 0,4 (nunca 0) | — |

**Coreografia do bloco dos cilindros:**
- foto com `cortina` e `ParallaxMedia amount={6}`;
- "250+" com `Odometer` e legenda com `sobe`;
- cada chamada, com 40% da foto visível: ponto com `carimbo` e 1 pulso, fio em polilinha de 2 segmentos desenhado em 500 ms (EASE_IN_OUT) e rótulo mono com `TextScramble`, stagger 180 ms;
- hover numa chamada: ponto em scale 1,4, fio a 2 px `brasa-400`, as outras a 50% e a foto em scale 1,04 com origem no ponto.

**Estático:** foto inteira com os 5 marcadores numerados fixos e os 5 cartões em lista abaixo dela.

### H5. Plataforma (`#plataforma`, `sections/shared/Plataforma.tsx`, P0, tom azul)

Prop `variant?: "home" | "app"`. Em `app` não há a gota de abertura, porque a página já é azul.

**Estrutura:**
- **Abertura (home):** `DropWindow mode="abrir" from={0.45}` com `mundo-azul` + `.bg-blueprint`, crescendo do centro até cobrir a tela enquanto a seção sobe (`["start end","start start"]`).
- **Cena:** `PinStage mode="sempre" heightClassName="h-[300vh] lg:h-[360vh]"`, com 4 pilares de p 0,25 cada.

**Desktop:**
- **Colunas 1–5:**
  - rótulo, sobretítulo, H2 e o mono "SOFTWARE PRÓPRIO DESDE 2021";
  - lista dos 4 títulos de pilar (`titulo`, com número mono);
  - janela de detalhe com 7 linhas de altura e `Reel` dos 4 parágrafos;
  - trilho de progresso em 4 segmentos;
  - CTAs.
- **Colunas 6–12, palco:**
  - `PhoneMock` 300×620 (moldura CSS: raio de 44 px, borda de 10 px `#0B0F15`, ilha de 90×26);
  - notebook `app-webmaster-notebook` (760 px, com alfa);
  - nó **"Processador de Coleta Online"** (enxerto D2): retângulo com raio de 10 px, ícone `Server` e rótulo mono, entre os dois, ligado por um path SVG curvo;
  - cartão de vídeo `LazyVideo id="tablet"` (320×200, raio de 20 px, inclinado -4°) com o crédito "IMAGEM ILUSTRATIVA".

**Celular:**
- Metade de cima do palco: o celular em 46svh. No pilar 02, o notebook aparece atrás, com 60% da largura.
- Metade de baixo: título do pilar ativo (`Reel`), parágrafo (`Reel`), segmentos e CTAs.
- A lista dos 4 títulos vira "01/04".
- Sem o vídeo.

**Conteúdo (`PLATAFORMA`):**
- `SectionLabel index="05" label="Plataforma"`.
- Sobretítulo: "Tecnologia a favor da segurança e da gestão".
- H2: "Plataforma / exclusiva Protecin".
- Apoio: "Monitoramento inteligente e gestão eficiente onde você estiver."
- Pilares (texto literal de §2.1, Plataforma): 01 Aplicativo para Técnicos · 02 Painel Web para Gestores · 03 Recursos Inteligentes · 04 Benefícios para o Cliente.
- Selo: "100% conforme NBR 12962 · NBR 12779".
- Chips do pilar 04: "Menos erros e retrabalho" · "Relatórios rápidos" · "Transparência total" · "Rastreabilidade de ponta a ponta".
- CTAs:
  - `Link` "Conhecer o Protecin App" para `/nosso-app/` (na variante `app`, esse CTA vira `OrcamentoCta formLocation="plataforma"`);
  - `WhatsAppCta location="plataforma" message={WA.plataforma}` "Quero ver a plataforma".

**Telas do `PhoneMock`** (`Reel` horizontal de 4 telas, `sections/shared/plataforma/Telas.tsx`):
1. **Splash:** `Img id="app-splash"` (real).
2. **Ordens (HTML):**
   - cabeçalho `marinho-700` com o wordmark negativo e os ícones `Search`, `ScanLine` e `Bell`;
   - 3 cartões, cada um com "Nº da Ordem" (barra borrada no lugar do número), "Nome do Cliente" (barra borrada), "Localização · Ver no mapa", "Quantidades de Equipamentos: Total 3 (1 extintor e 2 hidrantes)" e "Andamento da vistoria: 1 de 3" com barra de progresso.
3. **Offline (HTML):** `WifiOff` com "Sem internet", a lista "Aplicação de questionários técnicos" com 4 itens marcando `Check`, depois `RefreshCw` e "Sincronizado".
4. **Relatório (HTML):** cartão "Relatório de inspeção" com `FileCheck2` e "Envio automático de relatórios por e-mail".

| Elemento | Entrada | Rolagem (`l` = progresso local do pilar) | Hover/toque |
|---|---|---|---|
| Gota azul | — | cresce de 0,45·D até cobrir a tela conforme a seção sobe | — |
| Grade de prancheta | `fade` | deriva translateY 0→-120 px (CSS scroll-driven) | — |
| Rótulo, sobretítulo, H2 e mono | `sobe`, `sobe`, `linha` (quando a gota passa de 60%) e `TextScramble` | — | — |
| Lista de pilares | `sobe`, stagger 60 ms | ativo = `floor(p*4)`. O ativo fica com opacidade 1, x 0 e barra `brasa-400` de 3 px (scaleY 0→1, 350 ms); os inativos ficam em 0,45 | desktop: o clique rola até o pilar (`scrollToProgress`) e dispara `platform_step` |
| Parágrafo | — | `Reel` por estado | — |
| Trilho | `regua` | o segmento ativo enche com scaleX = l; os anteriores ficam cheios | — |
| PhoneMock | y 120→0 e rotate 6°→0 (800 ms) | `Reel` das telas: splash em p < 0,06, ordens nos pilares 01 e 02, offline no 03 e relatório no 04 | `TiltCard` (desktop) |
| Pilar 01 | os 3 cartões de ordem entram com `monta` | a barra "Andamento" do 1º cartão faz scaleX 1/3→3/3 por `l`, e o texto troca "1 de 3"→"2 de 3"→"3 de 3" em l 0,33 e 0,66 (`Odometer trigger="value"`) | — |
| Cartão de vídeo | `cortina` | `active` só no pilar 01; nos outros fica parado (não some) | — |
| Pilar 02 | — | notebook: x 40%→0, rotateY -14°→0 (`perspective 1600`) e opacidade 0,3→1 em l 0→0,35. Celular: x 0→18% e scale 1→0,82. A linha tracejada notebook→processador→celular desenha (`DrawPath`) em l 0,3→0,6. O chip "Ordem de serviço" anda pela linha em l 0,5→0,9 (100 pontos pré-calculados com `getPointAtLength`). Em l 0,9 desce no celular o banner "Nova ordem de serviço" (y -100%→0, 350 ms) | — |
| Pilar 03 | — | o notebook recua (scale 0,9, opacidade 0,5). O processador acende (borda `brasa-400`). `DataPacket` ×3 (pontos de 4 px `brasa-400`, `offset-distance 0→100%`, 1200 ms linear, stagger 300 ms) correm celular→processador→notebook em loop **só enquanto o pilar está ativo e na tela**. Tela offline: os `Check` desenham por `l`; o `RefreshCw` gira 360° uma vez (600 ms) em l 0,7; o `StampBadge` NBR carimba em l 0,5 | — |
| Pilar 04 | — | tela de relatório. O cartão "Relatório de inspeção" sai do celular (y 0→-40, x 0→120, rotate 6°) em l 0,2→0,5. Os 4 chips entram com `monta` em l 0,5, stagger 60 ms | — |
| CTAs | `sobe` | sempre visíveis no palco | §5.4 |

Nenhum pilar, tela ou parágrafo vai a opacidade 0: saem por translação dentro do recorte ou ficam com opacidade mínima de 0,4.

**Estático:** dispositivos parados (celular na tela de ordens e notebook ao lado) e os 4 pilares em lista, com o selo e os chips visíveis.

### H6. Por que a Protecin (`#diferenciais`, `sections/home/Diferenciais.tsx`, P1, **tom claro**)

**Desktop:**
- Coluna esquerda (colunas 1–5), `sticky top-24`:
  - número gigante "01"→"04" (`Reel`, `display-xxl`, contorno `.text-outline-claro` com cópia preenchida `brasa-500` por baixo);
  - ícone de 160 px (traço 1.25) que troca e se desenha.
- Coluna direita (colunas 7–12): 4 blocos com altura mínima de 70vh, cada um com H3 `display-l` e texto (`corpo-l`, `grafite-600`).

**Celular:** sem sticky. Cada bloco tem ícone de 56 px, número mono, H3 e texto.

**Conteúdo:**
- `SectionLabel index="06" label="Por que a Protecin"`.
- H2: "Por que a Protecin".
- `DIFERENCIAIS`: os 4 cards de §2.1 com o texto literal. Ícones: `Headset`, `MonitorCog`, `ShieldCheck` e `HardHat`.

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| H2 | `palavra` | — | — |
| Bloco i | `sobe` | ativo por `useInView(margin "-45% 0px -45% 0px")`: H3 e texto com opacidade 1. Inativos: H3 a 0,4 e texto a 0,55, sempre com contraste ≥ 4,5:1 (400 ms) | — |
| Número gigante | `fade` | `Reel` pelo bloco ativo | — |
| Ícone gigante | `traco` | `Reel` vertical junto com o número; ao chegar, refaz o `traco` (600 ms) | — |
| Régua entre blocos | `regua` | — | — |

### H7. 50 anos (`#historia`, `sections/shared/Historia.tsx`, P0, tom escuro `noite-900`)

Prop `variant?: "home" | "completa"`. Na `completa` (Institucional), o H2 muda e o painel 2026 leva CTA de página interna.

**Desktop (`PinStage mode="pin"`; altura `100vh + distância`, medida por ResizeObserver e `document.fonts.ready`):**
- Canto superior esquerdo: rótulo e H2. Canto superior direito: o ano ativo num `Odometer trigger="value"` mono de 28 px.
- Trilho com 10 painéis de 38vw (mínimo de 520 px) e 8vw de recuo inicial. Cada painel tem:
  - o ano gigante (`display-xxl` a 14vw, `.text-outline`) com a cópia preenchida `brasa-400` por cima;
  - um rótulo mono;
  - o texto (corpo, no máximo 34ch).
- Faixa inferior, a 82% da altura: trilho de 2 px `noite-600` em todo o comprimento, preenchido por uma linha `brasa-500` (scaleX = progresso), com um nó de 12 px no início de cada painel.
- `x` do trilho = `useTransform(progress, [0,1], [0, -distância])`.

**Celular, tablet, curto e reduzido (`data-pin="off"`, layout por CSS, um DOM só):**
- Lista vertical com o trilho à esquerda (x = 24 px), que enche com scaleY pelo progresso da seção (`["start 70%","end 70%"]`).
- Cada item tem o ano em `display-l` (64 px), o rótulo e o texto.
- O nó acende quando o item cruza o centro (`useInView`, margem -45%).

**Conteúdo (`TIMELINE`):**
- `SectionLabel index="07" label="50 anos"`.
- Sobretítulo: "Nossa História".
- H2: "Tradição e inovação / que evoluem juntos". Na variante `completa`: "Nossa História: tradição e inovação que evoluem juntos".
- 9 marcos com o texto literal de §2.2 (1976 a 2024).
- Rótulos mono editoriais (não são fatos novos):

| Ano | Rótulo |
|---|---|
| 1976 | FUNDAÇÃO |
| 1986 | NOVA FASE |
| 2004 | NOVA SEDE |
| 2006 | TALENTOS |
| 2009 | 10 ESTADOS |
| 2012 | CRESCIMENTO |
| 2015 | PROTECIN ENGENHARIA |
| 2021 | SOFTWARE PRÓPRIO |
| 2024 | TECNOLOGIA |

- Painel final 2026, rótulo "50 ANOS":
  - texto "50 anos protegendo vidas e patrimônios.";
  - `OrcamentoCta formLocation="historia"` e `WhatsAppCta location="historia"`.
- Imagens:
  - no painel 1976, o `Symbol` de 72 px (`mode="montar"` ao ativar);
  - no painel 2021, `app-login-celular` de 180 px flutuando.
  - Os outros painéis são só tipografia, porque não existe foto histórica.

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Rótulo e H2 | `SectionLabel`, `linha` | fixos no palco | — |
| Trilho | — | x por progresso suavizado | — |
| Ano (contorno) | — | parallax próprio x 0%→-15% do painel (0,85× a velocidade do trilho) | — |
| Ano (preenchido) | — | opacidade 0→1 (300 ms) quando o centro do painel passa de 55% da tela, e **fica** preenchido. No fim, todos estão preenchidos | — |
| Rótulo e texto do painel | `sobe` ao ativar (uma vez) | — | — |
| Linha de progresso | — | scaleX = progresso | — |
| Nó | — | ao ser alcançado: `carimbo` e camada de brilho com opacidade 0→1 | os nós são botões que rolam até o ano (`scrollToProgress`) |
| Ano ativo | — | `Odometer` de 4 dígitos com o ano do painel ativo; ao chegar a 2026, `pushEvent("timeline_complete")` uma vez por sessão | — |
| Celular do 2021 | `sobe` | y 0→-10% | — |

Antes da seção vai o link "Pular a linha do tempo", visível só com foco, que leva a `#setores` (`#social` na variante `completa`). A marcação é `<ol>` com cada marco num `<li>` e o ano como `<h3>`.

### H8. Setores (`#setores`, `sections/home/Setores.tsx`, P1, tom escuro)

**Desktop:**
- H2 e texto no topo.
- Abaixo, 3 linhas tipográficas gigantes (`display-xl`, largura total), separadas por réguas. Cada linha é um botão de acordeão (`aria-expanded`) que abre o texto do setor em 2 colunas.
- `CursorPreview` com a imagem do setor no hover da linha.

**Celular:** cada linha tem uma miniatura 16:9 sempre visível acima do nome, o nome em `display-l` e um toque que abre o texto.

**Conteúdo (`SETORES`):**
- `SectionLabel index="08" label="Setores"`.
- Sobretítulo: "Presença sólida e confiável em empresas de alto padrão".
- H2: "Atendemos líderes de mercado / em diferentes setores".
- Texto literal de §2.4.
- Linhas: "Financeiro, Tecnologia e Saúde", "Industrial e Agronegócio" e "Energia e Transporte", cada uma com o texto literal de §2.4 e as imagens `setor-*`.
- Link: "Ver clientes e parcerias", para `/nossos-clientes/`.

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Sobretítulo, H2 e texto | `sobe`, `linha`, `sobe` | — | — |
| Réguas | `regua`, stagger 120 ms | — | — |
| Nome do setor | `linha` | x 4%→-4%, alternando o sentido por linha | desktop: x +24 px, cor `papel-50`→`brasa-400` (200 ms) e `CursorPreview` |
| Ícone + / × | `fade` | — | gira 135° ao abrir (350 ms) |
| Texto aberto | altura 0→auto (400 ms, EASE_OUT, por ação do usuário) e itens com `sobe`, stagger 60 ms. O conteúdo fica sempre no DOM | — | `pushEvent("sector_open",{setor})` |
| Miniatura (celular) | `cortina` | `ParallaxMedia amount={6}` | — |

### H9. Compromisso (`#social`, `sections/shared/Compromisso.tsx`, P1, **tom claro**)

Prop `variant?: "home" | "kids"`. Na `kids` (Institucional) ficam só o letreiro e a Kids ONG, porque a Sustentabilidade tem seção própria.

**Desktop:**
- Letreiro de 4 linhas em `display-xl` (largura total) com `acende`.
- Abaixo, 2 colunas:
  - colunas 1–6, Kids ONG: logo de 120 px, a colagem `kids-ong-colagem` (rostos já borrados; nunca desfocar menos) e o texto;
  - colunas 7–12, Sustentabilidade: `institucional-maos` (recorte transparente) flutuando e o texto.

**Celular:** letreiro (cerca de 44 px), depois os blocos em coluna.

**Conteúdo (`SOCIAL`):**
- `SectionLabel index="09" label="Compromisso"`.
- Sobretítulo: "Nosso compromisso vai além da segurança técnica".
- Letreiro (H2): "Cuidar de *vidas* / também é / transformar / *futuros*".
- Kids ONG: texto literal de §2.2, com "sete anos" e "fundador" como estão.
- Sustentabilidade: título "Cuidar também é prevenir." e texto literal de §2.2.
- Link: "Conheça nossa história", para `/institucional/`.
- Depois da Kids ONG: `<ReservedSlot id="depoimentos" />`.

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Sobretítulo | `sobe` | — | — |
| Letreiro | — | `acende` por palavra (`["start 80%","end 45%"]`); "vidas" e "futuros" acendem em `brasa-500` | — |
| Logo Kids ONG | `carimbo` | — | — |
| Colagem | `CaptionedFigure credit="acervo" reveal="cortina" parallax={6}`, com a legenda "Ações do Kids ONG. Rostos borrados para preservar as crianças." | — | — |
| Mãos com muda | `sobe` | y 8%→-8% e rotate -2°→2° | — |
| Textos | `sobe`, stagger 80 ms por parágrafo | — | — |

### H10. Orçamento (`#orcamento`, `sections/shared/Orcamento.tsx`, P0, tom vermelho)

Prop `variant?: "home" | "contato"`. Na `contato` não há gota, letreiro nem vídeo: é um fundo `noite-900` simples.

**Estrutura (home):**
- `DropWindow mode="abrir"` com `mundo-vermelho`, a gota vermelha crescendo até cobrir a tela conforme a seção sobe.
- Por cima:
  - `LazyVideo id="fogo" when="near"`, **só no desktop com vídeo permitido**, em `mix-blend-mode: screen` com opacidade 0,35;
  - `Embers density={90}` (40 no celular) e a `luz-brasa` grande vinda de baixo.

**Desktop:**
- Topo: letreiro gigante "SOLICITAR ORÇAMENTO" (`display-xxl` a 16vw, `brasa-500` a 85%, `mix-blend-mode: screen`), numa linha só, decorativo (`aria-hidden`).
- Colunas 1–5: rótulo, H2, texto e canais (`sections/shared/orcamento/Canais.tsx`).
- Colunas 7–12: cartão do formulário (`noite-900`, borda `noite-700`, raio de 28 px, padding de 40 px, altura fixa de 640 px).

**Celular:** letreiro em 2 linhas a 22vw, depois H2, formulário e canais.

**Conteúdo (`CONTATO`):**
- `SectionLabel index="10" label="Orçamento"`.
- H2: "Precisa de uma proposta, agendar uma visita ou tirar dúvidas?"
- Texto: "Nossa equipe está pronta para atender com agilidade e atenção técnica. Preencha o formulário ou utilize os canais abaixo para falar com a gente."
- Canais (cada um é uma linha clicável com ícone, rótulo mono e valor):
  - WhatsApp "+55 11 94565-1751" (`WhatsAppLink location="orcamento"`);
  - Telefone "+55 11 4977-8720" (`PhoneLink location="orcamento"`);
  - E-mail "comercial@protecin.com.br" (`EmailLink location="orcamento"`);
  - Endereço "Rua Lacônia, 600, Parque Capuava, CEP 09271-010, Santo André - SP", com o link "Como chegar" (`COMPANY.mapsDirections`, `pushEvent("map_directions_click")`);
  - Horário "Segunda a sexta, 8h às 17h30".
- Na variante `contato`, os canais usam `location="pagina_contato"` e incluem falecom@protecin.com.br.

| Elemento | Entrada | Rolagem | Hover/toque |
|---|---|---|---|
| Gota vermelha | — | cresce até cobrir a tela conforme a seção sobe | — |
| Letreiro | — | x 10%→-10% pela seção | — |
| `luz-brasa` | — | scale 0,6→1,1 e opacidade 0,4→0,9 | — |
| Vídeo de fogo | crossfade no `playing` | pausa fora da tela | — |
| Embers | opacidade 0→1 | pausa fora da tela; `repel` (P1) | — |
| Rótulo, H2 e texto | `SectionLabel`, `palavra`, `sobe` | — | — |
| Canais | `sobe`, stagger 60 ms; ícone com `traco` | — | desktop: seta x 0→6 e sublinhado (200 ms) |
| Cartão do formulário | `cortina` vindo de baixo (900 ms) | — | — |
| Campos | `sobe`, stagger 50 ms | — | §5.4 e `FocusBrackets` no foco |

### H10.1 `OrcamentoForm` ("Monte sua solicitação", `sections/shared/orcamento/OrcamentoForm.tsx`, P0)

**Três etapas no mesmo cartão:**
- **Barra de etapas:** 3 segmentos que enchem com scaleX (350 ms) e o rótulo mono "ETAPA 1 DE 3".
- **Troca de etapa:** a atual sai com x 0→-40 e opacidade 1→0 (250 ms, EASE_IN) e a nova entra com x 40→0 e opacidade 0→1 (350 ms, EASE_OUT). A altura é fixa no desktop para não pular.

**Etapa 1, "O que você precisa?":** `ChipToggle` multisseleção com os 8 `SERVICOS[].nome` e "Ainda não sei". Botão "Continuar", que só habilita com 1 chip.

**Etapa 2, "Sobre o local":** chips de seleção única com `SETORES_FORM` (Financeiro · Tecnologia · Saúde · Industrial · Agronegócio · Energia · Transporte · Outro) e o campo "Cidade / UF". Botões "Voltar" e "Continuar".

**Etapa 3, "Seus dados":**
- Campos:
  - Nome* (`autocomplete="name"`);
  - Empresa (opcional);
  - E-mail* (`type="email"`);
  - Telefone* (`inputmode="tel"`), com máscara "(11) 99999-9999" enquanto digita e pelo menos 10 dígitos (`mascara.ts`);
  - Mensagem (opcional, 3 linhas).
- Placeholders, sem e-mail fictício: "Seu nome", "Nome da empresa", "Seu e-mail", "(DDD) número" e "Conte o que precisa".
- Anti-spam do Seven: `_honey` fora da tela e tempo mínimo de 1,5 s.
- Botão primário "Enviar solicitação".
- Botão `WhatsAppLink location="formulario" detail={slugs}` "Enviar pelo WhatsApp", com o `href` montado ao vivo: "Olá! Vim pelo site da Protecin. Serviços: {lista}. Setor: {setor}. Cidade: {cidade}. Nome: {nome}. Empresa: {empresa}." Os campos vazios saem da frase.

**Validação** (ao sair do campo e ao enviar), em `brasa-300` com `CircleAlert`:
- Mensagens: "Informe seu nome.", "Informe um e-mail válido." e "Informe um telefone com DDD."
- O erro entra com y -4→0 e opacidade 0→1 (200 ms), e o campo inválido treme uma vez (x 0→-6→6→0, 300 ms).

**Estados:**
- **Enviando:** o botão mostra "Enviando…" com um anel girando (só enquanto envia) e fica desabilitado.
- **Sucesso:**
  - bloco `.msg-sucesso` **sem animação de opacidade no wrapper** (o GTM mede a visibilidade); entra com y 16→0 e scale 0,98→1 (350 ms);
  - o `Check` faz `carimbo` dentro de um círculo `marinho-700`;
  - texto: "Recebemos sua solicitação. Nossa equipe comercial retorna em horário de atendimento (segunda a sexta, 8h às 17h30)."
- **Erro:** "Não conseguimos enviar agora." com os links de reserva `mailto:` (resumo no corpo) e WhatsApp.

**Envio:**
- **Na demo** (`IS_DEMO`): **não envia nada**. Simula 1,2 s e mostra o sucesso com a linha extra "Demonstração: na versão publicada, este envio chega a comercial@protecin.com.br." Assim a Protecin não recebe o e-mail de ativação do FormSubmit antes de aprovar a proposta.
- **Em produção:** FormSubmit (`https://formsubmit.co/ajax/comercial@protecin.com.br`), com o código do `ContactForm` do Seven (timeout de 15 s; sucesso só com `success === true || "true"`).

**Eventos:**
- `form_open` (foco no 1º campo ou chegada por `OrcamentoCta`);
- `form_step {step}`;
- `form_lead {servicos, setor, cidade, demo}` no sucesso, mais `trackLead("email","formulario","orcamento")`.

**Pré-seleção:** `?servico=<slug>` na URL ou o evento `pt:servico` marca o chip.

---

## 10. Páginas internas

Toda página interna termina com `FaixaCta` (menos Contato, Créditos e 404) e o `Footer`. Os rótulos de seção recomeçam em "01" em cada página.

### 10.1 `/institucional/`

| Seção | Arquivo | Conteúdo | Composição e motion |
|---|---|---|---|
| **PageHero** | `components/layout/PageHero.tsx` (`page="institucional"`) | Trilha "INSTITUCIONAL". H1 `["Desde 1976,","prevenção e engenharia","de combate a incêndios"]`. Subtítulo: "Com sede em Santo André (SP), oferecemos projetos, instalação de sistemas, manutenção e uma plataforma digital exclusiva para gestão técnica de extintores e hidrantes." Imagem `institucional-pilar`. `WhatsAppCta location="pagina_institucional"` | §7.9 |
| **Historia `completa`** | `sections/shared/Historia.tsx` | §9 H7 | §9 H7 |
| **MissaoVisaoValores** (`#valores`) | `sections/institucional/MissaoVisaoValores.tsx` | Título: "O que nos move, inspira e sustenta nosso compromisso com a segurança". Intro, Missão, Visão e os 6 Valores, literais de §2.2. Imagem `institucional-compromisso` (mãos empilhadas, ilustrativa) | **Tom claro.** Desktop: Missão e Visão como duas declarações grandes (`display-l`, colunas 1–6 e 7–12) com rótulo mono "NOSSA MISSÃO" / "NOSSA VISÃO", reveladas por `linha` com 200 ms entre as duas e uma régua vertical entre elas (`Rule axis="y"`). Valores numa lista numerada 01–06 (`titulo`): cada linha acende ao cruzar o meio da tela (opacidade 0,45→1, número mono `brasa-500` e `regua`). À direita da lista, a imagem em `CaptionedFigure credit="ilustrativa" parallax={8}`. Hover num valor: `TextRoll`. Celular: coluna única, o mesmo motion |
| **Sustentabilidade** (`#sustentabilidade`) | `sections/institucional/Sustentabilidade.tsx` | "Cuidar também é prevenir." + texto literal de §2.2 + a linha "Política de Preservação Ambiental desde 2004" (fato do marco de 2004) | Fundo `institucional-paisagem` (opacidade 0,35, `ParallaxMedia amount={12}`, véu `noite-950/70`, crédito ilustrativa no canto). Frase em `display-xl` com `palavra`; texto em cartão `noite-900/80` com `cortina`; `institucional-maos` flutua (y 8%→-8%). 110vh no desktop e 90svh no celular |
| **Compromisso `kids`** (`#kids-ong`) | `sections/shared/Compromisso.tsx` | §9 H9 | §9 H9 |
| **FaixaCta** | `components/layout/FaixaCta.tsx` (`page="institucional"`) | §7.10 | §7.10 |

### 10.2 `/servicos/`

| Seção | Arquivo | Conteúdo | Composição e motion |
|---|---|---|---|
| **PageHero** | `PageHero page="servicos"` | Trilha "SERVIÇOS". H1 `["Soluções completas","em combate e prevenção","a incêndios"]`. Subtítulo literal de §2.3. Imagem `co2-cilindros`, com o recorte `valvulas-sprinkler` flutuando. `WhatsAppCta location="pagina_servicos"` | §7.9 |
| **Diagrama "Camada por camada"** (`#sistema`) | `sections/servicos/Diagrama.tsx` + `diagrama/iso.ts` + `diagrama/IsoDiagram.tsx` | §10.2.1 | §10.2.1 |
| **Capítulos** | `sections/servicos/Capitulos.tsx` | §10.2.2 | §10.2.2 |
| **Fitas** | `sections/servicos/Fitas.tsx` | Fita A (`FITAS.equipamentos`): "Extintores · Mangueiras · Hidrantes · Portas corta-fogo · Sistemas de alarme · Sistemas de supressão · Sistemas fixos · Sinalizações". Fita B (`FITAS.servicosCampo`): "Inspeções periódicas · Testes hidrostáticos · Manutenção em campo · Repintura · Limpeza · Adequação técnica · Auditorias · Treinamentos" | Duas `VelocityMarquee` em sentidos opostos (-1 e +1), em `display-l` com `stretch-66`, separadas pelo `Symbol` de 20 px. A fita A é preenchida em `papel-50` e a B em `.text-outline`. Rotação estática de -2° (A) e +2° (B). No hover a fita para. Entrada: `fade` + y 40→0 |
| **Faixa AVCB** (`#avcb`) | `sections/servicos/FaixaAvcb.tsx` | Título: "Documentação e regularização: obtenção e renovação do AVCB". Texto: o resumo literal do serviço 03 (§1.6). `WhatsAppCta location="avcb" message={WA.avcb}` "Falar sobre AVCB". **Sem prazo, multa ou "gratuito"** | Fundo `brasa-500` com texto branco. Entrada: a faixa faz scaleX 0,9→1 a partir do centro (700 ms); título com `linha`. O botão é fantasma branco e no hover inverte a cor por varredura |
| **FaixaCta** | `page="servicos"` | §7.10 | §7.10 |

#### 10.2.1 Diagrama isométrico "Camada por camada" (enxerto D2, P1)
Seção fixada com um diagrama em corte de uma edificação, no mundo azul com `.bg-blueprint`. Os seis sistemas que a Protecin atende acendem um por um.

**Estrutura:**
- **Desktop:** `PinStage mode="pin" heightClassName="h-[500vh]"`.
  - Colunas 1–4: rótulo, H2 (que encolhe para `titulo` depois da abertura), trilho vertical com 7 marcas (C-01 a C-06 e "Engenharia") e o bloco da camada ativa (código, nome, texto e chips de serviço como `Link` para `/servicos/#<slug>`).
  - Colunas 5–12: o SVG (`viewBox 0 0 1200 820`).
  - Base da cena: chips clicáveis das camadas.
- **Celular, tablet e curto:** sem fixação por transform. O SVG fica em `sticky top-[64px] h-[56svh]` e 7 cartões de texto rolam por baixo (`min-h-[70svh]` cada). A camada ativa sai de `useInView(cartão, { margin: "-45% 0px -45% 0px" })`. Os desenhos animam por tempo (800 ms), sem scrub e sem câmera. Os detalhes menores do SVG somem (`.so-desktop`).
- **Reduzido:** todas as camadas acesas e os 7 textos em lista.

**Conteúdo:**
- `SectionLabel index="01" label="Sistema"`.
- H2: "Da elaboração de projetos à gestão contínua dos equipamentos."
- Corpo: subtítulo literal de §2.1 (Serviços).
- Camadas (`DIAGRAMA` em `site.ts`):

| Código | Camada | Texto (literal) | Serviços (chips) | Traço aceso |
|---|---|---|---|---|
| C-01 | Extintores | "Inspeções periódicas, testes hidrostáticos, manutenção em campo, repintura, limpeza e adequação técnica conforme exigências das NBRs e legislação vigente." · "Equipamentos homologados e manutenção certificada pelo INMETRO, com rastreabilidade e garantia." | 04, 05, 07 | `brasa-400` |
| C-02 | Hidrantes e mangueiras | "Linha completa de extintores, mangueiras, hidrantes, portas corta-fogo, sistemas de alarme e supressão." | 01, 04 | `brasa-400` |
| C-03 | Sistemas de alarme | "Implantação de sistemas fixos e equipamentos contra incêndio com tecnologia atualizada, equipe especializada e componentes certificados para diferentes tipos de edificações e necessidades operacionais." | 01 | `marinho-300` (fios) + `brasa-300` (pulsos) |
| C-04 | Sistemas fixos e de supressão | "Soluções completas e personalizadas para implantação de sistemas fixos e equipamentos de combate a incêndio, com segurança, rastreabilidade e foco em alta performance." | 01, 05 | `brasa-400` |
| C-05 | Portas corta-fogo | "Linha completa de extintores, mangueiras, hidrantes, portas corta-fogo, sistemas de alarme e supressão." | 07 | `papel-50` |
| C-06 | Sinalização | "Implementação de sinalizações fotoluminescentes, orientativas, de emergência e salvamento conforme normas." | 08 | `fotolum` (brilho das placas) + `papel-50` tracejado (rota) |
| Final | Engenharia | "Elaboração de projetos legais e executivos com emissão de ART, seguindo rigorosamente os requisitos técnicos, normativos e legais." · "Elaboração de laudos e programas por engenheiros das áreas Civil, Elétrica, Mecânica e de Segurança." | 02, 03, 06 | todas acesas |

Carimbo final (`StampBadge`, canto inferior direito do SVG): "PROJETO COM ART · ASSESSORIA AVCB". **Nunca "AVCB aprovado".**

**Geometria** (`diagrama/iso.ts`, gerada em código):
- Projeção: `P(x,y,z) = [520 + (x - y)*34*0.866, 60 + (x + y)*34*0.5 - z*34]` (unidade de 34 px, isometria de 30°).
- Planta `x 0–12`, `y 0–7`, com 4 níveis de pé-direito 3: subsolo `z 0–3`, térreo `3–6`, 1º andar `6–9`, 2º andar `9–12`.
- Corte: só as paredes do fundo (`y = 0` e `x = 0`) e as lajes, com traço `marinho-300` de 1 px e laje com preenchimento `marinho-900` a 60%.
- Elementos por camada (unidades da planta):
  - **C-01:** pictograma de extintor (quadrado `brasa-400` de 16 px com silhueta clara) em `(2,0,z+1.2)` e `(8,0,z+1.2)` em cada nível, 8 no total.
  - **C-02:**
    - prumada em `(11,0,0→12)`, desenhada de baixo para cima;
    - ramal no teto do subsolo `(0→11,0,2.8)`;
    - abrigo de mangueira `1×1.4` em `(10.2,0,z+0.8)` em cada nível;
    - reservatório em `(11.5,0.5,0)`.
  - **C-03:**
    - detectores (círculo de 6 px) em `(3,3,z+2.9)`, `(7,3,z+2.9)` e `(10,5,z+2.9)` em cada nível;
    - acionador manual em `(5,0,z+1.3)`;
    - painel central em `(1,0,4.2)`;
    - fios tracejados (`4 3`) de cada detector até `(0.5,0,z+2.9)` e daí ao painel.
  - **C-04:** sala técnica no subsolo, `x 0–4`, `y 4–7`. Bateria de 6 cilindros em `x 0.6→3.6` (passo 0,6), `y 6.4`, `z 0→1.6`, com coletor em `z 1.8`. Rede no teto do subsolo em grade `x 4–12`, `y 1–6`, a `z 2.9`, com bicos em tick de 4 px.
  - **C-05:** núcleo de escada em `x 0`, `y 5–7`. Porta `0.9×2.1` em `(0,5.5,z)` em cada nível, com o arco de abertura.
  - **C-06:** placa de saída acima de cada porta, em `(0,5.5,z+2.4)`. Rota de fuga tracejada no piso de cada nível, de `(10,4,z)` a `(1,5.5,z)`, com setas a cada 1,5 unidade.
- Pontos focais da câmera: C-01 `(6,0,6)`, C-02 `(11,0,6)`, C-03 `(6,3,8)`, C-04 `(2,6,1)`, C-05 `(0,6,6)` e C-06 `(5,4,4)`. A fase final usa o conjunto inteiro.
- Acessibilidade: `role="img"`, `<title>` "Diagrama em corte de uma edificação com os sistemas de proteção contra incêndio" e `<desc>` com as camadas. Os textos do painel ficam todos no DOM.

**Coreografia (desktop, p da cena):**

| Faixa de p | O que acontece |
|---|---|
| 0→0,08 | o contorno da edificação desenha (`DrawPath` com progress) e o H2 entra |
| 0,08→0,20 | C-01 |
| 0,20→0,33 | C-02 |
| 0,33→0,46 | C-03 |
| 0,46→0,60 | C-04 |
| 0,60→0,72 | C-05 |
| 0,72→0,85 | C-06 |
| 0,85→1 | Engenharia: todas as camadas a 100%, carimbo e `FocusBrackets mode="locked"` em volta do diagrama |

Dentro de cada camada:
1. Nos primeiros 60% da faixa, os traços (prumada, fios, rede, rota) desenham por `pathLength` ligado ao progresso.
2. Ao cruzar 20% da faixa, os pictogramas entram **por estado**: scale 0→1 (`SPRING.encaixe`), stagger 40 ms. Os detectores do C-03 soltam 1 pulso cada (anel `brasa-300`, scale 1→3, opacidade 0,6→0, 900 ms). As placas do C-06 ganham `drop-shadow(0 0 6px #D8F36A)` em 400 ms.
3. As camadas anteriores caem para 35% de opacidade (400 ms).
4. **Câmera:** o grupo do SVG faz scale 1→1,15 e translada para o ponto focal (progresso suavizado). Na fase final volta a scale 1.
5. **Painel lateral:** o bloco anterior sai (y -12, opacidade 0, 200 ms) e o novo entra (y 12→0, 400 ms) com `AnimatePresence mode="wait"`. O código troca por `Odometer`, a marca ativa do trilho estica de 8 para 24 px (`SPRING.encaixe`) e pinta de `brasa-400`, e a linha do trilho faz scaleY pelo progresso.

**Interação:**
- Clicar num chip de camada leva ao início da faixa (`scrollToProgress`) e dispara `pushEvent("diagram_layer",{layer})`.
- Hover num pictograma: tooltip mono com o nome do item ("Extintor", "Abrigo de mangueira", "Detector", "Acionador manual", "Painel de alarme", "Cilindro", "Porta corta-fogo", "Placa de saída") e `FocusBrackets` de 20 px.

#### 10.2.2 Capítulos dos 8 serviços (P0)
**Desktop:**
- Índice `sticky` à esquerda (colunas 1–3) com os 8 nomes numerados. O ativo (`useInView`, margem -45%) fica com opacidade 1, barra `brasa-400` (scaleY, 350 ms) e `layoutId="svc-ativo"`; os outros em 0,45. Clicar rola até o capítulo.
- Capítulos nas colunas 5–12, com altura mínima de 90vh e `<article id={slug}>`. Cada um tem:
  - número com `Odometer`, ícone com `traco` e H2 (o nome) com `linha`;
  - resumo (`corpo-l`) e descrição longa (corpo) com `sobe`;
  - chips com `monta`;
  - mídia principal em `CaptionedFigure` com `cortina` e `parallax={8}`;
  - CTAs: `WhatsAppCta location="pagina_servicos" detail={slug}` "Orçamento deste serviço" e `OrcamentoCta formLocation="pagina_servicos" servico={slug}` "Monte sua solicitação".
- Mídias secundárias:
  - 01: `servico-instalacao-2`;
  - 04: `servico-inspecoes-2`;
  - 05: `institucional-extintor`;
  - 08: a foto real `obra-parede-sistemas` enquadrada nas placas (`position="57% 40%"`, crédito acervo).
- No capítulo 05: `<ReservedSlot id="preco-unico" />`.

**Celular:** sem índice fixo. Uma barra horizontal de chips no topo (`data-lenis-prevent`, `snap-x`, `touch-pan-x`) leva aos capítulos, com a pílula ativa deslizando (`layoutId="svc-pill"`, `SPRING.pilula`).

**Evento:** `pushEvent("service_open",{servico, origem:"servicos"})` na primeira ativação de cada capítulo.

### 10.3 `/nossos-clientes/`

| Seção | Arquivo | Conteúdo | Composição e motion |
|---|---|---|---|
| **PageHero** | `PageHero page="clientes"` | Trilha "NOSSOS CLIENTES". H1 `["Nossos","Clientes"]`. Subtítulo literal de §2.4. Imagem `clientes-aperto`. `WhatsAppCta location="pagina_clientes"` | §7.9 |
| **ClientesEscala** | `sections/clientes/ClientesEscala.tsx` | Sobretítulo "Presença sólida e confiável em empresas de alto padrão", H2 "Atendemos líderes de mercado em diferentes setores", texto literal de §2.4 e o número "20.000+ / clientes atendidos" | Tom escuro. Número com `Odometer` (`display-xxl`), H2 com `linha`, texto com `sobe` e `luz-brasa` com parallax |
| **SetoresEmpilhados** | `sections/clientes/SetoresEmpilhados.tsx` | Os 3 setores com o texto literal | 3 painéis `sticky top-0` de 100svh, um sobre o outro. Cada um tem a imagem `setor-*` em largura total (véu `noite-950/65`, `ParallaxMedia amount={8}`, crédito ilustrativa), o nome em `display-xl` (`linha`), os ícones do setor (`traco`, stagger 150 ms) e o texto em `corpo-l` (`sobe`). Quando o painel seguinte cobre, o de baixo faz scale 1→0,92 e o véu vai de 0→0,6. Celular: igual, com altura mínima de 90svh. Estático: em fluxo |
| **Parceiros** | `sections/clientes/Parceiros.tsx` | Título "Parcerias estratégicas e filiações técnicas" + texto literal de §2.4. Três grupos: "Autorizações oficiais" (Kidde Brasil, Everlux, Notifier by Honeywell, Simplex), "Marcas com que trabalhamos" (VESDA by Xtralis, Bosch, Firebee, Germek Equipamentos) e "Filiações técnicas" (ABSpk, NFPA). Depois, `<ReservedSlot id="clientes" />` | **Tom claro.** Grade de ladrilhos 3:2 (4 colunas no desktop, 2 no celular), um rótulo mono por grupo e réguas. Ladrilhos com `virada`, stagger 50 ms; logos em `grayscale(1)` a 0,72. Hover ou foco: cor original, `FocusBrackets tone="claro"` e o nome mono sob o ladrilho (`sobe`, 200 ms) |
| **FaixaCta** | `page="clientes"` | §7.10 | §7.10 |

### 10.4 `/catalogo-digital/`

| Seção | Arquivo | Conteúdo | Composição e motion |
|---|---|---|---|
| **CatalogoCapa** (acima da dobra) | `sections/catalogo/CatalogoCapa.tsx` | Trilha "CATÁLOGO DIGITAL". H1 "Catálogo Digital Protecin". Subtítulo "Material completo e sempre atualizado". Texto literal de §2.5. `PrimaryCta external icon="download"` "Baixar catálogo (PDF)" para `COMPANY.catalogoPdf` (`target="_blank"`, `pushEvent("catalog_download",{location:"pagina_catalogo"})`). `WhatsAppCta location="pagina_catalogo"` "Falar com o comercial" | Sem gota. Entrada do texto em CSS (`e-linha`/`e-sobe`). Desktop: texto nas colunas 1–6 e capa (`catalogo-capa`, 360 px de largura, porque a resolução é baixa) nas colunas 8–11, num `TiltCard glare` com lombada falsa (`::before` de 14 px `marinho-900`, `rotateY(90deg)`). A capa entra por CSS com rotateY -35°→-12° e y 60→0 (900 ms); um brilho passa uma vez (x -120%→120%, 900 ms, +400 ms); depois de hidratar, segue o ponteiro (±8°). Rolagem: rotateY -12°→0 e scale 1→1,06. Sombra `brasa-600` sob a capa, em camada com opacidade. Celular: capa acima do texto (240 px), sem tilt |
| **LinhaEquipamentos** | `sections/catalogo/LinhaEquipamentos.tsx` | Título "Equipamentos que comercializamos". Texto: descrição literal do serviço 05 versão home ("Linha completa de extintores..."). Chips: Extintores · Mangueiras · Hidrantes · Portas corta-fogo · Sistemas de alarme · Sistemas de supressão | `CaptionedFigure` de `institucional-extintor` (ilustrativa) com `cortina` e `parallax={8}`. Ao lado, os 6 chips grandes com `monta`. Embaixo, uma `VelocityMarquee` com `FITAS.equipamentos` |
| **FaixaCta** | `page="catalogo"` | §7.10 | §7.10 |

O conteúdo do PDF não foi lido, então a página não lista o que está dentro dele.

### 10.5 `/nosso-app/`

| Seção | Arquivo | Conteúdo | Composição e motion |
|---|---|---|---|
| **AppHero** (acima da dobra) | `sections/app/AppHero.tsx` | Trilha "NOSSO APP". H1 `["Protecin App:","gestão inteligente","de inspeções"]`. Texto literal de §2.6 ("Uma plataforma completa..."). A frase "...que está transformando o setor..." fica fora. CTAs: `WhatsAppCta location="pagina_app" message={WA.plataforma}` "Quero conhecer a plataforma" e `OrcamentoCta formLocation="pagina_app"` | Fundo `mundo-azul` + `.bg-blueprint`. Desktop: texto nas colunas 1–6; à direita, o notebook `app-webmaster-notebook` e o celular `app-login-celular` à frente, à direita. Entrada CSS: o notebook vai de y 60→0 e rotateX 18°→0 (`perspective 1600`, 900 ms); o celular de y 120→0 e rotate 8°→-4° (900 ms, +120 ms). Em +700 ms, a tela do celular troca do splash para o login, num crossfade de 300 ms entre `app-splash` e `app-login-celular` (mesmo aparelho, mesmo tamanho). Rolagem: celular y 0→-12% e notebook 0→-4%. Celular: dispositivos abaixo do texto, com 80% da largura |
| **ComoFunciona** | `sections/app/ComoFunciona.tsx` | Título "Como funciona o Protecin App" (correção de "Como nosso Protecin funciona?"). Os 3 módulos com as listas literais de §2.6, na ordem App de Coleta → Processador de Coleta Online → Web Master. Frase literal "Conheça as funcionalidades do nosso software e veja como ele pode tornar sua rotina mais eficiente, segura e integrada." | `PinStage mode="pin" h-[300vh]`. Desktop: três nós em linha (`Smartphone` → `Server` → `LayoutDashboard`) ligados por um path SVG. `DrawPath` desenha o 1º trecho em p 0,1→0,4 e o 2º em p 0,45→0,75. Três pacotes (retângulos 64×24 com o rótulo mono "COLETA") andam pelo path, defasados em 0,06, a partir de pontos pré-calculados. Quando o traço chega a um nó, o nó faz `carimbo` e a lista dele entra com `sobe`, stagger 60 ms, cada item com um `Check` desenhado. As listas não somem. Celular, curto e reduzido: fluxo vertical sem fixação, com o path vertical ligado à rolagem da seção |
| **Plataforma `app`** | `sections/shared/Plataforma.tsx` | §9 H5 | §9 H5, sem a gota |
| **Recursos** | `sections/app/Recursos.tsx` | Título "Recursos que fazem a diferença". Subtítulo (composto com fatos): "Conformidade com a NBR 12962 e a NBR 12779, com ou sem internet." Os 8 recursos literais de §1.7 com os ícones de §4.4 | Quadro 4×2 (desktop) ou 2×4 (celular) de ladrilhos `noite-800` com borda `noite-700`, índice mono "R-01..08", ícone e nome. Entrada: `monta` a partir de posições espalhadas, stagger 50 ms, quando o quadro entra 20%; depois cada ícone faz `traco`. Hover: y -4, borda `brasa-400`, ícone redesenha e `FocusBrackets` |
| **TelasReais** (enxerto D2) | `sections/app/TelasReais.tsx` | Título "Telas reais do sistema". Legenda: "Telas reais do sistema. Dados de clientes ocultos." Imagens `app-splash`, `app-login-celular` e `app-webmaster-notebook` | Galeria de 3 em `TiltCard` com crédito "FOTO DO ACERVO PROTECIN" (são capturas reais). Entrada: `virada`, stagger 100 ms. Rolagem: cada uma com parallax y próprio (4%, 8% e 6%) |
| **AppFecho** | `sections/app/AppFecho.tsx` | "Tecnologia acessível que entrega resultado, simplifica processos e fortalece sua gestão." + CTAs (`WhatsAppCta location="pagina_app"` e `OrcamentoCta`) | Frase em `display-xl` com `ScrollLitText`; CTAs com `sobe` |
| **FaixaCta** | `page="app"` | §7.10 | §7.10 |

### 10.6 `/contato/`

| Seção | Arquivo | Conteúdo | Composição e motion |
|---|---|---|---|
| **ContatoAbertura** (acima da dobra) | `sections/contato/ContatoAbertura.tsx` | Trilha "CONTATO". Sobretítulo "Entre em contato". H1 "Contate a Protecin". Texto literal de §2.7 | 60svh, sem fixação. À direita, o `Symbol` gigante (40vw) só em traço (`noite-600`), em `mode="desenhar"` (900 ms), com a gota enchendo por scale 0→1 (EASE_BACK). H1 com `e-linha` |
| **Orcamento `contato`** | `sections/shared/Orcamento.tsx` | §9 H10 (canais com `location="pagina_contato"`, mais falecom@protecin.com.br) | Fundo `noite-900`, sem gota, letreiro ou vídeo. O formulário lê `?servico=` |
| **Mapa** | `sections/contato/Mapa.tsx` | Endereço completo, botão "Carregar mapa" e link "Como chegar" | Fachada `noite-800` com raio de 28 px, o `Symbol` como pino (`carimbo`) e o endereço. O clique troca a fachada pelo `iframe` `COMPANY.mapsEmbed` (`loading="lazy"`) dentro de um `ClipReveal from="left"` e dispara `pushEvent("map_load")`; o "Como chegar" dispara `map_directions_click`. Sem iframe antes do clique (nenhuma requisição de terceiro na carga) |

### 10.7 `/creditos/` e 404

**`/creditos/`** (`sections/creditos/Creditos.tsx`, `noindex`):
- H1 "Créditos de imagens e vídeos".
- Lista de `CREDITOS`:
  - os vídeos com banco, autor, link da página e licença (Pexels: Val А., Gustavo Fring e Mikael Blomkvist; Mixkit 52312);
  - as fotos ilustrativas herdadas do site atual, com a nota "banco de imagens usado no site atual; licença a confirmar com a Protecin".
- Entrada: `linha` no H1 e linhas da lista com `Rule` + `sobe`, stagger 40 ms.

**404** (`sections/notfound/NotFound.tsx`, gravada em `dist/404.html`, `noindex`):
- O `Symbol` centralizado com as cantoneiras abertas (40 px para fora), fechando em 600 ms (`css-montar`).
- "404" num `Odometer` que gira ao carregar.
- H1 "Página não encontrada" com `e-linha` e o texto "Esta página não existe ou mudou de endereço."
- Links Início, Serviços e Contato (`GhostCta`) e `WhatsAppCta location="pagina_404"`.

---

## 11. Dados: formato de `src/data/site.ts`

`site.ts` só tem dados e tipos: nada de React nem lucide. Os ícones são `IconeId` (string), resolvidos por `components/ui/icones.ts`. Todo texto literal sai de `conteudo-estruturado.md` com a seção indicada. A unidade base escreve o arquivo **completo**, porque as outras unidades não podem editá-lo.

```ts
import type { ImagemId } from "./imagens.gen";
import type { VideoId } from "./videos.gen";

export type ServicoSlug =
  | "instalacao-de-sistemas-e-equipamentos" | "projetos-tecnicos" | "documentacao-e-regularizacao"
  | "inspecoes-e-manutencoes-preventivas" | "manutencao-de-equipamentos" | "gestao-de-riscos-e-consultoria"
  | "venda-de-equipamentos" | "sinalizacao-de-seguranca";
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
export type Linhas = string[] | { desktop: string[]; celular: string[] };
export interface Titulo { texto: string; linhas: Linhas; destaque?: string[] }

export interface Rota { path: string; page: PageId; title: string; description: string; label: string; noindex?: boolean }
export interface Marca { id: string; nome: string; imagem: ImagemId; imagemEscuro?: ImagemId; grupo: "autorizada" | "marca" | "filiacao" }
export interface Servico {
  slug: ServicoSlug; numero: string; nome: string; nomeCurto: string;
  resumo: string;            // versão de /servicos (ou a única existente)
  descricao: string | null;  // versão da home, quando existe e é diferente
  chips: string[]; icone: IconeId; imagem: ImagemId;
  imagem2?: ImagemId; imagem2Credito?: "acervo" | "ilustrativa"; video?: VideoId;
}
export interface Hotspot { id: number; x: number; y: number; nome: string; titulo: string; texto: string; servico: ServicoSlug }
export interface Chamada { x: number; y: number; rotulo: string }
export interface Pilar { numero: string; titulo: string; texto: string; icone: IconeId }
export interface Modulo { id: "coleta" | "processador" | "webmaster"; nome: string; uso: string | null; itens: string[]; icone: IconeId }
export interface Marco { ano: number; rotulo: string; texto: string; imagem?: ImagemId; simbolo?: boolean; final?: boolean }
export interface Setor { id: "financeiro" | "industrial" | "energia"; nome: string; texto: string; imagem: ImagemId; icones: IconeId[] }
export interface Camada { id: string; codigo: string; nome: string; textos: string[]; servicos: ServicoSlug[];
  cor: "brasa" | "alarme" | "papel" | "fotolum" | "todas"; itens: string[] }
export interface Credito { tipo: "video" | "foto"; titulo: string; fonte: string; autor?: string; url?: string; licenca: string }
```

Constantes, todas exportadas, com o conteúdo:

| Constante | Conteúdo |
|---|---|
| `COMPANY` | `nome: "Protecin"`, `razaoSocial: "Protecin Proteção Técnica Contra Incêndio Ltda."`, `fundacao: 1976`, `descritor: "Engenharia e Proteção Técnica Contra Incêndio"`, `slogan: "Protegemos seu maior patrimônio: a vida."`, `phoneDisplay: "+55 11 4977-8720"`, `phoneTel: "tel:+551149778720"`, `whatsappDisplay: "+55 11 94565-1751"`, `whatsappNumber: "5511945651751"`, `email: "comercial@protecin.com.br"`, `email2: "falecom@protecin.com.br"`, `endereco: { rua: "Rua Lacônia, 600", bairro: "Parque Capuava", cep: "09271-010", cidade: "Santo André", uf: "SP" }`, `horario: "Segunda a sexta, 8h às 17h30"`, `instagram: "https://www.instagram.com/protecin_ltda"`, `instagramHandle: "@protecin_ltda"`, `linkedin: "https://www.linkedin.com/company/protecin/"`, `catalogoPdf: "https://protecin.com.br/wp-content/uploads/2025/07/Catalogo-Digital-Protecin.pdf"`, `mapsEmbed: "https://www.google.com/maps?q=Rua+Lac%C3%B4nia,+600,+Santo+Andr%C3%A9+-+SP,+09271-010&output=embed"`, `mapsDirections: "https://www.google.com/maps/dir/?api=1&destination=Rua+Lac%C3%B4nia,+600,+Santo+Andr%C3%A9+-+SP"`, `dominio: "https://protecin.com.br"`, `cnpj: null` |
| `ROUTES` | as 8 linhas de §8 (`/`, `/institucional/`, `/servicos/`, `/nossos-clientes/`, `/catalogo-digital/`, `/nosso-app/`, `/contato/`, `/creditos/`), com `title`, `description` e `label` (rótulo da trilha e do menu) |
| `NOT_FOUND` | `Rota` da 404 (`path: "/404.html"`, `page: "404"`, `noindex: true`) |
| `NAV` | `[{label:"Institucional",to:"/institucional/"},{label:"Serviços",to:"/servicos/"},{label:"Nossos Clientes",to:"/nossos-clientes/"},{label:"Nosso App",to:"/nosso-app/"},{label:"Catálogo",to:"/catalogo-digital/"},{label:"Contato",to:"/contato/"}]` |
| `MENU` | 7 itens `{numero:"01",label,to,imagem}` de §7.4 |
| `WA` | `padrao: "Olá! Vim pelo site da Protecin e gostaria de solicitar um orçamento."`, `servico: (nome) => \`Olá! Vim pelo site da Protecin e gostaria de um orçamento de ${nome}.\``, `plataforma: "Olá! Vim pelo site da Protecin e quero conhecer a plataforma Protecin App."`, `visita: "Olá! Vim pelo site da Protecin e gostaria de agendar uma visita técnica."`, `avcb: "Olá! Vim pelo site da Protecin e preciso de assessoria para obter ou renovar o AVCB."` |
| `HERO` | §9 H0: `rotulo`, `h1: Titulo` (com `destaque:["50"]`), `paragrafo`, `manifesto` (com `*a vida.*`), `apoio`, `rotuloFinal`, `selo: "50 ANOS · 1976–2026 · "` |
| `NUMEROS` | `[{valor:"20.000+",rotulo:"clientes atendidos",ariaLabel:"Mais de 20.000 clientes atendidos",titulo:true},{valor:"50",rotulo:"anos de experiência (desde 1976)"},{valor:"3M+",rotulo:"equipamentos manutenidos"},{valor:"5M+",rotulo:"inspeções realizadas"},{valor:"250+",rotulo:"obras de médio e grande porte realizadas"}]`. Os `ariaLabel` dos outros são "50 anos de experiência", "Mais de 3 milhões de equipamentos manutenidos", "Mais de 5 milhões de inspeções realizadas" e "Mais de 250 obras de médio e grande porte realizadas" |
| `COMPROMISSO` | `sobretitulo`, `h2: Titulo`, `texto` (§2.1) |
| `SELOS` | 3 `{texto, icone}` de §9 H2 |
| `AUTORIZADAS`, `MARCAS`, `FILIACOES` | `Marca[]` com os ids da tabela de imagens (§12.1). Nomes: "Kidde Brasil", "Everlux", "Notifier by Honeywell", "Simplex"; "VESDA by Xtralis", "Bosch", "Firebee", "Germek Equipamentos"; "ABSpk (Associação Brasileira de Sprinklers)", "NFPA" |
| `SERVICOS_HEADER` | `label`, `h2: Titulo`, `subtitulo`, `linhaFinal: "Precisa de mais de um serviço? Monte sua solicitação."` |
| `SERVICOS` | 8 `Servico`. Textos de §1.6; `nomeCurto`: Instalação · Projetos · AVCB · Inspeções · Manutenção · Riscos · Venda · Sinalização. Chips: <br>01 "Sistemas fixos" · "Componentes certificados" · "Rastreabilidade"; <br>02 "ART" · "AVCB" · "Projetos legais e executivos"; <br>03 "Laudos" · "Licenças" · "Renovação de AVCB"; <br>04 "Inspeções periódicas" · "Testes hidrostáticos" · "Manutenção em campo" · "Controle informatizado"; <br>05 "Tecnologia própria" · "INMETRO" · "Rastreamento individual"; <br>06 "Engenharia Civil" · "Elétrica" · "Mecânica" · "de Segurança"; <br>07 "Extintores" · "Mangueiras" · "Sinalizações" · "Sistemas fixos"; <br>08 "Fotoluminescentes" · "Orientativas" · "Emergência e salvamento" · "Treinamentos". <br>No 04, a `descricao` traz "das NBRs". No 08, `resumo` é a 1ª frase da home e `descricao` é a 2ª |
| `NA_PRATICA` | §9 H4: `label`, `h2`, `legenda`, `pontos: Hotspot[5]` e `cilindros: { numero:"250+", rotulo, legenda, chamadas: Chamada[4] }` |
| `PLATAFORMA` | §9 H5 e §10.5: `label`, `sobretitulo`, `h2`, `apoio`, `software`, `pilares: Pilar[4]` (§2.1), `selo`, `beneficios[4]`, `telas` (rótulos das telas, `andamento: ["1 de 3","2 de 3","3 de 3"]`, `ordens: 3`), `modulos: Modulo[3]` (§2.6; o processador tem `uso: null` e 1 item), `comoFunciona: { titulo, frase }`, `recursos: { titulo, subtitulo, itens: {nome, icone}[8] }`, `telasReais: { titulo, legenda }`, `fecho` |
| `DIFERENCIAIS` | 4 `{numero, titulo, texto, icone}` (§2.1) |
| `TIMELINE` | `label`, `sobretitulo`, `h2: Titulo`, `h2Completa`, `marcos: Marco[10]` (9 de §2.2 + 2026 `final:true`, com o texto "50 anos protegendo vidas e patrimônios.") e os rótulos de §9 H7; no 1976 `simbolo:true`, no 2021 `imagem:"app-login-celular"` |
| `SETORES` | `label`, `sobretitulo`, `h2`, `texto`, `itens: Setor[3]` (§2.4, ícones de §4.4), `link: { label:"Ver clientes e parcerias", to:"/nossos-clientes/" }` |
| `SETORES_FORM` | `["Financeiro","Tecnologia","Saúde","Industrial","Agronegócio","Energia","Transporte","Outro"]` |
| `SOCIAL` | `label`, `sobretitulo`, `letreiro: { desktop: ["Cuidar de *vidas*","também é","transformar","*futuros*"], celular: [...] }`, `kids: { titulo:"Cuidar de vidas também é transformar futuros", texto, fecho, legendaColagem }`, `sustentabilidade: { titulo:"Cuidar também é prevenir.", texto }`, `link` |
| `INSTITUCIONAL` | `mvv: { titulo, intro, missao, visao, valores: string[6] }` e `sustentabilidade: { titulo, texto, linha2004:"Política de Preservação Ambiental desde 2004" }` (§2.2) |
| `PAGE_HEROES` | `Record<"institucional" \| "servicos" \| "clientes", { trilha: string; h1: Linhas; subtitulo: string; imagem: ImagemId; extra?: ImagemId; waLocation: LeadLocation }>` (§10) |
| `DIAGRAMA` | `label`, `h2`, `corpo`, `carimbo`, `camadas: Camada[7]` (§10.2.1, `itens` = nomes de tooltip) |
| `FITAS` | `equipamentos: string[8]`, `servicosCampo: string[8]` (§10.2) |
| `FAIXA_AVCB` | `titulo`, `texto`, `cta: "Falar sobre AVCB"` |
| `CATALOGO` | `trilha`, `titulo`, `subtitulo`, `texto`, `cta`, `linha: { titulo, texto, chips[6] }` (§10.4) |
| `APP_HERO` | `trilha`, `h1: Linhas`, `texto` |
| `CONTATO` | `label`, `h2`, `texto`, `pagina: { trilha, sobretitulo, h1, texto }`, `canais` (rótulos mono: "WHATSAPP", "TELEFONE", "E-MAIL", "ENDEREÇO", "HORÁRIO"), `comoChegar` |
| `FORM` | etapas (`titulo`), botões, placeholders, `erros`, `sucesso`, `sucessoDemo`, `erro`, `endpoint: "https://formsubmit.co/ajax/comercial@protecin.com.br"`, `waResumo(dados)` |
| `FAIXA_CTA` | `letreiro: "SOLICITAR ORÇAMENTO · "`, `frase: "Fale com a Protecin: segunda a sexta, 8h às 17h30."` |
| `FOOTER` | `slogan: ["PROTEGEMOS SEU MAIOR","PATRIMÔNIO: A VIDA."]`, `texto` (§2.1), `secoes` (7 links), `direitos: (ano: number) => \`© ${ano} Protecin. Todos os direitos reservados.\``, `creditos: "Vídeos e fotos ilustrativos: créditos"` |
| `RESERVADOS` | `clientes`: "Logos de clientes" / "Espaço reservado: logos de clientes a enviar com autorização da Protecin."; `obras`: "Portfólio de obras" / "Espaço reservado: fotos de obras a enviar pela Protecin."; `depoimentos`: "Depoimentos da equipe" / "Espaço reservado: depoimentos em vídeo gravados na sede da Rua Lacônia (a produzir)."; `preco-unico`: "Preço único" / "Espaço reservado: preço único para inspeção e manutenção de extintores (conceito de 1986). Confirmar se a condição continua valendo." |
| `CREDITOS` | `Credito[]` (§10.7 e §12.2) |
| `TOAST` | textos de §7.7 |
| `NOTFOUND` | textos de §10.7 |

`src/data/imagens.gen.ts` (gerado por `scripts/imagens.mjs`):
```ts
export const IMAGENS = {
  "obra-parede-sistemas": { w: 2592, h: 1944, larguras: [828, 1440, 2200], alpha: false },
  // ...
} as const;
export type ImagemId = keyof typeof IMAGENS;
```

`src/data/videos.gen.ts` (gerado por `scripts/videos.mjs`):
```ts
export const VIDEOS = {
  hero: { arquivo: "hero-supressao-1280.mp4", arquivoMobile: "hero-supressao-540v.mp4", w: 1280, h: 720,
          bytes: 0, duracao: 8, poster: "hero-poster", posterMobile: "hero-poster-v",
          fonte: "Pexels 34775810", autor: "Val А.", url: "https://www.pexels.com/video/industrial-fire-suppression-system-setup-34775810/" },
  // tablet, extintor, fogo
} as const;
export type VideoId = keyof typeof VIDEOS;
```

---

## 12. Imagens e vídeos

### 12.1 Mapeamento `referencia/imagens-site-atual/` → `public/img/`
Pipeline: `scripts/imagens.mjs` com `sharp`.
- **Entrada:** um array `MAPA` no próprio script (id, origem, larguras e opções).
- **Saída:** `public/img/<id>-<largura>.avif` (`quality 50`, `effort 6`) e `.webp` (`quality 72`), mantendo o alfa quando houver. Nenhuma largura passa a do original.
- **Recorte:** aplica `crop` quando indicado.
- **Gerados:** `src/data/imagens.gen.ts`, `public/favicon.svg` (o símbolo, tom claro), `public/apple-touch-icon.png` (180 px, de `cropped-SIMBOLO.png` sobre `#FFFFFF`) e `public/og-protecin.jpg` (1200×630: `hero-poster` escurecido + símbolo + "Protegendo vidas e patrimônios há 50 anos" em SVG com fonte do sistema).
- **Execução:** é idempotente (pula o que está atualizado) e roda depois de `npm run videos`, porque os posters saem dos vídeos.
- **Nomes:** nenhum id leva nome de cliente.

| id publicado | Origem | Larguras | Opções | Crédito | Uso |
|---|---|---|---|---|---|
| `hero-poster` | quadro de 0,5 s do vídeo `hero` (1920×1080, de `scratch/videos-src/`) | 828, 1280, 1920 | AVIF ≤ 160 KB em 1920 e ≤ 70 KB em 828 | ilustrativa | H0 (LCP), menu, OG |
| `hero-poster-v` | quadro do recorte vertical (540×960) | 540 | ≤ 60 KB | ilustrativa | H0 no celular |
| `poster-tablet`, `poster-extintor`, `poster-fogo` | quadro de 0,5 s de cada vídeo | 640, 1280 | — | ilustrativa | posters |
| `obra-parede-sistemas` | `4.jpg` | 828, 1440, 2200 | `modulate({saturation:.92})`, `gamma(1.05)`, `sharpen` leve | **acervo** | H4, capítulo 08, menu |
| `obra-cilindros-supressao` | `024-original.jpg` | 828, 1440, 2200 | idem | **acervo** | H4 (bloco dos cilindros) |
| `app-splash` | `App_1.png` | 360, 720 | — | **acervo** | PhoneMock, TelasReais, AppHero |
| `app-webmaster-notebook` | `App_2.png` | 760, 1520 | alfa | **acervo** | H5, AppHero, TelasReais, menu |
| `app-login-celular` | `App_3.png` | 360, 720 | alfa | **acervo** | AppHero, H7 (2021), TelasReais |
| `kids-ong-colagem` | `Institucional_4.png` | 640, 1080 | rostos já borrados (não mexer) | **acervo** | H9 |
| `kids-ong-logo` | `logo_kids_ong.png` | 240, 479 | alfa | marca | H9 |
| `catalogo-capa` | `Screenshot-2025-07-30-143726.png` | 360, 554 | — | marca | catálogo, menu |
| `co2-cilindros` | `Home_BG_1-1.jpg` | 828, 1440, 2200 | — | ilustrativa | PageHero de serviços |
| `valvulas-sprinkler` | `Design_sem_nome.png` | 640, 1200 | alfa; conferir banding (PNG paletizado) | ilustrativa | PageHero de serviços |
| `servico-instalacao` | `Instalacao_1.jpg` | 640, 1000, 1600 | — | ilustrativa | H3/capítulo 01, menu |
| `servico-instalacao-2` | `Inspecao_1.jpg` | 640, 1000 | — | ilustrativa | capítulo 01 |
| `servico-projetos` | `Servicos_2.jpg` | 640, 1000, 1600 | — | ilustrativa | 02 |
| `servico-documentacao` | `architect-project-engineer-is-checking-house-building-quality-checklist-inspecting-1-1.jpg` | 640, 1000, 1600 | — | ilustrativa | 03 |
| `servico-inspecoes` | `Inspecao_2.jpg` | 640, 1000, 1600 | — | ilustrativa | 04 |
| `servico-inspecoes-2` | `Manutencao_2.jpg` | 640, 1000 | — | ilustrativa | capítulo 04 |
| `servico-gestao` | `Manutencao_1.jpg` | 640, 1000, 1600 | — | ilustrativa | 05 |
| `servico-riscos` | `Riscos_2.jpg` | 640, 1000, 1600 | — | ilustrativa | 06 |
| `servico-venda` | `Venda_2.jpg` | 640, 1000, 1600 | — | ilustrativa | 07 (com vídeo por cima) |
| `servico-sinalizacao` | `Riscos_1.jpg` | 640, 1000, 1600 | — | ilustrativa | 08 |
| `setor-financeiro-tecnologia-saude` | `Inspecao_1.jpg` | 640, 1280, 1920 | recorte 16:9 centrado na placa | ilustrativa | H8, SetoresEmpilhados |
| `setor-industrial-agronegocio` | `Servicos_1.jpg` | 640, 1280, 1920 | — | ilustrativa | H8, SetoresEmpilhados |
| `setor-energia-transporte` | `Home_Image_1-e1754481613736.png` | 640, 1280 | alfa (RGBA) | ilustrativa | H8, SetoresEmpilhados (sobre `noite-800`) |
| `institucional-pilar` | `Institucional_3.png` | 828, 1440 | — | ilustrativa | PageHero institucional, menu |
| `institucional-maos` | `Institucional_7.png` | 480, 960 | alfa | ilustrativa | H9, Sustentabilidade |
| `institucional-paisagem` | `Institucional_8.jpg` | 828, 1440, 2200 | — | ilustrativa | Sustentabilidade (textura) |
| `institucional-extintor` | `Institucional_2.png` | 640, 1200 | — | ilustrativa | capítulo 05, LinhaEquipamentos |
| `institucional-compromisso` | `compromisso.png` | 640, 1200 | — | ilustrativa | MissaoVisaoValores |
| `clientes-aperto` | `Clientes_1.jpg` | 828, 1440 | — | ilustrativa | PageHero de clientes, menu |
| `logo-kidde` | `4.png` | 240, 480 | `trim()`, só WebP | marca | fitas, ladrilhos |
| `logo-everlux` | `3.png` | 240, 480 | `trim()`, só WebP | marca | seções claras |
| `logo-everlux-branco` | `2.png` | 240, 480 | `trim()`, só WebP | marca | fundo escuro |
| `logo-notifier` | `5.png` | 240, 480 | `trim()`, só WebP | marca | fitas, ladrilhos |
| `logo-vesda` | `6.png` | 240, 480 | `trim()`, só WebP | marca | fitas, ladrilhos |
| `logo-simplex` | `Simplex.png` | 240, 480 | `trim()`, só WebP | marca | fitas, ladrilhos |
| `logo-bosch` | `BOSCH.png` | 240, 480 | `trim()`, só WebP | marca | fitas, ladrilhos |
| `logo-firebee` | `FIREBEE.png` | 240, 480 | `trim()`, só WebP | marca | fitas, ladrilhos |
| `logo-germek` | `LOGO-GRMK-AZUL-GERMEK.png` | 240, 480 | `trim()`, só WebP | marca | fitas, ladrilhos |
| `entidade-abspk` | `ABSPK.png` | 240, 480 | `trim()`, só WebP | marca | filiações |
| `entidade-nfpa` | `NFPA.png` | 240, 480 | `trim()`, só WebP | marca | filiações |
| `protecin-wordmark` | `Ativo-1.png` (recorte do wordmark, §4.5) | 400, 800 | alfa, WebP + AVIF | marca | logo em seção clara |
| `protecin-wordmark-negativo` | idem, recolorido (§4.5) | 400, 800 | alfa | marca | nav, rodapé, telas do app |

Os logos têm no máximo 12 KB cada. Os arquivos da lista "proibidas" de §2 nunca entram no `MAPA`.

### 12.2 Vídeos (`public/videos/`, sem hotlink)
Pipeline: `scripts/videos.mjs` com `ffmpeg-static`.
1. **Baixa as fontes** (se faltarem) para `scratch/videos-src/` (já ignorado no git) e remuxa com `+faststart`.
2. **Extrai 1 quadro por segundo** de cada fonte para `scratch/videos-src/quadros/<id>/` para revisão. **A unidade base precisa abrir os quadros do `hero` e confirmar que não aparece "GASBASE.RU" nem marca legível.**
   - Se aparecer, troca pelo reserva Pexels 34775769 (720p, `-t 8`).
   - Se o reserva também tiver marca, usa o Pexels 34775772 (5 s).
3. **Codifica** com `-an -c:v libx264 -profile:v high -preset slow -pix_fmt yuv420p -movflags +faststart`. Se o arquivo passar do teto, sobe o CRF em 2 e refaz, até CRF 32.
4. **Extrai o quadro de 0,5 s** como poster (JPG), que `scripts/imagens.mjs` converte.
5. **Grava** `src/data/videos.gen.ts`.

| id | Fonte (MP4 direto) | Saída | Filtros | CRF inicial | Teto | Uso |
|---|---|---|---|---|---|---|
| `hero` | Pexels 34775810, 1080p: `https://videos.pexels.com/video-files/34775810/14743116_1920_1080_30fps.mp4` | `hero-supressao-1280.mp4` | `scale=1280:-2,fps=30` | 27 | 3,0 MB | H0, desktop e tablet |
| `hero` (celular) | mesma fonte | `hero-supressao-540v.mp4` | `crop=608:1080:(in_w-608)/2:0,scale=540:960,fps=30` | 28 | 1,5 MB | H0 abaixo de 768 px |
| `tablet` | Pexels 7100844, 720p: `https://videos.pexels.com/video-files/7100844/7100844-hd_1280_720_30fps.mp4` | `app-tablet-720.mp4` | `-t 12`, `scale=1280:-2` | 28 | 2,5 MB | H5, pilar 01 (só desktop) |
| `extintor` | Pexels 8965440, 720p: `https://videos.pexels.com/video-files/8965440/8965440-hd_1280_720_50fps.mp4` | `extintor-fumaca-720.mp4` | `scale=1280:-2,fps=25` | 27 | 1,9 MB | H3, cartão 07 |
| `fogo` | Mixkit 52312, 720p: `https://assets.mixkit.co/videos/52312/52312-720.mp4` | `fogo-final-720.mp4` | `-t 8`, `scale=1280:-2` | 28 | 3,0 MB | H10, só desktop (P1) |

**Regras de uso:**
- **Créditos:** todos "Imagem ilustrativa", com o crédito também em `/creditos/`. Os autores estão em `videos.md`: Val А., Gustavo Fring, Mikael Blomkvist e Mixkit.
- **Carregamento:** o hero carrega depois de `load` mais idle; os outros quando estão a uma tela de distância.
- **Quando não carrega:** com `saveData`, `effectiveType` 2g/3g ou modo reduzido, o vídeo não carrega e fica o poster com o botão Play.
- **Simultaneidade:** no máximo 1 vídeo tocando além do hero, e todos pausam fora da tela.

---

## 13. CTAs e eventos de lead (padrão Extin Seven)

**Regras:**
- **Links reais:** todo CTA de contato é um `<a>` de verdade (`https://wa.me/5511945651751?text=…`, `tel:+551149778720` ou `mailto:comercial@protecin.com.br`).
- **Atributos:** cada link leva `data-lead-channel` (`whatsapp | phone | email`), `data-lead-location` e, quando houver, `data-lead-detail`.
- **Evento:** o clique dispara `trackLead()`, que faz `dataLayer.push({ event:"lead_click", lead_channel, lead_location, lead_detail, lead_page })`.
- **Conversões do Ads:** ficam no acionador de **clique em link** do GTM (`Click URL` contém `wa.me`, começa com `tel:` ou começa com `mailto:`). O `lead_click` é só para o GA4, para não contar duas vezes.
- **GTM:** só é injetado com `VITE_GTM_ID` definido no build, e só carrega no domínio `protecin.com.br` (ou na prévia com `?gtm_debug=x` ou `?track=1`). O `dataLayer` existe sempre, então os eventos não quebram na prévia.

| `lead_location` | Onde | `lead_detail` |
|---|---|---|
| `nav` | botão WhatsApp da nav | — |
| `menu` | rodapé do menu | — |
| `hero` | H0 (WhatsApp e telefone) | — |
| `servicos` | cartões de H3 | slug |
| `plataforma` | H5 | — |
| `historia` | painel 2026 de H7 | — |
| `orcamento` | canais de H10 | — |
| `formulario` | "Enviar pelo WhatsApp" e envio por e-mail | slugs escolhidos |
| `rodape` | rodapé | — |
| `botao_flutuante` | WhatsApp flutuante (desktop) | — |
| `barra_mobile` | barra inferior (celular) | — |
| `pagina_institucional`, `pagina_servicos`, `pagina_clientes`, `pagina_catalogo`, `pagina_app`, `pagina_contato` | abertura e corpo de cada página | slug, quando houver |
| `faixa_cta` | FaixaCta | PageId |
| `avcb` | Faixa AVCB | — |
| `pagina_404` | 404 | — |

`lead_page` = o `PageId` da rota atual.

| Evento | Parâmetros | Quando |
|---|---|---|
| `form_open` | `form_location` | `OrcamentoCta` ou foco no 1º campo |
| `form_step` | `step` | ao avançar de etapa |
| `form_lead` | `servicos`, `setor`, `cidade`, `demo` | sucesso (junto do `.msg-sucesso`) |
| `catalog_download` | `location` | download do PDF |
| `service_open` | `servico`, `origem` | "Detalhes" de H3; 1ª ativação de um capítulo |
| `sector_open` | `setor` | acordeão de H8 |
| `hotspot_open` | `ponto` | clique num marcador de H4 |
| `platform_step` | `passo` | 1ª ativação de cada pilar |
| `diagram_layer` | `layer` | clique num chip de camada |
| `timeline_complete` | — | chegada a 2026, uma vez por sessão |
| `menu_open` | — | menu aberto |
| `map_load` / `map_directions_click` | — | mapa |
| `video_play` | `video` | play manual |
| `motion_toggle` | `mode` | `MotionToggle` e `MotionToast` |
| `virtual_page_view` | `page_path`, `page_title` | toda troca de rota no cliente (no GTM, o acionador do page_view do GA4) |

A integração entrega um `TRACKING.md` com estas tabelas, as variáveis DLV sugeridas (`lead_channel`, `lead_location`, `lead_detail`, `lead_page`), os acionadores e o passo a passo para o Gabriel, que tem as pendências de GTM e Ads.

---

## 14. Movimento reduzido

**Decisão:**
- **Sistema:** o site **respeita** `prefers-reduced-motion` (régua: "tudo visível e legível, sem movimento").
- **Escape:** `MotionToast`, `MotionToggle` e `?motion=full` (ou `?motion=1`). A preferência fica salva em `localStorage "pt-motion"`.
- **Para a reunião com a Protecin:** abrir sempre com `?motion=full`, porque muitos PCs com Windows ativam a preferência só por terem "efeitos de animação" desligado.

| Peça | Completo | Reduzido |
|---|---|---|
| Lenis | ligado (lerp 0,11) | não é criado; âncoras com `scrollIntoView` instantâneo |
| `MotionConfig` | `reducedMotion="never"` | `"always"` |
| Entradas (`Reveal`, `Split*`, `ClipReveal`, `monta`, `virada`, `carimbo`) | como em §5.2 | só `fade` de 200 ms, sem deslocamento, máscara ou escala |
| Entradas CSS (`.e-*`) | animam | estado final no primeiro paint |
| `ScrollLitText`, `WipeText` | ligados à rolagem | texto inteiro aceso |
| `DrawIcon`, `DrawPath`, `Rule` | desenham | já desenhados |
| `Odometer`, `TextScramble` | giram e embaralham | valor final |
| `PinStage` (H0, H4, H5, H7, diagrama, ComoFunciona, PageHero) | cena fixada | `data-pin="off"`: layout estático de cada seção |
| H3 e SetoresEmpilhados | pilha sticky | fluxo normal |
| `VelocityMarquee` | corre | `flex-wrap` estático, 1 cópia |
| `Embers` | anima | não monta; fica a `luz-brasa` estática |
| Vídeos | autoplay mudo quando visíveis | poster + botão Play |
| Parallax, `SectionRise`, `DropWindow`, derivas, selo girando | ligados | `transform: none` |
| Preloader | 900 ms na 1ª visita | não aparece |
| Cortina de rota | painel vermelho de cerca de 1 s | fade de 200 ms |
| Hover | `TextRoll`, ímã, tilt, `CursorPreview` | só cor e borda (200 ms) |
| `FocusBrackets` | animam | aparecem sem deslocamento |

Os mesmos layouts estáticos valem em `@media (max-height: 560px)` (celular deitado) para as cenas com `mode="sempre"`.

---

## 15. Orçamento de desempenho

| Métrica | Meta | Como garantir |
|---|---|---|
| LCP (Lighthouse mobile, 4G simulado) | < 2,5 s | o LCP é o `<img>` do `hero-poster` (`priority`, AVIF de 828 px ≤ 70 KB no celular e 1920 px ≤ 160 KB no desktop) com `<link rel="preload" as="image" imagesrcset imagesizes fetchpriority="high">` via `%BASE_URL%`. Entrada do hero em CSS. Vídeo só depois de `load` + idle. Preloader CSS ≤ 900 ms |
| CLS | < 0,1 (meta interna de 0,05) | `width`/`height` em toda mídia, fallback de fonte com métricas, colunas de largura fixa no odômetro, nav `fixed`, alturas de cena fixada em CSS (não em JS) acima da dobra, cartão do formulário com altura fixa e acordeões só por clique |
| INP | < 200 ms | nada pesado em `pointermove` (só `MotionValue.set`); `getBoundingClientRect` só em `pointerenter`/resize |
| JS inicial (gzip) | ≤ 200 KB | React + ReactDOM + framer-motion + Lenis + app; ícones lucide importados um a um; sem GSAP nem router |
| CSS (gzip) | ≤ 25 KB | Tailwind com `content` correto |
| Fontes | ≤ 170 KB | Archivo latina wdth (com preload) + JetBrains Mono latina |
| Primeira carga sem rolar (sem vídeo) | ≤ 700 KB | tudo abaixo da dobra com `loading="lazy"` |
| Home inteira rolada, sem vídeo | ≤ 1,9 MB (régua: < 2 MB) | tetos: poster 160 KB, `obra-parede-sistemas` 170 KB, cilindros 130 KB, 8 mídias de serviço a 60 KB, 3 setores a 40 KB, telas do app 180 KB, Kids ONG 110 KB, 10 logos a 12 KB, wordmark 12 KB |
| Vídeos | cada um dentro do teto de §12.2 (régua: até cerca de 6 MB) | `preload="none"`, `src` perto da tela, pausa fora |
| Quadros por segundo | desktop ≥ 60; celular com CPU 4x ≥ 40 | só `transform`/`opacity` na rolagem; `will-change` só na cena ativa; 1 canvas e 1 vídeo por vez; `overflow: clip` nos palcos. Medir com `scripts/medir-desempenho.mjs` (da Indafire) |

Outras regras:
- `content-visibility: auto` com `contain-intrinsic-size` só em H8, H9 e no rodapé, nunca em cenas fixadas.
- Embers: no máximo 90 partículas no desktop e 40 no celular, com `dpr` limitado a 2.
- Nenhum iframe na carga: o mapa só entra pelo clique.

---

## 16. Critérios de aceite (verificáveis)

Valem junto com `qa/REGUA-SITE-NOVO.md`. Ferramentas:
- `scripts/verify.mjs`: puppeteer-core com o Chrome instalado, perfil em caminho curto e servidor próprio em `127.0.0.1:4195`. Com `--estatico`, serve `dist/` imitando o GitHub Pages em `/protecin-site/`.
- `qa/capturar.mjs`.
- Lighthouse.
- Revisão visual das capturas.

**Conteúdo e credibilidade**
- AC-01: todo número exibido está em `{50, 20.000+, 3M+, 5M+, 250+, 10 estados, 1976, 2026, os anos da linha do tempo}`. Verificação: o verify procura dígitos no texto e compara com a lista.
- AC-02: nenhuma ocorrência de o nome do banco, "gratuito", "transformando o setor", "elevar o padrão", "jornada", "sinergia", "parceiro de confiança", "no coração de" ou "o futuro da segurança" no HTML de nenhuma rota (verify).
- AC-03: "Autorizada" ou "AUTORIZADA" aparece só junto de Kidde, Everlux, Notifier e Simplex (verify confere o grupo do `data-marca`).
- AC-04: toda `<figure>` tem `figcaption` ou crédito com "ACERVO PROTECIN" ou "IMAGEM ILUSTRATIVA" (verify). Nenhum arquivo da lista proibida de §2 em `public/img`.
- AC-05: nenhum espaço reservado nem texto "Espaço reservado" sem `?proposta=1`. Com `?proposta=1`, os 4 aparecem (verify).

**Motion**
- AC-06: cobertura de animação ≥ 98%. Conta os elementos visíveis com texto próprio, `img`, `video`, `svg` ou `canvas` cujo próprio elemento ou ancestral tem `data-motion` (verify, em `?motion=full`).
- AC-07: zero elemento invisível (opacidade efetiva < 0,1) depois de rolar a página inteira em passos de 60% da tela, nos dois modos. Exceções: `[aria-hidden="true"]` decorativos, `video[data-lazy-video]:not(.is-playing)` e `display:none`.
- AC-08: nas cenas `[data-pin-stage]`, o verify amostra p = 0; 0,25; 0,5; 0,75 e 1 (espera de 600 ms). Cada elemento com texto ou mídia tem opacidade efetiva ≥ 0,9 em pelo menos uma amostra.
- AC-09: entradas medidas quadro a quadro em 3 elementos por página: pelo menos 5 valores distintos e duração entre 200 e 900 ms.
- AC-10: com JS desligado e com `animation:none; transition:none` forçado desde o primeiro quadro, nada fica invisível e o H1 e o primeiro CTA estão na tela (verify).
- AC-11: emulando `prefers-reduced-motion: reduce` sem parâmetro, `html` tem `motion-reduced`, nenhuma cena fixa (`data-pin="off"`), não há canvas de Embers e o Lenis não é criado. Com `?motion=full`, as cenas fixam.
- AC-12: só as fitas e os pacotes de dados (com o pilar ativo) têm animação infinita. Fora da tela, nenhuma animação de rAF roda (o verify conta quadros com a seção fora da tela).

**Funcional e conversão**
- AC-13: em 1440×900 e em 390×844, um CTA de orçamento ("Solicitar orçamento" ou "Orçamento") está inteiramente visível sem rolar, em todas as rotas, menos Créditos e 404.
- AC-14: todo `a[href^="https://wa.me/"]` casa com `^https://wa.me/5511945651751\?text=.+` e tem `data-lead-channel="whatsapp"` e `data-lead-location` da lista de §13. Todo `tel:` é `tel:+551149778720`. Todo `mailto:` vai para um dos dois e-mails reais.
- AC-15: clicar em cada tipo de CTA empurra `lead_click` com `lead_channel`, `lead_location` e `lead_page` (o verify intercepta `window.open` e lê o `dataLayer`).
- AC-16: o formulário valida em português (as 3 mensagens), aplica a máscara de telefone, passa por "Enviando…" e, na demo, mostra o sucesso com a linha "Demonstração" **sem nenhuma requisição a formsubmit.co**.
- AC-17: o menu abre por toque e por Enter, prende o foco, fecha com Esc, com toque fora e com clique num link, e trava a rolagem enquanto está aberto.
- AC-18: a navegação interna troca a rota sem recarregar, com a cortina, e atualiza `title`, `description` e `canonical`. Voltar no navegador funciona. Abrir `/protecin-site/servicos/#projetos-tecnicos` direto cai no capítulo certo.
- AC-19: sem GTM no HTML da demo (nenhuma requisição a googletagmanager.com) e com `noindex, nofollow` quando a base não é `/`.

**SEO e acessibilidade**
- AC-20: cada rota pré-renderizada tem `title` e `description` próprios, `canonical`, `og:image` absoluto, `lang="pt-BR"` e exatamente 1 `h1`.
- AC-21: toda `img` informativa tem `alt` descritivo, e as decorativas têm `alt=""`. Favicon e `404.html` existem.
- AC-22: foco visível em todo interativo. Contraste AA (axe-core no verify, regra `color-contrast` sem violação).
- AC-23: no celular, nenhum alvo de toque abaixo de 44×44 px (o `capturar.mjs` usa 32 px; o verify usa 44). Nenhum texto com mais de 20 caracteres abaixo de 13 px.

**Desempenho**
- AC-24: Lighthouse mobile na home publicada: LCP < 2,5 s, CLS < 0,1, TBT < 300 ms.
- AC-25: peso transferido da home rolada inteira, sem vídeo, < 1,9 MB; primeira carga < 700 KB; cada vídeo dentro do teto (verify soma os `responseReceived`).
- AC-26: `medir-desempenho.mjs --cpu 4`: desktop ≥ 30 fps e celular ≥ 40 fps rolando a home inteira.

**QA da régua**
- AC-27: `node qa/capturar.mjs http://127.0.0.1:4195/protecin-site qa/capturas-demo "/,/institucional/,/servicos/,/nossos-clientes/,/catalogo-digital/,/nosso-app/,/contato/,/creditos/"` dá:
  - 0 erro de console;
  - 0 requisição com falha ou 404;
  - 0 rolagem horizontal;
  - 0 elemento vazando;
  - 0 imagem quebrada.
  - Antes, o `capturar.mjs` passa a descontar o recorte dos ancestrais: intersecta o retângulo do elemento com o de cada ancestral cujo `overflow-x` não é `visible`.
- AC-28: as capturas de cada faixa, desktop e celular, são revisadas uma a uma antes de publicar.

**Publicação**
- AC-29: `https://viniciusextremxd.github.io/protecin-site/` responde 200 com o build atual, e as 8 rotas e um caminho inexistente (404) respondem. `?motion=full&proposta=1` funciona.

---

## 17. Unidades de build

As unidades 2 a 7 rodam **em paralelo**, cada uma dona de arquivos distintos, e todas dependem só da `base`. A `integracao` roda por último.

Regras para todas:
- Não editar arquivo de outra unidade.
- Se faltar uma primitiva genérica, criar uma versão local dentro dos próprios arquivos e registrar no relatório.
- Todo texto vem de `site.ts`.
- **Pronto quer dizer:**
  - `npm run typecheck` passa;
  - a seção renderiza no sandbox em 1440×900 e em 390×844, em `?motion=full` e com reduce emulado, sem erro de console e sem rolagem horizontal;
  - cada elemento tem a coreografia da tabela correspondente.

### 17.1 `base`: fundação
Projeto Vite, configs, tokens, CSS, fontes, primitivas e hooks (§6), roteador, preferência de movimento, chrome e layout (§7), `site.ts` completo (§11), imagens e vídeos (§12) e o sandbox. Arquivos:
- **Raiz:** `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `dev.html`, `.gitignore`, `.claude/launch.json`.
- **Scripts:** `scripts/junctions.ps1`, `scripts/imagens.mjs`, `scripts/videos.mjs`.
- **Público:**
  - `public/fonts/archivo-latin-wdth-normal.woff2`, `public/fonts/jetbrains-mono-latin-wght-normal.woff2`;
  - `public/img/**` e `public/videos/**` (gerados);
  - `public/favicon.svg`, `public/apple-touch-icon.png`, `public/og-protecin.jpg`, `public/robots.txt`.
- **Dados e libs:**
  - `src/vite-env.d.ts`, `src/styles.css`;
  - `src/data/site.ts`, `src/data/imagens.gen.ts`, `src/data/videos.gen.ts`;
  - `src/lib/urls.ts`, `src/lib/track.ts`, `src/lib/smooth-scroll.ts`, `src/lib/router.tsx`, `src/lib/motion-pref.ts`, `src/lib/media.ts`.
- **Primitivas (`src/components/motion/`):** `tokens.ts`, `Reveal.tsx`, `SplitLines.tsx`, `SplitWords.tsx`, `ScrollLitText.tsx`, `ClipReveal.tsx`, `ParallaxMedia.tsx`, `DrawIcon.tsx`, `DrawPath.tsx`, `Rule.tsx`, `Odometer.tsx`, `TextScramble.tsx`, `TextRoll.tsx`, `WipeText.tsx`, `Magnetic.tsx`, `TiltCard.tsx`, `VelocityMarquee.tsx`, `CursorPreview.tsx`, `PinStage.tsx`, `SectionRise.tsx`, `DropWindow.tsx`, `Reel.tsx`, `FocusBrackets.tsx`, `StampBadge.tsx`, `Embers.tsx`, `index.ts`.
- **UI (`src/components/ui/`):** `cta.tsx`, `Img.tsx`, `CaptionedFigure.tsx`, `LazyVideo.tsx`, `Symbol.tsx`, `Logo.tsx`, `icones.ts`, `glifos.tsx`, `SectionLabel.tsx`, `Chip.tsx`, `ReservedSlot.tsx`.
- **Chrome (`src/components/chrome/`):** `MotionRoot.tsx`, `Preloader.tsx`, `Nav.tsx`, `Menu.tsx`, `PageCurtain.tsx`, `ScrollFuse.tsx`, `FloatingContact.tsx`, `MotionToggle.tsx`, `MotionToast.tsx`, `ProposalBadge.tsx`, `SkipLink.tsx`.
- **Layout (`src/components/layout/`):** `Container.tsx`, `Footer.tsx`, `PageHero.tsx`, `FaixaCta.tsx`.
- **Sandbox:** `src/dev/sandbox.tsx`.

Ordem:
1. `npm install`, depois `scripts/junctions.ps1`.
2. Copiar os woff2.
3. `npm run videos` (revisar os quadros do hero).
4. `npm run imagens`.
5. Primitivas e chrome.
6. `site.ts`.
7. Sandbox com uma página de teste de primitivas (`?s=__primitivas`, dentro de `src/dev/sandbox.tsx`).

O `index.html` aponta para `/src/main.tsx`, que só existe depois da integração. Até lá, use o sandbox.

### 17.2 `abertura-prova`: H0, H1, H2, H8 e Nossos Clientes
Arquivos:
- `src/sections/home/Abertura.tsx`, `src/sections/home/Escala.tsx`, `src/sections/home/Credibilidade.tsx`, `src/sections/home/Setores.tsx`;
- `src/sections/clientes/ClientesEscala.tsx`, `src/sections/clientes/SetoresEmpilhados.tsx`, `src/sections/clientes/Parceiros.tsx`;
- `src/sections/shared/marcas/LogoTile.tsx`.

Specs: §9 H0, H1, H2 e H8; §10.3.

### 17.3 `servicos`: H3 e capítulos de `/servicos/`
Arquivos: `src/sections/home/Servicos.tsx`, `src/sections/servicos/Capitulos.tsx`, `src/sections/servicos/Fitas.tsx`, `src/sections/servicos/FaixaAvcb.tsx`.

Specs: §9 H3; §10.2 (Capítulos, Fitas, Faixa AVCB).

### 17.4 `na-pratica-diagrama`: H4 e diagrama isométrico
Arquivos: `src/sections/shared/NaPratica.tsx`, `src/sections/shared/napratica/Hotspot.tsx`, `src/sections/shared/napratica/Chamadas.tsx`, `src/sections/servicos/Diagrama.tsx`, `src/sections/servicos/diagrama/iso.ts`, `src/sections/servicos/diagrama/IsoDiagram.tsx`.

Specs: §9 H4; §10.2.1.

### 17.5 `plataforma`: H5 e `/nosso-app/`
Arquivos:
- `src/sections/shared/Plataforma.tsx`;
- `src/sections/shared/plataforma/PhoneMock.tsx`, `src/sections/shared/plataforma/Telas.tsx`, `src/sections/shared/plataforma/DataPacket.tsx`;
- `src/sections/app/AppHero.tsx`, `src/sections/app/ComoFunciona.tsx`, `src/sections/app/Recursos.tsx`, `src/sections/app/TelasReais.tsx`, `src/sections/app/AppFecho.tsx`.

Specs: §9 H5; §10.5.

### 17.6 `historia-institucional`: H6, H7, H9 e Institucional
Arquivos: `src/sections/home/Diferenciais.tsx`, `src/sections/shared/Historia.tsx`, `src/sections/shared/Compromisso.tsx`, `src/sections/institucional/MissaoVisaoValores.tsx`, `src/sections/institucional/Sustentabilidade.tsx`.

Specs: §9 H6, H7 e H9; §10.1.

### 17.7 `conversao`: H10, formulário, Contato, Catálogo, Créditos e 404
Arquivos:
- `src/sections/shared/Orcamento.tsx`;
- `src/sections/shared/orcamento/OrcamentoForm.tsx`, `src/sections/shared/orcamento/Canais.tsx`, `src/sections/shared/orcamento/mascara.ts`;
- `src/sections/contato/ContatoAbertura.tsx`, `src/sections/contato/Mapa.tsx`;
- `src/sections/catalogo/CatalogoCapa.tsx`, `src/sections/catalogo/LinhaEquipamentos.tsx`;
- `src/sections/creditos/Creditos.tsx`, `src/sections/notfound/NotFound.tsx`.

Specs: §9 H10 e H10.1; §10.4, §10.6 e §10.7.

### 17.8 `integracao`: App, páginas, build, verificação e publicação
Arquivos:
- **App:** `src/main.tsx`, `src/App.tsx`, `src/entry-server.tsx`.
- **Páginas:** `src/pages/Home.tsx`, `src/pages/Institucional.tsx`, `src/pages/Servicos.tsx`, `src/pages/Clientes.tsx`, `src/pages/Catalogo.tsx`, `src/pages/NossoApp.tsx`, `src/pages/Contato.tsx`, `src/pages/Creditos.tsx`, `src/pages/NaoEncontrada.tsx`.
- **Scripts:** `scripts/prerender.mjs`, `scripts/verify.mjs`, `scripts/servir-estatico.mjs`, `scripts/medir-desempenho.mjs`, `scripts/deploy-gh.mjs`.
- **QA:** `qa/capturar.mjs`.
- **Documentos:** `TRACKING.md`, `DEPLOY.md`, `README.md`, `PENDENCIAS.md`.

Trabalho:
1. Montar as páginas na ordem de §8 (a Home insere `<ReservedSlot id="clientes" />` depois de Credibilidade).
2. `App.tsx`: `RouterProvider`, `MotionRoot`, `Preloader`, `SkipLink`, `ScrollFuse`, `Nav`, `<main key={path}>`, `Footer`, `FloatingContact`, `PageCurtain`, `MotionToast` e `ProposalBadge`.
3. `main.tsx`: `hydrateRoot` se houver prerender; senão `createRoot`.
4. `entry-server.tsx`: `render(url)`, `head(url)` e `structuredData()`.
5. Prerender multirrota: `dist/<rota>/index.html`, `dist/404.html` e `dist/sitemap.xml` a partir de `ROUTES`. Apaga `dist-server/`.
6. `servir-estatico.mjs` (`/protecin-site/`, pasta → `index.html`, cai no `404.html`).
7. `verify.mjs`:
   - 6 telas: 1440×900, 1366×657, 768×1024, 390×844, 320×720 e 844×390;
   - os testes de §16, incluindo axe-core (já instalado pela base) e a amostragem das cenas fixadas;
   - relatório em `verificacao/relatorio.json` com código de saída 1 se falhar.
8. Ajustar o `qa/capturar.mjs` (recorte dos ancestrais).
9. `deploy-gh.mjs`, com a trava de remoto `/ViniciusExtremXD\/protecin-site(\.git)?$/i`, cópia a partir do `realpathSync("dist")`, `.nojekyll` e push forçado só no branch `gh-pages`.
10. Configurar o Pages (`gh api repos/ViniciusExtremXD/protecin-site/pages`, origem `gh-pages /`).
    - Se o repositório for privado e o Pages não estiver disponível no plano, **parar e perguntar ao Vinicius**. Não mudar a visibilidade sem autorização.
11. Commitar o código-fonte num branch (`site-novo-demo`) e enviar.
12. Rodar `build:gh`, `verify --estatico`, `capturar` e Lighthouse, e revisar as capturas.

Por rodar depois de todas, a integração pode fazer correções pontuais em arquivos de outras unidades **só para passar no build, no verify ou no QA**, listando cada uma no relatório.

**Grafo de dependências:** `base` → (`abertura-prova`, `servicos`, `na-pratica-diagrama`, `plataforma`, `historia-institucional`, `conversao`) → `integracao`.

---

## 18. Pendências [confirmar com a Protecin], que vão para o `PENDENCIAS.md`

1. Arquivos oficiais do logo (SVG e versão negativa).
2. Autorização para publicar `4.jpg` e a foto dos cilindros como "Foto do acervo Protecin", sem nome nem local.
3. Natureza da relação com VESDA, Bosch, Firebee e Germek (a demo usa "Marcas com que trabalhamos"), e se a filiação a ABSpk e NFPA é formal.
4. Kids ONG: ano de início ("sete anos" foi escrito em 2025) e a frase "fundador da Protecin" contra "fundação pela Extimbrás".
5. Se o preço único de 1986 continua valendo (espaço reservado).
6. Logos de clientes autorizados, depoimentos e fotos ou vídeos reais (sede, frota, recarga, teste hidrostático, técnico usando o app). Eles substituem o material de banco e ligam os espaços reservados.
7. Conteúdo do PDF do catálogo e das 7 subpáginas de serviço (raspar antes da versão final).
8. Destino do formulário em produção (comercial@ ou falecom@) e a ativação do FormSubmit.
9. Política de privacidade (necessária para o aviso de cookies em produção).
10. Licenças das fotos de banco herdadas do site atual (para a página de créditos).
11. **Com o Gabriel:** ID do contêiner GTM (`VITE_GTM_ID`) e conversões do Ads nos acionadores de clique de link.
