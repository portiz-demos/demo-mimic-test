# Transactions API Service

A production-ready Go API service for managing financial transactions with CloudBees Feature Management integration.

## Features

- RESTful API for transaction management
- CloudBees Feature Management integration for dynamic feature control
- Advanced filtering capabilities (feature flag controlled)
- CORS support for cross-origin requests
- Request logging and authentication middleware
- Docker support for containerized deployment
- Graceful shutdown handling
- Health check endpoint

## API Endpoints

### Health Check
```
GET /healthz
```
Returns the health status of the service.

**Response:**
```json
{
  "status": "healthy",
  "service": "api-transactions"
}
```

### List Transactions
```
GET /transactions
```
Retrieves a list of transactions with optional filtering.

**Query Parameters:**
- `accountId` (string) - Filter by account ID (always available)
- `startDate` (string, ISO 8601) - Filter by start date (requires `api.advancedFilters` flag)
- `endDate` (string, ISO 8601) - Filter by end date (requires `api.advancedFilters` flag)
- `category` (string) - Filter by category (requires `api.advancedFilters` flag)
- `minAmount` (number) - Filter by minimum amount (requires `api.advancedFilters` flag)
- `maxAmount` (number) - Filter by maximum amount (requires `api.advancedFilters` flag)

**Date Format:**
- ISO 8601: `2024-12-13T07:20:00Z` or `2024-12-13`

**Example Requests:**
```bash
# Basic filtering (always available)
curl "http://localhost:8002/transactions?accountId=acc-001"

# Advanced filtering (requires feature flag)
curl "http://localhost:8002/transactions?accountId=acc-001&startDate=2024-12-01&endDate=2024-12-13"
curl "http://localhost:8002/transactions?category=food_dining&minAmount=-100&maxAmount=-5"
curl "http://localhost:8002/transactions?accountId=acc-001&category=shopping&minAmount=-1000"
```

**Response:**
```json
[
  {
    "id": "txn-001",
    "accountId": "acc-001",
    "date": "2024-12-13T07:20:00Z",
    "description": "Starbucks Coffee",
    "amount": -5.47,
    "category": "food_dining",
    "merchant": "Starbucks",
    "status": "completed",
    "type": "debit"
  }
]
```

### Get Transaction by ID
```
GET /transactions/{id}
```
Retrieves a specific transaction by ID.

**Example:**
```bash
curl "http://localhost:8002/transactions/txn-001"
```

**Response:**
```json
{
  "id": "txn-001",
  "accountId": "acc-001",
  "date": "2024-12-13T07:20:00Z",
  "description": "Starbucks Coffee",
  "amount": -5.47,
  "category": "food_dining",
  "merchant": "Starbucks",
  "status": "completed",
  "type": "debit"
}
```

## Feature Flags

### `api.advancedFilters` (default: false)
Controls whether advanced filtering capabilities are available.

**When disabled (false):**
- Only `accountId` filter is applied
- Date range, category, and amount range filters are ignored
- Users are notified that advanced filters are unavailable

**When enabled (true):**
- All filters are available: `startDate`, `endDate`, `category`, `minAmount`, `maxAmount`
- Complex queries can be performed

**Configuration:**
Set up this feature flag in CloudBees Feature Management dashboard with the key `api.advancedFilters`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8002` |
| `CLOUDBEES_FM_API_KEY` | CloudBees Feature Management API key | (required) |
| `DATA_PATH` | Path to seed data directory | `/data/seed` |
| `LOG_LEVEL` | Logging level (debug, info, warn, error) | `info` |

## Getting Started

### Prerequisites
- Go 1.21 or higher
- Docker (optional, for containerized deployment)
- CloudBees Feature Management account

### Installation

1. Clone the repository:
```bash
cd /Users/brown/git_orgs/CB-AccountStack/AccountStack/apps/api-transactions
```

2. Install dependencies:
```bash
make deps
```

3. Set up environment variables:
```bash
export CLOUDBEES_FM_API_KEY="your-api-key-here"
export DATA_PATH="../../data/seed"
export LOG_LEVEL="info"
```

### Running Locally

#### Development Mode
```bash
make run-dev
```

#### Production Mode
```bash
make build
make run
```

#### With Custom Configuration
```bash
export PORT=8002
export LOG_LEVEL=debug
export DATA_PATH=/path/to/data
go run cmd/server/main.go
```

### Running with Docker

#### Build Docker Image
```bash
make docker-build
```

#### Run Docker Container
```bash
make docker-run
```

Or manually:
```bash
docker build -t accountstack/api-transactions:latest .

docker run -p 8002:8002 \
  -e CLOUDBEES_FM_API_KEY="your-api-key" \
  -e DATA_PATH=/data/seed \
  -v $(pwd)/../../data/seed:/data/seed \
  accountstack/api-transactions:latest
```

## Project Structure

```
api-transactions/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── features/
│   │   └── flags.go             # Feature flag management
│   ├── handlers/
│   │   ├── health.go            # Health check handler
│   │   └── transaction.go       # Transaction handlers
│   ├── middleware/
│   │   ├── auth.go              # Authentication middleware
│   │   ├── cors.go              # CORS middleware
│   │   └── logging.go           # Logging middleware
│   ├── models/
│   │   └── transaction.go       # Transaction data models
│   ├── repository/
│   │   └── repository.go        # Data access layer
│   └── services/
│       └── transaction_service.go # Business logic
├── Dockerfile                    # Docker configuration
├── Makefile                      # Build automation
├── go.mod                        # Go module definition
├── go.sum                        # Go module checksums
└── README.md                     # This file
```

## Development

### Building
```bash
make build
```

### Running Tests
```bash
make test
```

### Code Formatting
```bash
make fmt
```

### Linting
```bash
make lint
```

### Cleaning Build Artifacts
```bash
make clean
```

## Authentication

The service uses a simple header-based authentication for demo purposes:

```bash
curl -H "X-User-ID: user-001" "http://localhost:8002/transactions?accountId=acc-001"
```

If no `X-User-ID` header is provided, it defaults to `user-001`.

**Note:** In production, this should be replaced with proper JWT token validation or session-based authentication.

## Transaction Categories

Available transaction categories:
- `food_dining` - Food and dining expenses
- `shopping` - General shopping
- `groceries` - Grocery shopping
- `transportation` - Transportation costs
- `utilities` - Utility bills
- `entertainment` - Entertainment expenses
- `healthcare` - Healthcare and medical
- `health_fitness` - Health and fitness
- `insurance` - Insurance payments
- `home_improvement` - Home improvement
- `business` - Business expenses
- `income` - Income and deposits
- `transfer` - Account transfers
- `payment` - Payments

## Transaction Types

- `debit` - Money going out (negative amounts)
- `credit` - Money coming in (positive amounts)

## Transaction Status

- `completed` - Transaction has been processed
- `pending` - Transaction is still processing

## Logging

The service uses structured JSON logging with the following levels:
- `debug` - Detailed debug information
- `info` - General informational messages
- `warn` - Warning messages
- `error` - Error messages

Each request is logged with:
- HTTP method
- Path
- Status code
- Duration
- Remote address
- User agent

Example log entry:
```json
{
  "level": "info",
  "method": "GET",
  "path": "/transactions",
  "status": 200,
  "duration": "2.345ms",
  "remote": "127.0.0.1",
  "msg": "HTTP request"
}
```

## Health Checks

The `/healthz` endpoint can be used for:
- Kubernetes liveness/readiness probes
- Load balancer health checks
- Monitoring systems

The Docker image includes a built-in health check that runs every 30 seconds.

## CloudBees Feature Management Integration

This service integrates with CloudBees Feature Management using the Rox SDK.

### Setup

1. Create a CloudBees Feature Management account
2. Create a new application in the dashboard
3. Copy your API key
4. Set the `CLOUDBEES_FM_API_KEY` environment variable

### Feature Flag Configuration

In the CloudBees dashboard:
1. Navigate to your application
2. Create a new flag named `api.advancedFilters`
3. Set the default value to `false`
4. Configure targeting rules as needed
5. Deploy the configuration

### Testing Feature Flags

With flag disabled (default):
```bash
# Only accountId filter works
curl "http://localhost:8002/transactions?accountId=acc-001&category=shopping"
# Category filter will be ignored
```

Enable the flag in CloudBees dashboard, then:
```bash
# All filters now work
curl "http://localhost:8002/transactions?accountId=acc-001&category=shopping"
# Both accountId and category filters are applied
```

## Error Handling

The API returns standard HTTP status codes:
- `200 OK` - Successful request
- `400 Bad Request` - Invalid parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses include a message:
```json
{
  "error": "Invalid startDate format. Use ISO 8601 (YYYY-MM-DD or RFC3339)"
}
```

## CORS Configuration

The service is configured to accept requests from any origin with:
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Accept, Authorization, Content-Type, X-CSRF-Token, X-User-ID
- Credentials: Enabled

**Note:** In production, configure `AllowedOrigins` to specific domains.

## Performance Considerations

- Transactions are loaded into memory from JSON files on startup
- Read operations are protected with RWMutex for thread safety
- Results are sorted by date (most recent first)
- No database required for this demo service

## License

Copyright (c) 2024 CB-AccountStack

## Support

For issues and questions, please contact the development team.
