---
title: 'Class: PlatformBootstrapError'
generated: true
editUrl: false
---

# Class: PlatformBootstrapError

Defined in: [libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts#L8)

Error raised when an Archipel platform bootstrap step fails.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new PlatformBootstrapError(message, options?): PlatformBootstrapError;
```

Defined in: [libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts#L19)

#### Parameters

| Parameter  | Type                             |
| ---------- | -------------------------------- |
| `message`  | `string`                         |
| `options?` | `IPlatformBootstrapErrorOptions` |

#### Returns

`PlatformBootstrapError`

#### Overrides

`Error.constructor`

## Accessors

### cause

#### Get Signature

```ts
get cause(): unknown;
```

Defined in: [libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts#L36)

Original error that caused the bootstrap failure.

##### Returns

`unknown`

#### Overrides

`Error.cause`

---

### stepIndex

#### Get Signature

```ts
get stepIndex(): number | undefined;
```

Defined in: [libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts#L45)

Zero-based index of the failing bootstrap step.

##### Returns

`number` \| `undefined`

---

### stepName

#### Get Signature

```ts
get stepName(): string | undefined;
```

Defined in: [libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts#L54)

Display name of the failing bootstrap step.

##### Returns

`string` \| `undefined`

## Methods

### wrap()

```ts
static wrap(
   cause,
   stepName,
   stepIndex
): PlatformBootstrapError;
```

Defined in: [libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/errors/PlatformBootstrapError.ts#L71)

Wraps an unknown thrown value in a platform bootstrap error.

#### Parameters

| Parameter   | Type      | Description                           |
| ----------- | --------- | ------------------------------------- |
| `cause`     | `unknown` | The thrown value.                     |
| `stepName`  | `string`  | Display name of the failing step.     |
| `stepIndex` | `number`  | Zero-based index of the failing step. |

#### Returns

`PlatformBootstrapError`

A platform bootstrap error.
