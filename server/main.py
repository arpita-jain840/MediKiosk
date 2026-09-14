from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import ingest_routes
from routers.Accestodoc import router as acc_to_doc_router
from routers import clinical_routes
from routers import bhashini_routes
from routers import auth_routes
from routers import websocket_routes
from routers import notification_routes
from init_db import init_db_and_seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatically initialize tables and seed baseline accounts if empty
    await init_db_and_seed()
    yield

app = FastAPI(
    title="Healthcare AI Ingestion Core",
    lifespan=lifespan
)

import os

# Configure Allowed CORS Origins
default_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
]

env_origins = [
    orig.strip()
    for orig in os.getenv("CORS_ORIGINS", "").split(",")
    if orig.strip()
]
frontend_url = os.getenv("FRONTEND_URL", "").strip()
if frontend_url and frontend_url not in env_origins:
    env_origins.append(frontend_url)

allowed_origins = list(dict.fromkeys(default_origins + env_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    acc_to_doc_router,
    tags=["Access to Doctor"]
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
app.include_router(websocket_routes.router)
app.include_router(notification_routes.router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
