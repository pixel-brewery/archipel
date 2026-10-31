---
title: 'Type Alias: SecurityRateLimitOptions'
generated: true
editUrl: false
---

# Type Alias: SecurityRateLimitOptions

```ts
type SecurityRateLimitOptions = Partial<RateLimitOptions> & {
    fallbackLimit?: number;
    fallbackWindowMs?: number;
    limitConfigKey?: IConfigKey<string | number | undefined>;
    windowMsConfigKey?: IConfigKey<string | number | undefined>;
};
```

Defined in: [libs/platform-bootstrap/src/security/SecurityRateLimitOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/SecurityRateLimitOptions.ts#L9)

Rate-limit options accepted by the security bootstrap step.

## Type Declaration

| Name                 | Type                                                | Description                                         | Defined in                                                                                                                                                                                      |
| -------------------- | --------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fallbackLimit?`     | `number`                                            | Fallback request limit.                             | [libs/platform-bootstrap/src/security/SecurityRateLimitOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/SecurityRateLimitOptions.ts#L20) |
| `fallbackWindowMs?`  | `number`                                            | Fallback rate-limit window in milliseconds.         | [libs/platform-bootstrap/src/security/SecurityRateLimitOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/SecurityRateLimitOptions.ts#L17) |
| `limitConfigKey?`    | `IConfigKey`\<`string` \| `number` \| `undefined`\> | Config key used for the request limit.              | [libs/platform-bootstrap/src/security/SecurityRateLimitOptions.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/SecurityRateLimitOptions.ts#L14) |
| `windowMsConfigKey?` | `IConfigKey`\<`string` \| `number` \| `undefined`\> | Config key used for the rate-limit window duration. | [libs/platform-bootstrap/src/security/SecurityRateLimitOptions.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/SecurityRateLimitOptions.ts#L11) |
