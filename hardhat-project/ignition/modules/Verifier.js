/**
 * @title Verifier Ignition Module
 * @author Anthony Spedaliere
 * @notice Ignition module for deploying Verifier_c1.sol
 * @dev This module deploys the verifier contract that validates zk-SNARK proofs
 */

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VerifierModule", (m) => {
  const verifier = m.contract("PlonkVerifier");

  return {
    verifier,
  };
});
