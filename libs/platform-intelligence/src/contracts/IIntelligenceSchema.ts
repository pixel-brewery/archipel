/**
 * Provider-neutral schema accepted by prompts, structured outputs, and tools.
 *
 * Zod and other Standard Schema implementations satisfy the second union
 * member structurally. Plain JSON Schema values can be created with
 * {@link createIntelligenceJsonSchema}.
 *
 * @public
 */
export type IIntelligenceSchema<T> =
    | {
          readonly kind: 'json-schema';
          readonly jsonSchema: Readonly<Record<string, unknown>>;
          readonly validate?: (
              value: unknown,
          ) =>
              | { readonly success: true; readonly value: T }
              | { readonly success: false; readonly error: Error }
              | Promise<{ readonly success: true; readonly value: T } | { readonly success: false; readonly error: Error }>;
      }
    | {
          readonly '~standard': {
              readonly version: 1;
              readonly vendor: string;
              readonly validate: (
                  value: unknown,
              ) =>
                  | { readonly value: T; readonly issues?: undefined }
                  | { readonly issues: ReadonlyArray<unknown>; readonly value?: undefined }
                  | Promise<{ readonly value: T; readonly issues?: undefined } | { readonly issues: ReadonlyArray<unknown>; readonly value?: undefined }>;
          };
      };
