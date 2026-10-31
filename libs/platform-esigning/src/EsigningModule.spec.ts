// #region Imports

import { describe, expect, it } from 'vitest';
import { EsigningClientBase } from './abstracts/EsigningClientBase.js';
import { EsigningPersistenceBase } from './abstracts/EsigningPersistenceBase.js';
import { EsigningModule, type IEsigningModuleOptions } from './EsigningModule.js';
import { InternalEsigningProvider } from './providers/internal/InternalEsigningProvider.js';
import { EsigningService } from './services/EsigningService.js';

// #endregion

// #region Helpers

class StubPersistence extends EsigningPersistenceBase {
    public async onSigningRequestCreated(): Promise<void> {
        /* noop */
    }

    public async onSigningRequestStatusChanged(): Promise<void> {
        /* noop */
    }

    public async onSigningRequestCancelled(): Promise<void> {
        /* noop */
    }
}

// #endregion

describe('EsigningModule', () => {
    // #region Methods

    describe('register', () => {
        it('should return a DynamicModule with the correct module reference', () => {
            // arrange
            const options: IEsigningModuleOptions = {
                provider: InternalEsigningProvider,
            };

            // act
            const result = EsigningModule.register(options);

            // assert
            expect(result.module).toBe(EsigningModule);
        });

        it('should include EsigningClientBase and EsigningService in exports', () => {
            // arrange
            const options: IEsigningModuleOptions = {
                provider: InternalEsigningProvider,
            };

            // act
            const result = EsigningModule.register(options);

            // assert
            expect(result.exports).toContain(EsigningClientBase);
            expect(result.exports).toContain(EsigningService);
        });

        it('should register the specified provider for EsigningClientBase', () => {
            // arrange
            const options: IEsigningModuleOptions = {
                provider: InternalEsigningProvider,
            };

            // act
            const result = EsigningModule.register(options);

            // assert
            const providerDef = (result.providers as Array<{ provide: unknown; useClass: unknown }>)?.find(
                (p) => typeof p === 'object' && 'provide' in p && p.provide === EsigningClientBase,
            );
            expect(providerDef).toBeDefined();
            expect(providerDef?.useClass).toBe(InternalEsigningProvider);
        });

        it('should include EsigningService in providers', () => {
            // arrange
            const options: IEsigningModuleOptions = {
                provider: InternalEsigningProvider,
            };

            // act
            const result = EsigningModule.register(options);

            // assert
            expect(result.providers).toContain(EsigningService);
        });

        it('should register the persistence port when persistence is provided', () => {
            // arrange
            const options: IEsigningModuleOptions = {
                provider: InternalEsigningProvider,
                persistence: StubPersistence,
            };

            // act
            const result = EsigningModule.register(options);

            // assert
            const persistenceDef = (result.providers as Array<{ provide: unknown; useClass: unknown }>)?.find(
                (p) => typeof p === 'object' && 'provide' in p && p.provide === EsigningPersistenceBase,
            );
            expect(persistenceDef).toBeDefined();
            expect(persistenceDef?.useClass).toBe(StubPersistence);
        });

        it('should not include persistence port when persistence is omitted', () => {
            // arrange
            const options: IEsigningModuleOptions = {
                provider: InternalEsigningProvider,
            };

            // act
            const result = EsigningModule.register(options);

            // assert
            const persistenceDef = (result.providers as Array<{ provide: unknown; useClass: unknown }>)?.find(
                (p) => typeof p === 'object' && 'provide' in p && p.provide === EsigningPersistenceBase,
            );
            expect(persistenceDef).toBeUndefined();
        });

        it('should set global to false by default', () => {
            // arrange
            const options: IEsigningModuleOptions = {
                provider: InternalEsigningProvider,
            };

            // act
            const result = EsigningModule.register(options);

            // assert
            expect(result.global).toBe(false);
        });

        it('should set global to true when isGlobal is specified', () => {
            // arrange
            const options: IEsigningModuleOptions = {
                provider: InternalEsigningProvider,
                isGlobal: true,
            };

            // act
            const result = EsigningModule.register(options);

            // assert
            expect(result.global).toBe(true);
        });

        it('should include ConfigModule in imports', () => {
            // arrange
            const options: IEsigningModuleOptions = {
                provider: InternalEsigningProvider,
            };

            // act
            const result = EsigningModule.register(options);

            // assert
            expect(result.imports).toBeDefined();
            expect(result.imports).toHaveLength(1);
        });
    });

    // #endregion
});
