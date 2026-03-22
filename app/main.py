from __future__ import annotations

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.routes import router


# Security-log-analysis mainline application entry.
app = FastAPI(title="MegaETH AI Security", version="0.1.0")
app.include_router(router)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
