// #region Imports

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// #endregion

/**
 * Request DTO for a single localized text entry.
 *
 * @public
 */
export class LocalizedTextRequest {
    @Expose()
    @IsString()
    @MaxLength(20) // e.g. "de", "en-US", "zh-Hant", "pt-BR"
    @Matches(/^[a-z]{2,3}(?:-[A-Z][a-z]{3})?(?:-[A-Z]{2})?$/, {
        message: 'locale must match pattern: ll, ll-SSSS, or ll-CC (e.g., "de", "zh-Hant", "en-US")',
    })
    @ApiProperty({
        description: 'Locale code (normalized, e.g. "de", "en-US").',
        example: 'de',
    })
    public locale!: string;
    @Expose()
    @IsString()
    @MinLength(1)
    @MaxLength(2048) // generic cap; field-specific limits (e.g. 120 for title) can be enforced in the service
    @ApiProperty({ description: 'Text value for the given locale.' })
    public value!: string;
}
