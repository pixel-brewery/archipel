/**
 * OpenAI provider-defined tool names exposed through Archipel.
 *
 * @public
 */
export const OpenAIIntelligenceToolNames = {
    ApplyPatch: 'apply_patch',
    CodeInterpreter: 'code_interpreter',
    FileSearch: 'file_search',
    ImageGeneration: 'image_generation',
    LocalShell: 'local_shell',
    Mcp: 'mcp',
    Shell: 'shell',
    ToolSearch: 'tool_search',
    WebSearch: 'web_search',
    WebSearchPreview: 'web_search_preview',
} as const;
