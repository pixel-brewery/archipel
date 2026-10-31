import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * Base class describing pagination metadata returned alongside list payloads.
 *
 * @public
 * @abstract
 */
export abstract class PageableResponseBase {
    // #region Fields

    @Expose()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @ApiProperty({
        description: 'Total number of records matching the supplied filters.',
    })
    public total!: number;

    @Expose()
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiPropertyOptional({
        description: 'Number of records skipped before this page.',
    })
    public skip?: number;

    @Expose()
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @ApiPropertyOptional({
        description: 'Requested page size.',
    })
    public take?: number;

    @Expose()
    @Type(() => Object)
    @ApiProperty({
        description: 'The items in the current page.',
        type: 'array',
        items: { type: 'object' },
    })
    public abstract items: Array<unknown>;

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
