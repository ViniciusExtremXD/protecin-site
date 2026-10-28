# Pendências do site novo da Protecin

Itens que dependem da Protecin (ou do Gabriel) antes da versão de produção. Enquanto não chegam, o site não inventa: o dado fica `null`, não aparece, ou aparece só no modo proposta (`?proposta=1`).

## Confirmar com a Protecin

1. **Logos oficiais em SVG** (símbolo e wordmark, versão positiva e negativa). A prévia usa o símbolo redesenhado em vetor a partir do `SIMBOLO.png` e o wordmark convertido do PNG do site atual.
2. **Autorização para publicar as fotos reais** `4.jpg` (sistemas na parede, com a etiqueta PROTECIN) e a foto da bateria de cilindros como "Foto do acervo Protecin", sem nome nem local da obra.
3. **Natureza da relação com VESDA, Bosch, Firebee e Germek** (a prévia usa "Marcas com que trabalhamos") e se a filiação à ABSpk e à NFPA é formal (a prévia usa "Filiações técnicas"). "Autorizada" aparece só junto de Kidde Brasil, Everlux, Notifier e Simplex.
4. **Kids ONG:**
   - ano de início do projeto: o site atual diz "sete anos" num texto de 2025. A prévia não exibe a contagem (`KIDS_ANO_INICIO = null` em `src/sections/shared/Compromisso.tsx`); com o ano confirmado, a frase vira "desde <ano>";
   - a frase "Cláudio Szulcsewski, fundador da Protecin" contra "fundação pela Extimbrás" na história (as duas aparecem literais, sem conciliar).
5. **Marco de 2021 da linha do tempo:** "software próprio para combate e rastreabilidade dos equipamentos" — confirmar a redação (o texto do site atual diz "combate"; o sentido parece ser "controle e rastreabilidade") e o ano. Também aparece como "SOFTWARE PRÓPRIO DESDE 2021" na seção Plataforma.
6. **Preço único de 1986:** se a condição para inspeção e manutenção de extintores continua valendo (espaço reservado no capítulo 05 de `/servicos/`).
7. **Material próprio** para substituir o de banco e ligar os espaços reservados: logos de clientes com autorização, depoimentos e fotos ou vídeos reais (sede da Rua Lacônia, frota, recarga, teste hidrostático, técnico usando o app). Hoje todos os vídeos e as fotos de banco levam "Imagem ilustrativa".
8. **Conteúdo do PDF do catálogo e das 7 subpáginas de serviço** do site atual (raspar antes da versão final; a página do catálogo não lista o que está no PDF).
9. **Formulário de orçamento — hoje é demonstração.** O envio não manda nada para lugar nenhum: simula 1,2 s e mostra o sucesso com a linha "Demonstração". Para produção:
   - definir o destino (comercial@ ou falecom@) e ativar o FormSubmit (ou outro serviço aprovado);
   - trocar a função `enviarSolicitacao` em `src/sections/shared/orcamento/envio.ts` pelo envio real para `FORM.endpoint` (`src/data/site.ts`) e tirar a linha "Demonstração" (`FORM.sucessoDemo`);
   - os caminhos que já entregam de verdade na prévia são o WhatsApp e o e-mail (`mailto:`) com o resumo da solicitação.
10. **Política de privacidade** (necessária para o aviso de cookies em produção, quando o GTM for ligado).
11. **Licenças das fotos de banco herdadas do site atual** (a página `/creditos/` diz "licença a confirmar com a Protecin").
12. **Imagem de compartilhamento** `public/og-protecin.jpg`: é provisória (montada para a prévia). Trocar por uma arte aprovada de 1200 × 630.

## Com o Gabriel (gestor de tráfego)

13. **ID do contêiner GTM** (`VITE_GTM_ID`): sem ele, o build sai sem nenhum snippet de medição. A prévia no GitHub Pages fica sem GTM de propósito.
14. **Conversões do Google Ads** nos acionadores de clique em link (WhatsApp, telefone, e-mail) e no `form_lead`. Passo a passo em `TRACKING.md`.

## Desempenho no celular (em aberto, técnico)

Medido na prévia publicada, com CPU 4x e 4G simulado (rede 150 ms / 1,6 Mbps), sem o antivírus da máquina no meio. O Lighthouse não rodou (não está instalado e a cota anônima do PageSpeed Insights estava esgotada); os números são do `scripts/medir-desempenho.mjs` e de medições com o mesmo método:
- **CLS:** a gota da abertura saltava do fluxo para a tela cheia quando a cena fixava depois da hidratação (CLS 1,0 no celular). Corrigido: até a cena ligar, a gota fica invisível (CLS da carga medido entre 0,001 e 0,005). Rolando a home no celular ainda soma cerca de 0,23 (não investigado).
- **LCP e TBT:** a home tem cerca de 5.900 nós e 365 KB de HTML. Com a CPU 4x, análise do HTML, layout e hidratação do React somam cerca de 3 s de bloqueio (TBT aproximado de 2,9 s). O pôster do hero ocupa a tela inteira e o Chrome não conta imagem de tela cheia como LCP. O primeiro elemento grande que conta é a imagem da gota, pintada só depois da hidratação. Resultado no celular: FCP de cerca de 3 s e LCP de 7,4 a 7,9 s. No desktop sem limitação: LCP de 1,5 s e CLS 0.
- **Rolagem:** CPU 4x no desktop, 36 fps (meta de 30 ou mais); no celular, 18 fps (meta de 40 ou mais).
- **Próximos passos sugeridos:** dividir o JavaScript por rota e hidratar as seções abaixo da dobra só quando chegarem perto da tela; `content-visibility: auto` nas seções longas que não são cenas fixadas; enxugar o HTML pré-renderizado (letreiros repetidos e SVGs grandes); fazer a cena da abertura nascer fixada pelo CSS, sem esperar a hidratação.
- Em aparelhos muito lentos a hidratação pode passar dos 4 s do seguro anti-invisível (`motion-failed`): o site fica legível, mas sem parte das entradas.

## Técnicas (registro)

- O Tailwind deste projeto não gera as variantes `max-*` (ex.: `max-lg:`), porque as telas customizadas `pin` e `curto` usam `raw`. Use as variantes mínimas (`lg:`) ou as telas `pin:`/`curto:`.
- A prévia publica com `noindex, nofollow`; o `sitemap.xml` e o `canonical` já apontam para `https://protecin.com.br`.
