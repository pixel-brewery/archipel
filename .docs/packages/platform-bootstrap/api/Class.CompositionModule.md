---
title: 'Class: CompositionModule'
generated: true
editUrl: false
---

# Class: CompositionModule

Defined in: [libs/platform-bootstrap/src/composition/module/CompositionModule.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/module/CompositionModule.ts#L53)

Minimal module providing configuration access for composition.

This module is used by [createCompositionContext](Function.createCompositionContext) to create a
lightweight NestJS application context for module composition decisions.

## Remarks

The composition module intentionally does **not** import heavy infrastructure
such as database, queues, cron, or external API clients. It only provides
configuration access.

To add custom composition services (e.g., a custom [CompositionResolverBase](Class.CompositionResolverBase)),
create a custom module extending this pattern and pass it to
[createCompositionContext](Function.createCompositionContext).

## Example

```typescript
// Custom composition module with application-specific resolver
@Module({
    imports: [
        ConfigModule.forRoot({
            strategyFactory: () => new EnvironmentConfigStrategy(),
        }),
    ],
    providers: [AppCompositionResolver],
    exports: [ConfigModule, AppCompositionResolver],
})
export class AppCompositionModule {}

// Usage
const context = await createCompositionContext({
    module: AppCompositionModule,
});
```

## Constructors

### Constructor

```ts
new CompositionModule(): CompositionModule;
```

#### Returns

`CompositionModule`
