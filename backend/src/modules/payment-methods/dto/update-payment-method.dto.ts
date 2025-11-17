import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for updating an existing payment method
 * Only ADMIN users can update payment methods
 */
export class UpdatePaymentMethodDto {
  @ApiPropertyOptional({
    description: 'Display label for the payment method',
    example: 'Updated Card Label',
  })
  @IsString({ message: 'Label must be a string' })
  @IsOptional()
  label?: string;

  @ApiPropertyOptional({
    description: 'Whether the payment method is active',
    example: true,
  })
  @IsBoolean({ message: 'Active must be a boolean' })
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this should be the default payment method',
    example: true,
  })
  @IsBoolean({ message: 'isDefault must be a boolean' })
  @IsOptional()
  isDefault?: boolean;
}
