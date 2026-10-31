---
title: 'Type Alias: IIntelligenceSchema\<T\>'
generated: true
editUrl: false
---

# Type Alias: IIntelligenceSchema\<T\>

```ts
type IIntelligenceSchema<T> =
    | {
          jsonSchema: Readonly<Record<string, unknown>>;
          kind: 'json-schema';
          validate?: (value) =>
              | {
                    success: true;
                    value: T;
                }
              | {
                    error: Error;
                    success: false;
                }
              | Promise<
                    | {
                          success: true;
                          value: T;
                      }
                    | {
                          error: Error;
                          success: false;
                      }
                >;
      }
    | {
          '~standard': {
              validate: (value) =>
                  | {
                        issues?: undefined;
                        value: T;
                    }
                  | {
                        issues: ReadonlyArray<unknown>;
                        value?: undefined;
                    }
                  | Promise<
                        | {
                              issues?: undefined;
                              value: T;
                          }
                        | {
                              issues: ReadonlyArray<unknown>;
                              value?: undefined;
                          }
                    >;
              vendor: string;
              version: 1;
          };
      };
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceSchema.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceSchema.ts#L10)

Provider-neutral schema accepted by prompts, structured outputs, and tools.

Zod and other Standard Schema implementations satisfy the second union
member structurally. Plain JSON Schema values can be created with
[createIntelligenceJsonSchema](Function.createIntelligenceJsonSchema).

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |
