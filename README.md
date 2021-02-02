# web-whois

Perform RDAP/WHOIS lookups over HTTP

---

The package will attempt to use RDAP data primarily, and will return this if it finds results.
Failing that, it will then perform a standard WHOIS lookup and parse limited results from that.

The second argument of the method can be set to `true` to indicate that the package should perform
 both lookups and combine the results, with the RDAP data being preferred.

```javascript
const lookup = require('web-whois');

const data = lookup('digitalocean.com');
console.log(data);
```

```javascript
{
    name: undefined,
    registrant: undefined,
    asn: undefined,
    registrar: 'Network Solutions, LLC',
    registration: 2000-04-12T10:36:48.000Z,
    expiration: 2023-04-12T10:36:48.000Z,
    cidr: undefined,
    abuse: 'abuse@web.com'
}
```

```javascript
const lookup = require('web-whois');

const data = lookup('104.16.181.15');
console.log(data);
```

```javascript
{
    name: 'CLOUDFLARENET',
    registrant: 'Cloudflare, Inc.',
    asn: '13335',
    registrar: undefined,
    registration: 2014-03-28T15:30:55.000Z,
    expiration: undefined,
    cidr: '104.16.0.0/12',
    abuse: 'abuse@cloudflare.com'
}
```
