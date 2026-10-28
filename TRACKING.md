# Rastreamento do site novo da Protecin (para o Gabriel)

Padrão do Extin Seven (design-final §13). O site empurra eventos para o `dataLayer`; o Google Tag Manager só entra quando o build recebe `VITE_GTM_ID` e só carrega no domínio `protecin.com.br` (ou na prévia com `?gtm_debug=x` ou `?track=1`). Na prévia do GitHub Pages o GTM está desligado: o `dataLayer` existe e recebe os eventos, mas nada é enviado.

**Pendências com o Gabriel:** o ID do contêiner GTM (`VITE_GTM_ID`) e as conversões do Google Ads.

## Como ligar

1. Criar o contêiner GTM (web) e anotar o ID `GTM-XXXXXXX`.
2. No build de produção: `VITE_GTM_ID=GTM-XXXXXXX npm run build` (base `/`). Sem o ID, o HTML sai sem nenhum snippet.
3. Conferir no Tag Assistant em `https://protecin.com.br/?gtm_debug=x`.

## Links de contato (leads)

Todo CTA de contato é um link de verdade:

| Canal | Link | `data-lead-channel` |
|---|---|---|
| WhatsApp | `https://wa.me/5511945651751?text=…` (mensagem pré-preenchida por contexto) | `whatsapp` |
| Telefone | `tel:+551149778720` | `phone` |
| E-mail | `mailto:comercial@protecin.com.br` ou `mailto:falecom@protecin.com.br` | `email` |

Cada link leva `data-lead-channel`, `data-lead-location` e, quando houver, `data-lead-detail`. O clique empurra:

```js
dataLayer.push({ event: "lead_click", lead_channel, lead_location, lead_detail, lead_page })
```

`lead_page` é o PageId da rota: `home`, `institucional`, `servicos`, `clientes`, `catalogo`, `app`, `contato`, `creditos` ou `404`.

| `lead_location` | Onde | `lead_detail` |
|---|---|---|
| `nav` | botão WhatsApp da nav | — |
| `menu` | rodapé do menu em tela cheia | — |
| `hero` | abertura da home (WhatsApp e telefone) | — |
| `servicos` | cartões de serviço da home | slug do serviço |
| `plataforma` | seção Plataforma | — |
| `historia` | painel 2026 da linha do tempo | — (`institucional` na página Institucional) |
| `orcamento` | canais da seção Orçamento | — |
| `formulario` | "Enviar pelo WhatsApp" e envio por e-mail do formulário | slugs escolhidos |
| `rodape` | rodapé | — |
| `botao_flutuante` | WhatsApp flutuante (desktop) | — |
| `barra_mobile` | barra inferior (celular) | — |
| `pagina_institucional`, `pagina_servicos`, `pagina_clientes`, `pagina_catalogo`, `pagina_app`, `pagina_contato` | abertura e corpo de cada página | slug, quando houver |
| `faixa_cta` | faixa de CTA no fim das páginas internas | PageId |
| `avcb` | faixa AVCB em /servicos/ | — |
| `pagina_404` | página 404 | — |

## Outros eventos

| Evento | Parâmetros | Quando |
|---|---|---|
| `form_open` | `form_location` | clique num botão de orçamento ou foco no 1º campo do formulário |
| `form_step` | `step` | ao avançar de etapa (2 e 3) |
| `form_lead` | `servicos`, `setor`, `cidade`, `demo` | sucesso do formulário (junto da `.msg-sucesso`) |
| `catalog_download` | `location` | download do PDF do catálogo |
| `service_open` | `servico`, `origem` | "Detalhes" de um cartão da home; 1ª ativação de um capítulo em /servicos/ |
| `sector_open` | `setor` | acordeão de Setores |
| `hotspot_open` | `ponto` | clique num marcador da foto em "Na prática" |
| `platform_step` | `passo` | 1ª ativação de cada pilar da Plataforma |
| `diagram_layer` | `layer` | clique num chip de camada do diagrama de /servicos/ |
| `timeline_complete` | — | chegada a 2026 na linha do tempo (uma vez por sessão) |
| `menu_open` | — | menu aberto |
| `map_load` / `map_directions_click` | — | mapa de /contato/ |
| `video_play` | `video` | play manual de um vídeo |
| `motion_toggle` | `mode` | troca de "Animações: ligadas/reduzidas" (rodapé, menu e aviso) |
| `virtual_page_view` | `page_path`, `page_title` | toda troca de rota no navegador (o site não recarrega entre páginas) |

## Configuração sugerida no GTM

**Variáveis da camada de dados (DLV):** `lead_channel`, `lead_location`, `lead_detail`, `lead_page`, `form_location`, `servicos`, `setor`, `page_path`, `page_title`.

**Acionadores:**
- `CE - lead_click`: evento personalizado `lead_click`.
- `CE - form_lead`: evento personalizado `form_lead`.
- `CE - virtual_page_view`: evento personalizado `virtual_page_view`.
- `Clique WhatsApp`: Clique em link (apenas links), `Click URL` contém `wa.me`.
- `Clique Telefone`: Clique em link, `Click URL` começa com `tel:`.
- `Clique E-mail`: Clique em link, `Click URL` começa com `mailto:`.

**Tags:**
- GA4 Configuração com `send_page_view` desligado + GA4 Evento `page_view` no `CE - virtual_page_view` e no carregamento inicial (All Pages), com `page_location` montado de `page_path`.
- GA4 Evento `lead_click` (parâmetros `lead_channel`, `lead_location`, `lead_detail`, `lead_page`) no `CE - lead_click`.
- GA4 Evento `generate_lead` (ou `form_lead`) no `CE - form_lead`.
- **Conversões do Google Ads** nos acionadores de **clique em link** (WhatsApp, Telefone, E-mail) e no `CE - form_lead`. O `lead_click` fica só para o GA4, para a conversão não contar duas vezes.

## Observações

- O formulário da prévia é uma demonstração: não envia nada (o `form_lead` sai com `demo: true`). Ver `PENDENCIAS.md`.
- A demo não grava cookies de medição. O aviso de cookies entra em produção junto com a política de privacidade.
