/**
 * @title Proof Verification Script
 * @author Anthony Spedaliere
 * @notice Script to verify a ZK proof using the deployed PlonkVerifier contract from Verifier_c1.sol
 * @dev Uses proof data from snarkjs generatecall to verify a proof on-chain
 */

const { ethers } = require("hardhat");

async function main() {
  // Get the deployed verifier contract address
  const VERIFIER_ADDRESS = "0x52E06dE9C1E02e82F7667d6c4bc36E6BE15c6Cad";

  // Get the verifier contract instance
  const verifier = await ethers.getContractAt(
    "PlonkVerifier",
    VERIFIER_ADDRESS
  );

  // Basic check to see if we can read from the contract
  console.log("Checking contract connection...");
  try {
    const code = await ethers.provider.getCode(VERIFIER_ADDRESS);
    if (code === "0x") {
      throw new Error("No contract code found at address");
    }
    console.log("Contract code found at address");
  } catch (error) {
    console.error("Error checking contract:", error);
    process.exit(1);
  }

  console.log("Calling verifyProof on contract:", VERIFIER_ADDRESS);

  // Proof data from snarkjs generatecall
  const proofInputs = [
    // A
    "0x07c58f7e5086788c6648832cc809a3b837b6810e591e8c563be24b77609f0964", // A[0]
    "0x27df3ad051393466ec4757b35a916095c26e0c119e7b8f2ca71b9571a22aa2be", // A[1]
    // B
    "0x2c8706d9b683526429dc11f660eebb6bd1da20c8432933c8b0b0ca9e6aee79f4", // B[0]
    "0x2e094b368d77f2214471dbd14a39fc02052652b14f1ba85b9b69b0278536d919", // B[1]
    // C
    "0x1a51225ba523379d6c6031bdd5435ac4b5c8aebe2b94cf42beace52b9fe9d1b5", // C[0]
    "0x2b2332e706e0d89987ad20038273291056421e6ef371bcced923873946c438f9", // C[1]
    // Z
    "0x134749bbd06a95fcf31a1349803c5a2ea415c0e938deba75007c01fc740685b4", // Z[0]
    "0x298b4b789d920b8ba67b9bcdfe404beb79f04a564a2d38ee8d8a718c7bb822be", // Z[1]
    // T1
    "0x045997ccfb87ba40aa8bd51dd7bdd8cc6fd2439b9f5cb4c2f57f37192561acdb", // T1[0]
    "0x149d9a2743735b746071aedcc099368491861b568c4fff4514807d212fd79194", // T1[1]
    // T2
    "0x0845a35694cb35f356de7785748b541e83b0d0e12c13ba4129307fbedb81546b", // T2[0]
    "0x0187f896933035e409f48bab03b7edd52e0eeeb6176bf71ebd5b1ed2f7b3ae12", // T2[1]
    // T3
    "0x0032183de541c4de3f3eacc5d57e4c4a683e8968dd3ad1ba0cff40c8bc118aa0", // T3[0]
    "0x25a8fd09373b56b076e167389915b7c1e2a4926ba805017680275a7a8f2a6aed", // T3[1]
    // Wxi
    "0x04dbdd8f532dc1e672eed8ad90ded1bbf017475aa80c41a05a37e932b5b4e298", // Wxi[0]
    "0x2893fe829e9cb2f9ae6aaadb51068ec78335ea10108d83af03e919e41f2b95a9", // Wxi[1]
    // Wxiw
    "0x2bb28ee5d456261f827006cd792a2dbc8e1a8699bb9b1389b3eebc49b68a3b8c", // Wxiw[0]
    "0x298c2acb860ef5e0bc88986060e75287e37a34022da1fc3101c8b9926aad7654", // Wxiw[1]
    // eval_a, eval_b, eval_c, eval_s1, eval_s2, eval_zw
    "0x1208976084f990d337cd3a16c6d1facd644d7a8544c37f994cc5b4901b177553", // eval_a
    "0x23a5195e73ef0ad0544b7becf8f10935c5a6f0932fd6a6e9fe891d9d7c52c770", // eval_b
    "0x0f9913e2d8d2f7edfdcea5d28a9c7f51a5e49cc4107221334c8ba3fa5a223ed8", // eval_c
    "0x0d4b48d737dcc48f948463b7d611dd48df0ece1e24a6e1261f89c71a5bfd5529", // eval_s1
    "0x07140e02eeef0096823c5dcfe94ed53a9d71224f199170e4dcc4d1e8cd2182a2", // eval_s2
    "0x178ac052b3eb4e5b0362c708d6626a3ab69d26dcc73ef77bd60e6ee4793a7b0b", // eval_zw
  ];

  const publicInputs = [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x1a37baa8fbeaec4ea12d2207c20faece2531fcf10eeb8923554b7c1237dd2c34",
  ];

  // Call verifyProof function
  console.log("Verifying proof...");
  const result = await verifier.verifyProof(proofInputs, publicInputs);

  console.log("Proof verification result:", result);

  if (result) {
    console.log("✅ Proof is valid!");
  } else {
    console.log("❌ Proof is invalid!");
  }

  return result;
}

// Execute the verification
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
