// #region Imports

import type { IIntelligenceProviderConfiguration } from '../contracts/index.js';

// #endregion

/**
 * Creates the provider options object consumed by the AI SDK model factories.
 *
 * @public
 * @param configuration - The resolved provider configuration.
 * @returns The options record containing `apiKey` and optionally `baseURL`.
 */
export const createProviderOptions = (configuration: IIntelligenceProviderConfiguration): { readonly apiKey?: string; readonly baseURL?: string } => {
    const options: { apiKey?: string; baseURL?: string } = {};

    if (configuration.apiKey) {
        options.apiKey = configuration.apiKey;
    }

    if (configuration.baseUrl) {
        options.baseURL = configuration.baseUrl;
    }

    return options;
};
