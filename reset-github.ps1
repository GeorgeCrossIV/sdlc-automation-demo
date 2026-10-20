# reset-github.ps1
# Resets the GitHub repo to demo baseline.
# Usage: .\reset-github.ps1 [-Pat "ghp_..."]
# If -Pat is not supplied, checks $env:GITHUB_PAT, then prompts.

param(
    [string]$Pat = ""
)

# ── Resolve PAT ──────────────────────────────────────────────
if (-not $Pat) { $Pat = $env:GITHUB_PAT }
if (-not $Pat) {
    $Pat = Read-Host "Paste your GitHub Personal Access Token"
}
if (-not $Pat) {
    Write-Host "[ERROR] No token provided. Exiting." -ForegroundColor Red
    exit 1
}

$repo    = "GeorgeCrossIV/sdlc-automation-demo"
$branch  = "feature/initial-finance-dashboard"
$headers = @{
    Authorization  = "token $Pat"
    "Content-Type" = "application/json"
    "User-Agent"   = "PowerShell"
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  IBM Bob -- GitHub Demo Reset Script" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Close open PRs ───────────────────────────────────
Write-Host "[1/5] Closing open pull requests on $branch ..." -ForegroundColor Yellow
$prs = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/pulls?state=open&head=GeorgeCrossIV:$branch" -Headers $headers
if ($prs.Count -eq 0) {
    Write-Host "      No open PRs found -- skipping."
} else {
    foreach ($pr in $prs) {
        Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/pulls/$($pr.number)" `
            -Method PATCH -Headers $headers `
            -Body '{"state":"closed"}' | Out-Null
        Write-Host "      Closed PR #$($pr.number) -- $($pr.title)"
    }
}

# ── Step 2: Force-reset feature branch to main ───────────────
Write-Host ""
Write-Host "[2/5] Force-resetting $branch to main ..." -ForegroundColor Yellow
$mainRef = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/git/refs/heads/main" -Headers $headers
$sha = $mainRef.object.sha
Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/git/refs/heads/$branch" `
    -Method PATCH -Headers $headers `
    -Body "{`"sha`":`"$sha`",`"force`":true}" | Out-Null
Write-Host "      Feature branch reset to main SHA: $sha"

# ── Step 3: Reopen Issue #1 ──────────────────────────────────
Write-Host ""
Write-Host "[3/5] Reopening Issue #1 ..." -ForegroundColor Yellow
$issue = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/issues/1" -Headers $headers
if ($issue.state -eq "open") {
    Write-Host "      Issue #1 is already open -- skipping."
} else {
    Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/issues/1" `
        -Method PATCH -Headers $headers `
        -Body '{"state":"open"}' | Out-Null
    Write-Host "      Issue #1 reopened."
}

# ── Step 4: Delete old GitHub Actions workflow runs ──────────
Write-Host ""
Write-Host "[4/5] Deleting old GitHub Actions runs ..." -ForegroundColor Yellow
$deleted = 0
do {
    $runs = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/actions/runs?per_page=100" -Headers $headers
    foreach ($run in $runs.workflow_runs) {
        try {
            Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/actions/runs/$($run.id)" `
                -Method DELETE -Headers $headers | Out-Null
            $deleted++
        } catch {
            Write-Host "      Could not delete run $($run.id): $($_.Exception.Message)" -ForegroundColor Red
            $runs = $null
            break
        }
    }
} while ($runs -and $runs.workflow_runs.Count -gt 0)
Write-Host "      Deleted $deleted workflow run(s)."

# ── Step 5: Sync local branch ────────────────────────────────
Write-Host ""
Write-Host "[5/5] Syncing local branch to origin ..." -ForegroundColor Yellow
git fetch origin
git checkout $branch
git reset --hard "origin/$branch"

# ── Done ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  GitHub reset complete. Ready to demo again." -ForegroundColor Green
Write-Host ""
Write-Host "  State:" -ForegroundColor Green
Write-Host "    $branch = main" -ForegroundColor Green
Write-Host "    Issue #1 = open" -ForegroundColor Green
Write-Host "    No open PRs" -ForegroundColor Green
Write-Host "    No Actions runs" -ForegroundColor Green
Write-Host ""
Write-Host "  Next: open Bob IDE, switch to Agent mode," -ForegroundColor Green
Write-Host "  and start from Segment 2 of the demo script." -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
