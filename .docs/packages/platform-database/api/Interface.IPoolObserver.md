---
title: 'Interface: IPoolObserver'
generated: true
editUrl: false
---

# Interface: IPoolObserver

Defined in: [libs/platform-database/src/postgres/PoolObserver.ts:2](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/PoolObserver.ts#L2)

Optional diagnostics adapter for the public PostgreSQL acquisition boundary. No telemetry package is required.

## Methods

### complete()

```ts
complete(
   operation,
   durationMs,
   outcome
): void;
```

Defined in: [libs/platform-database/src/postgres/PoolObserver.ts:3](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/PoolObserver.ts#L3)

#### Parameters

| Parameter    | Type                       |
| ------------ | -------------------------- |
| `operation`  | `"database_pool_acquire"`  |
| `durationMs` | `number`                   |
| `outcome`    | `"success"` \| `"failure"` |

#### Returns

`void`

---

### failure()

```ts
failure(
   component,
   operation,
   error
): void;
```

Defined in: [libs/platform-database/src/postgres/PoolObserver.ts:5](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/PoolObserver.ts#L5)

#### Parameters

| Parameter   | Type         |
| ----------- | ------------ |
| `component` | `"database"` |
| `operation` | `"pool"`     |
| `error`     | `unknown`    |

#### Returns

`void`

---

### gauge()

```ts
gauge(name, value): void;
```

Defined in: [libs/platform-database/src/postgres/PoolObserver.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/postgres/PoolObserver.ts#L4)

#### Parameters

| Parameter | Type                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------- |
| `name`    | \| `"database_pool_connections"` \| `"database_pool_idle"` \| `"database_pool_waiting"` \| `"database_pool_max"` |
| `value`   | `number`                                                                                                         |

#### Returns

`void`
