const rdapTest = require('./src/rdap');
const whoisTest = require('./src/whois');
const cfwhoTest = require('./src/cfwho');
const utilTest = require('./src/util');

const main = async () => {
    await rdapTest();
    await whoisTest();
    await cfwhoTest();
    utilTest();
};

main();
