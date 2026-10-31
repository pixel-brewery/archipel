/**
 * Identifies the observable execution phases of an agent loop.
 *
 * @public
 */
export type AgentLoopState = 'message_received' | 'inference' | 'inference_streaming' | 'function_call' | 'model_message' | 'idle';
