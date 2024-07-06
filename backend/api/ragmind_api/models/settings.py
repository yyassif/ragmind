from typing import Optional

from sqlalchemy import Engine, create_engine
from langchain.embeddings.base import Embeddings
from langchain_community.embeddings.ollama import OllamaEmbeddings
from langchain_community.vectorstores.supabase import SupabaseVectorStore
from langchain_openai import OpenAIEmbeddings
from supabase.client import Client, create_client
from pydantic_settings import BaseSettings, SettingsConfigDict
from ragmind_api.logger import get_logger
from ragmind_api.models.databases.supabase.supabase import SupabaseDB

logger = get_logger(__name__)


class BrainRateLimiting(BaseSettings):
    model_config = SettingsConfigDict(validate_default=False)
    max_brain_per_user: int = 5


class BrainSettings(BaseSettings):
    model_config = SettingsConfigDict(validate_default=False)
    openai_api_key: str = ""
    supabase_url: str = ""
    supabase_service_key: str = ""
    resend_api_key: str = "null"
    resend_email_address: str = "brain@emails.yyassif.dev"
    ollama_api_base_url: str | None = None
    langfuse_public_key: str | None = None
    langfuse_secret_key: str | None = None
    pg_database_url: str
    pg_database_async_url: str


class ResendSettings(BaseSettings):
    model_config = SettingsConfigDict(validate_default=False)
    resend_api_key: str = "null"


# Global variables to store the Supabase client and database instances
_supabase_client: Optional[Client] = None
_supabase_db: Optional[SupabaseDB] = None
_db_engine: Optional[Engine] = None
_embedding_service = None

settings = BrainSettings()


def get_pg_database_engine():
    global _db_engine
    if _db_engine is None:
        logger.info("Creating Postgres DB engine")
        _db_engine = create_engine(settings.pg_database_url, pool_pre_ping=True)
    return _db_engine


def get_pg_database_async_engine():
    global _db_engine
    if _db_engine is None:
        logger.info("Creating Postgres DB engine")
        _db_engine = create_engine(settings.pg_database_async_url, pool_pre_ping=True)
    return _db_engine


def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is None:
        logger.info("Creating Supabase client")
        _supabase_client = create_client(
            settings.supabase_url, settings.supabase_service_key
        )
    return _supabase_client


def get_supabase_db() -> SupabaseDB:
    global _supabase_db
    if _supabase_db is None:
        logger.info("Creating Supabase DB")
        _supabase_db = SupabaseDB(get_supabase_client())
    return _supabase_db


def get_embedding_client() -> Embeddings:
    global _embedding_service
    if settings.ollama_api_base_url:
        embeddings = OllamaEmbeddings(
            base_url=settings.ollama_api_base_url,
        )  # pyright: ignore reportPrivateUsage=none
    else:
        embeddings = OpenAIEmbeddings()  # pyright: ignore reportPrivateUsage=none
    return embeddings


def get_documents_vector_store() -> SupabaseVectorStore:
    embeddings = get_embedding_client()
    supabase_client: Client = get_supabase_client()
    documents_vector_store = SupabaseVectorStore(
        supabase_client, embeddings, table_name="vectors"
    )
    return documents_vector_store
