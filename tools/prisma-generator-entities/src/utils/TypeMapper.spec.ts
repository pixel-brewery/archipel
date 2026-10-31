import type * as DMMF from '@prisma/dmmf';
import { describe, expect, it } from 'vitest';
import { TypeMapper } from './TypeMapper.js';

describe('TypeMapper', () => {
    it('resolves scalar, enum, relation, and unsupported field types', () => {
        const mapper = new TypeMapper(true, '', '');

        const scalarField: DMMF.Field = {
            name: 'id',
            kind: 'scalar',
            type: 'String',
            isRequired: true,
            isList: false,
            isUnique: false,
            isId: true,
            isReadOnly: false,
            hasDefaultValue: false,
        };

        const enumField: DMMF.Field = {
            name: 'role',
            kind: 'enum',
            type: 'Role',
            isRequired: true,
            isList: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
        };

        const relationField: DMMF.Field = {
            name: 'profile',
            kind: 'object',
            type: 'Profile',
            isRequired: true,
            isList: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
        };

        const unsupportedField: DMMF.Field = {
            name: 'unsupported',
            kind: 'unsupported' as DMMF.FieldKind,
            type: 'Unsupported',
            isRequired: true,
            isList: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
        };

        expect(mapper.resolve(scalarField)).toBe('string');
        expect(mapper.resolve(enumField)).toBe('Role');
        expect(mapper.resolve(relationField)).toBe('Profile');
        expect(mapper.resolve(unsupportedField)).toBe('never');
    });

    it('applies list modifier using readonly configuration', () => {
        const readonlyMapper = new TypeMapper(true, '', '');
        const mutableMapper = new TypeMapper(false, '', '');

        expect(readonlyMapper.applyListModifier('string', true)).toBe('ReadonlyArray<string>');
        expect(mutableMapper.applyListModifier('string', true)).toBe('Array<string>');
        expect(mutableMapper.applyListModifier('string', false)).toBe('string');
    });
});
