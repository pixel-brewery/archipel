import type * as DMMF from '@prisma/dmmf';
import { describe, expect, it } from 'vitest';
import { JsonSchemaTypeMapper, type IJsonSchemaFieldContext } from './JsonSchemaTypeMapper.js';

/**
 * Creates a minimal DMMF.Field with Prisma 7 required properties.
 */
const field = (overrides: Partial<DMMF.Field> & Pick<DMMF.Field, 'name' | 'kind' | 'type'>): DMMF.Field =>
    ({
        isRequired: true,
        isList: false,
        isUnique: false,
        isId: false,
        isReadOnly: false,
        hasDefaultValue: false,
        ...overrides,
    }) as DMMF.Field;

describe('JsonSchemaTypeMapper', () => {
    const mapper = new JsonSchemaTypeMapper();
    const context: IJsonSchemaFieldContext = {
        currentModelName: 'User',
        modelFileLookup: new Map([
            ['User', 'User.schema.json'],
            ['Profile', 'Profile.schema.json'],
        ]),
        enumFileLookup: new Map([['Role', 'Role.schema.json']]),
    };

    it('resolves scalar, enum, relation, and nullable list fields', () => {
        const scalarField = field({ name: 'id', kind: 'scalar', type: 'String', isId: true });
        const enumField = field({ name: 'role', kind: 'enum', type: 'Role' });
        const relationField = field({ name: 'profile', kind: 'object', type: 'Profile' });
        const selfRelationField = field({ name: 'manager', kind: 'object', type: 'User', isRequired: false });
        const nullableListField = field({ name: 'tags', kind: 'scalar', type: 'String', isRequired: false, isList: true });
        const jsonField = field({ name: 'metadata', kind: 'scalar', type: 'Json', isRequired: false });

        expect(mapper.resolve(scalarField, context)).toEqual({ type: 'string' });
        expect(mapper.resolve(enumField, context)).toEqual({ $ref: './Role.schema.json' });
        expect(mapper.resolve(relationField, context)).toEqual({ $ref: './Profile.schema.json' });
        expect(mapper.resolve(selfRelationField, context)).toEqual({
            anyOf: [{ $ref: '#' }, { type: 'null' }],
        });
        expect(mapper.resolve(nullableListField, context)).toEqual({
            type: ['array', 'null'],
            items: { type: 'string' },
        });
        expect(mapper.resolve(jsonField, context)).toEqual({
            type: ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'],
        });
    });
});
