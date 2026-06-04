from decimal import Decimal

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.exceptions import (
    NotFoundException,
    ConflictException,
)
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


class OrderService:

    @staticmethod
    def create_order(
        db: Session,
        payload: OrderCreate,
    ) -> Order:

        customer = (
            db.query(Customer)
            .filter(Customer.id == payload.customer_id)
            .first()
        )

        if not customer:
            raise NotFoundException(
                detail="Customer not found."
            )

        product_ids = [
            item.product_id
            for item in payload.items
        ]

        if len(product_ids) != len(set(product_ids)):
            raise ConflictException(
                detail="Duplicate products are not allowed in one order."
            )

        products = (
            db.query(Product)
            .filter(Product.id.in_(product_ids))
            .with_for_update()
            .all()
        )

        products_map = {
            product.id: product
            for product in products
        }

        if len(products_map) != len(set(product_ids)):
            raise NotFoundException(
                detail="One or more products not found."
            )

        total_amount = Decimal("0.00")

        for item in payload.items:

            product = products_map[item.product_id]

            if product.quantity < item.quantity:
                raise ConflictException(
                    detail=f"Insufficient stock for {product.name}"
                )

            total_amount += (
                product.price * item.quantity
            )

        order = Order(
            customer_id=payload.customer_id,
            total_amount=total_amount,
        )

        db.add(order)
        db.flush()

        for item in payload.items:

            product = products_map[item.product_id]

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                unit_price=product.price,
            )

            db.add(order_item)

            product.quantity -= item.quantity

        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise ConflictException(
                detail="Order could not be created because it violates a database constraint."
            ) from exc
        db.refresh(order)

        return order

    @staticmethod
    def get_orders(
        db: Session,
    ) -> list[Order]:

        return (
            db.query(Order)
            .order_by(Order.id.desc())
            .all()
        )

    @staticmethod
    def get_order(
        db: Session,
        order_id: int,
    ) -> Order:

        order = (
            db.query(Order)
            .filter(Order.id == order_id)
            .first()
        )

        if not order:
            raise NotFoundException(
                detail="Order not found."
            )

        return order

    @staticmethod
    def delete_order(
        db: Session,
        order_id: int,
    ) -> None:

        order = (
            db.query(Order)
            .filter(Order.id == order_id)
            .first()
        )

        if not order:
            raise NotFoundException(
                detail="Order not found."
            )

        for item in order.items:
            item.product.quantity += item.quantity

        db.delete(order)
        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise ConflictException(
                detail="Order could not be deleted because it violates a database constraint."
            ) from exc
