# Converte uma fonte HTML-Word (.doc) em .docx via COM do Word, preservando o @page.
#
# Uso (SOMENTE em pwsh 7; o powershell.exe 5.1 aninhado congela no SaveAs2):
#   pwsh -File converter-docx.ps1 -Fonte "_fonte\meu-material-fonte.doc" -Saida "meu-material.docx"
#
# Confirma no final largura x altura em mm lidas de volta do Word (esperado 200 x 275).

param(
    [Parameter(Mandatory)] [string] $Fonte,
    [Parameter(Mandatory)] [string] $Saida
)

$ErrorActionPreference = 'Stop'
$Fonte = (Resolve-Path $Fonte).Path
$Saida = [System.IO.Path]::GetFullPath($Saida)

if (Test-Path $Saida) {
    try { $h = [System.IO.File]::Open($Saida, 'Open', 'Write', 'None'); $h.Close() }
    catch { Write-Host "O .docx esta ABERTO no Word. Feche-o e rode de novo." -ForegroundColor Red; exit 1 }
}

$word = $null; $doc = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false; $word.DisplayAlerts = 0
    $doc = $word.Documents.Open($Fonte, $false, $true)   # somente leitura
    $doc.SaveAs2($Saida, 16)                              # 16 = wdFormatXMLDocument (.docx)
    $paginas  = $doc.ComputeStatistics(2)
    $palavras = $doc.ComputeStatistics(0)
    $larg = [math]::Round($doc.PageSetup.PageWidth  / 72 * 25.4)
    $alt  = [math]::Round($doc.PageSetup.PageHeight / 72 * 25.4)
    Write-Host ("gerado: {0} paginas, {1:N0} palavras, {2} x {3} mm" -f $paginas, $palavras, $larg, $alt) -ForegroundColor Green
    if ($larg -ne 200 -or $alt -ne 275) { Write-Host "ATENCAO: tamanho de pagina diferente de 200 x 275 mm" -ForegroundColor Red }
}
catch { Write-Host "falha na conversao: $($_.Exception.Message)" -ForegroundColor Red; exit 1 }
finally {
    # Sem try/finally, uma falha antes do Quit() deixa um WINWORD orfao segurando o arquivo.
    if ($doc)  { $doc.Close(0) }
    if ($word) { $word.Quit(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
    [GC]::Collect(); [GC]::WaitForPendingFinalizers()
    Start-Sleep -Milliseconds 700
    Get-Process -Name WINWORD -ErrorAction SilentlyContinue |
        Where-Object { -not $_.MainWindowTitle } | Stop-Process -Force -ErrorAction SilentlyContinue
}
