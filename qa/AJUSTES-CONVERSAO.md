# Ajustes de conversão (rodada 3, 12/11/2026)

Este arquivo vale por cima de `referencia/design-final.md`, `qa/AJUSTES-DESIGN.md` e `qa/AJUSTES-SOBRIEDADE.md`. Em caso de conflito, ele ganha.

## O pedido

O Vinicius achou o site bonito como apresentação e portfólio, mas pouco vendável para o público da Protecin: gestor de facilities, síndico e o comprador que precisa resolver AVCB, manutenção ou projeto.

Problemas apontados:
- era preciso procurar muito para achar o que se quer;
- o site estava poluído;
- faltava o mapa no fim da página.

## 1. Home `/`: ordem e conteúdo

1. **Abertura:** igual, mas mais curta.
   - Altura de 160vh no desktop (0,6 tela presa) e 130vh no celular (0,3 tela).
   - O parágrafo diz o que a Protecin faz: projetos com ART, AVCB, instalação, inspeção e manutenção.
2. **Serviços** (01): os 8 serviços, com orçamento e WhatsApp.
3. **Credibilidade** (02): autorizações, marcas e filiações.
4. **Escala** (03): os números.
5. **Como funciona** (04): 3 passos.
   - Os passos: pedido, visita técnica e proposta, execução com documentação.
   - Fecha com orçamento e WhatsApp (`lead_location` `como_funciona`).
6. **Orçamento** (05): o formulário de 3 etapas e os canais.
7. **Onde estamos** (06): o mapa da Rua Lacônia, 600, com "Como chegar".
   - O iframe do Google Maps carrega sozinho quando a seção fica a 600 px da tela.
   - Nada é carregado de terceiros na carga da página.

## 2. O que saiu da home

Estas seções continuam nas páginas internas:
- **Na prática:** saiu do site.
- **Plataforma:** vai para `/nosso-app/`.
- **Diferenciais:** os pontos de atendimento e estrutura já aparecem em "Como funciona" e na Credibilidade.
- **História** e **Kids ONG:** vão para `/institucional/`.
- **Setores:** vai para `/nossos-clientes/`.

## 3. Régua

- **Altura da home:**
  - Desktop 1440×900: até 9.000 px.
  - Celular 390×844: até 11.000 px.
  - Em 12/11 ficou em 7.127 e 9.054 px (antes, cerca de 14.400 px no desktop).
- **Regra para seção nova na home:** só entra se ajudar o visitante a escolher o serviço, confiar na Protecin ou pedir o orçamento.
