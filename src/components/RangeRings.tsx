import { Circle, Marker } from 'react-leaflet'
import { divIcon, type LatLng } from 'leaflet'
import { generateDayRings } from '../lib/rings'

const MILES_TO_METERS = 1609.344

interface RangeRingsProps {
  center: LatLng
  milesPerDay: number
  maxDays: number
}

function offsetNorth(center: LatLng, meters: number): [number, number] {
  const degreesPerMeter = 1 / 111_320
  return [center.lat + meters * degreesPerMeter, center.lng]
}

export default function RangeRings({ center, milesPerDay, maxDays }: RangeRingsProps) {
  const rings = generateDayRings(milesPerDay, maxDays)

  return (
    <>
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
        />
      ))}
      {rings.map((ring) => (
        <Marker
          key={`label-${ring.day}`}
          position={offsetNorth(center, ring.day * milesPerDay * MILES_TO_METERS * 0.85)}
          interactive={false}
          icon={divIcon({
            className: '',
            html: `<div style="
              color: #111;
              font-size: 13px;
              font-weight: 700;
              text-align: center;
              text-shadow: 0 0 4px white, 0 0 4px white, 0 0 4px white;
            ">Day ${ring.day}<br/>${(ring.day * milesPerDay).toLocaleString()} mi</div>`,
            iconSize: [80, 40],
            iconAnchor: [40, 20],
          })}
        />
      ))}
    </>
  )
}
