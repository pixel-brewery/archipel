---
title: 'Interface: IPlatformListenOptions'
generated: true
editUrl: false
---

# Interface: IPlatformListenOptions

Defined in: [libs/platform-bootstrap/src/options/IPlatformListenOptions.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/options/IPlatformListenOptions.ts#L8)

Options for resolving the HTTP listen port from typed configuration keys.

## Properties

### fallbackPort?

```ts
readonly fallbackPort?: number;
```

Defined in: [libs/platform-bootstrap/src/options/IPlatformListenOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/options/IPlatformListenOptions.ts#L13)

Fallback port used when none of the configured keys are present.

---

### hostname?

```ts
readonly hostname?: string;
```

Defined in: [libs/platform-bootstrap/src/options/IPlatformListenOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/options/IPlatformListenOptions.ts#L16)

Optional hostname/interface binding passed to NestJS `listen`.

---

### portConfigKeys?

```ts
readonly portConfigKeys?: readonly IConfigKey<string | number | undefined>[];
```

Defined in: [libs/platform-bootstrap/src/options/IPlatformListenOptions.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/options/IPlatformListenOptions.ts#L10)

Ordered list of port config keys. The first present value wins.
