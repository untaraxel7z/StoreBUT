@echo off
cd /d "c:\Users\axelm\OneDrive\Área de Trabalho\SNKERS\SNKRS"
echo Instalando mysql2...
npm install mysql2
echo.
echo Executando migração...
node migrate.js
pause
