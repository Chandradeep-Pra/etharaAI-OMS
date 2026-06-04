# Inventory Frontend

React + Vite UI for the Inventory & Order Management APIs.

## API Integration

The UI calls these backend endpoints:

- `GET /dashboard`
- `GET /products`
- `POST /products`
- `DELETE /products/{id}`
- `GET /customers`
- `POST /customers`
- `DELETE /customers/{id}`
- `GET /orders`
- `POST /orders`
- `DELETE /orders/{id}`

By default the app uses:

```bash
http://localhost:8000
```

To point the UI to another backend, create `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint
npm run build
```

