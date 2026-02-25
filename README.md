# Van Range Planner - 350-Mile Daily Range Map

> Drop a pin, see how far your camper van can realistically travel each day with concentric 350-mile range rings

**Status**: Planning & Research Phase
**Type**: Web App (PWA)
**Maps**: Leaflet + OpenStreetMap (free, no API key needed)

---

## The Problem

When planning camper van road trips, it's hard to gauge how many days it takes to get somewhere. You and your partner can comfortably cover ~350 miles in a day of driving. But staring at a map, "350 miles" is abstract - what does that actually look like from Denver? From Austin? From wherever you are right now?

## The Solution

Drop a pin (or use your current location) and the map instantly draws concentric rings:
- **Day 1 ring** (350 mi) - where you could be by tonight
- **Day 2 ring** (700 mi) - tomorrow night
- **Day 3 ring** (1,050 mi) - and so on

Toggle between a simple straight-line radius and a realistic driving-distance isochrone that follows actual roads.

Then, plan your route by placing waypoints. Each waypoint gets its own 350-mile range circle showing where you can go next.

## Core Features

1. **Pin placement** - Tap the map or use current GPS location as your starting point
2. **Concentric day rings** - 350mi, 700mi, 1050mi... radiating outward, color-coded by day
3. **Straight-line vs driving distance** - Toggle between simple circles and road-based isochrones
4. **Route waypoints** - Place stops along your trip, each gets a 350mi range for the next leg
5. **Van-friendly** - Account for a ~9.5ft tall vehicle (height-restricted roads/tunnels/bridges)

## Bonus Ideas (Future)

- Campground/RV park overlay within each day's range
- Gas station stops along potential routes
- Save and share trip plans with your partner
- Offline map support for areas without cell service
- Height restriction warnings on routes (9.5ft clearance)

## Documentation

- **[PLANNING.md](./PLANNING.md)** - Technical approach and implementation plan

## Quick Start

**Coming soon** - Currently in planning phase
