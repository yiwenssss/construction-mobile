# Site Safety

Site Safety is a mobile-first field workspace for construction supervisors and foremen. It helps a supervisor understand the day's safety picture, report an incident quickly, check crew attendance, and complete essential readiness checks while working away from a desk.

The interface is designed for short, interrupted sessions on an active site: large touch targets, high-contrast glare mode, tap-based choices, and clear connection and sync states.

## Features

- **Quick incident capture**: Start a report from the main dashboard or bottom navigation, choose an incident type and severity, add a note, and save it locally.
- **Daily overview**: See crew check-in, checklist progress, incidents logged, and incident severity at a glance.
- **Incident history**: Review all incidents with severity, time, description, reporter, and sync status.
- **Crew check-in**: See who is on site and who is still expected.
- **Safety checklist**: Toggle shift-readiness checks directly from the Today view.
- **Glare mode**: Switch to a higher-contrast display for bright outdoor conditions.
- **Offline-first messaging**: The report flow communicates that a saved report is stored locally and will sync when connectivity returns.

## Tech stack

- Vue 3 with `<script setup>` and TypeScript
- Vite
- Vuetify 4
- Material Design Icons
- Vue Router dependency is available for future route-based navigation
- Chart.js and Vue Chart.js dependencies are available for future data visualizations

## Getting started

### Requirements

- Node.js 18 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Vite will print the local development URL in the terminal, normally `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview
```

The build command runs TypeScript validation through `vue-tsc` before creating the Vite production bundle.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run build` | Type-check and build the production bundle |
| `npm run preview` | Preview the production build locally |

## Project structure

```text
src/
├── App.vue              # Main application shell and field workflows
├── main.ts              # Vue and Vuetify bootstrapping
├── style.css            # Responsive layout, theme, and glare-mode styles
└── data/
	└── data.json        # Demo incidents, crew, and safety checklist data
```

## Data and prototype behavior

The app currently uses the static dataset in [`src/data/data.json`](src/data/data.json). It is intentionally a front-end prototype and does not connect to a backend or persist data between browser sessions.

Incident types are:

- Hazard
- Near Miss
- Injury
- Property Damage
- Equipment Failure

Incident severity levels are:

- Low
- Medium
- High
- Critical

The incident form currently simulates camera capture with a photo placeholder. Saving an incident displays the local-save and future-sync state, but it does not yet add the new incident to `data.json` or perform real synchronization.

## Design principles

- Prioritize reporting an issue in under a minute.
- Keep the primary action reachable from the thumb zone.
- Prefer taps, toggles, and short notes over lengthy form entry.
- Preserve clarity in sunlight with strong contrast and readable type.
- Make connection state visible so a report never feels lost.

## Scope

This project is a responsive web app for a single supervisor role. Native mobile builds, authentication, a real backend, live data, camera integration testing, and production offline synchronization are outside the current prototype scope.
