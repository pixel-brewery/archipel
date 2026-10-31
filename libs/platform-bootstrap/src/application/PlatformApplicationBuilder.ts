import { APP_PORT } from '@pixel-brewery/archipel-platform-core';
import type { DynamicModule, INestApplication, Type } from '@nestjs/common';
import { Module } from '@nestjs/common';
import type { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { ICompositionContext } from '../composition/context/ICompositionContext.js';
import { createCompositionContext } from '../composition/factory/createCompositionContext.js';
import type { CompositionImport } from '../composition/types/CompositionImport.js';
import { PlatformBootstrapContext } from '../context/PlatformBootstrapContext.js';
import { PORT } from '../env.js';
import { PlatformBootstrapError } from '../errors/PlatformBootstrapError.js';
import { IPlatformApplicationOptions } from '../options/IPlatformApplicationOptions.js';
import { IPlatformListenOptions } from '../options/IPlatformListenOptions.js';
import { PlatformBootstrapNext } from '../types/PlatformBootstrapNext.js';
import { PlatformBootstrapStep } from '../types/PlatformBootstrapStep.js';

/**
 * Options for creating a composed application.
 *
 * @public
 */
export interface ICreateWithCompositionOptions<TApplication extends INestApplication = INestApplication> {
    /**
     * Custom composition module that provides the composition services.
     *
     * If not provided, the default {@link CompositionModule} is used.
     *
     * @public
     */
    readonly compositionModule?: Type<unknown>;

    /**
     * Whether to enable logging for the composition context.
     *
     * Defaults to `false`.
     *
     * @public
     */
    readonly enableCompositionLogging?: boolean;

    /**
     * NestJS application options passed to `NestFactory.create()`.
     *
     * @public
     */
    readonly nestOptions?: NestApplicationOptions;

    /**
     * Platform application options for the builder.
     *
     * @public
     */
    readonly platformOptions?: IPlatformApplicationOptions;

    /**
     * Custom HTTP adapter to use.
     *
     * @example
     * ```typescript
     * import { ExpressAdapter } from '@nestjs/platform-express';
     *
     * const builder = await PlatformApplicationBuilder.createWithComposition({
     *     adapter: new ExpressAdapter(),
     *     // ...
     * });
     * ```
     *
     * @public
     */
    readonly adapter?: unknown;

    /**
     * Factory function that creates the application type.
     *
     * If provided, this takes precedence over the default `NestFactory.create()` call.
     * Use this for custom application types or adapters.
     *
     * @example
     * ```typescript
     * const builder = await PlatformApplicationBuilder.createWithComposition({
     *     appFactory: (module) => NestFactory.create<NestExpressApplication>(
     *         module,
     *         new ExpressAdapter()
     *     ),
     *     // ...
     * });
     * ```
     *
     * @public
     */
    readonly appFactory?: (composedModule: DynamicModule) => Promise<TApplication>;
}

/**
 * Fluent builder that composes NestJS bootstrap steps and executes them once.
 *
 * @public
 */
export class PlatformApplicationBuilder<TApplication extends INestApplication = INestApplication> {
    // #region Fields

    private readonly _app: TApplication;
    private readonly _options: IPlatformApplicationOptions;
    private readonly _steps: Array<PlatformBootstrapStep<TApplication>>;
    private _executionPromise: Promise<PlatformBootstrapContext<TApplication>> | null;

    // #endregion

    // #region Ctor

    public constructor(app: TApplication, options?: IPlatformApplicationOptions) {
        this._app = app;
        this._options = options ?? {};
        this._steps = [];
        this._executionPromise = null;
    }

    /**
     * Creates a new application builder using composition-based module assembly.
     *
     * This factory bootstraps a lightweight composition context to read configuration
     * values, then invokes the provided composer function to determine which modules
     * to import. The resulting modules are assembled into a dynamic root module
     * and a NestJS application is created from it.
     *
     * The composition context is automatically closed after the composer function completes.
     *
     * @typeParam TApp - The NestJS application type. Defaults to {@link INestApplication}.
     * @param composer - A function that receives the composition context and returns an array of modules to import.
     * @param options - Options for creating the composed application.
     * @returns A promise that resolves to a configured {@link PlatformApplicationBuilder}.
     *
     * @example
     * ```typescript
     * import { PlatformApplicationBuilder } from '@pixel-brewery/archipel-platform-bootstrap';
     * import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
     *
     * const builder = await PlatformApplicationBuilder.createWithComposition<NestExpressApplication>(
     *     async (context) => {
     *         const imports: CompositionImport[] = [AppModule];
     *
     *         const driver = context.tryGetConfigValue({ key: 'MAIL_DRIVER' }, 'log');
     *         if (driver === 'smtp') {
     *             const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
     *             const { SmtpDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/smtp');
     *             imports.push(MailModule.register({ deliveryStrategy: SmtpDeliveryStrategy }));
     *         }
     *
     *         return imports;
     *     },
     *     {
     *         appFactory: (module) => NestFactory.create<NestExpressApplication>(module, new ExpressAdapter()),
     *     }
     * );
     *
     * await builder
     *     .use(useApi({ prefix: 'api' }))
     *     .listenFromConfig({ fallbackPort: 3000 });
     * ```
     *
     * @public
     */
    public static async createWithComposition<TApp extends INestApplication = INestApplication>(
        composer: (context: ICompositionContext) => Promise<Array<CompositionImport>> | Array<CompositionImport>,
        options?: ICreateWithCompositionOptions<TApp>,
    ): Promise<PlatformApplicationBuilder<TApp>> {
        const compositionContext = await createCompositionContext({
            module: options?.compositionModule,
            enableLogging: options?.enableCompositionLogging,
        });

        try {
            const imports = await composer(compositionContext);
            const composedModule = this.createComposedModule(imports);

            const app = options?.appFactory
                ? await options.appFactory(composedModule)
                : ((await NestFactory.create(composedModule, options?.nestOptions)) as TApp);

            return new PlatformApplicationBuilder<TApp>(app, options?.platformOptions);
        } finally {
            await compositionContext.close();
        }
    }

    private static createComposedModule(imports: Array<CompositionImport>): DynamicModule {
        @Module({})
        class ComposedRootModule {}

        return {
            module: ComposedRootModule,
            imports,
        };
    }

    // #endregion

    // #region Properties

    /**
     * The wrapped NestJS application.
     *
     * @public
     */
    public get app(): TApplication {
        return this._app;
    }

    // #endregion

    // #region Methods

    /**
     * Adds a bootstrap step to the application pipeline.
     *
     * @public
     * @param step - The step to execute during bootstrap.
     * @returns The current builder for chaining.
     */
    public use(step: PlatformBootstrapStep<TApplication>): this {
        this._steps.push(step);
        return this;
    }

    /**
     * Executes the configured bootstrap pipeline and initializes the NestJS application.
     *
     * @public
     * @returns The wrapped NestJS application.
     */
    public async initialize(): Promise<TApplication> {
        await this.run();
        await this._app.init();
        return this._app;
    }

    /**
     * Executes the configured bootstrap pipeline without starting a listener.
     *
     * @public
     * @returns The bootstrap context used for the execution.
     */
    public async run(): Promise<PlatformBootstrapContext<TApplication>> {
        return this.executeOnce();
    }

    /**
     * Executes the pipeline and starts the NestJS listener on the given port.
     *
     * @public
     * @param port - The HTTP port.
     * @param hostname - Optional hostname/interface binding.
     * @returns The wrapped NestJS application.
     */
    public async listen(port: number, hostname?: string): Promise<TApplication> {
        await this.run();

        if (hostname) {
            await this._app.listen(port, hostname);
            return this._app;
        }

        await this._app.listen(port);
        return this._app;
    }

    /**
     * Executes the pipeline and starts the listener using typed configuration keys.
     *
     * @public
     * @param options - Port resolution options.
     * @returns The wrapped NestJS application.
     */
    public async listenFromConfig(options?: IPlatformListenOptions): Promise<TApplication> {
        const context = await this.run();
        const port = this.resolvePort(context, options);

        if (options?.hostname) {
            await this._app.listen(port, options.hostname);
            return this._app;
        }

        await this._app.listen(port);
        return this._app;
    }

    private executeOnce(): Promise<PlatformBootstrapContext<TApplication>> {
        this._executionPromise ??= this.execute();
        return this._executionPromise;
    }

    private async execute(): Promise<PlatformBootstrapContext<TApplication>> {
        const context = new PlatformBootstrapContext<TApplication>(this._app, this._options.configService);
        await this.dispatchStep(context, 0);
        return context;
    }

    private async dispatchStep(context: PlatformBootstrapContext<TApplication>, index: number): Promise<void> {
        const step = this._steps[index];

        if (!step) {
            return;
        }

        const stepName = this.resolveStepName(step, index);
        let nextCalled = false;

        const next: PlatformBootstrapNext = async (): Promise<void> => {
            if (nextCalled) {
                throw new PlatformBootstrapError(`Bootstrap step "${stepName}" called next() more than once.`, {
                    stepIndex: index,
                    stepName,
                });
            }

            nextCalled = true;
            await this.dispatchStep(context, index + 1);
        };

        try {
            await step(context, next);
        } catch (error: unknown) {
            if (error instanceof PlatformBootstrapError) {
                throw error;
            }

            throw PlatformBootstrapError.wrap(error, stepName, index);
        }
    }

    private resolvePort(context: PlatformBootstrapContext<TApplication>, options?: IPlatformListenOptions): number {
        const keys = options?.portConfigKeys ?? [PORT, APP_PORT];
        const fallbackPort = options?.fallbackPort ?? 3000;

        for (const key of keys) {
            const value = context.tryGetConfigValue<string | number | undefined>(key, undefined);

            if (value !== undefined && value !== null && value !== '') {
                return this.parsePort(value, key.key);
            }
        }

        return fallbackPort;
    }

    private parsePort(value: string | number, key: string): number {
        const port = typeof value === 'number' ? value : Number(value);

        if (!Number.isInteger(port) || port < 1 || port > 65535) {
            throw new PlatformBootstrapError(`Config key "${key}" must resolve to a valid TCP port.`);
        }

        return port;
    }

    private resolveStepName(step: PlatformBootstrapStep<TApplication>, index: number): string {
        return step.name || `bootstrap-step-${index + 1}`;
    }

    // #endregion
}
