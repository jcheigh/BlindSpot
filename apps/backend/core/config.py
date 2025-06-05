from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings

print(Field(..., env="GOODFIRE_API_KEY"))
class Settings(BaseSettings):
    goodfire_key: str = Field(..., env="GOODFIRE_API_KEY")
    openai_key: str = Field(..., env="OPENAI_API_KEY")
    call_budget: int = 20
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Singleton Settings object."""
    return Settings()