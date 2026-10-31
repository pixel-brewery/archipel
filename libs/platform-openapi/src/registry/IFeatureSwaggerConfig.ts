// #region Imports

import type { Type } from '@nestjs/common';

// #endregion

export interface IFeatureSwaggerConfig {
    readonly name: string;
    readonly title: string;
    readonly description: string;
    readonly tag: string;
    readonly tags: Array<string>;
    /** Root models retained with their recursive references in this feature document. */
    readonly extraModels?: ReadonlyArray<Type<unknown>>;
    /** Root models emitted as closed contracts with portable validation constraints synchronized. */
    readonly strictModels?: ReadonlyArray<Type<unknown>>;
    readonly path: string;
}
