---
title: 'Interface: ISqlObservation'
generated: true
editUrl: false
---

# Interface: ISqlObservation

Defined in: [libs/platform-database/src/interfaces/ISqlObservation.ts:2](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/interfaces/ISqlObservation.ts#L2)

One completed Prisma driver operation, with no SQL text, arguments, result data or error messages.

## Properties

### durationMs

```ts
readonly durationMs: number;
```

Defined in: [libs/platform-database/src/interfaces/ISqlObservation.ts:3](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/interfaces/ISqlObservation.ts#L3)

---

### kind

```ts
readonly kind: "query" | "transaction" | "script";
```

Defined in: [libs/platform-database/src/interfaces/ISqlObservation.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/interfaces/ISqlObservation.ts#L6)

---

### operation

```ts
readonly operation: string;
```

Defined in: [libs/platform-database/src/interfaces/ISqlObservation.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/interfaces/ISqlObservation.ts#L4)

---

### outcome

```ts
readonly outcome: "success" | "failure";
```

Defined in: [libs/platform-database/src/interfaces/ISqlObservation.ts:5](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/interfaces/ISqlObservation.ts#L5)

---

### transaction

```ts
readonly transaction: boolean;
```

Defined in: [libs/platform-database/src/interfaces/ISqlObservation.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/interfaces/ISqlObservation.ts#L7)
