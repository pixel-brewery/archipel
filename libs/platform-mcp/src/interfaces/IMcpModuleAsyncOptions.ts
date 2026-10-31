import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';
import type { IMcpModuleOptions } from './IMcpModuleOptions.js';
import type { IMcpModuleOptionsFactory } from './IMcpModuleOptionsFactory.js';

/**
 * Async options for configuring the MCP module via a factory.
 */
export interface IMcpModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    /** Injection tokens to make available to the factory. */
    readonly inject?: (InjectionToken | OptionalFactoryDependency)[];

    /** Factory function that returns module options (or a promise). */
    readonly useFactory?: (...args: unknown[]) => IMcpModuleOptions | Promise<IMcpModuleOptions>;

    /** Optional existing provider type. */
    readonly useExisting?: Type<IMcpModuleOptionsFactory>;

    /** Optional class to instantiate as factory. */
    readonly useClass?: Type<IMcpModuleOptionsFactory>;
}
