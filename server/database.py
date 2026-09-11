import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

load_dotenv()

# Format for PostgreSQL: postgresql+asyncpg://user:password@host:port/dbname
# Format for SQLite fallback (instant local test if Postgres URL not supplied): sqlite+aiosqlite:///./medikiosk.db
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Local zero-setup SQLite fallback so backend can immediately boot and test without crashing
    DATABASE_URL = "sqlite+aiosqlite:///./medikiosk.db"
    print("[Database] No DATABASE_URL found in .env. Falling back to local 'sqlite+aiosqlite:///./medikiosk.db'")
else:
    # Ensure async driver is used if standard postgres:// was provided by cloud providers (Neon/Supabase)
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    # SSL/connection pool flags for cloud Postgres (Supabase / Neon)
    connect_args={"ssl": True} if "asyncpg" in DATABASE_URL and "localhost" not in DATABASE_URL and "127.0.0.1" not in DATABASE_URL else {}
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
