# SignalTrack

Real-time fleet monitoring dashboard for logistics companies. Track vehicle locations, speed, fuel levels, and safety alerts — all live on an interactive map.

## Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | Angular 21, Angular Signals, Leaflet, Tailwind |
| Backend  | NestJS, Socket.IO, Prisma ORM                  |
| Database | MySQL 8                                        |
| Infra    | Docker Compose                                 |

## Features

- **Live Map** — Leaflet map with color-coded vehicle markers (green=moving, yellow=idle, red=alert, gray=offline)
- **Real-Time Updates** — WebSocket streaming via Socket.IO for instant telemetry updates
- **Alert System** — Auto-detect speeding (>120 km/h) and low fuel (<15%) with toast notifications
- **REST API** — Full CRUD for vehicles and alerts with Swagger documentation
- **Signal-based State** — Angular Signals for reactive UI without external state libraries

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 22+ (for local development)

### Quick Start (Docker)

```bash
git clone https://github.com/your-username/signaltrack.git
cd signaltrack
docker compose up --build
```

This starts all three services:

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:4200 |
| Backend  | http://localhost:3000 |
| MySQL    | localhost:3306        |

### Seed the Database

```bash
cd signaltrack-backend
npx prisma db seed
```

### Local Development (without Docker)

```bash
# Backend
cd signaltrack-backend
npm install
npm run start:dev

# Frontend (separate terminal)
cd signaltrack-frontend
npm install
npx ng serve
```

## Project Structure

```
signaltrack/
├── docker-compose.yml
├── signaltrack-backend/          # NestJS API
│   ├── src/
│   │   ├── vehicles/             # Vehicle CRUD (controller, service, DTOs)
│   │   ├── alerts/               # Alert queries and persistence
│   │   ├── fleet/                # WebSocket gateway + telemetry processing
│   │   ├── prisma/               # Prisma service + schema
│   │   ├── config/               # App configuration + constants
│   │   └── common/               # Response interceptor, exception filter
│   └── prisma/
│       ├── seed.ts               # Database seeder
│       └── migrations/           # SQL migrations
│
├── signaltrack-frontend/         # Angular app
│   └── src/app/
│       ├── core/                 # Singleton services (Socket, Vehicle, Alert)
│       ├── features/
│       │   ├── map/              # Leaflet map + marker management
│       │   ├── vehicles/         # Vehicle list + cards
│       │   ├── alerts/           # Alert panel
│       │   └── dashboard/        # Dashboard (WIP)
│       ├── shared/               # Reusable components, pipes, directives
│       └── state/                # Signal-based stores + models
```

## API Endpoints

### Vehicles

| Method | Route         | Description       |
| ------ | ------------- | ----------------- |
| GET    | /vehicles     | List all vehicles |
| GET    | /vehicles/:id | Get vehicle by ID |
| POST   | /vehicles     | Create vehicle    |
| PATCH  | /vehicles/:id | Update vehicle    |
| DELETE | /vehicles/:id | Delete vehicle    |

### Alerts

| Method | Route              | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | /alerts            | List all alerts          |
| GET    | /alerts/:vehicleId | Get alerts for a vehicle |

### WebSocket Events

| Event         | Direction       | Description                            |
| ------------- | --------------- | -------------------------------------- |
| telemetry     | Client → Server | Send vehicle telemetry data            |
| requestFleet  | Client → Server | Request full vehicle list              |
| vehicleUpdate | Server → Client | Broadcast after telemetry processing   |
| alert         | Server → Client | Broadcast when alert thresholds exceed |
| fleetData     | Server → Client | Response to requestFleet               |

## Alert Thresholds

| Type  | Threshold | Trigger                |
| ----- | --------- | ---------------------- |
| Speed | 120 km/h  | Vehicle exceeds limit  |
| Fuel  | 15%       | Fuel drops below level |

## Environment Variables

| Variable              | Default               | Description           |
| --------------------- | --------------------- | --------------------- |
| PORT                  | 3000                  | Backend port          |
| DATABASE_URL          | (set in docker)       | MySQL connection      |
| CORS_ORIGIN           | \*                    | Allowed CORS origin   |
| FRONTEND_URL          | http://localhost:4200 | WebSocket CORS origin |
| ALERT_SPEED_THRESHOLD | 120                   | Speed alert km/h      |
| ALERT_FUEL_THRESHOLD  | 15                    | Fuel alert percentage |
