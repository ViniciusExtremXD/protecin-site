import { FORM, type DadosFormulario } from "../../../data/site";

/*
 * Envio do formulário de orçamento (design-final §9 H10.1, "Envio").
 *
 * Esta construção é a demo da proposta: NÃO envia nada para lugar nenhum (nenhum fetch, nenhum serviço de
 * terceiros). Simula 1,2 s e responde sucesso; a tela de sucesso diz que é uma demonstração (FORM.sucessoDemo).
 * O envio real (FORM.endpoint) só entra na versão de produção, depois que a Protecin aprovar a proposta e o
 * destinatário for ativado; até lá, os caminhos que entregam de fato são o WhatsApp e o e-mail (mailto) com o resumo.
 */

export interface Solicitacao extends DadosFormulario {
  slugs: string[];
  email: string;
  telefone: string;
  mensagem?: string;
}

const semOpcional = (rotulo: string) => rotulo.replace(/\s*\(opcional\)\s*$/i, "");

/** Resumo para o corpo do e-mail de reserva: a frase do WhatsApp + contato e mensagem, um por linha. */
export function resumoCompleto(s: Solicitacao): string {
  const linhas = [FORM.waResumo(s)];
  if (s.email.trim()) linhas.push(`${FORM.campos.email.label}: ${s.email.trim()}`);
  if (s.telefone.trim()) linhas.push(`${FORM.campos.telefone.label}: ${s.telefone.trim()}`);
  if (s.mensagem?.trim()) linhas.push(`${semOpcional(FORM.campos.mensagem.label)}: ${s.mensagem.trim()}`);
  return linhas.join("\n");
}

const esperar = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** Demo: simula o envio. Em desenvolvimento, `?form=erro` força a tela de erro (para conferir o estado). */
export async function enviarSolicitacao(_s: Solicitacao): Promise<{ ok: boolean; demo: true }> {
  await esperar(1200);
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get("form") === "erro") return { ok: false, demo: true };
  return { ok: true, demo: true };
}
