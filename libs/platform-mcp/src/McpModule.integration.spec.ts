import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { McpTool } from './decorators/McpTool.js';
import { McpModule } from './module/McpModule.js';
import { McpDiscoveryService } from './services/McpDiscoveryService.js';
import { McpRegistryService } from './services/McpRegistryService.js';
import { McpServerService } from './services/McpServerService.js';

const DISCOVERY_CONSUMER = 'DISCOVERY_CONSUMER';

class LifecycleTool {
    public execute(): { content: Array<{ type: 'text'; text: string }> } {
        return { content: [{ type: 'text', text: 'ready' }] };
    }
}

McpTool({ name: 'lifecycle-tool', description: 'Verifies Nest lifecycle ordering' })(
    LifecycleTool.prototype,
    'execute',
    Object.getOwnPropertyDescriptor(LifecycleTool.prototype, 'execute') as PropertyDescriptor,
);

describe('McpModule (DI Integration)', () => {
    // #region Methods

    it('should resolve McpRegistryService when the module is registered', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [McpModule.register({ name: 'test-server', version: '1.0.0' })],
        }).compile();

        // act
        const registry = moduleRef.get(McpRegistryService);

        // assert
        expect(registry).toBeInstanceOf(McpRegistryService);
    });

    it('should resolve McpServerService when the module is registered', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [McpModule.register({ name: 'test-server', version: '1.0.0' })],
        }).compile();

        // act
        const server = moduleRef.get(McpServerService);

        // assert
        expect(server).toBeInstanceOf(McpServerService);
    });

    it('should export McpDiscoveryService from the synchronous registration path', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [McpModule.register({ name: 'test-server', version: '1.0.0' })],
            providers: [
                {
                    provide: DISCOVERY_CONSUMER,
                    useFactory: (discovery: McpDiscoveryService) => discovery,
                    inject: [McpDiscoveryService],
                },
            ],
        }).compile();

        // act
        const discovery = moduleRef.get<McpDiscoveryService>(DISCOVERY_CONSUMER);

        // assert
        expect(discovery).toBeInstanceOf(McpDiscoveryService);
    });

    it('should export McpDiscoveryService from the asynchronous registration path', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                McpModule.registerAsync({
                    useFactory: () => ({ name: 'test-server', version: '1.0.0' }),
                }),
            ],
            providers: [
                {
                    provide: DISCOVERY_CONSUMER,
                    useFactory: (discovery: McpDiscoveryService) => discovery,
                    inject: [McpDiscoveryService],
                },
            ],
        }).compile();

        // act
        const discovery = moduleRef.get<McpDiscoveryService>(DISCOVERY_CONSUMER);

        // assert
        expect(discovery).toBeInstanceOf(McpDiscoveryService);
    });

    it('should discover handlers before the MCP server initializes through Nest lifecycle hooks', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [McpModule.register({ name: 'test-server', version: '1.0.0' })],
            providers: [LifecycleTool],
        }).compile();

        // act
        await moduleRef.init();

        // assert
        expect(moduleRef.get(McpRegistryService).tools.has('lifecycle-tool')).toBe(true);
        expect(moduleRef.get(McpServerService).server).toBeDefined();

        await moduleRef.close();
    });

    // #endregion
});
