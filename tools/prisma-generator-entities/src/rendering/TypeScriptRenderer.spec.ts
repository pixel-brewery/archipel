import type * as DMMF from '@prisma/dmmf';
import { describe, expect, it } from 'vitest';
import type { IEntityGeneratorConfig } from '../config/IEntityGeneratorConfig.js';
import { TypeScriptRenderer } from './TypeScriptRenderer.js';

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

/**
 * Creates a minimal DMMF.Model with Prisma 7 required properties.
 */
const model = (overrides: Partial<DMMF.Model> & Pick<DMMF.Model, 'name' | 'fields'>): DMMF.Model =>
    ({
        dbName: null,
        schema: null,
        uniqueFields: [],
        uniqueIndexes: [],
        primaryKey: null,
        ...overrides,
    }) as DMMF.Model;

/**
 * Creates a minimal DMMF.Datamodel with Prisma 7 required properties.
 */
const datamodel = (overrides: Partial<DMMF.Datamodel>): DMMF.Datamodel =>
    ({
        models: [],
        enums: [],
        types: [],
        indexes: [],
        ...overrides,
    }) as DMMF.Datamodel;

/**
 * Creates a minimal DMMF.DatamodelEnum with Prisma 7 required properties.
 */
const enumType = (overrides: Partial<DMMF.DatamodelEnum> & Pick<DMMF.DatamodelEnum, 'name' | 'values'>): DMMF.DatamodelEnum =>
    ({
        ...overrides,
    }) as DMMF.DatamodelEnum;

/**
 * Creates a minimal DMMF.EnumValue with Prisma 7 required properties.
 */
const enumValue = (name: string, documentation?: string): DMMF.EnumValue =>
    ({
        name,
        dbName: null,
    }) as DMMF.EnumValue;

describe('TypeScriptRenderer', () => {
    const baseConfig: IEntityGeneratorConfig = {
        fileName: 'entities.ts',
        entityFileSuffix: '.entity.ts',
        useReadonlyArray: true,
        generateModels: true,
        generateEnums: true,
        usePrismaEnumsWhenDisabled: true,
        prismaClientImportPath: '@prisma/client',
        namespaceName: '',
        modelNamingConventionPrefix: '',
        modelNamingConventionSuffix: '',
        enumNamingConventionPrefix: '',
        enumNamingConventionSuffix: '',
        enumNamingConventionReplaceRegex: '^.*$',
        enumNamingConventionReplaceValue: 'enums',
    };

    it('renders enums and models into discrete files with documentation and readonly arrays', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            modelNamingConventionPrefix: 'I',
        });

        const dm = datamodel({
            enums: [
                enumType({
                    name: 'Role',
                    documentation: 'Represents user roles.',
                    values: [enumValue('ADMIN'), enumValue('USER')],
                }),
            ],
            models: [
                model({
                    name: 'User',
                    documentation: 'Represents an authenticated account.',
                    fields: [
                        field({ name: 'id', kind: 'scalar', type: 'String', isId: true, documentation: 'Primary identifier.' }),
                        field({ name: 'name', kind: 'scalar', type: 'String', isRequired: false }),
                        field({ name: 'roles', kind: 'enum', type: 'Role', isList: true, documentation: 'Assigned roles.' }),
                        field({
                            name: 'profile',
                            kind: 'object',
                            type: 'Profile',
                            isRequired: false,
                            documentation: 'Linked profile record.',
                        }),
                        field({ name: 'default', kind: 'scalar', type: 'Boolean', documentation: 'Reserved keyword property.' }),
                    ],
                }),
                model({
                    name: 'Profile',
                    fields: [field({ name: 'id', kind: 'scalar', type: 'Int', isId: true }), field({ name: 'user', kind: 'object', type: 'User' })],
                }),
            ],
        });

        const output = renderer.render(dm);

        expect(output.primaryFile.content).toContain("export * from './enums.js';");
        expect(output.primaryFile.content).toContain("export type { IProfile } from './IProfile.entity.js';");
        expect(output.primaryFile.content).toContain("export type { IUser } from './IUser.entity.js';");

        const enumFile = output.supportingFiles.find((f) => f.fileName === 'enums.ts');
        expect(enumFile).toBeDefined();
        expect(enumFile?.content).toContain('export const Role = {');

        const userFile = output.supportingFiles.find((f) => f.fileName === 'IUser.entity.ts');
        expect(userFile).toBeDefined();
        expect(userFile?.content).toContain("import type { Role } from './enums.js';");
        expect(userFile?.content).toContain("import type { IProfile } from './IProfile.entity.js';");
        expect(userFile?.content).toContain('export interface IUser {');
    });

    it('applies naming conventions to file names and import paths', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            entityFileSuffix: '.definition.ts',
            modelNamingConventionPrefix: 'I',
            modelNamingConventionSuffix: 'Definition',
            enumNamingConventionPrefix: 'Enum',
            enumNamingConventionSuffix: '',
            enumNamingConventionReplaceRegex: '^Role$',
            enumNamingConventionReplaceValue: 'Shared',
        });

        const dm = datamodel({
            enums: [
                enumType({
                    name: 'Role',
                    values: [enumValue('ADMIN')],
                }),
            ],
            models: [
                model({
                    name: 'User',
                    fields: [field({ name: 'role', kind: 'enum', type: 'Role' })],
                }),
            ],
        });

        const output = renderer.render(dm);

        expect(output.supportingFiles.map((file) => file.fileName)).toEqual(['EnumShared.ts', 'IUserDefinition.definition.ts']);
        expect(output.primaryFile.content).toContain("export * from './EnumShared.js';");
        expect(output.primaryFile.content).toContain("export type { IUserDefinition } from './IUserDefinition.definition.js';");
        expect(output.supportingFiles[1].content).toContain("import type { Role } from './EnumShared.js';");
    });

    it('renders a timestamp header into all files when configured', () => {
        const renderer = new TypeScriptRenderer({ ...baseConfig });

        const dm = datamodel({ enums: [], models: [] });
        const output = renderer.render(dm);

        expect(output.primaryFile.content.startsWith('// ------------------------------------------------------------------------------\n')).toBe(true);
        expect(output.supportingFiles).toEqual([]);
    });

    it('imports enums from @prisma/client when generateEnums is false and usePrismaEnumsWhenDisabled is true', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            generateEnums: false,
            usePrismaEnumsWhenDisabled: true,
        });

        const dm = datamodel({
            enums: [
                enumType({ name: 'Role', values: [enumValue('ADMIN'), enumValue('USER')] }),
                enumType({ name: 'Status', values: [enumValue('ACTIVE'), enumValue('INACTIVE')] }),
            ],
            models: [
                model({
                    name: 'User',
                    documentation: 'User model',
                    fields: [
                        field({ name: 'id', kind: 'scalar', type: 'String', isId: true }),
                        field({ name: 'role', kind: 'enum', type: 'Role' }),
                        field({ name: 'status', kind: 'enum', type: 'Status' }),
                    ],
                }),
            ],
        });

        const output = renderer.render(dm);

        // No enum files should be generated
        expect(output.supportingFiles.length).toBe(1);
        expect(output.supportingFiles[0].fileName).toBe('User.entity.ts');

        // User entity should import enums from @prisma/client
        const userEntityContent = output.supportingFiles[0].content;
        expect(userEntityContent).toContain("import type { Role, Status } from '@prisma/client';");
        expect(userEntityContent).not.toContain("import type { Role } from './");
        expect(userEntityContent).not.toContain("import type { Status } from './");

        // Index file should only export models, not enums
        expect(output.primaryFile.content).toContain("export type { User } from './User.entity.js';");
        expect(output.primaryFile.content).not.toContain('Role');
        expect(output.primaryFile.content).not.toContain('Status');
    });

    it('does not import enums when generateEnums is false and usePrismaEnumsWhenDisabled is false', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            generateEnums: false,
            usePrismaEnumsWhenDisabled: false,
        });

        const dm = datamodel({
            enums: [enumType({ name: 'Role', values: [enumValue('ADMIN')] })],
            models: [
                model({
                    name: 'User',
                    fields: [field({ name: 'id', kind: 'scalar', type: 'String', isId: true }), field({ name: 'role', kind: 'enum', type: 'Role' })],
                }),
            ],
        });

        const output = renderer.render(dm);

        // User entity should NOT have any enum imports
        const userEntityContent = output.supportingFiles[0].content;
        expect(userEntityContent).not.toContain('import type { Role }');
        expect(userEntityContent).not.toContain('@prisma/client');

        // Entity will reference Role type without import (legacy behavior - causes type errors)
        expect(userEntityContent).toContain('readonly role: Role;');
    });

    it('imports enums from generated files when generateEnums is true', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            generateEnums: true,
        });

        const dm = datamodel({
            enums: [enumType({ name: 'Role', values: [enumValue('ADMIN')] })],
            models: [
                model({
                    name: 'User',
                    fields: [field({ name: 'id', kind: 'scalar', type: 'String', isId: true }), field({ name: 'role', kind: 'enum', type: 'Role' })],
                }),
            ],
        });

        const output = renderer.render(dm);

        // Enum file should be generated
        const enumFile = output.supportingFiles.find((f) => f.fileName === 'enums.ts');
        expect(enumFile).toBeDefined();
        expect(enumFile?.content).toContain('export const Role = {');

        // User entity should import from generated enum file
        const userEntityContent = output.supportingFiles.find((f) => f.fileName === 'User.entity.ts')?.content;
        expect(userEntityContent).toContain("import type { Role } from './enums.js';");
        expect(userEntityContent).not.toContain('@prisma/client');
    });
});
