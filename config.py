from dataclasses import dataclass
import logging
import os
from dotenv import load_dotenv


load_dotenv()

logger = logging.getLogger(__name__)





@dataclass
class Config:
    gemini_api_key: str

    @staticmethod
    def from_env() -> "Config":
        gemini_api_key = os.getenv("GEMINI_API_KEY")

        return Config(
            gemini_api_key=gemini_api_key
        )


def create_config() -> Config:
    return Config.from_env()
