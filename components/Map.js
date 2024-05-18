import React, { useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"

const Map = () => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null) // 使用 ref 存储 map 实例

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyALT7b73K9O5eYodYZYFVDpFuNDoSKfZQE",
      version: "weekly",
      libraries: ["places"]
    })

    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position)
            const { latitude, longitude } = position.coords
            initializeMap(latitude, longitude)
          },
          (error) => {
            console.error("Error getting current location:", error)
          }
        )
      } else {
        console.error("Geolocation is not supported by this browser.")
      }
    }

    const initializeMap = (latitude, longitude) => {
      loader.load().then(() => {
        if (google && google.maps) {
          mapInstance.current = new google.maps.Map(mapRef.current, {
            center: { lat: latitude, lng: longitude },
            zoom: 12
          })

          new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapInstance.current,
            title: "当前位置"
          })
        }
      })
    }

    getCurrentLocation()

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        if (mapInstance.current) {
          mapInstance.current.panTo({ lat: latitude, lng: longitude })
        }
      },
      (error) => {
        console.error("Error getting current location:", error)
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
}

export default Map
