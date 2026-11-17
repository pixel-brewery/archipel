/**
 * OpenAI provider-defined tool names exposed through Archipel.
 *
 * @public
 */
export const OpenAIIntelligenceToolNames = {
    ApplyPatch: 'apply_patch',
    CodeInterpreter: 'code_interpreter',
    Computer: 'computer',
    FileSearch: 'file_search',
    ImageGeneration: 'image_generation',
    LocalShell: 'local_shell',
    Mcp: 'mcp',
    ProgrammaticToolCalling: 'programmatic_tool_calling',
    Shell: 'shell',
    ToolSearch: 'tool_search',
    WebSearch: 'web_search',
    /** @deprecated The AI SDK deprecates the preview tool; use `WebSearch`. */
    WebSearchPreview: 'web_search_preview',
} as const;
