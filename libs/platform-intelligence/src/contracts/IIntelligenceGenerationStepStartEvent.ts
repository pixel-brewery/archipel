/**
 * Language generation step metadata.
 *
 * @public
 */
export interface IIntelligenceGenerationStepStartEvent {
    readonly callId: string;
    readonly provider: string;
    readonly modelId: string;
    readonly stepNumber: number;
}
