
export interface StateVector {
  icao24: string
  callsign: string
  originCountry: string
  timePosition: number
  lastContact: number
  longitude: number
  latitude: number
  baroAltitude: number
  onGround: boolean
  velocity: number
  trueTrack: number
  verticalRate: number
  sensors: number[]
  geoAltitude: number
  squawk: string
  spi: boolean
  positionSource: number
}