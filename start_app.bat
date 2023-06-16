@echo off
REM 關閉批處理文件的命令回顯（command echo）功能 - can't see commands

REM 啟動 Docker Compose 中定義的服務和容器
docker-compose start

REM 激活 poetry 虛擬環境並啟動 uvicorn server
start /B poetry run uvicorn main:app --reload --port 8888

REM 等待一段時間，确保服務器已啟動（可以根據實際情况調整等待時間）
ping 127.0.0.1 -n 5 > nul

REM 切换到 frontend 目錄
cd frontend

REM 啟動 npm
npm start

REM 按任意键退出
pause
