const assert = require('assert').strict;
const whoisLookup = require('../../src/whois');

module.exports = async () => {
    // Data here is potentially fragile
    const resultDomain = await whoisLookup('digitalocean.com');
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

    const resultJpDomain = await whoisLookup('jprs.jp');
    assert.deepEqual(resultJpDomain, {
        name: undefined,
        registrant: 'Japan Registry Services Co.,Ltd.',
        asn: undefined,
        registrar: undefined,
        registration: new Date('2001-02-02T00:00:00+09:00'),
        expiration: new Date('2025-02-28T00:00:00+09:00'),
        cidr: undefined,
        abuse: undefined,
    });

    // WHOISJS does not support IPs
    const resultIp = await whoisLookup('104.16.181.15');
    assert.equal(resultIp, false);

    // WHOISJS does not support ASNs
    const resultAsn = await whoisLookup('13335');
    assert.equal(resultAsn, false);

    const resultRandom = await whoisLookup('this-is-not-a-valid-query');
    assert.equal(resultRandom, false);
};
