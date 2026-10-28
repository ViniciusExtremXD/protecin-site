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

Medido em 28/10/2026 na prévia publicada (rodada de sobriedade) com o `scripts/medir-desempenho.mjs` (o Lighthouse não está instalado). Celular: 390×844, rede e CPU do Lighthouse mobile (150 ms, 1,6 Mbps, CPU 4x) na carga e CPU 4x na rolagem. Desktop: 1440×900, rede local sem limitação na carga e CPU 4x na rolagem. O TBT é aproximado (soma do que passa de 50 ms em cada tarefa longa até o fim da medida da carga):
- **Celular:** FCP 4,4 s, LCP 7,1 s, TBT 1,9 s, CLS 0 na carga e 0 depois de rolar a home inteira, 35 fps na rolagem, 379 KB na 1ª carga e 866 KB com a home rolada (sem vídeo). O mesmo build servido localmente deu FCP 3,7–4,0 s, LCP 6,5–6,7 s e TBT 2,0 s, igual ao build anterior da rodada (sem regressão).
- **Desktop:** FCP 1,0 s, LCP 2,3 s, TBT 85 ms, CLS 0 e 0, 30 fps rolando com CPU 4x, 418 KB na 1ª carga e 1.052 KB rolada (vídeo do hero à parte: 3,0 MB no desktop, 1,6 MB no celular).
- **LCP:** o elemento é o "50" do H1, que entra depois do preloader da 1ª visita (até 900 ms) e da entrada em CSS; com a CPU 4x, análise do HTML e hidratação do React ainda somam ~2 s de bloqueio no celular.
- **Próximos passos sugeridos:** dividir o JavaScript por rota e hidratar as seções abaixo da dobra só quando chegarem perto da tela; `content-visibility: auto` nas seções longas que não são cenas fixadas; enxugar o HTML pré-renderizado (~230 KB na home); avaliar tirar o preloader da 1ª visita (adianta o LCP).
- O seguro anti-invisível (`motion-failed`) só entra se o JS falhar: erro de script, JS ausente no `DOMContentLoaded` ou hidratação que não termina em 12 s depois de o JS começar a rodar. Num aparelho lento o site espera a hidratação (não há mais o prazo de 4 s nem modo reduzido); se o prazo estourar, tudo aparece parado e legível.

## Técnicas (registro)

- O Tailwind deste projeto não gera as variantes `max-*` (ex.: `max-lg:`), porque as telas customizadas `pin` e `curto` usam `raw`. Use as variantes mínimas (`lg:`) ou as telas `pin:`/`curto:`.
- A prévia publica com `noindex, nofollow`; o `sitemap.xml` e o `canonical` já apontam para `https://protecin.com.br`.
