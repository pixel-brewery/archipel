// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { aggregate } from './aggregate.js';
import { aggregateRaw } from './aggregateRaw.js';
import { count } from './count.js';
import { create } from './create.js';
import { createMany } from './createMany.js';
import { createManyAndReturn } from './createManyAndReturn.js';
import { remove } from './delete.js';
import { removeMany } from './deleteMany.js';
import { findFirst } from './findFirst.js';
import { findFirstOrThrow } from './findFirstOrThrow.js';
import { findMany } from './findMany.js';
import { findRaw } from './findRaw.js';
import { findUnique } from './findUnique.js';
import { findUniqueOrThrow } from './findUniqueOrThrow.js';
import { groupBy } from './groupBy.js';
import { update } from './update.js';
import { updateMany } from './updateMany.js';
import { updateManyAndReturn } from './updateManyAndReturn.js';
import { upsert } from './upsert.js';

// #endregion

// #region Tests

describe('repository2 operators', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    const operatorCases: Array<{
        name: string;
        factory: (args: unknown) => (delegate: Record<string, unknown>) => unknown;
        delegateMethod: string;
    }> = [
        { name: 'aggregate', factory: aggregate, delegateMethod: 'aggregate' },
        { name: 'aggregateRaw', factory: aggregateRaw, delegateMethod: 'aggregateRaw' },
        { name: 'count', factory: count, delegateMethod: 'count' },
        { name: 'create', factory: create, delegateMethod: 'create' },
        { name: 'createMany', factory: createMany, delegateMethod: 'createMany' },
        { name: 'createManyAndReturn', factory: createManyAndReturn, delegateMethod: 'createManyAndReturn' },
        { name: 'remove (delete)', factory: remove, delegateMethod: 'delete' },
        { name: 'removeMany (deleteMany)', factory: removeMany, delegateMethod: 'deleteMany' },
        { name: 'findFirst', factory: findFirst, delegateMethod: 'findFirst' },
        { name: 'findFirstOrThrow', factory: findFirstOrThrow, delegateMethod: 'findFirstOrThrow' },
        { name: 'findMany', factory: findMany, delegateMethod: 'findMany' },
        { name: 'findRaw', factory: findRaw, delegateMethod: 'findRaw' },
        { name: 'findUnique', factory: findUnique, delegateMethod: 'findUnique' },
        { name: 'findUniqueOrThrow', factory: findUniqueOrThrow, delegateMethod: 'findUniqueOrThrow' },
        { name: 'groupBy', factory: groupBy, delegateMethod: 'groupBy' },
        { name: 'update', factory: update, delegateMethod: 'update' },
        { name: 'updateMany', factory: updateMany, delegateMethod: 'updateMany' },
        { name: 'updateManyAndReturn', factory: updateManyAndReturn, delegateMethod: 'updateManyAndReturn' },
        { name: 'upsert', factory: upsert, delegateMethod: 'upsert' },
    ];

    it.each(operatorCases)('$name should forward args to delegate.$delegateMethod', ({ factory, delegateMethod }) => {
        // arrange
        const expectedResult = { id: 'abc' };
        const delegate: Record<string, ReturnType<typeof vi.fn>> = {
            [delegateMethod]: vi.fn().mockReturnValue(expectedResult),
        };
        const args = { where: { id: '1' } };

        // act
        const operator = factory(args as never);
        const result = operator(delegate as never);

        // assert
        expect(delegate[delegateMethod]).toHaveBeenCalledWith(args);
        expect(result).toBe(expectedResult);
    });
});

// #endregion
