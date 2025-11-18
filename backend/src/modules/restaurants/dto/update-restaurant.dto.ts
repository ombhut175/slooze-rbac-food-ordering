import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for updating an existing restaurant
 * Only accessible by ADMIN users
 * All fields are optional
 */
export class UpdateRestaurantDto {
  @ApiProperty({
    description: 'Restaurant name',
    example: 'Spice Paradise',
    required: false,
  })
  @IsString({ message: 'Restaurant name must be a string' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Restaurant country',
    enum: ['IN', 'US'],
    example: 'IN',
    required: false,
  })
  @IsEnum(['IN', 'US'], { message: 'Country must be either IN or US' })
  @IsOptional()
  country?: 'IN' | 'US';

  @ApiProperty({
    description: 'Restaurant status',
    enum: ['ACTIVE', 'INACTIVE'],
    example: 'ACTIVE',
    required: false,
  })
  @IsEnum(['ACTIVE', 'INACTIVE'], {
    message: 'Status must be either ACTIVE or INACTIVE',
  })
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE';
}
