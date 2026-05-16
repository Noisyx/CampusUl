export type Statut = 'libre' | 'occupé'

export type Salle = {
  id: string
  nom: string
  latitude: number
  longitude: number
  statut: Statut
}