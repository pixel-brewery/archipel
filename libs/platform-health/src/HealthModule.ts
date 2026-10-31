// #region Imports

import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthOrchestrator } from './HealthOrchestrator.js';
import { IHealthIndicator } from './IHealthIndicator.js';

// #endregion

@Module({
    imports: [TerminusModule],
    providers: [HealthOrchestrator],
    exports: [HealthOrchestrator],
})
export class HealthModule {
    /**
     * Registers additional health indicators.
     *
     * @param indicators Array of indicator classes implementing IHealthIndicator
     */
    public static withIndicators(indicators: Array<Type<IHealthIndicator>>): DynamicModule {
        const indicatorProviders: Provider[] = indicators.map((x) => ({
            provide: x,
            useClass: x,
        }));

        return {
            module: HealthModule,
            imports: [TerminusModule],
            providers: [
                ...indicatorProviders,
                HealthOrchestrator,
                {
                    provide: 'HEALTH_INDICATOR_BOOTSTRAP',
                    useFactory: (orchestrator: HealthOrchestrator, ...instances: IHealthIndicator[]) => {
                        for (const indicator of instances) {
                            orchestrator.registerIndicator(indicator);
                        }
                        return true;
                    },
                    inject: [HealthOrchestrator, ...indicators],
                },
            ],
            exports: [HealthOrchestrator],
        };
    }
}
