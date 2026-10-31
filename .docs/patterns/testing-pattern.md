---
title: Testing Pattern
description: Vitest conventions, mocking patterns for repositories/services/delegates, AAA structure, and test naming conventions.
order: 9
---

# Archipel Testing Pattern

## Overview

Archipel uses **Vitest** for unit and integration tests with **vi mocking**. Tests follow
the Arrange-Act-Assert (AAA) pattern with descriptive `describe`/`it` blocks. Each test
file covers a single class or module.

## Test Framework

- **Runner:** Vitest
- **Mocking:** `vi.fn()`, `vi.mock()`, `vi.spyOn()`
- **Assertions:** Vitest built-in (`expect`)
- **E2E:** Supertest against a bootstrapped NestJS app

## File Naming & Location

| Test Type | File Pattern    | Location                |
| --------- | --------------- | ----------------------- |
| Unit test | `*.spec.ts`     | Next to the source file |
| E2E test  | `*.e2e-spec.ts` | `test/` directory       |

## Basic Test Structure

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('UserService', () => {
    // #region Fields

    let service: UserService;
    let mockRepository: { execute: ReturnType<typeof vi.fn> };
    let mockMappingService: { map: ReturnType<typeof vi.fn> };

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockRepository = {
            execute: vi.fn(),
        };

        mockMappingService = {
            map: vi.fn(),
        };

        service = new UserService(mockRepository as unknown as UserRepository, mockMappingService as unknown as MappingService);
    });

    describe('findById', () => {
        it('should return entity when user exists', async () => {
            // arrange
            const mockUser = { id: '1', email: 'test@example.com', name: 'Test' };
            mockRepository.execute.mockResolvedValue(mockUser);

            // act
            const result = await service.findById('1');

            // assert
            expect(result).toEqual(mockUser);
            expect(mockRepository.execute).toHaveBeenCalledOnce();
        });

        it('should throw UserNotFoundError when user does not exist', async () => {
            // arrange
            mockRepository.execute.mockResolvedValue(null);

            // act & assert
            await expect(() => service.findById('nonexistent')).rejects.toThrow(UserNotFoundError);
        });
    });

    // #endregion
});
```

## Mocking Patterns

### Mocking Prisma Delegates (for Repository Tests)

```typescript
vi.mock('@prisma/client/runtime/client', () => ({
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
        public code: string;
        public meta?: Record<string, unknown>;
        public clientVersion: string;
        public constructor(message: string, opts: { code: string; clientVersion: string; meta?: Record<string, unknown> }) {
            super(message);
            this.name = 'PrismaClientKnownRequestError';
            this.code = opts.code;
            this.clientVersion = opts.clientVersion;
            this.meta = opts.meta;
        }
    },
    PrismaClientUnknownRequestError: class PrismaClientUnknownRequestError extends Error {
        public clientVersion: string;
        public constructor(message: string, opts: { clientVersion: string }) {
            super(message);
            this.name = 'PrismaClientUnknownRequestError';
            this.clientVersion = opts.clientVersion;
        }
    },
}));
```

### Creating a Mock Delegate

```typescript
type MockDelegate = Record<
    | 'aggregate'
    | 'count'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'delete'
    | 'deleteMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'findMany'
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'groupBy'
    | 'update'
    | 'updateMany'
    | 'upsert',
    ReturnType<typeof vi.fn>
>;

function createMockDelegate(): MockDelegate {
    return {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        createMany: vi.fn(),
        createManyAndReturn: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
        upsert: vi.fn(),
        delete: vi.fn(),
        deleteMany: vi.fn(),
        aggregate: vi.fn(),
        count: vi.fn(),
        groupBy: vi.fn(),
        findFirstOrThrow: vi.fn(),
        findUniqueOrThrow: vi.fn(),
    };
}
```

### Mocking DatabaseService

```typescript
const mockDb = {
    transactionCallback: vi.fn(),
    client: {
        user: createMockDelegate(),
    },
} as unknown as DatabaseService;
```

### Mocking a Query

```typescript
const mockQuery = {
    name: 'findUserById',
    run: vi.fn().mockResolvedValue({ id: '1', email: 'test@example.com' }),
};
```

## Repository Test Pattern

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Prisma runtime errors BEFORE importing test subject
vi.mock('@prisma/client/runtime/client', () => ({/* ... */}));
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

describe('UserRepository', () => {
    let repository: TestRepository;
    let mockModel: MockDelegate;
    let mockDb: DatabaseService;

    beforeEach(() => {
        vi.restoreAllMocks();
        mockModel = createMockDelegate();
        mockDb = { transactionCallback: vi.fn() } as unknown as DatabaseService;
        repository = new TestRepository(mockDb, mockModel);
    });

    describe('execute', () => {
        it('should execute a query against the model', async () => {
            // arrange
            const mockQuery = {
                name: 'testQuery',
                run: vi.fn().mockResolvedValue({ id: '1' }),
            };

            // act
            const result = await repository.execute(mockQuery);

            // assert
            expect(mockQuery.run).toHaveBeenCalledWith(mockModel);
            expect(result).toEqual({ id: '1' });
        });

        it('should wrap PrismaClientKnownRequestError as RepositoryError', async () => {
            // arrange
            const prismaError = new PrismaClientKnownRequestError('Not found', {
                code: 'P2025',
                clientVersion: '6.0.0',
            });
            const mockQuery = {
                name: 'failingQuery',
                run: vi.fn().mockRejectedValue(prismaError),
            };

            // act & assert
            await expect(() => repository.execute(mockQuery)).rejects.toThrow(RepositoryError);
        });
    });
});
```

## Service Test Pattern

```typescript
describe('ProductService', () => {
    let service: ProductService;
    let mockRepo: { execute: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        vi.restoreAllMocks();
        mockRepo = { execute: vi.fn() };
        service = new ProductService(mockRepo as unknown as ProductRepository);
    });

    describe('findById', () => {
        it('should return entity when found', async () => {
            // arrange
            const expected = { id: '1', name: 'Product A', barcode: '123' };
            mockRepo.execute.mockResolvedValue(expected);

            // act
            const result = await service.findById('1');

            // assert
            expect(result).toEqual(expected);
        });

        it('should throw domain error when not found', async () => {
            // arrange
            mockRepo.execute.mockResolvedValue(null);

            // act & assert
            await expect(() => service.findById('unknown')).rejects.toThrow(ProductNotFoundError);
        });
    });
});
```

## Mapping Profile Test Pattern

```typescript
describe('ProductMappingProfile', () => {
    let mappingService: MappingService;

    beforeEach(() => {
        mappingService = new MappingService();
        const profile = new ProductMappingProfile();
        mappingService.registerProfile(profile);
    });

    it('should map input to response correctly', () => {
        // arrange
        const input: IProductMappingInput = {
            id: '1',
            barcode: '123',
            name: 'Product A',
            categoryId: 'cat-1',
            createdAt: new Date('2026-01-01'),
        };

        // act
        const result = mappingService.map(PRODUCT_MAPPING_KEY, input);

        // assert
        expect(result).toBeInstanceOf(ProductResponse);
        expect(result.id).toBe('1');
        expect(result.barcode).toBe('123');
        expect(result.name).toBe('Product A');
    });
});
```

## Test Conventions

### Comments

```typescript
// Use AAA comments:
// arrange — set up test data and mocks
// act — call the method under test
// act & assert — when the assertion is on the thrown error
// assert — verify the outcome
```

### Regions

```typescript
describe('MyClass', () => {

  // #region Fields
  let service: MyService;
  // #endregion

  // #region Methods
  beforeEach(() => { ... });

  describe('methodName', () => { ... });
  // #endregion

});
```

### Naming

- `describe` blocks: Class name or method name
- `it` blocks: `'should <expected behavior> when <condition>'`

## Rules

1. **Every public service method needs at least one happy-path and one failure-path test.**
2. **Use `vi.restoreAllMocks()` in `beforeEach`** — prevent mock leakage between tests.
3. **Mock at the boundary** — mock repositories in service tests, mock delegates in repository tests.
4. **AAA pattern** — clearly separate arrange, act, assert with comments.
5. **`vi.mock()` for modules must appear before imports** of the mocked module.
6. **No real database in unit tests** — use mocks. Use Testcontainers for integration tests.
7. **Assert on behavior, not implementation** — verify return values and thrown errors, not internal calls
   (unless the call IS the behavior, e.g., verifying a repository was called).
8. **Use `mockResolvedValue` / `mockRejectedValue`** for async mocks.
