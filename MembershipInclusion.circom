pragma circom 2.2.2;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

template MembershipInclusion(treeLevels) {
    signal input root;
    signal input leaf;
    signal input pathElements[treeLevels];
    signal input pathIndices[treeLevels];
    signal output isMember;

    // Internal state
    signal currentHash[treeLevels + 1];
    component hashers[treeLevels];

    // New temporaries for safe quadratic splits
    signal isLeft[treeLevels];
    signal isRight[treeLevels];
    signal leftTerm1[treeLevels];
    signal leftTerm2[treeLevels];
    signal rightTerm1[treeLevels];
    signal rightTerm2[treeLevels];

    // Initialize
    currentHash[0] <== leaf;

    for (var i = 0; i < treeLevels; i++) {
        // Instantiate a 2-input Poseidon hash for this layer
        hashers[i] = Poseidon(2);

        // Boolean flags
        isLeft[i]  <== 1 - pathIndices[i];
        isRight[i] <== pathIndices[i];

        // Compute left input in two quadratic steps:
        //   leftTerm1 = isLeft * currentHash[i]
        //   leftTerm2 = isRight * pathElements[i]
        //   hashers[i].inputs[0] = leftTerm1 + leftTerm2
        leftTerm1[i] <== isLeft[i]  * currentHash[i];
        leftTerm2[i] <== isRight[i] * pathElements[i];
        hashers[i].inputs[0] <== leftTerm1[i] + leftTerm2[i];

        // Compute right input in two quadratic steps:
        //   rightTerm1 = isLeft * pathElements[i]
        //   rightTerm2 = isRight * currentHash[i]
        //   hashers[i].inputs[1] = rightTerm1 + rightTerm2
        rightTerm1[i] <== isLeft[i]  * pathElements[i];
        rightTerm2[i] <== isRight[i] * currentHash[i];
        hashers[i].inputs[1] <== rightTerm1[i] + rightTerm2[i];

        // Feed into Poseidon, advance to next hash
        currentHash[i + 1] <== hashers[i].out;
    }

    // Final equality check
    component eq = IsEqual();
    eq.in[0] <== currentHash[treeLevels];
    eq.in[1] <== root;
    isMember <== eq.out;

}

component main {public [root]} = MembershipInclusion(5);