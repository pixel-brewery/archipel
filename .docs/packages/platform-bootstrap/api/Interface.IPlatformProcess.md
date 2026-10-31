---
title: 'Interface: IPlatformProcess'
generated: true
editUrl: false
---

# Interface: IPlatformProcess

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcess.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcess.ts#L10)

Process contract used by `PlatformProcessGuard`.

The Node.js global `process` satisfies it. Tests inject a double so that a fatal path never exits the test runner.

## Properties

### exitCode

```ts
exitCode: string | number | null | undefined;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcess.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcess.ts#L12)

Exit code used when the process ends without an explicit code.

---

### stderr

```ts
readonly stderr: IPlatformProcessStream;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcess.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcess.ts#L18)

Standard error stream.

---

### stdout

```ts
readonly stdout: IPlatformProcessStream;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcess.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcess.ts#L15)

Standard output stream.

## Methods

### exit()

```ts
exit(code): void;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcess.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcess.ts#L21)

Terminates the process with the given exit code.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `code`    | `number` |

#### Returns

`void`

---

### on()

#### Call Signature

```ts
on(event, listener): unknown;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcess.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcess.ts#L24)

Registers a listener for exceptions that no code caught.

##### Parameters

| Parameter  | Type                          |
| ---------- | ----------------------------- |
| `event`    | `"uncaughtException"`         |
| `listener` | (`error`, `origin`) => `void` |

##### Returns

`unknown`

#### Call Signature

```ts
on(event, listener): unknown;
```

Defined in: [libs/platform-bootstrap/src/process/IPlatformProcess.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/process/IPlatformProcess.ts#L27)

Registers a listener for promise rejections that no code handled.

##### Parameters

| Parameter  | Type                   |
| ---------- | ---------------------- |
| `event`    | `"unhandledRejection"` |
| `listener` | (`reason`) => `void`   |

##### Returns

`unknown`
