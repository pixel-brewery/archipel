import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Prisma } from '@prisma/client';
import { RepositoryError } from '../../models/errors/RepositoryError.js';
import { RepositoryErrorKinds } from '../../models/errors/RepositoryErrorKinds.js';
import { IRepositoryDatabase } from '../../types/IRepositoryDatabase.js';
import { IRepositoryQuery } from '../queries/IRepositoryQuery.js';
import { RepositoryBase } from './RepositoryBase.js';

vi.mock('@prisma/client/runtime/client', () => ({
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
        public code: string;
        public meta?: Record<string, unknown>;
        public clientVersion: string;
        public batchRequestIdx?: number;
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
        public batchRequestIdx?: number;
        public constructor(message: string, opts: { clientVersion: string }) {
            super(message);
            this.name = 'PrismaClientUnknownRequestError';
            this.clientVersion = opts.clientVersion;
        }
    },
}));

import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/client';

type MockDelegate = Record<string, (...args: Array<unknown>) => Promise<unknown>> &
    Record<
        | 'aggregate'
        | 'count'
        | 'create'
        | 'createMany'
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
        (args: unknown) => Promise<unknown>
    >;

class TestRepository extends RepositoryBase<MockDelegate, Record<string, unknown>, Record<string, unknown>, { id: string }> {
    public constructor(db: IRepositoryDatabase, model: MockDelegate) {
        super(db, model);
    }

    public override findUnique<TResult = unknown>(args: unknown): Promise<TResult> {
        return super.findUnique(args);
    }

    public override findFirst<TResult = unknown>(args: unknown): Promise<TResult> {
        return super.findFirst(args);
    }

    public override create<TResult = unknown>(args: unknown): Promise<TResult> {
        return super.create(args);
    }

    public override merge<TResult = unknown>(entity: Partial<{ id: string }> & { id: string }): Promise<TResult> {
        return super.merge(entity);
    }
}

class StructurallyCompatibleDatabase {
    private readonly _configService = { source: 'alternative-database' };

    public transactionCallback<TResult>(_callback: (transaction: Prisma.TransactionClient) => Promise<TResult>): Promise<TResult> {
        return Promise.reject(new Error(`${this._configService.source} transaction is not configured`));
    }
}

describe('RepositoryBase', () => {
    // #region Fields

    let repository: TestRepository;
    let mockModel: MockDelegate;
    let mockDb: IRepositoryDatabase;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockModel = {
            findUnique: vi.fn(),
            findFirst: vi.fn(),
            findMany: vi.fn(),
            create: vi.fn(),
            createMany: vi.fn(),
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

        mockDb = {
            transactionCallback: vi.fn(),
        };

        repository = new TestRepository(mockDb, mockModel);
    });

    // #endregion

    // #region Methods

    describe('execute', () => {
        it('should execute a query against the model', async () => {
            // arrange
            const mockQuery: IRepositoryQuery<MockDelegate, { id: string }> = {
                name: 'testQuery',
                run: vi.fn().mockResolvedValue({ id: '1' }),
            };

            // act
            const result = await repository.execute(mockQuery);

            // assert
            expect(mockQuery.run).toHaveBeenCalledWith(mockModel);
            expect(result).toEqual({ id: '1' });
        });
    });

    describe('executeTransactional', () => {
        it('should execute a transactional query via database service', async () => {
            // arrange
            vi.mocked(mockDb.transactionCallback).mockImplementation(async (fn) => fn({} as never));
            const mockQuery = {
                name: 'txQuery',
                run: vi.fn().mockResolvedValue({ id: 'tx-1' }),
            };

            // act
            const result = await repository.executeTransactional(mockQuery);

            // assert
            expect(result).toEqual({ id: 'tx-1' });
            expect(mockDb.transactionCallback).toHaveBeenCalled();
        });
    });

    describe('database port', () => {
        it('should accept a structurally compatible database service with private state', () => {
            // arrange
            const alternativeDatabase = new StructurallyCompatibleDatabase();

            // act
            const createRepository = () => new TestRepository(alternativeDatabase, mockModel);

            // assert
            expect(createRepository).not.toThrow();
        });
    });

    describe('findUnique', () => {
        it('should delegate to model.findUnique', async () => {
            // arrange
            vi.mocked(mockModel.findUnique).mockResolvedValue({ id: '1', name: 'Test' });

            // act
            const result = await repository.findUnique({ where: { id: '1' } });

            // assert
            expect(mockModel.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
            expect(result).toEqual({ id: '1', name: 'Test' });
        });
    });

    describe('create', () => {
        it('should delegate to model.create', async () => {
            // arrange
            vi.mocked(mockModel.create).mockResolvedValue({ id: 'new-1' });

            // act
            const result = await repository.create({ data: { name: 'New' } });

            // assert
            expect(mockModel.create).toHaveBeenCalledWith({ data: { name: 'New' } });
            expect(result).toEqual({ id: 'new-1' });
        });
    });

    describe('merge', () => {
        it('should update entity by id', async () => {
            // arrange
            vi.mocked(mockModel.update).mockResolvedValue({ id: '1', name: 'Updated' });

            // act
            const result = await repository.merge({ id: '1', name: 'Updated' } as never);

            // assert
            expect(mockModel.update).toHaveBeenCalled();
            expect(result).toEqual({ id: '1', name: 'Updated' });
        });

        it('should throw when entity has no id', async () => {
            // act & assert
            await expect(repository.merge({} as never)).rejects.toThrow('Entity must have an ID');
        });
    });

    describe('tryCatch error handling', () => {
        it('should wrap PrismaClientKnownRequestError as RepositoryError', async () => {
            // arrange
            const prismaError = new PrismaClientKnownRequestError('Unique constraint', {
                code: 'P2002',
                clientVersion: '5.0.0',
            });
            vi.mocked(mockModel.findUnique).mockRejectedValue(prismaError);

            // act & assert
            await expect(repository.findUnique({ where: { id: '1' } })).rejects.toThrow('Prisma Client Known Request Error');
        });

        it('should wrap PrismaClientUnknownRequestError as RepositoryError', async () => {
            // arrange
            const prismaError = new PrismaClientUnknownRequestError('Unknown', { clientVersion: '5.0.0' });
            vi.mocked(mockModel.findFirst).mockRejectedValue(prismaError);

            // act & assert
            await expect(repository.findFirst({ where: {} })).rejects.toThrow('Prisma Client Unknown Request Error');
        });

        it('should rethrow non-Prisma errors as-is', async () => {
            // arrange
            vi.mocked(mockModel.create).mockRejectedValue(new Error('Generic failure'));

            // act & assert
            await expect(repository.create({ data: {} })).rejects.toThrow('Generic failure');
        });

        it('should classify a unique constraint violation', async () => {
            // arrange
            const prismaError = new PrismaClientKnownRequestError('Unique constraint failed', { code: 'P2002', clientVersion: '7.10.0' });
            vi.mocked(mockModel.create).mockRejectedValue(prismaError);

            // act
            const failure = await repository.create({ data: {} }).catch((error: unknown) => error);

            // assert
            expect(failure).toBeInstanceOf(RepositoryError);
            expect(failure).toMatchObject({ code: 'REPOSITORY_ERROR', originalCode: 'R_KNOWN', kind: RepositoryErrorKinds.UniqueConstraintViolation });
        });

        it('should wrap a known request error from another Prisma client copy', async () => {
            // arrange
            const prismaError = Object.assign(new Error('Unique constraint failed'), {
                name: 'PrismaClientKnownRequestError',
                code: 'P2002',
                clientVersion: '7.10.0',
            });
            vi.mocked(mockModel.create).mockRejectedValue(prismaError);

            // act
            const failure = await repository.create({ data: {} }).catch((error: unknown) => error);

            // assert
            expect(failure).toBeInstanceOf(RepositoryError);
            expect(failure).toMatchObject({ kind: RepositoryErrorKinds.UniqueConstraintViolation });
        });

        it('should not wrap an unrelated error that only shares a Prisma-shaped code', async () => {
            // arrange
            const failure = Object.assign(new Error('Application failure'), { code: 'P2002' });
            vi.mocked(mockModel.create).mockRejectedValue(failure);

            // act
            const caught = await repository.create({ data: {} }).catch((error: unknown) => error);

            // assert
            expect(caught).toBe(failure);
        });

        it('should classify a write that matched no record as record not found', async () => {
            // arrange
            const prismaError = new PrismaClientKnownRequestError('Record to update not found.', { code: 'P2025', clientVersion: '7.10.0' });
            vi.mocked(mockModel.findUnique).mockRejectedValue(prismaError);

            // act
            const failure = await repository.findUnique({ where: { id: '1' } }).catch((error: unknown) => error);

            // assert
            expect(failure).toMatchObject({ kind: RepositoryErrorKinds.RecordNotFound });
        });

        it('should leave an unknown request failure unclassified', async () => {
            // arrange
            const prismaError = new PrismaClientUnknownRequestError('Unknown', { clientVersion: '7.10.0' });
            vi.mocked(mockModel.findFirst).mockRejectedValue(prismaError);

            // act
            const failure = await repository.findFirst({ where: {} }).catch((error: unknown) => error);

            // assert
            expect(failure).toMatchObject({ originalCode: 'R_UNKNOWN', kind: RepositoryErrorKinds.Unclassified });
        });
    });

    // #endregion
});
