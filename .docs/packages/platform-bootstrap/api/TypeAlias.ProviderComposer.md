---
title: 'Type Alias: ProviderComposer\<TContext\>'
generated: true
editUrl: false
---

# Type Alias: ProviderComposer\<TContext\>

```ts
type ProviderComposer<TContext> = (context) => Promise<IProviderDecision>;
```

Defined in: [libs/platform-bootstrap/src/composition/types/ProviderComposer.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/types/ProviderComposer.ts#L37)

Function signature for a provider composer.

A provider composer is responsible for determining which modules should be
imported based on the current composition context (configuration, stage, etc.).

## Type Parameters

| Type Parameter                                                                                                   | Default type                                           | Description                                                                                     |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| <a id="type-parameter-tcontext"></a> `TContext` _extends_ [`ICompositionContext`](Interface.ICompositionContext) | [`ICompositionContext`](Interface.ICompositionContext) | The composition context type. Defaults to [ICompositionContext](Interface.ICompositionContext). |

## Parameters

| Parameter | Type       |
| --------- | ---------- |
| `context` | `TContext` |

## Returns

`Promise`\<[`IProviderDecision`](Interface.IProviderDecision)\>

## Example

```typescript
const composeMailProvider: ProviderComposer = async (context) => {
    const driver = context.config.tryGet('MAIL_DRIVER', 'log');

    if (driver === 'smtp') {
        const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
        const { SmtpDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/smtp');

        return {
            shouldImport: true,
            imports: [MailModule.register({ deliveryStrategy: SmtpDeliveryStrategy })],
        };
    }

    return { shouldImport: false, imports: [] };
};
```
