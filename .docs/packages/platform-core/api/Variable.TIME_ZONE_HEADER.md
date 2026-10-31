---
title: 'Variable: TIME\_ZONE\_HEADER'
generated: true
editUrl: false
---

# Variable: TIME\_ZONE\_HEADER

```ts
const TIME_ZONE_HEADER: 'X-Time-Zone' = 'X-Time-Zone';
```

Defined in: [libs/platform-core/src/decorators/TimeZone.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/decorators/TimeZone.ts#L15)

Request header through which a client announces its IANA time zone, for example `Europe/Berlin`.

Browser applications send it with every API request so the server can resolve "today" and local times for the
current user. Allow it in the CORS `allowedHeaders` of cross-origin deployments.
