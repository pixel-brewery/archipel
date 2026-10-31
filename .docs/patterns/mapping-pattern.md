---
title: Mapping Pattern
description: Branded type-safe mapping keys, MappingProfileBase, MappingService, and MappingModule registration.
order: 5
---

# Archipel Mapping Pattern

## Overview

In Archipel, all object-to-object mapping goes through a central **MappingService** with
**branded, type-safe mapping keys**. This guarantees compile-time type safety: the key
encodes both the input and output type, so calling `mappingService.map(KEY, input)` is
statically checked — the compiler verifies that `input` matches the key's input type and
infers the return type automatically.

**Rule:** Services MUST NOT inline-create response objects. They return entities.
Controllers use the MappingService to convert entities to transport-model
inputs. New endpoints serialize the mapped value through a Standard Schema and
`ResponseReturn2`; mapping directly to a response DTO class is the legacy
fallback.

## Core Types

### IMappingKey<TInput, TOutput>

```typescript
export interface IMappingKey<TInput, TOutput> {
    readonly _brand: 'MappingKey';
    readonly _input: TInput;
    readonly _output: TOutput;
    readonly key: string;
}
```

The `_input` and `_output` fields are phantom types — they exist only for compile-time
type encoding and are never accessed at runtime.

### createMappingKey<TInput, TOutput>

```typescript
import { createMappingKey } from '@pixel-brewery/archipel-platform-mapping';

export const PRODUCT_MAPPING_KEY = createMappingKey<IProductMappingInput, ProductResponse>('food.product');
```

The string argument `'food.product'` is the unique registry key. Convention:
`<domain>.<entity>` in lowercase dot-notation.

## MappingService API

```typescript
// Key-based mapping (preferred)
const response = mappingService.map(PRODUCT_MAPPING_KEY, input);
// → TOutput is inferred from the key, TInput is validated

// Safe variant (returns undefined if not registered)
const maybeResponse = mappingService.tryMap(PRODUCT_MAPPING_KEY, input);

// Type-based mapping (alternative)
const response = mappingService.mapTypes(sourceInstance, DestinationClass);
const responses = mappingService.mapTypesArray(sourceArray, DestinationClass);
```

## How to Create a Mapping

### Step 1: Define the input interface

The input interface represents the shape of data coming from the repository query.
Property names MUST match the Prisma select shape exactly.

```typescript
// models/mapping-inputs/IProductMappingInput.ts
export interface IProductMappingInput {
    readonly id: string;
    readonly barcode: string;
    readonly name: string;
    readonly categoryId: string;
    readonly createdAt: Date;
}
```

### Step 2: Create a branded mapping key

Each key is an **exported constant** — never inline magic strings.

```typescript
// constants/MappingKeys.ts
import { createMappingKey } from '@pixel-brewery/archipel-platform-mapping';
import { IProductMappingInput } from '../models/mapping-inputs/IProductMappingInput.js';
import { ProductResponse } from '../dtos/ProductResponse.js';

export const PRODUCT_MAPPING_KEY = createMappingKey<IProductMappingInput, ProductResponse>('food.product');
```

### Step 3: Create a mapping profile

A profile extends `MappingProfileBase` and registers one or more mappings via the builder.

```typescript
// mappers/ProductMappingProfile.ts
import { MappingProfileBase, IMappingBuilder } from '@pixel-brewery/archipel-platform-mapping';
import { PRODUCT_MAPPING_KEY } from '../constants/MappingKeys.js';
import { IProductMappingInput } from '../models/mapping-inputs/IProductMappingInput.js';
import { ProductResponse } from '../dtos/ProductResponse.js';

export class ProductMappingProfile extends MappingProfileBase {
    // #region Methods

    public configure(builder: IMappingBuilder): void {
        builder.createKeyedMap(PRODUCT_MAPPING_KEY, (input: IProductMappingInput) => {
            const response = new ProductResponse();
            response.id = input.id;
            response.barcode = input.barcode;
            response.name = input.name;
            response.categoryId = input.categoryId;
            response.createdAt = input.createdAt;

            return response;
        });
    }

    // #endregion
}
```

### Step 4: Register the profile in the module

```typescript
import { MappingModule } from '@pixel-brewery/archipel-platform-mapping';
import { ProductMappingProfile } from './mappers/ProductMappingProfile.js';

@Module({
    imports: [MappingModule.withProfiles([ProductMappingProfile])],
})
export class ProductModule {}
```

### Step 5: Use in controller (NOT in service)

```typescript
@Controller('/products')
export class ProductController {
    // #region Fields

    private readonly _productService: ProductService;
    private readonly _mappingService: MappingService;

    // #endregion

    // #region Ctor

    public constructor(productService: ProductService, mappingService: MappingService) {
        this._productService = productService;
        this._mappingService = mappingService;
    }

    // #endregion

    // #region Methods

    @Get(':id')
    public async getProduct(@Param('id') id: string): Promise<ProductResponse> {
        const entity = await this._productService.findById(id);

        return this._mappingService.map(PRODUCT_MAPPING_KEY, entity);
    }

    @Get()
    public async listProducts(): Promise<ProductResponse[]> {
        const entities = await this._productService.findAll();

        return entities.map((e) => this._mappingService.map(PRODUCT_MAPPING_KEY, e));
    }

    // #endregion
}
```

## MappingBuilder Methods

The builder supports two registration flavors:

### createKeyedMap (preferred)

```typescript
builder.createKeyedMap(SOME_MAPPING_KEY, (input: TInput) => {
    const output = new TOutput();
    // ... map fields
    return output;
});
```

### createMap (type-based)

```typescript
builder.createMap(SourceClass, DestinationClass, (source: SourceClass) => {
    const dest = new DestinationClass();
    // ... map fields
    return dest;
});
```

## Error Handling

- `MappingNotRegisteredError` — thrown when a keyed mapping is not found
- `TypeMappingNotRegisteredError` — thrown when a type-based mapping is not found
- Both extend `MappingErrorBase` with a machine-readable `code` field

## Rules

1. **Mapping keys MUST be exported constants** — never inline magic strings in services or controllers.
2. **Services return entities, controllers map to responses** — services MUST NOT create response objects.
3. **One mapping key per entity→response pair** — use descriptive dot notation for the key string.
4. **Input interfaces match Prisma select shape** — property names must align exactly.
5. **Profiles extend MappingProfileBase** and are registered via `MappingModule.withProfiles()`.
6. **Use `createKeyedMap` over `createMap`** — branded keys provide better type safety.
7. **Mapping functions instantiate response classes** — use `new ResponseClass()` and assign fields.
