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
