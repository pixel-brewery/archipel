---
title: 'Class: DatabaseHealthIndicator'
generated: true
editUrl: false
---

# Class: DatabaseHealthIndicator

Defined in: [libs/platform-database/src/health/DatabaseHealthIndicator.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/health/DatabaseHealthIndicator.ts#L16)

Health indicator for database connectivity.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new DatabaseHealthIndicator(prismaHealthIndicator, databaseService): DatabaseHealthIndicator;
```

Defined in: [libs/platform-database/src/health/DatabaseHealthIndicator.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/health/DatabaseHealthIndicator.ts#L26)

#### Parameters

| Parameter               | Type                                       |
| ----------------------- | ------------------------------------------ |
| `prismaHealthIndicator` | `PrismaHealthIndicator`                    |
| `databaseService`       | [`DatabaseService`](Class.DatabaseService) |

#### Returns

`DatabaseHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'database';
```

Defined in: [libs/platform-database/src/health/DatabaseHealthIndicator.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/health/DatabaseHealthIndicator.ts#L35)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): Promise<HealthIndicatorResult<"database">>;
```

Defined in: [libs/platform-database/src/health/DatabaseHealthIndicator.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/health/DatabaseHealthIndicator.ts#L47)

Checks database connectivity via a Prisma ping.

#### Returns

`Promise`\<`HealthIndicatorResult`\<`"database"`\>\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
