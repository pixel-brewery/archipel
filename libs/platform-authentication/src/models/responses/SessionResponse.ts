// #region Imports

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

// #endregion

/**
 * The `SessionResponse` class.
 *
 * @public
 */
export class SessionResponse {
    // #region Properties

    @Expose()
    @IsString()
    @ApiProperty({
        description: 'Unique session identifier',
        type: String,
        example: '507f1f77bcf86cd799439011',
    })
    public id!: string;
    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Device type',
        type: String,
        example: 'desktop',
        nullable: true,
    })
    public deviceType!: string | null;
    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Human-readable device name',
        type: String,
        example: 'macOS Chrome',
        nullable: true,
    })
    public deviceName!: string | null;
    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Browser name',
        type: String,
        example: 'Chrome',
        nullable: true,
    })
    public browserName!: string | null;
    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Browser version',
        type: String,
        example: '120.0.0',
        nullable: true,
    })
    public browserVersion!: string | null;
    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Operating system name',
        type: String,
        example: 'macOS',
        nullable: true,
    })
    public osName!: string | null;
    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Operating system version',
        type: String,
        example: '14.0',
        nullable: true,
    })
    public osVersion!: string | null;
    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Geographic location',
        type: String,
        example: 'Berlin Germany',
        nullable: true,
    })
    public location!: string | null;
    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Client application name',
        type: String,
        example: 'My Awesome App',
        nullable: true,
    })
    public clientName!: string | null;
    @Expose()
    @IsString()
    @ApiProperty({
        description: 'IP address',
        type: String,
        example: '192.168.1.1',
    })
    public ipAddress!: string;
    @Expose()
    @IsDate()
    @ApiProperty({
        description: 'Last activity timestamp',
        type: Date,
        example: '2025-11-05T10:30:00Z',
    })
    public lastActive!: Date;
    @Expose()
    @IsDate()
    @ApiProperty({
        description: 'Session creation timestamp',
        type: Date,
        example: '2025-11-01T08:00:00Z',
    })
    public createdAt!: Date;
    @Expose()
    @IsBoolean()
    @ApiProperty({
        description: 'Indicates if this is the current active session',
        type: Boolean,
        example: true,
    })
    public isCurrent!: boolean;

    // #endregion
}
