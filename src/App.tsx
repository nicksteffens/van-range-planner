import { useState } from 'react'
import type { LatLng } from 'leaflet'
import Map from './components/Map'

function App() {
  const [pin, setPin] = useState<LatLng | null>(null)

  return (
    <div className="h-full w-full">
      <Map pin={pin} onPinChange={setPin} />
    </div>
  )
}

export default App
