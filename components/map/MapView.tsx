'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '@/lib/supabase'
import type { Salle } from '@/types'
import 'leaflet/dist/leaflet.css'

// Fix icônes Leaflet avec Next.js/ correction technique extern de Leaflet pour Next.js
type LeafletIconDefaultProto = {
  _getIconUrl?: unknown
}
delete (L.Icon.Default.prototype as unknown as LeafletIconDefaultProto)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Fonction pour charger les salles depuis Supabase
export default function MapView() {
  const [salles, setSalles] = useState<Salle[]>([])

  // Charger les salles depuis Supabase/ récupération des données de la table salles
  useEffect(() => {
    const fetchSalles = async () => {
      const { data, error } = await supabase
        .from('salles')
        .select('*')

        console.log('data:', data)   // 👈 ajoute ça
    console.log('error:', error) // 👈 et ça

      if (error) console.error(error)
      else setSalles(data)  // Je met les données dans le state salles
    }

    fetchSalles()
  }, [])

  // Changer le statut d'une salle dans la base de données
  const changerStatut = async (id: string, statut: 'libre' | 'occupé') => {
    const { error } = await supabase
      .from('salles')
      .update({ statut })
      .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    // Mettre à jour localement sans recharger la page
    setSalles(prev =>
      prev.map(s => s.id === id ? { ...s, statut } : s)
    )
  }

  return (
    <MapContainer
      center={[6.1370, 1.2135]}
      zoom={17}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {salles.map(salle => (  // pour chaque salle, je crée un marker
        <Marker
          key={salle.id}
          position={[salle.latitude, salle.longitude]}
        >
          <Popup>
            <div className="p-2 min-w-[160px]">
              <h3 className="font-bold text-base mb-1">{salle.nom}</h3>
              <span className={`text-sm font-medium ${
                salle.statut === 'libre' ? 'text-green-600' : 'text-red-500'
              }`}>
                ● {salle.statut === 'libre' ? 'Libre' : 'Occupé'}
              </span>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => changerStatut(salle.id, 'libre')}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                    salle.statut === 'libre'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-green-600 border-green-600 hover:bg-green-50'
                  }`}
                >
                  Libre
                </button>
                <button
                  onClick={() => changerStatut(salle.id, 'occupé')}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                    salle.statut === 'occupé'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-red-500 border-red-500 hover:bg-red-50'
                  }`}
                >
                  Occupé
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}