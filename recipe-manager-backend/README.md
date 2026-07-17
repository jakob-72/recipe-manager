# Recipe Manager Backend

Kotlin/Spring Boot REST API for managing recipes, secured with Keycloak-issued JWTs and backed by PostgreSQL.

## Features

- JWT-protected CRUD API for recipes under `/api/recipes`
- Per-user data isolation using JWT `sub` as `user_id`
- Recipe search by ingredient or name
- Flyway-managed PostgreSQL schema migrations
- Input validation with clear HTTP status mapping

## Tech Stack

- **Language:** Kotlin 1.9
- **Runtime:** Java 21
- **Framework:** Spring Boot 3.5 (Web, Validation, Security, OAuth2 Resource Server, Data JPA)
- **Database:** PostgreSQL 16
- **IAM:** Keycloak 24
- **Migration:** Flyway
- **Tests:** JUnit 5, Spring Test, Kotest, MockK

## Prerequisites

- Java 21
- Docker + Docker Compose

## Quick Start (Local Development)

1. Start infrastructure (PostgreSQL + Keycloak + Keycloak DB):

   ```bash
   make stack-up
   ```

2. Start the backend:

   ```bash
   make start
   ```

3. Backend/API is available at `http://localhost:8080`.

4. Use the REST API client at `dev/api.http` for predefined API calls, including token requests for the seeded Keycloak
   user (`testuser` / `test123`).

## Keycloak Realm Config (Included)

Realm import file: `docker/keycloak/recipe-manager-realm.json`

- **Realm:** `recipe-manager`
- **Seed user:** `testuser` / `test123`
- **Frontend client:** `recipe-manager-frontend` (public client, direct access grants enabled)
- **Allowed frontend origins:** `http://localhost:3000`, `http://localhost:5173`
- **Admin console (local dev):** `http://localhost:8081` with `admin` / `admin`

## API

All `/api/**` endpoints require a valid Bearer token.

| Method | Endpoint                         | Description               |
|--------|----------------------------------|---------------------------|
| GET    | `/api/recipes`                   | List current user recipes |
| GET    | `/api/recipes?ingredient={name}` | Filter by ingredient name |
| GET    | `/api/recipes?name={name}`       | Find by exact recipe name |
| GET    | `/api/recipes/{id}`              | Get recipe by UUID        |
| POST   | `/api/recipes`                   | Create recipe             |
| PUT    | `/api/recipes/{id}`              | Update recipe             |
| DELETE | `/api/recipes/{id}`              | Delete recipe             |

### Request Model (`POST` / `PUT`)

- `name`: required, non-blank, max 255
- `ingredients`: required, non-empty
    - `ingredientName`: required, non-blank
    - `quantity`: required, `> 0`
    - `unit`: required, non-blank
- `instructions`: required, non-blank, max 8000
- `difficulty`: required, integer `1..5`
- `tags`: optional `string[]`

## Project Layout

```text
src/main/kotlin/org/jakob72/recipemanager/
  config/         # security config
  controller/     # REST endpoints
  data/           # JPA repositories, DTOs, entities
  services/       # business logic
  exceptions/     # centralized exception handling
src/main/resources/
  db/migration/   # Flyway SQL migrations
docker/keycloak/
  recipe-manager-realm.json   # Keycloak realm/bootstrap config
dev/api.http      # ready-to-run local API requests
```