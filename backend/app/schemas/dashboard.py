from pydantic import BaseModel


class LowStockProduct(BaseModel):
    id: int
    name: str
    sku: str
    quantity: int


class DashboardResponse(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int

    low_stock_products: list[LowStockProduct]