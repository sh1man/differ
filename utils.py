import string

from config import Config


def preprocess_text(text, config: Config):
    """
    Приводит текст к нижнему регистру и удаляет всю пунктуацию
    для корректного сравнения ASR.

    Args:
        text: Текст для обработки
    """

    # Нижний регистр
    text_lowered = text.lower()

    # Преобразование ё в е
    text_lowered = text_lowered.replace('ё', 'е')

    # Таблица для удаления всех знаков из string.punctuation
    translator = str.maketrans('', '', string.punctuation)

    # Удаляем пунктуацию
    text_cleaned = text_lowered.translate(translator)

    # Опционально: сжимаем несколько пробелов в один
    # Это важно, так как jiwer работает со списками слов
    text_normalized = " ".join(text_cleaned.split())

    return text_normalized