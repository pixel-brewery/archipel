// #region Imports

import { OpenAPIObject } from '@nestjs/swagger';
import { IFeatureSwaggerConfig } from '../registry/IFeatureSwaggerConfig.js';

// #endregion

// #region Interfaces

/** One generated feature document together with its registered feature metadata. */
export interface IOpenApiFeatureDocument {
    readonly feature: IFeatureSwaggerConfig;
    readonly document: OpenAPIObject;
}

// #endregion
