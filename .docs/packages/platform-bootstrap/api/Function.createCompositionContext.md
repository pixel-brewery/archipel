---
title: 'Function: createCompositionContext()'
generated: true
editUrl: false
---

# Function: createCompositionContext()

```ts
function createCompositionContext(options?): Promise<ICompositionContext>;
```

Defined in: [libs/platform-bootstrap/src/composition/factory/createCompositionContext.ts:88](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/factory/createCompositionContext.ts#L88)

Creates a temporary NestJS context for stage-aware module composition.

This function bootstraps a minimal NestJS application context that provides
access to configuration. Use this context to make decisions about which
modules should be dynamically imported into the real application.

## Parameters

| Parameter  | Type                                                                             | Description                                         |
| ---------- | -------------------------------------------------------------------------------- | --------------------------------------------------- |
| `options?` | [`ICreateCompositionContextOptions`](Interface.ICreateCompositionContextOptions) | Optional configuration for the composition context. |

## Returns

`Promise`\<[`ICompositionContext`](Interface.ICompositionContext)\>

A promise that resolves to the composition context.

## Remarks

The composition context must be closed after the real application has been
created by calling [ICompositionContext.close](Interface.ICompositionContext#close). Use a try/finally block
to ensure proper cleanup.

## Example

```typescript
async function bootstrap(): Promise<void> {
    const composition = await createCompositionContext();

    try {
        const appModule = await createAppModule(composition);
        const app = await NestFactory.create(appModule);

        await PlatformApplicationBuilder
            .from(app)
            .use(useApi({ ... }))
            .listenFromConfig();
    } finally {
        await composition.close();
    }
}
```
