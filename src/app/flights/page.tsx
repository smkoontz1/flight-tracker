'use client'

import { JSX, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Circle, Line, Text } from 'react-konva'
import { useStateVectors } from '../../data/hooks/useStateVectors'

interface GeoCoordinates {
  latitude: number
  longitude: number
}

interface PixelCoordinates {
  x: number
  y: number
}

interface BoundingBox {
  minLatitude: number
  maxLatitude: number
  minLongitude: number
  maxLongitude: number
}

export default function Flights() {
  const gridWidth = 1000
  const gridHeight = 1000
  const latitudeCount = 24
  const longitudeCount = 24
  const axisBuffer = 50
  const gridStartX = axisBuffer
  const gridStartY = 0
  const boxRadius = 0.5
  
  const [currentLocation, setCurrentLocation] = useState<GeoCoordinates>({ latitude: 0, longitude: 0 })
  const [boundingBox, setBoundingBox] = useState<BoundingBox>({ minLatitude: 0, maxLatitude: 0, minLongitude: 0, maxLongitude: 0 })
  
  const { data } = useStateVectors({
    lamin: boundingBox?.minLatitude,
    lamax: boundingBox?.maxLatitude,
    lomin: boundingBox?.minLongitude,
    lomax: boundingBox?.maxLongitude
  })

  useEffect(() => {
    console.log('Got state vectors', data)
  }, [data])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const currentLatitude = position.coords.latitude
      const currentLongitude = position.coords.longitude

      setCurrentLocation({ latitude: currentLatitude, longitude: currentLongitude })

      const minLatitude = currentLatitude - boxRadius
      const maxLatitude = currentLatitude + boxRadius
      const minLongitude = currentLongitude - boxRadius
      const maxLongitude = currentLongitude + boxRadius

      setBoundingBox({
        minLatitude,
        maxLatitude,
        minLongitude,
        maxLongitude
      })
    })
  }, [])
  
  const latitudeLabelInterval = (boundingBox.maxLatitude - boundingBox.minLatitude) / latitudeCount
  const longitudeLabelInterval = (boundingBox.maxLongitude - boundingBox.minLongitude) / longitudeCount
  
  const latitudeInterval = gridHeight / latitudeCount
  const longitudeInterval = gridWidth / longitudeCount
  
  let latitudeLines: JSX.Element[] = []
  let longitudeLines: JSX.Element[] = []
  
  let latLabel = boundingBox.minLatitude - latitudeLabelInterval
  let lonLabel = boundingBox.minLongitude - longitudeLabelInterval
  
  const toPixelCoordinates = (coordinates: GeoCoordinates): PixelCoordinates => {
    const y = (coordinates.latitude - boundingBox.minLatitude) * 1000
    const x = ((coordinates.longitude - boundingBox.minLongitude) * 1000) + axisBuffer

    return { x, y }
  }

  for (let y = gridStartY; y <= gridHeight; y += latitudeInterval) {
    latLabel += latitudeLabelInterval
    
    latitudeLines = [
      ...latitudeLines,
      <>
        <Text text={latLabel.toFixed(2)} x={0} y={y} fill='white' offsetX={-10} />
        <Line points={[gridStartX, y, gridWidth + axisBuffer, y]} stroke='white' />
      </>
    ]
  }

  for (let x = gridStartX; x <= gridWidth + axisBuffer; x += longitudeInterval) {
    lonLabel += longitudeLabelInterval
    
    longitudeLines = [
      ...longitudeLines,
      <>
        <Text text={lonLabel.toFixed(2)} x={x} y={gridStartY + gridHeight} fill='white' rotation={270} offsetX={40} offsetY={10} />
        <Line points={[x, gridStartY, x, gridHeight]} stroke='white' />
      </>
    ]
  }
  
  const stageWidth = gridWidth + axisBuffer
  const stageHeight = gridHeight + axisBuffer

  const currentLocationPixels = toPixelCoordinates(currentLocation)

  let planeLocations: JSX.Element[] = []

  if (data) {
    planeLocations = data.map(s => {
      const pixelCoordinates = toPixelCoordinates({ latitude: s.latitude, longitude: s.longitude })

      return <Circle radius={10} fill='green' x={pixelCoordinates.x} y={pixelCoordinates.y} />
    })
  }

  return (
    <main className='bg-black h-screen'>
      <div className='h-screen flex justify-center items-center'>
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            <Rect width={stageWidth} height={stageHeight} fill='black' />
            {latitudeLines}
            {longitudeLines}
            <Circle radius={10} fill='blue' x={currentLocationPixels.x} y={currentLocationPixels.y} />
            {planeLocations}
          </Layer>
        </Stage>
      </div>
    </main>
  )
}