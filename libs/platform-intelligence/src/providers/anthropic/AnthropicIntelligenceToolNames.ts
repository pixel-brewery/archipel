/**
 * Anthropic provider-defined tool names exposed through Archipel.
 *
 * @public
 */
export const AnthropicIntelligenceToolNames = {
    Advisor: 'advisor',
    Bash: 'bash',
    CodeExecution: 'code_execution',
    Computer: 'computer',
    Memory: 'memory',
    TextEditor: 'str_replace_editor',
    TextEditorBasedEdit: 'str_replace_based_edit_tool',
    ToolSearchBM25: 'tool_search_tool_bm25',
    ToolSearchRegex: 'tool_search_tool_regex',
    WebFetch: 'web_fetch',
    WebSearch: 'web_search',
} as const;
