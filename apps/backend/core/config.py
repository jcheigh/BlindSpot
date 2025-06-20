from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[1] / ".env"

class Settings(BaseSettings):
    GOODFIRE_API_KEY: str 
    CALL_BUDGET: int
    GOODFIRE_MODEL: str 
    DEFAULT_MSG: str 
    TOP_K_FEATURES: int 
    ABORT_WHEN_THRESH: int 
    GOODFIRE_TEMP: int
    GOODFIRE_TOP_P: int
    MAX_TOKENS: int
    CHAT_DURATION_SEC: int
    MAX_MESSAGES: int       
    MAX_GUESSES: int 
    PROD_FRONTEND_URL: str 
    DEV_FRONTEND_URL: str 
    PROD: bool 

    @property
    def FRONTEND_URL(self) -> str:
        return self.PROD_FRONTEND_URL if self.PROD else self.DEV_FRONTEND_URL

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
    )

@lru_cache
def _cached() -> Settings:
    return Settings()       

settings: Settings = _cached()
