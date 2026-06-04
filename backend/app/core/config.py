from functools import lru_cache
import json

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Inventory & Order Management API"
    environment: str = "local"
    database_url: str = Field(default="postgresql+psycopg2://postgres:postgres@db:5432/inventory")
    low_stock_threshold: int = Field(default=10, ge=0)
    cors_origins: str = ""

    def get_cors_origins(self) -> list[str]:
        if not self.cors_origins:
            return []

        value = self.cors_origins.strip()
        if value.startswith("["):
            return [str(origin).strip() for origin in json.loads(value)]

        return [origin.strip() for origin in value.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
