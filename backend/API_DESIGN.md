# API Design

## Conventions

- Base URL: `http://localhost:8000`
- Content type: `application/json`
- IDs are integer path parameters.
- List endpoints accept `limit` and `offset` query parameters.
- Validation errors use FastAPI's `422 Unprocessable Entity` response.
- Application errors use a consistent shape:

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "Product not found",
    "details": {}
  }
}
```

## Products

### `POST /products`

Request:

```json
{
  "name": "Wireless Mouse",
  "sku": "MOUSE-001",
  "price": "24.99",
  "quantity": 100
}
```

Response `201 Created`:

```json
{
  "id": 1,
  "name": "Wireless Mouse",
  "sku": "MOUSE-001",
  "price": "24.99",
  "quantity": 100
}
```

### `GET /products`

Response `200 OK`:

```json
[
  {
    "id": 1,
    "name": "Wireless Mouse",
    "sku": "MOUSE-001",
    "price": "24.99",
    "quantity": 100
  }
]
```

### `GET /products/{id}`

Response `200 OK`: product object.

### `PUT /products/{id}`

Request:

```json
{
  "name": "Wireless Mouse Pro",
  "sku": "MOUSE-001-PRO",
  "price": "29.99",
  "quantity": 75
}
```

Response `200 OK`: updated product object.

### `DELETE /products/{id}`

Response `204 No Content`.

## Customers

### `POST /customers`

Request:

```json
{
  "full_name": "Asha Rao",
  "email": "asha.rao@example.com",
  "phone": "+919876543210"
}
```

Response `201 Created`:

```json
{
  "id": 1,
  "full_name": "Asha Rao",
  "email": "asha.rao@example.com",
  "phone": "+919876543210"
}
```

### `GET /customers`

Response `200 OK`: array of customers.

### `GET /customers/{id}`

Response `200 OK`: customer object.

### `DELETE /customers/{id}`

Response `204 No Content`.

## Orders

### `POST /orders`

Request:

```json
{
  "customer_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

Response `201 Created`:

```json
{
  "id": 1,
  "customer_id": 1,
  "total_amount": "49.98",
  "created_at": "2026-06-01T11:30:00Z",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "quantity": 2,
      "unit_price": "24.99"
    }
  ]
}
```

### `GET /orders`

Response `200 OK`: array of orders with items.

### `GET /orders/{id}`

Response `200 OK`: order object with items.

### `DELETE /orders/{id}`

Response `204 No Content`.

Deleting an order removes the order and order items. It does not restock products because deletion is treated as administrative removal, not order cancellation.

## Dashboard

### `GET /dashboard`

Response `200 OK`:

```json
{
  "total_products": 12,
  "total_customers": 8,
  "total_orders": 20,
  "low_stock_products": [
    {
      "id": 3,
      "name": "USB Cable",
      "sku": "USB-001",
      "price": "9.99",
      "quantity": 4
    }
  ]
}
```

## Error Responses

### Not Found `404`

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "Product not found",
    "details": {
      "resource": "product",
      "id": 999
    }
  }
}
```

### Conflict `409`

```json
{
  "error": {
    "code": "resource_conflict",
    "message": "Product SKU already exists",
    "details": {
      "field": "sku"
    }
  }
}
```

### Insufficient Stock `409`

```json
{
  "error": {
    "code": "insufficient_stock",
    "message": "Insufficient stock for product 1",
    "details": {
      "product_id": 1,
      "requested_quantity": 5,
      "available_quantity": 2
    }
  }
}
```

### Validation Error `422`

```json
{
  "detail": [
    {
      "type": "greater_than_equal",
      "loc": ["body", "quantity"],
      "msg": "Input should be greater than or equal to 0",
      "input": -1
    }
  ]
}
```

## Status Codes

| Code | Usage |
| --- | --- |
| `200 OK` | Successful reads and updates |
| `201 Created` | Successful creation |
| `204 No Content` | Successful deletion |
| `400 Bad Request` | Malformed or invalid domain request |
| `404 Not Found` | Missing resource |
| `409 Conflict` | Uniqueness, relationship, or stock conflict |
| `422 Unprocessable Entity` | Request validation failure |
| `500 Internal Server Error` | Unexpected server error |

## Validation Rules

- Product `name` is required and cannot be blank.
- Product `sku` is required and cannot be blank.
- Product `price` must be greater than or equal to `0`.
- Product `quantity` must be greater than or equal to `0`.
- Customer `full_name` is required and cannot be blank.
- Customer `email` must be a valid email and unique.
- Customer `phone` is optional with a maximum length of `30`.
- Order `customer_id` must reference an existing customer.
- Order `items` must contain at least one line item.
- Order item `quantity` must be greater than `0`.
- Duplicate product IDs in one order request are rejected to keep stock validation explicit.

