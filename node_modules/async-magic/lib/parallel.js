// resolves multiple promises in parallel
async function parallel(resolvers, limit=-1){
    // set default limit
    if (limit < 1){
        limit = 1000;
    }

    // buffer
    const results = [];

    // calculate chunk size
    // limit step size to input array size
    const chunkSize = Math.min(limit, resolvers.length);

    // process resolvers in chunks
    for (let i=0;i<resolvers.length;i=i+chunkSize){

        // extract current chunk
        const chunk = resolvers.slice(i, Math.min(i+chunkSize, resolvers.length));

        // resolve current chunk
        const intermediateResults = await Promise.all(chunk.map((r) => r.resolve()));

        // push results into buffer
        results.push(...intermediateResults);
    }

    // return results
    return results;
}

module.exports = parallel;