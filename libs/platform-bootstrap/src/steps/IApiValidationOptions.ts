/**
 * Validation options used by the generic Archipel API bootstrap step.
 *
 * @public
 */
export interface IApiValidationOptions {
    /** Whether properties without validation decorators are stripped. */
    readonly whitelist?: boolean;

    /** Whether stripped properties should produce validation errors. */
    readonly forbidNonWhitelisted?: boolean;

    /** Whether payloads should be transformed into DTO class instances. */
    readonly transform?: boolean;

    /** Whether class-transformer should enable implicit primitive conversion. */
    readonly enableImplicitConversion?: boolean;
}
