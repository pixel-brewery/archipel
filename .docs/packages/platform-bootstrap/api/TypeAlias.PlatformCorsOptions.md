---
title: 'Type Alias: PlatformCorsOptions'
generated: true
editUrl: false
---

# Type Alias: PlatformCorsOptions

```ts
type PlatformCorsOptions = Exclude<NestApplicationOptions['cors'], boolean | undefined>;
```

Defined in: [libs/platform-bootstrap/src/security/PlatformCorsOptions.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/PlatformCorsOptions.ts#L8)

CORS options accepted by the security bootstrap step.
