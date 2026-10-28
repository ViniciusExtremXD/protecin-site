# Vídeos de banco gratuito para a demo Protecin

Levantamento feito em 28/10/2026 no Pexels, Mixkit, Pixabay e Coverr.

Como os dados foram conferidos:
- **Tamanho:** requisição HEAD (`curl -sI`) em cada arquivo, usando o `Content-Length`. Aqui 1 MB = 1.048.576 bytes.
- **Resolução e duração:** lidas do cabeçalho do MP4 (caixas `tkhd`/`mvhd`) com uma requisição Range de 1 MB, sem baixar o arquivo inteiro. Quando o MP4 é fragmentado e o cabeçalho não traz a duração, usei a duração informada na página do vídeo.
- **Conteúdo:** conferido pela miniatura (poster) de cada vídeo.

Todos os links diretos responderam `HTTP 200` com `video/mp4` e são horizontais.

## Os 3 melhores

| # | Vídeo | MP4 direto | Tamanho | Uso no site |
|---|---|---|---|---|
| 1 | Pexels 34775810: sistema industrial de supressão de incêndio (módulos vermelhos e tubulação) | https://videos.pexels.com/video-files/34775810/14743116_1920_1080_30fps.mp4 | 13,06 MB (1080p). A versão 720p tem 5,91 MB | **Hero**: fundo em loop com overlay escuro e título animado. Mostra o negócio da Protecin (instalação e montagem de sistemas fixos), e não bombeiros. |
| 2 | Pexels 8965440: homem entra com extintor numa sala tomada de fumaça | https://videos.pexels.com/video-files/8965440/8965440-hd_1920_1080_25fps.mp4 | 3,87 MB (1080p). A versão 720p tem 1,91 MB | Seção **Extintores / Comercialização e manutenção de equipamentos** ou faixa de CTA. Também serve como corte rápido num reel do hero. |
| 3 | Pexels 7100844: profissional de combate a incêndio usando tablet | https://videos.pexels.com/video-files/7100844/7100844-hd_1920_1080_30fps.mp4 | 6,89 MB (1080p). A versão 720p tem 2,40 MB | Seção **Plataforma Protecin (App para Técnicos / Painel Web)**: vídeo dentro de um mockup ou como fundo desfocado. É ilustrativo: não apresentar como equipe da Protecin. |

Para as transições com fogo, o melhor complemento é o Mixkit 52312 (chamas em close sobre fundo preto, item 9 abaixo).

## Candidatos (10)

### 1. Sistema de supressão, montagem (Pexels) ★
- **Página:** https://www.pexels.com/video/industrial-fire-suppression-system-setup-34775810/
- **MP4 1080p:** https://videos.pexels.com/video-files/34775810/14743116_1920_1080_30fps.mp4 (13,06 MB)
- **MP4 720p:** https://videos.pexels.com/video-files/34775810/14743115_1280_720_30fps.mp4 (5,91 MB)
- **Poster:** https://images.pexels.com/videos/34775810/installation-of-the-fire-system-34775810.jpeg?auto=compress&cs=tinysrgb&w=1440
- **Duração / resolução:** 8 s, 1920x1080 a 30 fps (original enviado em 1920x1080). Autor: Val А.
- **Licença:** Pexels (ver resumo abaixo).
- **Uso:** hero. Sugestão de efeito: zoom lento (scale 1.05 → 1) e máscara revelando o título.
- **Atenção:** o arquivo é um MP4 fragmentado (moov + moof). Toca normalmente em `<video>`, mas convém remuxar com `ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4` antes de hospedar, para o Safari ler a duração. Outros vídeos do mesmo autor mostram a marca "GASBASE.RU". Neste take a miniatura não mostra marca legível, mas é preciso conferir o vídeo inteiro.

### 2. Extintor em uso na fumaça (Pexels) ★
- **Página:** https://www.pexels.com/video/a-man-carrying-a-fire-extinguisher-entering-a-room-with-thick-smoke-8965440/
- **MP4 1080p:** https://videos.pexels.com/video-files/8965440/8965440-hd_1920_1080_25fps.mp4 (3,87 MB)
- **MP4 720p:** https://videos.pexels.com/video-files/8965440/8965440-hd_1280_720_50fps.mp4 (1,91 MB)
- **Poster:** https://images.pexels.com/videos/8965440/abandoned-alert-architecture-brick-8965440.jpeg?auto=compress&cs=tinysrgb&w=1440
- **Duração / resolução:** 6,4 s, 1920x1080 (original em 4K). Autor: Mikael Blomkvist.
- **Licença:** Pexels.
- **Uso:** seção de extintores ou CTA de emergência. O clipe é curto e funciona bem em loop com fade.

### 3. Tablet em campo (Pexels) ★
- **Página:** https://www.pexels.com/video/a-fireman-using-digital-tablet-7100844/
- **MP4 1080p:** https://videos.pexels.com/video-files/7100844/7100844-hd_1920_1080_30fps.mp4 (6,89 MB)
- **MP4 720p:** https://videos.pexels.com/video-files/7100844/7100844-hd_1280_720_30fps.mp4 (2,40 MB)
- **Poster:** https://images.pexels.com/videos/7100844/pexels-photo-7100844.jpeg?auto=compress&cs=tinysrgb&w=1440
- **Duração / resolução:** 21,3 s, 1920x1080. Autor: Gustavo Fring.
- **Licença:** Pexels. A pessoa é identificável: não sugerir que ela endossa a Protecin.
- **Uso:** seção do App e do Painel Web, dentro de um mockup de tablet ou como fundo com blur.

### 4. Válvulas vermelhas de sistema fixo (Pexels)
- **Página:** https://www.pexels.com/video/industrial-red-valve-fire-safety-system-34775769/
- **MP4 720p:** https://videos.pexels.com/video-files/34775769/14743051_1280_720_30fps.mp4 (8,97 MB)
- **MP4 1080p:** https://videos.pexels.com/video-files/34775769/14743052_1920_1080_30fps.mp4 (16,67 MB, acima do limite de ~15 MB)
- **Duração / resolução:** 13 s, 1280x720 (versão recomendada). Autor: Val А. MP4 fragmentado, mesma observação do item 1.
- **Licença:** Pexels.
- **Uso:** alternativa de hero ou fundo da seção "Soluções em Instalação e Montagem de Sistemas".

### 5. Treinamento de bombeiros com mangueiras (Pexels)
- **Página:** https://www.pexels.com/video/fire-department-training-17969418/
- **MP4 1080p:** https://videos.pexels.com/video-files/17969418/17969418-hd_1920_1080_30fps.mp4 (9,31 MB)
- **MP4 720p:** https://videos.pexels.com/video-files/17969418/17969418-hd_1280_720_30fps.mp4 (4,83 MB)
- **Duração / resolução:** 12,8 s, 1920x1080 (original em 4K). Autor: Dan Yonan.
- **Licença:** Pexels.
- **Uso:** "Gestão de Riscos" e treinamentos personalizados. Os caminhões são norte-americanos, então é melhor usar como fundo com overlay forte.

### 6. Placa de saída iluminada (Pexels)
- **Página:** https://www.pexels.com/video/a-lighted-exit-sign-for-direction-3134591/
- **MP4:** https://videos.pexels.com/video-files/3134591/3134591-hd_1280_720_24fps.mp4 (2,91 MB)
- **Duração / resolução:** 9 s, 1280x720. O arquivo `..._1920_1080_24fps.mp4` também tem 1280x720 no cabeçalho, com o mesmo tamanho. Autor: Caleb Oquendo.
- **Licença:** Pexels.
- **Uso:** "Gestão Técnica e Sinalização de Segurança". A placa diz "EXIT" (inglês), e no Brasil o padrão é "SAÍDA". Usar como clima, com recorte ou desfoque, ou trocar por animação própria de placa fotoluminescente.

### 7. Extintor pendurado na parede (Mixkit)
- **Página:** https://mixkit.co/free-stock-video/a-fire-extinguisher-hanging-on-the-wall-2456/
- **MP4 720p:** https://assets.mixkit.co/videos/2456/2456-720.mp4 (2,88 MB)
- **MP4 1080p:** https://assets.mixkit.co/videos/2456/2456-1080.mp4 (29,46 MB, pesado demais)
- **Poster:** https://assets.mixkit.co/videos/2456/2456-thumb-720-0.jpg
- **Duração / resolução:** 10,3 s, 1280x720.
- **Licença:** Mixkit Stock Video Free License (o vídeo está marcado como `videoFree`).
- **Uso:** card ou seção de extintores. O extintor parece usado e desgastado, o que pode servir de gancho para "manutenção certificada pelo INMETRO".

### 8. Técnico em corredor industrial de painéis (Mixkit)
- **Página:** https://mixkit.co/free-stock-video/worker-walking-in-industrial-machine-corridor-23378/
- **MP4 720p:** https://assets.mixkit.co/videos/23378/23378-720.mp4 (4,27 MB). A versão 1080p retorna 403.
- **Poster:** https://assets.mixkit.co/videos/23378/23378-thumb-720-0.jpg
- **Duração / resolução:** 14,1 s, 1280x720.
- **Licença:** Mixkit Free (`videoFree`).
- **Uso:** "Inspeções e Manutenções Preventivas e Corretivas" ou faixa de setores atendidos (industrial).

### 9. Chamas em close sobre fundo preto (Mixkit)
- **Página:** https://mixkit.co/free-stock-video/mesmerizing-close-up-of-flames-over-a-black-background-52312/
- **MP4 720p:** https://assets.mixkit.co/videos/52312/52312-720.mp4 (7,11 MB)
- **MP4 1080p:** https://assets.mixkit.co/videos/52312/52312-1080.mp4 (68,14 MB, pesado demais)
- **Poster:** https://assets.mixkit.co/videos/52312/52312-thumb-720-0.jpg
- **Duração / resolução:** 18,7 s, 1280x720.
- **Licença:** Mixkit Free (`videoFree`).
- **Uso:** transições entre seções e fundo do CTA final. O fundo é preto, então dá para usar `mix-blend-mode: screen` sobre a página escura, e o fogo "aparece" sem caixa.

### 10. Bombeiros na fumaça com luz de sirene (Pixabay)
- **Página:** https://pixabay.com/videos/blue-light-fire-fighters-fire-smoke-8346/
- **MP4 1080p:** https://cdn.pixabay.com/video/2017/03/11/8346-208046347_large.mp4 (8,18 MB)
- **MP4 720p:** https://cdn.pixabay.com/video/2017/03/11/8346-208046347_medium.mp4 (4,42 MB)
- **Duração / resolução:** 25,8 s, 1920x1080.
- **Licença:** Pixabay Content License.
- **Uso:** alternativa de hero, mais dramática e cinematográfica, ou fundo da seção "Compromisso com a Segurança".

## Reservas (conferidas, também com HTTP 200)

| Vídeo | MP4 direto | Duração / resolução | Tamanho | Uso |
|---|---|---|---|---|
| Pexels 34775772: close nos módulos de supressão | https://videos.pexels.com/video-files/34775772/14743044_1920_1080_30fps.mp4 | 5 s, 1920x1080 (fMP4) | 4,09 MB (720p: 1,78 MB) | fundo leve de card "sistemas fixos" |
| Mixkit 49160: bombeiros com mangueira em rua | https://assets.mixkit.co/videos/49160/49160-720.mp4 | 6 s, 1280x720 | 1,84 MB | corte no reel do hero |
| Mixkit 15596: galpão industrial visto de drone | https://assets.mixkit.co/videos/15596/15596-720.mp4 | 17 s, 1280x720 | 4,93 MB | seção Clientes / setores |
| Mixkit 23406: engenheiro com planta em armazém | https://assets.mixkit.co/videos/23406/23406-720.mp4 | 11 s, 1280x720 | 3,46 MB | "Projetos Técnicos e Suporte para AVCB" |
| Pexels 8963675: engenheira com tablet em obra | https://videos.pexels.com/video-files/8963675/8963675-hd_1920_1080_25fps.mp4 | 9 s, 1920x1080 | 5,44 MB | alternativa para a seção do App |
| Pexels 19259956: chamas em close, fundo preto | https://videos.pexels.com/video-files/19259956/19259956-hd_1280_720_24fps.mp4 | 36 s, 1280x720 | 10,73 MB | alternativa de transição |

## Descartados e por quê

- **Mixkit 49220 ("A bulk collection of fire extinguishers"):** o título fala em extintores, mas os cilindros têm a inscrição "ПРОПАН" (propano). Usar seria enganoso para uma empresa de combate a incêndio.
- **Pexels 34775815, 34775766 e 34775765 (mesma série do item 1):** a marca "GASBASE.RU" e adesivos "FIRE SAFETY EXPERT" aparecem legíveis. Pelas licenças, marcas de terceiros não podem sugerir endosso.
- **Sprinklers / chuveiros automáticos:** nenhum dos quatro bancos tem vídeo real de sprinkler de incêndio. Os resultados são só irrigação de jardim (por exemplo, Pexels 13212740 e Pixabay 44758), o que seria enganoso. Melhor usar os vídeos de sistema fixo (itens 1 e 4), uma animação própria em SVG/Lottie de sprinkler, ou filmagem real da Protecin.
- **Pexels 11895780 (treinamento com botijão):** cena de evento com plateia e enquadramento informal. Fica abaixo do padrão visual pretendido.
- **Pexels 34596374 (treinamento em campo de refugiados):** contexto sensível, não combina com peça comercial.
- **Pixabay 3272 e 110321:** extintor em desenho animado ou ícone, fora do tom institucional.
- **Pixabay 221860:** extintor em render 3D sobre fundo azul. Leve (1,66 MB), mas com estética de banco genérico. Pode servir como teste de cena 3D, não como vídeo principal.
- **Mixkit 3463 (faíscas):** vertical (720x1280).
- **Coverr:** as buscas por fire, firefighter, fire-extinguisher, factory e warehouse só trouxeram velas, churrasco, fumaça de cigarro, gerações de IA e itens premium. Nada útil de prevenção a incêndio.
- **Versões 1080p da Mixkit:** a maioria retorna 403, e as que abrem ficam entre 29 e 101 MB. Na Mixkit, fique com a 720p.

## Resumo das licenças (sem atribuição obrigatória nos três bancos usados)

- **Pexels** (https://www.pexels.com/license/): uso gratuito, inclusive comercial, e a atribuição é opcional. Pode editar. Não pode:
  - mostrar pessoas identificáveis de forma ofensiva;
  - sugerir endosso de pessoas ou marcas que aparecem;
  - vender cópias sem alteração;
  - redistribuir em outros bancos;
  - usar como parte de marca ou nome comercial.
- **Mixkit Stock Video Free License** (https://mixkit.co/license/): uso gratuito em projetos comerciais e pessoais, sem atribuição. A própria página de cada vídeo diz isso, e todos os itens acima estão marcados como `videoFree`, não `videoRestricted`. Não pode redistribuir o clipe isolado como arquivo de banco.
- **Pixabay Content License** (https://pixabay.com/service/license-summary/): uso gratuito, inclusive comercial, e a atribuição é opcional. Não pode:
  - vender ou distribuir o conteúdo sem alteração;
  - usar marcas reconhecíveis comercialmente;
  - fazer uso enganoso;
  - usar pessoas identificáveis de forma imoral ou ilegal;
  - usar como marca ou nome comercial.

Para a proposta, convém creditar os autores numa página de créditos, mesmo sem obrigação. Isso passa profissionalismo.

## Notas de implementação para a demo

- **Hospedar localmente** (`public/videos/`), sem hotlink da CDN dos bancos. O GitHub Pages aceita bem arquivos desse porte, com limite de 100 MB por arquivo.
- **Atributos:** `<video autoplay muted loop playsinline preload="metadata" poster="...">`. O hero carrega logo; os vídeos abaixo da dobra só recebem `src` quando entram na tela (IntersectionObserver). Com `prefers-reduced-motion`, mostrar só o poster.
- **Orçamento de peso:** hero em 720p, entre 6 e 9 MB. Se possível, gerar versões WebM/AV1 menores. Os MP4 fragmentados (itens 1 e 4 e a reserva 34775772) devem ser remuxados com `+faststart` (o ffmpeg não está instalado nesta máquina).
- **Fotos e vídeos de bancos são ilustrativos.** Não apresentar pessoas dos vídeos como equipe ou clientes da Protecin.
