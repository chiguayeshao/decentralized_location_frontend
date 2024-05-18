import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateProof, executeTransaction } from "@/lib/zkProofs"
import axios from "axios"
import { Loader } from "lucide-react"

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET
import { useToast } from "@/components/ui/use-toast"

const CheckInCard = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)

  const testBorder = {
    longitude: 116.483446,
    latitude: 39.985449
  }

  const [zkProofInput, setZkProofInput] = useState({
    longitude: 0,
    minLongitude: 0,
    maxLongitude: 0,
    latitude: 0,
    minLatitude: 0,
    maxLatitude: 0
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const longitude = Number(position.coords.longitude) * 10 ** 7
      const latitude = Number(position.coords.latitude) * 10 ** 7

      const minLongitude = Number(longitude) - 1000
      const maxLongitude = Number(longitude) + 1000
      const minLatitude = Number(latitude) - 1000
      const maxLatitude = Number(latitude) + 1000

      console.log(longitude, latitude)
      console.log(minLongitude, maxLongitude, minLatitude, maxLatitude)

      setZkProofInput({
        longitude: longitude,
        minLongitude: minLongitude,
        maxLongitude: maxLongitude,
        latitude: latitude,
        minLatitude: minLatitude,
        maxLatitude: maxLatitude
      })
      setLoading(false)
    })
  }, [])

  const handleCheckIn = async () => {
    setButtonLoading(true)
    console.log(zkProofInput, "zkProofInput")
    const { proof, publicSignals } = await generateProof(zkProofInput)
    console.log("proof", proof)
    console.log("publicSignals", publicSignals)

    if (proof == "") {
      toast({
        title: "Unable to generate proof",
        description:
          "Please check if the current location meets the activity requirements",
        status: "error",
        duration: 5000,
        isClosable: true
      })
    } else {
      const formData = new FormData()
      formData.append("file", new Blob([proof], { type: "application/json" }))

      const metadata = JSON.stringify({
        name: "zkProof",
        keyvalues: {
          exampleKey: "exampleValue"
        }
      })
      formData.append("pinataMetadata", metadata)

      const options = JSON.stringify({
        cidVersion: 0
      })
      formData.append("pinataOptions", options)

      try {
        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxBodyLength: "Infinity",
            headers: {
              "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
              pinata_api_key: PINATA_API_KEY,
              pinata_secret_api_key: PINATA_API_SECRET
            }
          }
        )

        const cid = response.data.IpfsHash
        console.log("IPFS CID:", cid)

        const tx = await executeTransaction(proof, publicSignals, cid)
        const explorerUrl = `https://sepolia.etherscan.io/tx/${tx.hash}`
        const shortenedHash = `${tx.hash.slice(0, 6)}.....${tx.hash.slice(-6)}`
        console.log(tx)
        toast({
          title: "Successful",
          description: (
            <div className="flex flex-row gap-2">
              <div>Transaction Hash:</div>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3182ce", textDecoration: "underline" }}
              >
                {shortenedHash}
              </a>
            </div>
          ),
          status: "success",
          duration: 5000,
          isClosable: true
        })
      } catch (error) {
        console.error("Error uploading to IPFS: ", error)
        toast({
          title: "Failed",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true
        })
      }
    }
    setButtonLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin" size={40} />
      </div>
    )
  }

  return (
    <Card style={{ marginBottom: "20px" }}>
      <CardHeader>
        <CardTitle>Event information</CardTitle>
      </CardHeader>
      <CardContent
        style={{ display: "flex", alignItems: "center" }}
        className="  justify-around"
      >
        <div className="flex items-center">
          <svg
            className="justify-self-center self-start row-span-2 sm:row-span-full w-[100px] h-[100px] sm:h-[100px]"
            width="1083"
            height="1627"
            viewBox="0 0 1083 1627"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG path data */}
          </svg>
          <div>
            <CardTitle>ETH BEIJING 2024</CardTitle>
            <CardDescription>地点：META SPACE （751店）</CardDescription>
            {/* <CardDescription>简介：这是签到场地的简介。</CardDescription> */}
          </div>
        </div>
        <Button
          variant="outline"
          style={{ marginTop: "0px" }}
          onClick={() => {
            console.log("zkProofInput", zkProofInput)
            handleCheckIn()
          }}
          disabled={buttonLoading}
        >
          {buttonLoading ? "Loading..." : "CHECK IN"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default CheckInCard
