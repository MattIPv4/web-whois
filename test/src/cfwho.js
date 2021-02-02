const assert = require('assert').strict;
const cfwhoLookup = require('../../src/cfwho');

module.exports = async () => {
    // cfwho does not support domains
    const resultDomain = await cfwhoLookup('digitalocean.com');
    assert.equal(resultDomain, false);

    // Data here is potentially fragile
    const resultIp = await cfwhoLookup('104.16.181.15');
    assert.deepEqual(resultIp, {
        name: 'CLOUDFLARENET, US',
        registrant: undefined,
        asn: '13335',
        registrar: undefined,
        registration: undefined,
        expiration: undefined,
        cidr: '104.16.176.0/20',
        abuse: 'abuse@cloudflare.com',
    });

    // cfwho does not support ASNs
    const resultAsn = await cfwhoLookup('13335');
    assert.equal(resultAsn, false);

    const resultRandom = await cfwhoLookup('this-is-not-a-valid-query');
    assert.equal(resultRandom, false);
};
