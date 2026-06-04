# Execution Plan

## Milestone 1: Project Setup

Tasks:
- Normalize the requested backend folder structure.
- Add missing package `__init__.py` files.
- Add `.env.example`, `.dockerignore`, `README.md`, and base configuration.

Deliverables:
- Clean FastAPI project layout.
- Configurable application settings.

Dependencies:
- None.

Acceptance criteria:
- Application imports without missing modules.
- Environment variables are documented.

## Milestone 2: Database Configuration

Tasks:
- Configure SQLAlchemy engine and session factory.
- Add dependency-injected database sessions.
- Add Alembic configuration and initial migration.

Deliverables:
- `app/core/database.py`
- `app/dependencies/database.py`
- `alembic.ini`
- Initial Alembic migration.

Dependencies:
- Milestone 1.

Acceptance criteria:
- Database sessions are opened and closed per request.
- Alembic can apply schema to PostgreSQL.

## Milestone 3: Models

Tasks:
- Implement Product, Customer, Order, and OrderItem SQLAlchemy models.
- Add relationships, indexes, and constraints.
- Use `Numeric` for monetary values.

Deliverables:
- Model files under `app/models`.

Dependencies:
- Milestone 2.

Acceptance criteria:
- Models map to documented tables.
- Constraints enforce uniqueness and non-negative values.

## Milestone 4: Schemas

Tasks:
- Implement Pydantic request and response schemas.
- Add validation constraints and examples.
- Support nested order item responses.

Deliverables:
- Schema files under `app/schemas`.

Dependencies:
- Milestone 3.

Acceptance criteria:
- Invalid inputs are rejected with `422`.
- OpenAPI contains meaningful examples.

## Milestone 5: CRUD Endpoints

Tasks:
- Implement product and customer service methods.
- Implement product and customer routers.
- Add thin route handlers and status codes.

Deliverables:
- Product and customer APIs.

Dependencies:
- Milestones 2-4.

Acceptance criteria:
- CRUD endpoints return documented responses.
- Duplicate SKU and email produce `409`.
- Missing resources produce `404`.

## Milestone 6: Order Service

Tasks:
- Implement order creation service.
- Calculate totals in the backend.
- Persist order items with unit prices.

Deliverables:
- `app/services/order_service.py`
- Order router.

Dependencies:
- Milestones 3-5.

Acceptance criteria:
- Orders can be created and retrieved.
- Total amount equals sum of item quantity times unit price.

## Milestone 7: Inventory Validation

Tasks:
- Reject insufficient stock.
- Reduce stock automatically on successful order creation.
- Use a transaction and row-level locks.

Deliverables:
- Transactional inventory-safe order creation.

Dependencies:
- Milestone 6.

Acceptance criteria:
- Failed order creation does not reduce stock.
- Concurrent PostgreSQL requests cannot oversell locked product rows.

## Milestone 8: Dashboard Analytics

Tasks:
- Implement dashboard service counts.
- Return low-stock product details.
- Make threshold configurable.

Deliverables:
- Dashboard endpoint.

Dependencies:
- Milestones 3-5.

Acceptance criteria:
- `/dashboard` returns all required fields.
- Low-stock products use configured threshold.

## Milestone 9: Testing

Tasks:
- Add pytest test setup with database dependency override.
- Cover product, customer, order, inventory, and dashboard behavior.
- Cover conflict and not-found errors.

Deliverables:
- `tests/` suite.

Dependencies:
- Milestones 5-8.

Acceptance criteria:
- Tests pass locally.
- Critical business rules are verified.

## Milestone 10: Dockerization

Tasks:
- Add production-oriented Dockerfile.
- Add Docker Compose for API and PostgreSQL.
- Document commands to run migrations and service.

Deliverables:
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- README operational instructions.

Dependencies:
- Milestones 1-9.

Acceptance criteria:
- `docker compose up --build` starts API and database.
- Service exposes OpenAPI docs at `/docs`.

