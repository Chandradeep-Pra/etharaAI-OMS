from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.customers import router as customer_router
from app.api.dashboard import router as dashboard_router
from app.api.orders import router as order_router
from app.api.products import router as product_router
from app.core.config import settings
from app.core.schema import create_database_schema

app = FastAPI(
    title="Inventory & Order Management API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins() or ["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(dashboard_router)


@app.get("/")
def health():
    return {"status": "running"}


@app.on_event("startup")
def startup() -> None:
    create_database_schema()
