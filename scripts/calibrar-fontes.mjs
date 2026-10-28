// Calibra os @font-face de fallback da Archivo e da JetBrains Mono (index.html e dev.html): abre as rotas com JS,
// mede cada texto real do site nas duas fontes SEM letter-spacing (razão de avanço pura) e agrupa por font-stretch
// e peso (Archivo ÷ Arial/Arial Bold) ou só peso (JetBrains Mono ÷ Consolas). A razão vira o size-adjust da face.
// Uso: node scripts/calibrar-fontes.mjs [base-url] [rotas...]   (padrão http://127.0.0.1:5185, o npm run dev)
import os from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";
const base = (process.argv[2] ?? "http://127.0.0.1:5185").replace(/\/$/, "");
const rotas = process.argv.slice(3).length ? process.argv.slice(3) : ["/", "/servicos/", "/nosso-app/", "/institucional/", "/nossos-clientes/", "/contato/", "/catalogo-digital/"];
const nav = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, userDataDir: path.join(os.tmpdir(), "ptfontes") });
const total = {};
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true }]) {
  for (const rota of rotas) {
    const page = await nav.newPage();
    await page.setViewport(vp);
    await page.goto(`${base}${rota}`, { waitUntil: "networkidle0", timeout: 120000 });
    await new Promise((r) => setTimeout(r, 1500));
    const r = await page.evaluate(async () => {
      await document.fonts.ready;
      const st = document.createElement("style");
      st.textContent = `
        @font-face{font-family:"T Arial";src:local("Arial"),local("ArialMT");font-weight:100 599;font-stretch:50% 200%}
        @font-face{font-family:"T Arial";src:local("Arial Bold"),local("Arial-BoldMT");font-weight:600 1000;font-stretch:50% 200%}
        @font-face{font-family:"T Mono";src:local("Consolas");font-weight:100 599}
        @font-face{font-family:"T Mono";src:local("Consolas Bold");font-weight:600 1000}`;
      document.head.append(st);
      const caixa = document.createElement("div");
      caixa.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap";
      document.body.append(caixa);
      for (const f of ['16px "T Arial"', 'bold 16px "T Arial"', '16px "T Mono"', 'bold 16px "T Mono"']) await document.fonts.load(f);
      const out = {};
      const els = [...document.querySelectorAll("body *")].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
      for (const el of els) {
        if (el.closest("noscript,style,script,svg")) continue;
        const cs = getComputedStyle(el);
        const mono = /JetBrains/.test(cs.fontFamily.split(",")[0]);
        const archivo = /Archivo/.test(cs.fontFamily.split(",")[0]);
        if (!mono && !archivo) continue;
        const txt = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").replace(/\s+/g, " ").trim();
        if (!txt) continue;
        const s = document.createElement("span");
        s.textContent = txt;
        s.style.fontSize = cs.fontSize;
        s.style.fontWeight = cs.fontWeight;
        s.style.fontStretch = cs.fontStretch;
        s.style.textTransform = cs.textTransform;
        s.style.letterSpacing = "0px";
        s.style.fontFeatureSettings = cs.fontFeatureSettings;
        s.style.fontVariantNumeric = cs.fontVariantNumeric;
        s.style.fontFamily = mono ? '"JetBrains Mono Variable"' : '"Archivo Variable"';
        caixa.append(s);
        const wa = s.getBoundingClientRect().width;
        s.style.fontFamily = mono ? '"T Mono"' : '"T Arial"';
        const wf = s.getBoundingClientRect().width;
        s.remove();
        const est = parseFloat(cs.fontStretch);
        const peso = +cs.fontWeight;
        const k = mono ? `mono|${peso >= 600 ? "bold" : "reg"}` : `${est}|${peso >= 600 ? "bold" : "reg"}`;
        out[k] ??= { wa: 0, wf: 0, n: 0, ex: "" };
        out[k].wa += wa;
        out[k].wf += wf;
        out[k].n++;
        if (!out[k].ex) out[k].ex = `${cs.fontSize} ${peso} ${cs.textTransform} "${txt.slice(0, 30)}"`;
      }
      return out;
    });
    for (const [k, v] of Object.entries(r)) {
      total[k] ??= { wa: 0, wf: 0, n: 0, ex: v.ex };
      total[k].wa += v.wa;
      total[k].wf += v.wf;
      total[k].n += v.n;
    }
    await page.close();
  }
}
for (const [k, v] of Object.entries(total).sort()) console.log(k.padEnd(12), "razão", (v.wa / v.wf).toFixed(4), "n", String(v.n).padStart(4), "larg", String(Math.round(v.wa)).padStart(7), v.ex);
await nav.close();
process.exit(0);
