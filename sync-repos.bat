@echo off
echo ==========================================
echo      Vibe App - Multi-Repo Sync
echo ==========================================

echo [1/3] Pulling latest changes from Origin...
git pull origin main

echo.
echo [2/3] Pushing to Origin (jacobjerin38)...
git push origin main

echo.
echo [3/3] Pushing to Target (jerinjacobai)...
git push target main

echo.
echo ==========================================
echo      Sync Complete!
echo ==========================================
pause
