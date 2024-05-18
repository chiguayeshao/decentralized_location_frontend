// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Interface to PlonkVerifier.sol
interface IPlonkVerifier {
    function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns (bool);
}

contract ZKLocationProofToken is ERC721 {
    uint256 private _tokenIdCounter;
    address public s_plonkVerifierAddress;

    struct LocationProof {
        string ipfsCid; // IPFS CID storing the proof metadata
        uint256 timestamp;
    }

    // Mapping from token ID to LocationProof
    mapping(uint256 => LocationProof) private _locationProofs;

    // Mapping from owner address to list of owned token IDs
    mapping(address => uint256[]) private _ownedTokens;

    event ProofResult(bool result);

    constructor(address plonkVerifierAddress) ERC721("ZKLocationProofToken", "ZKPT") {
        s_plonkVerifierAddress = plonkVerifierAddress;
    }

    // ZK proof is generated in the browser and submitted as a transaction w/ the proof as bytes.
    function submitProof(bytes memory proof, uint256[] memory pubSignals, string memory ipfsCid) public returns (bool) {
        bool result = IPlonkVerifier(s_plonkVerifierAddress).verifyProof(proof, pubSignals);
        emit ProofResult(result);

        uint256 tokenId = _tokenIdCounter;
        _locationProofs[tokenId] = LocationProof(ipfsCid, block.timestamp);
        _mint(msg.sender, tokenId);
        _ownedTokens[msg.sender].push(tokenId);

        _tokenIdCounter += 1;

        return result;
    }

    function getProof(uint256 tokenId) public view returns (LocationProof memory) {
        require(ownerOf(tokenId)!= address(0), "ZKLocationProofToken: Proof token does not exist.");
        return _locationProofs[tokenId];
    }

    function getOwnedProofs(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function getAllProofDetails(address owner) public view returns (LocationProof[] memory) {
        uint256[] memory tokenIds = getOwnedProofs(owner);
        LocationProof[] memory proofs = new LocationProof[](tokenIds.length);

        for (uint i = 0; i < tokenIds.length; i++) {
            proofs[i] = getProof(tokenIds[i]);
        }

        return proofs;
    }
}