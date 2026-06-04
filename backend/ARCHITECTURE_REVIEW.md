# Architecture Review

## Potential Risks

- Runtime schema creation can hide migration problems, so the implementation should use Alembic instead of `Base.metadata.create_all` in application startup.
- Order deletion semantics are not defined by the assessment. The selected behavior removes orders without restocking to avoid silently changing inventory history.
- Lack of authentication means all endpoints are public. This is acceptable for the assessment but not production-ready.
- List endpoints can grow large. Pagination is included, but filtering and sorting would be needed for larger catalogs.

## Security Concerns

- Authentication and authorization are missing by scope; production should add identity, roles, and tenant boundaries if needed.
- CORS defaults should be restrictive. The base service should not use wildcard origins in production.
- Database credentials must be supplied through environment variables and not committed.
- Error responses should avoid exposing stack traces or database internals.
- Input sizes should be bounded to reduce abuse risk.

## Data Integrity Concerns

- SKU and email uniqueness must be enforced by database constraints, not only service checks.
- Product quantity and price must use database check constraints.
- Order creation must be atomic; otherwise, stock could be reduced without order persistence or vice versa.
- Concurrent orders can oversell stock unless product rows are locked during validation and update.
- Monetary values should use `Numeric` and Decimal handling to avoid floating-point drift.
- Historical orders should store unit prices, because product prices can change later.

## Performance Bottlenecks

- Dashboard counts can become expensive at high volume; cached aggregates or read models may be needed later.
- Loading orders with items can create N+1 query patterns without eager loading.
- Unbounded list endpoints can create memory and latency issues; `limit` and `offset` controls are included.
- Low-stock queries benefit from an index on quantity if product volume becomes large.

## Missing Requirements

- Authentication, authorization, and audit trails are not specified.
- Update customer API is not required, so only create/list/get/delete is implemented.
- Order cancellation and stock restoration are not specified.
- Product image, category, supplier, and warehouse concepts are out of scope.
- Payment, shipment, and invoice workflows are out of scope.
- API versioning is not specified; the base implementation exposes unversioned assessment endpoints.

## Improvements

- Add API versioning such as `/api/v1` when the service needs long-term compatibility.
- Add idempotency keys for order creation.
- Add inventory movement ledger for auditable stock changes.
- Add soft deletes for products and customers.
- Add filtering and sorting on list endpoints.
- Add structured JSON logging and request correlation IDs.
- Add CI checks for formatting, linting, typing, tests, and migration validation.
- Add Prometheus metrics and health checks that verify database connectivity.

## Assessment Fit

The proposed design satisfies the required entities, fields, business rules, endpoints, and stack. It keeps business logic in services, validates inputs through Pydantic, enforces critical invariants in PostgreSQL, uses SQLAlchemy relationships, and keeps the API easy for reviewers to inspect.

