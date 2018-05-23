// resolves multiple promises in series
async function series(resolvers){
    // buffer
    const results = [];

    // run resolvers in series
    for (const r of resolvers){
        results.push(await r.resolve());
    }

    // return results
    return results;
}

module.exports = series;