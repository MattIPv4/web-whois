// Unique values in an array, comma-separated
module.exports.uniqueCommaSep = arr => [...new Set(arr)].join(', ');

const trimmed = item => item && `${item}`.trim();

// Consistent keys for the response from the package
module.exports.consistentResultObj = data => ({
    name:           trimmed(data.name)          || undefined,
    registrant:     trimmed(data.registrant)    || undefined,
    asn:            trimmed(data.asn)           || undefined,
    registrar:      trimmed(data.registrar)     || undefined,
    registration:   data.registration           || undefined,
    expiration:     data.expiration             || undefined,
    cidr:           trimmed(data.cidr)          || undefined,
    abuse:          trimmed(data.abuse)         || undefined,
});

// If we found nothing, the package returns false
module.exports.consistentResult = data => Object.values(data).every(x => x === undefined) ? false : data;
