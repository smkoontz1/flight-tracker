import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { StateVector } from '../types/openSkyTypes'

interface Props {
  lamin: number
  lamax: number
  lomin: number
  lomax: number
}

export const useStateVectors = (props: Props) => {
  const { lamin, lamax, lomin, lomax } = props
  
  return useQuery<StateVector[]>({
    queryKey: ['states'],
    queryFn: async () => {
      const response = await axios.get(
        'https://opensky-network.org/api/states/all?lamin=40.9555&lomin=-96.2395&lamax=41.5555&lomax=-95.6395',
        {
          params: {
            lamin,
            lamax,
            lomin,
            lomax
          }
        },
      )

      const stateVectors: StateVector[] = response.data.states.map(s => <StateVector>{
        icao24: s[0],
        callsign: s[1],
        originCountry: s[2],
        timePosition: s[3],
        lastContact: s[4],
        longitude: s[5],
        latitude: s[6],
        baroAltitude: s[7],
        onGround: s[8],
        velocity: s[9],
        trueTrack: s[10],
        verticalRate: s[11],
        sensors: s[12],
        geoAltitude: s[13],
        squawk: s[14],
        spi: s[15],
        positionSource: s[16]
      })

      return stateVectors
    },
    enabled: !!(lamin && lamax && lomin && lomax)
  })
}