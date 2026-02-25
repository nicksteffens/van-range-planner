import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { divIcon, type LatLng } from 'leaflet'
import MapClickHandler from './MapClickHandler'
import RangeRings from './RangeRings'

const pinIcon = divIcon({
  className: '',
  html: `<div style="
    width: 24px;
    height: 24px;
    background: #1e3a5f;
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg) translate(-4px, -4px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
})

const US_CENTER: [number, number] = [39.8283, -98.5795]
const DEFAULT_ZOOM = 5

interface MapProps {
  pin: LatLng | null
  onPinChange: (latlng: LatLng) => void
  milesPerDay: number
  maxDays: number
}

export default function Map({ pin, onPinChange, milesPerDay, maxDays }: MapProps) {
  return (
    <MapContainer
      center={US_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={onPinChange} />
      {pin && (
        <>
          <Marker position={pin} icon={pinIcon}>
            <Popup>
              {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
            </Popup>
          </Marker>
          <RangeRings center={pin} milesPerDay={milesPerDay} maxDays={maxDays} />
        </>
      )}
    </MapContainer>
  )
}
