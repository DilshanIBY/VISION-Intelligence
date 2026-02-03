<#
.SYNOPSIS
    Run GitHub Actions workflows locally using act (Docker-based)
.DESCRIPTION
    This script runs all CI workflows locally before pushing to GitHub.
    Requires Docker to be running.
#>

$ErrorActionPreference = "Continue"

# Colors for output
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Fail { param($msg) Write-Host "[FAIL] $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "[..] $msg" -ForegroundColor Cyan }
function Write-Header { param($msg) Write-Host "`n=== $msg ===" -ForegroundColor Yellow }
function Write-Debug { param($msg) Write-Host "[DEBUG] $msg" -ForegroundColor DarkGray }

Write-Header "APPAREL Local CI/CD Runner"
Write-Debug "Script started at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Debug "PowerShell version: $($PSVersionTable.PSVersion)"

# Check Docker
Write-Info "Checking Docker..."
$dockerInfo = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Docker is not running or has issues."
    Write-Debug "Error: $dockerInfo"
    Write-Host ""
    Write-Host "Try these fixes:" -ForegroundColor Yellow
    Write-Host "  1. Restart Docker Desktop" -ForegroundColor Gray
    Write-Host "  2. If that fails, run: wsl --shutdown" -ForegroundColor Gray
    Write-Host "  3. Then restart Docker Desktop" -ForegroundColor Gray
    exit 1
}
Write-Success "Docker is running"

# Show Docker disk usage (optional, don't fail on error)
Write-Debug "Checking Docker disk usage..."
$dockerDf = docker system df --format "{{.Type}}: {{.Size}}" 2>&1
if ($LASTEXITCODE -eq 0) {
    $dockerDf | ForEach-Object { Write-Debug "  $_" }
} else {
    Write-Debug "  Could not get disk usage (non-critical)"
}

# Check/Install act
Write-Info "Checking act..."
$actPath = Get-Command act -ErrorAction SilentlyContinue
if (-not $actPath) {
    Write-Info "Installing act via winget..."
    winget install nektos.act -e --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Fail "Failed to install act. Please install manually: https://github.com/nektos/act"
        exit 1
    }
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}
$actVersion = act --version 2>&1
Write-Success "act is available ($actVersion)"

# Check available disk space
$tempDrive = (Get-Item $env:TEMP).PSDrive.Name
$freeSpace = (Get-PSDrive $tempDrive).Free
$freeSpaceGB = [math]::Round($freeSpace / 1GB, 2)
Write-Debug "Temp directory: $env:TEMP"
Write-Debug "Free disk space on ${tempDrive}: ${freeSpaceGB} GB"
if ($freeSpaceGB -lt 2) {
    Write-Fail "Low disk space! Less than 2GB free. act requires disk space for Docker images and temp files."
    Write-Info "Try: docker system prune -a"
    exit 1
}

# Get project root (where this script is located, go up one level)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot
Write-Debug "Project root: $projectRoot"

Write-Header "Running CI Workflow"
Write-Info "This will run: lint, type-check, format:check, build"
Write-Host ""

# Run act with verbose output for better debugging
$actArgs = @(
    "push"
    "-W", ".github/workflows/ci.yml"
    "--container-architecture", "linux/amd64"
    "-P", "ubuntu-latest=catthehacker/ubuntu:act-latest"
    "--verbose"
)

Write-Debug "Running: act $($actArgs -join ' ')"
Write-Host ""

# Capture start time
$startTime = Get-Date

# Run act and capture exit code
& act @actArgs
$exitCode = $LASTEXITCODE

# Calculate duration
$duration = (Get-Date) - $startTime
$durationStr = "{0:mm}m {0:ss}s" -f $duration

Write-Host ""
Write-Debug "Workflow completed in $durationStr"

if ($exitCode -eq 0) {
    Write-Header "ALL CHECKS PASSED"
    Write-Success "Safe to push!"
    exit 0
} else {
    Write-Header "CHECKS FAILED (exit code: $exitCode)"
    Write-Fail "Please fix the issues above before pushing."
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Disk space: Run 'docker system prune -a' to free space" -ForegroundColor Gray
    Write-Host "  - Docker errors: Restart Docker Desktop" -ForegroundColor Gray
    Write-Host "  - Lint errors: Run 'npm run lint:fix' to auto-fix" -ForegroundColor Gray
    Write-Host "  - Format errors: Run 'npm run format' to auto-fix" -ForegroundColor Gray
    Write-Host ""
    exit $exitCode
}
