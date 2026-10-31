import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * Base class describing pagination query parameters shared across endpoints.
 *
 * @public
 * @abstract
 */
export abstract class PageableRequestBase {
    // #region Fields

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @ApiPropertyOptional({
        description: 'Number of records to skip before starting to collect the result set.',
    })
    public skip?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiPropertyOptional({
        description: 'Maximum number of records to return.',
    })
    public take?: number;

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
