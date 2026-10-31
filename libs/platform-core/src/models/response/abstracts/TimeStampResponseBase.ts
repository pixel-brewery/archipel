import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

/**
 * The base class for all time stamp responses.
 *
 * @public
 * @abstract
 */
export abstract class TimeStampResponseBase {
    // #region Fields

    @Expose()
    @IsString()
    @ApiProperty({
        description: 'The created at date',
        type: String,
    })
    public createdAt!: Date;

    @Expose()
    @IsString()
    @ApiProperty({
        description: 'The updated at date',
        type: String,
    })
    public updatedAt!: Date;

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
