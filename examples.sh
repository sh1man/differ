# Примеры API запросов для ASR Differ

## 1. Проверка работоспособности
curl http://localhost:8000/health

## 2. Информация о API
curl http://localhost:8000/

## 3. Простое сравнение
curl -X POST "http://localhost:8000/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_text": "привет мир как дела",
    "hypothesis_text": "Привет, мир! Как дела?"
  }'

## 4. Сравнение с числами (автоматическая нормализация через Gemini)
curl -X POST "http://localhost:8000/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_text": "всем добрый день у нас 2024 год и 1000000 рублей",
    "hypothesis_text": "Всем добрый день. У нас две тысячи двадцать четвёртый год и один миллион рублей."
  }'

## 5. Сравнение длинных текстов
curl -X POST "http://localhost:8000/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_text": "всем добрый день здравствуйте через несколько минут здесь будет президент и он начнёт подводить итоги уходящего 2024 года",
    "hypothesis_text": "Всем добрый день. Здравствуйте. Через несколько минут здесь будет президент, и он начнет подводить итоги уходящего 2024 года."
  }'

## 6. Идентичные тексты (должны дать WER=0)
curl -X POST "http://localhost:8000/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_text": "это тестовый текст",
    "hypothesis_text": "это тестовый текст"
  }'

## 7. С форматированным выводом (jq)
# Требуется установленный jq: sudo apt install jq
curl -X POST "http://localhost:8000/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_text": "привет мир",
    "hypothesis_text": "Привет, мир!"
  }' | jq '.'

## 8. Только метрики (без нормализованных текстов)
curl -X POST "http://localhost:8000/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_text": "текст для анализа",
    "hypothesis_text": "текст для анализа качества"
  }' | jq '{wer, cer, total_errors, total_words}'
