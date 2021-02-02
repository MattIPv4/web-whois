const rdapLookup = require('./rdap');
const whoisLookup = require('./whois');

module.exports = async (query, combine = false) => {
    // Do the RDAP lookup
    const rdap = await rdapLookup(query);

    // If we have RDAP data and don't need to combine, return it
    if (rdap && !combine) return rdap;

    // Doo the WHOIS lokkup
    const whois = await whoisLookup(query);

    // Combine if we can and need to (preferring RDAP)
    if (combine && (rdap || whois)) return { ...(whois || {}), ...(rdap || {}) };

    // Return just the WHOIS data
    return whois;
};
