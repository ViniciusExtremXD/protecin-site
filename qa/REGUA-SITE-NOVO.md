# Régua de QA do site novo da Protecin

É o critério de aceite. Cada item precisa ser verificável na demo, por script ou à vista.

## Conteúdo e credibilidade (sem "AI slop")

- **Só fatos do site atual** (`referencia/conteudo-site-atual.md`):
  - 50 anos, desde 1976.
  - 20.000+ clientes, 3M+ equipamentos manutenidos, 5M+ inspeções e 250+ obras.
  - Autorizações Kidde Brasil, Everlux, Notifier e Simplex, e filiações ABSpk e NFPA.
  - NBR 12962, NBR 12779 e INMETRO.
  - Os marcos da linha do tempo, de 1976 a 2024.
  - Kids ONG, contatos e horário.
- **Nada inventado.** Nenhum número, depoimento, cliente, prêmio ou certificação inventado. Se o fato não existe, a seção não existe.
- **Copy proibida**, frases genéricas que não dizem nada:
  - "soluções inovadoras de ponta"
  - "transforme / eleve seu negócio"
  - "seu parceiro de confiança"
  - "excelência incomparável"
  - "jornada"
  - "sinergia"
  - "no coração de"
  - "o futuro da segurança"

  Cada frase precisa conter algo específico: uma norma, um número, um serviço, um lugar ou um prazo.
- **Fotos:**
  - Primeiro as fotos reais do acervo.
  - Foto de banco de imagem só como textura ou fundo, nunca legendada como "nossa equipe" ou "nossa obra".
  - Nenhuma imagem gerada por IA.
- **Logos:**
  - Os logos de fabricantes aparecem como **parceiros e autorizações**, não como clientes.
  - Clientes só com logo ou nome confirmado.
- **Ícones:** um único conjunto, com o mesmo traço e o mesmo peso. Nada de emoji.

## Visual

- **Paleta do logo:** vermelho e azul-marinho da Protecin, com neutros. Nada de gradiente roxo, neon genérico ou glassmorphism gratuito.
- **Tipografia:** no máximo 2 famílias. Parágrafo em fonte de texto (não condensada), com pelo menos 16 px no celular e 17 px no desktop.
- **Estrutura das seções:** a página não pode ser só uma sequência de grades "ícone + título + texto". Cada seção tem uma composição própria, guiada pelo conteúdo: linha do tempo, números, plataforma, serviços e parceiros.
- **Alinhamento e espaço:** grade consistente, alinhamentos limpos e espaço em branco proposital. Nada de texto alinhado à direita em bloco.

## Motion

- **Tudo animado, mas com propósito.** A animação revela hierarquia ou conta algo: um contador que sobe, uma linha do tempo que avança com o scroll, a plataforma que monta na tela, serviços que se abrem.
- **Tempos:** entradas de 200 a 900 ms. Nenhum conteúdo principal pode ficar mais de 1 s escondido esperando animação.
- **Sem custo de layout:** nada de animação que cause salto de layout (CLS) ou trave a rolagem. Só `transform` e `opacity` nos efeitos de scroll.
- **`prefers-reduced-motion`:** tudo visível e legível, sem movimento.
- **Vídeo:**
  - Opcional, mudo e em loop, com poster.
  - Até cerca de 6 MB.
  - Não pode ser o elemento do LCP nem bloquear o carregamento.
  - Pausa quando sai da tela.

## Funcional e conversão

- **Chamada para orçamento:** visível acima da dobra no desktop e no celular, e repetida no fim de cada página.
- **Canais de contato:**
  - Telefone com `tel:`.
  - E-mail com `mailto:`.
  - WhatsApp `wa.me/5511945651751` com texto pré-preenchido.
- **Rastreamento:** todo link de lead tem `data-lead-channel` e `data-lead-location` e dispara `lead_click` no `dataLayer`, no padrão do Extin Seven. O GTM só carrega no domínio de produção.
- **Formulário:**
  - Validação, máscara de telefone e mensagens de erro em português.
  - Estados de enviando, sucesso e erro.
  - Nenhum e-mail fictício nos placeholders.
- **Menu:** funciona por teclado e por toque, fecha com Esc e com toque fora.
- **Links:** nenhum link morto ou sem destino, e nenhum ícone com significado trocado.

## SEO e acessibilidade

- **Cabeçalho de cada página:** `title` e `meta description` próprios, Open Graph com imagem e `lang="pt-BR"`.
- **Estrutura e marcas:** 1 H1 por página, favicon e página 404.
- **Imagens:** toda imagem informativa tem `alt` descritivo, e as decorativas têm `alt=""`.
- **Contraste e foco:** contraste AA e foco visível.
- **Toque:** alvos de toque de pelo menos 44 px no celular.

## Desempenho

- **Metas:** LCP abaixo de 2,5 s em 4G simulado e CLS abaixo de 0,1.
- **Peso da home:** abaixo de 2 MB, sem contar o vídeo.
- **Imagens:** WebP ou AVIF, com `width`/`height` e `loading="lazy"` abaixo da dobra.

## Verificação automática

- **Script de capturas:** o `qa/capturar.mjs` roda em todas as rotas, no desktop e no celular, e o resultado precisa dar:
  - 0 erro de console;
  - 0 requisição com falha ou 404;
  - 0 rolagem horizontal;
  - 0 elemento vazando da tela;
  - 0 imagem quebrada.
- **Revisão visual:** as capturas de cada faixa são revisadas uma a uma antes de publicar.
