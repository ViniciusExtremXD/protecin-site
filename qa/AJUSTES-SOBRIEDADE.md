# Ajustes de sobriedade (rodada 2, 28/10/2026)

Vale por cima de `referencia/design-final.md` e de `qa/AJUSTES-DESIGN.md`. Em conflito, este arquivo ganha.

O site está bom, mas o Vinicius pediu cinco mudanças:
- alguns elementos estão ousados demais;
- os cards de serviço têm cara de site feito por IA;
- algumas imagens estão com baixa resolução;
- é preciso rolar demais para ver as coisas;
- não pode ficar poluído.

Ele pediu também que o movimento fique sempre ligado e que o botão de ligar e desligar animações saia.

## 1. Movimento sempre ligado

- **Modo completo sempre:**
  - Não existe mais modo reduzido para o visitante. O site anima sempre, inclusive quando o sistema pede `prefers-reduced-motion: reduce`.
  - O Windows do Vinicius tem as animações desligadas, e foi isso que ele viu.
- **O que sai do site:**
  - o `MotionToggle`, em qualquer lugar;
  - o `MotionToast`;
  - o parâmetro `?motion=`.
- **O que continua:**
  - **Leitura sem JavaScript:** segue valendo, com o HTML pré-renderizado e legível.
  - **Seguro anti-invisível:** o `motion-failed` também continua.
- **Animação mais calma:** tudo continua animado, mas com menos amplitude.
  - **Deslocamento das entradas:** de 16 a 24 px.
  - **Duração:** de 0,5 a 0,8 s.
  - **Movimentos limitados:**
    - nada de escala acima de 1,06 em texto;
    - nada de rotação em título;
    - nada de letreiro gigante correndo.

## 2. Comprimento das páginas (medido em `document.documentElement.scrollHeight`)

| Página | Desktop 1440×900 | Celular 390×844 | Hoje (desktop / celular) |
|---|---|---|---|
| `/` | ≤ 13.000 px | ≤ 15.000 px | 30.092 / 30.472 |
| `/servicos/` | ≤ 9.000 px | ≤ 11.000 px | 19.020 / 18.033 |
| `/institucional/`, `/nosso-app/`, `/nossos-clientes/` | ≤ 7.500 px | ≤ 9.500 px | 8.400 a 13.100 |
| demais | o que já têm, ou menos | | |

### Cenas fixadas (PinStage)

- **Na home:** no máximo 3, cada uma com rolagem presa (altura − 100vh) de até 1,2 tela no desktop.
- **No celular:** só a Abertura pode prender, e até 0,6 tela. O resto vira sequência normal com reveals.
- **A pilha de cards sticky dos serviços acaba.**

### Espaçamento

- **Entre seções:** padding vertical de 96 a 128 px no desktop e de 64 a 80 px no celular.
- **Sem bloco de 100vh vazio** nem respiro decorativo.

## 3. Sobriedade visual

- **Tipografia:**
  - **H1 do hero:** igual ao de hoje.
  - **H2:** no máximo cerca de 64 px no desktop (`clamp` com teto em 4rem) e 36 px no celular.
  - **Números grandes:** até 112 px no desktop.
  - **Bloco de caixa alta:** nenhum título com mais de 3 linhas em caixa alta.
- **Cards** (vale para todos):
  - **O que sai:**
    - o contador "01 / 08";
    - os chips de tag;
    - o link "Detalhes ↗" no topo;
    - o glow e a sombra colorida;
    - o card mais alto que a tela.
  - **O que cada card tem:**
    - imagem em paisagem (3:2 ou 16:10);
    - título;
    - uma frase;
    - um único link ou CTA discreto.
  - **Moldura:** borda de 1 px sutil, raio de 12 a 16 px, padding de 24 a 32 px.
- **Elementos que saem:**
  - **Decorativos:**
    - o selo giratório "50 ANOS · 1976–2026" do hero;
    - as réguas de ticks decorativas;
    - o letreiro gigante "SOLICITAR ORÇAMENTO";
    - as brasas (Embers), em todo o site.
  - **Repetições:** marcas de texto repetidas entre logos (o "AUTORIZADA" e "MARCA" entre cada logo); o grupo das fitas já diz isso.
- **Rótulos mono:** um por seção (o `SectionLabel`). Não somar kicker mono, rótulo e sobretítulo no mesmo bloco.
- **Glow radial vermelho no fundo:** só na Abertura e no Orçamento.
- **Cores:** vermelho só em destaque pontual e nos CTAs. Nada de título inteiro em vermelho.
- **Um CTA principal por seção**, no máximo com um secundário.

## 4. Imagens nítidas

- **Proporção:**
  - Não recortar foto em paisagem num quadro estreito em retrato.
  - Isso amplia a foto e borra (era o problema dos cards de serviço).
  - Quadros com `object-cover` usam proporção próxima da original.
- **`sizes` correto:**
  - Considera o recorte do `object-cover`.
  - A foto entregue precisa ter pelo menos 1,5× a largura exibida no desktop (DPR 1) e 2× no celular (DPR 2–3).
- **Compressão:**
  - Sem teto agressivo de bytes.
  - O teto de 60 KB para 1000 px deixava a foto empapada.
  - Use qualidade AVIF entre 50 e 60 e WebP entre 78 e 82.
  - Para fotos exibidas grandes, gere também 2000 e 2400 px.
- **Origem fraca:** algumas fotos de banco já chegaram ruins, como `Servicos_2.jpg` (os óculos sobre a planta) e `Riscos_1.jpg`.
  - Troque por outra foto do acervo em `referencia/imagens-site-atual/` que sirva ao mesmo serviço.
  - Se não houver, exiba menor.
  - Nunca use as imagens proibidas de §2 da spec.

## 5. Não poluir

Para cada seção, perguntar se o visitante sentiria falta do elemento. Se não sentiria, ele sai.

- **Nenhuma seção com mais de 3 tipos de animação simultâneos.**
- **Nenhum elemento piscando ou em loop chamando atenção**, exceto o vídeo do hero.
