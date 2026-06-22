Set-Location $PSScriptRoot
$Port = 8000
$Url = "http://localhost:$Port/"
Write-Host "QA Portfolio server is starting..." -ForegroundColor Cyan
Write-Host "Open: $Url"
Start-Process $Url
if (Get-Command py -ErrorAction SilentlyContinue) {
    py .\serve.py $Port
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python .\serve.py $Port
} else {
    Write-Error "Python was not found. Install Python or start another static HTTP server in this folder."
}
