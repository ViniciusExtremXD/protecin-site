# Mantém node_modules, dist e scratch fora do OneDrive (C:\DevCache\protecin).
# O `npm install` troca a junction do node_modules por uma pasta real: rode este script depois de cada install.
# scratch/ guarda as fontes brutas dos vídeos e os quadros de revisão (dezenas de MB que não devem sincronizar).
$proj = Split-Path -Parent $PSScriptRoot
$cache = 'C:\DevCache\protecin'
$pastas = 'node_modules', 'dist', 'scratch'
foreach ($d in $pastas) {
  New-Item -ItemType Directory -Force "$cache\$d" | Out-Null
  $alvo = Join-Path $proj $d
  if (Test-Path $alvo) {
    $item = Get-Item $alvo -Force
    if ($item.LinkType) { continue }
    robocopy $alvo "$cache\$d" /E /MOVE /NFL /NDL /NJH /NJS | Out-Null
    if (Test-Path $alvo) { Remove-Item $alvo -Recurse -Force }
  }
  New-Item -ItemType Junction -Path $alvo -Target "$cache\$d" | Out-Null
}
$pastas | ForEach-Object { Get-Item (Join-Path $proj $_) -Force } | Select-Object Name, LinkType, Target
