// #region Imports

import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { SseHub } from './services/SseHub.js';

// #endregion

/**
 * Represents the `ISseModuleConfig` interface.
 *
 * @public
 */
export interface ISseModuleConfig {
    // #region Properties

    events: Array<string>;

    // #endregion
}

/**
 * Represents the `SseModule` class.
 *
 * @public
 */
@Global()
@Module({
    imports: [HttpModule],
    providers: [SseHub],
    exports: [SseHub],
})
export class SseModule {
    // #region Methods

    public static register(config: ISseModuleConfig): DynamicModule {
        return {
            module: SseModule,
            providers: [
                {
                    provide: SseHub,
                    useFactory: () => {
                        const sse = new SseHub();
                        config.events.forEach((event) => sse.registerEvent(event));
                        return sse;
                    },
                },
            ],
            exports: [SseHub],
        };
    }

    // #endregion
}
