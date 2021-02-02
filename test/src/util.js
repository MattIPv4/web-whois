const assert = require('assert').strict;
const { consistentResultObj } = require('../../src/util');

module.exports = () => {
    // Always returns an object
    const falseInput = consistentResultObj(false);
    assert.equal(typeof falseInput, 'object');
    assert.notEqual(falseInput, null);

    // Drops extra keys
    const randomKeyInput = consistentResultObj({ hello: 'world' });
    assert(!Object.keys(randomKeyInput).includes('hello'));

    // Adds the keys we expect
    const emptyInput = consistentResultObj({});
    assert.deepEqual(Object.keys(emptyInput), [
        'name',
        'registrant',
        'asn',
        'registrar',
        'registration',
        'expiration',
        'cidr',
        'abuse',
    ]);

    // And, they all default to undefined
    assert(Object.values(emptyInput).every(val => val === undefined));
};
