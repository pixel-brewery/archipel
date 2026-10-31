---
title: 'Variable: IpAddress'
generated: true
editUrl: false
---

# Variable: IpAddress

```ts
const IpAddress: (...dataOrPipes) => ParameterDecorator;
```

Defined in: [libs/platform-core/src/decorators/IpAddress.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/decorators/IpAddress.ts#L15)

Extracts the client IP address from the current HTTP request.
Handles IPv6 (::1), proxy headers (X-Forwarded-For), and normalizes the output.

Examples:
"192.168.0.5" -> "192.168.0.5"
"::ffff:127.0.0.1" -> "127.0.0.1"
"::1" / "127.0.0.1" -> "localhost"
undefined / "" -> undefined

## Parameters

| Parameter        | Type                                                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ...`dataOrPipes` | ( \| `string` \| `ParameterDecoratorOptions` \| `PipeTransform`\<`any`, `any`\> \| `Type`\<`PipeTransform`\<`any`, `any`\>\> \| `undefined`)[] |

## Returns

`ParameterDecorator`
