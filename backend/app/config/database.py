"""Database configuration and session provider."""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://user:pass@localhost:5432/gduct")
ECHO_SQL = bool(int(os.getenv("ECHO_SQL", "0")))

engine = create_engine(DATABASE_URL, echo=ECHO_SQL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_session():
    """Yield a database session (to be used via context manager in services/tests)."""
    return SessionLocal()
