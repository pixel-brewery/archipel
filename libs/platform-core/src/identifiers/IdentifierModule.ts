// #region Imports

import { DynamicModule, Module } from '@nestjs/common';
import { CUIDGenerator } from './generators/CUIDGenerator.js';
import { GUIDGenerator } from './generators/GUIDGenerator.js';
import { UUIDGenerator } from './generators/UUIDGenerator.js';
import { ID_GENERATOR_TOKEN } from './tokens/IdentifierTokens.js';

// #endregion

@Module({
    providers: [
        CUIDGenerator,
        GUIDGenerator,
        UUIDGenerator,
        {
            provide: ID_GENERATOR_TOKEN,
            useClass: CUIDGenerator,
        },
    ],
    exports: [CUIDGenerator, GUIDGenerator, UUIDGenerator],
})
export class IdentifierModule {
    public static register(type: 'UUID' | 'GUID' | 'CUID'): DynamicModule {
        const generatorMap = {
            UUID: UUIDGenerator,
            GUID: GUIDGenerator,
            CUID: CUIDGenerator,
        } as const;

        const generatorClass = generatorMap[type];
        if (!generatorClass) {
            throw new Error(`Unknown generator type: ${String(type)}`);
        }

        const provider = {
            provide: ID_GENERATOR_TOKEN,
            useClass: generatorClass,
        };

        return {
            module: IdentifierModule,
            providers: [provider],
            exports: [provider],
        };
    }
}
