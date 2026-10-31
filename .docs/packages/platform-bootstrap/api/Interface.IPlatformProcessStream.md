---
title: 'Interface: IPlatformProcessStream'
generated: true
editUrl: false
---

# Interface: IPlatformProcessStream

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcessStream.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcessStream.ts#L8)

Standard output or error stream of a process guarded by `PlatformProcessGuard`.

`process.stdout` and `process.stderr` satisfy this contract.

## Methods

### on()

```ts
on(event, listener): unknown;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcessStream.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcessStream.ts#L10)

Registers a listener for stream failures such as a pipe whose reader has gone away.

#### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| `event`    | `"error"`           |
| `listener` | (`error`) => `void` |

#### Returns

`unknown`

---

### write()

```ts
write(chunk, callback): boolean;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcessStream.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcessStream.ts#L13)

Queues a chunk. The callback runs once the chunk and everything queued before it are written, or the write failed.

#### Parameters

| Parameter  | Type                 |
| ---------- | -------------------- |
| `chunk`    | `string`             |
| `callback` | (`error?`) => `void` |

#### Returns

`boolean`
