# SignalTrack 🚛

Real-time fleet monitoring and alert dashboard for logistics companies. Built with Angular Signals and NestJS WebSockets.

## Overview

SignalTrack gives fleet managers live visibility into vehicle locations, telemetry data, and critical safety events — all in a single dashboard. When a truck speeds, runs low on fuel, or exceeds driving time limits, dispatchers are notified instantly.

## Features

- **Live Map** — Leaflet.js map with color-coded markers (🟢 OK / 🔴 Alert)
- **Real-Time Alerts** — Toast notifications triggered by speeding, low fuel, and fatigue events
- **Angular Signals** — Reactive vehicle state management using Angular's modern primitives
- **WebSocket Streaming** — NestJS Socket.io gateway broadcasts live telemetry every 3 seconds

## Tech Stack

| Layer         | Technology                               |
| ------------- | ---------------------------------------- |
| Frontend      | Angular 17+, Angular Signals, Leaflet.js |
| Notifications | Angular Toastr                           |
| Backend       | NestJS, Socket.io                        |
| Styling       | Tailwind CSS                             |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/signaltrack.git
cd signaltrack

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### Running the App

```bash
# Start the NestJS backend (port 3000)
cd backend && npm run start:dev

# Start the Angular frontend (port 4200)
cd frontend && npm run start
```

Open [http://localhost:4200](http://localhost:4200) to view the dashboard.

## Project Structure

```
signaltrack/
├── frontend/        # Angular app
│   ├── src/
│   │   ├── app/
│   │   │   ├── map/           # Leaflet map component
│   │   │   ├── alerts/        # Alert panel & toasts
│   │   │   └── store/         # Angular Signals state
├── backend/         # NestJS app
│   ├── src/
│   │   ├── fleet/             # WebSocket gateway
│   │   └── simulation/        # Truck movement engine
```

## How It Works

The NestJS backend runs a simulation engine that moves a fleet of trucks across a map, occasionally triggering critical events (speeding, low fuel). These are broadcast via WebSockets to all connected Angular clients. The frontend uses Angular Signals to reactively update the map markers and fire toast notifications — no manual change detection required.
