import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import type { LatLng } from 'leaflet'

interface FlyToPinProps {
  position: LatLng
}

export default function FlyToPin({ position }: FlyToPinProps) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, map.getZoom(), { duration: 1 })
  }, [map, position])

  return null
}
