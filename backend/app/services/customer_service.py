from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate
from app.core.exceptions import (
    ConflictException,
    NotFoundException,
)


class CustomerService:

    @staticmethod
    def create_customer(
        db: Session,
        payload: CustomerCreate,
    ) -> Customer:

        existing_customer = (
            db.query(Customer)
            .filter(Customer.email == payload.email)
            .first()
        )

        if existing_customer:
            raise ConflictException(
                detail="Customer with this email already exists."
            )

        customer = Customer(
            full_name=payload.full_name,
            email=payload.email,
            phone=payload.phone,
        )

        db.add(customer)
        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise ConflictException(
                detail="Customer with this email already exists."
            ) from exc
        db.refresh(customer)

        return customer

    @staticmethod
    def get_customers(
        db: Session,
    ) -> list[Customer]:

        return (
            db.query(Customer)
            .order_by(Customer.id.desc())
            .all()
        )

    @staticmethod
    def get_customer(
        db: Session,
        customer_id: int,
    ) -> Customer:

        customer = (
            db.query(Customer)
            .filter(Customer.id == customer_id)
            .first()
        )

        if not customer:
            raise NotFoundException(
                detail=f"Customer {customer_id} not found."
            )

        return customer

    @staticmethod
    def delete_customer(
        db: Session,
        customer_id: int,
    ) -> None:

        customer = (
            db.query(Customer)
            .filter(Customer.id == customer_id)
            .first()
        )

        if not customer:
            raise NotFoundException(
                detail=f"Customer {customer_id} not found."
            )

        db.delete(customer)
        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise ConflictException(
                detail="Customer cannot be deleted because they have orders."
            ) from exc
