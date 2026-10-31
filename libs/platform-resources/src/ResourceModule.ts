// #region Imports

import { Module, DynamicModule, Global } from '@nestjs/common';
import { ResourceManager, IResourceManagerConfig } from './ResourceManager.js';

// #endregion

/**
 * Module providing the ResourceManager.
 *
 * @public
 */
@Global()
@Module({})
export class ResourceModule {
    // #region Methods

    /**
     * Registers the ResourceManager with the provided configuration.
     *
     * @public
     * @param config The resource manager configuration
     * @returns A dynamic module
     */
    public static forRoot(config: IResourceManagerConfig): DynamicModule {
        return {
            module: ResourceModule,
            providers: [
                {
                    provide: ResourceManager,
                    useFactory: () => {
                        const resourceManager = new ResourceManager(config);

                        if (config.debug) {
                            resourceManager.whatDoIHave();
                        }

                        return resourceManager;
                    },
                },
            ],
            exports: [ResourceManager],
        };
    }

    // #endregion
}
