import { MapContainer, TileLayer } from 'react-leaflet'

const US_CENTER: [number, number] = [39.8283, -98.5795]
const DEFAULT_ZOOM = 5

export default function Map() {
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
    </MapContainer>
  )
}
