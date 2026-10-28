import { realpathSync } from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const raiz = process.cwd();

/** Caminho real do node_modules (é junction para C:\DevCache\protecin, fora do OneDrive). */
function nodeModulesReal(): string {
  try {
    return realpathSync(path.join(raiz, "node_modules"));
  } catch {
    return path.join(raiz, "node_modules");
  }
}

/**
 * Google Tag Manager: só entra no HTML quando VITE_GTM_ID existe no build (pendência do Gabriel, não se inventa ID).
 * No navegador, só carrega no domínio de produção ou com ?gtm_debug= / ?track= (padrão do Extin Seven).
 */
function gtm(id: string | undefined): Plugin {
  return {
    name: "protecin-gtm",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        if (!id) return html;
        const snippet = `<script>
      (function (w, d, s, l, i) {
        var prod = /(^|\\.)protecin\\.com\\.br$/.test(w.location.hostname);
        var debug = /[?&](gtm_debug|track)=/.test(w.location.search);
        w[l] = w[l] || [];
        if (!prod && !debug) return;
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", ${JSON.stringify(id)});
    </script>`;
        return html.replace("</head>", `    ${snippet}\n  </head>`);
      },
    },
  };
}

/** Prévia (base diferente de "/", ex.: GitHub Pages): nunca indexar. */
function previa(base: string): Plugin {
  return {
    name: "protecin-previa",
    transformIndexHtml(html) {
      if (base === "/") return html;
      return html.replace("<head>", `<head>\n    <meta name="robots" content="noindex, nofollow" />`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, raiz, "VITE_"), ...process.env };
  const base = env.VITE_BASE ?? "/";
  return {
    base,
    plugins: [react(), gtm(env.VITE_GTM_ID), previa(base)],
    // ano do build: o rodapé sai com ele no prerender e o cliente atualiza depois (sem divergência na hidratação)
    define: { __ANO_BUILD__: JSON.stringify(new Date().getFullYear()) },
    server: {
      host: "127.0.0.1",
      fs: { allow: [raiz, nodeModulesReal()] },
    },
    preview: { host: "127.0.0.1" },
  };
});
