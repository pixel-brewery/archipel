---
title: 'Interface: ICacheStats'
generated: true
editUrl: false
---

# Interface: ICacheStats

Defined in: [libs/platform-caching/src/ICacheStats.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheStats.ts#L6)

Cache statistics snapshot returned by cache implementations.

## Properties

### evictions?

```ts
evictions?: number;
```

Defined in: [libs/platform-caching/src/ICacheStats.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheStats.ts#L42)

Number of cache evictions (if supported).

---

### hits

```ts
hits: number;
```

Defined in: [libs/platform-caching/src/ICacheStats.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheStats.ts#L14)

Number of cache hits.

---

### loadErrors

```ts
loadErrors: number;
```

Defined in: [libs/platform-caching/src/ICacheStats.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheStats.ts#L35)

Number of failed cache loads.

---

### loads

```ts
loads: number;
```

Defined in: [libs/platform-caching/src/ICacheStats.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheStats.ts#L28)

Number of successful cache loads.

---

### misses

```ts
misses: number;
```

Defined in: [libs/platform-caching/src/ICacheStats.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheStats.ts#L21)

Number of cache misses.
