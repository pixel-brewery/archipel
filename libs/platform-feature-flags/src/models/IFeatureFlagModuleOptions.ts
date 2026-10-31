// #region Imports

import type { IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import type { Type } from '@nestjs/common';
import type { FeatureFlagReaderBase } from '../abstracts/FeatureFlagReaderBase.js';
import type { FeatureFlagWriterBase } from '../abstracts/FeatureFlagWriterBase.js';

// #endregion

/**
 * Configuration options for the {@link FeatureFlagModule}.
 *
 * @public
 */
export interface IFeatureFlagModuleOptions {
    /**
     * Concrete implementation of the {@link FeatureFlagReaderBase}.
     * For example, `AzureFeatureFlagReader` or `VercelFeatureFlagReader`.
     */
    readonly featureFlagReader: Type<FeatureFlagReaderBase>;

    /**
     * Optional concrete implementation of the {@link FeatureFlagWriterBase}.
     * For example, `AzureFeatureFlagWriter` or `VercelFeatureFlagWriter`.
     * When provided the module will also export the writer abstract base for CRUD operations.
     */
    readonly featureFlagWriter?: Type<FeatureFlagWriterBase>;

    /**
     * Provider-specific configuration entries to register with the config module.
     */
    readonly configEntries?: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;

    /**
     * When `true` the module is registered globally.
     */
    readonly isGlobal?: boolean;
}
