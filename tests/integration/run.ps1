$ROOT = $PSScriptRoot
Write-Host $ROOT

Push-Location $ROOT -StackName tests
python -m unittest discover -v -s ..
Pop-Location -StackName tests
