import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from init_db import init_db_and_seed

@pytest.fixture(scope="session", autouse=True)
async def ensure_db_seeded():
    """Ensures database tables exist and baseline seed data is populated for tests."""
    await init_db_and_seed()
