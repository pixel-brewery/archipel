---
title: 'Interface: IResourceManagerConfig'
generated: true
editUrl: false
---

# Interface: IResourceManagerConfig

Defined in: [libs/platform-resources/src/ResourceManager.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L16)

Configuration for the ResourceManager.

## Properties

### cache?

```ts
cache?: ILayeredCache<string, IResourceResult>;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L26)

Optional cache for loaded resources.

---

### cacheTtl?

```ts
cacheTtl?: number;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L32)

Cache TTL in seconds.

#### Default

```ts
3600 (1 hour)
```

---

### debug?

```ts
debug?: boolean;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L38)

Enable debug logging.

#### Default

```ts
false;
```

---

### strategies

```ts
strategies: IResourceStrategy[];
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L21)

Resource loading strategies in priority order.
First strategy that finds the resource wins.

---

### strategyTimeoutMs?

```ts
strategyTimeoutMs?: number;
```

Defined in: [libs/platform-resources/src/ResourceManager.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceManager.ts#L44)

Timeout in milliseconds for a single async strategy load.

#### Default

```ts
30000 (30 seconds)
```
