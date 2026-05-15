@echo off
chcp 65001 >nul
echo ============================================
echo   주안센트럴파라곤 - 로컬 서버 시작
echo ============================================
echo.
echo 서버 주소: http://localhost:8000/
echo.
echo 브라우저를 자동으로 엽니다... (서버 중지: Ctrl+C)
echo ============================================
echo.

start "" "http://localhost:8000/"
python -m http.server 8000
