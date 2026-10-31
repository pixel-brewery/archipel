/** Provider-neutral text and tool events, including tools executed by a client. @public */
export type IntelligenceLanguageStreamPart =
    | { readonly type: 'text-delta'; readonly text: string }
    | { readonly type: 'tool-call'; readonly toolCallId: string; readonly toolName: string; readonly input: unknown }
    | { readonly type: 'tool-result'; readonly toolCallId: string; readonly toolName: string; readonly output: unknown }
    | { readonly type: 'step'; readonly phase: 'start' | 'finish' }
    | { readonly type: 'error'; readonly error: unknown };
