const rdapLookup = require('./rdap');
const whoisLookup = require('./whois');
const cfwhoLookup = require('./cfwho');
const { consistentResultObj, consistentResult } = require('./util');

const combineResults = dataArr => {
    const result = {};
    for (const data of dataArr)
        for (const key of data)
            if (data[key] && !result[key]) result[key] = data[key];
    return consistentResult(consistentResultObj(result));
};

module.exports = async (query, first = false) => {
    // Do the RDAP lookup
    const rdap = await rdapLookup(query);

    // If we have RDAP data and want just the first, return it
    if (rdap && first) return rdap;

    // Do the WHOIS lokkup
    const whois = await whoisLookup(query);

    // If we have WHOIS data and want just the first, return it
    if (whois && first) return whois;

    // Do the cfwho lokkup
    const cfwho = await cfwhoLookup(query);

    // If we have cfwho data and want just the first, return it
    if (cfwho && first) return cfwho;

    // Combine the results (preferring RDAP, WHOIS, then cfwho)
    return combineResults([rdap, whois, cfwho]);
};
