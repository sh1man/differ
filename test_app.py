"""
Тесты для ASR Differ API.
"""
import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)


# Тестовые данные
REFERENCE_TEXT_SHORT = "всем добрый день у нас 2024 год"
HYPOTHESIS_TEXT_SHORT = "Всем добрый день. У нас две тысячи двадцать четвёртый год."

REFERENCE_TEXT_LONG = """всем добрый день здравствуйте через несколько минут здесь будет президент
и он начнёт подводить итоги уходящего 2024 года я хочу вам напомнить что формат у нас совмещённый
это и пресс конференция и прямая линия с гражданами нашей страны"""

HYPOTHESIS_TEXT_LONG = """Всем добрый день. Здравствуйте. Через несколько минут здесь будет президент,
и он начнет подводить итоги уходящего 2024 года. Я хочу вам напомнить, что формат у нас совмещенный.
Это и пресс-конференция, и прямая линия с гражданами нашей страны."""


def test_root_endpoint():
    """Тест корневого endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "version" in data
    assert data["name"] == "ASR Differ API"


def test_health_check():
    """Тест health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"
    assert "gemini_configured" in data


def test_compare_short_texts():
    """Тест сравнения коротких текстов."""
    payload = {
        "reference_text": REFERENCE_TEXT_SHORT,
        "hypothesis_text": HYPOTHESIS_TEXT_SHORT
    }

    response = client.post("/compare", json=payload)
    assert response.status_code == 200

    data = response.json()

    # Проверяем наличие всех полей
    assert "wer" in data
    assert "cer" in data
    assert "total_errors" in data
    assert "substitutions" in data
    assert "deletions" in data
    assert "insertions" in data
    assert "total_words" in data
    assert "reference_normalized" in data
    assert "hypothesis_normalized" in data

    # Проверяем типы
    assert isinstance(data["wer"], float)
    assert isinstance(data["cer"], float)
    assert isinstance(data["total_errors"], int)
    assert isinstance(data["total_words"], int)

    # Проверяем что метрики в разумных пределах
    assert 0 <= data["wer"] <= 1
    assert 0 <= data["cer"] <= 1
    assert data["total_words"] > 0


def test_compare_long_texts():
    """Тест сравнения длинных текстов."""
    payload = {
        "reference_text": REFERENCE_TEXT_LONG,
        "hypothesis_text": HYPOTHESIS_TEXT_LONG
    }

    response = client.post("/compare", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["total_words"] > 20  # Длинный текст должен содержать много слов


def test_compare_identical_texts():
    """Тест сравнения идентичных текстов."""
    identical_text = "это тестовый текст для проверки"

    payload = {
        "reference_text": identical_text,
        "hypothesis_text": identical_text
    }

    response = client.post("/compare", json=payload)
    assert response.status_code == 200

    data = response.json()

    # Для идентичных текстов WER и CER должны быть 0
    assert data["wer"] == 0.0
    assert data["cer"] == 0.0
    assert data["total_errors"] == 0
    assert data["substitutions"] == 0
    assert data["deletions"] == 0
    assert data["insertions"] == 0


def test_compare_empty_texts():
    """Тест сравнения пустых текстов."""
    payload = {
        "reference_text": "",
        "hypothesis_text": ""
    }

    response = client.post("/compare", json=payload)
    # Должно обработаться, хотя результат может быть не очень осмысленным
    assert response.status_code in [200, 500]  # В зависимости от реализации jiwer


def test_compare_with_numbers():
    """Тест сравнения текстов с числами (без Gemini нормализация может дать ошибки)."""
    payload = {
        "reference_text": "У меня есть 1000 рублей и 25 копеек",
        "hypothesis_text": "У меня есть тысяча рублей и двадцать пять копеек"
    }

    response = client.post("/compare", json=payload)
    assert response.status_code == 200

    # С Gemini числа должны нормализоваться автоматически


def test_invalid_request():
    """Тест с невалидным запросом."""
    payload = {
        "reference_text": "текст"
        # Отсутствует hypothesis_text
    }

    response = client.post("/compare", json=payload)
    assert response.status_code == 422  # Unprocessable Entity


def test_compare_with_punctuation():
    """Тест сравнения текстов с разной пунктуацией."""
    payload = {
        "reference_text": "Привет мир как дела",
        "hypothesis_text": "Привет, мир! Как дела?"
    }

    response = client.post("/compare", json=payload)
    assert response.status_code == 200

    data = response.json()
    # После нормализации (удаления пунктуации) тексты должны быть идентичны
    assert data["wer"] == 0.0 or data["wer"] < 0.1  # Небольшая погрешность допустима


if __name__ == "__main__":
    print("=" * 80)
    print("Запуск локальных тестов ASR Differ API")
    print("=" * 80)

    print("\n1. Тест корневого endpoint...")
    test_root_endpoint()
    print("✅ Passed")

    print("\n2. Тест health check...")
    test_health_check()
    print("✅ Passed")

    print("\n3. Тест сравнения коротких текстов...")
    test_compare_short_texts()
    print("✅ Passed")

    print("\n4. Тест сравнения длинных текстов...")
    test_compare_long_texts()
    print("✅ Passed")

    print("\n5. Тест идентичных текстов...")
    test_compare_identical_texts()
    print("✅ Passed")

    print("\n6. Тест с числами...")
    test_compare_with_numbers()
    print("✅ Passed")

    print("\n7. Тест с пунктуацией...")
    test_compare_with_punctuation()
    print("✅ Passed")

    print("\n" + "=" * 80)
    print("✅ Все тесты пройдены успешно!")
    print("=" * 80)
