---
title: 'Abstract Class: JwtPayloadBase'
generated: true
editUrl: false
---

# Abstract Class: JwtPayloadBase

Defined in: [libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts#L8)

Abstract base class for JWT payloads.
Products extend this to add their own claims (e.g. `profileId`, `isPro`).
Used as both a serialization contract and NestJS injection token.

## Constructors

### Constructor

```ts
protected new JwtPayloadBase(
   id,
   email,
   roles
): JwtPayloadBase;
```

Defined in: [libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts#L40)

#### Parameters

| Parameter | Type                |
| --------- | ------------------- |
| `id`      | `string`            |
| `email`   | `string` \| `null`  |
| `roles`   | readonly `string`[] |

#### Returns

`JwtPayloadBase`

## Properties

### email

```ts
readonly email: string | null;
```

Defined in: [libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts#L19)

Email address.

---

### exp?

```ts
readonly exp?: number;
```

Defined in: [libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts#L34)

Expiration timestamp (set by JWT library).

---

### iat?

```ts
readonly iat?: number;
```

Defined in: [libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts#L29)

Issued-at timestamp (set by JWT library).

---

### id

```ts
readonly id: string;
```

Defined in: [libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts#L14)

Subject identifier.

---

### roles

```ts
readonly roles: readonly string[];
```

Defined in: [libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts#L24)

Assigned roles.

## Methods

### fromJSON()

```ts
static fromJSON(raw): JwtPayloadBase;
```

Defined in: [libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts#L60)

Creates an instance from a decoded JWT payload object.
Subclasses **must** override this static-like factory on a per-product basis.

#### Parameters

| Parameter | Type                            | Description                  |
| --------- | ------------------------------- | ---------------------------- |
| `raw`     | `Record`\<`string`, `unknown`\> | The raw decoded JWT payload. |

#### Returns

`JwtPayloadBase`

---

### toJSON()

```ts
toJSON(): Record<string, unknown>;
```

Defined in: [libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/abstracts/JwtPayloadBase.ts#L69)

Serializes this payload to a plain object suitable for `JwtService.signAsync()`.

#### Returns

`Record`\<`string`, `unknown`\>
