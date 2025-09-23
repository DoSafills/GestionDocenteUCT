"""High-level orchestration (compose repos/services)."""
from sqlalchemy.orm import Session
from ..infrastructure.repositories.docente_repo import DocenteRepository
from ..domain.schemas.docente import DocenteIn

def crear_docente(session: Session, data: DocenteIn):
    repo = DocenteRepository(session)
    obj = repo.add(repo.model(**data.dict()))
    session.flush()
    return obj
