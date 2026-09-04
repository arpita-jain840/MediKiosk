from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ingest_routes

app = FastAPI(
    title="Healthcare AI Ingestion Core")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"message": "Server is running"}

app.include_router(ingest_routes.router)