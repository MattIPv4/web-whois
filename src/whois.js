const fetch = require('node-fetch');
const { consistentResultObj } = require('./util');

const parseWhois = text => {
    // RegExp parts
    const reLinebreak = '\\r\\n';
    const reWhitespace = `[^\\S${reLinebreak}]`;
    const reKey = '([a-zA-Z\\s]+):';
    const reText = `([^${reLinebreak}]+)`;
    const reLineStart = `^${reWhitespace}*${reKey}`;
    const reLineEnd = `${reWhitespace}+${reText}$`;

    // The RegExps to be used
    const reSingleLine = `${reLineStart}${reLineEnd}`;
    const regExpSingleLineGm = new RegExp(reSingleLine, 'gm');
    const regExpSingleLine = new RegExp(reSingleLine);
    const reSplitLine = `${reLineStart}[${reLinebreak}]+${reLineEnd}`;
    const regExpSplitLineGm = new RegExp(reSplitLine, 'gm');
    const regExpSplitLine = new RegExp(reSplitLine);

    // Find the matches in the string
    const singleLineMatches = text.match(regExpSingleLineGm) || [];
    const splitLineMatches = text.match(regExpSplitLineGm) || [];
    const matches = [];

    // All single line matches are valid
    for (const rawMatch of singleLineMatches) {
        const match = rawMatch.trim().match(regExpSingleLine);
        matches.push({
            key: match[1],
            value: match[2],
        });
    }

    // Split line matches that don't include a single line match are valid
    for (const rawMatch of splitLineMatches) {
        if (singleLineMatches.map(singleLineMatch => rawMatch.includes(singleLineMatch)).includes(true))
            continue;

        const match = rawMatch.trim().match(regExpSplitLine);
        matches.push({
            key: match[1],
            value: match[2],
        });
    }

    // Return the final parsed data
    return matches;
};

// Find an attribute value from the WHOIS data
const findAttribute = (name, data) => {
    const entry = data.find(entry => entry.key.trim().toLowerCase() === name);
    return entry && entry.value && `${entry.value}`.trim();
};

// Find a JS Date for an attribute from the WHOIS data
const findAttributeDate = (name, data) => {
    const attribute = findAttribute(name, data);
    if (!attribute) return;
    return new Date(attribute);
};

module.exports = async query => {
    const resp = await fetch(`https://whoisjs.com/api/v1/${query}`);
    const rawData = await resp.json().catch(() => false);

    // Ensure the data is there
    if (!rawData || !rawData.success || !rawData.raw)
        return false;

    // Parse ourselves
    const data = parseWhois(rawData.raw);
    if (!data)
        return false;

    // Find the useful information for us
    const result = consistentResultObj({
        registrant: findAttribute('registrant', data),
        registrar: findAttribute('registrar', data) || findAttribute('organisation', data),
        registration: findAttributeDate('creation date', data) || findAttributeDate('registered on', data),
        expiration: findAttributeDate('registry expiry date', data) || findAttributeDate('expiry date', data),
        abuse: findAttribute('registrar abuse contact email', data),
    });

    // Return false if we found nothing, otherwise return the data
    return Object.values(result).every(x => x === undefined) ? false : result;
};
