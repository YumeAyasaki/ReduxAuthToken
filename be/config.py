from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    rdbms: str = "postgresql"
    connector: str = "psycopg2"
    
    DB_USER: str
    DB_PASS: str
    DB_NAME: str
    DB_HOST: str
    DB_PORT: str

    # JWT
    secret: str

    model_config = SettingsConfigDict(env_file=".env")