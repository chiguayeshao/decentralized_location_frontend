pragma circom 2.1.3;

include "../node_modules/circomlib/circuits/comparators.circom";

// Summarize the input signals into a single output signal
// The input signals are:
// in[0] - longitude
// in[1] - min longitude
// in[2] - max longitude
// in[3] - latitude
// in[4] - min latitude
// in[5] - max latitude
// The output signal is the sum of longitude and latitude

template SimpleSummarizer() {
    // Private input signals
    signal input in[6];

    // Output signal (public)
    signal output out;

    // Define the greater than and less than components that we'll be using bellow
    component gte[2];
    component lte[2];

    // Define the constraints for longitude in[0]
    // in[0] must be between in[1] and in[2]
    // min value is 0 and max value has 29 bits
    gte[0] = GreaterEqThan(29);
    gte[0].in[0] <== in[0];
    gte[0].in[1] <== in[1];

    gte[0].out === 1;

    lte[0] = LessEqThan(29);
    lte[0].in[0] <== in[0];
    lte[0].in[1] <== in[2];

    lte[0].out === 1;

    // Define the constraints for latitude in[3]
    // in[3] must be between in[4] and in[5]
    // min value is 0 and max value has 29 bits
    gte[1] = GreaterEqThan(29);
    gte[1].in[0] <== in[3];
    gte[1].in[1] <== in[4];

    gte[1].out === 1;

    lte[1] = LessEqThan(29);
    lte[1].in[0] <== in[3];
    lte[1].in[1] <== in[5];

    lte[1].out === 1;

    // Write a + b into c and then constrain c to be equal to a + b.
    out <== in[0] + in[3];
}

component main = SimpleSummarizer();
