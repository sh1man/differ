"""
FastAPI приложение для оценки качества ASR.
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import jiwer
from config import create_config
from utils import preprocess_text

app = FastAPI(
    title="ASR Differ API",
    description="API для сравнения эталонного текста с результатом ASR и расчета метрик WER/CER",
    version="0.1.0"
)

config = create_config()


class CompareRequest(BaseModel):
    """Запрос на сравнение текстов."""
    reference_text: str = Field(..., description="Эталонный (идеальный) текст")
    hypothesis_text: str = Field(..., description="Текст, распознанный ASR системой")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "reference_text": "всем добрый день у нас 2024 год",
                    "hypothesis_text": "Всем добрый день. У нас две тысячи двадцать четвёртый год."
                }
            ]
        }
    }


class CompareResponse(BaseModel):
    """Результат сравнения текстов."""
    wer: float = Field(..., description="Word Error Rate (процент ошибок на уровне слов)")
    cer: float = Field(..., description="Character Error Rate (процент ошибок на уровне символов)")
    total_errors: int = Field(..., description="Общее количество ошибок (S+D+I)")
    substitutions: int = Field(..., description="Количество замен (S)")
    deletions: int = Field(..., description="Количество удалений (D)")
    insertions: int = Field(..., description="Количество вставок (I)")
    total_words: int = Field(..., description="Общее количество слов в эталонном тексте")
    reference_normalized: str = Field(..., description="Нормализованный эталонный текст")
    hypothesis_normalized: str = Field(..., description="Нормализованный ASR текст")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "wer": 0.0345,
                    "cer": 0.0123,
                    "total_errors": 12,
                    "substitutions": 8,
                    "deletions": 2,
                    "insertions": 2,
                    "total_words": 347,
                    "reference_normalized": "всем добрый день у нас две тысячи двадцать четыре год",
                    "hypothesis_normalized": "всем добрый день у нас две тысячи двадцать четыре год"
                }
            ]
        }
    }


@app.get("/")
async def root():
    """Информация о API."""
    return {
        "name": "ASR Differ API",
        "version": "0.1.0",
        "description": "API для оценки качества ASR систем",
        "endpoints": {
            "/compare": "POST - Сравнить эталонный и ASR тексты",
            "/health": "GET - Проверка работоспособности",
            "/docs": "GET - Swagger документация",
        }
    }


@app.get("/health")
async def health_check():
    """Проверка работоспособности сервиса."""
    return {"status": "ok", "gemini_configured": bool(config.gemini_api_key)}


@app.post("/compare", response_model=CompareResponse)
async def compare_texts(request: CompareRequest):
    """
    Сравнивает эталонный текст с текстом, распознанным ASR системой.

    Рассчитывает метрики:
    - WER (Word Error Rate) - процент ошибок на уровне слов
    - CER (Character Error Rate) - процент ошибок на уровне символов
    - Подсчет замен, удалений и вставок

    Автоматически выполняет нормализацию чисел через Gemini AI.

    Args:
        request: Запрос с эталонным и ASR текстами

    Returns:
        CompareResponse: Результаты сравнения и метрики
    """
    try:
        # Предобработка текстов с AI нормализацией
        reference_norm = preprocess_text(request.reference_text, config)
        hypothesis_norm = preprocess_text(request.hypothesis_text, config)

        # Расчет метрик на уровне слов
        word_output = jiwer.process_words(reference_norm, hypothesis_norm)

        wer = word_output.wer
        substitutions = word_output.substitutions
        deletions = word_output.deletions
        insertions = word_output.insertions
        total_errors = substitutions + deletions + insertions
        total_words = len(reference_norm.split())

        # Расчет метрик на уровне символов
        char_output = jiwer.process_characters(reference_norm, hypothesis_norm)
        cer = char_output.cer

        return CompareResponse(
            wer=wer,
            cer=cer,
            total_errors=total_errors,
            substitutions=substitutions,
            deletions=deletions,
            insertions=insertions,
            total_words=total_words,
            reference_normalized=reference_norm,
            hypothesis_normalized=hypothesis_norm
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при обработке текстов: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
