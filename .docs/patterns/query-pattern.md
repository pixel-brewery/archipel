---
title: Query Pattern
description: Repository + Query pattern with IRepositoryQuery, factory functions, transactional queries, and rules.
order: 7
---

# Archipel Query Pattern (v1)

## Overview

In Archipel, data access follows the **Repository + Query** pattern. Repositories never expose
raw Prisma delegate methods to services. Instead, every data operation is wrapped in a
**query factory function** that returns an `IRepositoryQuery` object. Services call
`repository.execute(someQuery(...))` — never `repository.findFirst(...)` directly.

## Core Interface

```typescript
export interface IRepositoryQuery<TDelegate, TResult> {
    readonly name: string;
    run(model: TDelegate): Promise<TResult>;
}
```

- `TDelegate` — the Prisma delegate type (e.g. `Prisma.UserDelegate`)
- `TResult` — the query's return type
- `name` — identifier used for logging and debugging

## Factory Function

```typescript
import { IRepositoryQuery } from '@pixel-brewery/archipel-platform-database';

export function query<TDelegate, TResult>(name: string, run: (model: TDelegate) => Promise<TResult>): IRepositoryQuery<TDelegate, TResult> {
    return { name, run };
}
```

## Type Extraction

```typescript
export type QueryResultType<T> = T extends IRepositoryQuery<unknown, infer R> ? R : never;
```

Use this to derive the result type from a query factory without duplicating types:

```typescript
type UserProfileResult = QueryResultType<ReturnType<typeof findUserProfileQuery>>;
```

## How to Write a Query

### Step 1: Define the query factory function

Each query is a **named function** that returns an `IRepositoryQuery`. The function may accept
parameters — these become the query's runtime arguments.

```typescript
import { Prisma } from '@prisma/client';
import { query } from '@pixel-brewery/archipel-platform-database';

export function findUserByEmailQuery(email: string) {
    return query<Prisma.UserDelegate, { id: string; email: string; name: string } | null>('findUserByEmail', (model) =>
        model.findFirst({
            where: { email },
            select: { id: true, email: true, name: true },
        }),
    );
}
```

### Step 2: Call from a service via repository.execute()

```typescript
// In the service:
const user = await this._userRepository.execute(findUserByEmailQuery(email));
```

### Step 3: Extract result type if needed for mapping

```typescript
type FindUserByEmailResult = QueryResultType<ReturnType<typeof findUserByEmailQuery>>;
```

## Transactional Queries

For operations that span multiple models, use `transactionalQuery`:

```typescript
import { Prisma } from '@prisma/client';
import { transactionalQuery } from '@pixel-brewery/archipel-platform-database';

export function createOrderWithItemsQuery(data: { userId: string; items: Array<{ productId: string; quantity: number }> }) {
    return transactionalQuery<{ orderId: string }>('createOrderWithItems', async (tx: Prisma.TransactionClient) => {
        const order = await tx.order.create({
            data: { userId: data.userId },
            select: { id: true },
        });

        await tx.orderItem.createMany({
            data: data.items.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
            })),
        });

        return { orderId: order.id };
    });
}
```

Called via:

```typescript
const result = await this._orderRepository.executeTransactional(createOrderWithItemsQuery({ userId, items }));
```

## Rules

1. **Never call Prisma delegate methods directly from services.** Always go through `execute(query)`.
2. **Always select only the fields you need.** Use `select` — never return full records.
3. **Query names must be descriptive.** Use the pattern: `verbModelByConditionQuery`
   (e.g. `findUserByEmailQuery`, `countOrdersByStatusQuery`, `updateUserNameQuery`).
4. **One query per file** for non-trivial queries. Small related queries may share a file.
5. **Type the result explicitly.** The second generic parameter of `query()` should be an inline
   object type or a dedicated interface matching the `select` shape.
6. **Each query factory is a standalone function** (not a class method). Import `query` from
   `@pixel-brewery/archipel-platform-database`.
