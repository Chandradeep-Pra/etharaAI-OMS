# Project Scope

## Project Overview

The Inventory & Order Management System is a REST backend for managing products, customers, orders, and order items. It exposes FastAPI endpoints backed by PostgreSQL through SQLAlchemy ORM, validates input with Pydantic, and runs locally or in containers with Docker Compose.

The system is intentionally small, but it is designed with production conventions: thin routers, service-layer business logic, transactional order creation, database constraints, structured errors, logging, and testable dependency injection.

## Goals

- Provide CRUD APIs for products, customers, and orders.
- Enforce inventory and uniqueness rules at both validation and database levels.
- Create orders transactionally and reduce stock automatically.
- Calculate order totals on the backend from current product prices.
- Provide dashboard totals and low-stock visibility.
- Document architecture, database design, API behavior, and operational setup.
- Package the application with Docker and Docker Compose for repeatable execution.

## Functional Requirements

- Products can be created, listed, retrieved, updated, and deleted.
- Customers can be created, listed, retrieved, and deleted.
- Orders can be created, listed, retrieved, and deleted.
- Order creation accepts a customer and one or more product line items.
- Order items store quantity and unit price at the time of order.
- Product SKU values must be unique.
- Customer email values must be unique.
- Product quantity cannot be negative.
- Orders cannot be created when requested quantity exceeds current stock.
- Successful order creation reduces product stock.
- Order total amount is calculated by the backend.
- Dashboard returns total product count, total customer count, total order count, and low-stock products.

## Non-Functional Requirements

- Use FastAPI, SQLAlchemy ORM, Pydantic, PostgreSQL, Docker, and Docker Compose.
- Keep routers thin and move business logic into services.
- Use dependency injection for database sessions.
- Use transactions for multi-row order creation.
- Return consistent error responses and appropriate HTTP status codes.
- Add indexes for lookup and relationship fields.
- Use type hints throughout the application.
- Keep the codebase modular and testable.
- Provide OpenAPI metadata through FastAPI route declarations and schema examples.
- Include tests for critical business rules.

## Assumptions

- Authentication and authorization are out of scope for the assessment.
- Monetary values are stored as fixed precision numeric values, not floating point.
- Product deletion is restricted when products are referenced by order items, preserving order history.
- Customer deletion is restricted when customers have orders, preserving order history.
- Order deletion deletes its order items but does not restore stock unless a future cancellation feature is added.
- Low-stock products are products with quantity less than or equal to a configurable threshold.
- Pagination is useful for production, so list endpoints support `limit` and `offset`.

## Constraints

- The database of record is PostgreSQL.
- The API is synchronous SQLAlchemy ORM for simplicity and assessment readability.
- Alembic is included for migrations; tests may use SQLite overrides for fast local execution.
- No background workers, event bus, or external cache are required for the base scope.
- The service must remain small enough for a technical assessment reviewer to understand quickly.

## API Overview

| Area | Method | Path | Purpose |
| --- | --- | --- | --- |
| Health | GET | `/health` | Service health check |
| Products | POST | `/products` | Create product |
| Products | GET | `/products` | List products |
| Products | GET | `/products/{id}` | Retrieve product |
| Products | PUT | `/products/{id}` | Update product |
| Products | DELETE | `/products/{id}` | Delete product |
| Customers | POST | `/customers` | Create customer |
| Customers | GET | `/customers` | List customers |
| Customers | GET | `/customers/{id}` | Retrieve customer |
| Customers | DELETE | `/customers/{id}` | Delete customer |
| Orders | POST | `/orders` | Create order |
| Orders | GET | `/orders` | List orders |
| Orders | GET | `/orders/{id}` | Retrieve order |
| Orders | DELETE | `/orders/{id}` | Delete order |
| Dashboard | GET | `/dashboard` | Aggregate inventory and order metrics |

