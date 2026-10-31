import { INestApplication } from '@nestjs/common';
import { PlatformBootstrapContext } from '../context/PlatformBootstrapContext.js';
import { PlatformBootstrapNext } from './PlatformBootstrapNext.js';

/**
 * A composable bootstrap step in the platform application pipeline.
 *
 * @public
 */
export type PlatformBootstrapStep<TApplication extends INestApplication = INestApplication> = (
    context: PlatformBootstrapContext<TApplication>,
    next: PlatformBootstrapNext,
) => Promise<void> | void;
