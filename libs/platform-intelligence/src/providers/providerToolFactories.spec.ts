// #region Imports

import type { ToolSet } from 'ai';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import type { IIntelligenceTool } from '../interfaces/IIntelligenceTool.js';
import { AnthropicIntelligenceToolNames } from './anthropic/AnthropicIntelligenceToolNames.js';
import { createAnthropicWebSearch20260209Tool } from './anthropic/tools/createAnthropicWebSearch20260209Tool.js';
import { GoogleIntelligenceToolNames } from './google/GoogleIntelligenceToolNames.js';
import { createGoogleGoogleSearchTool } from './google/tools/createGoogleGoogleSearchTool.js';
import { GrokIntelligenceToolNames } from './grok/GrokIntelligenceToolNames.js';
import { createGrokCodeExecutionTool } from './grok/tools/createGrokCodeExecutionTool.js';
import { createGrokFileSearchTool } from './grok/tools/createGrokFileSearchTool.js';
import { createGrokMcpServerTool } from './grok/tools/createGrokMcpServerTool.js';
import { createGrokViewImageTool } from './grok/tools/createGrokViewImageTool.js';
import { createGrokViewXVideoTool } from './grok/tools/createGrokViewXVideoTool.js';
import { createGrokWebSearchTool } from './grok/tools/createGrokWebSearchTool.js';
import { createGrokXSearchTool } from './grok/tools/createGrokXSearchTool.js';
import { createMimoCustomTool } from './mimo/tools/createMimoCustomTool.js';
import { OpenAIIntelligenceToolNames } from './openai/OpenAIIntelligenceToolNames.js';
import { createOpenAICodeInterpreterTool } from './openai/tools/createOpenAICodeInterpreterTool.js';
import { createOpenAICustomTool } from './openai/tools/createOpenAICustomTool.js';
import { createOpenAIFileSearchTool } from './openai/tools/createOpenAIFileSearchTool.js';
import { createOpenAIImageGenerationTool } from './openai/tools/createOpenAIImageGenerationTool.js';
import { createOpenAIToolSearchTool } from './openai/tools/createOpenAIToolSearchTool.js';
import { createOpenAIWebSearchTool } from './openai/tools/createOpenAIWebSearchTool.js';

// #endregion

describe('Provider Tool Factories', () => {
    // #region Methods

    it('should expose OpenAI web search as an intelligence tool', async () => {
        // act
        const result = await createOpenAIWebSearchTool({ searchContextSize: 'low' });

        // assert
        expect(result.name).toBe(OpenAIIntelligenceToolNames.WebSearch);
        expectProviderTool(result.tool, 'openai.web_search');
    });

    it('should expose OpenAI file search as an intelligence tool', async () => {
        // act
        const result = await createOpenAIFileSearchTool({ vectorStoreIds: ['vs_test'] });

        // assert
        expect(result.name).toBe(OpenAIIntelligenceToolNames.FileSearch);
        expectProviderTool(result.tool, 'openai.file_search');
    });

    it('should expose OpenAI code interpreter as an intelligence tool', async () => {
        // act
        const result = await createOpenAICodeInterpreterTool({ container: { fileIds: ['file_test'] } });

        // assert
        expect(result.name).toBe(OpenAIIntelligenceToolNames.CodeInterpreter);
        expectProviderTool(result.tool, 'openai.code_interpreter');
    });

    it('should expose OpenAI image generation as an intelligence tool', async () => {
        // act
        const result = await createOpenAIImageGenerationTool({ quality: 'medium', size: '1024x1024' });

        // assert
        expect(result.name).toBe(OpenAIIntelligenceToolNames.ImageGeneration);
        expectProviderTool(result.tool, 'openai.image_generation');
    });

    it('should expose OpenAI tool search as an intelligence tool', async () => {
        // act
        const result = await createOpenAIToolSearchTool();

        // assert
        expect(result.name).toBe(OpenAIIntelligenceToolNames.ToolSearch);
        expectProviderTool(result.tool, 'openai.tool_search');
    });

    it('should expose OpenAI custom tools with the configured registry name', async () => {
        // act
        const result = await createOpenAICustomTool(
            {
                description: 'Creates a read-only reporting query.',
                format: {
                    type: 'grammar',
                    syntax: 'regex',
                    definition: 'SELECT .+',
                },
            },
            'report_query',
        );

        // assert
        expect(result.name).toBe('report_query');
        expectProviderTool(result.tool, 'openai.custom');
    });

    it('should expose Google search as an intelligence tool', async () => {
        // act
        const result = await createGoogleGoogleSearchTool({ searchTypes: { webSearch: {} } });

        // assert
        expect(result.name).toBe(GoogleIntelligenceToolNames.GoogleSearch);
        expectProviderTool(result.tool, 'google.google_search');
    });

    it('should expose Anthropic web search as an intelligence tool', async () => {
        // act
        const result = await createAnthropicWebSearch20260209Tool({ maxUses: 2 });

        // assert
        expect(result.name).toBe(AnthropicIntelligenceToolNames.WebSearch);
        expectProviderTool(result.tool, 'anthropic.web_search_20260209');
    });

    it('should expose Grok web search as an intelligence tool', async () => {
        // act
        const result = await createGrokWebSearchTool({ allowedDomains: ['x.ai'] });

        // assert
        expect(result.name).toBe(GrokIntelligenceToolNames.WebSearch);
        expectProviderTool(result.tool, 'xai.web_search');
    });

    it('should expose Grok X search as an intelligence tool', async () => {
        // act
        const result = await createGrokXSearchTool({ allowedXHandles: ['xai'] });

        // assert
        expect(result.name).toBe(GrokIntelligenceToolNames.XSearch);
        expectProviderTool(result.tool, 'xai.x_search');
    });

    it('should expose Grok code execution as an intelligence tool', async () => {
        // act
        const result = await createGrokCodeExecutionTool();

        // assert
        expect(result.name).toBe(GrokIntelligenceToolNames.CodeExecution);
        expectProviderTool(result.tool, 'xai.code_execution');
    });

    it('should expose Grok file search as an intelligence tool', async () => {
        // act
        const result = await createGrokFileSearchTool({ vectorStoreIds: ['vs_test'] });

        // assert
        expect(result.name).toBe(GrokIntelligenceToolNames.FileSearch);
        expectProviderTool(result.tool, 'xai.file_search');
    });

    it('should expose Grok MCP as an intelligence tool', async () => {
        // act
        const result = await createGrokMcpServerTool({ serverUrl: 'https://example.com/mcp' });

        // assert
        expect(result.name).toBe(GrokIntelligenceToolNames.Mcp);
        expectProviderTool(result.tool, 'xai.mcp');
    });

    it('should expose Grok image understanding as an intelligence tool', async () => {
        // act
        const result = await createGrokViewImageTool();

        // assert
        expect(result.name).toBe(GrokIntelligenceToolNames.ViewImage);
        expectProviderTool(result.tool, 'xai.view_image');
    });

    it('should expose Grok X video understanding as an intelligence tool', async () => {
        // act
        const result = await createGrokViewXVideoTool();

        // assert
        expect(result.name).toBe(GrokIntelligenceToolNames.ViewXVideo);
        expectProviderTool(result.tool, 'xai.view_x_video');
    });

    it('should expose MiMo custom function tools with the configured registry name', async () => {
        // act
        const result = await createMimoCustomTool(
            {
                description: 'Creates a MiMo function tool registration.',
                inputSchema: z.object({}),
                execute: async () => ({ ok: true }),
            },
            'mimo_function',
        );

        // assert
        expect(result.name).toBe('mimo_function');
        expect(result.tool).toHaveProperty('description', 'Creates a MiMo function tool registration.');
    });

    function expectProviderTool(tool: IIntelligenceTool['tool'], id: `${string}.${string}`): void {
        const nativeTool = unwrapProviderTool(tool);
        expect(nativeTool.type).toBe('provider');

        if (nativeTool.type !== 'provider') {
            throw new Error('Expected provider-defined tool.');
        }

        expect(nativeTool.id).toBe(id);
    }

    function unwrapProviderTool(tool: IIntelligenceTool['tool']): ToolSet[string] {
        if (!('nativeDefinition' in tool)) {
            throw new Error('Expected an opaque provider-owned tool definition.');
        }

        return tool.nativeDefinition as ToolSet[string];
    }

    // #endregion
});
