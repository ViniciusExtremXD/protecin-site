# Protecin — site novo (proposta de redesign)

Site estático pré-renderizado da Protecin, com motion design: React 18 + Vite 5 + TypeScript + Tailwind 3 + framer-motion 11 + Lenis. A especificação completa está em `referencia/design-final.md`; os ajustes de QA em `qa/AJUSTES-DESIGN.md` valem por cima dela, os da rodada de sobriedade (`qa/AJUSTES-SOBRIEDADE.md`) valem por cima de tudo, e a régua de aceite é `qa/REGUA-SITE-NOVO.md`.

- **Prévia:** https://viniciusextremxd.github.io/protecin-site/ (espaços reservados: `?proposta=1`)
- **Publicação:** `DEPLOY.md` · **Rastreamento (GTM/Ads):** `TRACKING.md` · **Pendências:** `PENDENCIAS.md`

## Rotas

`/`, `/institucional/`, `/servicos/`, `/nossos-clientes/`, `/catalogo-digital/`, `/nosso-app/`, `/contato/`, `/creditos/` e `404.html`. Cada rota sai pré-renderizada (`dist/<rota>/index.html`) e hidrata no navegador; a troca de página é feita pelo roteador próprio (`src/lib/router.tsx`), com a cortina vermelha.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento em http://127.0.0.1:5185 |
| `npm run sandbox` | `dev.html`: qualquer seção isolada com o chrome real (`?s=home/Abertura&rota=/`, `?todas=1`) |
| `npm run typecheck` | TypeScript sem emitir |
| `npm run build` | build de produção (base `/`) + SSR + `scripts/prerender.mjs` |
| `npm run build:gh` | o mesmo com `VITE_BASE=/protecin-site/` (prévia no GitHub Pages) |
| `npm run preview` | `vite preview` em http://127.0.0.1:4185 |
| `node scripts/verify.mjs --estatico` | verificação completa (§16) do `dist/` servido como no GitHub Pages em http://127.0.0.1:4195/protecin-site/; relatório em `verificacao/` |
| `node scripts/servir-estatico.mjs 4195` | serve o `dist/` como o GitHub Pages |
| `node scripts/medir-desempenho.mjs [--mobile] [--4g]` | LCP, TBT, CLS (carga e rolagem), peso e fps da home rolando com CPU 4x |
| `node qa/capturar.mjs <url> <saida> "<rotas>"` | capturas em faixas (desktop e celular) e checagens de QA |
| `npm run deploy:gh` | build da prévia e publicação no branch `gh-pages` |
| `npm run imagens` / `npm run videos` | regeneram `public/img/` e `public/videos/` (sharp e ffmpeg-static); o hero sai da fonte 1080p com `HERO_1080=1 node scripts/videos.mjs --force` |

## Estrutura

```
src/main.tsx            hidrata o HTML pré-renderizado (ou cria a raiz no dev)
src/App.tsx             roteador + MotionRoot + chrome (nav, menu, cortina, rodapé, contato flutuante)
src/entry-server.tsx    render(url), head(url) e JSON-LD para o prerender
src/pages/              composição de cada rota (só monta seções)
src/sections/           seções da home e das páginas internas
src/components/         motion (primitivas), ui, chrome e layout
src/data/site.ts        todo o texto do site (só fatos do site atual)
scripts/                prerender, verify, servidor estático, desempenho, deploy, imagens e vídeos
```

## Pastas fora do OneDrive

`node_modules`, `dist` e `scratch` são junctions para `C:\DevCache\protecin\`. Depois de um `npm install`, rode `scripts/junctions.ps1` (o npm troca a junction do `node_modules` por uma pasta real).

## Movimento

O movimento é sempre ligado (`qa/AJUSTES-SOBRIEDADE.md` §1): o site anima igual com ou sem `prefers-reduced-motion: reduce` no sistema (`MotionConfig reducedMotion="never"`, Lenis com `respectReducedMotion: false`). Não há modo reduzido, botão ou aviso de animações, nem parâmetro `?motion=`. Sem JavaScript, o HTML pré-renderizado é legível por inteiro. O seguro anti-invisível (`html.motion-failed`, script do `<head>` em `index.html`) só entra quando o JS falha de fato: erro de script do site, JS que não rodou até o `DOMContentLoaded` ou hidratação que não terminou em 12 s depois de o JS começar; aí tudo aparece parado.
