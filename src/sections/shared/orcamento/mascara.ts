/*
 * Máscara e validação dos campos do formulário de orçamento (design-final §9 H10.1).
 * Telefone: "(11) 99999-9999" ou "(11) 4977-8720" enquanto digita; válido com 10 ou 11 dígitos.
 */

/** Só os dígitos, no máximo 11 (DDD + 9 dígitos); um "+55" colado na frente sai. */
export function soDigitos(v: string): string {
  let d = v.replace(/\D/g, "");
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2); // colado com o código do país (+55)
  return d.slice(0, 11);
}

/** Formata os dígitos progressivamente: "(1", "(11) 9", "(11) 9999-9", "(11) 99999-9999". */
export function formatarTelefone(digitos: string): string {
  const d = soDigitos(digitos);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  if (resto.length <= 4) return `(${ddd}) ${resto}`;
  if (d.length <= 10) return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
  return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`;
}

/**
 * Aplica a máscara a partir do valor digitado e do anterior. Quando o visitante apaga um caractere da máscara
 * ("-", ")" ou espaço), os dígitos não mudam; nesse caso apaga também o último dígito, para o backspace não travar.
 */
export function mascararTelefone(novo: string, anterior = ""): string {
  let d = soDigitos(novo);
  if (novo.length < anterior.length && d === soDigitos(anterior)) d = d.slice(0, -1);
  return formatarTelefone(d);
}

export function telefoneValido(v: string): boolean {
  const n = soDigitos(v).length;
  return n >= 10 && n <= 11;
}

export function emailValido(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export function nomeValido(v: string): boolean {
  return v.trim().length >= 2;
}
