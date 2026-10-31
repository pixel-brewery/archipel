---
title: 'Class: NameGeneratorService'
generated: true
editUrl: false
---

# Class: NameGeneratorService

Defined in: [libs/platform-core/src/services/NameGeneratorService.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/NameGeneratorService.ts#L14)

Service for generating random names.

## Constructors

### Constructor

```ts
new NameGeneratorService(): NameGeneratorService;
```

#### Returns

`NameGeneratorService`

## Methods

### generate()

```ts
generate(useNumbers?): string;
```

Defined in: [libs/platform-core/src/services/NameGeneratorService.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/NameGeneratorService.ts#L77)

Generates a random name.

#### Parameters

| Parameter     | Type      | Default value | Description                                         |
| ------------- | --------- | ------------- | --------------------------------------------------- |
| `useNumbers?` | `boolean` | `true`        | If true, adds random numbers at the end of the name |

#### Returns

`string`

A randomly generated name

---

### generateSecure()

```ts
generateSecure(): string;
```

Defined in: [libs/platform-core/src/services/NameGeneratorService.ts:90](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/NameGeneratorService.ts#L90)

Generates a random name using secure random bytes.

#### Returns

`string`

A cryptographically secure random name
