from app.infrastructure.repositories.campus_repo import CampusRepository
from app.domain.models.campus import Campus

def test_campus_crud(session):
    repo = CampusRepository(session)
    c = Campus(codigo="CJP", nombre="Juan Pablo")
    repo.add(c); session.flush()
    assert repo.get("CJP").nombre == "Juan Pablo"
