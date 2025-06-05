from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes_chat import router as chat_router

app = FastAPI(title="Ablation Blackout API", version="0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tweak for prod
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
