# Ajustes de QA sobre `referencia/design-final.md`

Valem por cima da especificação. Em conflito, este arquivo ganha. A régua é `qa/REGUA-SITE-NOVO.md`.

## Cortes (efeitos que denunciam site genérico de IA)

1. **Sem `TextScramble`.**
   - **Corte:** os rótulos mono entram com o mesmo reveal dos outros textos (fade e subida curta). Nada de letras embaralhando.
   - **Motivo:** é um clichê de site de template.
2. **Sem `luz-ponteiro`.**
   - **Corte:** fica fora o brilho radial que segue o mouse, em qualquer seção.
   - **Motivo:** é outro clichê. A luz da marca é estática (`luz-brasa`), e quem anima é a camada (`opacity`/`transform`) ligada ao scroll.
3. **Brasas só onde contam a história.**
   - **Onde ficam:** só no fecho do Orçamento (H10) e, de leve, no fim da Abertura.
   - **Limites:** no máximo 40 partículas, pausadas fora da tela, sem brasa nenhuma no modo reduzido.
   - **Motivo:** empresa de proteção contra incêndio não pode parecer que está pegando fogo.

## Limites de escopo e tempo

- **Preloader:** no máximo 900 ms, só na primeira visita da sessão, e pulável com clique ou qualquer tecla. O conteúdo já está no HTML pré-renderizado por baixo.
- **Cenas fixadas:** cada cena fixada (PinStage) tem no máximo 2,5 alturas de tela de rolagem no desktop. No celular nenhuma cena fica presa por mais de 1,5 altura; nela o conteúdo vira sequência normal com reveals.
- **Ordem de prioridade:** se faltar tempo, o P0 sai inteiro e bem acabado antes de qualquer P1. Um P0 polido vale mais que P0 e P1 pela metade.

## O que não pode faltar (checado no QA)

- **Leitura sem JavaScript:** toda seção é legível com JS desligado (prerender) e com `prefers-reduced-motion`.
- **Botão de orçamento** visível no primeiro paint do desktop e do celular.
- **Canais com link:** `tel:+551149778720`, `mailto:comercial@protecin.com.br` e `https://wa.me/5511945651751?text=...`, todos com `data-lead-channel`, `data-lead-location` e `lead_click`.
- **Console limpo:** nenhum `console.log` esquecido, nenhum erro ou aviso de React (key, hydration mismatch, act).
- **Copy:** nenhuma frase da lista proibida da régua e nenhum número que não esteja em `referencia/conteudo-site-atual.md`.
