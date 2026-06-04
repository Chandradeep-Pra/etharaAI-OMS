from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Inventory & Order Management API"
    environment: str = "local"
    database_url: str = Field(default="postgresql+psycopg2://postgres:postgres@db:5432/inventory")
    low_stock_threshold: int = Field(default=10, ge=0)
    cors_origins: list[str] = Field(default_factory=list)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
