param(
    [string]$SiteDir = "dist",
    [string]$Version = "1.0.0"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Resolve-Path (Join-Path $scriptDir "..")
$sitePath = Join-Path $projectRoot $SiteDir
if (-not (Test-Path $sitePath)) {
    Write-Error "Site directory '$sitePath' not found. Run `npm run build` first."
    exit 1
}

$workDir = Join-Path $scriptDir "installer_build"
if (Test-Path $workDir) { Remove-Item $workDir -Recurse -Force }
New-Item -ItemType Directory -Path (Join-Path $workDir "app") | Out-Null
Copy-Item -Path (Join-Path $sitePath "*") -Destination (Join-Path $workDir "app") -Recurse

# Check for Inno Setup Compiler (ISCC.exe)
$iscc = Get-Command ISCC -ErrorAction SilentlyContinue
if (-not $iscc) {
    Write-Host "Inno Setup Compiler (ISCC.exe) not found in PATH."
    Write-Host "Download and install Inno Setup: https://jrsoftware.org/isdl.php"
    Write-Host "Then re-run this script."
    exit 1
}

# Run ISCC with preprocessor define for version
Push-Location $scriptDir
& $iscc.Source "/DMyAppVersion=$Version" "$scriptDir\app_installer.iss"
Pop-Location

Write-Host "Installer generation finished. Check the output EXE in the script folder (or the Inno Setup output directory)."
