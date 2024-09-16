const assert = require('assert').strict;
const rdapLookup = require('../../src/rdap');

module.exports = async () => {
    // Data here is potentially fragile
    const resultDomain = await rdapLookup('digitalocean.com');
    assert.deepEqual(resultDomain, {
        name: undefined,
        registrant: undefined,
        asn: undefined,
        registrar: 'Network Solutions, LLC',
        registration: new Date('2000-04-12T10:36:48.000Z'),
        expiration: new Date('2028-04-12T10:36:48.000Z'),
        cidr: undefined,
        abuse: 'domain.operations@web.com',
    });

    // Data here is potentially fragile
    const resultIp = await rdapLookup('104.16.181.15');
    assert.deepEqual(resultIp, {
        name: 'CLOUDFLARENET',
        registrant: 'Cloudflare, Inc.',
        asn: '13335',
        registrar: undefined,
        registration: new Date('2014-03-28T15:30:55.000Z'),
        expiration: undefined,
        cidr: '104.16.0.0/12',
        abuse: 'abuse@cloudflare.com',
    });

    // Data here is potentially fragile
    const resultAsn = await rdapLookup('13335');
    assert.deepEqual(resultAsn, {
        name: 'CLOUDFLARENET',
        registrant: 'Cloudflare, Inc.',
        asn: undefined,
        registrar: undefined,
        registration: new Date('2010-07-14T22:35:57.000Z'),
        expiration: undefined,
        cidr: undefined,
        abuse: 'abuse@cloudflare.com',
    });

    const resultRandom = await rdapLookup('this-is-not-a-valid-query');
    assert.equal(resultRandom, false);
};
