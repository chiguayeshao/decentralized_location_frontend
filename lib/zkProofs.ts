import * as snarkjs from "snarkjs"
import path from "path"
import {
  prepareWriteContract,
  writeContract,
  WriteContractResult
} from "@wagmi/core"

const CONTRACT_ADDRESS =
  "0x11f51b05e6ec6ff477821f7ac3379c77c8d6339a" as `0x${string}`

type ZkProofInput = {
  longitude: number
  minLongitude: number
  maxLongitude: number
  latitude: number
  minLatitude: number
  maxLatitude: number
}

/**
 * Generate a zk-SNARK proof for the given inputs
 * @param args The inputs to the zk-SNARK proof
 * @returns The proof and public signals
 */
export const generateProof = async (args: ZkProofInput) => {
  // We need to have the naming scheme and shape of the inputs match the .circom file
  const inputs = {
    in: [
      args.longitude,
      args.minLongitude,
      args.maxLongitude,
      args.latitude,
      args.minLatitude,
      args.maxLatitude
    ]
  }

  // Paths to the .wasm file and proving key
  const wasmPath = "/circuits/simple_summarizer.wasm"
  const provingKeyPath = "/circuits/proving_key.zkey"

  try {
    // Generate a proof of the circuit and create a structure for the output signals
    const { proof, publicSignals } = await snarkjs.plonk.fullProve(
      inputs,
      wasmPath,
      provingKeyPath
    )

    // Convert the data into Solidity calldata that can be sent as a transaction
    const calldataBlob = await snarkjs.plonk.exportSolidityCallData(
      proof,
      publicSignals
    )
    const calldata = calldataBlob.split(",")

    console.log(calldata)

    return {
      proof: JSON.parse(calldata[0].slice(1)),
      publicSignals: [JSON.parse(calldata[1])]
    }
  } catch (error) {
    console.error(`Failed to generate proof:`, error)
    return {
      proof: "",
      publicSignals: []
    }
  }
}

/**
 * Execute a transaction to submit the proof to the contract
 * @param proof The proof to submit
 * @param publicSignals The public signals to submit
 * @param ipfsCid ipfs cid of the proof
 * @returns The transaction receipt
 */
export const executeTransaction = async (
  proof: any,
  publicSignals: Array<string>,
  ipfsCid: string
): Promise<WriteContractResult> => {
  const abiPath = require("./abi/ZKLocationProofToken.json")

  // Prepare the transaction data
  const config = await prepareWriteContract({
    address: CONTRACT_ADDRESS,
    abi: abiPath.abi,
    functionName: "submitProof",
    args: [proof, publicSignals, ipfsCid]
  })

  // Execute the transaction
  return writeContract(config)
}
