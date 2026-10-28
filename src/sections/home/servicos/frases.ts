import type { ServicoSlug } from "../../../data/site";

/*
 * Uma frase por serviço para a grade da home (H3, rodada de sobriedade: "imagem, título, uma frase, um link").
 * PROPOSTA para src/data/site.ts (campo `frase` em Servico): cada frase é trecho literal do `resumo` ou da
 * `descricao` do próprio serviço, só com cortes, sem palavra nova. O `resumo` inteiro (de 105 a 165 caracteres)
 * não cabe no teto de altura da seção; o texto completo continua nos capítulos de /servicos/.
 */
export const FRASE_CURTA: Record<ServicoSlug, string> = {
  // resumo: "…para implantação de sistemas fixos e equipamentos de combate a incêndio, com segurança…"
  "instalacao-de-sistemas-e-equipamentos": "Implantação de sistemas fixos e equipamentos de combate a incêndio.",
  // resumo, até "ART"
  "projetos-tecnicos": "Elaboração de projetos legais e executivos com emissão de ART.",
  // resumo, até "AVCB"
  "documentacao-e-regularizacao": "Assessoria técnica para emissão de laudos, licenças e renovação de AVCB.",
  // descrição: "…inspeções periódicas, testes hidrostáticos, […] conforme exigências das NBRs…"
  "inspecoes-e-manutencoes-preventivas": "Inspeções periódicas e testes hidrostáticos conforme exigências das NBRs.",
  // descrição: "Equipamentos homologados e manutenção certificada pelo INMETRO, com rastreabilidade e garantia."
  "manutencao-de-equipamentos": "Manutenção certificada pelo INMETRO, com rastreabilidade e garantia.",
  // descrição: "Elaboração de laudos e programas por engenheiros das áreas Civil, Elétrica, Mecânica e de Segurança…"
  "gestao-de-riscos-e-consultoria": "Laudos e programas por engenheiros das áreas Civil, Elétrica, Mecânica e de Segurança.",
  // resumo: "Comercialização de extintores, mangueiras, sinalizações, sistemas fixos de alta qualidade e demais…"
  "venda-de-equipamentos": "Comercialização de extintores, mangueiras, sinalizações e sistemas fixos.",
  // resumo: "Implementação de sinalizações fotoluminescentes, orientativas, de emergência e salvamento conforme normas."
  "sinalizacao-de-seguranca": "Sinalizações fotoluminescentes, orientativas, de emergência e salvamento.",
};
