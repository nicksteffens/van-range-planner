const MILES_TO_METERS = 1609.344

export interface DayRing {
  day: number
  radiusMeters: number
  color: string
  fillOpacity: number
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

export function generateDayRings(milesPerDay: number, maxDays: number): DayRing[] {
  return Array.from({ length: maxDays }, (_, i) => ({
    day: i + 1,
    radiusMeters: (i + 1) * milesPerDay * MILES_TO_METERS,
    color: COLORS[i % COLORS.length],
    fillOpacity: 0.08,
  }))
}
