import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { LatLng } from 'leaflet'
import MapClickHandler from './MapClickHandler'

const US_CENTER: [number, number] = [39.8283, -98.5795]
const DEFAULT_ZOOM = 5

interface MapProps {
  pin: LatLng | null
  onPinChange: (latlng: LatLng) => void
}

export default function Map({ pin, onPinChange }: MapProps) {
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
        <Marker position={pin}>
          <Popup>
            {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
