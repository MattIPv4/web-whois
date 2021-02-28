const fetch = require('node-fetch');
const { uniqueCommaSep, consistentResultObj, consistentResult } = require('./util');

// Find RDAP data entities that match a name
const findEntities = (name, data) => data.entities && data.entities.filter(entity =>
    entity.roles && entity.roles.map(role => role.trim().toLowerCase()).includes(name));

// Find a specific vcard for an RDAP entity
const entityVcard = (entity, vcard) => {
    if (entity && entity.vcardArray && Array.isArray(entity.vcardArray) && entity.vcardArray.length > 1) {
        const entityFn = entity.vcardArray[1].find(card => card[0] === vcard);
        if (entityFn && Array.isArray(entityFn) && entityFn.length > 3) return entityFn[3];
    }
};

// Find a vcard name/handle for an RDAP entity
const findEntityName = (name, data) => {
    const entities = findEntities(name, data);
    if (!entities) return;

    return uniqueCommaSep(entities.map(entity => entityVcard(entity, 'fn') || (entity && entity.handle)) || []);
};

// Find a vcard email address for an RDAP entity
const findEntityEmail = (name, data) => {
    const entities = findEntities(name, data);
    if (!entities) return;

    return uniqueCommaSep(entities.map(entity => entityVcard(entity, 'email')) || []);
};

// Get a JS Date for a specific RDAP data event
const findEventDate = (name, data) => {
    if (!data.events) return;
    const event = data.events.find(event => event.eventAction.trim().toLowerCase() === name);
    if (!event || !event.eventDate) return;
    return new Date(event.eventDate);
};

// Find the ASN information from the RDAP data
const findAsn = data => uniqueCommaSep((data.arin_originas0_originautnums || []).map(asn => asn.toString()));

// Format RDAP CIDR data
const formatCidr = cidr => cidr && (cidr.v4prefix || cidr.v6prefix) && cidr.length
    ? (cidr.v4prefix || cidr.v6prefix) + '/' + cidr.length.toString()
    : undefined;

// Find the CIDR blocks from the RDAP data
const findCidr = data => uniqueCommaSep((data.cidr0_cidrs || []).map(formatCidr).filter(cidr => cidr !== undefined));

// Find the abuse email in the RDAP data
const findAbuseEmail = data => {
    const directAbuse = findEntityEmail('abuse', data);
    if (directAbuse) return directAbuse;

    const registrarEntities = findEntities('registrar', data);
    if (!registrarEntities) return;

    return findEntityEmail('abuse', {
        entities: registrarEntities.map(entity => entity.entities).flat(1).filter(entity => entity !== undefined),
    });
};

module.exports = async query => {
    const resp = await fetch(`https://rdap.cloud/api/v1/${query}`);
    const rawData = await resp.json().catch(() => false);
    const data = rawData && rawData.results && rawData.results[query];

    // Ensure the data is there
    if (!data || !data.success || !data.data)
        return false;

    // Find the useful information for us
    const result = consistentResultObj({
        name: data.data.name,
        registrant: findEntityName('registrant', data.data),
        asn: findAsn(data.data),
        registrar: findEntityName('registrar', data.data),
        registration: findEventDate('registration', data.data),
        expiration: findEventDate('expiration', data.data),
        cidr: findCidr(data.data),
        abuse: findAbuseEmail(data.data),
    });

    // Done
    return consistentResult(result);
};
