from app.core.database import Base, engine
from app.models import Customer, Order, OrderItem, Product


def create_database_schema() -> None:
    _ = (Customer, Order, OrderItem, Product)
    Base.metadata.create_all(bind=engine)
