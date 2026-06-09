import {
  MdPool,
  MdLocalFlorist,
  MdDirectionsCar,
  MdSecurity,
  MdWifi,
  MdAir,
  MdRestaurant,
  MdWater,
  MdTerrain,
  MdHouse,
  MdBalcony,
  MdPets,
  MdChair,
  MdLocalLaundryService,
  MdFitnessCenter,
  MdStorefront,
  MdCheckCircle,
} from 'react-icons/md'

// Normalizar string: remove accents y convertir a lowercase
function normalizeFeature(text) {
  if (!text || typeof text !== 'string') return ''
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// Mapeo de palabras clave a iconos
const featureIconMap = {
  // Piscina
  pool: MdPool,
  piscina: MdPool,
  swimming: MdPool,

  // Jardín
  garden: MdLocalFlorist,
  jardin: MdLocalFlorist,
  vegetacion: MdLocalFlorist,
  verde: MdLocalFlorist,

  // Parqueo
  garage: MdDirectionsCar,
  garaje: MdDirectionsCar,
  parking: MdDirectionsCar,
  parqueo: MdDirectionsCar,
  estacionamiento: MdDirectionsCar,
  carport: MdDirectionsCar,

  // Seguridad
  security: MdSecurity,
  seguridad: MdSecurity,
  vigilancia: MdSecurity,
  guardias: MdSecurity,

  // WiFi
  wifi: MdWifi,
  internet: MdWifi,
  conexion: MdWifi,
  broadband: MdWifi,

  // Aire acondicionado
  ac: MdAir,
  aire: MdAir,
  acondicionado: MdAir,
  climate: MdAir,

  // Cocina
  kitchen: MdRestaurant,
  cocina: MdRestaurant,
  kitchenette: MdRestaurant,

  // Vista al mar
  sea: MdWater,
  ocean: MdWater,
  beach: MdWater,
  playa: MdWater,
  vista_al_mar: MdWater,
  water_view: MdWater,
  mar: MdWater,

  // Montaña
  mountain: MdTerrain,
  mountains: MdTerrain,
  montana: MdTerrain,
  montanas: MdTerrain,
  hill: MdTerrain,

  // Terraza
  terrace: MdHouse,
  terraza: MdHouse,
  deck: MdHouse,

  // Balcón
  balcony: MdBalcony,
  balcon: MdBalcony,
  porch: MdBalcony,

  // Mascotas
  pets: MdPets,
  mascotas: MdPets,
  pet_friendly: MdPets,
  perros: MdPets,
  gatos: MdPets,
  animals: MdPets,

  // Amueblado
  furnished: MdChair,
  amueblado: MdChair,
  furniture: MdChair,

  // Lavandería
  laundry: MdLocalLaundryService,
  lavanderia: MdLocalLaundryService,
  washer: MdLocalLaundryService,
  dryer: MdLocalLaundryService,
  ropa: MdLocalLaundryService,

  // Gimnasio
  gym: MdFitnessCenter,
  gimnasio: MdFitnessCenter,
  fitness: MdFitnessCenter,
  exercise: MdFitnessCenter,

  // Bodega/Storage
  storage: MdStorefront,
  bodega: MdStorefront,
  warehouse: MdStorefront,
  storeroom: MdStorefront,
}

export function getFeatureIcon(feature) {
  if (!feature) return MdCheckCircle

  const normalized = normalizeFeature(feature)
  const Icon = featureIconMap[normalized]

  if (Icon) return Icon

  // Try partial matching
  for (const [key, IconComponent] of Object.entries(featureIconMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return IconComponent
    }
  }

  // Default icon
  return MdCheckCircle
}

export function normalizeFeatures(features) {
  if (!Array.isArray(features)) return []

  return features
    .filter((f) => f && String(f).trim().length > 0)
    .map((f) => String(f).trim())
    .filter((value, index, self) => self.indexOf(value) === index) // remove duplicates
}
