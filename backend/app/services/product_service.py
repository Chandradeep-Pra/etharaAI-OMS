from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.core.exceptions import ConflictException, NotFoundException
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:

    @staticmethod
    def create_product(
        db: Session,
        payload: ProductCreate,
    ) -> Product:

        existing = (
            db.query(Product)
            .filter(Product.sku == payload.sku)
            .first()
        )

        if existing:
            raise ConflictException(
                detail="Product with this SKU already exists."
            )

        product = Product(
            name=payload.name,
            sku=payload.sku,
            price=payload.price,
            quantity=payload.quantity,
        )

        db.add(product)
        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise ConflictException(
                detail="Product could not be created because it violates a database constraint."
            ) from exc
        db.refresh(product)

        return product

    @staticmethod
    def get_products(db: Session):
        return db.query(Product).order_by(Product.id.desc()).all()

    @staticmethod
    def get_product(
        db: Session,
        product_id: int,
    ) -> Product:
        product = (
            db.query(Product)
            .filter(Product.id == product_id)
            .first()
        )

        if not product:
            raise NotFoundException(
                detail=f"Product {product_id} not found."
            )

        return product

    @staticmethod
    def update_product(
        db: Session,
        product_id: int,
        payload: ProductUpdate,
    ) -> Product:
        product = ProductService.get_product(db, product_id)
        update_data = payload.model_dump(exclude_unset=True)

        if "sku" in update_data:
            existing = (
                db.query(Product)
                .filter(Product.sku == update_data["sku"], Product.id != product_id)
                .first()
            )

            if existing:
                raise ConflictException(
                    detail="Product with this SKU already exists."
                )

        for field, value in update_data.items():
            setattr(product, field, value)

        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise ConflictException(
                detail="Product could not be updated because it violates a database constraint."
            ) from exc

        db.refresh(product)
        return product

    @staticmethod
    def delete_product(
        db: Session,
        product_id: int,
    ) -> None:
        product = ProductService.get_product(db, product_id)
        db.delete(product)

        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise ConflictException(
                detail="Product cannot be deleted because it is referenced by an order."
            ) from exc
