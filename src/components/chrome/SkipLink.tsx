import { UI } from "../../data/site";

/** "Pular para o conteúdo": visível só com foco, leva ao <main id="conteudo">. */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="fixed left-4 top-3 z-[95] -translate-y-[200%] rounded-full bg-papel-50 px-5 py-3 text-[15px] font-semibold text-noite-950 transition-transform duration-200 focus:translate-y-0"
    >
      {UI.pularConteudo}
    </a>
  );
}
