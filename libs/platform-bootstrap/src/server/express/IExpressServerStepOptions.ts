import { OptionsJson, OptionsUrlencoded } from 'body-parser';
import { CompressionOptions } from 'compression';

/**
 * Options for the Express-compatible server bootstrap step.
 *
 * @public
 */
export interface IExpressServerStepOptions {
    /** JSON body parser options, or `false` to skip JSON body parsing. */
    readonly json?: boolean | OptionsJson;

    /** URL-encoded body parser options, or `false` to skip URL-encoded body parsing. */
    readonly urlEncoded?: boolean | OptionsUrlencoded;

    /** Compression middleware options, or `false` to skip compression. */
    readonly compression?: boolean | CompressionOptions;
}
