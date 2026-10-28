# Publicação do site novo da Protecin

## 1. Prévia (proposta) no GitHub Pages

- Repositório: `https://github.com/ViniciusExtremXD/protecin-site` (branch `gh-pages`, pasta raiz).
- Endereço: `https://viniciusextremxd.github.io/protecin-site/`
- Para a apresentação: `https://viniciusextremxd.github.io/protecin-site/?motion=full` (muitos PCs com Windows pedem "menos animação" ao sistema). Acrescente `&proposta=1` para mostrar os espaços reservados (logos de clientes, obras, depoimentos e preço único).

```bash
npm run deploy:gh       # build:gh (VITE_BASE=/protecin-site/) + scripts/deploy-gh.mjs
```

O `deploy-gh.mjs`:
- só publica se o `origin` for `ViniciusExtremXD/protecin-site` (trava de remoto);
- recusa um `dist/` sem a base `/protecin-site/` ou com o snippet do GTM;
- copia o `dist/` a partir do caminho real (o `dist` é junction para `C:\DevCache\protecin\dist`), grava `.nojekyll` e faz push forçado **só** no branch `gh-pages`, a partir de um repositório temporário (o `main` não é tocado).

A prévia sai com `<meta name="robots" content="noindex, nofollow">` e sem GTM. A configuração do Pages (uma vez):

```bash
gh api -X POST repos/ViniciusExtremXD/protecin-site/pages -f "source[branch]=gh-pages" -f "source[path]=/"
gh api repos/ViniciusExtremXD/protecin-site/pages          # conferir
gh api repos/ViniciusExtremXD/protecin-site/pages/builds/latest   # status do último build
```

Antes de publicar:

```bash
npm run build:gh
node scripts/verify.mjs --estatico                 # serve dist/ em http://127.0.0.1:4195/protecin-site/
node qa/capturar.mjs http://127.0.0.1:4195/protecin-site <pasta-fora-do-OneDrive> "/,/institucional/,/servicos/,/nossos-clientes/,/catalogo-digital/,/nosso-app/,/contato/,/creditos/"
node scripts/medir-desempenho.mjs                  # home em ?motion=full, 1440 (use --mobile para 390)
```

## 2. Produção (protecin.com.br, Locaweb) — só depois da aprovação da Protecin

Nada desta prévia vai para a hospedagem do cliente sem aprovação.

1. Build com a base `/` e o GTM do Gabriel:
   ```bash
   VITE_GTM_ID=GTM-XXXXXXX npm run build
   node scripts/verify.mjs          # serve dist/ (base "/") em http://127.0.0.1:4195/
   ```
2. Trocar a demonstração do formulário pelo envio real (`src/sections/shared/orcamento/envio.ts`, função `enviarSolicitacao`; ver `PENDENCIAS.md`).
3. Subir o conteúdo de `dist/` para a raiz pública da Locaweb (as rotas são pastas com `index.html`; `404.html` na raiz).
4. `.htaccess` na raiz (Apache da Locaweb): 404 próprio, barra no fim e 301 das subpáginas antigas de serviço para as âncoras de `/servicos/`:

```apache
ErrorDocument 404 /404.html
Options -Indexes
DirectorySlash On

RewriteEngine On
RewriteBase /

# HTTPS e domínio sem www
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www\. [NC]
RewriteRule ^ https://protecin.com.br%{REQUEST_URI} [L,R=301]

# páginas antigas do WordPress
RewriteRule ^home/?$ / [L,R=301]
RewriteRule ^instalacao-de-sistemas-e-equipamentos/?$ /servicos/#instalacao-de-sistemas-e-equipamentos [NE,L,R=301]
RewriteRule ^projetos-tecnicos/?$ /servicos/#projetos-tecnicos [NE,L,R=301]
RewriteRule ^documentacao-e-regularizacao/?$ /servicos/#documentacao-e-regularizacao [NE,L,R=301]
RewriteRule ^inspecoes-e-manutencoes-preventivas/?$ /servicos/#inspecoes-e-manutencoes-preventivas [NE,L,R=301]
RewriteRule ^manutencao-de-equipamentos/?$ /servicos/#manutencao-de-equipamentos [NE,L,R=301]
RewriteRule ^gestao-de-riscos-e-consultoria/?$ /servicos/#gestao-de-riscos-e-consultoria [NE,L,R=301]
RewriteRule ^venda-de-equipamentos/?$ /servicos/#venda-de-equipamentos [NE,L,R=301]

# cache: arquivos com hash por 1 ano; HTML sempre revalidado
<IfModule mod_headers.c>
  <FilesMatch "\.(js|css|woff2|avif|webp|png|jpg|svg|mp4)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
```

5. O PDF do catálogo continua em `https://protecin.com.br/wp-content/uploads/2025/07/Catalogo-Digital-Protecin.pdf` (`COMPANY.catalogoPdf` em `src/data/site.ts`). Se o WordPress sair do ar, copiar o PDF para `public/` e trocar o endereço.
6. Depois de publicar: `node scripts/verify.mjs --url https://protecin.com.br`, Lighthouse da home e enviar o `sitemap.xml` ao Search Console.
