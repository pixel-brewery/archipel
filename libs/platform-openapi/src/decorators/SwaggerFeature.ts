// #region Imports

import type { Type } from '@nestjs/common';

// #endregion

// #region Constants

/**
 * Metadata key used by `Reflect.defineMetadata` to attach {@link ISwaggerFeatureMetadata}
 * to a NestJS module class decorated with {@link SwaggerFeature}.
 *
 * @public
 */
export const SWAGGER_FEATURE_METADATA_KEY = 'swagger:feature';

/**
 * Property name on `globalThis` that holds the singleton feature store.
 * The store is defined as non-writable and non-configurable to prevent
 * accidental overwrites at runtime.
 */
const GLOBAL_SWAGGER_FEATURE_STORE_KEY = '__ARCHIPEL_SWAGGER_FEATURES__' as const;

// #endregion

// #region Types

/** Literal type of the global store property key. */
type SwaggerFeatureStoreKey = typeof GLOBAL_SWAGGER_FEATURE_STORE_KEY;

/**
 * Describes a single Swagger feature module that should be exposed as its own
 * OpenAPI document via the multi-document setup.
 *
 * @public
 */
export interface ISwaggerFeatureMetadata {
    /**
     * Unique machine-readable identifier for this feature (e.g. `'tip'`, `'user'`).
     * Used to deduplicate registrations and to derive the default {@link path}.
     */
    readonly name: string;

    /**
     * Human-readable title displayed in the Swagger UI header
     * (e.g. `'My App API - Tips'`).
     */
    readonly title: string;

    /** Short description shown below the title in Swagger UI. */
    readonly description: string;

    /**
     * Primary OpenAPI tag applied to every controller that belongs to this feature.
     * Controllers are grouped under this tag in the generated document.
     */
    readonly tag: string;

    /**
     * Additional OpenAPI tags to include in the generated document.
     * Useful when a feature module spans multiple controller groups.
     */
    readonly tags: Array<string>;

    /**
     * Model classes that belong to this feature's OpenAPI contract even when no
     * controller operation references them directly.
     *
     * Referenced child schemas are retained recursively in the feature document.
     */
    readonly extraModels?: ReadonlyArray<Type<unknown>>;

    /**
     * Root DTOs whose complete reachable object graph is emitted as a closed
     * contract and synchronized with portable `class-validator` constraints.
     *
     * Strict models are automatically included in the generated document; they
     * do not need to be repeated in {@link extraModels}.
     */
    readonly strictModels?: ReadonlyArray<Type<unknown>>;

    /**
     * URL path segment where the Swagger UI for this feature is served.
     * Defaults to `docs/{name}` when omitted.
     *
     * @example `'docs/tips'`
     */
    readonly path?: string;
}

/**
 * Internal wrapper stored in the global feature registry.
 * Keeps the door open for future per-feature runtime state
 * without changing the public metadata contract.
 */
interface IRegisteredSwaggerFeature {
    readonly metadata: ISwaggerFeatureMetadata;
}

/**
 * Shape of `globalThis` extended with the optional feature store property.
 * Used for type-safe access to the singleton registry.
 */
type ISwaggerFeatureStoreHolder = {
    readonly [key in SwaggerFeatureStoreKey]?: Array<IRegisteredSwaggerFeature>;
};

// #endregion

// #region Methods

/**
 * Returns the singleton feature store attached to `globalThis`.
 * On first call the store is created and frozen onto `globalThis` via
 * `Object.defineProperty` (non-writable, non-configurable) so that no
 * other code path can accidentally replace it.
 *
 * @returns The mutable array backing the global feature registry.
 */
function getOrCreateSwaggerFeatureStore(): Array<IRegisteredSwaggerFeature> {
    const globalHolder = globalThis as ISwaggerFeatureStoreHolder;
    const existingStore = globalHolder[GLOBAL_SWAGGER_FEATURE_STORE_KEY];

    if (existingStore) {
        return existingStore;
    }

    const newStore = new Array<IRegisteredSwaggerFeature>();

    Object.defineProperty(globalHolder, GLOBAL_SWAGGER_FEATURE_STORE_KEY, {
        value: newStore,
        writable: false,
        enumerable: false,
        configurable: false,
    });

    return newStore;
}

/**
 * Appends a feature to the global store if no feature with the same
 * {@link ISwaggerFeatureMetadata.name | name} has been registered yet.
 * Duplicate names are silently skipped to support hot-reload / re-import scenarios.
 *
 * @param metadata - The fully resolved feature metadata to register.
 */
function registerSwaggerFeatureMetadata(metadata: ISwaggerFeatureMetadata): void {
    const store = getOrCreateSwaggerFeatureStore();
    const hasFeature = store.some((feature) => feature.metadata.name === metadata.name);

    if (hasFeature) {
        return;
    }

    store.push({ metadata });
}

// #endregion

/**
 * Class decorator that marks a NestJS module as a Swagger feature.
 *
 * When applied, the decorator:
 * 1. Attaches the resolved {@link ISwaggerFeatureMetadata} to the class via
 *    `Reflect.defineMetadata` (retrievable with {@link getSwaggerFeatureMetadata}).
 * 2. Registers the metadata in a process-global store so that
 *    {@link getRegisteredSwaggerFeatures} can discover all features at bootstrap
 *    without requiring an explicit import of every module.
 *
 * If {@link ISwaggerFeatureMetadata.path | path} is not provided, it defaults
 * to `docs/{name}`.
 *
 * @param metadata - Configuration describing the feature's OpenAPI document.
 * @returns A class decorator function.
 *
 * @example
 * ```typescript
 * @SwaggerFeature({
 *   name: 'tip',
 *   title: 'My App API - Tips',
 *   description: 'API endpoints for tip management',
 *   tag: 'Tip',
 *   tags: ['Tip'],
 *   strictModels: [TipDraftRequest],
 * })
 * @Module({
 *   controllers: [TipController],
 *   providers: [TipService],
 *   exports: [TipService],
 * })
 * export class TipModule {}
 * ```
 *
 * @public
 */
export function SwaggerFeature(metadata: ISwaggerFeatureMetadata) {
    return (target: new (...args: unknown[]) => object) => {
        const featureMetadata: ISwaggerFeatureMetadata = {
            ...metadata,
            path: metadata.path || `docs/${metadata.name}`,
        };

        Reflect.defineMetadata(SWAGGER_FEATURE_METADATA_KEY, featureMetadata, target);
        registerSwaggerFeatureMetadata(featureMetadata);

        return target;
    };
}

/**
 * Reads the {@link ISwaggerFeatureMetadata} previously attached to a module class
 * by the {@link SwaggerFeature} decorator.
 *
 * @param target - The module class to inspect.
 * @returns The feature metadata, or `undefined` if the class was not decorated.
 *
 * @public
 */
export function getSwaggerFeatureMetadata(target: new (...args: unknown[]) => object): ISwaggerFeatureMetadata | undefined {
    return Reflect.getMetadata(SWAGGER_FEATURE_METADATA_KEY, target);
}

/**
 * Returns all {@link ISwaggerFeatureMetadata} entries that have been registered
 * via the {@link SwaggerFeature} decorator, sorted alphabetically by
 * {@link ISwaggerFeatureMetadata.name | name}.
 *
 * Typically called once during application bootstrap to build the multi-document
 * Swagger setup.
 *
 * @returns A sorted array of feature metadata. Empty if no features were registered.
 *
 * @public
 */
export function getRegisteredSwaggerFeatures(): Array<ISwaggerFeatureMetadata> {
    const store = getOrCreateSwaggerFeatureStore();

    return store.map((feature) => feature.metadata).sort((left, right) => left.name.localeCompare(right.name));
}

// #endregion
