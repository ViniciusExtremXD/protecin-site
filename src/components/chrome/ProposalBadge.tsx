import { PROPOSTA } from "../../data/site";
import { useProposalMode } from "../../lib/motion-pref";

/** Etiqueta do modo proposta (só com html.proposta): "Modo proposta · sair" limpa a sessão e recarrega. */
export function ProposalBadge() {
  const on = useProposalMode();
  if (!on) return null;
  const sair = () => {
    try {
      sessionStorage.removeItem("pt-proposta");
    } catch {
      /* sem storage */
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("proposta");
    window.location.replace(url.toString());
  };
  return (
    <button
      type="button"
      onClick={sair}
      data-motion="proposta"
      className="rotulo fixed bottom-[calc(68px+env(safe-area-inset-bottom))] left-3 z-proposta min-h-11 rounded-full border border-dashed border-papel-500 bg-noite-950/90 px-4 text-papel-300 transition-colors duration-200 hover:text-papel-50 md:bottom-4 md:left-4"
    >
      {PROPOSTA.badge}
    </button>
  );
}
