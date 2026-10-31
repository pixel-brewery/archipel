---
title: 'Class: ObservedSqlAdapter'
generated: true
editUrl: false
---

# Class: ObservedSqlAdapter

Defined in: [libs/platform-database/src/ObservedSqlAdapter.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/ObservedSqlAdapter.ts#L10)

Observes Prisma's public driver boundary, preserving results, errors and transaction ownership.

## Implements

- `SqlDriverAdapterFactory`

## Constructors

### Constructor

```ts
new ObservedSqlAdapter(factory, observer): ObservedSqlAdapter;
```

Defined in: [libs/platform-database/src/ObservedSqlAdapter.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/ObservedSqlAdapter.ts#L23)

#### Parameters

| Parameter  | Type                      |
| ---------- | ------------------------- |
| `factory`  | `SqlDriverAdapterFactory` |
| `observer` | (`observation`) => `void` |

#### Returns

`ObservedSqlAdapter`

## Properties

### adapterName

```ts
readonly adapterName: string;
```

Defined in: [libs/platform-database/src/ObservedSqlAdapter.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/ObservedSqlAdapter.ts#L14)

#### Implementation of

`SqlDriverAdapterFactory.adapterName`

---

### provider

```ts
readonly provider: Provider;
```

Defined in: [libs/platform-database/src/ObservedSqlAdapter.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/ObservedSqlAdapter.ts#L13)

#### Implementation of

`SqlDriverAdapterFactory.provider`

## Methods

### connect()

```ts
connect(): Promise<SqlDriverAdapter>;
```

Defined in: [libs/platform-database/src/ObservedSqlAdapter.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/ObservedSqlAdapter.ts#L38)

Creates an observed runtime adapter; connection and pool failures retain the delegate's behavior.

#### Returns

`Promise`\<`SqlDriverAdapter`\>

#### Implementation of

`SqlDriverAdapterFactory.connect`
