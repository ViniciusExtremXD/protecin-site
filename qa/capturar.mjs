// Capturas e checagens de QA com Chrome headless.
// Uso: node capturar.mjs <base-url> [saida] [rotas separadas por vírgula] [--faixas N]
//   As rotas podem levar query (ex.: "/?proposta=1"). --faixas limita as capturas por página (padrão 60).
//   O site novo anima sempre (não há ?motion= nem modo reduzido): nenhuma query é necessária para ver o movimento.
// Gera, por rota e por tela (desktop e celular): captura da página em faixas da altura da tela,
// erros de console, requisições que falharam, rolagem horizontal e elementos que vazam da tela.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => fs.existsSync(p));

const base = (process.argv[2] || 'https://protecin.com.br').replace(/\/$/, '');
const saida = process.argv[3] || 'capturas';
const rotas = (process.argv[4] && !process.argv[4].startsWith('--') ? process.argv[4] : '/,/institucional/,/servicos/,/nossos-clientes/,/catalogo-digital/,/nosso-app/,/contato/').split(',');
const maxFaixas = process.argv.includes('--faixas') ? Number(process.argv[process.argv.indexOf('--faixas') + 1]) : 60;
const TELAS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  celular: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

fs.mkdirSync(saida, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });
const relatorio = {};

for (const rota of rotas) {
  for (const [tela, viewport] of Object.entries(TELAS)) {
    const page = await browser.newPage();
    if (tela === 'celular') {
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    }
    await page.setViewport(viewport);
    const consoleErros = [];
    const falhas = [];
    page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !/kaspersky/.test(m.location()?.url ?? '')) consoleErros.push(`${m.type()}: ${m.text()}`.slice(0, 300)); });
    page.on('pageerror', (e) => consoleErros.push(`pageerror: ${e.message}`.slice(0, 300)));
    // ERR_ABORTED em mídia é o navegador cancelando o pedido de faixa de um vídeo pausado/fora da tela (normal);
    // o antivírus da máquina (Kaspersky) injeta pedidos próprios que também ficam fora
    page.on('requestfailed', (r) => {
      const t = r.failure()?.errorText ?? '';
      if (/kaspersky/.test(r.url()) || (t === 'net::ERR_ABORTED' && /\.(mp4|webm)(\?|$)/.test(r.url()))) return;
      falhas.push(`${t} ${r.url()}`.slice(0, 300));
    });
    page.on('response', (r) => { if (r.status() >= 400) falhas.push(`${r.status()} ${r.url()}`.slice(0, 300)); });
    // site novo: sem o preloader da 1ª visita da sessão (sem efeito em outros sites)
    await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('pt-intro', '1'); } catch {} });

    const inicio = Date.now();
    await page.goto(base + rota, { waitUntil: 'networkidle2', timeout: 90000 });
    const tempoCarga = Date.now() - inicio;
    // Rola a página inteira devagar para disparar lazy load e animações de entrada.
    await page.evaluate(async () => {
      const passo = Math.round(innerHeight * 0.6);
      for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      await new Promise((r) => setTimeout(r, 800));
    });

    const checagens = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const vazando = [];
      // Vazamento real = o que sobra para fora da tela depois do recorte dos ancestrais: o retângulo do elemento é
      // intersectado com o de cada ancestral cujo overflow-x não é "visible" (fitas, máscaras, carrosséis).
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('.sr-only, [hidden]') || getComputedStyle(el).position === 'fixed') continue;
        const r = el.getBoundingClientRect();
        if (!(r.width > 0)) continue;
        let left = r.left, right = r.right, fixo = false;
        for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
          const cs = getComputedStyle(a);
          if (cs.position === 'fixed') fixo = true;
          if (cs.overflowX !== 'visible' || cs.clipPath !== 'none') {
            const ra = a.getBoundingClientRect();
            left = Math.max(left, ra.left);
            right = Math.min(right, ra.right);
          }
        }
        if (fixo || right - left <= 0) continue;
        if (right > vw + 2 || left < -2) {
          vazando.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')} (${Math.round(left)}..${Math.round(right)})`);
        }
      }
      const toques = [];
      if (vw < 768) {
        for (const a of document.querySelectorAll('a, button')) {
          if (a.closest('.sr-only')) continue; // atalhos que só aparecem com foco (ex.: "Pular a linha do tempo")
          const r = a.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32) && a.offsetParent) toques.push(`${(a.innerText || a.getAttribute('aria-label') || a.href || '').trim().slice(0, 40)} ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      const pequenos = [];
      for (const el of document.querySelectorAll('p, li, a, span')) {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (el.innerText && el.innerText.trim().length > 20 && fs < 13 && el.offsetParent) pequenos.push(`${fs}px: ${el.innerText.trim().slice(0, 50)}`);
      }
      return {
        altura: document.documentElement.scrollHeight,
        rolagemHorizontal: document.documentElement.scrollWidth > vw,
        vazando: [...new Set(vazando)].slice(0, 15),
        alvosDeToquePequenos: [...new Set(toques)].slice(0, 20),
        textoPequeno: [...new Set(pequenos)].slice(0, 10),
        imagensQuebradas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      };
    });

    // Capturas em faixas do tamanho da tela (melhor para ler detalhes do que uma imagem gigante).
    const [caminho, query = ''] = rota.split('?');
    const slug = (caminho === '/' ? 'home' : caminho.replace(/\//g, '')) + (query ? `-${query.replace(/[^a-z0-9]+/gi, '_')}` : '');
    const faixas = Math.min(Math.ceil(checagens.altura / viewport.height), maxFaixas);
    for (let i = 0; i < faixas; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * viewport.height);
      await new Promise((r) => setTimeout(r, 450));
      await page.screenshot({ path: path.join(saida, `${tela}-${slug}-${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 72 });
    }
    relatorio[`${tela} ${rota}`] = { tempoCargaMs: tempoCarga, faixas, ...checagens, consoleErros: [...new Set(consoleErros)].slice(0, 20), falhas: [...new Set(falhas)].slice(0, 20) };
    await page.close();
    console.log(tela, rota, `${tempoCarga}ms`, `${faixas} faixas`);
  }
}

await browser.close();
fs.writeFileSync(path.join(saida, 'relatorio.json'), JSON.stringify(relatorio, null, 1));
console.log('ok', path.join(saida, 'relatorio.json'));
