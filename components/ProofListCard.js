import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ProofListCard = ({ proofs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proof 列表</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {proofs.map((proof, index) => (
            <li key={index}>
              纬度：{proof.latitude}, 经度：{proof.longitude}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default ProofListCard
