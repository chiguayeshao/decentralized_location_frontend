import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import React from "react"
import CheckInCard from "@/components/CheckInCard"

export default function DrawerCard() {
  const proofs = [
    { latitude: "39.9042", longitude: "116.4074" },
    { latitude: "34.0522", longitude: "118.2437" }
  ]

  return (
    <div>
      <Drawer>
        <DrawerTrigger>
          <Button variant="outline">MINT PROOF</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>ZK Location Proof</DrawerTitle>
            <DrawerDescription>
              Generate your proof to participate in activities
            </DrawerDescription>
          </DrawerHeader>
          <CheckInCard />
          <DrawerFooter>
            {/* <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose> */}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
