const fetch = require('node-fetch');
const { consistentResultObj, consistentResult } = require('./util');

const normalizeKey = text => `${text}`.toLowerCase().trim().replace(/[-_]/g, ' ');
const normalizeValue = text => `${text}`.trim();

const parseWhois = text => {
    // RegExp parts
    const reLinebreak = '\\r\\n';
    const reWhitespace = `[^\\S${reLinebreak}]`;
    const reKeyColon = '([a-zA-Z\\-\\s]+):';
    const reKeyBrackets = '\\[([a-zA-Z\\-\\s登録年月日有効期限]+)\\]';
    const reKey = `(${reKeyColon}|${reKeyBrackets})`;
    const reText = `([^\\s${reLinebreak}][^${reLinebreak}]*)`;
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
            key: normalizeKey(match[2] || match[3]),
            value: normalizeValue(match[4]),
        });
    }

    // Split line matches that don't include a single line match are valid
    for (const rawMatch of splitLineMatches) {
        if (singleLineMatches.map(singleLineMatch => rawMatch.includes(singleLineMatch)).includes(true))
            continue;

        const match = rawMatch.trim().match(regExpSplitLine);
        matches.push({
            key: normalizeKey(match[2] || match[3]),
            value: normalizeValue(match[4]),
        });
    }

    // Return the final parsed data
    return matches;
};

// Find an attribute value from the WHOIS data
const findAttribute = (names, data) => {
    for (const name of names) {
        const entry = data.find(entry => entry.key === name);
        if (entry && entry.value) return entry.value;
    }
};

// Find a JS Date for an attribute from the WHOIS data
const findAttributeDate = (names, data) => {
    const attribute = findAttribute(names, data);
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
        registrant: findAttribute(['registrant'], data),
        registrar: findAttribute(['registrar', 'organisation'], data),
        registration: findAttributeDate(['creation date', 'created', 'registered on', '登録年月日'], data),
        expiration: findAttributeDate(['registry expiry date', 'expiry date', '有効期限'], data),
        abuse: findAttribute(['registrar abuse contact email'], data),
    });

    // Done
    return consistentResult(result);
};
