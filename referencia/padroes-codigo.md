# Padrões de código herdados (Seven e Indafire) para o site novo da Protecin

Auditoria só de leitura feita em 28/10/2026. Nada foi alterado em `Seven/` nem em `Indafire/`.
Caminhos abaixo são relativos a `...\Freelance\Sites Grupo Alvo\`.

- **Seven** (`Seven/`): Extin Seven, React + Vite + Tailwind + framer-motion + Lenis, prerender por SSR no build,
  GTM só no domínio de produção, prévia em GitHub Pages. É a base direta da Protecin.
- **Indafire** (`Indafire/`): a pasta tem 3 gerações. A que importa para motion é `Indafire/site-novo/` (Astro 5,
  motor único `src/scripts/motion.ts` + CSS scroll-driven) e o pipeline de verificação `scripts/verify.mjs`
  (puppeteer-core + Chrome instalado). A raiz é uma réplica estática do WordPress (Python); `.worktrees/indafire-kinetic-redesign`
  é um experimento Next/vinext + React 19 + Tailwind 4 (não usar como base).

---

## 1. Stack e versões exatas (Seven)

`Seven/package.json` (faixas) e `Seven/package-lock.json` (instalado):

| Pacote | package.json | Instalado |
| --- | --- | --- |
| react / react-dom | ^18.3.1 | 18.3.1 |
| framer-motion | ^11.18.2 | 11.18.2 |
| lenis | ^1.1.20 | 1.1.20 |
| @phosphor-icons/react | ^2.1.10 | 2.1.10 |
| @fontsource-variable/archivo | ^5.1.1 | 5.1.1 (importado como `archivo/wdth.css`, eixo de largura) |
| @fontsource-variable/inter | ^5.1.1 | 5.3.0 |
| @fontsource-variable/jetbrains-mono | ^5.1.1 | 5.3.0 |
| vite | ^5.4.11 | 5.4.21 |
| @vitejs/plugin-react | ^4.3.4 | 4.7.0 |
| tailwindcss | ^3.4.17 | 3.4.19 |
| postcss / autoprefixer | ^8.4.49 / ^10.4.20 | 8.5.30 / 10.6.1 |
| typescript | ~5.6.3 | 5.6.3 |
| gh-pages | ^6.3.0 | 6.3.0 |
| cross-env | ^7.0.3 | 7.0.3 |
| @types/react / @types/react-dom / @types/node | ^18.3.12 / ^18.3.1 / ^22.20.5 | 18.3.31 / - / 22.20.5 |

Ambiente da máquina: Node v22.16.0, npm 10.9.2, gh 2.87.3 logado como `ViniciusExtremXD` com escopos
`gist, read:org, repo` (**sem `workflow`**: não dá para criar `.github/workflows`; por isso o deploy é por branch `gh-pages`).
Chrome em `C:\Program Files\Google\Chrome\Application\chrome.exe`; Edge em `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.

`package.json` do Seven (scripts, copiar e trocar a base):

```json
"scripts": {
  "dev": "vite --port 5175",
  "build": "tsc --noEmit && vite build && vite build --ssr src/entry-server.tsx --outDir dist-server && node scripts/prerender.mjs",
  "preview": "vite preview --port 5175",
  "build:gh": "cross-env VITE_BASE=/extin-seven/ npm run build",
  "deploy:gh": "npm run build:gh && gh-pages -d dist --nojekyll -m \"Deploy\""
}
```

Para a Protecin: outra porta (5175 é do Seven, 4351/4361 da Indafire) e `VITE_BASE=/<nome-do-repo>/`.

### Configs (copiar como estão)

`Seven/vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
});
```

`Seven/postcss.config.js`: `{ plugins: { tailwindcss: {}, autoprefixer: {} } }`.
`Seven/tsconfig.json`: ES2020, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `strict: true`, `noEmit`, `include: ["src"]`.

`Seven/tailwind.config.js` (estrutura; trocar a paleta pela da Protecin):

```js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink:   { 950: "#08080A", 900: "#0E0E11", 800: "#16161B", 700: "#222229", 600: "#2F2F38", 500: "#4A4A55" },
        fire:  { 200: "#FFC9C4", 300: "#FF8F86", 400: "#FF4F47", 500: "#E3121B", 600: "#C20E16", 700: "#8E0A10", 800: "#5C060A" },
        glow:  { 200: "#C9FFE0", 300: "#8DFFC0", 400: "#45F59A", 500: "#16D576", 600: "#0FA65C" },
        paper: { 50: "#FBFAF7", 100: "#F4F1EB", 200: "#E9E4DB", 300: "#D6CEC1", 400: "#A9A092" },
      },
      fontFamily: {
        display: ['"Archivo Variable"', "system-ui", "sans-serif"],
        sans: ['"Inter Variable"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.045em" },
      keyframes: {
        "pulse-ring": { "0%": { transform: "scale(1)", opacity: "0.6" }, "100%": { transform: "scale(1.9)", opacity: "0" } },
        scan: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(400%)" } },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2, 0.6, 0.3, 1) infinite",
        scan: "scan 3.2s linear infinite",
      },
    },
  },
  plugins: [],
};
```

`Seven/src/styles.css` traz utilitários que as seções usam: `.stretch-wide` (font-stretch 118%), `.stretch-xwide` (125%),
`.stretch-cond` (78%), `.tnum`, `.text-outline`, `.text-balance`, `.text-pretty`, `.no-scrollbar`, `.mask-fade-x`, `.mask-fade-b`,
`.bg-grid-dark` / `.bg-grid-light` (grade de 56 px), `.preserve-3d`, `.backface-hidden`, as regras do Lenis e o **grão de filme**:

```css
/* Seven/src/styles.css */
body { background: #08080a; color: #f4f1eb; overflow-x: clip; }

html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-stopped { overflow: hidden; }

.grain::after {
  content: ""; position: fixed; inset: -50%; z-index: 60; pointer-events: none; opacity: 0.05;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  animation: grain 1.2s steps(6) infinite;
}
@keyframes grain { 0%{transform:translate(0,0)} 20%{transform:translate(-3%,2%)} 40%{transform:translate(2%,-3%)} 60%{transform:translate(-2%,-1%)} 80%{transform:translate(3%,3%)} 100%{transform:translate(0,0)} }
```

`Seven/.claude/launch.json`: duas configurações, `extin-seven` (`npm run dev`, 5175) e `extin-seven-prod`
(`npx vite preview --port 4180 --strictPort`). Repetir o padrão com portas novas.

`Seven/.gitignore` ignora `node_modules/ dist/ dist-ssr/ dist-server/ deploy/ evidencias-gabriel/ *.local`.

### Estrutura de pastas do Seven

```
index.html               SEO, OG, geo, GTM só em produção, <!--structured-data-->, noscript do preloader
public/                  .htaccess (Hostinger), 404.html, robots.txt, sitemap.xml, politica-de-privacidade.html, images/
scripts/prerender.mjs    injeta o HTML do SSR e o JSON-LD em dist/index.html
src/main.tsx             hydrateRoot se houver prerender, createRoot no dev
src/App.tsx              ordem das seções, MotionConfig, Lenis
src/entry-server.tsx     render() + structuredData() (só no build)
src/lib/smooth-scroll.ts Lenis + âncoras + lockScroll
src/components/          motion.tsx, Embers.tsx, chrome.tsx (preloader, nav, flutuante, cookies, vídeo), cta.tsx, ContactForm.tsx
src/sections/            Hero, Problem, Services, Structure, Dashboard, Process, Lithex, Products, Works, Faq, FinalCta, Coverage, Footer
src/data/site.ts         TODO o conteúdo + helpers (assetUrl, buildWhatsAppUrl, pushEvent, trackLead)
TRACKING.md / VALIDACAO.md / DEPLOY.md / EMAIL-MIGRACAO.md   (não há README no Seven)
```

---

## 2. Boot da aplicação

`Seven/src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/jetbrains-mono";
import "./styles.css";
import App from "./App";

const root = document.getElementById("root")!;
const app = (<React.StrictMode><App /></React.StrictMode>);

// Production HTML is prerendered (scripts/prerender.mjs); dev starts from an empty root.
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
```

`Seven/src/App.tsx` (esqueleto):

```tsx
export default function App() {
  const [ready, setReady] = useState(false);          // libera a entrada do hero depois do preloader
  const [videoOpen, setVideoOpen] = useState(false);
  const onIntroDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    const stopScroll = initSmoothScroll();
    const unbind = bindAnchorLinks();
    return () => { stopScroll(); unbind(); };
  }, []);

  return (
    // Muitos PCs Windows reportam prefers-reduced-motion só porque "efeitos de animação" está desligado:
    // o movimento é o pedido do cliente, então as animações sempre rodam.
    <MotionConfig reducedMotion="never">
      <Preloader onDone={onIntroDone} />
      <ScrollProgress />
      <Nav />
      <main className="grain">
        <Hero ready={ready} />
        {/* ...seções... */}
      </main>
      <Footer />
      <FloatingContact />
      <CookieNotice />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </MotionConfig>
  );
}
```

---

## 3. Smooth scroll (Lenis)

`Seven/src/lib/smooth-scroll.ts`, copiar inteiro. Pontos: instância única; `lerp 0.11`; RAF próprio; se o preloader já
travou a página antes do Lenis existir, ele nasce parado; âncoras `href="#..."` passam por `scrollToHash` com offset da nav
(-84 px); `#topo` vai para 0; `lockScroll` trava Lenis e `overflow` do `<html>` (menu, vídeo, preloader).

```ts
import Lenis from "lenis";

let lenis: Lenis | null = null;
const NAV_OFFSET = -84;

export function initSmoothScroll() {
  if (lenis) return () => {};
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95 });
  // The intro may already have locked the page before Lenis existed.
  if (document.documentElement.style.overflow === "hidden") lenis.stop();
  let frame = 0;
  const raf = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(raf); };
  frame = requestAnimationFrame(raf);
  return () => { cancelAnimationFrame(frame); lenis?.destroy(); lenis = null; };
}

export function scrollToHash(hash: string) {
  const target = hash === "#topo" ? 0 : document.querySelector<HTMLElement>(hash);
  if (target === null) return;
  if (lenis) lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.4 });
  else if (target === 0) window.scrollTo({ top: 0, behavior: "smooth" });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET, behavior: "smooth" });
}

export function lockScroll(locked: boolean) {
  if (lenis) { if (locked) lenis.stop(); else lenis.start(); }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Routes every in-page anchor click through the smooth scroller. */
export function bindAnchorLinks() {
  const onClick = (event: MouseEvent) => {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor) return;
    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;
    event.preventDefault();
    scrollToHash(hash);
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
```

Overlays com rolagem própria e carrosséis de arrastar levam `data-lenis-prevent` (menu mobile em `chrome.tsx`,
`SwipeWorks` em `sections/Works.tsx`).

---

## 4. Biblioteca de motion (`Seven/src/components/motion.tsx`, 297 linhas)

Copiar o arquivo inteiro. Easings do projeto: `EASE_OUT = [0.16, 1, 0.3, 1]` e `EASE_IN_OUT = [0.65, 0, 0.35, 1]`
(também usados em classes Tailwind `ease-[cubic-bezier(0.16,1,0.3,1)]`).

| Componente | O que faz | Onde é usado |
| --- | --- | --- |
| `Reveal` | fade + sobe 28 px ao entrar (`whileInView`, `once`, margem -12%), `as` div/li/p/span | quase todo bloco de texto |
| `SplitWords` | título palavra a palavra, máscara `overflow-hidden`, `y 110% → 0` + `rotate 4 → 0`, stagger 0.06; `immediate` para o hero; `highlight` pinta palavras | todo H1/H2 |
| `ScrollLitText` | parágrafo cujas palavras acendem (opacidade 0.14 → 1) conforme rola; `*palavra*` vira destaque | Problem |
| `Magnetic` | filho puxado pelo ponteiro (spring), só `pointerType === "mouse"` | CTAs primários, botão de play |
| `Counter` | conta de 0 ao valor ao ficar visível; **começa no valor final** para o HTML prerenderizado ter o número real | Structure, Dashboard |
| `VelocityMarquee` | fita infinita (4 cópias, wrap -25%..0%) que acelera e inverte com a velocidade da rolagem | Hero, Lithex |
| `SectionLabel` | rótulo "02 — Serviços" em mono com ponto pulsante (`animate-pulse-ring`) | toda seção |
| `ParallaxImage` | imagem com `y` de -amount% a +amount% pelo scroll e escala compensada | disponível |
| `ClipReveal` | cortina `clip-path: inset(...)` de baixo/esquerda/direita com cantos 28 px | mapa (Coverage) |

Trechos principais:

```tsx
// Seven/src/components/motion.tsx
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export function Reveal({ children, delay = 0, y = 28, className, as = "div" }: {...}) {
  const Comp = motion[as];
  return (
    <Comp className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.9, ease: EASE_OUT, delay }}>
      {children}
    </Comp>
  );
}

export function SplitWords({ text, className, wordClassName, delay = 0, stagger = 0.06, immediate = false,
  highlight = [], highlightClassName = "text-fire-500" }: {...}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = immediate || inView;
  const words = text.split(" ");
  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className={`inline-block ${wordClassName ?? ""} ${highlight.includes(word) ? highlightClassName : ""}`}
            initial={{ y: "110%", rotate: 4 }}
            animate={show ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1, ease: EASE_OUT, delay: delay + i * stagger }}>
            {word}{i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Counter({ to, duration = 1.8, className, suffix = "", prefix = "" }: {...}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [value, setValue] = useState(to); // valor final no prerender
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration, ease: EASE_OUT, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, duration]);
  return <span ref={ref} className={`tnum ${className ?? ""}`}>{prefix}{value.toLocaleString("pt-BR")}{suffix}</span>;
}

const wrap = (min: number, max: number, v: number) => { const r = max - min; return ((((v - min) % r) + r) % r) + min; };

export function VelocityMarquee({ children, baseVelocity = -3, className }: {...}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 1.2], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);
  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1; else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });
  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className ?? ""}`}>
      <motion.div className="flex flex-nowrap" style={{ x }}>
        {[0, 1, 2, 3].map((i) => <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>{children}</div>)}
      </motion.div>
    </div>
  );
}

export function ParallaxImage({ src, alt, className, imgClassName, amount = 12, eager = false }: {...}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async"
        style={{ y, scale: 1 + amount / 50 }} className={`h-full w-full object-cover ${imgClassName ?? ""}`} />
    </div>
  );
}

export function ClipReveal({ children, className, delay = 0, from = "bottom" }: {...}) {
  const hidden = { bottom: "inset(100% 0% 0% 0% round 28px)", left: "inset(0% 100% 0% 0% round 28px)",
                   right: "inset(0% 0% 0% 100% round 28px)" }[from];
  return (
    <motion.div className={className} initial={{ clipPath: hidden }} whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2, ease: EASE_IN_OUT, delay }}>
      {children}
    </motion.div>
  );
}
```

`Magnetic` (mesmo arquivo): `useMotionValue` x/y + `useSpring({ stiffness: 220, damping: 16, mass: 0.4 })`,
`onPointerMove` calcula a distância ao centro vezes `strength` (padrão 0.35), `onPointerLeave` zera.

---

## 5. Partículas (`Seven/src/components/Embers.tsx`, copiar inteiro)

Canvas 2D com brasas subindo: gradiente radial por partícula, `globalCompositeOperation = "lighter"`, oscilação
senoidal em x, vida com fade `sin(life/max * PI)`. Desempenho: `dpr` limitado a 2, densidade x0.45 abaixo de 768 px,
**pausa fora da tela** com IntersectionObserver, `resize` refaz o canvas. Uso: `<Embers className="-z-10" />` dentro de
`section.relative.isolate`.

```tsx
export function Embers({ density = 70, className }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let w = 0, h = 0, frame = 0, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const count = window.innerWidth < 768 ? Math.round(density * 0.45) : density;
    const spawn = (initial = false): Ember => ({
      x: Math.random() * w, y: initial ? Math.random() * h : h + 10, r: Math.random() * 1.8 + 0.4,
      vy: Math.random() * 0.7 + 0.25, vx: (Math.random() - 0.5) * 0.3, life: 0,
      max: Math.random() * 420 + 260, hue: Math.random() * 30 + 2,
    });
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const embers: Ember[] = Array.from({ length: count }, () => spawn(true));
    let t = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      t += 0.01; ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]; e.life++; e.y -= e.vy; e.x += e.vx + Math.sin(t * 2 + i) * 0.25;
        const fade = Math.sin((e.life / e.max) * Math.PI);
        if (e.life > e.max || e.y < -10) { embers[i] = spawn(); continue; }
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 6);
        g.addColorStop(0, `hsla(${e.hue + 20}, 100%, 70%, ${0.9 * fade})`);
        g.addColorStop(0.35, `hsla(${e.hue}, 100%, 50%, ${0.35 * fade})`);
        g.addColorStop(1, "hsla(0, 100%, 40%, 0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 6, 0, Math.PI * 2); ctx.fill();
      }
    };
    frame = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); io.disconnect(); window.removeEventListener("resize", resize); };
  }, [density]);
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`} />;
}
```

---

## 6. "Chrome" da página (`Seven/src/components/chrome.tsx`)

- **Preloader**: sempre renderizado no primeiro paint (entra no HTML prerenderizado, a hidratação bate). Trava a rolagem,
  ponteiro SVG gira de vermelho para verde (`rotate: [-80, 70, 52]`, `times [0, .75, 1]`), logo sobe, texto em mono.
  Sai com `exit={{ clipPath: "inset(0% 0% 100% 0%)" }}` (cortina sobe) e `onExitComplete={() => lockScroll(false)}`.
  Intro completa (1650 ms) uma vez por sessão (`sessionStorage "es-intro"` em try/catch), depois só 350 ms.
  `index.html` tem `<noscript><style>.es-preloader{display:none!important}</style></noscript>`.
- **ScrollProgress**: `useScroll().scrollYProgress` + `useSpring({ stiffness: 120, damping: 24, mass: 0.3 })` em `scaleX`
  de uma barra fixa de 3 px.
- **Nav**: `useMotionValueEvent(scrollY, "change")` → `solid` acima de 40 px, `hidden` quando desce e passou de 420 px
  (e o menu está fechado); `animate={{ y: hidden ? "-120%" : "0%" }}`. Pílula branca com `backdrop-blur-xl`.
  Links com rolagem de texto duplicado no hover (dois spans, `group-hover:-translate-y-full`).
  Menu mobile em tela cheia: `clipPath: circle(0% at calc(100% - 44px) 44px)` → `circle(150% ...)`, `data-lenis-prevent`,
  links sobem com stagger 0.06 e numeração `01..`, CTAs no rodapé do menu; `lockScroll(true)` enquanto aberto.
- **FloatingContact**: aparece depois de 640 px. Celular: barra inferior (`md:hidden`) com WhatsApp + telefone e
  `pb-[max(0.75rem,env(safe-area-inset-bottom))]`. Desktop: botão verde `#25D366` entra com spring girando
  (`scale 0, rotate -90`), anel pulsante e rótulo "Falar agora" que abre no hover (`max-w-0 → max-w-[160px]`).
- **CookieNotice** (LGPD, informativo): só no cliente (fora do prerender), aparece após 2,5 s, lembra em
  `localStorage "es-cookies-ok"` com try/catch, link para `politica-de-privacidade.html` via `assetUrl`.
- **VideoModal**: lightbox `youtube-nocookie.com/embed/<id>?autoplay=1&rel=0`, Esc fecha, `lockScroll`, `role="dialog"`.

Trecho da nav (padrão de esconder ao descer):

```tsx
const { scrollY } = useScroll();
const [hidden, setHidden] = useState(false);
const [solid, setSolid] = useState(false);
useMotionValueEvent(scrollY, "change", (y) => {
  const prev = scrollY.getPrevious() ?? 0;
  setSolid(y > 40);
  setHidden(y > prev && y > 420 && !open);
});
// <motion.header animate={{ y: hidden ? "-120%" : "0%" }} transition={{ duration: 0.5, ease: EASE_OUT }}>
```

---

## 7. Técnicas de motion por seção (Seven)

| Seção | Técnica | Detalhe reaproveitável |
| --- | --- | --- |
| `Hero.tsx` | brilho que segue o ponteiro | `useMotionTemplate\`radial-gradient(600px circle at ${sx}px ${sy}px, rgba(227,18,27,0.22), transparent 60%)\`` com springs `stiffness 60` |
| `Hero.tsx` | saída com parallax | `useScroll({ target, offset: ["start start","end start"] })` → conteúdo `y 0→18%`, `opacity 1→0`; visual `y 0→-10%` |
| `Hero.tsx` | palavra que gira | `RotatingWord`: `AnimatePresence mode="popLayout"`, troca a cada 2,8 s, `y 100% → 0 → -100%` |
| `Hero.tsx` | foto que abre | `clipPath inset(100% ... round 32px) → inset(0)` + `img scale 1.35 → 1.04` em 2,2 s; segunda foto entra girando (`rotate -6 → -3`) |
| `Hero.tsx` | fita + atmosfera | `VelocityMarquee baseVelocity={-0.6}`, grade `bg-grid-dark mask-fade-b`, blobs com `blur-[140px]`, `<Embers/>` |
| `Problem.tsx` | texto que acende + cortina antes/depois | `ScrollLitText`; `CurtainCompare`: `useMotionValue(100)` → `clipPath inset(0 0 0 v%)`, intro anima até 50% ao entrar, arraste por pointer (touch só assume após 8 px na horizontal), teclado com setas/Home/End, `role="slider"` |
| `Services.tsx` | filtro com pílula deslizante | `LayoutGroup` + `motion.span layoutId="svc-pill"` (spring 380/30) |
| `Services.tsx` | prévia que segue o cursor | imagem 288x224 com `x/y` em spring, aparece com `scale .6→1, rotate -4` ao passar o mouse na linha |
| `Services.tsx` | acordeão | `animate={{ height: isOpen ? "auto" : 0 }}`; conteúdo **sempre no DOM** (SEO no prerender); itens da lista entram com stagger; imagem abre com `clipPath` lateral |
| `Structure.tsx` | contadores + vídeo | `Counter`; botão de play `Magnetic` com texto circular SVG girando (`rotate: 360`, 14 s, `repeat: Infinity`); imagem com `scale 1.25 → 1` no scroll |
| `Dashboard.tsx` | painel que "deita" | `perspective: 1600` + `rotateX 24→0`, `scale .86→1`, `y 80→0` com `offset ["start end","center center"]` |
| `Process.tsx` | linha do tempo dirigida pela rolagem | barra `scaleY: progress` (spring 90/22) + bolinha com `top` em % + etapa ativa por `useInView(margin -45%)` mudando cor/escala/opacidade |
| `Lithex.tsx` | termômetro dirigido pela rolagem | `useTransform` encadeado: `temp 100→18`, altura em %, cor `#E3121B→#16D576`, rótulo "Crítico"/"Controlado" |
| `Products.tsx` | cartão com inclinação 3D | `TiltCard`: `perspective 900`, `rotateX/rotateY ±7` por springs a partir da posição do ponteiro |
| `Works.tsx` | galeria horizontal fixada | desktop: seção com altura `100vh + distância`, `sticky top-0`, `x = useTransform(spring(scrollYProgress), [0,1], [0,-distance])`, imagens com parallax interno `x 0→-18%`; celular: `snap-x` nativo com `data-lenis-prevent` |
| `FinalCta.tsx` | seção que "arredonda" e letreiro gigante | `borderTopLeftRadius 80→0` pelo scroll; texto `22vw` com `x 12%→-6%`; montador de orçamento com chips `whileTap scale .94`, abas WhatsApp/E-mail com `layoutId="orc-mode"` |
| `Coverage.tsx` | mapa | `ClipReveal` em volta do iframe do Google Maps; `pushEvent("map_directions_click")` |
| `Faq.tsx` | acordeão | ícone `+` gira 135 graus e pinta; primeira pergunta aberta; `pushEvent("faq_open")` |

Galeria fixada (o padrão mais "vendável" para obras/portfólio):

```tsx
// Seven/src/sections/Works.tsx
function useIsDesktop() {
  // false no primeiro render: o HTML prerenderizado e a hidratação concordam; troca logo depois de montar.
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesktop(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

function PinnedWorks() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  useEffect(() => {
    const measure = () => { const t = trackRef.current; if (t) setDistance(t.scrollWidth - window.innerWidth + 64); };
    measure(); window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return (
    <section ref={ref} id="obras" className="relative bg-ink-950" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* cabeçalho + barra de progresso com scaleX: smooth */}
        <motion.div ref={trackRef} style={{ x }} className="flex gap-6 pl-8 will-change-transform">{/* cards */}</motion.div>
      </div>
    </section>
  );
}
```

---

## 8. CTAs e padrão de tracking

### Helpers em `Seven/src/data/site.ts`

```ts
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.endsWith("/") ? base : `${base}/`}${path.replace(/^\//, "")}`;
}

export const DEFAULT_WA_MESSAGE = "Olá! Vim pelo site da Extin Seven e gostaria de um orçamento de segurança contra incêndio.";
export function buildWhatsAppUrl(message: string = DEFAULT_WA_MESSAGE): string {
  return `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export type LeadChannel = "whatsapp" | "phone" | "email";

export function pushEvent(event: string, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;            // seguro no SSR do prerender
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}

export function trackLead(channel: LeadChannel, location: string, detail?: string, extra: Record<string, string> = {}) {
  pushEvent("lead_click", { lead_channel: channel, lead_location: location, lead_detail: detail, ...extra });
}
```

`COMPANY` guarda `phoneDisplay`, `phoneTel` (`tel:...`), `whatsappDisplay`, `whatsappNumber` (`55DDDnúmero`), `email`,
`address`, `mapsUrl`, `youtubeId`, `socials`. Todo o conteúdo (serviços com `id/category/title/norm/cadence/pitch/specs/image/icon/wa`,
processo, produtos, obras, cidades, setores, FAQ, `SEO_INDEX`, `NAV_LINKS`) mora em `site.ts`. Ícones Phosphor tipados como `Icon`.

### Links de lead (`Seven/src/components/cta.tsx`)

Todo CTA é um `<a>` de verdade (`https://wa.me/...` ou `tel:`), porque as conversões do Ads disparam em clique de link.
Além disso: `data-lead-channel` (`whatsapp|phone|email`), `data-lead-location` (seção) e `lead_click` no dataLayer.

```tsx
export function WhatsAppLink({ message, location, detail, extra, children, onClick, ...rest }: AnchorProps & TrackProps & { message?: string }) {
  return (
    <a href={buildWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer"
       data-lead-channel="whatsapp" data-lead-location={location}
       onClick={(e) => { trackLead("whatsapp", location, detail, extra); onClick?.(e); }} {...rest}>
      {children}
    </a>
  );
}

export function PhoneLink({ location, detail, children, onClick, ...rest }: AnchorProps & TrackProps) {
  return (
    <a href={COMPANY.phoneTel} data-lead-channel="phone" data-lead-location={location}
       onClick={(e) => { trackLead("phone", location, detail); onClick?.(e); }} {...rest}>
      {children}
    </a>
  );
}
```

`PrimaryCta` (pílula vermelha): `Magnetic strength 0.25`, varredura de fundo `scale-x-0 → group-hover:scale-x-100`
(`origin-left`, 500 ms), seta que sai pela diagonal e outra que entra (duas `ArrowUpRight` com translate), sombra colorida.
`PhoneCta`: borda, ícone gira 12 graus no hover. `EmailFormLink`: vai para `#orcamento`, dispara
`window.dispatchEvent(new Event(OPEN_FORM_EVENT))` (a seção troca para a aba de e-mail) e `form_open`.

Valores de `lead_location` no Seven: `hero, nav, menu_mobile, barra_mobile, botao_flutuante, risco, servicos, gestao_online,
como_funciona, lithex, produtos, faq, orcamento, formulario, onde_estamos, rodape`. `lead_detail` = serviço/produto clicado.

Eventos (Seven/TRACKING.md): `lead_click`, `service_open`, `faq_open`, `video_play`, `map_directions_click`,
`compare_interact`, `form_open`, `form_lead`.

### GTM só no domínio de produção (`Seven/index.html`)

```html
<link rel="preconnect" href="https://www.googletagmanager.com" />
<!--
  Google Tag Manager — loads only on the production domain, so previews (GitHub Pages,
  localhost) never send hits or conversions to the client's GA4 / Google Ads.
  To test on a preview, open it with ?gtm_debug=x (Tag Assistant does this) or ?track=1.
-->
<script>
  (function (w, d, s, l, i) {
    var prod = /(^|\.)extinseven\.com\.br$/.test(w.location.hostname);
    var debug = /[?&](gtm_debug|track)=/.test(w.location.search);
    w[l] = w[l] || [];
    if (!prod && !debug) return;
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", "GTM-KQNM8MZM");
</script>
```

Para a Protecin: regex `/(^|\.)protecin\.com\.br$/` e o ID do container da Protecin (ainda pendente: GTM e Ads são as
pendências do lado do Gabriel; não inventar ID). O `dataLayer` existe mesmo sem GTM, então os `pushEvent` não quebram na prévia.

No GTM do Seven (v12-v14): variáveis DLV `lead_channel, lead_location, lead_detail, lead_needs, lead_property, lead_city`,
acionador de evento personalizado `lead_click`, tag `GA4 - generate_lead`. Conversões do Ads ficam nos acionadores de
**clique em link** (`Click URL` contém `wa.me` / começa com `tel:`) para não contar duas vezes; `lead_click` é para análise.

---

## 9. Formulário (`Seven/src/components/ContactForm.tsx`)

- Site estático: envia `POST` JSON para FormSubmit, `FORM.endpoint = https://formsubmit.co/ajax/${COMPANY.email}`,
  com `_subject`, `_template: "table"`, `_captcha: "false"`, campos, `page: window.location.href`, `_honey: ""`.
- Validação nativa (`checkValidity/reportValidity`) + telefone com pelo menos 10 dígitos.
- Anti-spam: campo `_honey` fora da tela e tempo mínimo de 1,5 s desde a montagem; se suspeito, finge sucesso e não envia.
- `AbortController` com timeout de 15 s; sucesso só se `body.success === true || "true"`.
- Sucesso: bloco com classe **`msg-sucesso`** (o acionador "Envio de Formulário" do GTM observa visibilidade dela),
  `pushEvent("form_lead", ...)` + `trackLead("email", "formulario", "orcamento", ...)`.
- Erro: mensagem + links de reserva `mailto:` (corpo montado com o resumo) e WhatsApp.
- Ativação: o primeiro envio para um endereço novo manda e-mail de ativação; até alguém clicar, nada é entregue
  (no Seven isso ainda está pendente com o cliente, ver `VALIDACAO.md`).

```tsx
if (status === "success") {
  return (
    // Sem animação de opacidade neste wrapper: o acionador de visibilidade do GTM mede ele.
    <motion.div className="msg-sucesso ..." role="status" initial={{ y: 16, scale: 0.98 }} animate={{ y: 0, scale: 1 }}>
      ...
    </motion.div>
  );
}
```

---

## 10. Build, prerender e deploy

### Prerender (`Seven/scripts/prerender.mjs`)

Fluxo do `npm run build`: `tsc --noEmit` → `vite build` (cliente em `dist/`) → `vite build --ssr src/entry-server.tsx --outDir dist-server`
→ `node scripts/prerender.mjs`, que importa `dist-server/entry-server.js`, troca `<div id="root"></div>` pelo HTML do
`renderToString(<App/>)`, troca `<!--structured-data-->` pelos JSON-LD e apaga `dist-server/`. No Seven o `dist/index.html`
fica com ~268 kB.

```js
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const htmlPath = path.join(root, "dist", "index.html");
const serverEntry = path.join(root, "dist-server", "entry-server.js");
const { render, structuredData } = await import(pathToFileURL(serverEntry).href);

const appHtml = render();
const jsonLd = structuredData()
  .map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`)
  .join("\n    ");

let html = fs.readFileSync(htmlPath, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("root placeholder not found in dist/index.html");
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
html = html.replace("<!--structured-data-->", jsonLd);
fs.writeFileSync(htmlPath, html);
fs.rmSync(path.join(root, "dist-server"), { recursive: true, force: true });
console.log(`prerender: ${(appHtml.length / 1024).toFixed(1)} kB of HTML injected`);
```

`Seven/src/entry-server.tsx` exporta `render()` e `structuredData()` com 3 objetos: `ProfessionalService` (nome, url,
logo, telefone, e-mail, endereço, geo, `areaServed` a partir de `CITIES`, `contactPoint`, `sameAs` das redes,
`hasOfferCatalog` a partir de `SERVICES`), `FAQPage` a partir de `FAQ` e `WebSite`. Para a Protecin, preencher só com dados reais.

Consequência para os componentes: tudo que depende de `window`/`matchMedia`/storage fica em `useEffect`
(ex.: `useIsDesktop` começa `false`, `CookieNotice` só no cliente, `Counter` começa no valor final).

### `index.html`

Usa `%BASE_URL%` para favicon, apple-touch-icon e preload da imagem do hero (funciona com `VITE_BASE`).
Tem `canonical`, `og:*`, `twitter:*`, `geo.region/placename/position`, `ICBM`, `theme-color`, `format-detection telephone=no`.
Imagens no código passam por `assetUrl("images/...")`.

### Deploy da demo

- Seven: `npm run deploy:gh` = `build:gh` (`cross-env VITE_BASE=/extin-seven/`) + `gh-pages -d dist --nojekyll -m "Deploy"`.
  Pages (API conferida): `source: gh-pages /`, `build_type: legacy`, `https://viniciusextremxd.github.io/extin-seven/`.
- Indafire site-novo usa um `scripts/deploy-gh.mjs` próprio (sem o pacote gh-pages): copia `dist/` para um temp, cria
  `.nojekyll`, `git init -b gh-pages`, commit e `push --force` para o remoto, **com trava de remoto** (só publica se
  `origin` casar com o repositório esperado, para nunca sobrescrever o gh-pages de outro projeto). Bom reforço para a Protecin.
- Produção do Seven (Hostinger) é outro fluxo: `npm run build` (base `/`) + zip do `dist/` (ver `Seven/DEPLOY.md`);
  `public/.htaccess` faz https+www canônico só no domínio real, 301 das URLs antigas para âncoras, deflate, cache e `ErrorDocument 404`.
- Prévia não deve ser indexada: a Indafire põe `noindex, nofollow` no build do Pages (`PUBLIC_PREVIA`). O Seven não faz isso
  no `build:gh`. Para a Protecin vale adicionar `<meta name="robots" content="noindex">` quando `VITE_BASE` não for `/`.

---

## 11. Scripts de verificação

**Seven não tem script de verificação** (só `scripts/prerender.mjs`, nenhum puppeteer no projeto). A conferência foi manual
pela prévia do `.claude/launch.json` (dev 5175 e `vite preview` 4180) e pelos checklists de `VALIDACAO.md`.

O pipeline automático está em `Indafire/site-novo/scripts/` (portado da Pró Equipamento, que portou do Vale):

- **Motor**: `puppeteer-core` (instalado 24.43.1, faixa `^24.1.1`) dirigindo o **Chrome instalado**, procurado nesta ordem:
  `C:\Program Files\Google\Chrome\Application\chrome.exe`, `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`,
  `%USERPROFILE%\AppData\Local\Google\Chrome\Application\chrome.exe`, `/usr/bin/google-chrome`, Chrome do macOS.
  `headless: 'new'`, args `--no-sandbox --disable-dev-shm-usage --force-color-profile=srgb --hide-scrollbars`.
- **Perfil em caminho curto** no temp (`os.tmpdir()/ifch<pid>`): o Chrome recusa perfil em caminho longo (MAX_PATH).
- Sobe o próprio servidor (porta diferente da do dev) e recusa rodar se a porta já responde; usa `127.0.0.1`, não `localhost`
  (no Windows `localhost` vai primeiro para `::1` e um dev server esquecido responderia no lugar). Mata a árvore com `taskkill /T /F`.
- `--estatico`: serve `dist/` com `servir-estatico.mjs`, que imita o GitHub Pages (base, pasta → index.html, 404.html).
- 6 viewports: 1440x900, 390x844, 320x720, 844x390 (deitado), 768x1024, 1366x657; com `prefers-reduced-motion: reduce`
  emulado (o site ignora a preferência, então as revelações precisam disparar mesmo assim).
- Checagens por página/viewport: zero elemento invisível (opacidade **efetiva**, multiplicando ancestrais), zero erro de
  console (com lista de ruído: favicon, extensões, Kaspersky, `[vite]`, Maps), zero overflow horizontal com o culpado nomeado,
  todas as revelações disparadas depois de rolar a página inteira em passos de 60% da tela, **cobertura de animação**
  (porcentagem de elementos com texto/mídia que estão sob algo animado), curva de entrada medida quadro a quadro
  (pelo menos 5 valores distintos e 3 intermediários: gradual, não salto), página com **JS desligado** sem nada invisível,
  página com `animation:none;transition:none` forçado desde o primeiro quadro sem nada invisível, canonical correto, screenshots.
- Uma vez: todos os links `wa.me` no formato `^https://wa.me/55\d{10,11}(\?text=|$)`, sem `+` literal nem `undefined`;
  vídeos e posters respondem 200; interações (menu mobile abre, trava a rolagem, fecha no Esc; "Monte sua mensagem"
  abre o WhatsApp com o texto certo, interceptando `window.open`).
- Saída: `verificacao/relatorio.json`, PNGs e código de saída 1 se houver falha.
- Outros: `medir-desempenho.mjs <url> --cpu 4 [--mobile]` (fps e quadros travados rolando com a roda, CPU 4x),
  `capturar.mjs /rota desktop|mobile|mini` (dobra a dobra), `capturar-hero.mjs`, `capturar-matriz.mjs`.

Núcleo do lançamento (copiar e adaptar):

```js
// Indafire/site-novo/scripts/verify.mjs
import puppeteer from 'puppeteer-core';
const CHROMES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'),
  '/usr/bin/google-chrome',
];
const acharChrome = () => { for (const c of CHROMES) if (existsSync(c)) return c; throw new Error('Chrome não encontrado'); };

const perfil = path.join(os.tmpdir(), `ifch${process.pid % 10000}`);   // caminho CURTO
const navegador = await puppeteer.launch({
  executablePath: acharChrome(), headless: 'new', userDataDir: perfil,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb', '--hide-scrollbars'],
});
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

// opacidade efetiva (o que realmente aparece)
const opacidadeEfetiva = (el) => { let op = 1, cur = el; while (cur && cur.nodeType === 1) { op *= parseFloat(getComputedStyle(cur).opacity); cur = cur.parentElement; } return op; };

// rolar a página inteira para disparar as revelações
await page.evaluate(async () => {
  const passo = Math.round(window.innerHeight * 0.6), alvo = document.documentElement.scrollHeight;
  for (let y = 0; y < alvo; y += passo) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 170)); }
  window.scrollTo(0, alvo); await new Promise((r) => setTimeout(r, 700));
  window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400));
});

// animation:none desde o primeiro quadro
await semAnim.evaluateOnNewDocument(() => {
  const aplicar = () => { const s = document.createElement('style');
    s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
    (document.head || document.documentElement).appendChild(s); };
  if (document.documentElement) aplicar(); else document.addEventListener('DOMContentLoaded', aplicar);
});
```

Adaptação necessária para React + framer-motion: o verify da Indafire reconhece animação por atributos
(`data-reveal`, `data-split`, `data-contador`, `data-marquee`...) e por `animationName`. Com framer-motion a animação é
style inline via JS, então: (a) marcar os wrappers de motion com um atributo (ex.: `data-motion` em `Reveal`, `SplitWords`,
`ClipReveal`, `Counter`, `VelocityMarquee`, `ParallaxImage`) e incluir esse atributo em `cobertoPorAnimacao`; (b) o
`puppeteer-core` precisa ser instalado no projeto da Protecin (o Seven não tem; existe uma cópia em
`C:\DevCache\indafire-novo\node_modules`); (c) com Lenis, rolar com `window.scrollTo` funciona, mas a curva precisa
esperar o lerp (ou parar o Lenis no teste).

---

## 12. Técnicas de motion mais fortes da Indafire (site-novo, Astro 5)

Arquitetura: o HTML só declara intenção (`data-reveal="sobe|left|right|scale|fade|clip|pop|giro|vira|desenho|brota|inclina"`,
`data-reveal-filhos`, `data-reveal-grupo`, `data-split`, `data-contador`, `data-marquee`, `data-glow`, `data-magnetico`,
`data-paralaxe`, `data-flutua`, `data-deriva`, `data-deriva-x`, `--i` para stagger) e um único `src/scripts/motion.ts`
(787 linhas) liga tudo. O que acompanha a rolagem é **CSS scroll-driven** (`animation-timeline: view()/scroll()`) dentro de
`@supports`, no compositor, sem JS por quadro.

Momentos-assinatura (README do site-novo):
1. Hero dividido: painel de vídeo chega da direita, um fio vermelho corre pela borda.
2. **O vídeo toma a tela**: hero com `height: 220vh`, palco `sticky`, `.hero__tela` anima `translate: var(--dx) var(--dy)` +
   `scale(var(--escala-cheia))` com `animation-timeline: scroll(root); animation-range: 6vh 100vh`. O JS só mede uma vez
   (e no resize/fontes) o deslocamento até o centro e a escala que cobre a tela.
3. Fitas cruzadas: duas faixas de serviços em sentidos opostos, pausam no hover/foco e fora da tela.
4. **Painéis que se empilham**: `.frente { position: sticky; top: calc(nav + 1.25rem + var(--k) * 18px) }`; o cartão recua
   (`scale .92`) e escurece com véu usando a timeline do **próximo** painel (`timeline-scope` + `animation-range: entry 0% entry 100%`).
5. Números contando sobre foto em parallax.
6. Galeria do treino: foto vira vídeo (mouse: hover abre e toca; toque: toca/fecha; celular em pé: o cartão mais visível,
   pelo menos 70%, toca sozinho); tudo pausa fora da tela.
7. Linha do tempo horizontal guiada pela rolagem.
8. Sede recortada (PNG com alfa) na frente de um letreiro gigante.
9. Rodapé com a chama se desenhando (`stroke-dasharray: 1` + `stroke-dashoffset 1 → 0`, `pathLength` normalizado).

Outras peças do motor: split por palavra preservando `<sub>`, `<br>` e pílula de ênfase (a pílula ganha fundo `skewX scaleX 0→1`);
3 redes de revelação (IntersectionObserver com `rootMargin -8%`, varredura quando a rolagem para, varredura aos 3,5 s só do
que já está na tela); nav que só alterna classes por quadro; link ativo por IntersectionObserver (`-35% 0px -55% 0px`);
brilho que segue o ponteiro por variáveis `--mx/--my` só em `pointer: fine`; **onda no clique** com Web Animations API;
imagens com fade ao carregar e timeout de segurança; botão flutuante de WhatsApp que aparece após 400 px ou 6 s e some
quando um formulário tem foco, o teclado abre, o formulário de contato ou o rodapé estão na tela, ou o X é clicado;
vídeos `autoplay muted loop playsinline` no HTML (funcionam sem JS) que pausam fora da tela e mostram botão de play se o
navegador bloquear o autoplay.

Seguro anti-falha no `<head>` (`Indafire/site-novo/src/layouts/Base.astro`), síncrono e primeiro:

```html
<script is:inline>
  (function () {
    var h = document.documentElement;
    h.classList.add('motion-ready');                      // o CSS só esconde sob esta classe
    window.setTimeout(function () {
      if (!h.classList.contains('motion-engine-up')) h.classList.add('motion-failed');  // devolve tudo em 4 s
    }, 4000);
  })();
</script>
```

CSS de revelação (`Indafire/site-novo/src/styles/global.css`): o estado escondido nunca é o estilo base.

```css
html.motion-ready:not(.motion-failed):not(.motion-reduced) [data-reveal]:not(.revelado) { opacity: 0; }
html:not(.motion-reduced) [data-reveal].revelado {
  animation-name: var(--rv, rv-sobe);
  animation-duration: var(--rv-dur, var(--d-reveal));
  animation-timing-function: var(--rv-ease, var(--ease-firme));
  animation-fill-mode: backwards;
  animation-delay: calc(var(--i, 0) * var(--passo) + var(--atraso, 0ms));
}
/* valores literais nos keyframes: var() ali pode tirar a animação do compositor */
@keyframes rv-sobe    { from { opacity: 0; transform: translate3d(0, 56px, 0); } }
@keyframes rv-inclina { from { opacity: 0; transform: perspective(1100px) translate3d(0, 60px, 0) rotateX(14deg); } }

@supports (animation-timeline: view()) {
  html:not(.motion-reduced) [data-paralaxe] > picture { animation: paralaxe linear both; animation-timeline: view(); }
  @keyframes paralaxe { from { transform: translate3d(0, -8%, 0) scale(1.18); } to { transform: translate3d(0, 8%, 0) scale(1.18); } }
  /* camadas em velocidades diferentes: propriedade `translate`, nunca no mesmo elemento de um data-reveal */
  html:not(.motion-reduced) [data-deriva] { animation: deriva linear both; animation-timeline: view(); }
  @keyframes deriva { from { translate: 0 var(--deriva, 48px); } to { translate: 0 calc(var(--deriva, 48px) * -1); } }
}
@supports (animation-timeline: scroll()) {
  .progresso__linha { animation: progresso linear both; animation-timeline: scroll(root); }
  @keyframes progresso { from { transform: translate3d(-100%, 0, 0); } to { transform: translate3d(0, 0, 0); } }
}
```

Esses blocos de CSS scroll-driven funcionam igual num projeto Vite/Tailwind (em `styles.css`) e são a forma mais barata de
pôr parallax em muitas fotos sem `useScroll` por elemento.

Desempenho medido na Indafire (05/10/2026): desktop ~74 fps em CPU normal e ~30 fps com CPU 4x; celular ~42 fps com CPU 4x.

---

## 13. Armadilhas registradas

Do Seven (comentários no código e `.md`):
1. `prefers-reduced-motion` no Windows vem ligado só porque "efeitos de animação" está desligado: `MotionConfig reducedMotion="never"`.
2. Hidratação: nada que dependa de `window` no primeiro render (`useIsDesktop` começa `false`, `CookieNotice` só no cliente,
   preloader sempre no primeiro paint, `Counter` começa no valor final).
3. Conteúdo colapsado (acordeões de serviços e FAQ) fica no DOM com `height: 0` e `aria-hidden`, para o prerender levar o texto ao Google.
4. O wrapper `msg-sucesso` não pode ter animação de opacidade: o acionador de visibilidade do GTM mede ele.
5. Conversões do Ads em clique de link: CTA precisa ser `<a href="https://wa.me/...">` / `tel:`; usar `wa.me`, não `api.whatsapp.com`.
   Não duplicar conversão com `lead_click` (esse é só GA4).
6. GTM só no domínio real; testar prévia com `?gtm_debug=x` ou `?track=1`.
7. FormSubmit só entrega depois de ativado no e-mail de destino; trocar o destinatário exige nova ativação.
8. Lenis: overlays com rolagem própria e carrosséis horizontais precisam de `data-lenis-prevent`; se algo travou o
   `overflow` antes do Lenis nascer, ele precisa começar parado.
9. Drag em touch (cortina antes/depois): só capturar o ponteiro depois de 8 px de gesto horizontal, senão a rolagem vertical morre;
   usar `touch-pan-y`.
10. Policies do Ads (TRACKING.md): sitelinks apontando para URL inexistente, imagens com texto sobreposto e nome da empresa
    com cidade foram reprovados; o `.htaccess` redireciona `/contato` para `/#orcamento`.

Da Indafire (README do site-novo, comentários do motor e do verify):
11. **Nada invisível sem JS ou com `animation: none`**: o estado escondido só sob `html.motion-ready` ou no `from` de keyframe com
    `fill-mode: backwards`; `motion-failed` devolve tudo se o motor não subir em 4 s.
12. **Nunca `overflow: hidden` em quem contém animação `view()`**: vira contêiner de rolagem e congela a animação. Usar `overflow: clip`
    (o Seven já usa `overflow-x: clip` no body).
13. Só `transform` e `opacity` animam (exceção: `stroke-dashoffset`). Nada por quadro de rolagem em JS; não escrever variável CSS
    no `<html>` por quadro (recalcula a página); nada de `getBoundingClientRect` em laço; a primeira versão rodava a 2 fps.
14. Não pôr `translate` de parallax no mesmo elemento de um reveal (cada elemento tem uma lista de animação só).
15. Única animação infinita: as fitas. Nada piscando (fogo/sirene). Vídeos e fitas pausam fora da tela.
16. Revelar quando o elemento já entrou ~8% na tela (o visitante vê a animação); nada revelado por prazo fora da tela;
    carrosséis de arrastar revelam os cartões juntos.
17. Windows/OneDrive: `node_modules`, `dist` e `.astro` como junction para `C:\DevCache\<projeto>` (`scripts/junctions.ps1`);
    `npm install` troca a junction por pasta real (rodar o script de novo); com junction, o Vite `fs.strict` recusava fontes
    (403) até liberar o caminho real em `server.fs.allow`; copiar `dist` a partir do `realpathSync`.
18. Chrome do puppeteer: perfil em caminho curto (MAX_PATH); `127.0.0.1` em vez de `localhost`; `taskkill /T` para não deixar
    Node órfão segurando a porta.
19. `gh` sem escopo `workflow`: publicar por branch `gh-pages` com `.nojekyll` (sem ele o Jekyll esconde pastas com `_`).
20. Conteúdo: sem jargão ("soluções", "especialistas", "excelência" foram vetados por cliente), só fotos reais, nenhum dado
    inventado (o que depende do cliente fica `null` ou `TODO(cliente)` e não aparece).

Achado nesta auditoria (Seven, não registrado nos `.md`):
21. O `dist/index.html` do Seven tem **169 elementos prerenderizados com `style="opacity:0..."`** (o `initial` do framer-motion vai para
    o HTML do SSR). Sem JS, ou se o bundle falhar, a maior parte do conteúdo fica invisível; só o preloader tem `<noscript>`.
    Para a Protecin, combinar o padrão do Seven com o seguro da Indafire. Sugestão:

```html
<!-- index.html, no <head>, antes de qualquer script -->
<script>
  (function () {
    var h = document.documentElement;
    setTimeout(function () { if (!h.classList.contains('motion-up')) h.classList.add('motion-failed'); }, 4000);
  })();
</script>
<noscript><style>
  .es-preloader{display:none!important}
  [style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}
  [style*="clip-path"]{clip-path:none!important}
</style></noscript>
<style>
  html.motion-failed .es-preloader{display:none!important}
  html.motion-failed [style*="opacity:0"],html.motion-failed [style*="opacity: 0"]{opacity:1!important;transform:none!important}
  html.motion-failed [style*="clip-path"]{clip-path:none!important}
</style>
```

```tsx
// App.tsx: avisa que o motor subiu (depois da hidratação)
useEffect(() => { document.documentElement.classList.add("motion-up"); }, []);
```

    E incluir no verify da Protecin os testes "sem JS" e "animation:none" da Indafire.

Observação de estado: o `main` local do Seven tem 7 commits a mais que `origin/main` (o remoto está em `4e6ab29`, o primeiro
commit); o `gh-pages` remoto existe e está publicado.

---

## 14. Checklist para montar a Protecin a partir disso

- [ ] Copiar configs (vite, tailwind, postcss, tsconfig, .gitignore) e trocar paleta/fontes pela identidade da Protecin.
- [ ] Copiar `src/lib/smooth-scroll.ts`, `src/components/motion.tsx`, `Embers.tsx`, `cta.tsx`, `chrome.tsx`, `ContactForm.tsx`, `scripts/prerender.mjs`, `src/entry-server.tsx`.
- [ ] `src/data/site.ts` só com dados reais da Protecin (`referencia/conteudo-site-atual.md`); nada de números, clientes ou certificações inventados.
- [ ] `index.html`: SEO, OG, geo de Santo André/SP, `%BASE_URL%`, GTM com regex `protecin\.com\.br` e ID pendente, `<!--structured-data-->`, seguro anti-invisível do item 21, `noindex` na prévia.
- [ ] Porta própria no `package.json` e no `.claude/launch.json`; `build:gh` com `VITE_BASE=/<repo>/`; `deploy:gh` com `gh-pages -d dist --nojekyll` (ou o `deploy-gh.mjs` com trava de remoto).
- [ ] Todo CTA de contato via `WhatsAppLink`/`PhoneLink` com `location` único por seção; lista de `lead_location` documentada num `TRACKING.md`.
- [ ] Verify com puppeteer-core + Chrome instalado, adaptado do `Indafire/site-novo/scripts/verify.mjs` (atributo `data-motion` para cobertura).
