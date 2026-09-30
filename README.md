# AccountStack

A forkable, mono-repo reference application demonstrating modern CI/CD, feature management, governance, and SmartTests in regulated enterprise environments.

## Overview

AccountStack is a realistic **account overview portal** similar to those used by banks, insurers, utilities, and large enterprises — designed for enablement, workshops, and executive demonstrations.

**Key Features**:
- Multi-component architecture (UI + multiple APIs)
- Local-first development (works offline)
- Built-in feature management (local + CloudBees FM integration)
- Comprehensive test coverage for SmartTests demonstrations
- Fork-friendly and customizable
- CloudBees Unify CI/CD workflows

## Quick Start

### Local Development with Docker Compose

1. **Set up environment** (optional - for CloudBees FM integration):

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your CloudBees FM API key
# CLOUDBEES_FM_API_KEY=your-actual-fm-key-here
```

2. **Start all services**:

```bash
docker compose up --build
```

This starts:
- React UI (port 3000)
- Accounts API (port 8001)
- Transactions API (port 8002)
- Insights API (port 8003)

3. **Access the application**: http://localhost:3000

**Note**: The `.env` file is gitignored for security. Without an FM key, the app works perfectly with hardcoded default flag values.

## Components

- **apps/web** - React UI
- **apps/api-accounts** - Accounts service
- **apps/api-transactions** - Transactions service
- **apps/api-insights** - Insights and analytics service
- **config/** - Feature flag reference documentation

## Feature Management

AccountStack uses **CloudBees Feature Management** for all feature flags with **fully reactive, real-time updates**.

### Key Features

- **🔄 Reactive Updates** - Flag changes appear instantly in the UI without page refresh or polling
- **⚡ Zero-Latency** - CloudBees FM SDK pushes changes immediately via WebSocket
- **🎯 Demo-Perfect** - Toggle flags in FM dashboard and watch UI update in real-time
- **💪 Resilient** - Falls back to hardcoded defaults when offline/disconnected
- **🔒 Secure** - API keys never exposed in browser console or logs

### How It Works

**Frontend (React)**:
- Uses `useRoxFlag()` hook for reactive flag subscriptions
- Components re-render automatically when flags change
- Snapshot + listener pattern ensures instant updates

**Backend (Go)**:
- CloudBees FM SDK integrated in all APIs
- Flag changes affect request handling in real-time
- No restart required

**Live Demo Flow**:
1. Open AccountStack in browser
2. Open CloudBees FM dashboard
3. Toggle `ui.transactionsFilters` flag
4. Watch filters appear/disappear instantly in UI 🎉

### Setup

**Local Development**:
```bash
# Optional: Connect to CloudBees FM
cp .env.example .env
# Add your CLOUDBEES_FM_API_KEY to .env
docker compose up --build
```

**Production (Kubernetes)**:
- FM key injected at deployment via Helm
- Mounted as runtime config in `/config/fm.json`
- No rebuild needed to change keys

See [Feature Flags Reference](config/README.md) for complete flag list and code examples.

## Testing

Run all tests locally:

```bash
make test
```

Or run specific test suites:

```bash
make test-unit          # ~200-300 unit tests
make test-integration   # ~80-100 integration tests
make test-e2e          # ~30-40 end-to-end tests
```

High test volume demonstrates CloudBees SmartTests impact analysis and test subsetting.

## Documentation

- [Architecture Details](docs/ARCHITECTURE.md) - Component design, tech stack, and customization guide
- [Setup Guide](docs/SETUP.md) - Detailed local and CloudBees configuration (coming soon)
- [Changelog](CHANGELOG.md) - Version history and migration guides

## Customization

AccountStack is designed to be forked and customized:

1. Fork to your organization
2. Update `config/features.yaml` with your branding
3. Application name, colors, and logos are feature-flag controlled
4. Repo and org names are auto-detected from git remote

See [Architecture Documentation](docs/ARCHITECTURE.md) for details.

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Go (APIs)
- **Infrastructure**: Docker, Docker Compose, Kubernetes
- **CI/CD**: CloudBees Unify
- **Feature Management**: CloudBees Feature Management (optional)
- **Testing**: Jest, Playwright, Go testing

## Positioning

**AccountStack** is for:
- Enablement and training
- Customer workshops
- Executive demonstrations
- Fast iteration and prototyping

For deep, multi-service platform demonstrations, see **SquidStack**.

## Non-Goals

- No payments or PCI complexity
- No trading functionality
- No microservice sprawl
- Simple, focused domain model

## License

MIT

## Support

For issues or questions, please open a GitHub issue or contact the CloudBees SE team.
