# web-whois

Perform RDAP/WHOIS lookups over HTTP

---

The package will attempt to perform an RDAP lookup of the query, as well as a WHOIS lookup and a
 call to the cfwho service for the query. These results are then combined, preferring data from
 RDAP, WHOIS and then cfwho.

The second argument of the method can be set to `true` to indicate that the package should return
 the first set of results that it finds, without performing any combining.

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
