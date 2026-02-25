import { Circle, Tooltip } from 'react-leaflet'
import type { LatLng } from 'leaflet'
import { generateDayRings } from '../lib/rings'

interface RangeRingsProps {
  center: LatLng
  milesPerDay: number
  maxDays: number
}

export default function RangeRings({ center, milesPerDay, maxDays }: RangeRingsProps) {
  const rings = generateDayRings(milesPerDay, maxDays)

  return (
    <>
      {/* Render outermost first so inner rings draw on top */}
      {[...rings].reverse().map((ring) => (
        <Circle
          key={ring.day}
          center={center}
          radius={ring.radiusMeters}
          pathOptions={{
            color: ring.color,
            weight: 2,
            fillColor: ring.color,
            fillOpacity: ring.fillOpacity,
          }}
        >
          <Tooltip direction="top" permanent className="day-label">
            Day {ring.day} ({ring.day * milesPerDay} mi)
          </Tooltip>
        </Circle>
      ))}
    </>
  )
}
