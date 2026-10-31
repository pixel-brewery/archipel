// #region Imports

import { SetMetadata } from '@nestjs/common';

// #endregion

/** Metadata key used to store the feature flag key on route handlers. */
export const FEATURE_FLAG_KEY_METADATA = 'feature_flag_key';

/**
 * Decorator to mark endpoints that require a specific feature flag to be enabled.
 * The guard reads this metadata to evaluate the flag before allowing access.
 *
 * @public
 * @param flagKey - The unique key of the feature flag to check.
 */
export const FeatureFlag = (flagKey: string): ReturnType<typeof SetMetadata> => SetMetadata(FEATURE_FLAG_KEY_METADATA, flagKey);
