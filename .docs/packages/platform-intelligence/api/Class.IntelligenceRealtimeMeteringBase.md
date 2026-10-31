---
title: 'Abstract Class: IntelligenceRealtimeMeteringBase'
generated: true
editUrl: false
---

# Abstract Class: IntelligenceRealtimeMeteringBase

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeMeteringBase.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeMeteringBase.ts#L11)

Application abstract base for idempotently persisting realtime billing and audit events.

Implementations should treat `eventId` as an idempotency key and persist the
commercial debit and AI audit record in one application transaction.

## Constructors

### Constructor

```ts
new IntelligenceRealtimeMeteringBase(): IntelligenceRealtimeMeteringBase;
```

#### Returns

`IntelligenceRealtimeMeteringBase`

## Methods

### report()

```ts
abstract report(event): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeMeteringBase.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeMeteringBase.ts#L28)

Persists one metering event.

#### Parameters

| Parameter | Type                                                                               | Description                                           |
| --------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `event`   | [`IntelligenceRealtimeMeteringEvent`](TypeAlias.IntelligenceRealtimeMeteringEvent) | Normalized, idempotently identifiable metering event. |

#### Returns

`Promise`\<`void`\>
