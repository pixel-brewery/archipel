---
title: 'Class: ObservedPool'
generated: true
editUrl: false
---

# Class: ObservedPool

Defined in: [libs/platform-database/src/postgres/ObservedPool.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/ObservedPool.ts#L15)

Observes the public pg acquisition boundary without changing the pool's limits or retry behavior.

## Extends

- `Pool`

## Constructors

### Constructor

```ts
new ObservedPool(config?): ObservedPool;
```

Defined in: [libs/platform-database/src/postgres/ObservedPool.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/ObservedPool.ts#L26)

#### Parameters

| Parameter | Type         |
| --------- | ------------ |
| `config?` | `PoolConfig` |

#### Returns

`ObservedPool`

#### Overrides

`Pool.constructor`

## Methods

### connect()

#### Call Signature

```ts
connect(): Promise<PoolClient>;
```

Defined in: [libs/platform-database/src/postgres/ObservedPool.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/ObservedPool.ts#L44)

##### Returns

`Promise`\<`PoolClient`\>

##### Overrides

`Pool.connect`

#### Call Signature

```ts
connect(callback): void;
```

Defined in: [libs/platform-database/src/postgres/ObservedPool.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/ObservedPool.ts#L45)

##### Parameters

| Parameter  | Type                                |
| ---------- | ----------------------------------- |
| `callback` | (`err`, `client`, `done`) => `void` |

##### Returns

`void`

##### Overrides

`Pool.connect`

---

### observe()

```ts
observe(telemetry): void;
```

Defined in: [libs/platform-database/src/postgres/ObservedPool.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/ObservedPool.ts#L39)

#### Parameters

| Parameter   | Type                                       |
| ----------- | ------------------------------------------ |
| `telemetry` | [`IPoolObserver`](Interface.IPoolObserver) |

#### Returns

`void`

---

### reportError()

```ts
reportError(error): void;
```

Defined in: [libs/platform-database/src/postgres/ObservedPool.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/ObservedPool.ts#L73)

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `error`   | `unknown` |

#### Returns

`void`
