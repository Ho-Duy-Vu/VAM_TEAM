"""
Database configuration and connection
SQLite database for document storage
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# SQLite database URL
DATABASE_URL = "sqlite:///./ade.db"

# Create SQLite engine
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}  # Needed for SQLite
)

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create declarative base
Base = declarative_base()

def get_db():
    """
    Get database session - use as context manager or manually close
    """
    db = SessionLocal()
    return db

async def init_db():
    """
    Initialize database tables
    """
    # Import models to register them
    from app.models import Document, Page, Job
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully")