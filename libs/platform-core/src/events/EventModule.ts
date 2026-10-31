// #region Imports

import { Module } from '@nestjs/common';
import { EventHub } from './EventHub.js';

// #endregion

/**
 * Module that provides event hub services.
 *
 * @public
 */
// @Global()
@Module({
    providers: [EventHub],
    exports: [EventHub],
})
export class EventModule {}
