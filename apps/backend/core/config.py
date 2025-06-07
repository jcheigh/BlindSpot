from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[1] / ".env"  
class Settings(BaseSettings):
    GOODFIRE_API_KEY: str 
    CALL_BUDGET: int
    GOODFIRE_MODEL: str 

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
    )

@lru_cache
def _cached() -> Settings:
    return Settings()       

settings: Settings = _cached()
