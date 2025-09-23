"""Entry module placeholder. No HTTP endpoints; this module can be used for CLI tasks."""
from .config.database import engine, Base  # type: ignore[attr-defined]
from .domain import models  # noqa: F401

def init_db():
    Base.metadata.create_all(engine)

if __name__ == "__main__":
    init_db()
