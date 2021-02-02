module.exports.consistentResultObj = data => ({
    name:           data.name           || undefined,
    registrant:     data.registrant     || undefined,
    asn:            data.asn            || undefined,
    registrar:      data.registrar      || undefined,
    registration:   data.registration   || undefined,
    expiration:     data.expiration     || undefined,
    cidr:           data.cidr           || undefined,
    abuse:          data.abuse          || undefined,
});
