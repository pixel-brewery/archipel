// #region Imports

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

// #endregion

/**
 * Base class for localized text responses.
 *
 * @public
 */
export class LocalizedTextResponse {
    @Expose()
    @IsString()
    @ApiProperty({
        description: 'Resolved text for the chosen locale.',
    })
    public value!: string;
    @Expose()
    @IsString()
    @ApiProperty({
        description: 'Locale used for the resolved text (already chosen in the service).',
        example: 'de',
    })
    public locale!: string;
}
