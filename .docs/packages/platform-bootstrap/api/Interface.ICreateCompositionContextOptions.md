---
title: 'Interface: ICreateCompositionContextOptions'
generated: true
editUrl: false
---

# Interface: ICreateCompositionContextOptions

Defined in: [libs/platform-bootstrap/src/composition/factory/createCompositionContext.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/factory/createCompositionContext.ts#L17)

Options for creating the composition context.

## Properties

### enableLogging?

```ts
readonly enableLogging?: boolean;
```

Defined in: [libs/platform-bootstrap/src/composition/factory/createCompositionContext.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/factory/createCompositionContext.ts#L49)

Whether to enable logging for the composition context.

Defaults to `false` to keep composition silent.

---

### module?

```ts
readonly module?: Type<unknown>;
```

Defined in: [libs/platform-bootstrap/src/composition/factory/createCompositionContext.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/factory/createCompositionContext.ts#L40)

Custom composition module to use instead of the default [CompositionModule](Class.CompositionModule).

Use this to provide application-specific composition services such as
custom [CompositionResolverBase](Class.CompositionResolverBase) implementations.

#### Example

```typescript
@Module({
    imports: [ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy() })],
    providers: [AppCompositionResolver],
    exports: [ConfigModule, AppCompositionResolver],
})
export class AppCompositionModule {}

const context = await createCompositionContext({
    module: AppCompositionModule,
});
```
