import { useState } from 'react'
import type { LatLng } from 'leaflet'
import Map from './components/Map'
import ControlPanel from './components/ControlPanel'
import { useGeolocation } from './hooks/useGeolocation'

function App() {
  const [pin, setPin] = useState<LatLng | null>(null)
  const [milesPerDay, setMilesPerDay] = useState(350)
  const [maxDays, setMaxDays] = useState(5)
  const { loading: locating, locate } = useGeolocation()

  const handleLocateMe = async () => {
    try {
      const position = await locate()
      setPin(position)
    } catch {
      // useGeolocation already tracks the error
    }
  }

  return (
    <div className="h-full w-full relative">
      <Map
        pin={pin}
        onPinChange={setPin}
        milesPerDay={milesPerDay}
        maxDays={maxDays}
      />
      <ControlPanel
        maxDays={maxDays}
        onMaxDaysChange={setMaxDays}
        milesPerDay={milesPerDay}
        onMilesPerDayChange={setMilesPerDay}
        hasPin={pin !== null}
        onClearPin={() => setPin(null)}
        onLocateMe={handleLocateMe}
        locating={locating}
      />
    </div>
  )
}

export default App
