// #region Imports

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

// #endregion

/**
 * Base class for quantity responses.
 *
 * @public
 */
export class QuantityResponse {
    @Expose()
    @IsString()
    @ApiProperty({
        description: 'Unit of the quantity (e.g. "kg", "m", "cm", "l", "pcs").',
        example: 'kg',
    })
    public unit!: string;
    @Expose()
    @IsNumber()
    @ApiProperty({
        description: 'Numeric value of the quantity.',
        example: 2.5,
    })
    public value!: number;
}
