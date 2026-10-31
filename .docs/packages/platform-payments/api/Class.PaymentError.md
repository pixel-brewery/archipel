---
title: 'Class: PaymentError'
generated: true
editUrl: false
---

# Class: PaymentError

Defined in: [libs/platform-payments/src/errors/PaymentError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/errors/PaymentError.ts#L6)

Domain error thrown when a payment operation fails.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new PaymentError(
   provider,
   message,
   cause?
): PaymentError;
```

Defined in: [libs/platform-payments/src/errors/PaymentError.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/errors/PaymentError.ts#L16)

#### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `provider` | `string`  |
| `message`  | `string`  |
| `cause?`   | `unknown` |

#### Returns

`PaymentError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: "PAYMENT" = 'PAYMENT';
```

Defined in: [libs/platform-payments/src/errors/PaymentError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/errors/PaymentError.ts#L9)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-payments/src/errors/PaymentError.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/errors/PaymentError.ts#L10)
