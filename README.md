# SignalTrack

A real-time fleet monitoring and alert dashboard for logistics and cargo transportation companies.

## Features

- **Live Map** — Interactive dark-theme map showing all vehicle positions with real-time movement, direction arrows, and status-colored markers
- **Fleet Panel** — Searchable, filterable vehicle list with live telemetry (speed, fuel, engine temperature) and detailed vehicle view
- **Alerts Dashboard** — Real-time safety event feed (speeding, low fuel, engine faults, harsh braking, route deviation, geofence breach, driver fatigue) with per-alert and bulk acknowledgement
- **KPI Cards** — Fleet-wide statistics: total vehicles, active/idle/maintenance/offline counts, average speed, critical alert count, and distance driven today
- **Live Header** — Real-time clock, animated LIVE indicator, and quick-glance fleet metrics

## Tech Stack

- **React 19 + TypeScript** — UI framework
- **Vite** — Build tool
- **Leaflet / react-leaflet** — Interactive map
- **Tailwind CSS v4** — Styling
- **lucide-react** — Icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Screenshot

![SignalTrack Dashboard](https://github.com/user-attachments/assets/70f0d75c-dd82-47e5-a669-76ab0143a89a)
