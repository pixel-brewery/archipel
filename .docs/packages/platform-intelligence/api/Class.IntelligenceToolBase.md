---
title: 'Abstract Class: IntelligenceToolBase\<_TInput, _TOutput\>'
generated: true
editUrl: false
---

# Abstract Class: IntelligenceToolBase\<_TInput, _TOutput\>

Defined in: [libs/platform-intelligence/src/abstracts/IntelligenceToolBase.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/abstracts/IntelligenceToolBase.ts#L34)

Base class for class-based intelligence tools.

Archipel keeps tool registration object-oriented while leaving the actual tool
definition provider-neutral. Concrete tools expose a stable registry name
and an Archipel-owned definition.

## Example

```typescript
export class CustomerSearchTool extends IntelligenceToolBase<ICustomerSearchInput, ICustomerSearchResult> {
    public override get name(): string {
        return 'searchCustomers';
    }

    public override get tool(): IIntelligenceToolDefinition<ICustomerSearchInput, ICustomerSearchResult> {
        return defineIntelligenceTool({
            description: 'Searches customers by name, email, or company.',
            inputSchema: z.object({
                query: z.string().describe('Customer search query'),
            }),
            execute: async (input) => this._customerService.search(input.query),
        });
    }
}
```

## Type Parameters

| Type Parameter                                  | Default type | Description                           |
| ----------------------------------------------- | ------------ | ------------------------------------- |
| <a id="type-parameter-_tinput"></a> `_TInput`   | `unknown`    | The input type accepted by the tool.  |
| <a id="type-parameter-_toutput"></a> `_TOutput` | `unknown`    | The output type produced by the tool. |

## Constructors

### Constructor

```ts
new IntelligenceToolBase<_TInput, _TOutput>(): IntelligenceToolBase<_TInput, _TOutput>;
```

#### Returns

`IntelligenceToolBase`\<`_TInput`, `_TOutput`\>

## Accessors

### name

#### Get Signature

```ts
get abstract name(): string;
```

Defined in: [libs/platform-intelligence/src/abstracts/IntelligenceToolBase.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/abstracts/IntelligenceToolBase.ts#L51)

Gets the unique registry name for the tool.

The name becomes the key in the tool set passed to language generation.

##### Returns

`string`

---

### tool

#### Get Signature

```ts
get abstract tool(): IIntelligenceToolDefinition<_TInput, _TOutput>;
```

Defined in: [libs/platform-intelligence/src/abstracts/IntelligenceToolBase.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/abstracts/IntelligenceToolBase.ts#L59)

Gets the provider-neutral tool definition.

##### Returns

[`IIntelligenceToolDefinition`](Interface.IIntelligenceToolDefinition)\<`_TInput`, `_TOutput`\>
