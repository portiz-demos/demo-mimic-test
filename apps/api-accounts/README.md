# Accounts API Service

A production-ready Go API service for managing user accounts with CloudBees Feature Management integration.

## Features

- RESTful API for account management
- Feature flag system ready for CloudBees Feature Management integration
- Feature flag: `api.maskAmounts` - dynamically mask dollar amounts in responses
- Environment-based feature flags (with CloudBees integration guide included)
- Proper error handling and logging
- CORS support
- Graceful shutdown
- Health check endpoint
- JSON structured logging

## Project Structure

```
api-accounts/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── handlers/                # HTTP handlers
│   │   ├── health.go           # Health check handler
│   │   ├── user.go             # User endpoints
│   │   └── account.go          # Account endpoints
│   ├── services/                # Business logic
│   │   ├── user_service.go     # User business logic
│   │   └── account_service.go  # Account business logic
│   ├── repository/              # Data access layer
│   │   └── repository.go       # Repository implementation
│   ├── features/                # Feature flags
│   │   └── flags.go            # CloudBees FM/Rox integration
│   ├── models/                  # Data models
│   │   ├── user.go             # User model
│   │   └── account.go          # Account model
│   └── middleware/              # HTTP middleware
│       ├── logging.go          # Request logging
│       ├── cors.go             # CORS configuration
│       └── auth.go             # Authentication
├── go.mod                       # Go module definition
└── README.md                    # This file
```

## API Endpoints

### Health Check

**GET /healthz**

Returns the health status of the service.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-13T10:30:00Z",
  "service": "api-accounts"
}
```

### Get Current User

**GET /me**

Returns information about the current authenticated user.

**Headers:**
- `X-User-ID` (optional): User ID, defaults to `user-001` if not provided

**Response:**
```json
{
  "id": "user-001",
  "email": "demo@accountstack.com",
  "name": "Demo User",
  "firstName": "Demo",
  "lastName": "User",
  "createdAt": "2024-01-15T10:00:00Z",
  "lastLogin": "2024-12-13T08:30:00Z"
}
```

### List User Accounts

**GET /accounts**

Returns all accounts for the authenticated user.

**Headers:**
- `X-User-ID` (optional): User ID, defaults to `user-001` if not provided

**Response (when maskAmounts = false):**
```json
[
  {
    "id": "acc-001",
    "userId": "user-001",
    "accountNumber": "****1234",
    "accountType": "checking",
    "accountName": "Personal Checking",
    "balance": 5847.32,
    "currency": "USD",
    "status": "active",
    "openedDate": "2023-03-15T00:00:00Z",
    "lastActivity": "2024-12-12T15:30:00Z"
  }
]
```

**Response (when maskAmounts = true):**
```json
[
  {
    "id": "acc-001",
    "userId": "user-001",
    "accountNumber": "****1234",
    "accountType": "checking",
    "accountName": "Personal Checking",
    "balance": "***.**",
    "currency": "USD",
    "status": "active",
    "openedDate": "2023-03-15T00:00:00Z",
    "lastActivity": "2024-12-12T15:30:00Z"
  }
]
```

### Get Account by ID

**GET /accounts/{id}**

Returns a specific account by ID. The account must belong to the authenticated user.

**Headers:**
- `X-User-ID` (optional): User ID, defaults to `user-001` if not provided

**Parameters:**
- `id` (path): Account ID

**Response:**
```json
{
  "id": "acc-001",
  "userId": "user-001",
  "accountNumber": "****1234",
  "accountType": "checking",
  "accountName": "Personal Checking",
  "balance": 5847.32,
  "currency": "USD",
  "status": "active",
  "openedDate": "2023-03-15T00:00:00Z",
  "lastActivity": "2024-12-12T15:30:00Z"
}
```

**Error Responses:**

- `404 Not Found` - Account does not exist
- `403 Forbidden` - Account does not belong to the user

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8001` |
| `DATA_PATH` | Path to seed data directory | `../../data/seed` |
| `CLOUDBEES_FM_API_KEY` | CloudBees Feature Management API key (optional) | `dev-mode` |
| `LOG_LEVEL` | Logging level (debug, info, warn, error) | `info` |
| `FEATURE_MASK_AMOUNTS` | Enable amount masking (true/false) | `false` |

## Feature Flags

### api.maskAmounts

**Default:** `false`

When enabled, all dollar amounts in account responses are masked as `"***.**"` for privacy and security.

**Current Implementation:** This flag is controlled via the `FEATURE_MASK_AMOUNTS` environment variable.

**CloudBees Integration:** The codebase is ready for CloudBees Feature Management integration. See `internal/features/flags.go` for detailed integration instructions. Once integrated, flags can be toggled in real-time without redeploying the service.

## Getting Started

### Prerequisites

- Go 1.21 or higher
- Access to seed data files (included in repository)
- CloudBees Feature Management account (optional, for production feature flag management)

### Installation

1. Install dependencies:

```bash
go mod download
```

2. Set up environment variables:

```bash
export PORT=8001
export DATA_PATH=/Users/brown/git_orgs/CB-AccountStack/AccountStack/data/seed
export CLOUDBEES_FM_API_KEY=your-api-key-here
export LOG_LEVEL=info
```

3. Run the server:

```bash
go run cmd/server/main.go
```

Or build and run:

```bash
go build -o bin/accounts-api cmd/server/main.go
./bin/accounts-api
```

### Testing the API

#### Health Check
```bash
curl http://localhost:8001/healthz
```

#### Get Current User
```bash
curl http://localhost:8001/me
```

#### Get All Accounts
```bash
curl http://localhost:8001/accounts
```

#### Get Specific Account
```bash
curl http://localhost:8001/accounts/acc-001
```

#### Test with Different User
```bash
curl -H "X-User-ID: user-002" http://localhost:8001/accounts
```

## Development

### Build

```bash
go build -o bin/accounts-api cmd/server/main.go
```

### Run Tests

```bash
go test ./...
```

### Code Formatting

```bash
go fmt ./...
```

### Linting

```bash
golangci-lint run
```

## Production Considerations

1. **Authentication**: The current implementation uses a simple `X-User-ID` header for demo purposes. In production, implement proper JWT token validation or OAuth2.

2. **CORS**: The CORS middleware currently allows all origins (`*`). In production, specify exact allowed origins.

3. **Database**: Data is loaded from JSON files. In production, integrate with a proper database (PostgreSQL, MySQL, etc.).

4. **Monitoring**: Add metrics collection (Prometheus), distributed tracing (OpenTelemetry), and error tracking (Sentry).

5. **Rate Limiting**: Implement rate limiting to prevent abuse.

6. **TLS**: Enable HTTPS with proper certificates.

7. **Secrets Management**: Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) for sensitive configuration.

8. **Container Deployment**: Create a Dockerfile for containerized deployment.

## Architecture

### Layered Architecture

1. **Handlers Layer** (`internal/handlers/`): HTTP request/response handling
2. **Services Layer** (`internal/services/`): Business logic and feature flag application
3. **Repository Layer** (`internal/repository/`): Data access abstraction
4. **Models Layer** (`internal/models/`): Domain models and data structures

### Middleware

- **Logging**: Logs all HTTP requests with method, path, status, and duration
- **CORS**: Handles cross-origin resource sharing
- **Auth**: Extracts and validates user authentication

### Feature Management

CloudBees Feature Management (Rox SDK) is integrated for runtime feature toggling without deployments. Feature flags are fetched on startup and can be updated in real-time.

## License

Copyright 2024 CB-AccountStack

## Quick Start

The fastest way to get started:

```bash
# From the api-accounts directory
export DATA_PATH=../../data/seed
go run cmd/server/main.go
```

Then test the API:

```bash
# Health check
curl http://localhost:8001/healthz

# Get current user
curl http://localhost:8001/me

# Get accounts
curl http://localhost:8001/accounts

# Test with masked amounts
export FEATURE_MASK_AMOUNTS=true
go run cmd/server/main.go
# In another terminal:
curl http://localhost:8001/accounts
# You should see "***.**" instead of actual amounts
```

## Support

For issues or questions, please contact the development team.
