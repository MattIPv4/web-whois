const fetch = require('node-fetch');
const { uniqueCommaSep, consistentResultObj, consistentResult } = require('./util');

const findAbuseEmail = data => {
    const abuse = data.contacts && data.contacts.abuse;
    if (!abuse || !Array.isArray(abuse)) return;
    return uniqueCommaSep(data.contacts.abuse);
};

module.exports = async query => {
    const resp = await fetch(`https://cfwho.com/api/v1/${query}`);
    const rawData = await resp.json().catch(() => false);
    const data = rawData && rawData[query];

    // Ensure the data is there
    if (!data || !data.success)
        return false;

    // Find the useful information for us
    const result = consistentResultObj({
        name: data.netname,
        asn: data.asn,
        cidr: data.network,
        abuse: findAbuseEmail(data),
    });

    // Done
    return consistentResult(result);
};
