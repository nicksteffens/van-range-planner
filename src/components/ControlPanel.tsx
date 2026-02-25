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
  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 w-64 space-y-4">
      <h2 className="text-sm font-semibold text-gray-800">Van Range Planner</h2>

      <div>
        <label className="text-xs text-gray-600 block mb-1">
          Miles per day: {milesPerDay}
        </label>
        <input
          type="range"
          min={100}
          max={600}
          step={25}
          value={milesPerDay}
          onChange={(e) => onMilesPerDayChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="text-xs text-gray-600 block mb-1">
          Days to show: {maxDays}
        </label>
        <input
          type="range"
          min={1}
          max={7}
          step={1}
          value={maxDays}
          onChange={(e) => onMaxDaysChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onLocateMe}
          disabled={locating}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-xs font-medium py-2 px-3 rounded transition-colors cursor-pointer"
        >
          {locating ? 'Locating...' : 'Use My Location'}
        </button>
        {hasPin && (
          <button
            onClick={onClearPin}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium py-2 px-3 rounded transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {!hasPin && (
        <p className="text-xs text-gray-400 text-center">
          Tap the map to drop a pin
        </p>
      )}
    </div>
  )
}
