---
title: 'Interface: IFileResourceStrategyConfig'
generated: true
editUrl: false
---

# Interface: IFileResourceStrategyConfig

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L18)

Configuration for the file resource strategy.

## Properties

### basePaths

```ts
basePaths: string[];
```

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L23)

Base paths to search for resources.
Paths are tried in order until the resource is found.

---

### defaultEncoding?

```ts
defaultEncoding?:
  | "ascii"
  | "utf8"
  | "utf-8"
  | "utf16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "base64url"
  | "latin1"
  | "binary"
  | "hex";
```

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L29)

Optional default encoding for text files.

#### Default

```ts
'utf-8';
```

---

### includeSubfolders?

```ts
includeSubfolders?: boolean;
```

Defined in: [libs/platform-resources/src/strategies/FileResourceStrategy.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/FileResourceStrategy.ts#L37)

Enable recursive search in subdirectories.
When enabled, the strategy will search for files in all subdirectories
of the base paths using glob patterns.

#### Default

```ts
false;
```
