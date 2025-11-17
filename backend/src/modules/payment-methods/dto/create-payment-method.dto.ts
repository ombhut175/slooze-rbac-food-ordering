import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new payment method
 * Only ADMIN users can create payment methods
 */
export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Display label for the payment method',
    example: 'Primary Card',
  })
  @IsString({ message: 'Label must be a string' })
  @IsNotEmpty({ message: 'Label is required' })
  label!: string;

  @ApiPropertyOptional({
    description: 'Card brand (auto-generated as MOCK for new methods)',
    example: 'MOCK',
  })
  @IsString({ message: 'Brand must be a string' })
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Last 4 digits of card (auto-generated if not provided)',
    example: '4242',
    minLength: 4,
    maxLength: 4,
  })
  @IsString({ message: 'Last4 must be a string' })
  @Length(4, 4, { message: 'Last4 must be exactly 4 characters' })
  @IsOptional()
  last4?: string;

  @ApiPropertyOptional({
    description: 'Card expiration month',
    example: 12,
    minimum: 1,
    maximum: 12,
  })
  @IsInt({ message: 'Expiration month must be an integer' })
  @Min(1, { message: 'Expiration month must be at least 1' })
  @Max(12, { message: 'Expiration month must be at most 12' })
  @IsOptional()
  expMonth?: number;

  @ApiPropertyOptional({
    description: 'Card expiration year',
    example: 2025,
    minimum: 2024,
  })
  @IsInt({ message: 'Expiration year must be an integer' })
  @Min(2024, { message: 'Expiration year must be at least 2024' })
  @IsOptional()
  expYear?: number;

  @ApiPropertyOptional({
    description: 'Country code for the payment method',
    example: 'IN',
    enum: ['IN', 'US'],
  })
  @IsEnum(['IN', 'US'], { message: 'Country must be either IN or US' })
  @IsOptional()
  country?: 'IN' | 'US';

  @ApiPropertyOptional({
    description: 'Whether this should be the default payment method',
    example: false,
    default: false,
  })
  @IsBoolean({ message: 'isDefault must be a boolean' })
  @IsOptional()
  isDefault?: boolean;
}
