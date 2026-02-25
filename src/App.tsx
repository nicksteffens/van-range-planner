import { useState } from 'react'
import type { LatLng } from 'leaflet'
import Map from './components/Map'

const DEFAULT_MILES_PER_DAY = 350
const DEFAULT_MAX_DAYS = 5

function App() {
  const [pin, setPin] = useState<LatLng | null>(null)

  return (
    <div className="h-full w-full">
      <Map
        pin={pin}
        onPinChange={setPin}
        milesPerDay={DEFAULT_MILES_PER_DAY}
        maxDays={DEFAULT_MAX_DAYS}
      />
    </div>
  )
}

export default App
