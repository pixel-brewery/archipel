// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { McpHealthIndicator } from './McpHealthIndicator.js';

// #endregion

// #region Tests

describe('McpHealthIndicator', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have key "mcp"', () => {
        // arrange
        const indicator = new McpHealthIndicator();

        // act / assert
        expect(indicator.key).toBe('mcp');
    });

    it('should return disabled status when no registry is configured', () => {
        // arrange
        const indicator = new McpHealthIndicator();

        // act
        const result = indicator.check();

        // assert
        expect(result).toEqual({ mcp: { status: 'up', disabled: true } });
    });

    it('should return up when handlers are registered', () => {
        // arrange
        const registry = {
            tools: new Map([['tool1', {}]]),
            resources: new Map([['res1', {}]]),
            prompts: new Map(),
        } as never;
        const indicator = new McpHealthIndicator(registry);

        // act
        const result = indicator.check();

        // assert
        expect(result.mcp.status).toBe('up');
        expect(result.mcp.tools).toBe(1);
        expect(result.mcp.resources).toBe(1);
        expect(result.mcp.prompts).toBe(0);
    });

    it('should return down when no handlers are registered', () => {
        // arrange
        const registry = {
            tools: new Map(),
            resources: new Map(),
            prompts: new Map(),
        } as never;
        const indicator = new McpHealthIndicator(registry);

        // act
        const result = indicator.check();

        // assert
        expect(result.mcp.status).toBe('down');
    });
});

// #endregion
