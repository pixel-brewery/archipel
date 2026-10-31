---
title: 'Interface: IPlatformApplicationOptions'
generated: true
editUrl: false
---

# Interface: IPlatformApplicationOptions

Defined in: [libs/platform-bootstrap/src/options/IPlatformApplicationOptions.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/options/IPlatformApplicationOptions.ts#L8)

Options for wrapping an existing NestJS application with Archipel platform bootstrap support.

## Properties

### configService?

```ts
readonly configService?: ConfigService;
```

Defined in: [libs/platform-bootstrap/src/options/IPlatformApplicationOptions.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/options/IPlatformApplicationOptions.ts#L10)

Explicit configuration service to use instead of resolving it from the NestJS container.
