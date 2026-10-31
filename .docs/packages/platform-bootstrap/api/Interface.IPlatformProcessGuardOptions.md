---
title: 'Interface: IPlatformProcessGuardOptions'
generated: true
editUrl: false
---

# Interface: IPlatformProcessGuardOptions

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcessGuardOptions.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcessGuardOptions.ts#L10)

Options for installing a `PlatformProcessGuard`.

## Properties

### flushTimeoutMs?

```ts
readonly flushTimeoutMs?: number;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcessGuardOptions.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcessGuardOptions.ts#L18)

Upper bound in milliseconds for flushing stdout and stderr before a fatal exit. Defaults to `1000`.

---

### logger?

```ts
readonly logger?: LoggerService;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcessGuardOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcessGuardOptions.ts#L12)

Logger that receives fatal reports. Defaults to a NestJS `Logger` with the `Process` context.

---

### process?

```ts
readonly process?: IPlatformProcess;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcessGuardOptions.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcessGuardOptions.ts#L21)

Process to guard. Defaults to the Node.js global `process`.

---

### unhandledRejection?

```ts
readonly unhandledRejection?: PlatformUnhandledRejectionMode;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcessGuardOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcessGuardOptions.ts#L15)

Handling of promise rejections that no code handled. Defaults to `fatal`.
