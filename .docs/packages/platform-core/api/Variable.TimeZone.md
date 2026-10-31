---
title: 'Variable: TimeZone'
generated: true
editUrl: false
---

# Variable: TimeZone

```ts
const TimeZone: (...dataOrPipes) => ParameterDecorator;
```

Defined in: [libs/platform-core/src/decorators/TimeZone.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/decorators/TimeZone.ts#L33)

Extracts the client's IANA time zone from the `X-Time-Zone` request header.

The value is a client hint, not a trusted fact: an unknown, malformed or overlong zone resolves to `undefined` so the
endpoint can decide how to proceed without a time zone. A valid zone is returned in its canonical spelling.

Examples:
"Europe/Berlin" -> "Europe/Berlin"
"america/new_york" -> "America/New_York"
"Mars/Olympus" -> undefined
undefined / "" -> undefined

## Parameters

| Parameter        | Type                                                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ...`dataOrPipes` | ( \| `string` \| `ParameterDecoratorOptions` \| `PipeTransform`\<`any`, `any`\> \| `Type`\<`PipeTransform`\<`any`, `any`\>\> \| `undefined`)[] |

## Returns

`ParameterDecorator`
