from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import ingest_routes
from routers import clinical_routes
from routers import bhashini_routes
from routers import auth_routes
from init_db import init_db_and_seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatically initialize tables and seed 10 patient dataset on startup
    await init_db_and_seed()
    yield

app = FastAPI(
    title="Healthcare AI Ingestion Core",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"message": "MediKiosk Server & Database Core is running"}

import os
from fastapi.staticfiles import StaticFiles

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_routes.router)
app.include_router(ingest_routes.router)
app.include_router(clinical_routes.router)
app.include_router(bhashini_routes.router)