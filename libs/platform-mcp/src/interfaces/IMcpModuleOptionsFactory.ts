import type { IMcpModuleOptions } from './IMcpModuleOptions.js';

/**
 * Factory interface for creating MCP module options.
 */
export interface IMcpModuleOptionsFactory {
    /**
     * Supplies the server configuration requested during asynchronous module composition.
     *
     * @returns Server options, synchronously or after application configuration has resolved.
     */
    createMcpOptions(): IMcpModuleOptions | Promise<IMcpModuleOptions>;
}
