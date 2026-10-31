import { INestApplication } from '@nestjs/common';
import { IPlatformApplicationOptions } from '../options/IPlatformApplicationOptions.js';
import { PlatformApplicationBuilder } from './PlatformApplicationBuilder.js';

/**
 * Entry point for composing an existing NestJS application with Archipel bootstrap steps.
 *
 * @public
 */
export class PlatformApplication {
    // #region Fields
    // #endregion

    // #region Ctor
    private constructor() {
        throw new Error('PlatformApplication is a static entry point and cannot be instantiated.');
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Wraps an already-created NestJS application in a fluent bootstrap builder.
     *
     * @public
     * @param app - The NestJS application created by the consumer.
     * @param options - Optional platform-level bootstrap dependencies.
     * @returns A platform application builder.
     */
    public static from<TApplication extends INestApplication>(
        app: TApplication,
        options?: IPlatformApplicationOptions,
    ): PlatformApplicationBuilder<TApplication> {
        return new PlatformApplicationBuilder<TApplication>(app, options);
    }

    // #endregion
}
