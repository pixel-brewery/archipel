import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { ContentTemplateEngine, HostService } from '@pixel-brewery/archipel-platform-core';
import { SwaggerFeatureDiscovery } from '@pixel-brewery/archipel-platform-openapi';
import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { INestApplication } from '@nestjs/common';
import { PlatformBootstrapStep } from '../types/PlatformBootstrapStep.js';
import { IOpenApiStepOptions } from './IOpenApiStepOptions.js';

/**
 * Creates the Archipel OpenAPI multi-document bootstrap step.
 *
 * @public
 * @param options - OpenAPI bootstrap options.
 * @returns A platform bootstrap step.
 */
export function useOpenApi<TApplication extends INestApplication = INestApplication>(options?: IOpenApiStepOptions): PlatformBootstrapStep<TApplication> {
    return async function openApiStep(context, next): Promise<void> {
        const resolvedOptions = options ?? {};

        if (resolvedOptions.enabled !== false) {
            await SwaggerFeatureDiscovery.setupMultiDocumentSwagger(
                context.app,
                context.getService(ConfigService),
                context.getService(HostService),
                context.getService(ResourceManager),
                context.getService(ContentTemplateEngine),
                resolvedOptions.theme,
            );
        }

        await next();
    };
}
