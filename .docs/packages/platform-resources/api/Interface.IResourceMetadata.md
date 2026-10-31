---
title: 'Interface: IResourceMetadata'
generated: true
editUrl: false
---

# Interface: IResourceMetadata

Defined in: [libs/platform-resources/src/types/IResourceMetadata.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/types/IResourceMetadata.ts#L6)

Metadata about a resource.

## Properties

### cachedAt?

```ts
cachedAt?: Date;
```

Defined in: [libs/platform-resources/src/types/IResourceMetadata.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/types/IResourceMetadata.ts#L40)

When this resource was cached (if applicable).

---

### encoding?

```ts
encoding?: BufferEncoding;
```

Defined in: [libs/platform-resources/src/types/IResourceMetadata.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/types/IResourceMetadata.ts#L30)

The encoding of the resource (if applicable).

---

### key

```ts
key: string;
```

Defined in: [libs/platform-resources/src/types/IResourceMetadata.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/types/IResourceMetadata.ts#L10)

The resource key/identifier.

---

### mimeType

```ts
mimeType: string;
```

Defined in: [libs/platform-resources/src/types/IResourceMetadata.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/types/IResourceMetadata.ts#L20)

The MIME type of the resource.

---

### path

```ts
path: string;
```

Defined in: [libs/platform-resources/src/types/IResourceMetadata.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/types/IResourceMetadata.ts#L15)

The full path of the resource.

---

### size

```ts
size: number;
```

Defined in: [libs/platform-resources/src/types/IResourceMetadata.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/types/IResourceMetadata.ts#L25)

The size of the resource in bytes.

---

### source

```ts
source: string;
```

Defined in: [libs/platform-resources/src/types/IResourceMetadata.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/types/IResourceMetadata.ts#L35)

The source strategy that resolved this resource.
