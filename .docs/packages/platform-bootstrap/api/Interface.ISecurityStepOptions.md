---
title: 'Interface: ISecurityStepOptions'
generated: true
editUrl: false
---

# Interface: ISecurityStepOptions

Defined in: [libs/platform-bootstrap/src/security/ISecurityStepOptions.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/ISecurityStepOptions.ts#L11)

Options for the generic security bootstrap step.

## Properties

### contentSecurityPolicy?

```ts
readonly contentSecurityPolicy?:
  | boolean
  | PlatformContentSecurityPolicyMode
  | ContentSecurityPolicyOptions;
```

Defined in: [libs/platform-bootstrap/src/security/ISecurityStepOptions.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/ISecurityStepOptions.ts#L19)

Content-security-policy mode used when Helmet is enabled.

---

### cors?

```ts
readonly cors?: boolean | PlatformCorsOptions;
```

Defined in: [libs/platform-bootstrap/src/security/ISecurityStepOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/ISecurityStepOptions.ts#L13)

CORS options, or `false` to skip CORS setup.

---

### headers?

```ts
readonly headers?: boolean | HelmetOptions;
```

Defined in: [libs/platform-bootstrap/src/security/ISecurityStepOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/ISecurityStepOptions.ts#L16)

Helmet options, or `false` to skip security headers.

---

### rateLimit?

```ts
readonly rateLimit?:
  | boolean
  | SecurityRateLimitOptions;
```

Defined in: [libs/platform-bootstrap/src/security/ISecurityStepOptions.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/ISecurityStepOptions.ts#L22)

Rate-limit options, or `false` to skip rate limiting.
