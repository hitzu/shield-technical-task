## Shield Backend API: Users and Wallets

Express.js + TypeScript + PostgreSQL backend to manage users and their wallets.

### Tech stack

- Express.js
- TypeScript
- TypeORM (0.2.x)
- PostgreSQL
- JWT (stateless auth)
- Joi (validation)

### Prerequisites

- Node.js 22.14.0 (`nvm use` with `.nvmrc`)
- Docker + Docker Compose

### Ports and services

- API: `http://localhost:8080` (Swagger at `http://localhost:8080/api-docs`)
- PostgreSQL (development): host `localhost`, host port `5542` → container `5432`
- PostgreSQL (tests): host `localhost`, host port `5543` → container `5432`
- Redis (development): host `localhost`, host port `6381` → container `6379`
- Redis (tests): host `localhost`, host port `6380` → container `6379`

These mappings are defined in `docker-compose.override.yml` (dev) and `docker-compose.test.yml` (tests).

### Environment variables (development)

The project loads variables from `.env.development` (see `index.ts` using `custom-env`). Create this file with Docker-friendly defaults:

```bash
# Database (dev)
PG_HOST=localhost
PG_PORT=5542
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres

# Auth
TOKEN_SECRET=dev_secret
TOKEN_SECRET_KEY=dev_secret_key
JWT_EXPIRATION=1h

# Server
PORT=8080

# Redis
REDIS_URL=redis://localhost:6381
```

If you change credentials/port in Docker, mirror those changes here.

### Quick install

```bash
npm install
npm run install   # starts DB (Docker), runs migrations and seeds for development
```

Alternative (step by step):

```bash
npm run db:start            # start Postgres on 5542
npm run migration:run:dev   # apply migrations
npm run seed:run:dev        # load seed data
```

### Run the API (dev)

```bash
npm run dev           # start DB and then start the API
```

Visit Swagger at `http://localhost:8080/api-docs`.

### Logging and request tracing (x-request-id)

This service uses structured logging with Pino (`pino` + `pino-http`). Every HTTP request is logged as JSON and correlated with a `requestId`.

- `x-request-id`:

  - If the client sends an `x-request-id` header, the server reuses it.
  - Otherwise, the server generates a UUID and returns it in the response `x-request-id` header.
  - Use this value to trace a request end-to-end across services.

- Log levels:

  - Controlled by the `LOG_LEVEL` env var (`debug`, `info`, `warn`, `error`).
  - Defaults: `debug` in development, `info` in production.

- Example with curl:

```bash
curl -i \
  -H 'x-request-id: demo-req-123' \
  -H 'Content-Type: application/json' \
  -d '{"email":"wallet@test.com","password":"pass1"}' \
  http://localhost:8080/api/auth/signin
```

- Example log line (truncated):

```json
{
  "level": 30,
  "time": 1700000000000,
  "req": { "id": "demo-req-123", "method": "POST", "url": "/api/auth/signin" },
  "res": { "statusCode": 200 },
  "responseTime": 15,
  "msg": "request completed"
}
```

- Errors:
  - When an error occurs, it is logged as `logger.error({ err, requestId }, 'request failed')`.
  - Responses always include the `x-request-id` header so you can correlate them with logs.

### Database (tests)

Run end-to-end tests (automatically brings test DB up and down):

```bash
npm run test:ci
```

To stop local DB containers:

```bash
npm run db:stop
```

### Endpoints

#### Auth

- POST `/api/auth/signin`
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string }`
- POST `/api/auth/signout`
  - Headers: `Authorization: <JWT>`
  - Response: `{ success: true }`

#### Wallets (requires JWT)

- GET `/api/wallets` → list wallets for current user
- POST `/api/wallets` → `{ tag?: string, chain: string, address: string }`
- GET `/api/wallets/{id}` → wallet details
- PUT `/api/wallets/{id}` → `{ tag?: string, chain: string, address: string }`
- DELETE `/api/wallets/{id}`

### Notes

- The server reads `PORT` (default `8080`).
- TypeORM uses `PG_HOST`, `PG_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (by default pointing to the Docker DB on `5542`).

### Rate limiting and JWT blacklist (Redis)

This API supports rate limiting and JWT blacklisting using Redis.

- Global rate limit (per IP):

  - Controlled by env vars: `RATE_LIMIT_POINTS` (requests allowed) and `RATE_LIMIT_DURATION` (window seconds).
  - Example: `RATE_LIMIT_POINTS=10`, `RATE_LIMIT_DURATION=60` → 10 requests per minute.

- Sign-in brute-force protection:

  - Per `ip+email`, with `SIGNIN_RATE_LIMIT_POINTS` and `SIGNIN_RATE_LIMIT_DURATION`.
  - Example: `SIGNIN_RATE_LIMIT_POINTS=5`, `SIGNIN_RATE_LIMIT_DURATION=900` → 5 attempts per 15 minutes.

- JWT blacklist on signout:

  - Access tokens carry a `jti`.
  - `POST /api/auth/signout` stores the `jti` in Redis with TTL until token expiration.
  - Auth middleware denies blacklisted tokens (returns 401).

- Redis configuration:
  - Dev: service `redis` exposed on host `6381` → set `REDIS_URL=redis://localhost:6381`.
  - Tests: service `redis_test` on host `6380` (tests auto-configured).
  - If Redis is unavailable, rate limiters operate fail-open (requests are not blocked) and errors are logged.

#### Quick testing with curl

- Global limit 429 example (set `RATE_LIMIT_POINTS=10`):

```bash
for i in {1..12}; do \
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/wallets; done
```

- Blacklist after signout:

```bash
TOKEN=$(curl -s -H 'Content-Type: application/json' \
  -d '{"email":"wallet@test.com","password":"pass1"}' \
  http://localhost:8080/api/auth/signin | jq -r .token)

curl -i -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/auth/signout

curl -i -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/wallets # expect 401
```

- Reset rate limit (per caller IP, optional email for signin limiter):

```bash
curl -i -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com"}' \
  http://localhost:8080/api/auth/ratelimit/reset
```

### Error responses

Standardized error payloads are returned across the API. Each response includes a `requestId` to correlate with logs.

- Conflict (example):

```json
{
  "message": "User already exists",
  "code": 409,
  "requestId": "14acacfc-a741-42be-a0a6-37cf851d3d94",
  "error": true
}
```

- Unprocessable Entity (validation details with Joi):

```json
{
  "message": "Unprocessable Entity",
  "code": 422,
  "requestId": "4fbb549b-9c00-4d2a-a942-fb91c1a9c8f9",
  "details": [
    {
      "message": "\"password\" length must be at least 4 characters long",
      "path": ["password"],
      "type": "string.min",
      "context": {
        "limit": 4,
        "value": "pas",
        "label": "password",
        "key": "password"
      }
    }
  ],
  "error": true
}
```
