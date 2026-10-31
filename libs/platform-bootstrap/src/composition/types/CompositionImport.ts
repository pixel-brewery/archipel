// #region Imports

import type { DynamicModule, ForwardReference, Type } from '@nestjs/common';

// #endregion

/**
 * Represents a valid NestJS module import that can be used during composition.
 *
 * This type mirrors the allowed import types in NestJS module metadata.
 *
 * @public
 */
export type CompositionImport = Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference<unknown>;
