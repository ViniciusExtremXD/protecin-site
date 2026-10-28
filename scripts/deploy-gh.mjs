/**
 * Publica dist/ (build estático da prévia) no branch gh-pages de ViniciusExtremXD/protecin-site
 * (design-final §17.8, passo 9). Rode com `npm run deploy:gh`, que faz o build:gh antes.
 *
 * - Trava de remoto: só publica se o origin for ViniciusExtremXD/protecin-site. Nada vai para a hospedagem
 *   da Protecin (Locaweb) por aqui.
 * - Branch e não GitHub Actions: o token do gh desta máquina não tem o escopo `workflow`.
 * - dist/ é junction para C:\DevCache: a cópia parte do caminho REAL (senão o cpSync recria o link).
 * - .nojekyll: o Pages serve os arquivos como estão.
 * - Push forçado só no gh-pages, num repositório temporário (o histórico do main não é tocado).
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const git = (args, cwd) => execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "inherit"] }).toString().trim();

if (!existsSync("dist/index.html")) {
  console.error("dist/ não existe. Rode `npm run build:gh` antes.");
  process.exit(1);
}
if (!readFileSync("dist/index.html", "utf8").includes("/protecin-site/assets/")) {
  console.error("dist/ não foi gerado com VITE_BASE=/protecin-site/. Rode `npm run build:gh`.");
  process.exit(1);
}
if (/googletagmanager/.test(readFileSync("dist/index.html", "utf8"))) {
  console.error("dist/ tem o snippet do GTM: a prévia publica sem VITE_GTM_ID.");
  process.exit(1);
}

const remoto = git(["remote", "get-url", "origin"]);
if (!/ViniciusExtremXD\/protecin-site(\.git)?$/i.test(remoto)) {
  console.error(`Remoto inesperado: ${remoto}. O deploy só publica em ViniciusExtremXD/protecin-site.`);
  process.exit(1);
}
const commit = git(["rev-parse", "--short", "HEAD"]);
const sujo = git(["status", "--porcelain"]) ? " (com alterações locais não commitadas)" : "";
const tmp = mkdtempSync(path.join(os.tmpdir(), "ptgh-"));

try {
  cpSync(realpathSync("dist"), tmp, { recursive: true });
  writeFileSync(path.join(tmp, ".nojekyll"), "");
  git(["init", "-q", "-b", "gh-pages"], tmp);
  git(["add", "-A"], tmp);
  git(["-c", "user.name=deploy", "-c", "user.email=deploy@local", "commit", "-q", "-m", `Prévia do site novo a partir de ${commit}${sujo}`], tmp);
  git(["push", "-q", "--force", remoto, "gh-pages"], tmp);
  console.log(`gh-pages publicado a partir de ${commit}${sujo}: https://viniciusextremxd.github.io/protecin-site/`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
