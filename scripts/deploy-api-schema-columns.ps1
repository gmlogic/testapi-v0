param(
    [string]$Remote = "panel-press.gmhost.gr",
    [string]$RemoteAppPath = "/var/www/clients/client5/web26/private/api-schema-columns",
    [string]$RemoteBackupDir = "/var/www/clients/client5/web26/private/backups",
    [switch]$InstallAndBuild,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$SshExe = Join-Path $env:WINDIR "System32\OpenSSH\ssh.exe"
$ScpExe = Join-Path $env:WINDIR "System32\OpenSSH\scp.exe"

$DeployItems = @(
    "app",
    "components",
    "hooks",
    "lib",
    "public",
    "styles",
    "types",
    "package.json",

    "next.config.mjs",
    "postcss.config.mjs",
    "tsconfig.json",
    "components.json",
    "ecosystem.config.js",
    "scripts"
)

function Invoke-CheckedCommand {
    param(
        [string]$Label,
        [string]$Exe,
        [string[]]$Arguments
    )

    Write-Host ""
    Write-Host $Label
    Write-Host ("> " + $Exe + " " + ($Arguments -join " "))

    if ($DryRun) {
        return
    }

    & $Exe @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Label failed with exit code $LASTEXITCODE"
    }
}

if (-not (Test-Path -LiteralPath $SshExe)) {
    throw "ssh.exe not found at $SshExe"
}

if (-not (Test-Path -LiteralPath $ScpExe)) {
    throw "scp.exe not found at $ScpExe"
}

foreach ($item in $DeployItems) {
    if (-not (Test-Path -LiteralPath $item)) {
        throw "Local deploy item not found: $item"
    }
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFileName = "api-schema-columns-deploy-files-$timestamp.tar.gz"
$remoteBackupPath = "$RemoteBackupDir/$backupFileName"
$remoteTarItems = ($DeployItems | ForEach-Object { "'$_'" }) -join " "

$backupCommand = @(
    "set -e",
    "mkdir -p '$RemoteAppPath'",
    "mkdir -p '$RemoteBackupDir'",
    "cd '$RemoteAppPath'",
    "tar -czf '$remoteBackupPath' --ignore-failed-read -- $remoteTarItems 2>/dev/null || true",
    "ls -lh '$remoteBackupPath' 2>/dev/null || echo 'No existing files to backup'"
) -join " && "

Invoke-CheckedCommand `
    -Label "Creating remote backup with deploy files only" `
    -Exe $SshExe `
    -Arguments @($Remote, $backupCommand)

$scpArgs = @("-r")
foreach ($item in $DeployItems) {
    $scpArgs += ".\$item"
}
$scpArgs += "${Remote}:${RemoteAppPath}/"

Invoke-CheckedCommand `
    -Label "Uploading deploy files" `
    -Exe $ScpExe `
    -Arguments $scpArgs

if ($InstallAndBuild) {
    $buildCommand = @(
        "set -e",
        "cd '$RemoteAppPath'",
        "npm install",
        "npm run build",
        "pm2 restart api-schema-columns"
    ) -join " && "

    Invoke-CheckedCommand `
        -Label "Installing dependencies, building and restarting PM2" `
        -Exe $SshExe `
        -Arguments @($Remote, $buildCommand)
}

Write-Host ""
Write-Host "Deploy upload completed."
Write-Host "Remote backup: $remoteBackupPath"

if (-not $InstallAndBuild) {
    Write-Host ""
    Write-Host "Next commands on server:"
    Write-Host "cd $RemoteAppPath"
    Write-Host "npm install"
    Write-Host "npm run build"
    Write-Host "pm2 restart api-schema-columns"
}
