from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.customer import Customer
from app.models.order import Order
from app.models.product import Product


class DashboardService:

    @staticmethod
    def get_dashboard(db: Session) -> dict:

        total_products = (
            db.query(func.count(Product.id))
            .scalar()
        )

        total_customers = (
            db.query(func.count(Customer.id))
            .scalar()
        )

        total_orders = (
            db.query(func.count(Order.id))
            .scalar()
        )

        low_stock_products = (
            db.query(Product)
            .filter(
                Product.quantity <= settings.low_stock_threshold
            )
            .order_by(Product.quantity.asc())
            .all()
        )

        return {
            "total_products": total_products,
            "total_customers": total_customers,
            "total_orders": total_orders,
            "low_stock_products": low_stock_products,
        }