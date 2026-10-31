// #region Imports

import { Module, DynamicModule, Provider, Type } from '@nestjs/common';
import { MappingService } from './MappingService.js';
import { IMappingProfile } from './profile/interfaces/IMappingProfile.js';

// #endregion

/**
 * Module that provides mapping services and allows registration of mapping profiles.
 *
 * @public
 */
// @Global()
@Module({
    providers: [MappingService],
    exports: [MappingService],
})
export class MappingModule {
    /**
     * Configures the module with the given mapping profiles.
     *
     * @public
     * @param profiles - An array of mapping profile types to register.
     * @returns A dynamic module with the specified profiles registered.
     */
    public static withProfiles(profiles: Array<Type<IMappingProfile>>): DynamicModule {
        const profileProviders: Provider[] = profiles.map((x) => ({
            provide: x,
            useClass: x,
        }));

        return {
            module: MappingModule,
            providers: [
                ...profileProviders,
                {
                    provide: 'MAPPING_PROFILE_BOOTSTRAP',
                    useFactory: (service: MappingService, ...instances: IMappingProfile[]) => {
                        for (const inst of instances) service.registerProfile(inst);
                        return true;
                    },
                    inject: [MappingService, ...profiles],
                },
            ],
            exports: [MappingService],
        };
    }
}
