# Zero-Knowledge Membership Circuit

This project implements a zero-knowledge membership circuit using Circom and Hardhat. The circuit allows users to prove membership in a Merkle tree without revealing their specific leaf value or the path to it.

## Overview

The membership circuit (`MembershipInclusion.circom`) implements a zero-knowledge proof system that verifies whether a given leaf exists in a Merkle tree. The circuit uses the Poseidon hash function for efficient hashing operations and implements a secure membership verification protocol.

### Key Features

- Zero-knowledge proof of membership in a Merkle tree
- Uses Poseidon hash function for efficient hashing
- Implements secure path verification
- Supports configurable tree depth (default: 5 levels)
- On-chain verification through a Solidity smart contract

## Circuit Details

The circuit takes the following inputs:

- `root`: The Merkle root of the tree
- `leaf`: The leaf value to verify (private)
- `pathElements`: Array of sibling hashes along the path (private)
- `pathIndices`: Array of binary values indicating the position (left/right) of each path element (private)

The circuit outputs:

- `isMember`: Boolean indicating whether the leaf exists in the tree

### Implementation Details

The circuit uses a Poseidon hash function for each level of the tree and implements secure path verification through quadratic constraints. The verification process:

1. Starts with the leaf value
2. For each level:
   - Computes the hash of the current node with its sibling
   - Uses path indices to determine the order of hashing
   - Advances up the tree
3. Compares the final hash with the provided root
4. Outputs true if they match, false otherwise

## Project Structure

```
.
├── MembershipInclusion.circom    # Main circuit implementation
├── Verifier.sol                  # Solidity verifier contract
├── hardhat-project/             # Hardhat project for deployment
│   ├── contracts/               # Smart contracts
│   ├── scripts/                 # Deployment and verification scripts
│   └── test/                    # Test files
├── circomlib/                   # Circom standard library
├── proof.json                   # Generated proof
├── public.json                  # Public inputs
└── verification_key.json        # Verification key
```

## Usage

### Prerequisites

- Node.js and npm
- Circom 2.2.2 or later
- Hardhat

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Compiling the Circuit

```bash
circom MembershipInclusion.circom --r1cs --wasm --sym
```

### Generating and Verifying Proofs

1. Generate a witness:

```bash
node MembershipInclusion_js/generate_witness.js MembershipInclusion_js/MembershipInclusion.wasm input.json witness.wtns
```

2. Generate a proof:

```bash
snarkjs plonk prove MembershipInclusion_0000.zkey witness.wtns proof.json public.json
```

3. Verify the proof:

```bash
snarkjs plonk verify verification_key.json public.json proof.json
```

### On-Chain Verification

The project includes a Hardhat setup for deploying and interacting with the verifier contract:

1. Navigate to the hardhat project:

```bash
cd hardhat-project
```

2. Deploy the verifier:

```bash
npx hardhat run scripts/deploy.js --network <network>
```

3. Verify the proof on-chain:

```bash
npx hardhat run scripts/verify-proof.js --network <network>
```

## Security Considerations

- The circuit uses the Poseidon hash function, which is designed for zero-knowledge applications
- All private inputs (leaf, path) are kept confidential
- The circuit implements secure path verification through quadratic constraints
- The implementation follows best practices for zero-knowledge circuit design

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Circom team for the circuit language and tools
- 0xPARC for the circomlib library
- The zero-knowledge proof community for research and development
