---
title: 'Interface: IConfigModuleOptions'
generated: true
editUrl: false
---

# Interface: IConfigModuleOptions

Defined in: [libs/platform-configuration/src/ConfigModule.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigModule.ts#L15)

The `IConfigModuleOptions` interface.

## Properties

### statics?

```ts
statics?: Record<string, string>;
```

Defined in: [libs/platform-configuration/src/ConfigModule.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigModule.ts#L17)

---

### strategyFactory?

```ts
strategyFactory?: (...args) => ConfigStrategyBase;
```

Defined in: [libs/platform-configuration/src/ConfigModule.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigModule.ts#L16)

#### Parameters

| Parameter | Type        |
| --------- | ----------- |
| ...`args` | `unknown`[] |

#### Returns

[`ConfigStrategyBase`](Class.ConfigStrategyBase)
