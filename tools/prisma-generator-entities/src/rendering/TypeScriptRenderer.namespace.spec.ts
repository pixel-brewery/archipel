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
 * Creates a minimal DMMF.EnumValue with Prisma 7 required properties.
 */
const enumValue = (name: string): DMMF.EnumValue =>
    ({
        name,
        dbName: null,
    }) as DMMF.EnumValue;

describe('TypeScriptRenderer - Namespace Feature', () => {
    const baseConfig: IEntityGeneratorConfig = {
        fileName: 'entities.ts',
        entityFileSuffix: '.entity.ts',
        useReadonlyArray: true,
        generateModels: true,
        generateEnums: true,
        usePrismaEnumsWhenDisabled: true,
        namespaceName: '',
        modelNamingConventionPrefix: 'I',
        modelNamingConventionSuffix: '',
        enumNamingConventionPrefix: '',
        enumNamingConventionSuffix: '',
    };

    const createTestDatamodel = (): DMMF.Datamodel =>
        datamodel({
            enums: [
                {
                    name: 'Role',
                    values: [enumValue('ADMIN'), enumValue('USER')],
                } as DMMF.DatamodelEnum,
            ],
            models: [
                model({
                    name: 'User',
                    fields: [field({ name: 'id', kind: 'scalar', type: 'String', isId: true }), field({ name: 'role', kind: 'enum', type: 'Role' })],
                }),
            ],
        });

    it('generates flat exports when namespaceName is empty', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            namespaceName: '',
        });

        const dm = createTestDatamodel();
        const output = renderer.render(dm);

        // Should have regular export declarations
        expect(output.primaryFile.content).toContain("export * from './Role.js';");
        expect(output.primaryFile.content).toContain("export type { IUser } from './IUser.entity.js';");

        // Should NOT have namespace
        expect(output.primaryFile.content).not.toContain('export declare namespace');
        expect(output.primaryFile.content).not.toContain('Entities');
    });

    it('generates namespaced exports when namespaceName is provided', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            namespaceName: 'Entities',
        });

        const dm = createTestDatamodel();
        const output = renderer.render(dm);

        const content = output.primaryFile.content;

        // Should have namespace declaration (ts-morph adds 'declare' for ambient contexts)
        expect(content).toMatch(/export (declare )?namespace Entities \{/);

        // Should have imports BEFORE namespace (not direct exports)
        expect(content).toContain("import * as _Role from './Role.js';");
        expect(content).toContain("import type { IUser } from './IUser.entity.js';");

        // Should have namespace exports
        expect(content).toContain('export import Role = _Role.Role;');
        expect(content).toContain('export type Role = _Role.Role;');
        expect(content).toContain('export type { IUser };');

        // Should NOT have flat exports
        expect(content).not.toContain("export * from './Role.js';");
        expect(content).not.toContain("export type { IUser } from './IUser.entity.js';");

        // Verify imports come BEFORE namespace
        const importIndex = content.indexOf('import * as _Role');
        const namespaceMatch = content.match(/export (declare )?namespace Entities \{/);
        const namespaceIndex = namespaceMatch ? content.indexOf(namespaceMatch[0]) : -1;
        expect(importIndex).toBeGreaterThan(-1);
        expect(namespaceIndex).toBeGreaterThan(-1);
        expect(importIndex).toBeLessThan(namespaceIndex);
    });

    it('uses custom namespace name when provided', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            namespaceName: 'MyCustomEntities',
        });

        const dm = createTestDatamodel();
        const output = renderer.render(dm);

        expect(output.primaryFile.content).toMatch(/export (declare )?namespace MyCustomEntities \{/);
        expect(output.primaryFile.content).not.toMatch(/export (declare )?namespace Entities \{/);
    });

    it('handles models-only generation with namespace', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            namespaceName: 'Entities',
            generateEnums: false,
            usePrismaEnumsWhenDisabled: true,
        });

        const dm = createTestDatamodel();
        const output = renderer.render(dm);

        const content = output.primaryFile.content;

        // Should have namespace with only models
        expect(content).toMatch(/export (declare )?namespace Entities \{/);
        expect(content).toContain('export type { IUser };');

        // Should not have enum imports/exports
        expect(content).not.toContain('_Role');

        // No enum files should be generated
        const enumFiles = output.supportingFiles.filter((f) => f.fileName.includes('Role'));
        expect(enumFiles.length).toBe(0);
    });

    it('handles enums-only generation with namespace', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            namespaceName: 'Entities',
            generateModels: false,
            generateEnums: true,
        });

        const dm = createTestDatamodel();
        const output = renderer.render(dm);

        const content = output.primaryFile.content;

        // Should have namespace with only enums
        expect(content).toMatch(/export (declare )?namespace Entities \{/);
        expect(content).toContain("import * as _Role from './Role.js';");
        expect(content).toContain('export import Role = _Role.Role;');
        expect(content).toContain('export type Role = _Role.Role;');

        // Should not have model imports/exports
        expect(content).not.toContain('IUser');

        // No model files should be generated
        const modelFiles = output.supportingFiles.filter((f) => f.fileName.includes('IUser'));
        expect(modelFiles.length).toBe(0);
    });

    it('generates nothing when both generateModels and generateEnums are false', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            namespaceName: 'Entities',
            generateModels: false,
            generateEnums: false,
        });

        const dm = createTestDatamodel();
        const output = renderer.render(dm);

        const content = output.primaryFile.content;

        // Should have comment about no generation
        expect(content).toContain('// No entities generated');
        expect(content).toContain('generateModels is disabled');
        expect(content).toContain('generateEnums is disabled');

        // Should NOT have namespace
        expect(content).not.toContain('export namespace');
    });

    it('handles multiple models and enums in namespace', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            namespaceName: 'V2',
        });

        const dm = datamodel({
            enums: [
                { name: 'Role', values: [enumValue('ADMIN')] } as DMMF.DatamodelEnum,
                { name: 'Status', values: [enumValue('ACTIVE')] } as DMMF.DatamodelEnum,
            ],
            models: [
                model({
                    name: 'User',
                    fields: [field({ name: 'id', kind: 'scalar', type: 'String', isId: true })],
                }),
                model({
                    name: 'Post',
                    fields: [field({ name: 'id', kind: 'scalar', type: 'String', isId: true })],
                }),
            ],
        });

        const output = renderer.render(dm);
        const content = output.primaryFile.content;

        // Should have namespace
        expect(content).toMatch(/export (declare )?namespace V2 \{/);

        // Should have all enum imports
        expect(content).toContain("import * as _Role from './Role.js';");
        expect(content).toContain("import * as _Status from './Status.js';");

        // Should have all model imports
        expect(content).toContain("import type { IUser } from './IUser.entity.js';");
        expect(content).toContain("import type { IPost } from './IPost.entity.js';");

        // Should have all enum exports in namespace
        expect(content).toContain('export import Role = _Role.Role;');
        expect(content).toContain('export type Role = _Role.Role;');
        expect(content).toContain('export import Status = _Status.Status;');
        expect(content).toContain('export type Status = _Status.Status;');

        // Should have all model exports in namespace
        expect(content).toContain('export type { IUser };');
        expect(content).toContain('export type { IPost };');

        // Verify proper structure: imports -> namespace -> exports
        const firstImportIndex = content.indexOf('import * as _Role');
        const namespaceMatch = content.match(/export (declare )?namespace V2 \{/);
        const namespaceIndex = namespaceMatch ? content.indexOf(namespaceMatch[0]) : -1;
        const firstExportIndex = content.indexOf('export import Role');

        expect(firstImportIndex).toBeGreaterThan(-1);
        expect(namespaceIndex).toBeGreaterThan(-1);
        expect(firstExportIndex).toBeGreaterThan(-1);
        expect(firstImportIndex).toBeLessThan(namespaceIndex);
        expect(namespaceIndex).toBeLessThan(firstExportIndex);
    });

    it('respects naming conventions in namespace mode', () => {
        const renderer = new TypeScriptRenderer({
            ...baseConfig,
            namespaceName: 'Entities',
            modelNamingConventionPrefix: 'I',
            modelNamingConventionSuffix: 'Entity',
            enumNamingConventionPrefix: 'E',
            enumNamingConventionSuffix: 'Enum',
        });

        const dm = createTestDatamodel();
        const output = renderer.render(dm);

        const content = output.primaryFile.content;

        // Should respect model naming convention in import and export
        expect(content).toContain("import type { IUserEntity } from './IUserEntity.entity.js';");
        expect(content).toContain('export type { IUserEntity };');

        // Should respect enum naming convention in file path
        // Note: namespace import uses original name (_Role), but file name uses naming convention
        expect(content).toContain("import * as _Role from './ERoleEnum.js';");
        expect(content).toContain('export import Role = _Role.Role;');
        expect(content).toContain('export type Role = _Role.Role;');

        // Verify enum file was created with naming convention
        const enumFile = output.supportingFiles.find((f) => f.fileName === 'ERoleEnum.ts');
        expect(enumFile).toBeDefined();
        expect(enumFile?.content).toContain('export const Role = {');
        expect(enumFile?.content).toContain('export type Role = typeof Role[keyof typeof Role];');
    });
});
