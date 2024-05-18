import * as snarkjs from 'snarkjs';
import path from 'path';
import { prepareWriteContract, writeContract, WriteContractResult } from "@wagmi/core"

type ZkProofInput = {
  longitude: number;
  minLongitude: number;
  maxLongitude: number;
  latitude: number;
  minLatitude: number;
  maxLatitude: number;
}

/**
 * Generate a zk-SNARK proof for the given inputs
 * @param args The inputs to the zk-SNARK proof
 * @returns The proof and public signals
 */
export const generateProof = async (args: ZkProofInput) => {
  // We need to have the naming scheme and shape of the inputs match the .circom file
  const inputs = {
    in: [args.longitude, args.minLongitude, args.maxLongitude, args.latitude, args.minLatitude, args.maxLatitude],
  }

  // Paths to the .wasm file and proving key
  const wasmPath = path.join(process.cwd(), 'circuits/build/simple_summarizer_js/simple_summarizer.wasm');
  const provingKeyPath = path.join(process.cwd(), 'circuits/build/proving_key.zkey')

  try {
    // Generate a proof of the circuit and create a structure for the output signals
    const { proof, publicSignals } = await snarkjs.plonk.fullProve(inputs, wasmPath, provingKeyPath);

    // Convert the data into Solidity calldata that can be sent as a transaction
    const calldataBlob = await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);
    const calldata = calldataBlob.split(',');

    console.log(calldata);

    return {
      proof: calldata[0],
      publicSignals: JSON.parse(calldata[1]),
    }
  } catch (error) {
    console.error(`Failed to generate proof:`, error)
    return {
      proof: "",
      publicSignals: [],
    }
  }
}

/**
 * Execute a transaction to submit the proof to the contract
 * @param proof The proof to submit
 * @param publicSignals The public signals to submit
 * @returns The transaction receipt
 */
export const executeTransaction = async (proof: any, publicSignals: Array<string>): Promise<WriteContractResult> => {
  const abiPath = require('./abi/SimpleSummarizer.json');

  // Prepare the transaction data
  const config = await prepareWriteContract({
    address: '0xbfa57510adead881d7e77749e23fa65ff4e93956' as `0x${string}`,
    abi: abiPath.abi,
    functionName: 'submitProof',
    args: [proof, publicSignals]
  });

  // Execute the transaction
  return writeContract(config);
}
