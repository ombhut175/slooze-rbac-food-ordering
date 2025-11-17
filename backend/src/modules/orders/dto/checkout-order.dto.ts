import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for checking out an order
 * Requires a valid payment method ID
 */
export class CheckoutOrderDto {
  @ApiProperty({
    description: 'Payment method ID to use for checkout',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Payment method ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Payment method ID is required' })
  paymentMethodId!: string;
}
