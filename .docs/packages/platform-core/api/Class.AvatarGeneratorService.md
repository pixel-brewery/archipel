---
title: 'Class: AvatarGeneratorService'
generated: true
editUrl: false
---

# Class: AvatarGeneratorService

Defined in: [libs/platform-core/src/services/AvatarGeneratorService.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/AvatarGeneratorService.ts#L15)

Service for generating GitHub-style identicon avatars.

## Constructors

### Constructor

```ts
new AvatarGeneratorService(): AvatarGeneratorService;
```

#### Returns

`AvatarGeneratorService`

## Methods

### generate()

```ts
generate(
   width?,
   height?,
   seed?
): Promise<string>;
```

Defined in: [libs/platform-core/src/services/AvatarGeneratorService.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/AvatarGeneratorService.ts#L45)

Generates a deterministic avatar as a base64-encoded PNG string.
When a seed (e.g. a user ID) is provided, the same seed always produces the same avatar.

#### Parameters

| Parameter | Type     | Default value | Description                                                        |
| --------- | -------- | ------------- | ------------------------------------------------------------------ |
| `width?`  | `number` | `128`         | Width of the avatar in pixels (default: 128)                       |
| `height?` | `number` | `128`         | Height of the avatar in pixels (default: 128)                      |
| `seed?`   | `string` | `undefined`   | Optional stable identifier (e.g. user ID) for deterministic output |

#### Returns

`Promise`\<`string`\>

Base64-encoded PNG image string
