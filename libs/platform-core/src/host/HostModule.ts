// #region Imports

import { Global, Module } from '@nestjs/common';
import { HostService } from '../services/HostService.js';
import { ContentTemplateEngine } from '../templates/ContentTemplateEngine.js';

// #endregion

/**
 * The `HostModule` provides host-related services globally.
 *
 * This module exports:
 * - `HostService`: Provides access to host configuration (host URL, stage, version, etc.)
 * - `ContentTemplateEngine`: Template engine for rendering dynamic content
 *
 * @remarks
 * This module is marked as `@Global()` so it only needs to be imported once
 * in the root `AppModule`. All services are then available throughout the application.
 *
 * @public
 */
@Global()
@Module({
    providers: [ContentTemplateEngine, HostService],
    exports: [ContentTemplateEngine, HostService],
})
export class HostModule {}
