'use client'

import dynamic from 'next/dynamic'

// Chargement dynamique obligatoire pour Leaflet
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <p className="text-gray-500 text-lg">Chargement de la carte...</p>
    </div>
  )
})

export default function Home() {
  return (
    <main className="w-full h-screen">
      <MapView />
    </main>
  )
}