import type { NestApplicationOptions } from '@nestjs/common';

/**
 * CORS options accepted by the security bootstrap step.
 *
 * @public
 */
export type PlatformCorsOptions = Exclude<NestApplicationOptions['cors'], boolean | undefined>;
