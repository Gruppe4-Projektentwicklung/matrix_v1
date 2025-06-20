from sqlalchemy import create_engine, Column, String, DateTime, JSON, Integer, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from pathlib import Path
import datetime

DATABASE_FILE = Path(__file__).parent / "matrix.db"
engine = create_engine(f"sqlite:///{DATABASE_FILE}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class Calculation(Base):
    __tablename__ = "berechnungen"
    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    sprache = Column(String)
    datenfreigabe = Column(String)
    ideen_json = Column(JSON)
    gewichtung_json = Column(JSON)
    ranking_json = Column(JSON)
    nutzerdaten_json = Column(JSON)

class UsageLog(Base):
    __tablename__ = "nutzungslog"
    id = Column(Integer, primary_key=True, index=True)
    session = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    step = Column(String)
    data_json = Column(JSON)
    ip = Column(String)
    user_agent = Column(Text)

def init_db():
    Base.metadata.create_all(bind=engine)
