from sqlalchemy import Column, String, Date, DateTime, text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'usertable'

    username = Column(String(255), nullable=False, primary_key=True)
    password = Column(String(255), nullable=False)
    birthday = Column(Date, nullable=True)
    create_time = Column(DateTime, nullable=False, server_default=text('now()'))
    last_login = Column(DateTime, nullable=True)
