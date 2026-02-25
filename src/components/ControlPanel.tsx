import { useState } from 'react'

interface ControlPanelProps {
  maxDays: number
  onMaxDaysChange: (days: number) => void
  milesPerDay: number
  onMilesPerDayChange: (miles: number) => void
  hasPin: boolean
  onClearPin: () => void
  onLocateMe: () => void
  locating: boolean
}

export default function ControlPanel({
  maxDays,
  onMaxDaysChange,
  milesPerDay,
  onMilesPerDayChange,
  hasPin,
  onClearPin,
  onLocateMe,
  locating,
}: ControlPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end gap-2">
      {/* Toggle button - always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-white rounded-lg shadow-lg p-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Toggle controls"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open ? (
            <path d="M18 6 6 18M6 6l12 12" />
          ) : (
            <>
              <line x1="4" x2="4" y1="21" y2="14" />
              <line x1="4" x2="4" y1="10" y2="3" />
              <line x1="12" x2="12" y1="21" y2="12" />
              <line x1="12" x2="12" y1="8" y2="3" />
              <line x1="20" x2="20" y1="21" y2="16" />
              <line x1="20" x2="20" y1="12" y2="3" />
              <line x1="2" x2="6" y1="14" y2="14" />
              <line x1="10" x2="14" y1="8" y2="8" />
              <line x1="18" x2="22" y1="16" y2="16" />
            </>
          )}
        </svg>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="bg-white rounded-lg shadow-lg p-4 w-56 space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Miles per day: <strong>{milesPerDay}</strong>
            </label>
            <input
              type="range"
              min={100}
              max={600}
              step={25}
              value={milesPerDay}
              onChange={(e) => onMilesPerDayChange(Number(e.target.value))}
              className="w-full h-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Days to show: <strong>{maxDays}</strong>
            </label>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={maxDays}
              onChange={(e) => onMaxDaysChange(Number(e.target.value))}
              className="w-full h-2"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onLocateMe}
              disabled={locating}
              className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
            >
              {locating ? 'Locating...' : 'My Location'}
            </button>
            {hasPin && (
              <button
                onClick={onClearPin}
                className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 text-sm font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Prompt when no pin and panel is closed */}
      {!hasPin && !open && (
        <div className="bg-white/90 rounded-lg shadow px-3 py-2">
          <p className="text-sm text-gray-600">Tap the map to drop a pin</p>
        </div>
      )}
    </div>
  )
}
