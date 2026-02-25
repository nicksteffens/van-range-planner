# Planning: Van Range Planner

## How It Works

### Core Flow

1. User opens the app, sees a full-screen map of the US
2. User drops a pin or taps "Use my location"
3. Concentric rings appear: Day 1 (350mi), Day 2 (700mi), Day 3 (1050mi)...
4. User toggles between straight-line circles and road-based isochrones
5. User can place waypoints to build a multi-day route, each waypoint spawns its own 350mi ring

### Two Distance Modes

**Straight-line radius** (default, instant):
- Simple circles drawn on the map
- Fast, no API calls needed
- Good for a rough "how far is that?" gut check

**Driving-distance isochrone** (toggle, API-dependent):
- Realistic blob shape showing actual drivable area within 350 miles
- Follows highways and roads, accounts for geography (mountains, coastlines)
- Uses a routing/isochrone API (see tech choices below)

## Technical Approach

### Pin + Concentric Rings

```typescript
interface TripOrigin {
  location: { lat: number; lng: number };
  label?: string; // "Home", "Denver", etc.
}

interface DayRing {
  day: number;
  radiusMiles: number; // day * 350
  color: string;       // distinct color per day
  opacity: number;     // fade out further rings
}

// Generate rings for N days from origin
function generateDayRings(maxDays: number = 5): DayRing[] {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return Array.from({ length: maxDays }, (_, i) => ({
    day: i + 1,
    radiusMiles: (i + 1) * 350,
    color: colors[i % colors.length],
    opacity: 1 - (i * 0.15),
  }));
}
```

### Route Waypoints Mode

```typescript
interface Waypoint {
  id: string;
  location: { lat: number; lng: number };
  label?: string;
  dayNumber: number;
  rangeCircle: DayRing; // single 350mi ring from this point
}

interface Trip {
  origin: TripOrigin;
  waypoints: Waypoint[];
  totalMiles: number;
  totalDays: number;
}
```

User flow:
1. Start with origin pin + concentric rings
2. Tap inside Day 1 ring to place first waypoint ("Night 1 camp")
3. Waypoint gets its own 350mi circle showing Day 2 range
4. Repeat to build out a multi-day route
5. Lines connect waypoints showing the route path

### Isochrone (Driving Distance) Mode

Instead of a perfect circle, show the actual area reachable by road within 350 miles.

**API options for isochrones:**

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Mapbox Isochrone API | 100K requests/mo | Distance-based isochrones, good free tier |
| OpenRouteService | 500 requests/day | Open source, self-hostable |
| HERE Isoline Routing | 250K/mo | Supports distance + time isochrones |
| Valhalla (self-hosted) | Unlimited | Open source, runs locally, no API costs |

**Recommendation**: Start with Mapbox Isochrone API for simplicity. Evaluate Valhalla for self-hosting later if costs or rate limits become an issue.

### Height Restrictions (9.5ft Van)

This is non-trivial and will be a stretch goal. Options:

- **OpenStreetMap** has `maxheight` tags on many roads/tunnels/bridges
- **Google Routes API** does not natively support vehicle height restrictions
- **HERE Fleet Telematics** supports truck/vehicle dimensions for routing
- **Overpass API** (OSM) can query for height-restricted ways in a bounding box

For MVP: surface a warning layer showing known low-clearance points within the visible area, sourced from OSM data.

## Architecture

```
src/
├── components/
│   ├── Map.tsx               # Full-screen map with overlays
│   ├── PinControl.tsx        # Drop pin / use location button
│   ├── RangeRings.tsx        # Concentric day ring overlays
│   ├── WaypointMarker.tsx    # Route waypoint with range circle
│   ├── RouteLine.tsx         # Connecting line between waypoints
│   ├── ModeToggle.tsx        # Straight-line vs driving distance
│   ├── DaySlider.tsx         # Control how many day rings to show
│   └── TripSummary.tsx       # Total miles, days, waypoint list
├── lib/
│   ├── geo.ts                # Haversine distance, coordinate math
│   ├── isochrone.ts          # Isochrone API integration
│   └── storage.ts            # Save/load trips (localStorage / IndexedDB)
├── hooks/
│   ├── useGeolocation.ts     # Browser geolocation API
│   ├── useMap.ts             # Map instance management
│   └── useTrip.ts            # Trip state management
├── types.ts
├── App.tsx
└── main.tsx
```

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React + TypeScript | Familiar, good ecosystem |
| Maps | Leaflet + OpenStreetMap | 100% free, no API key, no billing account |
| Maps Wrapper | `react-leaflet` | Mature React bindings for Leaflet |
| Isochrones | OpenRouteService | Free tier (500 req/day), open source |
| Offline | Service Worker + IndexedDB | PWA offline capability |
| Styling | Tailwind CSS | Quick UI for controls |
| Build | Vite | Fast, simple |
| Storage | localStorage → IndexedDB | Trips saved locally, no backend |

### Why Leaflet + OpenStreetMap

- **Completely free** - no API key, no credit card, no billing account
- **No usage limits** on map tile loading (uses public OSM tile servers)
- **Open source** - Leaflet is ~42KB, lightweight and fast
- **`L.circle()`** natively supports radius in meters - perfect for range rings
- **Good enough for a prototype** - clean road map view, no satellite needed
- OSM data also powers the height restriction queries (same data source)

## Implementation Phases

### Phase 1: Pin + Circles (MVP)
- [ ] Vite + React + TypeScript + Leaflet setup
- [ ] Drop a pin on the map or use current location
- [ ] Draw concentric 350mi straight-line circles (Day 1-5)
- [ ] Color-code rings by day with labels
- [ ] Slider to adjust number of visible day rings
- [ ] Basic mobile-friendly layout

### Phase 2: Route Waypoints
- [ ] Tap inside a ring to place a waypoint
- [ ] Each waypoint gets its own 350mi range circle
- [ ] Draw route line connecting origin → waypoints
- [ ] Show total trip miles and days
- [ ] Remove/reorder waypoints

### Phase 3: Driving Distance Isochrones
- [ ] Integrate OpenRouteService Isochrone API
- [ ] Toggle between circle mode and isochrone mode
- [ ] Cache isochrone results to reduce API calls
- [ ] Show realistic drivable area shape

### Phase 4: Save & Share
- [ ] Save trips to localStorage/IndexedDB
- [ ] Name and manage saved trips
- [ ] Share trip via URL (encode state in query params)
- [ ] Export trip as image

### Phase 5: Bonus Layers
- [ ] Campground/RV park data layer (Recreation.gov API, iOverlander)
- [ ] Gas station overlay
- [ ] Height restriction warnings from OSM data
- [ ] Offline map tile caching (PWA service worker)

## PWA: Install on iPhone Without the App Store

No Apple Developer license needed. A **Progressive Web App (PWA)** installs directly from Safari and behaves like a native app - home screen icon, full-screen mode, offline support.

### What Makes It Feel Like a Real App

| Feature | How |
|---------|-----|
| Home screen icon | `manifest.json` with app name + icons |
| Full-screen (no Safari chrome) | `"display": "standalone"` in manifest |
| Splash screen on launch | Configured via manifest `icons` + `background_color` |
| Offline access | Service Worker caches the app shell, map tiles, and saved trips |
| GPS / current location | Standard browser Geolocation API (works identically in PWA mode) |
| Push notifications | Supported on iOS 16.4+ via Web Push |

### How to Install

1. Open the site in **Safari** on iPhone
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Done - app icon appears on home screen, opens full-screen

### PWA Setup (Vite + vite-plugin-pwa)

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Van Range Planner',
        short_name: 'VanRange',
        description: 'Plan your camper van trip with 350-mile daily range rings',
        theme_color: '#1e3a5f',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // Cache OpenStreetMap tiles for offline use
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Cache isochrone API responses
            urlPattern: /^https:\/\/api\.openrouteservice\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'isochrone-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
});
```

### Offline Strategy

| What | Strategy | Details |
|------|----------|---------|
| App shell (HTML/JS/CSS) | **Precache** | Bundled at build time, always available offline |
| Map tiles (viewed areas) | **Cache-first** | Tiles you've already viewed are saved locally |
| Saved trips | **IndexedDB** | All trip data stored on-device, no server needed |
| Isochrone results | **Cache-first** | Previously fetched driving-distance shapes cached for 7 days |
| New map areas | **Network-only** | Need internet to load tiles for areas you haven't visited yet |

### Hosting: GitHub Pages (Free)

GitHub Pages serves the PWA over HTTPS for free directly from the repo.

**URL**: `https://nicksteffens.github.io/van-range-planner/`

**Setup with GitHub Actions** (auto-deploy on every push to `main`):

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**Vite config for GitHub Pages** (handles the `/van-range-planner/` base path):

```typescript
// vite.config.ts
export default defineConfig({
  base: '/van-range-planner/',
  // ... rest of config
});
```

**SPA routing fix**: GitHub Pages doesn't natively support client-side routing. Add a `public/404.html` that redirects to `index.html` to handle deep links.

**Deploy flow**: push to `main` → GitHub Actions builds → auto-deploys to Pages → open URL on phone → Add to Home Screen.

### iOS PWA Limitations to Know

- **No background location tracking** - GPS only works while the app is open (fine for this use case)
- **Storage cap ~50MB** - enough for app + cached tiles of areas you've browsed, but can't pre-download the entire US map
- **No access to Apple Maps** - uses OpenStreetMap tiles in browser (works great)
- **Safari WebKit only** - iOS forces all browsers to use WebKit, so PWA rendering is consistent

## Open Questions

1. **Daily mileage adjustment** - Should the user be able to change the 350mi default? (Some days you want to push 400, some days 200)
2. **Time-based vs distance-based** - Also show "6 hours of driving" as an alternative?
3. **Multiple origins** - Could your partner drop a pin from a different starting point to find where your ranges overlap? (meetup planner)
