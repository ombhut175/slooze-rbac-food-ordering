import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a new restaurant
 * Only accessible by ADMIN users
 */
export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Restaurant name',
    example: 'Spice Paradise',
  })
  @IsString({ message: 'Restaurant name must be a string' })
  @IsNotEmpty({ message: 'Restaurant name is required' })
  name!: string;

  @ApiProperty({
    description: 'Restaurant country',
    enum: ['IN', 'US'],
    example: 'IN',
  })
  @IsEnum(['IN', 'US'], { message: 'Country must be either IN or US' })
  country!: 'IN' | 'US';

  @ApiProperty({
    description: 'Restaurant status',
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
    required: false,
  })
  @IsEnum(['ACTIVE', 'INACTIVE'], {
    message: 'Status must be either ACTIVE or INACTIVE',
  })
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE';
}
