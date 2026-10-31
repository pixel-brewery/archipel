export interface ITelemetryFacade {
    runOperation<T>(name: string, fn: () => Promise<T> | T): Promise<T>;
    recordCacheEvent?(event: { cache: string; outcome: string; phase?: string }): void;
    recordClientMetric?(name: string, type: string, value: number, labels?: Record<string, string>): void;
}

export class NoopTelemetryFacade implements ITelemetryFacade {
    public async runOperation<T>(_: string, fn: () => Promise<T> | T): Promise<T> {
        return await fn();
    }
    public recordCacheEvent?(_: { cache: string; outcome: string; phase?: string }): void {
        /* noop */
    }
    public recordClientMetric?(_name: string, _type: string, _value: number, _labels?: Record<string, string>): void {
        /* noop */
    }
}
