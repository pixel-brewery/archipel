import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';

/**
 * Options for wrapping an existing NestJS application with Archipel platform bootstrap support.
 *
 * @public
 */
export interface IPlatformApplicationOptions {
    /** Explicit configuration service to use instead of resolving it from the NestJS container. */
    readonly configService?: ConfigService;
}
