---
title: 'Class: ContextLogger'
generated: true
editUrl: false
---

# Class: ContextLogger

Defined in: [libs/platform-logging/src/ContextLogger.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/ContextLogger.ts#L20)

Structured logger that automatically enriches log entries with the
current request context (requestId, userId) from [RequestContextStore](Class.RequestContextStore).

## Remarks

This logger wraps the NestJS Logger and prepends structured
context fields. It is intended as a drop-in replacement for direct
`Logger` usage in services that need request-scoped correlation.

## Constructors

### Constructor

```ts
new ContextLogger(context?): ContextLogger;
```

Defined in: [libs/platform-logging/src/ContextLogger.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/ContextLogger.ts#L29)

#### Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `context?` | `string` |

#### Returns

`ContextLogger`

## Methods

### debug()

```ts
debug(message, data?): void;
```

Defined in: [libs/platform-logging/src/ContextLogger.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/ContextLogger.ts#L69)

Logs at `debug` level with request context.

#### Parameters

| Parameter | Type                            |
| --------- | ------------------------------- |
| `message` | `string`                        |
| `data?`   | `Record`\<`string`, `unknown`\> |

#### Returns

`void`

---

### error()

```ts
error(message, data?): void;
```

Defined in: [libs/platform-logging/src/ContextLogger.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/ContextLogger.ts#L60)

Logs at `error` level with request context.

#### Parameters

| Parameter | Type                            |
| --------- | ------------------------------- |
| `message` | `string`                        |
| `data?`   | `Record`\<`string`, `unknown`\> |

#### Returns

`void`

---

### log()

```ts
log(message, data?): void;
```

Defined in: [libs/platform-logging/src/ContextLogger.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/ContextLogger.ts#L42)

Logs at `log` level with request context.

#### Parameters

| Parameter | Type                            |
| --------- | ------------------------------- |
| `message` | `string`                        |
| `data?`   | `Record`\<`string`, `unknown`\> |

#### Returns

`void`

---

### verbose()

```ts
verbose(message, data?): void;
```

Defined in: [libs/platform-logging/src/ContextLogger.ts:78](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/ContextLogger.ts#L78)

Logs at `verbose` level with request context.

#### Parameters

| Parameter | Type                            |
| --------- | ------------------------------- |
| `message` | `string`                        |
| `data?`   | `Record`\<`string`, `unknown`\> |

#### Returns

`void`

---

### warn()

```ts
warn(message, data?): void;
```

Defined in: [libs/platform-logging/src/ContextLogger.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/ContextLogger.ts#L51)

Logs at `warn` level with request context.

#### Parameters

| Parameter | Type                            |
| --------- | ------------------------------- |
| `message` | `string`                        |
| `data?`   | `Record`\<`string`, `unknown`\> |

#### Returns

`void`
