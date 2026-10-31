import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable, Optional } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { McpRegistryService } from '../services/McpRegistryService.js';

/**
 * Health indicator for the MCP server infrastructure.
 * Verifies that at least one tool, resource, or prompt handler is registered.
 *
 * @public
 */
@Injectable()
export class McpHealthIndicator implements IHealthIndicator {
    // #region Fields

    /** Key identifying server handler readiness in the combined health result. */
    public readonly key: string = 'mcp';

    private readonly _registry?: McpRegistryService;

    // #endregion

    // #region Ctor

    /**
     * Creates the local server readiness projection.
     *
     * @param registry - Optional server handler registry; absence reports disabled infrastructure.
     */
    public constructor(@Optional() registry?: McpRegistryService) {
        this._registry = registry;
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /**
     * Verifies that the MCP registry has at least one registered handler.
     * Returns disabled status when no registry is configured.
     *
     * @public
     * @returns The health indicator result.
     */
    public check(): HealthIndicatorResult<string> {
        if (!this._registry) {
            return {
                mcp: {
                    status: 'up',
                    disabled: true,
                },
            };
        }

        const toolCount = this._registry.tools.size;
        const resourceCount = this._registry.resources.size;
        const promptCount = this._registry.prompts.size;
        const totalHandlers = toolCount + resourceCount + promptCount;

        return {
            mcp: {
                status: totalHandlers > 0 ? 'up' : 'down',
                tools: toolCount,
                resources: resourceCount,
                prompts: promptCount,
            },
        };
    }

    // #endregion
}
