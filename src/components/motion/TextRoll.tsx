/** Rolagem de texto no hover: duas cópias num contêiner overflow-clip; no hover do `.group` pai a de cima sobe. */
export function TextRoll({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`roll ${className ?? ""}`} data-motion="roll">
      <span>{text}</span>
      <span aria-hidden>{text}</span>
    </span>
  );
}
