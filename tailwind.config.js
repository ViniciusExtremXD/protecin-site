/** Tokens do sistema visual (design-final §4). Cores fora desta lista não entram no site. */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./dev.html", "./src/**/*.{ts,tsx}"],
  // group-hover/hover só em aparelhos com hover de verdade (no toque, nada fica "preso" no estado de hover)
  future: { hoverOnlyWhenSupported: true },
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      pin: { raw: "(min-width: 1024px) and (min-height: 640px)" },
      curto: { raw: "(max-height: 560px)" },
    },
    extend: {
      colors: {
        noite: { 950: "#050A12", 900: "#09111C", 800: "#0F1A28", 700: "#182536", 600: "#253447", 500: "#5A6779" },
        marinho: { 900: "#071A2B", 800: "#0A2741", 700: "#0E3452", 600: "#164A73", 500: "#3A77A8", 300: "#9DB8D0" },
        brasa: { 600: "#8F141B", 500: "#BE1E29", 400: "#E8442E", 300: "#FF6A4D", 200: "#FFB199" },
        papel: { 50: "#F3EFE9", 100: "#E9E3DA", 300: "#B8BFC9", 500: "#8C95A3" },
        grafite: { 600: "#4B5866" },
        fotolum: "#D8F36A",
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ['"Archivo Variable"', '"Archivo Fallback"', "Arial", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono Fallback"', "ui-monospace", "Consolas", "monospace"],
      },
      fontSize: {
        // títulos grandes: classes .display-xxl/.display-xl/.display-l de styles.css (com o teto da sobriedade §3);
        // os tokens text-display-* daqui não eram usados e saíram
        titulo: ["clamp(1.375rem, 1.8vw, 1.75rem)", { lineHeight: "1.2", fontWeight: "600" }],
        "corpo-l": ["clamp(1.125rem, 1.3vw, 1.3125rem)", { lineHeight: "1.55" }],
        corpo: ["1rem", { lineHeight: "1.65" }],
        rotulo: ["13px", { lineHeight: "1.35", letterSpacing: "0.16em", fontWeight: "500" }],
        botao: ["16px", { lineHeight: "1", letterSpacing: "0.01em", fontWeight: "600" }],
      },
      maxWidth: { texto: "62ch", container: "1440px" },
      borderRadius: { "r-sm": "10px", "r-md": "18px", "r-lg": "28px", "r-janela": "40px", gota: "50% 0 50% 50%" },
      zIndex: { preloader: "90", cortina: "80", menu: "70", grao: "60", toast: "55", nav: "50", flutuante: "45", proposta: "44" },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
        in: "cubic-bezier(0.7, 0, 0.84, 0)",
        back: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: { micro: "200ms", curta: "350ms", base: "600ms", longa: "800ms", max: "900ms" },
      backgroundImage: {
        "luz-brasa": "radial-gradient(60% 50% at 50% 100%, rgba(190,30,41,.55), rgba(190,30,41,0) 70%)",
        "veu-hero":
          "linear-gradient(180deg, rgba(5,10,18,.60) 0%, rgba(5,10,18,.20) 38%, rgba(5,10,18,.88) 100%), linear-gradient(90deg, rgba(5,10,18,.75) 0%, rgba(5,10,18,0) 60%)",
        "mundo-azul": "radial-gradient(80% 70% at 70% 40%, #164A73 0%, #0E3452 45%, #071A2B 100%)",
        "mundo-vermelho": "radial-gradient(70% 60% at 50% 110%, #BE1E29 0%, #5A0B10 45%, #050A12 100%)",
      },
    },
  },
  plugins: [],
};
