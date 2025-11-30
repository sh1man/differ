#!/bin/bash

# Скрипт для быстрого запуска ASR Differ API

echo "🚀 Запуск ASR Differ API сервера..."
echo ""

# Проверка .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден!"
    echo "   Создайте .env файл с вашим GEMINI_API_KEY:"
    echo "   echo 'GEMINI_API_KEY=your-key-here' > .env"
    echo ""
fi

# Запуск сервера
echo "📡 Сервер будет доступен на:"
echo "   - API: http://localhost:8000"
echo "   - Docs: http://localhost:8000/docs"
echo "   - ReDoc: http://localhost:8000/redoc"
echo ""
echo "Нажмите Ctrl+C для остановки"
echo ""

uvicorn app:app --reload --host 0.0.0.0 --port 8000
