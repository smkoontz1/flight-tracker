'use client'

import { JSX, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Circle, Line, Text } from 'react-konva'

interface GeoCoordinates {
  latitude: number
  longitude: number
}

interface PixelCoordinates {
  x: number
  y: number
}

export default function Flights() {
  const gridWidth = 1000
  const gridHeight = 1000
  const latitudeCount = 24
  const longitudeCount = 24
  const axisBuffer = 50
  const gridStartX = axisBuffer
  const gridStartY = 0
  
  const [currentLocation, setCurrentLocation] = useState<GeoCoordinates>({} as GeoCoordinates)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
    })
  }, [])
  
  const boxRadius = 0.5
  
  const minLatitude = currentLocation.latitude - boxRadius
  const maxLatitude = currentLocation.latitude + boxRadius
  const minLongitude = currentLocation.longitude - boxRadius
  const maxLongitude = currentLocation.longitude + boxRadius
  
  const latitudeLabelInterval = (maxLatitude - minLatitude) / latitudeCount
  const longitudeLabelInterval = (maxLongitude - minLongitude) / longitudeCount
  
  const latitudeInterval = gridHeight / latitudeCount
  const longitudeInterval = gridWidth / longitudeCount
  
  let latitudeLines: JSX.Element[] = []
  let longitudeLines: JSX.Element[] = []
  
  let latLabel = minLatitude - latitudeLabelInterval
  let lonLabel = minLongitude - longitudeLabelInterval
  
  const toPixelCoordinates = (coordinates: GeoCoordinates): PixelCoordinates => {
    const y = (coordinates.latitude - minLatitude) * 1000
    const x = ((coordinates.longitude - minLongitude) * 1000) + axisBuffer

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

  return (
    <main className='bg-black h-screen'>
      <div className='h-screen flex justify-center items-center'>
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            <Rect width={stageWidth} height={stageHeight} fill='black' />
            {latitudeLines}
            {longitudeLines}
            <Circle radius={10} fill='blue' x={currentLocationPixels.x} y={currentLocationPixels.y} />
          </Layer>
        </Stage>
      </div>
    </main>
  )
}