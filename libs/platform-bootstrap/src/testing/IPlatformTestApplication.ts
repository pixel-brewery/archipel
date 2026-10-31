import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Type } from '@nestjs/common';

/**
 * In-memory application contract used by platform bootstrap tests.
 *
 * @public
 */
export interface IPlatformTestApplication {
    /** Registered middleware and pipes/filters in execution order. */
    readonly calls: ReadonlyArray<string>;

    /** Config service used by the test application. */
    readonly configService: ConfigService;

    /** Enables CORS on the test application. */
    enableCors(...args: ReadonlyArray<unknown>): void;

    /** Resolves a provider from the test application. */
    get<TResult = unknown>(token: Type<unknown> | string | symbol, ...args: ReadonlyArray<unknown>): TResult;

    /** Initializes the test application. */
    init(): Promise<void>;

    /** Starts the test application listener. */
    listen(...args: ReadonlyArray<unknown>): Promise<void>;

    /** Sets the global test route prefix. */
    setGlobalPrefix(prefix: string): void;

    /** Registers middleware on the test application. */
    use(...args: ReadonlyArray<unknown>): void;

    /** Registers global filters on the test application. */
    useGlobalFilters(...args: ReadonlyArray<unknown>): void;

    /** Registers global interceptors on the test application. */
    useGlobalInterceptors(...args: ReadonlyArray<unknown>): void;

    /** Registers global pipes on the test application. */
    useGlobalPipes(...args: ReadonlyArray<unknown>): void;
}
