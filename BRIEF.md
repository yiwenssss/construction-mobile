# Site Safety Incident Reporting: BRIEF

## 1. What You're Building

A mobile-first responsive web app for a site supervisor or foreman walking an active construction or manufacturing site. This is a responsive web app, not a native app, React Native, Flutter, Kotlin, and Swift are out of scope.

Designing for mobile here isn't about shrinking a desktop layout. It's a different context: one hand, gloves on, bright sun, standing on uneven ground, mid-conversation with a crew member, phone out for thirty seconds at a time. The build should do one thing well for someone who is not sitting at a desk.

## 2. The Task and the User

**User:** Site supervisor or foreman on an active job site.

**The one thing this should do well:** Report and act on a safety issue in under a minute, one-handed, from wherever the supervisor is standing. Everything else (crew check-in, checklist, daily log) hangs off that core, it does not compete with it.

## 3. Context Constraints

These constraints drive the design, not just the layout:

- **Gloves and sunlight.** Large tap targets. Contrast that survives direct outdoor glare, not just a lab monitor indoors.
- **One hand, often the non-dominant one.** The other hand may be holding a hard hat or steadying them on a ladder. Primary actions live in the thumb zone, not a top corner.
- **Interruption is normal.** A report may start, get interrupted, and resume later. State should not be lost.
- **Unreliable connectivity.** Job sites often have weak signal. At minimum, show a "saved locally, will send when connected" state so a report never just vanishes.
- **Speed over completeness.** Capture fast (photo, short note, severity) in the moment. Full detail can be filled in later.

## 4. Core Flow

1. A large, always-reachable "Report Incident" action, not buried in a menu.
2. Quick capture: camera opens immediately for a photo, a short text or voice-to-text note, a tap-based severity and type selector.
3. Confirmation that it's logged, even offline, with a visible sync status.
4. A lightweight daily view: crew check-in status, safety checklist progress, and today's incident log, so the supervisor can see the day at a glance without digging.

## 5. Data

All data lives in a single `data.json` file. Invented and simplified, this is about the experience, not a real data pipeline.

```json
{
  "incidents": [
    {
      "id": "inc-001",
      "timestamp": "2026-03-14T09:22:00",
      "type": "Near Miss",
      "severity": "Low",
      "note": "Loose scaffolding board on level 2",
      "photoUrl": "photos/inc-001.jpg",
      "reportedBy": "J. Alvarez",
      "syncStatus": "synced"
    }
  ],
  "crew": [
    {
      "name": "J. Alvarez",
      "role": "Electrician",
      "checkedIn": true,
      "checkInTime": "07:02"
    }
  ],
  "safetyChecklist": [
    {
      "item": "Hard hats worn on site",
      "completed": true
    },
    {
      "item": "Fire extinguishers accessible",
      "completed": false
    }
  ]
}
```

Incident `type` options: Near Miss, Injury, Property Damage, Hazard, Equipment Failure.
Incident `severity` options: Low, Medium, High, Critical.

## 6. Design Direction

### 6.1 Layout Priority

Mobile and iPad first, desktop second, and mobile is the priority throughout, not just the starting point. Build and test one-handed, thumb-zone reachability at the narrowest breakpoint before expanding up. Vuetify's breakpoint system (`xs`, `sm`, `md`, `lg`, `xl`) should drive layout changes, not custom media queries layered on top.

### 6.2 Visual and Interaction Notes

- Primary action ("Report Incident") should be reachable without stretching, bottom of screen or a persistent floating action button.
- High contrast, large text, large tap targets throughout, this should hold up in bright sun and with gloves on.
- Minimize typing. Prefer taps, toggles, and photo capture over text entry wherever the flow allows it.
- Show sync/offline status clearly, so a supervisor never wonders if a report actually went through.

## 7. Tech Stack and Project Setup

### 7.1 Stack

- Vue 3 with Vite and TypeScript
- Vue Router
- Vuetify 3, with Material Design Icons
- Chart.js with vue-chartjs, for the daily summary visualizations (e.g. incidents by severity, checklist completion)

### 7.2 Setup Commands

```bash
npm create vite@latest operational-dashboard -- --template vue-ts
cd operational-dashboard

npm install vue-router@4
npm install vuetify @mdi/font
npm install chart.js vue-chartjs

npm install
npm run dev
```

### 7.3 Configuration Notes

- Wire up Vuetify 3 manually in `src/main.ts`: create the instance with `createVuetify()`, set `mdi` as the icon font, register it as a plugin alongside the router.
- Import the Material Design Icons stylesheet from `@mdi/font/css/materialdesignicons.css`.
- Register Chart.js components (e.g. `CategoryScale`, `LinearScale`, `BarElement`) before using vue-chartjs components, per Chart.js v4 requirements.
- Place `data.json` where it can be imported directly, e.g. `src/data/data.json`.
- Set the Vuetify theme and any base font sizes with mobile legibility in mind, this should be true even before desktop styles are added.

## 8. Out of Scope

- [ ] Native app builds (React Native, Flutter, Kotlin, Swift)
- [ ] Real backend, authentication, or live data source
- [ ] Actual offline sync logic, a visible "saved, will sync" state is enough for this build
- [ ] Editing data through the UI beyond what the core flow needs, `data.json` can be edited directly for anything else

## 9. Open Questions / Assumptions

- [ ] Project name "operational-dashboard" was specified directly, worth reconsidering since this build is a mobile incident reporting tool, not a dashboard, but keeping as given unless you want it changed.
- [ ] Assuming camera capture can be mocked/simulated for the build rather than requiring real device camera integration testing.
- [ ] Assuming a single supervisor role for now, not multiple permission levels across roles.
