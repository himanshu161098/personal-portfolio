# ==============================================================================
# Automatic File Watcher & GitHub Auto-Push Script for Windows
# Run via: powershell -ExecutionPolicy Bypass -File .\scripts\watch-and-push.ps1
# ==============================================================================

param(
    [int]$DebounceSeconds = 8
)

$repoPath = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $repoPath

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  HK Portfolio - Real-Time GitHub Auto-Push Watcher" -ForegroundColor Yellow
Write-Host "  Repository: $repoPath" -ForegroundColor DarkCyan
Write-Host "  Debounce interval: $DebounceSeconds seconds" -ForegroundColor Gray
Write-Host "  Press Ctrl+C to stop watching." -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $repoPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite'

$script:lastChanged = [DateTime]::MinValue
$script:pendingPush = $false

$action = {
    param($source, $event)
    $name = $event.Name
    # Ignore git internal files, temp files
    if ($name -match '^\.git' -or $name -match '\.tmp$' -or $name -match 'auto-push\.bat') { return }
    $script:lastChanged = [DateTime]::Now
    $script:pendingPush = $true
    Write-Host "[Change Detected] $name ($($event.ChangeType))" -ForegroundColor DarkGray
}

Register-ObjectEvent $watcher 'Changed' -Action $action | Out-Null
Register-ObjectEvent $watcher 'Created' -Action $action | Out-Null
Register-ObjectEvent $watcher 'Deleted' -Action $action | Out-Null
Register-ObjectEvent $watcher 'Renamed' -Action $action | Out-Null

try {
    while ($true) {
        Start-Sleep -Seconds 2
        if ($script:pendingPush -and (([DateTime]::Now - $script:lastChanged).TotalSeconds -ge $DebounceSeconds)) {
            $script:pendingPush = $false
            
            $status = (git status --porcelain)
            if ($status) {
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                Write-Host "`n[Auto-Push] Syncing changes at $timestamp..." -ForegroundColor Magenta
                git add -A
                git commit -m "auto: update portfolio ($timestamp)"
                git push origin main
                Write-Host "[Auto-Push] Pushed successfully to GitHub origin/main!`n" -ForegroundColor Green
            }
        }
    }
}
finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "Watcher stopped." -ForegroundColor Yellow
}
