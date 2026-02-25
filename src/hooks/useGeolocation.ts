import { useState, useCallback } from 'react'
import type { LatLng } from 'leaflet'
import { latLng } from 'leaflet'

interface GeolocationState {
  loading: boolean
  error: string | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
  })

  const locate = useCallback((): Promise<LatLng> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = 'Geolocation is not supported by this browser'
        setState({ loading: false, error: err })
        reject(new Error(err))
        return
      }

      setState({ loading: true, error: null })

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({ loading: false, error: null })
          resolve(latLng(position.coords.latitude, position.coords.longitude))
        },
        (err) => {
          setState({ loading: false, error: err.message })
          reject(err)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }, [])

  return { ...state, locate }
}
