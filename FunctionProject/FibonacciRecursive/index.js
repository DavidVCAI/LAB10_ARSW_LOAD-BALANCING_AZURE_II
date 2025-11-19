var bigInt = require("big-integer");

// Memoization cache (in-memory)
const memo = {};

function fibonacciRecursive(n) {
    // Check if value is already in cache
    if (memo[n] !== undefined) {
        return memo[n];
    }

    // Base cases
    if (n === 0) {
        return bigInt.zero;
    }
    if (n === 1) {
        return bigInt.one;
    }

    // Recursive calculation with memoization
    memo[n] = fibonacciRecursive(n - 1).add(fibonacciRecursive(n - 2));
    return memo[n];
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request (Recursive with Memoization).');

    let nth = req.body.nth;

    if (nth === undefined || nth === null) {
        context.res = {
            status: 400,
            body: "Please provide 'nth' parameter in the request body"
        };
        return;
    }

    if (nth < 0) {
        context.res = {
            status: 400,
            body: "nth must be greater than or equal to 0"
        };
        return;
    }

    try {
        const cacheSize = Object.keys(memo).length;
        context.log(`Cache size before calculation: ${cacheSize} entries`);

        const answer = fibonacciRecursive(nth);

        const newCacheSize = Object.keys(memo).length;
        context.log(`Cache size after calculation: ${newCacheSize} entries`);

        context.res = {
            body: {
                result: answer.toString(),
                cacheHit: cacheSize > 0 && memo[nth] !== undefined,
                cacheSize: newCacheSize
            }
        };
    } catch (error) {
        context.log.error('Error calculating Fibonacci:', error);
        context.res = {
            status: 500,
            body: `Error calculating Fibonacci: ${error.message}`
        };
    }
};
