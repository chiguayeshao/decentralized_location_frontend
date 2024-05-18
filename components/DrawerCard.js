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
import ProofListCard from "@/components/ProofListCard"

export default function DrawerCard() {
  const proofs = [
    { latitude: "39.9042", longitude: "116.4074" },
    { latitude: "34.0522", longitude: "118.2437" }
    // 你可以添加更多的 proof 数据
  ]

  return (
    <div>
      <Drawer>
        <DrawerTrigger>
          <Button variant="outline">Open Sidebar</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>ZK Proof</DrawerTitle>
            <DrawerDescription>立刻生成你的proof参与活动</DrawerDescription>
          </DrawerHeader>
          <CheckInCard />
          <ProofListCard proofs={proofs} />
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
