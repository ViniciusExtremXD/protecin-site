# QA do site no ar: protecin.com.br (28/10/2026)

O teste cobriu as 7 páginas, em desktop (1440×900) e celular (390×844). Foram verificadas 171 URLs de links e arquivos. As capturas estão em `qa/capturas-site-atual/` e os dados brutos em `qa/qa-site-atual.json` e `qa/capturas-site-atual/relatorio.json`. Nenhum formulário foi enviado.

## Funcionando (verificado)

- **HTTPS:** válido, e `http://` redireciona para `https://` (301).
- **Links e arquivos:** nenhum link quebrado entre as 171 URLs. A exceção é o script do plugin do WhatsApp (item 4).
- **Layout:** nenhuma imagem quebrada e nenhuma rolagem horizontal, no desktop e no celular.
- **WhatsApp:** `wa.me/5511945651751` abre.
- **Catálogo:** o PDF baixa (1,2 MB).
- **Formulário de contato:** o WPForms (formulário 1847) notifica `falecom@protecin.com.br` pelo Brevo, via WP Mail SMTP, com remetente `suporte@protecin.com.br`. O DKIM do Brevo está no DNS e o DMARC está em `p=none`. O envio real não foi testado.

## Problemas, por prioridade

### Alta: medição e conversão

1. **Nenhuma tag do Google.** Não há GTM, GA4 nem conversão do Ads. Hoje a campanha não mede lead nenhum. Essa é a pendência com o Gabriel.
2. **Faltam chamadas para orçamento.** Nenhuma chamada para orçamento na home, nem acima da dobra nem no fim da página. O único canal de lead na home é o botão flutuante do WhatsApp.
3. **Telefone e e-mail não são clicáveis** em nenhuma página (sem `tel:` e `mailto:`). No celular não dá para tocar e ligar.
4. **Script ausente no plugin do botão de WhatsApp, em todas as páginas.** O plugin carrega `js/xdwhatsapp.min.js`, mas o arquivo que vem com ele se chama `wpwhatsapp.min.js`. Cada visita gerava uma página 404 completa do WordPress: 45 KB e de 1,8 a 6,6 s de servidor. Na prática, eram duas montagens de página por visita.
   - **Correção:** arquivo vazio no lugar do que falta.
   - **Por que não renomear:** o arquivo do plugin dispara um alerta em inglês a cada clique.
5. **Servidor lento.**
   - **Medição:** TTFB de 1,8 a 2,3 s em média, com picos de 4 a 6 s. A home leva cerca de 8 s para carregar e tem 3,7 MB em 71 requisições.
   - **Causa principal:** o WP-Optimize está instalado com o cache de página desligado.

### Média: credibilidade, SEO e acessibilidade

6. **Sem descrição e sem Open Graph.** Nenhuma página tem meta description nem Open Graph. Link compartilhado no WhatsApp aparece sem imagem e sem resumo.
7. **Imagens sem texto alternativo:** são 63 imagens, todas sem `alt`.
8. **Títulos H1 mal distribuídos.** Há vários H1 por página (home 2, institucional 2, app 4), e o catálogo não tem nenhum.
9. **"Nossos Clientes" não mostra nenhum cliente.** A página traz texto genérico por setor e logos de fabricantes parceiros (Bosch, Notifier, Germek, VESDA, Firebee). Quem chega pelo anúncio procura prova e não encontra.
10. **Fotos de banco de imagem nos pontos de prova.** O "mãos empilhadas" está na home e o "aperto de mão" em Clientes. Os ícones também são de banco. Não há foto de equipe, frota, obra ou sede.
11. **Imagens pesadas.** Os PNGs `Institucional_2/3/4` e `compromisso` têm de 1,0 a 1,5 MB cada.
12. **Fonte condensada (Oswald) nos parágrafos.** A leitura de texto corrido fica cansativa, principalmente no celular.

### Baixa: acabamento

13. **Rodapé desatualizado:** diz "© 2025 Protecin • All Rights Reserved", com ano antigo e em inglês.
14. **Erros de texto:**
    - "conforme exigências da NBRs" deveria ser "das NBRs".
    - O marco de 2021 diz "software próprio para combate e rastreabilidade", e a frase está truncada.
    - "Kids ONG… sete anos de atuação" é um número que envelhece; melhor citar o ano de início.
15. **Ícone errado no catálogo:** o botão "Download" usa uma seta para cima, que é o ícone de envio.
16. **Placeholder fictício:** o formulário sugere o e-mail "protecin@protecin.com".
17. **Seta solta em "Nosso App":** a seta "→" depois do texto não tem link.
18. **Celular:**
    - O hero fica sem imagem e sem chamada, com um vazio grande.
    - Os links do rodapé têm 24 px de altura; o recomendado são 44 px.
    - O botão "voltar ao topo" fica colado no do WhatsApp.

## O que dá para corrigir sem o wp-admin

Só o item 4, por FTP. **Feito em 28/10/2026:** o arquivo vazio `js/xdwhatsapp.min.js` foi enviado. Agora ele responde 200 com 214 bytes em cerca de 0,15 s, no lugar da página 404 do WordPress. Todo o resto é edição no Elementor e em plugins, que depende do acesso ao wp-admin, ou já sai resolvido no site novo.
