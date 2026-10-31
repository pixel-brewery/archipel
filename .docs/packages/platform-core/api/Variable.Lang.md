---
title: 'Variable: Lang'
generated: true
editUrl: false
---

# Variable: Lang

```ts
const Lang: (...dataOrPipes) => ParameterDecorator;
```

Defined in: [libs/platform-core/src/decorators/Lang.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/decorators/Lang.ts#L13)

Extracts the first language token from the Accept-Language header.

Examples:
"da, en-gb;q=0.8, en;q=0.7" -> "da"
"en-US,en;q=0.9" -> "en-US"
undefined / "" -> undefined

## Parameters

| Parameter        | Type                                                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ...`dataOrPipes` | ( \| `string` \| `ParameterDecoratorOptions` \| `PipeTransform`\<`any`, `any`\> \| `Type`\<`PipeTransform`\<`any`, `any`\>\> \| `undefined`)[] |

## Returns

`ParameterDecorator`
