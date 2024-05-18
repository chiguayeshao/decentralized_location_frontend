import React, { useEffect, useState } from "react"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

const containerStyle = {
  width: "100%",
  height: "600px"
}

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      //   console.log(position)
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    })
  }, [])

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={15}
      >
        <Marker
          position={currentPosition}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          }}
        />
      </GoogleMap>
    </LoadScript>
  )
}

export default Map
