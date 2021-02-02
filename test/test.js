const rdapTest = require('./src/rdap');
const whoisTest = require('./src/whois');
const utilTest = require('./src/util');

const main = async () => {
    await rdapTest();
    await whoisTest();
    utilTest();
};

main();
