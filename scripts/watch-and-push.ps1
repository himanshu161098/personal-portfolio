# ==============================================================================
# Automatic File Watcher & GitHub Auto-Push Script for Windows
# Run via: powershell -ExecutionPolicy Bypass -File .\scripts\watch-and-push.ps1
# ==============================================================================

param(
    [int]$DebounceSeconds = 6
)

# Resolve repository root path safely regardless of how the script is launched
$scriptDir = if ($PSScriptRoot) {
    $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Path) {
    Split-Path -Parent $MyInvocation.MyCommand.Path
} else {
    (Get-Location).Path
}

$repoPath = Split-Path -Parent $scriptDir
if (-not (Test-Path (Join-Path $repoPath ".git"))) {
    if (Test-Path (Join-Path $scriptDir ".git")) {
        $repoPath = $scriptDir
    } else {
        $repoPath = (Get-Location).Path
    }
}

Set-Location $repoPath

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  HK Portfolio - Real-Time GitHub Auto-Push Watcher" -ForegroundColor Yellow
Write-Host "  Repository: $repoPath" -ForegroundColor DarkCyan
Write-Host "  Debounce interval: $DebounceSeconds seconds" -ForegroundColor Gray
Write-Host "  Press Ctrl+C to stop watching." -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan

# Unique event identifiers for this session
$subPrefix = "HK_Portfolio_Watch_" + (Get-Random)
$eventNames = @('Changed', 'Created', 'Deleted', 'Renamed')
$sourceIds = @()

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $repoPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite, Size'

# Register event subscribers into PowerShell event queue (shared in main thread)
foreach ($evt in $eventNames) {
    $srcId = "${subPrefix}_${evt}"
    Register-ObjectEvent -InputObject $watcher -EventName $evt -SourceIdentifier $srcId | Out-Null
    $sourceIds += $srcId
}

$lastChanged = [DateTime]::MinValue
$pendingPush = $false
$recentChanges = [System.Collections.Generic.List[string]]::new()

try {
    Write-Host "`n[Watcher Active] Monitoring directory for edits...`n" -ForegroundColor Green

    while ($true) {
        # Check for any incoming filesystem events (1 second wait slice)
        $events = Get-Event -SourceIdentifier "${subPrefix}_*" -ErrorAction SilentlyContinue

        if ($events) {
            foreach ($e in $events) {
                $name = $e.SourceEventArgs.Name
                $changeType = $e.SourceEventArgs.ChangeType

                # Ignore git internals, locks, temp files, and automation scripts
                $shouldIgnore = ($name -match '(^|[\\/])\.git([\\/]|$)' -or 
                                 $name -match '\.tmp$' -or 
                                 $name -match 'index\.lock$' -or 
                                 $name -match 'auto-push\.bat$' -or
                                 $name -match 'watch-and-push\.bat$')

                if (-not $shouldIgnore) {
                    $lastChanged = [DateTime]::Now
                    $pendingPush = $true
                    $changeDesc = "$name ($changeType)"
                    if (-not $recentChanges.Contains($changeDesc)) {
                        $recentChanges.Add($changeDesc)
                        Write-Host "[Change Detected] $changeDesc" -ForegroundColor DarkCyan
                    }
                }

                Remove-Event -EventIdentifier $e.EventIdentifier -ErrorAction SilentlyContinue
            }
        }

        # If changes are pending and debounce time has passed, trigger auto-commit & push
        if ($pendingPush -and (([DateTime]::Now - $lastChanged).TotalSeconds -ge $DebounceSeconds)) {
            $pendingPush = $false
            $recentChanges.Clear()

            $status = (git status --porcelain)
            if ($status) {
                $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                Write-Host "`n--------------------------------------------------------" -ForegroundColor Magenta
                Write-Host "[Auto-Push] Syncing changes at $timestamp..." -ForegroundColor Magenta
                
                git add -A
                git commit -m "auto(portfolio): update files ($timestamp)"
                
                Write-Host "[Auto-Push] Pushing to GitHub origin main..." -ForegroundColor Yellow
                git push origin main

                if ($LASTEXITCODE -eq 0) {
                    Write-Host "[Auto-Push] Successfully pushed to GitHub origin/main!`n" -ForegroundColor Green
                } else {
                    Write-Host "[Auto-Push Warning] Git push encountered an issue. Will retry on next edit.`n" -ForegroundColor Red
                }
                Write-Host "--------------------------------------------------------`n" -ForegroundColor Magenta
            }
        }

        Start-Sleep -Milliseconds 800
    }
}
finally {
    # Clean up all registered event subscribers
    foreach ($srcId in $sourceIds) {
        Unregister-Event -SourceIdentifier $srcId -ErrorAction SilentlyContinue
    }
    Remove-Event -SourceIdentifier "${subPrefix}_*" -ErrorAction SilentlyContinue
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "`n[Watcher Stopped] Cleaned up event listeners." -ForegroundColor Yellow
}
