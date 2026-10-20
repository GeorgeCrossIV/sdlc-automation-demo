@echo off
:: ============================================================
::  reset-demo.bat  —  Reset the SDLC Automation demo to its
::  baseline state so the demo can be run again cleanly.
::
::  What it does:
::    1. Removes the dist/ build artefacts inside finance-app
::    2. Resets the git branch to the initial baseline commit
::       on feature/initial-finance-dashboard, discarding any
::       working-tree changes made during the demo
::    3. Checks out the feature branch (creates it if absent)
::    4. Confirms the app still builds correctly (optional)
::
::  Run from the SDLC Automation workspace root.
:: ============================================================

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║         IBM Bob  —  SDLC Demo  Reset Script         ║
echo ╚══════════════════════════════════════════════════════╝
echo.

:: ── Step 1: Confirm working directory ────────────────────────
if not exist "finance-app\package.json" (
    echo [ERROR] Run this script from the SDLC Automation workspace root.
    echo         Expected to find: finance-app\package.json
    pause
    exit /b 1
)

echo [1/5] Working directory confirmed.

:: ── Step 2: Remove dist/ build artefacts ─────────────────────
if exist "finance-app\dist" (
    echo [2/5] Removing finance-app\dist ...
    rmdir /s /q "finance-app\dist"
) else (
    echo [2/5] No dist\ folder found — skipping.
)

:: ── Step 3: Discard any working-tree changes in finance-app ──
echo [3/5] Resetting finance-app working tree (git restore) ...
git restore finance-app
if errorlevel 1 (
    echo [WARN] git restore returned a non-zero exit code.
    echo        If this is a fresh clone with no changes, that is fine.
)

:: ── Step 4: Remove any untracked files added during the demo ─
echo [4/5] Removing untracked files added during demo ...
git clean -fd finance-app
if errorlevel 1 (
    echo [WARN] git clean returned a non-zero exit code.
)

:: ── Step 5: Ensure we are on the feature branch ──────────────
echo [5/5] Checking out feature/initial-finance-dashboard ...
git checkout feature/initial-finance-dashboard 2>nul
if errorlevel 1 (
    echo       Branch not found — creating it from current HEAD.
    git checkout -b feature/initial-finance-dashboard
)

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║  Demo reset complete.  Ready to run again.          ║
echo ║                                                      ║
echo ║  Next steps:                                        ║
echo ║    cd finance-app                                   ║
echo ║    npm run dev          (start the dev server)      ║
echo ║    npm run validate     (lint + test + build)       ║
echo ╚══════════════════════════════════════════════════════╝
echo.
pause
