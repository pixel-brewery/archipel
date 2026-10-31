---
title: 'Class: DeviceParserService'
generated: true
editUrl: false
---

# Class: DeviceParserService

Defined in: [libs/platform-core/src/services/DeviceParserService.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/DeviceParserService.ts#L31)

The `DeviceParserService` class.

Service responsible for parsing User-Agent strings and extracting device information.

## Constructors

### Constructor

```ts
new DeviceParserService(): DeviceParserService;
```

Defined in: [libs/platform-core/src/services/DeviceParserService.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/DeviceParserService.ts#L43)

Constructs a new instance of the `DeviceParserService` class.

#### Returns

`DeviceParserService`

## Methods

### parse()

```ts
parse(userAgent): IDeviceInfo;
```

Defined in: [libs/platform-core/src/services/DeviceParserService.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/DeviceParserService.ts#L58)

Parse User-Agent string and extract device information

#### Parameters

| Parameter   | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| `userAgent` | `string` | The User-Agent header string |

#### Returns

[`IDeviceInfo`](Interface.IDeviceInfo)

Parsed device information
